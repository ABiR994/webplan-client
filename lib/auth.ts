import { betterAuth } from "better-auth"
import { APIError, createAuthMiddleware } from "better-auth/api"
import { jwt } from "better-auth/plugins"
import { mongodbAdapter } from "@better-auth/mongo-adapter"
import { MongoClient } from "mongodb"

const client = new MongoClient(process.env.MONGODB_URI as string)
const db = client.db("wedplandb")

const passwordRule = /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/

export const auth = betterAuth({
  database: mongodbAdapter(db, { client }),
  plugins: [jwt({ jwt: { definePayload: () => ({}) } })],
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  user: {
    additionalFields: {
      role: {
        type: ["customer", "vendor", "admin"],
        input: true,
        defaultValue: "customer",
      },
      isBlocked: { type: "boolean", input: false, defaultValue: false },
      businessName: { type: "string", required: false, input: false },
      subscriptionPlan: {
        type: ["free", "premium"],
        input: false,
        defaultValue: "free",
      },
      subscriptionExpiresAt: { type: "date", required: false, input: false },
    },
  },
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path !== "/sign-up/email") return
      if (!passwordRule.test(ctx.body?.password ?? "")) {
        throw new APIError("BAD_REQUEST", {
          message:
            "Password must be 6+ characters with an uppercase and a lowercase letter",
        })
      }
    }),
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user) => ({
          data: {
            ...user,
            role: user.role === "vendor" ? "vendor" : "customer",
          },
        }),
      },
    },
  },
})
