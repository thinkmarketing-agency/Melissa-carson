import { resolve } from 'node:path';

export default {
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        fullscreen: resolve(__dirname, 'fullscreen/index.html'),
      },
    },
  },
};
