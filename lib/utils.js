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
