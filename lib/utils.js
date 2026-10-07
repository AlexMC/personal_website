export function getBasePath() {
  return '';
}

export function getAssetPath(path) {
  return `${getBasePath()}${path}`;
}

export function getImagePath(imagePath) {
  // If the image path already starts with a slash, use it as is
  if (imagePath.startsWith('/')) {
    return `${getBasePath()}${imagePath}`;
  }
  // Otherwise, add the /images/ prefix
  return `${getBasePath()}/images/${imagePath}`;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

// "2026-03-10" -> "10 Mar 2026". Parsed by hand rather than with Date/Intl so the
// server-rendered HTML and the hydrated client always agree, whatever the time zone.
export function formatDate(isoDate) {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(isoDate))
  if (!match) return isoDate
  const [, year, month, day] = match
  return `${Number(day)} ${MONTHS[Number(month) - 1]} ${year}`
}
