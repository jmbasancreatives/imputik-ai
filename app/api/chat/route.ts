import { google } from "@ai-sdk/google"
import { streamText } from "ai"

export const maxDuration = 60

const system = `You are IMPUTIK, a practical and encouraging career coach for aspiring virtual assistants. Give concise, actionable guidance. Help with VA services, workflows, portfolios, proposals, pricing, outreach, client communication, and ethical AI use. Ask one useful follow-up question when context is missing. Never invent client results or credentials. Prefer checklists, examples, and next actions.`

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const messages = Array.isArray(body.messages) ? body.messages : []

    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      return new Response("Gemini is not configured on the server.", { status: 503 })
    }
    if (messages.length === 0) {
      return new Response("Add a message to continue.", { status: 400 })
    }

    const result = streamText({ model: google("gemini-3.5-flash"), system, messages })
    return result.toTextStreamResponse()
  } catch {
    return new Response("Gemini could not complete this request. Please try again.", { status: 500 })
  }
}
