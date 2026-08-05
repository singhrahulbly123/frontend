"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Bot,
  CheckCircle2,
  FileText,
  Loader2,
  LibraryBig,
  LogOut,
  PlaySquare,
  Save,
  ShieldCheck,
  Sparkles,
  Wand2,
} from "lucide-react";
import { cn } from "@/lib/utils";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.pulsevian.com/api/v1";
const TOKEN_KEY = "pulsevian_admin_token";

type Tab = "brief" | "tool" | "story" | "prompt";

type ToolDraft = {
  name: string;
  category: string;
  tagline: string;
  description: string;
  website_url: string;
  pricing: string;
  best_for: string;
  pros: string;
  cons: string;
  alternatives: string;
  use_cases: string;
  faqs: string;
  source_urls: string;
  seo_title: string;
  seo_description: string;
};

type BriefDraft = {
  title: string;
  summary: string;
  key_updates: string;
  tool_name: string;
  tool_url: string;
  tool_reason: string;
  prompts: string;
  impact_india: string;
  source_urls: string;
  cta_label: string;
  cta_url: string;
};

type StoryDraft = {
  title: string;
  primary_keyword: string;
  audience: string;
  summary: string;
  cover_image: string;
  slides: string;
  source_urls: string;
  seo_description: string;
};

type PromptDraft = {
  title: string;
  category: string;
  audience: string;
  language: string;
  use_case: string;
  prompt: string;
  tags: string;
};

const emptyTool: ToolDraft = {
  name: "",
  category: "AI Productivity",
  tagline: "",
  description: "",
  website_url: "",
  pricing: "",
  best_for: "",
  pros: "",
  cons: "",
  alternatives: "",
  use_cases: "",
  faqs: "",
  source_urls: "",
  seo_title: "",
  seo_description: "",
};

const emptyBrief: BriefDraft = {
  title: "",
  summary: "",
  key_updates: "",
  tool_name: "",
  tool_url: "",
  tool_reason: "",
  prompts: "",
  impact_india: "",
  source_urls: "",
  cta_label: "Read more",
  cta_url: "/ai-tools",
};

const emptyStory: StoryDraft = {
  title: "",
  primary_keyword: "",
  audience: "Creators, students, job seekers, and small businesses",
  summary: "",
  cover_image: "/images/ai-story-cover.webp",
  slides: "",
  source_urls: "",
  seo_description: "",
};

const emptyPrompt: PromptDraft = {
  title: "",
  category: "Content Creation",
  audience: "Creators",
  language: "hinglish",
  use_case: "",
  prompt: "",
  tags: "",
};

function lines(value: string) {
  return value.split("\n").map((item) => item.trim()).filter(Boolean);
}

function toLines(value: unknown) {
  return Array.isArray(value) ? value.map((item) => typeof item === "string" ? item : JSON.stringify(item)).join("\n") : "";
}

function toFaqLines(value: unknown) {
  if (!Array.isArray(value)) return "";
  return value.map((item) => {
    if (typeof item !== "object" || !item) return "";
    const faq = item as Record<string, unknown>;
    return `${String(faq.question || "")} | ${String(faq.answer || "")}`.trim();
  }).filter(Boolean).join("\n");
}

function parseFaqs(value: string) {
  return lines(value).map((item) => {
    const [question, ...answer] = item.split("|");
    return { question: question.trim(), answer: answer.join("|").trim() };
  }).filter((item) => item.question && item.answer);
}

function toStoryLines(value: unknown) {
  if (!Array.isArray(value)) return "";
  return value.map((item) => {
    if (typeof item !== "object" || !item) return "";
    const page = item as Record<string, unknown>;
    const itemList = Array.isArray(page.items) ? page.items.join("; ") : "";
    return [page.type, page.title, page.text, itemList].map((part) => String(part || "").trim()).join(" | ");
  }).filter(Boolean).join("\n");
}

function parseStoryLines(value: string, image: string) {
  return lines(value).map((line, index) => {
    const [type, title, text, itemList] = line.split("|").map((part) => part.trim());
    return {
      type: type || `slide-${index + 1}`,
      title,
      text,
      items: itemList ? itemList.split(";").map((item) => item.trim()).filter(Boolean) : [],
      image,
    };
  }).filter((page) => page.title || page.text);
}

async function request<T>(path: string, options: RequestInit = {}, token?: string): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const validation = payload?.errors ? Object.values(payload.errors as Record<string, string[]>).flat()[0] : null;
    throw new Error(validation || payload?.message || payload?.error || `Request failed (${response.status})`);
  }
  return payload as T;
}

export function ContentDashboard() {
  const [token, setToken] = useState("");
  const [ready, setReady] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [tab, setTab] = useState<Tab>("brief");
  const [tool, setTool] = useState<ToolDraft>(emptyTool);
  const [brief, setBrief] = useState<BriefDraft>(emptyBrief);
  const [story, setStory] = useState<StoryDraft>(emptyStory);
  const [prompt, setPrompt] = useState<PromptDraft>(emptyPrompt);
  const [loading, setLoading] = useState<string | null>(null);
  const [notice, setNotice] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [counts, setCounts] = useState({ tools: 0, briefs: 0, stories: 0, prompts: 0 });

  const loadCounts = useCallback(async (authToken: string) => {
    try {
      const [tools, briefs, stories, prompts] = await Promise.all([
        request<{ total?: number }>("/admin/growth/ai-tools?per_page=1", {}, authToken),
        request<{ total?: number }>("/admin/growth/daily-briefs?per_page=1", {}, authToken),
        request<{ total?: number }>("/admin/web-stories?per_page=1", {}, authToken),
        request<{ total?: number }>("/admin/growth/prompts?per_page=1", {}, authToken),
      ]);
      setCounts({ tools: tools.total || 0, briefs: briefs.total || 0, stories: stories.total || 0, prompts: prompts.total || 0 });
    } catch {
      // Authentication errors are surfaced when the user performs an action.
    }
  }, []);

  useEffect(() => {
    const saved = window.sessionStorage.getItem(TOKEN_KEY) || "";
    setToken(saved);
    setReady(true);
    if (saved) void loadCounts(saved);
  }, [loadCounts]);

  async function login(event: React.FormEvent) {
    event.preventDefault();
    setLoading("login");
    setNotice(null);
    try {
      const result = await request<{ token: string }>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      window.sessionStorage.setItem(TOKEN_KEY, result.token);
      setToken(result.token);
      setPassword("");
      setNotice({ type: "success", text: "Secure content studio unlocked." });
      await loadCounts(result.token);
    } catch (error) {
      setNotice({ type: "error", text: error instanceof Error ? error.message : "Login failed." });
    } finally {
      setLoading(null);
    }
  }

  function logout() {
    window.sessionStorage.removeItem(TOKEN_KEY);
    setToken("");
    setNotice(null);
  }

  async function generateTool() {
    if (!tool.name.trim()) return setNotice({ type: "error", text: "Tool name is required before generating a draft." });
    setLoading("generate-tool");
    setNotice(null);
    try {
      const result = await request<{ data: Record<string, unknown> }>("/admin/growth/ai-tools/generate", {
        method: "POST",
        body: JSON.stringify({ name: tool.name, category: tool.category, tagline: tool.tagline, website_url: tool.website_url }),
      }, token);
      const data = result.data;
      setTool((current) => ({
        ...current,
        name: String(data.name || current.name),
        category: String(data.category || current.category),
        tagline: String(data.tagline || current.tagline),
        description: String(data.description || current.description),
        website_url: String(data.website_url || current.website_url),
        pricing: String(data.pricing || current.pricing),
        best_for: toLines(data.best_for),
        pros: toLines(data.pros),
        cons: toLines(data.cons),
        alternatives: toLines(data.alternatives),
        use_cases: toLines(data.use_cases),
        faqs: toFaqLines(data.faqs),
        seo_title: String(data.seo_title || current.seo_title),
        seo_description: String(data.seo_description || current.seo_description),
      }));
      setNotice({ type: "success", text: "AI draft ready. Verify claims, pricing, and wording before publishing." });
    } catch (error) {
      setNotice({ type: "error", text: error instanceof Error ? error.message : "Draft generation failed." });
    } finally {
      setLoading(null);
    }
  }

  async function publishTool() {
    setLoading("publish-tool");
    setNotice(null);
    try {
      const result = await request<{ data: { slug: string } }>("/admin/growth/ai-tools", {
        method: "POST",
        body: JSON.stringify({
          ...tool,
          best_for: lines(tool.best_for),
          pros: lines(tool.pros),
          cons: lines(tool.cons),
          alternatives: lines(tool.alternatives),
          use_cases: lines(tool.use_cases),
          faqs: parseFaqs(tool.faqs),
          source_urls: lines(tool.source_urls),
          reviewed_at: new Date().toISOString(),
          is_active: true,
          is_featured: false,
          published_at: new Date().toISOString(),
        }),
      }, token);
      setNotice({ type: "success", text: `Tool published: /ai-tools/${result.data.slug}` });
      setTool(emptyTool);
      await loadCounts(token);
    } catch (error) {
      setNotice({ type: "error", text: error instanceof Error ? error.message : "Tool could not be published." });
    } finally {
      setLoading(null);
    }
  }

  async function generateBrief() {
    if (!brief.title.trim()) return setNotice({ type: "error", text: "Brief title is required before generating a draft." });
    setLoading("generate-brief");
    setNotice(null);
    try {
      const result = await request<{ data: Record<string, unknown> }>("/admin/growth/daily-briefs/generate", {
        method: "POST",
        body: JSON.stringify(brief),
      }, token);
      const data = result.data;
      const toolOfDay = typeof data.tool_of_day === "object" && data.tool_of_day ? data.tool_of_day as Record<string, unknown> : {};
      setBrief((current) => ({
        ...current,
        title: String(data.title || current.title),
        summary: String(data.summary || current.summary),
        key_updates: toLines(data.key_updates),
        tool_name: String(toolOfDay.name || current.tool_name),
        tool_url: String(toolOfDay.url || current.tool_url),
        tool_reason: String(toolOfDay.reason || current.tool_reason),
        prompts: toLines(data.prompts),
        impact_india: String(data.impact_india || current.impact_india),
      }));
      setNotice({ type: "success", text: "AI brief draft ready. Add sources and complete the human-review checklist." });
    } catch (error) {
      setNotice({ type: "error", text: error instanceof Error ? error.message : "Brief generation failed." });
    } finally {
      setLoading(null);
    }
  }

  async function publishBrief() {
    setLoading("publish-brief");
    setNotice(null);
    try {
      const result = await request<{ data: { slug: string } }>("/admin/growth/daily-briefs", {
        method: "POST",
        body: JSON.stringify({
          title: brief.title,
          summary: brief.summary,
          key_updates: lines(brief.key_updates),
          tool_of_day: brief.tool_name ? { name: brief.tool_name, url: brief.tool_url, reason: brief.tool_reason } : null,
          prompts: lines(brief.prompts),
          impact_india: brief.impact_india,
          source_urls: lines(brief.source_urls),
          reviewed_at: new Date().toISOString(),
          cta_label: brief.cta_label,
          cta_url: brief.cta_url,
          status: "published",
          published_at: new Date().toISOString(),
        }),
      }, token);
      setNotice({ type: "success", text: `Daily brief published: /daily-ai-brief/${result.data.slug}` });
      setBrief(emptyBrief);
      await loadCounts(token);
    } catch (error) {
      setNotice({ type: "error", text: error instanceof Error ? error.message : "Brief could not be published." });
    } finally {
      setLoading(null);
    }
  }

  async function generateStory() {
    if (!story.title.trim()) return setNotice({ type: "error", text: "Story title is required before generating a draft." });
    setLoading("generate-story");
    setNotice(null);
    try {
      const result = await request<{ data: Record<string, unknown> }>("/admin/web-stories/generate", {
        method: "POST",
        body: JSON.stringify({ title: story.title, excerpt: story.summary, ai_summary: story.seo_description, audience: story.audience, primary_keyword: story.primary_keyword }),
      }, token);
      const data = result.data;
      setStory((current) => ({
        ...current,
        title: String(data.title || current.title),
        summary: String(data.summary || current.summary),
        seo_description: String(data.seo_description || current.seo_description),
        slides: toStoryLines(data.pages),
      }));
      setNotice({ type: "success", text: "Story draft ready. Verify every claim, add primary sources, and rewrite weak slides before publishing." });
    } catch (error) {
      setNotice({ type: "error", text: error instanceof Error ? error.message : "Story draft generation failed." });
    } finally {
      setLoading(null);
    }
  }

  async function publishStory() {
    const pages = parseStoryLines(story.slides, story.cover_image);
    if (pages.length < 3) return setNotice({ type: "error", text: "Add at least 3 useful story slides before publishing." });
    setLoading("publish-story");
    setNotice(null);
    try {
      const result = await request<{ data: { slug: string } }>("/admin/web-stories", {
        method: "POST",
        body: JSON.stringify({
          title: story.title,
          summary: story.summary,
          locale: "hi-IN",
          cover_image: story.cover_image,
          pages,
          seo_description: story.seo_description,
          source_urls: lines(story.source_urls),
          reviewed_at: new Date().toISOString(),
          is_ai_generated: true,
          status: "published",
          published_at: new Date().toISOString(),
        }),
      }, token);
      setNotice({ type: "success", text: `Web story published: /web-stories/${result.data.slug}` });
      setStory(emptyStory);
      await loadCounts(token);
    } catch (error) {
      setNotice({ type: "error", text: error instanceof Error ? error.message : "Story could not be published." });
    } finally {
      setLoading(null);
    }
  }

  async function generatePrompt() {
    if (!prompt.title.trim()) return setNotice({ type: "error", text: "Prompt title is required before generating a draft." });
    setLoading("generate-prompt");
    setNotice(null);
    try {
      const result = await request<{ data: Record<string, unknown> }>("/admin/growth/prompts/generate", {
        method: "POST",
        body: JSON.stringify(prompt),
      }, token);
      const data = result.data;
      setPrompt((current) => ({
        ...current,
        title: String(data.title || current.title),
        category: String(data.category || current.category),
        audience: String(data.audience || current.audience),
        language: String(data.language || current.language),
        use_case: String(data.use_case || current.use_case),
        prompt: String(data.prompt || current.prompt),
        tags: toLines(data.tags),
      }));
      setNotice({ type: "success", text: "Prompt draft ready. Test it with sample inputs before publishing." });
    } catch (error) {
      setNotice({ type: "error", text: error instanceof Error ? error.message : "Prompt generation failed." });
    } finally {
      setLoading(null);
    }
  }

  async function publishPrompt() {
    setLoading("publish-prompt");
    setNotice(null);
    try {
      const result = await request<{ data: { slug: string } }>("/admin/growth/prompts", {
        method: "POST",
        body: JSON.stringify({
          ...prompt,
          tags: lines(prompt.tags),
          is_featured: false,
          is_active: true,
          published_at: new Date().toISOString(),
        }),
      }, token);
      setNotice({ type: "success", text: `Prompt published: /prompts/${result.data.slug}` });
      setPrompt(emptyPrompt);
      await loadCounts(token);
    } catch (error) {
      setNotice({ type: "error", text: error instanceof Error ? error.message : "Prompt could not be published." });
    } finally {
      setLoading(null);
    }
  }

  if (!ready) return <main className="page-shell py-20"><Loader2 className="mx-auto h-6 w-6 animate-spin text-orange-700" /></main>;

  if (!token) {
    return (
      <main className="page-shell py-10 sm:py-16">
        <section className="mx-auto max-w-md premium-card p-6 sm:p-8">
          <span className="brand-gradient flex h-12 w-12 items-center justify-center rounded-2xl"><ShieldCheck className="h-6 w-6" /></span>
          <p className="eyebrow mt-6">Protected workspace</p>
          <h1 className="mt-3 text-3xl font-black">Pulsevian Content Studio</h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">Use an editor or administrator account. Your access token stays in this browser session only.</p>
          <form onSubmit={login} className="mt-6 grid gap-4">
            <Field label="Email"><input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required className="w-full rounded-xl px-4 py-3" /></Field>
            <Field label="Password"><input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required className="w-full rounded-xl px-4 py-3" /></Field>
            <button type="submit" disabled={loading === "login"} className="brand-gradient inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-5 text-sm font-bold shadow-lg shadow-orange-900/15 disabled:opacity-60">
              {loading === "login" ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />} Sign in securely
            </button>
          </form>
          <Notice notice={notice} />
        </section>
      </main>
    );
  }

  return (
    <main className="page-shell py-7 sm:py-10">
      <section className="relative overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white/85 p-6 shadow-[0_26px_70px_-40px_rgba(15,23,42,0.3)] sm:p-8">
        <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-orange-200/40 blur-3xl" />
        <div className="relative flex flex-wrap items-start justify-between gap-5">
          <div>
            <p className="eyebrow"><Sparkles className="h-4 w-4" /> Human-led publishing</p>
            <h1 className="mt-3 text-3xl font-black sm:text-4xl">Content Studio</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">Generate a structured draft, verify every claim, improve it for real users, then publish it dynamically.</p>
          </div>
          <button type="button" onClick={logout} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 hover:border-red-200 hover:bg-red-50 hover:text-red-700"><LogOut className="h-4 w-4" /> Sign out</button>
        </div>
        <div className="relative mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Stat label="Published AI tools" value={counts.tools} href="/ai-tools" />
          <Stat label="Daily briefs" value={counts.briefs} href="/daily-ai-brief" />
          <Stat label="Web stories" value={counts.stories} href="/web-stories" />
          <Stat label="Prompt templates" value={counts.prompts} href="/prompts" />
        </div>
      </section>

      <div className="mt-6 flex gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
        <TabButton active={tab === "brief"} onClick={() => setTab("brief")} icon={FileText}>Daily Brief</TabButton>
        <TabButton active={tab === "tool"} onClick={() => setTab("tool")} icon={Bot}>AI Tool Profile</TabButton>
        <TabButton active={tab === "story"} onClick={() => setTab("story")} icon={PlaySquare}>Web Story</TabButton>
        <TabButton active={tab === "prompt"} onClick={() => setTab("prompt")} icon={LibraryBig}>Prompt</TabButton>
      </div>

      <Notice notice={notice} />

      <section className="mt-6 grid items-start gap-6 lg:grid-cols-[1fr_300px]">
        <div className="premium-card p-5 sm:p-7">
          {tab === "brief" ? (
            <BriefForm brief={brief} setBrief={setBrief} loading={loading} generate={generateBrief} publish={publishBrief} />
          ) : tab === "tool" ? (
            <ToolForm tool={tool} setTool={setTool} loading={loading} generate={generateTool} publish={publishTool} />
          ) : tab === "story" ? (
            <StoryForm story={story} setStory={setStory} loading={loading} generate={generateStory} publish={publishStory} />
          ) : (
            <PromptForm prompt={prompt} setPrompt={setPrompt} loading={loading} generate={generatePrompt} publish={publishPrompt} />
          )}
        </div>
        <QualityChecklist />
      </section>
    </main>
  );
}

function PromptForm({ prompt, setPrompt, loading, generate, publish }: { prompt: PromptDraft; setPrompt: React.Dispatch<React.SetStateAction<PromptDraft>>; loading: string | null; generate: () => void; publish: () => void }) {
  const set = (key: keyof PromptDraft, value: string) => setPrompt((current) => ({ ...current, [key]: value }));
  return <div>
    <FormHeading eyebrow="Repeat traffic" title="Publish a tested prompt template" description="Solve one repeatable user task. Include placeholders, output format, quality checks, and constraints inside the prompt." />
    <div className="mt-6 grid gap-5">
      <Field label="SEO-friendly prompt title"><input value={prompt.title} onChange={(event) => set("title", event.target.value)} className="w-full rounded-xl px-4 py-3" /></Field>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Category"><input value={prompt.category} onChange={(event) => set("category", event.target.value)} className="w-full rounded-xl px-4 py-3" /></Field>
        <Field label="Audience"><input value={prompt.audience} onChange={(event) => set("audience", event.target.value)} className="w-full rounded-xl px-4 py-3" /></Field>
      </div>
      <Field label="Language"><input value={prompt.language} onChange={(event) => set("language", event.target.value)} className="w-full rounded-xl px-4 py-3" /></Field>
      <Field label="Use case" hint="What outcome will the user get?"><textarea rows={3} value={prompt.use_case} onChange={(event) => set("use_case", event.target.value)} className="w-full rounded-xl px-4 py-3" /></Field>
      <Field label="Tested prompt" hint="Use [PLACEHOLDERS] and define output format"><textarea rows={10} value={prompt.prompt} onChange={(event) => set("prompt", event.target.value)} className="w-full rounded-xl px-4 py-3 font-mono text-sm" /></Field>
      <Field label="Tags" hint="One tag per line"><textarea rows={4} value={prompt.tags} onChange={(event) => set("tags", event.target.value)} className="w-full rounded-xl px-4 py-3" /></Field>
    </div>
    <FormActions loading={loading} generating="generate-prompt" publishing="publish-prompt" onGenerate={generate} onPublish={publish} />
  </div>;
}

function StoryForm({ story, setStory, loading, generate, publish }: { story: StoryDraft; setStory: React.Dispatch<React.SetStateAction<StoryDraft>>; loading: string | null; generate: () => void; publish: () => void }) {
  const set = (key: keyof StoryDraft, value: string) => setStory((current) => ({ ...current, [key]: value }));
  return <div>
    <FormHeading eyebrow="Visual discovery" title="Publish a useful Web Story" description="Target one clear search intent. Each slide should teach, verify, or help the reader take one action." />
    <div className="mt-6 grid gap-5">
      <Field label="Story title" hint="Clear topic + reader benefit"><input value={story.title} onChange={(event) => set("title", event.target.value)} className="w-full rounded-xl px-4 py-3" /></Field>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Primary keyword"><input value={story.primary_keyword} onChange={(event) => set("primary_keyword", event.target.value)} className="w-full rounded-xl px-4 py-3" /></Field>
        <Field label="Audience"><input value={story.audience} onChange={(event) => set("audience", event.target.value)} className="w-full rounded-xl px-4 py-3" /></Field>
      </div>
      <Field label="Human-written summary" hint="What will the user know or do after this story?"><textarea rows={4} value={story.summary} onChange={(event) => set("summary", event.target.value)} className="w-full rounded-xl px-4 py-3" /></Field>
      <Field label="Cover image path or URL"><input value={story.cover_image} onChange={(event) => set("cover_image", event.target.value)} className="w-full rounded-xl px-4 py-3" /></Field>
      <Field label="Slides" hint="One per line: Type | Title | Body | item 1; item 2"><textarea rows={11} value={story.slides} onChange={(event) => set("slides", event.target.value)} className="w-full rounded-xl px-4 py-3" /></Field>
      <Field label="Primary source URLs" hint="One official or primary source per line"><textarea rows={4} value={story.source_urls} onChange={(event) => set("source_urls", event.target.value)} className="w-full rounded-xl px-4 py-3" /></Field>
      <Field label="SEO description"><textarea rows={3} value={story.seo_description} onChange={(event) => set("seo_description", event.target.value)} className="w-full rounded-xl px-4 py-3" /></Field>
    </div>
    <FormActions loading={loading} generating="generate-story" publishing="publish-story" onGenerate={generate} onPublish={publish} />
  </div>;
}

function BriefForm({ brief, setBrief, loading, generate, publish }: { brief: BriefDraft; setBrief: React.Dispatch<React.SetStateAction<BriefDraft>>; loading: string | null; generate: () => void; publish: () => void }) {
  const set = (key: keyof BriefDraft, value: string) => setBrief((current) => ({ ...current, [key]: value }));
  return <div>
    <FormHeading eyebrow="Daily content" title="Create today’s useful AI brief" description="One update per line. Keep claims sourceable, concise, and useful for Indian readers." />
    <div className="mt-6 grid gap-5">
      <Field label="SEO-friendly title" hint="Clear benefit + topic; avoid clickbait"><input value={brief.title} onChange={(event) => set("title", event.target.value)} className="w-full rounded-xl px-4 py-3" /></Field>
      <Field label="Summary" hint="What will the reader learn in 2–3 sentences?"><textarea rows={4} value={brief.summary} onChange={(event) => set("summary", event.target.value)} className="w-full rounded-xl px-4 py-3" /></Field>
      <Field label="Key updates" hint="One verified update per line"><textarea rows={6} value={brief.key_updates} onChange={(event) => set("key_updates", event.target.value)} className="w-full rounded-xl px-4 py-3" /></Field>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Tool of the day"><input value={brief.tool_name} onChange={(event) => set("tool_name", event.target.value)} className="w-full rounded-xl px-4 py-3" /></Field>
        <Field label="Internal or official URL"><input value={brief.tool_url} onChange={(event) => set("tool_url", event.target.value)} className="w-full rounded-xl px-4 py-3" /></Field>
      </div>
      <Field label="Why this tool?" hint="Specific user and use case"><textarea rows={3} value={brief.tool_reason} onChange={(event) => set("tool_reason", event.target.value)} className="w-full rounded-xl px-4 py-3" /></Field>
      <Field label="India impact" hint="How does this affect creators, students, jobs, or businesses?"><textarea rows={4} value={brief.impact_india} onChange={(event) => set("impact_india", event.target.value)} className="w-full rounded-xl px-4 py-3" /></Field>
      <Field label="Prompts of the day" hint="One complete prompt per line"><textarea rows={5} value={brief.prompts} onChange={(event) => set("prompts", event.target.value)} className="w-full rounded-xl px-4 py-3" /></Field>
      <Field label="Source URLs" hint="One official or primary source per line"><textarea rows={4} value={brief.source_urls} onChange={(event) => set("source_urls", event.target.value)} className="w-full rounded-xl px-4 py-3" /></Field>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="CTA label"><input value={brief.cta_label} onChange={(event) => set("cta_label", event.target.value)} className="w-full rounded-xl px-4 py-3" /></Field>
        <Field label="CTA URL"><input value={brief.cta_url} onChange={(event) => set("cta_url", event.target.value)} className="w-full rounded-xl px-4 py-3" /></Field>
      </div>
    </div>
    <FormActions loading={loading} generating="generate-brief" publishing="publish-brief" onGenerate={generate} onPublish={publish} />
  </div>;
}

function ToolForm({ tool, setTool, loading, generate, publish }: { tool: ToolDraft; setTool: React.Dispatch<React.SetStateAction<ToolDraft>>; loading: string | null; generate: () => void; publish: () => void }) {
  const set = (key: keyof ToolDraft, value: string) => setTool((current) => ({ ...current, [key]: value }));
  return <div>
    <FormHeading eyebrow="Evergreen SEO" title="Publish a useful AI tool profile" description="Write for a specific user problem. Pricing and product claims must be checked on the official website." />
    <div className="mt-6 grid gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Tool name"><input value={tool.name} onChange={(event) => set("name", event.target.value)} className="w-full rounded-xl px-4 py-3" /></Field>
        <Field label="Category"><input value={tool.category} onChange={(event) => set("category", event.target.value)} className="w-full rounded-xl px-4 py-3" /></Field>
      </div>
      <Field label="Tagline" hint="Who is it for and what outcome does it create?"><input value={tool.tagline} onChange={(event) => set("tagline", event.target.value)} className="w-full rounded-xl px-4 py-3" /></Field>
      <Field label="Official website"><input value={tool.website_url} onChange={(event) => set("website_url", event.target.value)} className="w-full rounded-xl px-4 py-3" /></Field>
      <Field label="Human-reviewed description" hint="Original explanation—not copied vendor language"><textarea rows={6} value={tool.description} onChange={(event) => set("description", event.target.value)} className="w-full rounded-xl px-4 py-3" /></Field>
      <Field label="Pricing" hint="Mention verification date in the description when pricing can change"><input value={tool.pricing} onChange={(event) => set("pricing", event.target.value)} className="w-full rounded-xl px-4 py-3" /></Field>
      <ListFields tool={tool} set={set} />
      <Field label="FAQs" hint="One per line: Question | Answer"><textarea rows={5} value={tool.faqs} onChange={(event) => set("faqs", event.target.value)} className="w-full rounded-xl px-4 py-3" /></Field>
      <Field label="Source URLs" hint="Official documentation or primary source, one URL per line"><textarea rows={4} value={tool.source_urls} onChange={(event) => set("source_urls", event.target.value)} className="w-full rounded-xl px-4 py-3" /></Field>
      <Field label="SEO title"><input value={tool.seo_title} onChange={(event) => set("seo_title", event.target.value)} className="w-full rounded-xl px-4 py-3" /></Field>
      <Field label="SEO description"><textarea rows={3} value={tool.seo_description} onChange={(event) => set("seo_description", event.target.value)} className="w-full rounded-xl px-4 py-3" /></Field>
    </div>
    <FormActions loading={loading} generating="generate-tool" publishing="publish-tool" onGenerate={generate} onPublish={publish} />
  </div>;
}

function ListFields({ tool, set }: { tool: ToolDraft; set: (key: keyof ToolDraft, value: string) => void }) {
  const fields: Array<[keyof ToolDraft, string]> = [["use_cases", "Use cases"], ["best_for", "Best for"], ["pros", "Pros"], ["cons", "Cons"], ["alternatives", "Alternatives"]];
  return <div className="grid gap-5 sm:grid-cols-2">{fields.map(([key, label]) => <Field key={key} label={label} hint="One item per line"><textarea rows={4} value={tool[key]} onChange={(event) => set(key, event.target.value)} className="w-full rounded-xl px-4 py-3" /></Field>)}</div>;
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return <label className="block text-sm font-bold text-slate-700"><span>{label}</span>{hint ? <span className="ml-2 text-xs font-normal text-slate-500">{hint}</span> : null}<span className="mt-2 block">{children}</span></label>;
}

function FormHeading({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return <div><p className="eyebrow">{eyebrow}</p><h2 className="mt-3 text-2xl font-black sm:text-3xl">{title}</h2><p className="mt-3 text-sm leading-6 text-slate-600">{description}</p></div>;
}

function FormActions({ loading, generating, publishing, onGenerate, onPublish }: { loading: string | null; generating: string; publishing: string; onGenerate: () => void; onPublish: () => void }) {
  return <div className="mt-7 flex flex-col gap-3 sm:flex-row"><button type="button" onClick={onGenerate} disabled={Boolean(loading)} className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl border border-orange-200 bg-orange-50 px-5 text-sm font-bold text-orange-800 disabled:opacity-50">{loading === generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />} Generate AI draft</button><button type="button" onClick={onPublish} disabled={Boolean(loading)} className="brand-gradient inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl px-5 text-sm font-bold shadow-lg shadow-orange-900/15 disabled:opacity-50">{loading === publishing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Human reviewed — publish</button></div>;
}

function TabButton({ active, onClick, icon: Icon, children }: { active: boolean; onClick: () => void; icon: typeof Bot; children: React.ReactNode }) {
  return <button type="button" onClick={onClick} className={cn("inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl px-4 text-sm font-bold", active ? "bg-orange-700 text-white shadow-md" : "text-slate-600 hover:bg-slate-50")}><Icon className="h-4 w-4" />{children}</button>;
}

function Stat({ label, value, href }: { label: string; value: number; href: string }) {
  return <Link href={href} className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-white/90 p-4"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">{label}</p><p className="mt-1 text-2xl font-black text-slate-950">{value}</p></div><ArrowRight className="h-5 w-5 text-orange-700 transition group-hover:translate-x-1" /></Link>;
}

function QualityChecklist() {
  const items = ["Official source and current pricing checked", "Original human insight added", "Clear audience and use case", "Pros, limitations, and alternatives included", "No unsupported superlatives or fake ratings", "SEO title matches search intent"];
  return <aside className="premium-card p-5 lg:sticky lg:top-24"><p className="eyebrow"><ShieldCheck className="h-4 w-4" /> Before publish</p><h2 className="mt-3 text-xl font-black">Human + SEO checklist</h2><div className="mt-5 grid gap-3">{items.map((item) => <div key={item} className="flex gap-2.5 text-sm leading-5 text-slate-600"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />{item}</div>)}</div><Link href="/editorial-policy" className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-orange-700">Editorial policy <ArrowRight className="h-4 w-4" /></Link></aside>;
}

function Notice({ notice }: { notice: { type: "success" | "error"; text: string } | null }) {
  if (!notice) return null;
  return <div role="status" className={cn("mt-5 rounded-xl border px-4 py-3 text-sm font-semibold", notice.type === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-red-200 bg-red-50 text-red-700")}>{notice.text}</div>;
}
