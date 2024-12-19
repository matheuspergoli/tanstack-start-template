import { createMiddleware } from "@tanstack/start"
import { getCookie, getWebRequest, setCookie } from "vinxi/http"

import { serverEnv } from "@/environment/server"
import { TimeSpan } from "@/libs/time-span"

import { getCurrentSession, getCurrentUser } from "../auth/sessions"

export const authedMiddleware = createMiddleware().server(async ({ next }) => {
	const [user, session] = await Promise.all([getCurrentUser(), getCurrentSession()])

	if (!user?.id || !session?.userId) {
		throw new Error("Not logged in")
	}

	return next({
		context: {
			user,
			session
		}
	})
})

export const csrfProtectionMiddleware = createMiddleware().server(async ({ next }) => {
	const request = getWebRequest()

	const token = getCookie("session")
	const maxAge = new TimeSpan(30, "d")

	if (token && request.method === "GET") {
		setCookie("session", token, {
			path: "/",
			maxAge: maxAge.seconds(),
			sameSite: "lax",
			httpOnly: true,
			secure: serverEnv.NODE_ENV === "production"
		})

		return next()
	}

	const originHeader = request.headers.get("Origin")
	const hostHeader = request.headers.get("Host")

	if (originHeader === null || hostHeader === null) {
		throw new Error("Origin or Host header missing")
	}

	const origin = new URL(originHeader)

	if (origin.host !== hostHeader) {
		throw new Error("Origin and Host header mismatch")
	}

	return next()
})
