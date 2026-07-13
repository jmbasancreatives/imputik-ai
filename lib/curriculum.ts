export type Lesson = {
  id: number
  week: number
  title: string
  track: string
  duration: string
  summary: string
  content: string[]
  task: string
  question: string
  options: string[]
  answer: number
}

const topics = [
  ["The modern VA role", "Foundations", "Map the outcomes clients hire virtual assistants to create.", "Write a one-sentence VA value proposition for a client you would love to support.", "Which statement is outcome-focused?", ["I know many apps", "I help founders reclaim five hours each week", "I am always online"], 1],
  ["Choose your service lane", "Foundations", "Match your strengths to an in-demand service niche.", "Select three services you can confidently package this month.", "A focused service lane helps you…", ["Serve everyone", "Communicate a clear result", "Avoid learning"], 1],
  ["Build your ideal client", "Foundations", "Create a useful client profile based on needs, not stereotypes.", "Draft a five-line ideal client profile.", "The best client profile starts with…", ["A logo color", "A business problem", "A follower count"], 1],
  ["Set up your VA workspace", "Systems", "Create a secure, calm digital workspace for reliable delivery.", "Create folders for clients, templates, operations, and learning.", "What should be unique for every account?", ["Password", "Profile photo", "Folder color"], 0],
  ["AI as your copilot", "AI Tools", "Use AI to accelerate thinking while keeping human judgment in control.", "Turn one repetitive task into a reusable AI prompt.", "AI output should always be…", ["Published instantly", "Reviewed and verified", "Kept secret"], 1],
  ["Prompt with context", "AI Tools", "Write stronger prompts using role, goal, context, constraints, and format.", "Rewrite a vague prompt using the five-part framework.", "Which detail improves a prompt most?", ["Clear output format", "More exclamation marks", "All caps"], 0],
  ["Research without guesswork", "AI Tools", "Combine fast AI research with source verification.", "Research one client industry and save three credible sources.", "Before sharing AI research, you should…", ["Verify key claims", "Remove sources", "Make it longer"], 0],
  ["Client-ready writing", "Communication", "Write concise updates that lead with progress and next actions.", "Draft an end-of-day client update in five sentences or fewer.", "A strong update leads with…", ["An apology", "Status and outcomes", "Personal news"], 1],
  ["Manage the inbox", "Communication", "Triage messages by urgency, ownership, and next action.", "Create three labels and a response-time rule for each.", "Inbox triage should prioritize…", ["Oldest font", "Business impact and urgency", "Longest email"], 1],
  ["Run better meetings", "Communication", "Prepare agendas, capture decisions, and assign clear follow-ups.", "Create a reusable meeting note template.", "Every action item needs…", ["An owner and due date", "An emoji", "A long paragraph"], 0],
  ["Own your time", "Systems", "Plan capacity with time blocks, buffers, and realistic delivery windows.", "Build tomorrow’s schedule with one protected deep-work block.", "A delivery buffer protects against…", ["All communication", "Unexpected complexity", "Good feedback"], 1],
  ["Create simple SOPs", "Systems", "Document repeatable work so quality does not depend on memory.", "Document a task with trigger, steps, quality check, and handoff.", "A useful SOP is…", ["Specific and testable", "Hidden", "Only a title"], 0],
  ["Quality control", "Systems", "Use checklists and evidence to deliver confidently.", "Make a pre-delivery checklist for one service.", "The final quality check happens…", ["Before delivery", "A week later", "Only if asked"], 0],
  ["Build proof of skill", "Portfolio", "Turn practice projects into credible, outcome-led case studies.", "Create a sample project with a before, process, and after.", "A portfolio case study should show…", ["Only tools", "Your process and result", "Your hobbies"], 1],
  ["Package your offer", "Portfolio", "Bundle a clear result, scope, timeline, and boundary.", "Name and outline one starter service package.", "A strong package is easiest to buy when…", ["Scope is clear", "Everything is unlimited", "Price is hidden"], 0],
  ["Price with confidence", "Business", "Set a sustainable floor and price around scope and value.", "Calculate your minimum hourly floor and a project estimate.", "Your minimum rate should include…", ["Only task time", "Costs, admin, and profit", "A competitor’s guess"], 1],
  ["Find aligned clients", "Business", "Build a focused prospect list using fit signals and real needs.", "Add ten qualified prospects to a simple tracker.", "A qualified prospect has…", ["A relevant need and budget signal", "Any social account", "The same timezone only"], 0],
  ["Write outreach that earns replies", "Business", "Personalize concise outreach around a real observation and next step.", "Draft three short outreach messages for real prospects.", "Good outreach begins with…", ["A generic biography", "A relevant observation", "A discount"], 1],
  ["Proposal and discovery", "Business", "Ask sharper questions and write proposals that reflect the client’s goal.", "Prepare five discovery questions and a one-page proposal outline.", "Discovery is mainly for…", ["Understanding goals and constraints", "Showing every skill", "Filling time"], 0],
  ["Your 30-day launch plan", "Launch", "Turn your learning into a repeatable weekly client-acquisition rhythm.", "Schedule your next 30 days of practice, outreach, and review.", "A useful launch plan is…", ["Specific and scheduled", "Perfect before starting", "Kept in your head"], 0],
] as const

export const curriculum: Lesson[] = topics.map((item, index) => ({
  id: index + 1,
  week: Math.floor(index / 5) + 1,
  title: item[0],
  track: item[1],
  duration: `${8 + (index % 4) * 2} min`,
  summary: item[2],
  content: [
    item[2],
    "Great virtual assistants make work feel lighter. Focus on the result, document your thinking, and communicate before the client has to ask.",
    "Use this lesson as a small field exercise. A finished, useful draft is more valuable than a perfect idea that never leaves your notes.",
  ],
  task: item[3],
  question: item[4],
  options: [...item[5]],
  answer: item[6],
}))

export const trackNames = [...new Set(curriculum.map((lesson) => lesson.track))]
