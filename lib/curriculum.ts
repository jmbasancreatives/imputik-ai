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
  videoUrl?: string
  videoAssessment?: {
    question: string
    options: string[]
    answer: number
  }
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
  ["Own your time", "Systems", "Plan capacity with time blocks, buffers, and realistic delivery windows.", "Build tomorrow's schedule with one protected deep-work block.", "A delivery buffer protects against…", ["All communication", "Unexpected complexity", "Good feedback"], 1],
  ["Create simple SOPs", "Systems", "Document repeatable work so quality does not depend on memory.", "Document a task with trigger, steps, quality check, and handoff.", "A useful SOP is…", ["Specific and testable", "Hidden", "Only a title"], 0],
  ["Quality control", "Systems", "Use checklists and evidence to deliver confidently.", "Make a pre-delivery checklist for one service.", "The final quality check happens…", ["Before delivery", "A week later", "Only if asked"], 0],
  ["Build proof of skill", "Portfolio", "Turn practice projects into credible, outcome-led case studies.", "Create a sample project with a before, process, and after.", "A portfolio case study should show…", ["Only tools", "Your process and result", "Your hobbies"], 1],
  ["Package your offer", "Portfolio", "Bundle a clear result, scope, timeline, and boundary.", "Name and outline one starter service package.", "A strong package is easiest to buy when…", ["Scope is clear", "Everything is unlimited", "Price is hidden"], 0],
  ["Price with confidence", "Business", "Set a sustainable floor and price around scope and value.", "Calculate your minimum hourly floor and a project estimate.", "Your minimum rate should include…", ["Only task time", "Costs, admin, and profit", "A competitor's guess"], 1],
  ["Find aligned clients", "Business", "Build a focused prospect list using fit signals and real needs.", "Add ten qualified prospects to a simple tracker.", "A qualified prospect has…", ["A relevant need and budget signal", "Any social account", "The same timezone only"], 0],
  ["Write outreach that earns replies", "Business", "Personalize concise outreach around a real observation and next step.", "Draft three short outreach messages for real prospects.", "Good outreach begins with…", ["A generic biography", "A relevant observation", "A discount"], 1],
  ["Proposal and discovery", "Business", "Ask sharper questions and write proposals that reflect the client's goal.", "Prepare five discovery questions and a one-page proposal outline.", "Discovery is mainly for…", ["Understanding goals and constraints", "Showing every skill", "Filling time"], 0],
  ["Your 30-day launch plan", "Launch", "Turn your learning into a repeatable weekly client-acquisition rhythm.", "Schedule your next 30 days of practice, outreach, and review.", "A useful launch plan is…", ["Specific and scheduled", "Perfect before starting", "Kept in your head"], 0],
] as const

const videoAssessments = [
  { question: "Why do clients hire VAs?", options: ["To save time", "For outcomes and results", "Because they're bored"], answer: 1 },
  { question: "What makes a service lane effective?", options: ["It's general", "It's specific and communicates clear value", "It covers everything"], answer: 1 },
  { question: "An ideal client profile should be based on…", options: ["Stereotypes", "Demographics only", "Specific business problems"], answer: 2 },
  { question: "Which folder structure protects security?", options: ["Flat folders", "Unique passwords per account", "Shared templates"], answer: 1 },
  { question: "How should you use AI as a VA?", options: ["Replace all thinking", "Enhance thinking with human review", "Never use it"], answer: 1 },
  { question: "The five-part prompt framework includes…", options: ["Role, goal, context, constraints, format", "Just role and goal", "Only constraints"], answer: 0 },
  { question: "Before sharing research, verify…", options: ["Grammar only", "Key claims with sources", "Everything is perfect"], answer: 1 },
  { question: "Strong client updates prioritize…", options: ["Small talk", "Progress and next actions", "Problems only"], answer: 1 },
  { question: "Email labels should group by…", options: ["Color", "Urgency and business impact", "Random preference"], answer: 1 },
  { question: "Meeting notes should capture…", options: ["Jokes", "Decisions and action items", "Everything verbatim"], answer: 1 },
  { question: "Time blocks protect for…", options: ["Chatting", "Deep work and focused tasks", "Social media"], answer: 1 },
  { question: "A testable SOP includes…", options: ["Just a title", "Trigger, steps, check, handoff", "Vague descriptions"], answer: 1 },
  { question: "Final quality checks happen…", options: ["After delivery", "Before delivery", "Never"], answer: 1 },
  { question: "Case studies show…", options: ["Only your tools", "Your process and result", "Unrelated work"], answer: 1 },
  { question: "A clear package includes…", options: ["Scope and boundaries", "Everything unlimited", "Confusing pricing"], answer: 0 },
  { question: "Your rate floor should cover…", options: ["Only task time", "Costs, admin, profit", "Competitor pricing"], answer: 1 },
  { question: "A qualified prospect has…", options: ["A relevant need", "Only a social account", "No budget"], answer: 0 },
  { question: "Good outreach starts with…", options: ["Generic info", "Relevant observation", "Discount offer"], answer: 1 },
  { question: "Discovery helps you…", options: ["Show all skills", "Understand goals and constraints", "Fill time"], answer: 1 },
  { question: "A launch plan should be…", options: ["Specific and scheduled", "Perfect before starting", "Just ideas"], answer: 0 },
] as const

const videoUrls = [
  "https://www.youtube.com/embed/dQw4w9WgXcQ", // What is a VA? - Introduction
  "https://www.youtube.com/embed/dQw4w9WgXcQ", // Choosing your service lane
  "https://www.youtube.com/embed/dQw4w9WgXcQ", // Creating ideal client profile
  "https://www.youtube.com/embed/dQw4w9WgXcQ", // Setting up workspace
  "https://www.youtube.com/embed/dQw4w9WgXcQ", // AI tools & productivity
  "https://www.youtube.com/embed/dQw4w9WgXcQ", // Prompt engineering essentials
  "https://www.youtube.com/embed/dQw4w9WgXcQ", // Research skills for VAs
  "https://www.youtube.com/embed/dQw4w9WgXcQ", // Professional communication
  "https://www.youtube.com/embed/dQw4w9WgXcQ", // Email management systems
  "https://www.youtube.com/embed/dQw4w9WgXcQ", // Running effective meetings
  "https://www.youtube.com/embed/dQw4w9WgXcQ", // Time management hacks
  "https://www.youtube.com/embed/dQw4w9WgXcQ", // Creating SOPs and docs
  "https://www.youtube.com/embed/dQw4w9WgXcQ", // Quality control checklist
  "https://www.youtube.com/embed/dQw4w9WgXcQ", // Portfolio building guide
  "https://www.youtube.com/embed/dQw4w9WgXcQ", // Service packaging strategy
  "https://www.youtube.com/embed/dQw4w9WgXcQ", // Pricing your services
  "https://www.youtube.com/embed/dQw4w9WgXcQ", // Finding your ideal clients
  "https://www.youtube.com/embed/dQw4w9WgXcQ", // Cold outreach strategies
  "https://www.youtube.com/embed/dQw4w9WgXcQ", // Sales proposals that win
  "https://www.youtube.com/embed/dQw4w9WgXcQ", // 30-day launch plan
]

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
  videoUrl: videoUrls[index],
  videoAssessment: videoAssessments[index],
}))

export const trackNames = [...new Set(curriculum.map((lesson) => lesson.track))]
