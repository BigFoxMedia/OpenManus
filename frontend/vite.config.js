import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
	plugins: [react()],
	server: {
		port: 3000,
		proxy: {
			'/run': 'http://openmanus-api:8000',
			'/logs': 'http://openmanus-api:8000'
		},
	},
	build: {
		outDir: 'dist',
		emptyOutDir: true,
	}
})
