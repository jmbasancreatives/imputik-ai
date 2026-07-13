'use client'

import Image from "next/image"
import { useRef, useState } from "react"
import { Bot, RotateCcw, Send, Sparkles, User, LogOut } from "lucide-react"
import { signOut } from "next-auth/react"
import type { AppState } from "@/lib/storage"

export function GeminiCoach({ state, update }: { state: AppState; update: (patch: Partial<AppState>) => void }) {
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const abortRef = useRef<AbortController | null>(null)
  const prompts = ["Help me write a client update", "Quiz me on calendar management", "How do I prioritize a busy inbox?"]

  const send = async (text = input) => {
    if (!text.trim() || loading) return
    const next = [...state.chat, { role: "user" as const, content: text.trim() }]
    update({ chat: next }); setInput(""); setLoading(true); setError("")
    const controller = new AbortController(); abortRef.current = controller
    try {
      const response = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: next }), signal: controller.signal })
      if (!response.ok) throw new Error(await response.text())
      const reader = response.body?.getReader(); const decoder = new TextDecoder(); let answer = ""
      update({ chat: [...next, { role: "assistant", content: "" }] })
      while (reader) { const { done, value } = await reader.read(); if (done) break; answer += decoder.decode(value, { stream: true }); update({ chat: [...next, { role: "assistant", content: answer }] }) }
    } catch (caught) { if ((caught as Error).name !== "AbortError") setError((caught as Error).message || "Coach unavailable.") }
    finally { setLoading(false); abortRef.current = null }
  }

  return <section className="chat-shell">
    <header className="chat-header"><div className="coach-avatar"><Image src="/imputik-logo.png" alt="IMPUTIK coach" width={52} height={52}/><span /></div><div><h2>IMPUTIK Coach</h2><p>Online and ready to help</p></div><button className="chat-reset" aria-label="Clear conversation" onClick={() => update({ chat: [] })}><RotateCcw size={17}/></button></header>
    <div className="chat-body" aria-live="polite"><div className="chat-day">Your private coaching space</div><div className="message-row assistant"><div className="message-icon"><Bot size={16}/></div><div className="message-bubble"><p>Hi, I&apos;m your IMPUTIK Coach. I&apos;m here to help you practice client scenarios and build confidence one step at a time. What would you like to work on?</p></div></div>
      {state.chat.map((message, index) => <div className={`message-row ${message.role}`} key={`${message.role}-${index}`}><div className="message-icon">{message.role === "user" ? <User size={16}/> : <Bot size={16}/>}</div><div className="message-bubble"><p>{message.content || "Thinking..."}</p></div></div>)}
      {state.chat.length === 0 && <div className="prompt-starters">{prompts.map(prompt => <button key={prompt} onClick={() => send(prompt)}><Sparkles size={14}/>{prompt}</button>)}</div>}
      {error && <div className="chat-error">{error}</div>}
    </div>
    <div className="chat-composer"><textarea rows={1} value={input} onChange={event => setInput(event.target.value)} onKeyDown={event => { if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing && event.keyCode !== 229) { event.preventDefault(); send() } }} placeholder="Message your coach..." aria-label="Message your coach"/>{loading ? <button onClick={() => abortRef.current?.abort()} aria-label="Stop response"><RotateCcw size={18}/></button> : <button onClick={() => send()} disabled={!input.trim()} aria-label="Send message"><Send size={18}/></button>}</div>
    <p className="chat-note">Your conversation is saved only on this device.</p>
  </section>
}

export function GeminiSettings({ clear }: { clear: () => void }) {
  const handleLogout = async () => {
    if (window.confirm("Sign out of your account?")) {
      await signOut({ redirectTo: "/" })
    }
  }
  
  return <section className="flex flex-col gap-5"><div><span className="eyebrow">Settings</span><h2 className="mt-2 text-3xl font-black">Your app, your data</h2></div><div className="settings-card"><div className="icon-tile"><Sparkles size={22}/></div><div className="flex-1"><h3 className="font-extrabold">Gemini coaching</h3><p className="mt-1 text-sm leading-relaxed text-muted-foreground">Your friendly AI coach is configured and ready. Messages and learning progress remain on this device.</p></div><span className="status-dot">Active</span></div><div className="settings-card"><div><h3 className="font-extrabold">Reset local data</h3><p className="mt-1 text-sm text-muted-foreground">Remove progress, practice results, and coaching messages.</p></div><button onClick={clear} className="danger-action">Clear data</button></div><div className="settings-card border-destructive/20"><div className="flex-1"><h3 className="font-extrabold">Account</h3><p className="mt-1 text-sm text-muted-foreground">Sign out of your account and return to the home page.</p></div><button onClick={handleLogout} className="flex items-center gap-2 text-destructive hover:text-destructive/80"><LogOut size={16} /> Sign out</button></div></section>
}
