export const isValidUrl = (url: URL | string) => {
  try {
    return Boolean(new URL(url));
  } catch {
    return false;
  }
};
