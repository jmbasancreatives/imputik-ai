import { createOpenAI } from "@ai-sdk/openai"
import { streamText } from "ai"

export const maxDuration = 60

const system = `You are IMPUTIK, a practical and encouraging career coach for aspiring virtual assistants. Give concise, actionable guidance. Help with VA services, workflows, portfolios, proposals, pricing, outreach, client communication, and ethical AI use. Ask one useful follow-up question when context is missing. Never invent client results or credentials. Prefer checklists, examples, and next actions.`

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const apiKey = String(body.apiKey || "")
    const baseURL = String(body.baseURL || "https://api.openai.com/v1")
    const model = String(body.model || "gpt-4o-mini")
    const messages = Array.isArray(body.messages) ? body.messages : []

    if (!apiKey || messages.length === 0) {
      return new Response("Add an API key and a message to continue.", { status: 400 })
    }
    if (!baseURL.startsWith("https://")) {
      return new Response("The provider URL must use HTTPS.", { status: 400 })
    }

    const provider = createOpenAI({ apiKey, baseURL })
    const result = streamText({ model: provider.chat(model), system, messages })
    return result.toTextStreamResponse()
  } catch {
    return new Response("The provider could not complete this request. Check your key, model, and endpoint.", { status: 500 })
  }
}
