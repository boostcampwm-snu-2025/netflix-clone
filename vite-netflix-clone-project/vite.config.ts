import { defineConfig } from "vite";

export default defineConfig({
	server: {
		port: 5173,
		proxy: {
			"/test": {
				target: "http://localhost:3000",
				changeOrigin: true,
			},
			"/api": {
				target: "http://localhost:3000",
				changeOrigin: true,
			},
		},
	},
});

//  FIXME: Proxy not working
