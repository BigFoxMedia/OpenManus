import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');
    return {
        define: {
            'import.meta.env.VITE_API_BASE_URL': JSON.stringify(
                env.VITE_API_BASE_URL || 'http://openmanus-api:8000'
            )
        },
        plugins: [react()],
        server: {
            port: 3000,
            proxy: {
                '/run': env.VITE_API_BASE_URL || 'http://openmanus-api:8000',
                '/logs': env.VITE_API_BASE_URL || 'http://openmanus-api:8000'
            },
        },
        build: {
            outDir: 'dist',
            emptyOutDir: true,
        }
    }
})
