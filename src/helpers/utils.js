export function camelCaseToWord(str) {
  if (typeof str !== 'string') {
    return str
  }

  const result = str
    .replace(/([a-z])([A-Z][a-z])/g, '$1 $2')
    .replace(/([A-Z][a-z])([A-Z])/g, '$1 $2')
    .replace(/([a-z])([A-Z]+[a-z])/g, '$1 $2')
    .replace(/([A-Z]+)([A-Z][a-z][a-z])/g, '$1 $2')
    .replace(/([a-z]+)([A-Z0-9]+)/g, '$1 $2')
    .replace(/([A-Z]+)([A-Z][a-rt-z][a-z]*)/g, '$1 $2')
    .replace(/([0-9])([A-Z][a-z]+)/g, '$1 $2')
    .replace(/([A-Z]{2,})([0-9]{2,})/g, '$1 $2')
    .replace(/([0-9]{2,})([A-Z]{2,})/g, '$1 $2')
    .trim()

  return result.charAt(0).toUpperCase() + result.slice(1)
}

export function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}
