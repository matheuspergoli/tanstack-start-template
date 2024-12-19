import type { ReactNode } from "react"
import {
	createRootRouteWithContext,
	Outlet,
	ScrollRestoration
} from "@tanstack/react-router"

import type { QueryClient } from "@tanstack/react-query"
import { Meta, Scripts } from "@tanstack/start"

import css from "@/styles/globals.css?url"

export const Route = createRootRouteWithContext<{
	queryClient: QueryClient
}>()({
	component: RootComponent,
	head: () => ({
		meta: [
			{
				lang: "en"
			},
			{
				charSet: "utf-8"
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{
				title: "TanStack Start Template"
			}
		],
		links: [{ rel: "stylesheet", href: css }]
	})
})

function RootComponent() {
	return (
		<RootDocument>
			<Outlet />
		</RootDocument>
	)
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
	return (
		<html>
			<head>
				<Meta />
			</head>
			<body>
				{children}
				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
	)
}
