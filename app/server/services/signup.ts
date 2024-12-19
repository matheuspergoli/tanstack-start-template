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
	hashPassword
} from "../utils/password"

export const $signup = createServerFn({ method: "POST" })
	.middleware([csrfProtectionMiddleware])
	.validator(
		z.object({
			email: z.string().email(),
			password: z.string().min(6).max(100)
		})
	)
	.handler(async ({ data }) => {
		const existingUser = await db.query.usersTable.findFirst({
			where: eq(usersTable.email, data.email)
		})

		if (existingUser) {
			throw new Error(
				"Signup failed. Check your credentials or try another email address."
			)
		}

		const { feedback } = checkPasswordStrength(data.password)

		if (feedback.warning) {
			throw new Error(feedback.warning)
		}

		const checkForPasswordLeaks = await checkPasswordLeaks(data.password)

		if (checkForPasswordLeaks) {
			throw new Error("This password has been leaked in a data breach")
		}

		const hashedPassword = await hashPassword(data.password)

		const user = await db
			.insert(usersTable)
			.values({
				email: data.email,
				passwordHash: hashedPassword
			})
			.returning()
			.then((res) => res[0] ?? null)

		if (!user) {
			throw new Error("Failed to create user")
		}

		await setSession({ userId: user.id })
	})
