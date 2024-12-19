import { createServerFn } from "@tanstack/start"
import { eq } from "drizzle-orm"
import { z } from "zod"

import { setSession } from "../auth/sessions"
import { db } from "../db/client"
import { usersTable } from "../db/schema"
import { csrfProtectionMiddleware } from "../utils/middlewares"
import {
	checkPasswordLeaks,
	checkPasswordStrength,
	verifyPassword
} from "../utils/password"

export const $login = createServerFn({ method: "POST" })
	.middleware([csrfProtectionMiddleware])
	.validator(
		z.object({
			email: z.string().email(),
			password: z.string().min(6).max(100)
		})
	)
	.handler(async ({ data }) => {
		const { feedback } = checkPasswordStrength(data.password)

		if (feedback.warning) {
			throw new Error("Incorrect email or password")
		}

		const checkForPasswordLeaks = await checkPasswordLeaks(data.password)

		if (checkForPasswordLeaks) {
			throw new Error("Incorrect email or password")
		}

		const existingUser = await db.query.usersTable.findFirst({
			where: eq(usersTable.email, data.email)
		})

		if (!existingUser?.passwordHash) {
			throw new Error("Incorrect email or password")
		}

		const validPassword = await verifyPassword(data.password, existingUser.passwordHash)

		if (!validPassword) {
			throw new Error("Incorrect email or password")
		}

		await setSession({ userId: existingUser.id })
	})
