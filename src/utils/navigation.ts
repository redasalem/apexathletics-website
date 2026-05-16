export const getSafeRedirect = (redirect: string | null, fallback: string) => {
  if (!redirect || !redirect.startsWith('/') || redirect.startsWith('//')) {
    return fallback;
  }

  return redirect;
};
