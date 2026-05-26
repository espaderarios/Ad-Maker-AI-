import fs from 'fs';
import path from 'path';

const candidatePaths = [
	process.env.FFMPEG_PATH,
	'C:/ProgramData/chocolatey/bin/ffmpeg.exe',
	'C:/ProgramData/chocolatey/lib/ffmpeg/tools/ffmpeg.exe',
	'ffmpeg',
].filter(Boolean);

export const ffmpegPath = candidatePaths.find((candidate) => {
	if (candidate === 'ffmpeg') {
		return true;
	}

	const normalized = path.normalize(candidate);
	return fs.existsSync(normalized);
}) || 'ffmpeg';
