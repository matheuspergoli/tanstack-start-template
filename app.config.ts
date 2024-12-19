import { defineConfig } from "@tanstack/start/config"
import tsconfigpaths from "vite-tsconfig-paths"

export default defineConfig({
	vite: {
		plugins: [tsconfigpaths()]
	},
	tsr: {
		quoteStyle: "double",
		autoCodeSplitting: true,
		routesDirectory: "./app/routes",
		generatedRouteTree: "./app/routeTree.gen.ts"
	}
})
