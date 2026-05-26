export function secondsToFrames(seconds, fps = 30) {
  return Math.round(seconds * fps);
}
