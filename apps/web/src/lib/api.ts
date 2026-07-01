export const getApiBaseUrl = () => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL;

  if (baseUrl) {
    return baseUrl;
  }

  if (import.meta.env.DEV) {
    return 'http://localhost:3001';
  }

  throw new Error('Falta configurar VITE_API_BASE_URL para producción.');
};
