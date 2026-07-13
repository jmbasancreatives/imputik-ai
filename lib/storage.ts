export const STORAGE_KEY = "imputik-ai-v1"

export type AppState = {
  completed: number[]
  quizAnswers: Record<number, number>
  lastActive: string
  streak: number
  provider: { apiKey: string; baseURL: string; model: string }
  chat: { role: "user" | "assistant"; content: string }[]
}

export const defaultState: AppState = {
  completed: [],
  quizAnswers: {},
  lastActive: "",
  streak: 1,
  provider: { apiKey: "", baseURL: "https://api.openai.com/v1", model: "gpt-4o-mini" },
  chat: [],
}

export function loadState(): AppState {
  if (typeof window === "undefined") return defaultState
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}")
    return { ...defaultState, ...saved, provider: { ...defaultState.provider, ...saved.provider } }
  } catch {
    return defaultState
  }
}

export function saveState(state: AppState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}
