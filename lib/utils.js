export function getBasePath() {
  return process.env.NODE_ENV === 'production' ? '/personal_website' : '';
}

export function getAssetPath(path) {
  return `${getBasePath()}${path}`;
}
