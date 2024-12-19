import { createServerFn } from "@tanstack/start"

import { deleteSessionTokenCookie, invalidateSession } from "../auth/sessions"
import { authedMiddleware, csrfProtectionMiddleware } from "../utils/middlewares"

export const $logout = createServerFn({ method: "POST" })
	.middleware([authedMiddleware, csrfProtectionMiddleware])
	.handler(async ({ context }) => {
		await invalidateSession({ sessionId: context.session.id })
		deleteSessionTokenCookie()
	})
