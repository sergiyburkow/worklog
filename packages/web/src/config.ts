export const config = {
  api: {
    host: import.meta.env.VITE_API_HOST || 'localhost',
    port: import.meta.env.VITE_API_PORT || 4096,
    protocol: import.meta.env.VITE_API_PROTOCOL || 'https',
    get baseUrl() {
      return '/api';
    }
  },
  web: {
    host: import.meta.env.VITE_WEB_HOST || 'localhost',
    port: import.meta.env.VITE_WEB_PORT || 3000,
    protocol: import.meta.env.VITE_WEB_PROTOCOL || 'https',
    get baseUrl() {
      return `${this.protocol}://${this.host}:${this.port}`;
    }
  }
}; 