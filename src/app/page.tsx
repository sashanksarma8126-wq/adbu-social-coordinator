import Link from "next/link";
import {
  FileText,
  Calendar,
  Image as ImageIcon,
  ArrowRight,
  Clock,
  CheckCircle2,
  Sparkles,
  School,
  Share2,
  PlusCircle,
  Tag,
  MapPin,
  CalendarDays,
  ShieldCheck,
} from "lucide-react";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  let draftsCount = 0;
  let calendarEventsCount = 0;
  let publishedCount = 0;
  let knowledgeCount = 0;
  let recentPosts: any[] = [];
  let upcomingEvents: any[] = [];

  try {
    const results = await Promise.all([
      prisma.contentItem.count({ where: { status: "DRAFT" } }),
      prisma.calendarEvent.count(),
      prisma.contentItem.count({ where: { status: "PUBLISHED" } }),
      prisma.knowledgeDocument.count(),
      prisma.contentItem.findMany({
        take: 4,
        include: { event: true },
        orderBy: [{ scheduledAt: "asc" }, { createdAt: "desc" }],
      }),
      prisma.calendarEvent.findMany({
        take: 3,
        include: { contentItems: true },
        orderBy: { date: "asc" },
      }),
    ]);

    draftsCount = results[0];
    calendarEventsCount = results[1];
    publishedCount = results[2];
    knowledgeCount = results[3];
    recentPosts = results[4];
    upcomingEvents = results[5];
  } catch (err) {
    console.warn("Database connection notice on initial page load:", err);
  }

  const stats = [
    {
      title: "Content Drafts",
      value: draftsCount.toString(),
      description: "Posts in drafting stage",
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      href: "/content?status=DRAFT",
    },
    {
      title: "Calendar Events",
      value: calendarEventsCount.toString(),
      description: "Official dates & observances",
      icon: CalendarDays,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
      href: "/calendar",
    },
    {
      title: "Published",
      value: publishedCount.toString(),
      description: "Live on official channels",
      icon: CheckCircle2,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      href: "/content?status=PUBLISHED",
    },
    {
      title: "Knowledge Base",
      value: knowledgeCount.toString(),
      description: "Campus guidelines & official facts",
      icon: School,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
      href: "/knowledge-base",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold mb-3">
            <School className="w-3.5 h-3.5" />
            Assam Don Bosco University • Central Communications Division
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-white mb-2">
            ADBU Social Coordinator
          </h1>
          <p className="text-slate-300 text-sm leading-relaxed mb-6">
            A zero-cost, privacy-first local platform for coordinating social media content and editorial calendars across
            all three ADBU campuses: Tapesia Gardens, Azara, and Kharguli Hills.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/calendar"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold transition-colors shadow-sm"
            >
              <Calendar className="w-4 h-4" />
              Open ADBU Calendar
            </Link>
            <Link
              href="/content"
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              Content Studio
            </Link>
            <Link
              href="/ai-coordinator"
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/80 rounded-lg text-xs font-semibold transition-colors"
            >
              <Sparkles className="w-4 h-4 text-blue-400" />
              AI Assistant (Offline Ready)
            </Link>
          </div>
        </div>

        {/* Decorative background shape */}
        <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Metrics Row (Live from SQLite) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.title}
              href={stat.href}
              className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm hover:shadow-md hover:border-slate-300 transition-all group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-slate-500">{stat.title}</span>
                <div className={`p-2 rounded-lg ${stat.bgColor} ${stat.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-bold text-slate-800">{stat.value}</span>
                <span className="text-xs text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 font-medium">
                  View <ArrowRight className="w-3 h-3" />
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">{stat.description}</p>
            </Link>
          );
        })}
      </div>

      {/* Main Grid: Recent Posts & Upcoming Events */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Post Queue */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between">
          <div>
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-slate-800 text-sm">Active Social Posts</h3>
                <p className="text-xs text-slate-500 mt-0.5">Posts synced with local SQLite database</p>
              </div>
              <Link
                href="/content"
                className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                View all in Studio <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="divide-y divide-slate-100">
              {recentPosts.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs">
                  No posts in queue yet. Create your first draft in Content Studio!
                </div>
              ) : (
                recentPosts.map((post) => {
                  let statusBadge = "bg-slate-100 text-slate-700 border-slate-200";
                  if (post.status === "SCHEDULED") statusBadge = "bg-indigo-50 text-indigo-700 border-indigo-200";
                  if (post.status === "PUBLISHED") statusBadge = "bg-emerald-50 text-emerald-700 border-emerald-200";

                  return (
                    <div
                      key={post.id}
                      className="p-4 hover:bg-slate-50/80 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-semibold text-slate-800 truncate">{post.title}</h4>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-slate-500">
                          {post.event && (
                            <span className="text-[10px] bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded font-medium border border-indigo-100">
                              Event: {post.event.title}
                            </span>
                          )}
                          <span className="font-medium text-slate-700">{post.department}</span>
                          <span>•</span>
                          <span className="text-blue-700 font-semibold">{post.platform}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 flex-shrink-0">
                        <span
                          className={`text-xs px-2.5 py-0.5 rounded-full font-medium border ${statusBadge}`}
                        >
                          {post.status}
                        </span>
                        <span className="text-xs text-slate-400 flex items-center gap-1 min-w-[80px] justify-end">
                          <Clock className="w-3 h-3" />
                          {post.scheduledAt
                            ? new Date(post.scheduledAt).toLocaleDateString("en-IN", {
                                month: "short",
                                day: "numeric",
                              })
                            : new Date(post.createdAt).toLocaleDateString("en-IN", {
                                month: "short",
                                day: "numeric",
                              })}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Upcoming Events Box */}
          <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-600 font-medium">
              Want to see all university dates?
            </span>
            <Link
              href="/calendar"
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              Open Full Calendar <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Right Column: Local Architecture & Calendar Snapshot */}
        <div className="space-y-6">
          {/* Upcoming Dates Preview */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-slate-800 text-sm flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-indigo-600" />
                Upcoming Dates
              </h3>
              <Link href="/calendar" className="text-[11px] text-blue-600 hover:underline">
                View all
              </Link>
            </div>

            <div className="space-y-2.5">
              {upcomingEvents.map((ev) => (
                <div
                  key={ev.id}
                  className="p-2.5 rounded-lg border border-slate-100 hover:border-slate-200 bg-slate-50/50 flex items-start gap-3"
                >
                  <div className="px-2 py-1 bg-white rounded border border-slate-200 text-center min-w-[45px] flex-shrink-0">
                    <span className="text-[9px] uppercase font-bold text-blue-600 block">
                      {new Date(ev.date).toLocaleDateString("en-IN", { month: "short" })}
                    </span>
                    <span className="text-sm font-extrabold text-slate-800 block leading-tight">
                      {new Date(ev.date).getDate()}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-slate-800 truncate">{ev.title}</p>
                    <p className="text-[11px] text-slate-500 truncate">{ev.category}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] text-slate-500 font-medium">
                        Content: {ev.contentItems.length > 0 ? "Covered" : "Opportunity"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Local Zero-Cost Environment Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <h3 className="font-semibold text-slate-800 text-sm mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Zero-Cost Local Architecture
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Step 2 ADBU Calendar is integrated with SQLite. All relationships between events and posts are maintained locally.
            </p>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Database</span>
                <span className="font-mono text-slate-700 font-semibold">SQLite (dev.db)</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Calendar Entities</span>
                <span className="font-mono text-slate-700 font-semibold">{calendarEventsCount} entries</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Origin Distinction</span>
                <span className="text-blue-700 font-semibold">Official / Observance / AI</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-500">Recurring Service Budget</span>
                <span className="text-emerald-700 font-semibold">₹0.00 / month</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
