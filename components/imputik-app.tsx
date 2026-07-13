"use client"

import Image from "next/image"
import { useEffect, useMemo, useRef, useState } from "react"
import { ArrowLeft, ArrowRight, BookOpen, Bot, Check, ChevronRight, CircleUserRound, Dumbbell, Flame, Home, KeyRound, LockKeyhole, Menu, MessageCircle, Play, RotateCcw, Send, Settings, Sparkles, Target, Trophy, WifiOff, X } from "lucide-react"
import { curriculum, trackNames, type Lesson } from "@/lib/curriculum"
import { defaultState, loadState, saveState, STORAGE_KEY, type AppState } from "@/lib/storage"
import { GeminiCoach, GeminiSettings } from "@/components/gemini-coach"
import { PracticeLab } from "@/components/practice-lab"

type Tab = "home" | "learn" | "practice" | "coach" | "progress" | "settings"

const nav = [
  ["home", "Home", Home], ["learn", "Learn", BookOpen], ["practice", "Practice", Dumbbell], ["coach", "Coach", Bot], ["progress", "Progress", Trophy], ["settings", "Settings", Settings],
] as const

export function ImputikApp() {
  const [tab, setTab] = useState<Tab>("home")
  const [state, setState] = useState<AppState>(defaultState)
  const [ready, setReady] = useState(false)
  const [selected, setSelected] = useState<Lesson | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    setState(loadState())
    setReady(true)
    if ("serviceWorker" in navigator) navigator.serviceWorker.register("/sw.js").catch(() => undefined)
  }, [])
  useEffect(() => { if (ready) saveState(state) }, [state, ready])

  const update = (patch: Partial<AppState>) => setState((current) => ({ ...current, ...patch }))
  const currentLesson = curriculum.find((lesson) => !state.completed.includes(lesson.id)) || curriculum.at(-1)!
  const percent = Math.round((state.completed.length / curriculum.length) * 100)

  return (
    <main className="min-h-dvh bg-background text-foreground">
      <div className="mx-auto flex min-h-dvh max-w-7xl">
        <aside className="hidden w-64 shrink-0 border-r border-border bg-card p-6 lg:flex lg:flex-col">
          <Brand />
          <nav className="mt-12 flex flex-col gap-2" aria-label="Main navigation">
            {nav.map(([id, label, Icon]) => <NavButton key={id} active={tab === id} label={label} icon={Icon} onClick={() => { setTab(id); setSelected(null) }} />)}
          </nav>
          <div className="mt-auto rounded-2xl bg-primary p-5 text-primary-foreground">
            <Sparkles className="size-5 text-accent" />
            <p className="mt-3 font-semibold">Open, yours, forever.</p>
            <p className="mt-1 text-sm leading-relaxed text-primary-foreground/70">No subscription. Your progress stays on this device.</p>
          </div>
        </aside>

        <section className="min-w-0 flex-1 pb-24 lg:pb-0">
          <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-border bg-background/95 px-5 backdrop-blur md:px-8">
            <div className="lg:hidden"><Brand compact /></div>
            <div className="hidden lg:block"><p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">VA career studio</p><p className="mt-1 text-sm">Learn deliberately. Work confidently.</p></div>
            <div className="flex items-center gap-3">
              <div className="hidden items-center gap-2 rounded-full border border-border bg-card px-3 py-2 text-sm font-semibold sm:flex"><Flame className="size-4 text-highlight" />{state.streak} day streak</div>
              <button onClick={() => setMenuOpen(true)} className="grid size-10 place-items-center rounded-full border border-border bg-card lg:hidden" aria-label="Open menu"><Menu className="size-5" /></button>
              <button onClick={() => setTab("settings")} className="hidden size-10 place-items-center rounded-full bg-primary text-primary-foreground lg:grid" aria-label="Open settings"><CircleUserRound className="size-5" /></button>
            </div>
          </header>

          <div className="mx-auto max-w-5xl p-5 md:p-8">
            {selected ? <LessonView lesson={selected} state={state} update={update} close={() => setSelected(null)} select={setSelected} /> : (
              <>
                {tab === "home" && <HomeView state={state} current={currentLesson} percent={percent} openLesson={setSelected} go={setTab} />}
                {tab === "learn" && <LearnView state={state} openLesson={setSelected} />}
                {tab === "practice" && <PracticeLab />}
                {tab === "coach" && <GeminiCoach state={state} update={update} />}
                {tab === "progress" && <ProgressView state={state} percent={percent} />}
                {tab === "settings" && <GeminiSettings clear={() => { if (window.confirm("Clear all IMPUTIK AI progress and chat from this device?")) { localStorage.removeItem(STORAGE_KEY); window.location.reload() } }} />}
              </>
            )}
          </div>
        </section>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-40 flex h-20 items-center justify-around border-t border-border bg-card px-2 lg:hidden" aria-label="Mobile navigation">
        {nav.map(([id, label, Icon]) => <button key={id} onClick={() => { setTab(id); setSelected(null) }} className={`flex min-w-0 flex-1 flex-col items-center gap-1 rounded-xl px-1 py-2 text-[10px] font-bold ${tab === id ? "text-accent" : "text-muted-foreground"}`}><Icon className={`size-5 ${tab === id ? "fill-accent" : ""}`} />{label}</button>)}
      </nav>

      {menuOpen && <div className="fixed inset-0 z-50 bg-primary p-6 text-primary-foreground lg:hidden"><div className="flex items-center justify-between"><Brand inverted /><button onClick={() => setMenuOpen(false)} className="grid size-11 place-items-center rounded-full border border-primary-foreground/20"><X /></button></div><nav className="mt-14 flex flex-col">{nav.map(([id, label, Icon], i) => <button key={id} onClick={() => { setTab(id); setSelected(null); setMenuOpen(false) }} className="flex items-center justify-between border-b border-primary-foreground/15 py-5 text-left text-2xl font-semibold"><span className="flex items-center gap-4"><span className="text-sm text-accent">0{i + 1}</span>{label}</span><Icon className="size-5" /></button>)}</nav></div>}
    </main>
  )
}

function Brand({ compact = false, inverted = false }: { compact?: boolean; inverted?: boolean }) {
  return <div className={`flex items-center gap-3 ${inverted ? "text-primary-foreground" : "text-foreground"}`}><Image src="/imputik-logo.png" alt="IMPUTIK AI" width={44} height={44} className="size-11 rounded-xl object-cover" />{!compact && <span><span className="block text-lg font-black tracking-tight">IMPUTIK <span className="text-accent">AI</span></span><span className="block text-[9px] font-bold uppercase tracking-[0.24em] opacity-60">Virtual assistant hub</span></span>}</div>
}

function NavButton({ active, label, icon: Icon, onClick }: { active: boolean; label: string; icon: typeof Home; onClick: () => void }) {
  return <button onClick={onClick} className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-colors ${active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary hover:text-foreground"}`}><Icon className="size-5" />{label}</button>
}

function HomeView({ state, current, percent, openLesson, go }: { state: AppState; current: Lesson; percent: number; openLesson: (l: Lesson) => void; go: (t: Tab) => void }) {
  return <div className="flex flex-col gap-6">
    <section><p className="eyebrow">Day {Math.min(state.completed.length + 1, 20)} of 20</p><h1 className="mt-3 max-w-2xl text-balance text-4xl font-black tracking-tight md:text-6xl">Turn your skills into <span className="text-primary">client-ready confidence.</span></h1><p className="mt-4 max-w-xl text-pretty leading-relaxed text-muted-foreground">A practical, no-paywall path to becoming an AI-enabled virtual assistant.</p></section>
    <section className="grid gap-4 md:grid-cols-[1.5fr_1fr]">
      <button onClick={() => openLesson(current)} className="group flex min-h-64 flex-col justify-between rounded-3xl bg-primary p-6 text-left text-primary-foreground md:p-8"><div className="flex items-center justify-between"><span className="rounded-full bg-accent px-3 py-1 text-xs font-black uppercase tracking-wider text-accent-foreground">Continue learning</span><span className="text-sm text-primary-foreground/60">{current.duration}</span></div><div><p className="text-sm text-primary-foreground/60">Lesson {current.id} · {current.track}</p><h2 className="mt-2 max-w-md text-balance text-3xl font-bold">{current.title}</h2><div className="mt-6 flex items-center gap-2 font-bold text-accent">Start lesson <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" /></div></div></button>
      <div className="flex flex-col justify-between rounded-3xl border border-border bg-card p-6"><div className="flex items-center justify-between"><Target className="size-6 text-highlight" /><span className="font-mono text-sm">{percent}%</span></div><div><div className="relative mx-auto my-5 grid size-28 place-items-center rounded-full border-[10px] border-secondary"><span className="text-2xl font-black">{state.completed.length}<small className="text-sm text-muted-foreground">/20</small></span></div><p className="text-center text-sm text-muted-foreground">Lessons completed</p></div><button onClick={() => go("progress")} className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-secondary py-3 text-sm font-bold">See progress <ChevronRight className="size-4" /></button></div>
    </section>
    <section><div className="flex items-end justify-between"><div><p className="eyebrow">Today&apos;s action</p><h2 className="mt-2 text-2xl font-bold">Make one move forward</h2></div></div><div className="mt-4 grid gap-3 sm:grid-cols-3">{[["Practice", "Draft a 3-line client update", MessageCircle], ["Ask", "Review my VA service offer", Bot], ["Plan", "Create this week's focus", Target]].map(([tag, text, Icon]) => <button key={tag as string} onClick={() => go(tag === "Ask" ? "coach" : tag === "Practice" ? "practice" : "learn")} className="flex min-h-32 flex-col items-start justify-between rounded-2xl border border-border bg-card p-5 text-left hover:border-primary"><Icon className="size-5 text-primary" /><span><small className="font-mono uppercase text-muted-foreground">{tag as string}</small><strong className="mt-1 block text-pretty">{text as string}</strong></span></button>)}</div></section>
  </div>
}

function LearnView({ state, openLesson }: { state: AppState; openLesson: (l: Lesson) => void }) {
  return <div><p className="eyebrow">20-day launch path</p><h1 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">Learn by doing.</h1><p className="mt-3 max-w-xl leading-relaxed text-muted-foreground">Four focused weeks. Practical work. No locked chapters.</p><div className="mt-8 flex flex-col gap-8">{[1,2,3,4].map((week) => <section key={week}><div className="mb-3 flex items-center gap-3"><span className="font-mono text-xs font-bold text-highlight">WEEK 0{week}</span><span className="h-px flex-1 bg-border" /></div><div className="grid gap-3 sm:grid-cols-2">{curriculum.filter((l) => l.week === week).map((lesson) => { const done = state.completed.includes(lesson.id); return <button key={lesson.id} onClick={() => openLesson(lesson)} className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4 text-left hover:border-primary"><span className={`grid size-11 shrink-0 place-items-center rounded-xl font-mono font-bold ${done ? "bg-accent text-accent-foreground" : "bg-secondary text-muted-foreground"}`}>{done ? <Check className="size-5" /> : String(lesson.id).padStart(2,"0")}</span><span className="min-w-0 flex-1"><small className="text-muted-foreground">{lesson.track} · {lesson.duration}</small><strong className="mt-1 block truncate">{lesson.title}</strong></span><ChevronRight className="size-4 text-muted-foreground" /></button>})}</div></section>)}</div></div>
}

function LessonView({ lesson, state, update, close, select }: { lesson: Lesson; state: AppState; update: (p: Partial<AppState>) => void; close: () => void; select: (l: Lesson) => void }) {
  const chosen = state.quizAnswers[lesson.id]
  const done = state.completed.includes(lesson.id)
  const choose = (index: number) => update({ quizAnswers: { ...state.quizAnswers, [lesson.id]: index } })
  const complete = () => update({ completed: done ? state.completed.filter((id) => id !== lesson.id) : [...state.completed, lesson.id] })
  return <article className="mx-auto max-w-3xl"><button onClick={close} className="mb-6 flex items-center gap-2 text-sm font-bold text-muted-foreground"><ArrowLeft className="size-4" /> All lessons</button><div className="rounded-3xl bg-primary p-6 text-primary-foreground md:p-10"><div className="flex justify-between text-sm text-primary-foreground/60"><span>LESSON {String(lesson.id).padStart(2,"0")}</span><span>{lesson.duration}</span></div><p className="mt-10 text-sm font-bold text-accent">{lesson.track}</p><h1 className="mt-2 text-balance text-4xl font-black md:text-5xl">{lesson.title}</h1><p className="mt-4 max-w-xl leading-relaxed text-primary-foreground/70">{lesson.summary}</p></div><div className="flex flex-col gap-5 py-8">{lesson.content.map((p, i) => <p key={i} className={`leading-relaxed ${i === 0 ? "text-xl font-semibold" : "text-muted-foreground"}`}>{p}</p>)}<div className="rounded-2xl border-l-4 border-highlight bg-card p-5"><p className="eyebrow">Field task</p><p className="mt-2 font-semibold leading-relaxed">{lesson.task}</p></div><div className="rounded-3xl border border-border bg-card p-5 md:p-7"><p className="eyebrow">Knowledge check</p><h2 className="mt-3 text-xl font-bold">{lesson.question}</h2><div className="mt-4 flex flex-col gap-2">{lesson.options.map((option, i) => <button key={option} onClick={() => choose(i)} className={`flex items-center gap-3 rounded-xl border p-4 text-left text-sm ${chosen === i ? i === lesson.answer ? "border-primary bg-accent" : "border-destructive bg-destructive/5" : "border-border"}`}><span className="grid size-7 place-items-center rounded-full border border-current font-mono text-xs">{String.fromCharCode(65+i)}</span>{option}</button>)}</div>{chosen !== undefined && <p className="mt-3 text-sm font-semibold">{chosen === lesson.answer ? "Correct — that is the client-ready choice." : "Not quite. Review the lesson and try the outcome-focused answer."}</p>}</div><button onClick={complete} disabled={!done && chosen !== lesson.answer} className="flex items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-4 font-bold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-40">{done ? <><RotateCcw className="size-5" /> Mark incomplete</> : <><Check className="size-5" /> Complete lesson</>}</button><div className="flex justify-between">{lesson.id > 1 ? <button onClick={() => select(curriculum[lesson.id-2])} className="flex items-center gap-2 text-sm font-bold"><ArrowLeft className="size-4" /> Previous</button> : <span />}{lesson.id < 20 && <button onClick={() => select(curriculum[lesson.id])} className="flex items-center gap-2 text-sm font-bold">Next <ArrowRight className="size-4" /></button>}</div></div></article>
}

function CoachView({ state, update, goSettings }: { state: AppState; update: (p: Partial<AppState>) => void; goSettings: () => void }) {
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const abortRef = useRef<AbortController | null>(null)
  const prompts = ["Review my VA service offer", "Help me write a client update", "Practice a discovery call"]
  const send = async (text = input) => {
    if (!text.trim() || loading || !state.provider.apiKey) return
    const next = [...state.chat, { role: "user" as const, content: text.trim() }]
    update({ chat: next }); setInput(""); setLoading(true); setError("")
    const controller = new AbortController(); abortRef.current = controller
    try {
      const response = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...state.provider, messages: next }), signal: controller.signal })
      if (!response.ok) throw new Error(await response.text())
      const reader = response.body?.getReader(); const decoder = new TextDecoder(); let answer = ""
      update({ chat: [...next, { role: "assistant", content: "" }] })
      while (reader) { const { done, value } = await reader.read(); if (done) break; answer += decoder.decode(value, { stream: true }); update({ chat: [...next, { role: "assistant", content: answer }] }) }
    } catch (e) { if ((e as Error).name !== "AbortError") setError((e as Error).message || "Coach unavailable.") } finally { setLoading(false) }
  }
  return <div className="mx-auto flex max-w-3xl flex-col"><div className="flex items-center gap-4"><span className="grid size-14 place-items-center rounded-2xl bg-primary text-primary-foreground"><Bot /></span><div><p className="eyebrow">Your private copilot</p><h1 className="text-3xl font-black">IMPUTIK Coach</h1></div></div><p className="mt-4 text-muted-foreground">Practical career feedback powered by your own AI provider.</p>
    {!state.provider.apiKey ? <div className="mt-8 rounded-3xl border border-border bg-card p-6 md:p-8"><KeyRound className="size-7 text-highlight" /><h2 className="mt-5 text-2xl font-bold">Connect your AI key</h2><p className="mt-2 max-w-lg leading-relaxed text-muted-foreground">IMPUTIK AI is free and has no shared AI bill. Add your own compatible provider key to start coaching.</p><button onClick={goSettings} className="mt-6 rounded-xl bg-primary px-5 py-3 font-bold text-primary-foreground">Open private settings</button></div> : <><div className="mt-8 min-h-80 rounded-3xl border border-border bg-card p-4 md:p-6"><div className="flex flex-col gap-4">{state.chat.length === 0 ? <div className="grid min-h-64 place-items-center text-center"><div><Sparkles className="mx-auto size-8 text-highlight" /><h2 className="mt-3 text-xl font-bold">What are you building today?</h2><div className="mt-4 flex flex-wrap justify-center gap-2">{prompts.map((p) => <button key={p} onClick={() => send(p)} className="rounded-full border border-border px-3 py-2 text-xs font-semibold hover:bg-secondary">{p}</button>)}</div></div></div> : state.chat.map((m, i) => <div key={i} className={`max-w-[88%] rounded-2xl p-4 text-sm leading-relaxed whitespace-pre-wrap ${m.role === "user" ? "ml-auto bg-primary text-primary-foreground" : "bg-secondary"}`}>{m.content || "Thinking…"}</div>)}{error && <div className="rounded-xl bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}</div></div><div className="mt-3 flex gap-2 rounded-2xl border border-border bg-card p-2"><textarea value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing && e.keyCode !== 229) { e.preventDefault(); send() } }} placeholder="Ask about clients, services, or your next move…" rows={1} className="min-h-12 flex-1 resize-none bg-transparent px-3 py-3 text-sm outline-none" />{loading ? <button onClick={() => abortRef.current?.abort()} className="grid size-12 place-items-center rounded-xl bg-secondary" aria-label="Stop response"><X className="size-5" /></button> : <button onClick={() => send()} className="grid size-12 place-items-center rounded-xl bg-primary text-primary-foreground" aria-label="Send message"><Send className="size-5" /></button>}</div></>}
  </div>
}

function ProgressView({ state, percent }: { state: AppState; percent: number }) {
  return <div><p className="eyebrow">Your momentum</p><h1 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">Progress, not pressure.</h1><div className="mt-8 grid gap-4 md:grid-cols-3"><div className="rounded-3xl bg-primary p-6 text-primary-foreground md:col-span-2"><div className="flex justify-between"><span className="text-primary-foreground/60">Overall path</span><span className="font-mono">{percent}%</span></div><div className="mt-10 h-3 overflow-hidden rounded-full bg-primary-foreground/15"><div className="h-full rounded-full bg-accent" style={{ width: `${percent}%` }} /></div><p className="mt-4 text-2xl font-bold">{state.completed.length} of 20 lessons complete</p></div><div className="rounded-3xl border border-border bg-card p-6"><Flame className="size-7 text-highlight" /><p className="mt-8 text-4xl font-black">{state.streak}</p><p className="text-muted-foreground">day learning streak</p></div></div><h2 className="mt-10 text-2xl font-bold">Skill tracks</h2><div className="mt-4 grid gap-3 sm:grid-cols-2">{trackNames.map((track) => { const lessons = curriculum.filter(l => l.track === track); const count = lessons.filter(l => state.completed.includes(l.id)).length; return <div key={track} className="rounded-2xl border border-border bg-card p-5"><div className="flex justify-between"><strong>{track}</strong><span className="font-mono text-xs text-muted-foreground">{count}/{lessons.length}</span></div><div className="mt-4 h-2 overflow-hidden rounded-full bg-secondary"><div className="h-full bg-primary" style={{ width: `${count/lessons.length*100}%` }} /></div></div>})}</div><h2 className="mt-10 text-2xl font-bold">Milestones</h2><div className="mt-4 grid gap-3 sm:grid-cols-3">{([[1,"First step"],[5,"Week one"],[20,"Launch ready"]] as const).map(([goal,label]) => { const unlocked = state.completed.length >= goal; return <div key={label} className={`rounded-2xl border p-5 ${unlocked ? "border-primary bg-accent" : "border-border bg-card opacity-60"}`}><Trophy className="size-6" /><strong className="mt-4 block">{label}</strong><small>{unlocked ? "Unlocked" : `${goal} lessons required`}</small></div>})}</div></div>
}

function SettingsView({ state, update, session }: { state: AppState; update: (p: Partial<AppState>) => void; session: any }) {
  const setProvider = (key: keyof AppState["provider"], value: string) => update({ provider: { ...state.provider, [key]: value } })
  const clear = () => { if (window.confirm("Clear all IMPUTIK AI progress, settings, and chat from this device?")) { localStorage.removeItem(STORAGE_KEY); window.location.reload() } }
  const handleLogout = async () => { if (window.confirm("Sign out of your account?")) { await signOut({ redirectTo: "/" }) } }
  return <div className="mx-auto max-w-2xl"><p className="eyebrow">Your app, your data</p><h1 className="mt-3 text-4xl font-black tracking-tight">Private settings</h1><section className="mt-8 rounded-3xl border border-border bg-card p-5 md:p-7"><div className="flex items-center gap-3"><KeyRound className="size-6 text-highlight" /><div><h2 className="text-xl font-bold">AI provider</h2><p className="text-sm text-muted-foreground">OpenAI-compatible BYOK configuration</p></div></div><div className="mt-6 flex flex-col gap-4"><label className="form-label">API key<input type="password" value={state.provider.apiKey} onChange={(e) => setProvider("apiKey", e.target.value)} placeholder="sk-…" className="form-input" autoComplete="off" /></label><label className="form-label">Base URL<input value={state.provider.baseURL} onChange={(e) => setProvider("baseURL", e.target.value)} className="form-input" /></label><label className="form-label">Model<input value={state.provider.model} onChange={(e) => setProvider("model", e.target.value)} className="form-input" /></label></div><div className="mt-5 flex gap-3 rounded-xl bg-secondary p-4 text-sm leading-relaxed text-muted-foreground"><LockKeyhole className="mt-0.5 size-5 shrink-0 text-primary" /><p>Your key is stored only in this browser and sent with each coaching request to the provider you configure. IMPUTIK does not keep it on a server.</p></div></section><section className="mt-4 rounded-3xl border border-border bg-card p-5 md:p-7"><div className="flex items-center gap-3"><WifiOff className="size-6 text-primary" /><div><h2 className="text-xl font-bold">Local-first learning</h2><p className="text-sm text-muted-foreground">Curriculum and progress work offline. AI coaching needs internet.</p></div></div></section><section className="mt-4 rounded-3xl border border-border bg-card p-5 md:p-7"><h2 className="text-xl font-bold">Free and open source</h2><p className="mt-2 leading-relaxed text-muted-foreground">IMPUTIK AI has no subscription, ads, account, or analytics. Licensed under MIT so you can learn from it, improve it, and share it.</p></section><button onClick={clear} className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-destructive py-4 font-bold text-destructive"><RotateCcw className="size-5" /> Clear all local data</button></div>
}
