import { spawn } from 'child_process';
import { randomUUID } from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { ffmpegPath } from '../config/ffmpeg.js';
import { renderWithRemotion } from '../services/video/remotionRender.js';

function runFfmpeg(args, options = {}) {
  return new Promise((resolve, reject) => {
    const proc = spawn(ffmpegPath, args, options);
    let stderr = '';
    proc.stderr.on('data', (data) => {
      stderr += data.toString();
    });
    proc.on('close', (code) => {
      if (code === 0) resolve({ code, stderr });
      else reject(new Error(`ffmpeg exited ${code}: ${stderr}`));
    });
    proc.on('error', (err) => reject(err));
  });
}

export async function renderJob({ projectId, duration = 10, format = 'mp4', templateId = 'default' } = {}) {
  const id = `render-${Date.now()}-${randomUUID().slice(0, 6)}`;
  const __filename = fileURLToPath(import.meta.url);
  let __dirname = path.dirname(__filename);
  // Normalize Windows file URLs that may start with a leading slash
  if (process.platform === 'win32' && __dirname.match(/^\/+[A-Za-z]:/)) {
    __dirname = __dirname.replace(/^\/+/, '');
  }
  const outDir = path.join(__dirname, '..', 'temp', 'renders');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const filename = `${id}.${format.replace('.', '')}`;
  const outputPath = path.join(outDir, filename);

  // If a real Remotion template is requested, try to render it first.
  if (templateId && templateId !== 'default') {
    try {
      await renderWithRemotion({ composition: templateId, outPath: outputPath, props: { projectId }, cwd: path.join(__dirname, '..', '..', 'remotion') });
    } catch (remErr) {
      console.warn('Remotion render failed, falling back to ffmpeg placeholder:', remErr.message);
      // Create a simple solid color video using ffmpeg as a fallback
      const args = [
        '-y',
        '-f', 'lavfi',
        '-i', `color=c=black:s=1280x720:d=${Number(duration)}`,
        '-c:v', 'libx264',
        '-pix_fmt', 'yuv420p',
        outputPath,
      ];

      try {
        await runFfmpeg(args);
      } catch (err) {
        const msg = (err && err.message) || '';
        if (err && err.code === 'ENOENT' || /spawn ffmpeg ENOENT/i.test(msg) || /ENOENT/i.test(msg)) {
          console.warn('ffmpeg not found; creating placeholder render file. Install ffmpeg to enable real rendering.');
          try {
            fs.writeFileSync(outputPath, 'FFMPEG_NOT_INSTALLED_PLACEHOLDER');
          } catch (werr) {
            console.error('Failed to write placeholder render file:', werr);
            throw werr;
          }
        } else {
          throw err;
        }
      }
    }
  } else {
    // Create a simple solid color video using ffmpeg as a placeholder render
    const args = [
      '-y',
      '-f', 'lavfi',
      '-i', `color=c=black:s=1280x720:d=${Number(duration)}`,
      '-c:v', 'libx264',
      '-pix_fmt', 'yuv420p',
      outputPath,
    ];

    try {
      await runFfmpeg(args);
    } catch (err) {
      const msg = (err && err.message) || '';
      if (err && err.code === 'ENOENT' || /spawn ffmpeg ENOENT/i.test(msg) || /ENOENT/i.test(msg)) {
        console.warn('ffmpeg not found; creating placeholder render file. Install ffmpeg to enable real rendering.');
        try {
          fs.writeFileSync(outputPath, 'FFMPEG_NOT_INSTALLED_PLACEHOLDER');
        } catch (werr) {
          console.error('Failed to write placeholder render file:', werr);
          throw werr;
        }
      } else {
        throw err;
      }
    }
  }

  // Return metadata about completed render
  return {
    id,
    projectId,
    templateId,
    duration: Number(duration),
    format,
    status: 'completed',
    outputPath,
    outputUrl: `/temp/renders/${filename}`,
    createdAt: new Date(),
    completedAt: new Date(),
  };
}
