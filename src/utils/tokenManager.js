export const tokenManager = {
  set: (token) => localStorage.setItem('cc_token', token),
  get: () => localStorage.getItem('cc_token'),
  remove: () => localStorage.removeItem('cc_token'),
  exists: () => !!localStorage.getItem('cc_token'),
}