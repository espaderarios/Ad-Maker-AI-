import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

function runCommand(cmd, args, opts = {}) {
  return new Promise((resolve, reject) => {
    const proc = spawn(cmd, args, { stdio: 'inherit', shell: true, ...opts });
    proc.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${cmd} ${args.join(' ')} exited ${code}`));
    });
    proc.on('error', (err) => reject(err));
  });
}

/**
 * Attempt to render a Remotion composition using the Remotion CLI.
 * Falls through (throws) when Remotion isn't available or the render fails.
 * @param {{composition:string,outPath:string,props?:object,cwd?:string}} options
 */
export async function renderWithRemotion({ composition, outPath, props = {}, cwd } = {}) {
  // Default remotion project path (monorepo remotion package)
  const remotionRoot = cwd || path.join(process.cwd(), '..', 'remotion');

  if (!fs.existsSync(remotionRoot)) {
    throw new Error(`Remotion project not found at ${remotionRoot}`);
  }

  // Ensure output directory exists
  const outDir = path.dirname(outPath);
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  // Build the Remotion project first (produces a bundle remotion can render)
  try {
    await runCommand('npx', ['remotion', 'build', remotionRoot], { cwd: remotionRoot });
  } catch (err) {
    throw new Error(`Remotion build failed: ${err.message}`);
  }

  // After build, try to render the requested composition. We assume the build produces an entry that remotion can render.
  try {
    // Use the remotion CLI to render. The CLI accepts the project path and composition id.
    await runCommand('npx', ['remotion', 'render', remotionRoot, composition, outPath, '--props', JSON.stringify(props)], { cwd: remotionRoot });
    return outPath;
  } catch (err) {
    throw new Error(`Remotion render failed: ${err.message}`);
  }
}

