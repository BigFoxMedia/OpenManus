import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');
    const apiBaseUrl = env.VITE_API_BASE_URL || 'http://openmanus-api:8000';
    
    return {
        define: {
            'import.meta.env.VITE_API_BASE_URL': JSON.stringify(apiBaseUrl)
        },
        plugins: [react()],
        server: {
            port: 3000,
            host: '0.0.0.0',
            proxy: {
                '/run': apiBaseUrl,
                '/logs': apiBaseUrl
            },
        },
        preview: {
            port: 3000,
            host: '0.0.0.0'
        },
        build: {
            outDir: 'dist',
            emptyOutDir: true,
        }
    }
})
