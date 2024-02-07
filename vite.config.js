import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import ViteSvgLoader from 'vite-svg-loader'

export default defineConfig({
    plugins: [
        vue(),
        ViteSvgLoader()
    ],
    publicPath: process.env.NODE_ENV === 'production' ? '/your-app-subpath/' : '/',
})
