import { createAPIFileRoute } from "@tanstack/start/api"
import { generateState } from "arctic"
import { setCookie } from "vinxi/http"

import { serverEnv } from "@/environment/server"
import { github } from "@/server/auth/oauth"

export const APIRoute = createAPIFileRoute("/api/login/github")({
	GET: () => {
		const state = generateState()
		const url = github.createAuthorizationURL(state, ["user:email"])

		setCookie("github_oauth_state", state, {
			path: "/",
			secure: serverEnv.NODE_ENV === "production",
			httpOnly: true,
			maxAge: 60 * 10,
			sameSite: "lax"
		})

		return new Response(null, {
			status: 302,
			headers: {
				Location: url.href
			}
		})
	}
})
