"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  FileText,
  Plus,
  Search,
  Filter,
  Calendar,
  Clock,
  Trash2,
  CheckCircle2,
  AlertCircle,
  X,
  Share2,
  MapPin,
  Building2,
  Tag,
  Send,
  Loader2,
  CalendarDays,
  ExternalLink,
} from "lucide-react";

interface Post {
  id: string;
  title: string;
  caption: string;
  status: "DRAFT" | "SCHEDULED" | "PUBLISHED";
  platform: string;
  department: string;
  campus: string;
  tags: string;
  notes?: string | null;
  scheduledAt?: string | null;
  publishedAt?: string | null;
  eventId?: string | null;
  event?: {
    id: string;
    title: string;
    category: string;
    date: string;
  } | null;
  createdAt: string;
  updatedAt: string;
}

interface EventSummary {
  id: string;
  title: string;
  category: string;
}

const DEPARTMENTS = [
  "Office of the Registrar",
  "School of Technology",
  "School of Humanities & Social Sciences",
  "School of Fundamental & Applied Sciences",
  "School of Life Sciences",
  "School of Commerce & Management",
  "Admissions Office",
  "Campus Ministry & Student Affairs",
  "Training & Placement Cell",
  "Eco Club & Green Campus Initiative",
];

const CAMPUSES = [
  "All Campuses",
  "Tapesia Campus",
  "Azara Campus",
  "Kharguli Campus",
];

const PLATFORMS = [
  { id: "MULTI", name: "Cross-Platform (Multi)" },
  { id: "INSTAGRAM", name: "Instagram" },
  { id: "FACEBOOK", name: "Facebook" },
  { id: "LINKEDIN", name: "LinkedIn" },
  { id: "X", name: "X (Twitter)" },
  { id: "YOUTUBE", name: "YouTube" },
];

export default function ContentPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [events, setEvents] = useState<EventSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"ALL" | "DRAFT" | "SCHEDULED" | "PUBLISHED">("ALL");
  const [campusFilter, setCampusFilter] = useState("ALL");
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  // Form Fields
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [platform, setPlatform] = useState("MULTI");
  const [department, setDepartment] = useState(DEPARTMENTS[0]);
  const [campus, setCampus] = useState(CAMPUSES[1]);
  const [tags, setTags] = useState("#AssamDonBoscoUniversity, #ADBU");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<"DRAFT" | "SCHEDULED" | "PUBLISHED">("DRAFT");
  const [scheduledDate, setScheduledDate] = useState("");
  const [eventId, setEventId] = useState<string>("");

  // Fetch posts and events
  const fetchData = async () => {
    try {
      setLoading(true);
      const [postsRes, eventsRes] = await Promise.all([
        fetch("/api/posts"),
        fetch("/api/events"),
      ]);

      if (postsRes.ok) {
        const postsData = await postsRes.json();
        setPosts(postsData);
      }

      if (eventsRes.ok) {
        const eventsData = await eventsRes.json();
        setEvents(eventsData.map((e: any) => ({ id: e.id, title: e.title, category: e.category })));
      }
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter posts
  const filteredPosts = posts.filter((post) => {
    const matchesTab = activeTab === "ALL" || post.status === activeTab;
    const matchesCampus = campusFilter === "ALL" || post.campus === campusFilter;
    const matchesSearch =
      search === "" ||
      post.title.toLowerCase().includes(search.toLowerCase()) ||
      post.caption.toLowerCase().includes(search.toLowerCase()) ||
      post.department.toLowerCase().includes(search.toLowerCase()) ||
      post.tags.toLowerCase().includes(search.toLowerCase()) ||
      (post.event && post.event.title.toLowerCase().includes(search.toLowerCase()));

    return matchesTab && matchesCampus && matchesSearch;
  });

  const openCreateModal = () => {
    setEditingPost(null);
    setTitle("");
    setCaption("");
    setPlatform("MULTI");
    setDepartment(DEPARTMENTS[0]);
    setCampus(CAMPUSES[1]);
    setTags("#AssamDonBoscoUniversity, #ADBU");
    setNotes("");
    setStatus("DRAFT");
    setScheduledDate("");
    setEventId("");
    setFormError("");
    setIsModalOpen(true);
  };

  const openEditModal = (post: Post) => {
    setEditingPost(post);
    setTitle(post.title);
    setCaption(post.caption);
    setPlatform(post.platform);
    setDepartment(post.department);
    setCampus(post.campus);
    setTags(post.tags);
    setNotes(post.notes || "");
    setStatus(post.status);
    setScheduledDate(
      post.scheduledAt ? new Date(post.scheduledAt).toISOString().slice(0, 16) : ""
    );
    setEventId(post.eventId || "");
    setFormError("");
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !caption.trim()) {
      setFormError("Please enter both post title and caption.");
      return;
    }

    setSubmitting(true);
    setFormError("");

    try {
      const payload = {
        title,
        caption,
        platform,
        department,
        campus,
        tags,
        notes,
        status,
        scheduledAt: scheduledDate ? new Date(scheduledDate).toISOString() : null,
        eventId: eventId || null,
      };

      let res;
      if (editingPost) {
        res = await fetch(`/api/posts/${editingPost.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch("/api/posts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (res.ok) {
        setIsModalOpen(false);
        fetchData();
      } else {
        const data = await res.json();
        setFormError(data.error || "Failed to save post");
      }
    } catch (err) {
      setFormError("Network error while saving post");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this post draft?")) return;

    try {
      const res = await fetch(`/api/posts/${id}`, { method: "DELETE" });
      if (res.ok) {
        setPosts((prev) => prev.filter((p) => p.id !== id));
      }
    } catch (err) {
      alert("Error deleting post");
    }
  };

  const handleQuickStatusChange = async (post: Post, newStatus: "DRAFT" | "SCHEDULED" | "PUBLISHED") => {
    try {
      const res = await fetch(`/api/posts/${post.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
          publishedAt: newStatus === "PUBLISHED" ? new Date().toISOString() : undefined,
        }),
      });

      if (res.ok) {
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Content Studio & Social Posts</h2>
          <p className="text-xs text-slate-500 mt-1">
            Create, manage, and coordinate social media content for Assam Don Bosco University
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Create New Post Draft
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Status Tabs */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs font-medium text-slate-600 overflow-x-auto">
          {(["ALL", "DRAFT", "SCHEDULED", "PUBLISHED"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-md transition-all cursor-pointer capitalize whitespace-nowrap ${
                activeTab === tab
                  ? "bg-white text-slate-900 shadow-sm font-semibold"
                  : "hover:text-slate-900"
              }`}
            >
              {tab === "ALL" ? "All Posts" : tab.toLowerCase()}
              <span className="ml-1.5 text-[10px] px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-700">
                {tab === "ALL"
                  ? posts.length
                  : posts.filter((p) => p.status === tab).length}
              </span>
            </button>
          ))}
        </div>

        {/* Search & Campus Filter */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search posts or tags..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <select
            value={campusFilter}
            onChange={(e) => setCampusFilter(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="ALL">All Campuses</option>
            {CAMPUSES.filter((c) => c !== "All Campuses").map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Posts Grid */}
      {loading ? (
        <div className="p-12 text-center bg-white rounded-xl border border-slate-200">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600 mx-auto mb-2" />
          <p className="text-xs text-slate-500">Loading university posts from SQLite...</p>
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-xl border border-slate-200">
          <FileText className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h4 className="text-sm font-semibold text-slate-700">No posts found</h4>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            {search
              ? "No posts matched your search filters."
              : "No posts in this category yet. Click 'Create New Post Draft' to add one."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPosts.map((post) => {
            let statusBadge = "bg-slate-100 text-slate-700 border-slate-200";
            if (post.status === "SCHEDULED") statusBadge = "bg-indigo-50 text-indigo-700 border-indigo-200";
            if (post.status === "PUBLISHED") statusBadge = "bg-emerald-50 text-emerald-700 border-emerald-200";

            return (
              <div
                key={post.id}
                className="bg-white rounded-xl border border-slate-200/90 shadow-sm hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between overflow-hidden"
              >
                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${statusBadge}`}
                    >
                      {post.status}
                    </span>
                    <span className="text-[11px] font-medium text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                      {post.platform}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-800 line-clamp-2 leading-snug">
                      {post.title}
                    </h3>
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-1">
                      <Building2 className="w-3 h-3 text-slate-400 flex-shrink-0" />
                      <span className="truncate">{post.department}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-0.5">
                      <MapPin className="w-3 h-3 text-slate-400 flex-shrink-0" />
                      <span className="truncate">{post.campus}</span>
                    </div>
                  </div>

                  {/* Connected Calendar Event Badge */}
                  {post.event && (
                    <div className="inline-flex items-center gap-1.5 text-[11px] bg-indigo-50/70 text-indigo-800 px-2.5 py-1 rounded-md border border-indigo-200/70 font-medium truncate max-w-full">
                      <CalendarDays className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0" />
                      <span className="truncate">Event: {post.event.title}</span>
                    </div>
                  )}

                  <p className="text-xs text-slate-600 line-clamp-4 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    {post.caption}
                  </p>

                  {post.tags && (
                    <div className="flex items-center gap-1 text-[11px] text-blue-600 font-medium truncate">
                      <Tag className="w-3 h-3 text-blue-400 flex-shrink-0" />
                      <span className="truncate">{post.tags}</span>
                    </div>
                  )}

                  {post.scheduledAt && (
                    <div className="flex items-center gap-1.5 text-xs text-indigo-700 font-medium bg-indigo-50/60 px-2.5 py-1 rounded-md border border-indigo-100">
                      <Clock className="w-3.5 h-3.5" />
                      <span>
                        Scheduled: {new Date(post.scheduledAt).toLocaleString("en-IN", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  )}
                </div>

                {/* Card Action Footer */}
                <div className="p-3 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    {post.status === "DRAFT" && (
                      <button
                        onClick={() => handleQuickStatusChange(post, "SCHEDULED")}
                        className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 cursor-pointer"
                      >
                        Schedule
                      </button>
                    )}
                    {post.status === "SCHEDULED" && (
                      <button
                        onClick={() => handleQuickStatusChange(post, "PUBLISHED")}
                        className="text-[11px] font-semibold text-emerald-600 hover:text-emerald-800 cursor-pointer"
                      >
                        Mark Published
                      </button>
                    )}
                    {post.status === "PUBLISHED" && (
                      <button
                        onClick={() => handleQuickStatusChange(post, "DRAFT")}
                        className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 cursor-pointer"
                      >
                        Re-draft
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditModal(post)}
                      className="text-[11px] text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="text-[11px] text-red-500 hover:text-red-700 p-1 cursor-pointer"
                      title="Delete post"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in duration-150">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="text-base font-bold text-slate-800">
                  {editingPost ? "Edit Social Post" : "Create New Social Post Draft"}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Assam Don Bosco University • Social Media Content Studio
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
              {formError && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Post Title / Headline *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. ADBU Convocation 2026 - Registration Notice"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              {/* Link to Calendar Event */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Connect to University Calendar Event (Optional)
                </label>
                <select
                  value={eventId}
                  onChange={(e) => setEventId(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-700"
                >
                  <option value="">-- No linked event (General Post) --</option>
                  {events.map((ev) => (
                    <option key={ev.id} value={ev.id}>
                      {ev.title} ({ev.category})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Department / Division *
                  </label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    {DEPARTMENTS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Target Campus *
                  </label>
                  <select
                    value={campus}
                    onChange={(e) => setCampus(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    {CAMPUSES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Social Media Platform *
                  </label>
                  <select
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    {PLATFORMS.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Post Status *
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="DRAFT">Draft (Working Progress)</option>
                    <option value="SCHEDULED">Scheduled</option>
                    <option value="PUBLISHED">Published</option>
                  </select>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-semibold text-slate-700">
                    Post Caption / Copy *
                  </label>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {caption.length} characters
                  </span>
                </div>
                <textarea
                  required
                  rows={5}
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Draft your announcement copy here..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-sans"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Hashtags
                  </label>
                  <input
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="#ADBU, #AssamDonBosco, #TechFest"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Schedule Publishing Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Internal Editorial Notes (Optional)
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Awaiting approval from Registrar; needs flyer asset attached"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-100 rounded-lg font-semibold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-1.5 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-sm transition-colors cursor-pointer disabled:opacity-50"
                >
                  {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  {editingPost ? "Update Post" : "Save Post Draft"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
