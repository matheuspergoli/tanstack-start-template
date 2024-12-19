import { createRouter as createTanStackRouter } from "@tanstack/react-router"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import SuperJSON from "superjson"

import { routeTree } from "./routeTree.gen"
import { DefaultCatchBoundary } from "./shared/components/default-catch-boundary"
import { DefaultNotFound } from "./shared/components/default-not-found"

export function createRouter() {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				staleTime: 30 * 1000
			},
			dehydrate: {
				serializeData: SuperJSON.serialize
			},
			hydrate: {
				deserializeData: SuperJSON.deserialize
			}
		}
	})

	const router = createTanStackRouter({
		routeTree,
		defaultPreload: "intent",
		defaultPreloadStaleTime: 0,
		context: { queryClient },
		defaultNotFoundComponent: () => <DefaultNotFound />,
		defaultErrorComponent: (error) => <DefaultCatchBoundary {...error} />,
		defaultPendingComponent: () => <p className="p-2 text-2xl">Loading...</p>,
		Wrap: (props) => {
			return (
				<QueryClientProvider client={queryClient}>{props.children}</QueryClientProvider>
			)
		}
	})

	return router
}

declare module "@tanstack/react-router" {
	interface Register {
		router: ReturnType<typeof createRouter>
	}
}
