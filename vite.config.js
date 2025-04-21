// vite.config.js
export default {
  server: {
    proxy: {
      '/video': {
        target: 'http://192.168.108.3:8080', // IP Webcam URL
        changeOrigin: true,
        secure: false,  // Use false if you have an HTTP (non-HTTPS) stream
        rewrite: (path) => path.replace(/^\/video/, ''),
      },
    },
  },
};
