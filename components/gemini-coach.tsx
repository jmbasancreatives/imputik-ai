"use client"

import { useRef, useState } from "react"
import { Bot, RotateCcw, Send, Sparkles } from "lucide-react"
import type { AppState } from "@/lib/storage"

export function GeminiCoach({ state, update }: { state: AppState; update: (patch: Partial<AppState>) => void }) {
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const abortRef = useRef<AbortController | null>(null)
  const prompts = ["Review my VA service offer", "Help me write a client update", "Practice a discovery call"]

  const send = async (text = input) => {
    if (!text.trim() || loading) return
    const next = [...state.chat, { role: "user" as const, content: text.trim() }]
    update({ chat: next })
    setInput("")
    setLoading(true)
    setError("")
    const controller = new AbortController()
    abortRef.current = controller

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
        signal: controller.signal,
      })
      if (!response.ok) throw new Error(await response.text())
      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let answer = ""
      update({ chat: [...next, { role: "assistant", content: "" }] })
      while (reader) {
        const { done, value } = await reader.read()
        if (done) break
        answer += decoder.decode(value, { stream: true })
        update({ chat: [...next, { role: "assistant", content: answer }] })
      }
    } catch (caught) {
      if ((caught as Error).name !== "AbortError") setError((caught as Error).message || "Coach unavailable.")
    } finally {
      setLoading(false)
    }
  }

  return <div className="mx-auto flex max-w-3xl flex-col">
    <div className="flex items-center gap-4"><span className="grid size-14 place-items-center rounded-2xl bg-primary text-primary-foreground"><Bot /></span><div><p className="eyebrow">Powered by Gemini</p><h1 className="text-3xl font-black">IMPUTIK Coach</h1></div></div>
    <p className="mt-4 text-muted-foreground">Practical VA career feedback, ready to use with no key setup on your device.</p>
    <div className="mt-8 min-h-80 rounded-3xl border border-border bg-card p-4 md:p-6"><div className="flex flex-col gap-4">
      {state.chat.length === 0 ? <div className="grid min-h-64 place-items-center text-center"><div><Sparkles className="mx-auto size-8 text-highlight" /><h2 className="mt-3 text-xl font-bold">What are you building today?</h2><div className="mt-4 flex flex-wrap justify-center gap-2">{prompts.map((prompt) => <button key={prompt} onClick={() => send(prompt)} className="rounded-full border border-border px-3 py-2 text-xs font-semibold hover:bg-secondary">{prompt}</button>)}</div></div></div> : state.chat.map((message, index) => <div key={index} className={`max-w-[88%] whitespace-pre-wrap rounded-2xl p-4 text-sm leading-relaxed ${message.role === "user" ? "ml-auto bg-primary text-primary-foreground" : "bg-secondary"}`}>{message.content || "Thinking…"}</div>)}
      {error && <div className="rounded-xl bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}
    </div></div>
    <div className="mt-3 flex gap-2 rounded-2xl border border-border bg-card p-2"><textarea value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing && event.keyCode !== 229) { event.preventDefault(); send() } }} placeholder="Ask about clients, services, or your next move…" rows={1} className="min-h-12 flex-1 resize-none bg-transparent px-3 py-3 text-sm outline-none" />{loading ? <button onClick={() => abortRef.current?.abort()} className="grid size-12 place-items-center rounded-xl bg-secondary" aria-label="Stop response"><RotateCcw className="size-5" /></button> : <button onClick={() => send()} disabled={!input.trim()} className="grid size-12 place-items-center rounded-xl bg-primary text-primary-foreground disabled:opacity-40" aria-label="Send message"><Send className="size-5" /></button>}</div>
    <button onClick={() => update({ chat: [] })} className="mt-4 self-center text-xs font-bold text-muted-foreground hover:text-foreground">Clear conversation</button>
  </div>
}

export function GeminiSettings({ clear }: { clear: () => void }) {
  return <div className="mx-auto max-w-2xl"><p className="eyebrow">Your app, your data</p><h1 className="mt-3 text-4xl font-black tracking-tight">Private settings</h1><section className="mt-8 rounded-3xl border border-border bg-card p-5 md:p-7"><div className="flex items-center gap-3"><Sparkles className="size-6 text-highlight" /><div><h2 className="text-xl font-bold">Gemini connected</h2><p className="text-sm text-muted-foreground">AI coaching is securely configured by the app owner.</p></div></div><p className="mt-5 rounded-xl bg-secondary p-4 text-sm leading-relaxed text-muted-foreground">Your Gemini key stays on the server and is never sent to this browser. Coaching messages are sent only when you use the coach.</p></section><section className="mt-4 rounded-3xl border border-border bg-card p-5 md:p-7"><h2 className="text-xl font-bold">Free and open source</h2><p className="mt-2 leading-relaxed text-muted-foreground">IMPUTIK AI has no subscription and is released under the MIT License.</p></section><button onClick={clear} className="mt-6 rounded-xl border border-destructive px-5 py-3 text-sm font-bold text-destructive">Reset local app data</button></div>
}
