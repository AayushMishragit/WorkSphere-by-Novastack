import { useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useUser } from "@clerk/react";
import {
  KanbanIcon,
  UsersIcon,
  BookOpenIcon,
  ActivityIcon,
  HeartPulseIcon,
  BarChart3Icon,
  SparklesIcon,
  PlugIcon,
  MenuIcon,
  XIcon,
  MoonIcon,
  SunIcon,
} from "lucide-react";
import { toggleTheme } from "../features/themeSlice";

const navLinks = [
  { label: "Home", href: "#top" },
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "About", href: "#about" },
];

const features = [
  {
    icon: KanbanIcon,
    title: "Project & Task Management",
    desc: "Create projects, assign tasks with types, priorities and due dates, and see deadlines on a project calendar.",
    soon: false,
  },
  {
    icon: UsersIcon,
    title: "Team Collaboration",
    desc: "Invite teammates to your workspace, add them to projects and assign work. Assignees get an email notification.",
    soon: false,
  },
  {
    icon: BookOpenIcon,
    title: "Knowledge Management",
    desc: "Documentation that lives alongside your projects.",
    soon: true,
  },
  {
    icon: ActivityIcon,
    title: "Activity Tracking",
    desc: "A recent activity feed of tasks and their status on your dashboard.",
    soon: false,
  },
  {
    icon: HeartPulseIcon,
    title: "Project Health Metrics",
    desc: "Progress, completion rate and overdue tasks for every project.",
    soon: false,
  },
  {
    icon: BarChart3Icon,
    title: "Analytics",
    desc: "Per-project charts of tasks by status, type and priority.",
    soon: false,
  },
  {
    icon: SparklesIcon,
    title: "AI-Assisted Insights",
    desc: "Automated summaries of project progress and risks.",
    soon: true,
  },
  {
    icon: PlugIcon,
    title: "GitHub & Slack Integrations",
    desc: "Connect your code and team chat to your projects.",
    soon: true,
  },
];

const steps = [
  {
    title: "Create your workspace",
    desc: "Sign up and set up a workspace for your team.",
  },
  {
    title: "Create projects and invite your team",
    desc: "Add projects, invite teammates by email and add them to projects.",
  },
  {
    title: "Organize tasks and track activity",
    desc: "Assign tasks with due dates and follow their status.",
  },
  {
    title: "Monitor progress and analytics",
    desc: "See completion rate, overdue tasks and breakdowns by status, type and priority.",
  },
  {
    title: "Understand project progress",
    desc: "Use the dashboard and project views to see where things stand.",
  },
];

const integrations = [
  { name: "GitHub", desc: "Link repositories to projects and tasks." },
  { name: "Slack", desc: "Get project updates where your team already talks." },
];

const sampleStats = [
  { label: "Total Projects", value: 3, color: "text-blue-500" },
  { label: "Completed", value: 1, color: "text-emerald-500" },
  { label: "My Tasks", value: 5, color: "text-purple-500" },
  { label: "Overdue", value: 1, color: "text-amber-500" },
];
const sampleProjects = [
  { name: "Website Redesign", status: "ACTIVE", progress: 65 },
  { name: "Mobile App", status: "PLANNING", progress: 25 },
  { name: "Q4 Roadmap", status: "ACTIVE", progress: 40 },
];
const sampleTasks = [
  { title: "Design landing page", type: "FEATURE", status: "IN_PROGRESS" },
  { title: "Fix login redirect", type: "BUG", status: "TODO" },
  { title: "Write release notes", type: "TASK", status: "DONE" },
];
const statusStyle = {
  ACTIVE:
    "bg-emerald-200 text-emerald-800 dark:bg-emerald-500 dark:text-emerald-900",
  PLANNING: "bg-zinc-200 text-zinc-800 dark:bg-zinc-600 dark:text-zinc-200",
  TODO: "bg-zinc-200 text-zinc-800 dark:bg-zinc-600 dark:text-zinc-200",
  IN_PROGRESS:
    "bg-amber-200 text-amber-800 dark:bg-amber-500 dark:text-amber-900",
  DONE: "bg-emerald-200 text-emerald-800 dark:bg-emerald-500 dark:text-emerald-900",
};

const focus =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500";
const grad =
  "bg-gradient-to-br from-blue-500 to-blue-600 text-white hover:opacity-90 transition";
const navPrimary = `px-4 py-2 text-sm rounded ${grad} ${focus}`;
const navGhost = `px-4 py-2 text-sm rounded text-gray-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800 transition ${focus}`;
const btnPrimary = `px-6 py-3 text-sm font-medium rounded ${grad} ${focus}`;
const btnOutline = `px-6 py-3 text-sm font-medium rounded border border-gray-300 dark:border-zinc-700 text-gray-800 dark:text-zinc-200 hover:bg-gray-100 dark:hover:bg-zinc-800 transition ${focus}`;
const card =
  "border border-zinc-200 dark:border-zinc-800 dark:bg-gradient-to-br dark:from-zinc-800/70 dark:to-zinc-900/50 rounded-lg";
const footLink =
  "text-sm text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white";

export default function Landing() {
  const [menuOpen, setMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const { theme } = useSelector((state) => state.theme);
  const { isSignedIn, isLoaded } = useUser();
  const { search } = useLocation();

  if (new URLSearchParams(search).has("__clerk_ticket")) {
    return <Navigate to={`/dashboard${search}`} replace />;
  }

  const loggedIn = isLoaded && isSignedIn;
  const themeIcon =
    theme === "light" ? (
      <MoonIcon className="size-4" />
    ) : (
      <SunIcon className="size-4 text-yellow-400" />
    );

  const navAuth = !isLoaded ? null : loggedIn ? (
    <Link to="/dashboard" className={navPrimary}>
      Go to Dashboard
    </Link>
  ) : (
    <>
      <Link to="/dashboard" className={navGhost}>
        Sign In
      </Link>
      <Link to="/dashboard" className={navPrimary}>
        Get Started
      </Link>
    </>
  );

  return (
    <div
      id="top"
      className="min-h-screen bg-white dark:bg-zinc-950 text-gray-900 dark:text-zinc-100"
    >
      {/* Navbar */}
      <header className="sticky top-0 z-40 border-b border-gray-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur">
        <nav
          className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between"
          aria-label="Main"
        >
          <a
            href="#top"
            className={`flex items-center gap-2 font-semibold text-lg rounded ${focus}`}
          >
            <span
              className={`size-8 rounded flex items-center justify-center text-sm ${grad}`}
            >
              W
            </span>
            WorkSphere
          </a>

          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className={`text-sm text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white rounded ${focus}`}
              >
                {l.label}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => dispatch(toggleTheme())}
              aria-label="Toggle theme"
              className={`size-9 flex items-center justify-center rounded hover:bg-gray-100 dark:hover:bg-zinc-800 ${focus}`}
            >
              {themeIcon}
            </button>
            {navAuth}
          </div>

          <button
            onClick={() => setMenuOpen((o) => !o)}
            aria-expanded={menuOpen}
            aria-label="Toggle menu"
            className={`md:hidden size-9 flex items-center justify-center rounded hover:bg-gray-100 dark:hover:bg-zinc-800 ${focus}`}
          >
            {menuOpen ? (
              <XIcon className="size-5" />
            ) : (
              <MenuIcon className="size-5" />
            )}
          </button>
        </nav>

        {menuOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-zinc-800 px-6 py-4 flex flex-col gap-3">
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className="text-sm text-gray-700 dark:text-zinc-300"
              >
                {l.label}
              </a>
            ))}
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => dispatch(toggleTheme())}
                aria-label="Toggle theme"
                className="size-9 flex items-center justify-center rounded border border-gray-300 dark:border-zinc-700"
              >
                {themeIcon}
              </button>
              {navAuth}
            </div>
          </div>
        )}
      </header>

      <main>
        {/* Hero + sample preview */}
        <section className="relative overflow-hidden">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-96 bg-gradient-to-b from-blue-500/10 to-transparent"
          />
          <div className="relative max-w-6xl mx-auto px-6 pt-20 pb-12 text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight max-w-3xl mx-auto">
              Bring Your Team, Projects &amp; Progress Together.
            </h1>
            <p className="mt-6 text-lg text-gray-600 dark:text-zinc-400 max-w-2xl mx-auto">
              One unified workspace to manage projects, collaborate with your
              team, track progress and gain actionable insights.
            </p>
            {isLoaded ? (
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Link to="/dashboard" className={btnPrimary}>
                  {loggedIn ? "Go to Workspace" : "Get Started Free"}
                </Link>
                <a href="#features" className={btnOutline}>
                  Explore Features
                </a>
              </div>
            ) : (
              <div className="mt-8 h-12" />
            )}
          </div>

          <figure className="relative max-w-5xl mx-auto px-6 pb-20">
            <div
              role="img"
              aria-label="Sample WorkSphere dashboard preview"
              className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-xl overflow-hidden text-left"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900">
                <div className="flex gap-1.5" aria-hidden>
                  <span className="size-2.5 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                  <span className="size-2.5 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                  <span className="size-2.5 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                </div>
                <span className="text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400">
                  Sample Data
                </span>
              </div>
              <div className="p-4 sm:p-6 space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {sampleStats.map((s) => (
                    <div key={s.label} className={`${card} p-4`}>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        {s.label}
                      </p>
                      <p className={`text-2xl font-bold ${s.color}`}>
                        {s.value}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="grid md:grid-cols-2 gap-3">
                  <div className={`${card} p-4 space-y-4`}>
                    <p className="text-sm font-medium">Project Overview</p>
                    {sampleProjects.map((p) => (
                      <div key={p.name} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>{p.name}</span>
                          <span
                            className={`text-xs px-2 py-0.5 rounded ${statusStyle[p.status]}`}
                          >
                            {p.status}
                          </span>
                        </div>
                        <div className="w-full bg-zinc-200 dark:bg-zinc-800 rounded h-1.5">
                          <div
                            className="h-1.5 bg-blue-500 rounded"
                            style={{ width: `${p.progress}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className={`${card} p-4 space-y-3`}>
                    <p className="text-sm font-medium">Recent Activity</p>
                    {sampleTasks.map((t) => (
                      <div
                        key={t.title}
                        className="flex items-center justify-between text-sm"
                      >
                        <div>
                          <p>{t.title}</p>
                          <p className="text-xs text-zinc-500 dark:text-zinc-400 capitalize">
                            {t.type.toLowerCase()}
                          </p>
                        </div>
                        <span
                          className={`text-xs px-2 py-0.5 rounded ${statusStyle[t.status]}`}
                        >
                          {t.status.replace("_", " ")}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <figcaption className="mt-3 text-center text-xs text-zinc-500 dark:text-zinc-400">
              Illustrative preview using sample data, not live data.
            </figcaption>
          </figure>
        </section>

        {/* Features */}
        <section
          id="features"
          className="scroll-mt-20 py-20 bg-zinc-50 dark:bg-zinc-900/40"
        >
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-3xl font-semibold text-center">
              Everything your team needs to stay on track
            </h2>
            <p className="mt-3 text-center text-gray-600 dark:text-zinc-400">
              Available today, with more on the way.
            </p>
            <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map(({ icon: Icon, title, desc, soon }) => (
                <div
                  key={title}
                  className="p-5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 hover:border-zinc-300 dark:hover:border-zinc-700 transition"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-500/10">
                      <Icon className="size-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span
                      className={`text-xs px-2 py-0.5 rounded ${soon ? "bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-400" : "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-400"}`}
                    >
                      {soon ? "Coming Soon" : "Available"}
                    </span>
                  </div>
                  <h3 className="font-medium">{title}</h3>
                  <p className="mt-2 text-sm text-gray-600 dark:text-zinc-400">
                    {desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="scroll-mt-20 py-20">
          <div className="max-w-3xl mx-auto px-6">
            <h2 className="text-3xl font-semibold text-center">
              How WorkSphere works
            </h2>
            <ol className="mt-12 space-y-6">
              {steps.map((s, i) => (
                <li key={s.title} className="flex gap-4">
                  <span
                    className={`shrink-0 size-9 rounded-full flex items-center justify-center text-sm font-medium ${grad}`}
                  >
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="font-medium">{s.title}</h3>
                    <p className="mt-1 text-sm text-gray-600 dark:text-zinc-400">
                      {s.desc}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Integrations */}
        <section
          id="integrations"
          className="scroll-mt-20 py-20 bg-zinc-50 dark:bg-zinc-900/40"
        >
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-3xl font-semibold text-center">Integrations</h2>
            <p className="mt-3 text-center text-gray-600 dark:text-zinc-400">
              Planned, and not available yet.
            </p>
            <div className="mt-10 grid sm:grid-cols-2 gap-6">
              {integrations.map((i) => (
                <div
                  key={i.name}
                  className="p-5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 font-medium">
                      <PlugIcon className="size-4 text-blue-600 dark:text-blue-400" />{" "}
                      {i.name}
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-400">
                      Coming Soon
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-zinc-400">
                    {i.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* About */}
        <section id="about" className="scroll-mt-20 py-20">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-semibold">About WorkSphere</h2>
            <p className="mt-4 text-gray-600 dark:text-zinc-400">
              WorkSphere is a project management and team collaboration platform
              that helps teams organize work, collaborate effectively and keep
              an eye on project progress, all in one workspace.
            </p>
          </div>
        </section>

        {/* Final CTA */}
        <section className="pb-20">
          <div className="max-w-4xl mx-auto px-6">
            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-gradient-to-br from-blue-500/10 to-transparent p-10 text-center">
              <h2 className="text-3xl font-semibold">
                Ready to bring your team&apos;s work together?
              </h2>
              {isLoaded ? (
                <div className="mt-8 flex flex-wrap justify-center gap-3">
                  <Link to="/dashboard" className={btnPrimary}>
                    {loggedIn ? "Go to Workspace" : "Get Started Free"}
                  </Link>
                  {!loggedIn && (
                    <Link to="/dashboard" className={btnOutline}>
                      Sign In
                    </Link>
                  )}
                </div>
              ) : (
                <div className="mt-8 h-12" />
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-zinc-800">
        <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col sm:flex-row justify-between gap-8">
          <div>
            <a
              href="#top"
              className="flex items-center gap-2 font-semibold text-lg"
            >
              <span
                className={`size-8 rounded flex items-center justify-center text-sm ${grad}`}
              >
                W
              </span>
              WorkSphere
            </a>
            <p className="mt-3 text-sm text-gray-600 dark:text-zinc-400 max-w-xs">
              Projects, teams and progress in one workspace.
            </p>
          </div>
          <div className="flex gap-16">
            <div className="flex flex-col gap-2">
              <p className="text-xs uppercase tracking-wider text-gray-500 dark:text-zinc-500">
                Product
              </p>
              <a href="#features" className={footLink}>
                Features
              </a>
              <a href="#how-it-works" className={footLink}>
                How It Works
              </a>
              <a href="#integrations" className={footLink}>
                Integrations
              </a>
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-xs uppercase tracking-wider text-gray-500 dark:text-zinc-500">
                Company
              </p>
              <a href="#about" className={footLink}>
                About
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-200 dark:border-zinc-800 py-4 text-center text-xs text-gray-500 dark:text-zinc-500">
          © {new Date().getFullYear()} WorkSphere
        </div>
      </footer>
    </div>
  );
}
