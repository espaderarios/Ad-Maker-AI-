export function generateFileName(prefix = 'file') {
  return `${prefix}-${Date.now()}`;
}
