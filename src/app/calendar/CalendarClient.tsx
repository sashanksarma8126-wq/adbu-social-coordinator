"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Calendar as CalendarIcon,
  Clock,
  Plus,
  Search,
  Filter,
  MapPin,
  Building2,
  Share2,
  Trash2,
  Edit2,
  CheckCircle2,
  AlertCircle,
  X,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Globe,
  Bot,
  Sparkles,
  FileText,
  Tag,
  Info,
  Loader2,
  ExternalLink,
  CalendarDays,
  ListFilter,
} from "lucide-react";

export interface ContentItemSummary {
  id: string;
  title: string;
  status: "DRAFT" | "SCHEDULED" | "PUBLISHED";
  platform: string;
  scheduledAt?: string | null;
  publishedAt?: string | null;
}

export interface CalendarEventItem {
  id: string;
  title: string;
  description: string;
  date: string;
  startTime?: string | null;
  endTime?: string | null;
  location?: string | null;
  category: string;
  department?: string | null;
  organizer?: string | null;
  source?: string | null;
  notes?: string | null;
  status: "Planned" | "Confirmed" | "Completed" | "Cancelled";
  informationType: "OFFICIAL_ADBU" | "EXTERNAL_OBSERVANCE" | "AI_SUGGESTION";
  contentItems: ContentItemSummary[];
  createdAt?: string;
  updatedAt?: string;
}

export const CATEGORIES = [
  "All Categories",
  "Academic Calendar",
  "University Event",
  "Department Event",
  "Workshop / Seminar",
  "Conference",
  "Student Activity",
  "Important University Date",
  "International / National Observance",
  "Admission-related Date",
  "Examination-related Date",
] as const;

export const STATUS_OPTIONS = ["All Statuses", "Planned", "Confirmed", "Completed", "Cancelled"] as const;

export const INFO_TYPE_OPTIONS = [
  { id: "ALL", label: "All Origins" },
  { id: "OFFICIAL_ADBU", label: "Official ADBU Information" },
  { id: "EXTERNAL_OBSERVANCE", label: "External Observance / Opportunity" },
  { id: "AI_SUGGESTION", label: "AI Suggestions" },
];

export const DEPARTMENTS = [
  "Office of the Registrar",
  "School of Technology",
  "School of Humanities & Social Sciences",
  "School of Fundamental & Applied Sciences",
  "School of Life Sciences",
  "School of Commerce & Management",
  "Admissions Office",
  "Office of Controller of Examinations",
  "Campus Ministry & Student Affairs",
  "Training & Placement Cell",
  "Eco Club & Green Campus Initiative",
];

export default function CalendarClient({
  initialEvents,
}: {
  initialEvents: CalendarEventItem[];
}) {
  const [events, setEvents] = useState<CalendarEventItem[]>(initialEvents);
  const [loading, setLoading] = useState(false);

  // Filters & Search
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [infoTypeFilter, setInfoTypeFilter] = useState("ALL");
  const [viewMode, setViewMode] = useState<"monthly" | "list">("monthly");
  const [selectedDayEvents, setSelectedDayEvents] = useState<string | null>(null);

  // Calendar Date State (default: current view date)
  const [currentDate, setCurrentDate] = useState(() => new Date());

  // Modal State for Event
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEventItem | null>(null);
  const [submittingEvent, setSubmittingEvent] = useState(false);
  const [eventFormError, setEventFormError] = useState("");

  // Event Form Fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState<string>(CATEGORIES[1]);
  const [department, setDepartment] = useState(DEPARTMENTS[0]);
  const [organizer, setOrganizer] = useState("Communications Division");
  const [source, setSource] = useState("Registrar Notification");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<"Planned" | "Confirmed" | "Completed" | "Cancelled">("Planned");
  const [informationType, setInformationType] = useState<"OFFICIAL_ADBU" | "EXTERNAL_OBSERVANCE" | "AI_SUGGESTION">("OFFICIAL_ADBU");

  // Content Creation Quick Modal State
  const [isContentModalOpen, setIsContentModalOpen] = useState(false);
  const [contentEvent, setContentEvent] = useState<CalendarEventItem | null>(null);
  const [contentTitle, setContentTitle] = useState("");
  const [contentCaption, setContentCaption] = useState("");
  const [contentPlatform, setContentPlatform] = useState("MULTI");
  const [contentStatus, setContentStatus] = useState<"DRAFT" | "SCHEDULED" | "PUBLISHED">("DRAFT");
  const [contentScheduledAt, setContentScheduledAt] = useState("");
  const [submittingContent, setSubmittingContent] = useState(false);
  const [contentFormError, setContentFormError] = useState("");

  const refreshEvents = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/events");
      if (res.ok) {
        const data = await res.json();
        setEvents(data);
      }
    } catch (err) {
      console.error("Failed to load events:", err);
    } finally {
      setLoading(false);
    }
  };

  // Filtered Events
  const filteredEvents = useMemo(() => {
    return events.filter((evt) => {
      const matchesSearch =
        search === "" ||
        evt.title.toLowerCase().includes(search.toLowerCase()) ||
        evt.description.toLowerCase().includes(search.toLowerCase()) ||
        (evt.location && evt.location.toLowerCase().includes(search.toLowerCase())) ||
        (evt.department && evt.department.toLowerCase().includes(search.toLowerCase())) ||
        (evt.organizer && evt.organizer.toLowerCase().includes(search.toLowerCase())) ||
        (evt.source && evt.source.toLowerCase().includes(search.toLowerCase()));

      const matchesCat = categoryFilter === "All Categories" || evt.category === categoryFilter;
      const matchesStatus = statusFilter === "All Statuses" || evt.status === statusFilter;
      const matchesInfoType = infoTypeFilter === "ALL" || evt.informationType === infoTypeFilter;

      const matchesSelectedDay =
        selectedDayEvents === null ||
        new Date(evt.date).toISOString().slice(0, 10) === selectedDayEvents;

      return matchesSearch && matchesCat && matchesStatus && matchesInfoType && matchesSelectedDay;
    });
  }, [events, search, categoryFilter, statusFilter, infoTypeFilter, selectedDayEvents]);

  // Calendar Days computation
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-indexed

  const calendarDays = useMemo(() => {
    const firstDayIndex = new Date(year, month, 1).getDay(); // Sun = 0
    const totalDays = new Date(year, month + 1, 0).getDate();

    const days = [];
    // Leading empty slots
    for (let i = 0; i < firstDayIndex; i++) {
      days.push(null);
    }
    // Days of month
    for (let d = 1; d <= totalDays; d++) {
      const dateString = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      const dayEvents = events.filter((e) => {
        const eStr = new Date(e.date).toISOString().slice(0, 10);
        return eStr === dateString;
      });
      days.push({ day: d, dateString, events: dayEvents });
    }
    return days;
  }, [year, month, events]);

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    setSelectedDayEvents(null);
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    setSelectedDayEvents(null);
  };

  const resetToday = () => {
    setCurrentDate(new Date());
    setSelectedDayEvents(null);
  };

  // Open Create Event Modal
  const openCreateModal = (defaultDateString?: string) => {
    setEditingEvent(null);
    setTitle("");
    setDescription("");
    setDate(defaultDateString || new Date().toISOString().slice(0, 10));
    setStartTime("");
    setEndTime("");
    setLocation("Tapesia Campus");
    setCategory(CATEGORIES[1]);
    setDepartment(DEPARTMENTS[0]);
    setOrganizer("Communications Division");
    setSource("Registrar Notification");
    setNotes("");
    setStatus("Planned");
    setInformationType("OFFICIAL_ADBU");
    setEventFormError("");
    setIsEventModalOpen(true);
  };

  // Open Edit Event Modal
  const openEditModal = (evt: CalendarEventItem) => {
    setEditingEvent(evt);
    setTitle(evt.title);
    setDescription(evt.description);
    setDate(new Date(evt.date).toISOString().slice(0, 10));
    setStartTime(evt.startTime || "");
    setEndTime(evt.endTime || "");
    setLocation(evt.location || "");
    setCategory(evt.category);
    setDepartment(evt.department || "");
    setOrganizer(evt.organizer || "");
    setSource(evt.source || "");
    setNotes(evt.notes || "");
    setStatus(evt.status);
    setInformationType(evt.informationType);
    setEventFormError("");
    setIsEventModalOpen(true);
  };

  const handleEventSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !date || !category) {
      setEventFormError("Title, description, date, and category are required.");
      return;
    }

    setSubmittingEvent(true);
    setEventFormError("");

    try {
      const payload = {
        title,
        description,
        date: new Date(date).toISOString(),
        startTime: startTime || null,
        endTime: endTime || null,
        location: location || null,
        category,
        department: department || null,
        organizer: organizer || null,
        source: source || null,
        notes: notes || null,
        status,
        informationType,
      };

      let res;
      if (editingEvent) {
        res = await fetch(`/api/events/${editingEvent.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch("/api/events", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (res.ok) {
        setIsEventModalOpen(false);
        refreshEvents();
      } else {
        const data = await res.json();
        setEventFormError(data.error || "Failed to save calendar event");
      }
    } catch (err) {
      setEventFormError("Network error while saving calendar event");
    } finally {
      setSubmittingEvent(false);
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (!confirm("Are you sure you want to delete this calendar entry?")) return;

    try {
      const res = await fetch(`/api/events/${id}`, { method: "DELETE" });
      if (res.ok) {
        setEvents((prev) => prev.filter((e) => e.id !== id));
      } else {
        alert("Failed to delete event");
      }
    } catch (err) {
      alert("Network error while deleting event");
    }
  };

  // Open Quick Content Creation for Event
  const openContentModal = (evt: CalendarEventItem) => {
    setContentEvent(evt);
    setContentTitle(`${evt.title} - Announcement`);
    setContentCaption(
      `📢 ${evt.title}\n\n${evt.description}\n\n📍 Location: ${evt.location || "Assam Don Bosco University"}\n🗓 Date: ${new Date(evt.date).toLocaleDateString("en-IN", { month: "long", day: "numeric", year: "numeric" })}\n\n#AssamDonBoscoUniversity #ADBU #CarpeDiem`
    );
    setContentPlatform("MULTI");
    setContentStatus("DRAFT");
    setContentScheduledAt(new Date(evt.date).toISOString().slice(0, 16));
    setContentFormError("");
    setIsContentModalOpen(true);
  };

  const handleContentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contentTitle.trim() || !contentCaption.trim()) {
      setContentFormError("Title and caption are required.");
      return;
    }

    setSubmittingContent(true);
    setContentFormError("");

    try {
      const payload = {
        title: contentTitle.trim(),
        caption: contentCaption.trim(),
        platform: contentPlatform,
        department: contentEvent?.department || "General Communications",
        campus: contentEvent?.location?.includes("Azara") ? "Azara Campus" : "Tapesia Campus",
        tags: "#AssamDonBoscoUniversity, #ADBU",
        notes: `Created for calendar event: ${contentEvent?.title}`,
        status: contentStatus,
        scheduledAt: contentScheduledAt ? new Date(contentScheduledAt).toISOString() : null,
        eventId: contentEvent?.id,
      };

      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setIsContentModalOpen(false);
        refreshEvents();
      } else {
        const data = await res.json();
        setContentFormError(data.error || "Failed to create content item");
      }
    } catch (err) {
      setContentFormError("Network error while creating content item");
    } finally {
      setSubmittingContent(false);
    }
  };

  // Content Opportunity Helper
  const getOpportunityDetails = (evt: CalendarEventItem) => {
    const items = evt.contentItems || [];
    if (items.length === 0) {
      return {
        label: "No content",
        badgeClass: "bg-slate-100 text-slate-600 border-slate-200",
        description: "No social media coverage planned yet",
        hasContent: false,
      };
    }

    const hasPublished = items.some((i) => i.status === "PUBLISHED");
    if (hasPublished) {
      return {
        label: "Published",
        badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
        description: `${items.length} post(s) published`,
        hasContent: true,
      };
    }

    const hasScheduled = items.some((i) => i.status === "SCHEDULED");
    if (hasScheduled) {
      return {
        label: "Approved",
        badgeClass: "bg-indigo-50 text-indigo-700 border-indigo-200",
        description: `${items.length} post(s) queued & approved`,
        hasContent: true,
      };
    }

    return {
      label: "Draft exists",
      badgeClass: "bg-amber-50 text-amber-700 border-amber-200",
      description: `${items.length} draft post(s) in studio`,
      hasContent: true,
    };
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-800">ADBU Calendar & Editorial System</h2>
            <span className="text-[11px] px-2 py-0.5 rounded font-semibold bg-blue-50 text-blue-700 border border-blue-200">
              Step 2
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Coordinate official university dates, departmental seminars, exams, and national observances with social media coverage
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-100 p-1 rounded-lg text-xs font-semibold">
            <button
              onClick={() => setViewMode("monthly")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                viewMode === "monthly" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <CalendarDays className="w-3.5 h-3.5 text-blue-600" />
              Monthly Grid
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                viewMode === "list" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <ListFilter className="w-3.5 h-3.5 text-blue-600" />
              Upcoming List
            </button>
          </div>

          <button
            onClick={() => openCreateModal()}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add Calendar Entry
          </button>
        </div>
      </div>

      {/* Information Type Legend & Notice Banner */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 font-semibold text-slate-700">
          <Info className="w-4 h-4 text-slate-500" />
          <span>Information Origin & Authority:</span>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 bg-blue-50 text-blue-800 border border-blue-200 px-2.5 py-1 rounded-md font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            <span>Official ADBU Information</span>
          </div>
          <div className="flex items-center gap-1.5 bg-purple-50 text-purple-800 border border-purple-200 px-2.5 py-1 rounded-md font-medium">
            <Globe className="w-3.5 h-3.5 text-purple-600" />
            <span>External Observance / Opportunity</span>
          </div>
          <div className="flex items-center gap-1.5 bg-amber-50 text-amber-800 border border-dashed border-amber-300 px-2.5 py-1 rounded-md font-medium">
            <Bot className="w-3.5 h-3.5 text-amber-600" />
            <span>AI Suggestion (Never Official until Approved)</span>
          </div>
        </div>
      </div>

      {/* Filters & Search Row */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search title, description, location..."
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Information Type Filter */}
          <div>
            <select
              value={infoTypeFilter}
              onChange={(e) => setInfoTypeFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              {INFO_TYPE_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Active Day Filter Notification */}
        {selectedDayEvents && (
          <div className="flex items-center justify-between bg-blue-50 text-blue-800 px-3 py-1.5 rounded-lg text-xs border border-blue-200">
            <span>
              Filtering events for date: <strong>{selectedDayEvents}</strong>
            </span>
            <button
              onClick={() => setSelectedDayEvents(null)}
              className="text-blue-600 hover:text-blue-900 font-semibold cursor-pointer underline text-[11px]"
            >
              Clear Day Filter
            </button>
          </div>
        )}
      </div>

      {/* MONTHLY CALENDAR GRID VIEW */}
      {viewMode === "monthly" && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Month Header Navigation */}
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
            <div className="flex items-center gap-3">
              <h3 className="text-base font-bold text-slate-800">
                {currentDate.toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
              </h3>
              <button
                onClick={resetToday}
                className="text-[11px] font-semibold px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer shadow-2xs"
              >
                Today
              </button>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={prevMonth}
                className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-600 cursor-pointer transition-colors"
                title="Previous Month"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={nextMonth}
                className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-600 cursor-pointer transition-colors"
                title="Next Month"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Days of Week Header */}
          <div className="grid grid-cols-7 border-b border-slate-100 text-center text-xs font-bold text-slate-400 py-2.5 bg-slate-50/40">
            <div>SUN</div>
            <div>MON</div>
            <div>TUE</div>
            <div>WED</div>
            <div>THU</div>
            <div>FRI</div>
            <div>SAT</div>
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 divide-x divide-y divide-slate-100 min-h-[460px]">
            {calendarDays.map((item, idx) => {
              if (!item) {
                return <div key={`empty-${idx}`} className="bg-slate-50/30 p-2 min-h-[90px]" />;
              }

              const isToday =
                new Date().toISOString().slice(0, 10) === item.dateString;
              const isSelected = selectedDayEvents === item.dateString;

              return (
                <div
                  key={item.dateString}
                  onClick={() =>
                    setSelectedDayEvents(isSelected ? null : item.dateString)
                  }
                  className={`p-2 min-h-[95px] flex flex-col justify-between transition-colors cursor-pointer group hover:bg-blue-50/30 ${
                    isSelected
                      ? "bg-blue-50/60 ring-2 ring-blue-500 ring-inset"
                      : isToday
                      ? "bg-amber-50/20"
                      : "bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full ${
                        isToday
                          ? "bg-blue-600 text-white"
                          : isSelected
                          ? "bg-blue-100 text-blue-800"
                          : "text-slate-700"
                      }`}
                    >
                      {item.day}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openCreateModal(item.dateString);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-0.5 text-blue-600 hover:text-blue-800 rounded transition-opacity"
                      title="Add event on this date"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Day Events Pills */}
                  <div className="space-y-1 mt-1 flex-1 overflow-hidden">
                    {item.events.slice(0, 2).map((ev) => {
                      let pillBg = "bg-blue-50 text-blue-700 border-blue-200";
                      if (ev.informationType === "EXTERNAL_OBSERVANCE") {
                        pillBg = "bg-purple-50 text-purple-700 border-purple-200";
                      } else if (ev.informationType === "AI_SUGGESTION") {
                        pillBg = "bg-amber-50 text-amber-700 border-amber-200 border-dashed";
                      }

                      return (
                        <div
                          key={ev.id}
                          className={`text-[10px] px-1.5 py-0.5 rounded truncate font-medium border ${pillBg}`}
                          title={`${ev.title} (${ev.category})`}
                        >
                          {ev.title}
                        </div>
                      );
                    })}
                    {item.events.length > 2 && (
                      <span className="text-[9px] font-bold text-slate-400 block">
                        +{item.events.length - 2} more
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* UPCOMING & FILTERED EVENTS LIST */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2 font-semibold text-sm text-slate-800">
            <CalendarIcon className="w-4 h-4 text-blue-600" />
            <span>
              {selectedDayEvents
                ? `Events for ${selectedDayEvents}`
                : "Upcoming Calendar Entries & Social Opportunities"}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
              {filteredEvents.length}
            </span>
          </div>
          <span className="text-xs text-slate-400 hidden sm:block">
            Connected to Content Studio
          </span>
        </div>

        {filteredEvents.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            <CalendarIcon className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="font-semibold text-slate-700 text-sm">No calendar entries found</p>
            <p className="mt-1">
              {search || categoryFilter !== "All Categories" || statusFilter !== "All Statuses"
                ? "No entries match your search criteria. Try resetting filters."
                : "No entries scheduled yet. Click 'Add Calendar Entry' to create one."}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredEvents.map((evt) => {
              const opportunity = getOpportunityDetails(evt);

              // Status badge style
              let statusClass = "bg-slate-100 text-slate-700 border-slate-200";
              if (evt.status === "Confirmed") statusClass = "bg-emerald-50 text-emerald-700 border-emerald-200";
              if (evt.status === "Completed") statusClass = "bg-blue-50 text-blue-700 border-blue-200";
              if (evt.status === "Cancelled") statusClass = "bg-red-50 text-red-700 border-red-200 line-through";

              // Origin badge style
              let originBadge = (
                <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-medium border border-blue-200">
                  <ShieldCheck className="w-3 h-3 text-blue-600" />
                  Official ADBU Info
                </span>
              );

              if (evt.informationType === "EXTERNAL_OBSERVANCE") {
                originBadge = (
                  <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded bg-purple-50 text-purple-700 font-medium border border-purple-200">
                    <Globe className="w-3 h-3 text-purple-600" />
                    External Observance
                  </span>
                );
              } else if (evt.informationType === "AI_SUGGESTION") {
                originBadge = (
                  <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded bg-amber-50 text-amber-800 font-medium border border-dashed border-amber-300">
                    <Bot className="w-3 h-3 text-amber-600" />
                    AI Suggestion (Not Official)
                  </span>
                );
              }

              return (
                <div
                  key={evt.id}
                  className="p-5 hover:bg-slate-50/70 transition-colors flex flex-col lg:flex-row lg:items-start justify-between gap-5"
                >
                  {/* Left Column: Event Details */}
                  <div className="flex items-start gap-4 flex-1">
                    {/* Date Block */}
                    <div className="px-3.5 py-2.5 bg-blue-50 text-blue-800 rounded-xl text-center border border-blue-100 flex-shrink-0 min-w-[75px]">
                      <span className="text-[10px] uppercase font-bold tracking-wider block text-blue-600">
                        {new Date(evt.date).toLocaleDateString("en-IN", { month: "short" })}
                      </span>
                      <span className="text-xl font-extrabold block leading-tight">
                        {new Date(evt.date).getDate()}
                      </span>
                      <span className="text-[10px] text-blue-500 font-medium block">
                        {new Date(evt.date).getFullYear()}
                      </span>
                    </div>

                    {/* Content Details */}
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        {originBadge}
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                          {evt.category}
                        </span>
                        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${statusClass}`}>
                          {evt.status}
                        </span>
                      </div>

                      <h3 className="text-sm font-bold text-slate-800 leading-snug">
                        {evt.title}
                      </h3>

                      <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
                        {evt.description}
                      </p>

                      {/* Meta Information Tags */}
                      <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-slate-500">
                        {(evt.startTime || evt.endTime) && (
                          <span className="flex items-center gap-1 font-medium text-slate-600">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            {evt.startTime || "TBD"} {evt.endTime ? `- ${evt.endTime}` : ""}
                          </span>
                        )}
                        {evt.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                            {evt.location}
                          </span>
                        )}
                        {evt.department && (
                          <span className="flex items-center gap-1">
                            <Building2 className="w-3.5 h-3.5 text-slate-400" />
                            {evt.department}
                          </span>
                        )}
                        {evt.organizer && (
                          <span className="text-slate-500">
                            Org: <span className="text-slate-700">{evt.organizer}</span>
                          </span>
                        )}
                      </div>

                      {/* Source & Notes */}
                      {(evt.source || evt.notes) && (
                        <div className="text-[11px] text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-100 mt-2 space-y-0.5">
                          {evt.source && (
                            <div>
                              <strong className="text-slate-600">Source:</strong> {evt.source}
                            </div>
                          )}
                          {evt.notes && (
                            <div>
                              <strong className="text-slate-600">Notes:</strong> {evt.notes}
                            </div>
                          )}
                        </div>
                      )}

                      {/* AI Warning if Suggestion */}
                      {evt.informationType === "AI_SUGGESTION" && (
                        <div className="text-[11px] text-amber-800 bg-amber-50/80 p-2 rounded-lg border border-amber-200 mt-2 flex items-center gap-1.5">
                          <AlertCircle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                          <span>
                            <strong>AI Suggested Event:</strong> This entry is an automated campaign proposal. It is strictly not an official university event until formally ratified by the department.
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Social Media Opportunity Box & Actions */}
                  <div className="w-full lg:w-72 flex-shrink-0 space-y-3">
                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                          <Share2 className="w-3.5 h-3.5 text-blue-600" />
                          Social Media Opportunity
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${opportunity.badgeClass}`}>
                          {opportunity.label}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-500 leading-snug">
                        {opportunity.description}
                      </p>

                      {/* Linked Content Items list */}
                      {evt.contentItems && evt.contentItems.length > 0 && (
                        <div className="space-y-1 pt-1 border-t border-slate-200/60">
                          {evt.contentItems.map((ci) => (
                            <div
                              key={ci.id}
                              className="text-[10px] bg-white p-1.5 rounded border border-slate-200 flex items-center justify-between"
                            >
                              <span className="truncate max-w-[140px] text-slate-700 font-medium">
                                {ci.title}
                              </span>
                              <span className="text-blue-700 font-semibold">{ci.platform}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="flex flex-col gap-1.5 mt-2">
                        <Link
                          href={`/ai-coordinator?eventId=${evt.id}`}
                          className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white rounded-lg text-xs font-bold shadow-2xs transition-all cursor-pointer"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-blue-200" />
                          Create Content (AI Coordinator)
                        </Link>
                        <button
                          onClick={() => openContentModal(evt)}
                          className="w-full inline-flex items-center justify-center gap-1 px-2.5 py-1 text-slate-500 hover:text-slate-800 text-[11px] font-medium transition-colors cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                          Quick Manual Post
                        </button>
                      </div>
                    </div>

                    {/* Edit & Delete Action Buttons */}
                    <div className="flex items-center justify-end gap-2 text-xs">
                      <button
                        onClick={() => openEditModal(evt)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-slate-600 hover:text-blue-600 border border-slate-200 hover:border-blue-300 rounded-md bg-white transition-colors cursor-pointer"
                      >
                        <Edit2 className="w-3 h-3" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteEvent(evt.id)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-red-600 hover:text-red-700 border border-slate-200 hover:border-red-300 rounded-md bg-white transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ADD / EDIT EVENT MODAL */}
      {isEventModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in duration-150">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="text-base font-bold text-slate-800">
                  {editingEvent ? "Edit Calendar Entry" : "Add New ADBU Calendar Entry"}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Assam Don Bosco University Editorial & Academic Scheduling Desk
                </p>
              </div>
              <button
                onClick={() => setIsEventModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEventSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
              {eventFormError && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{eventFormError}</span>
                </div>
              )}

              {/* Title */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Event Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. ADBU Convocation 2026 or Technovation National Hackathon"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Description *
                </label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detailed description of the event or observance..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              {/* Date & Time Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Date *</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Start Time (Optional)</label>
                  <input
                    type="text"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    placeholder="e.g. 10:00 AM"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">End Time (Optional)</label>
                  <input
                    type="text"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    placeholder="e.g. 02:00 PM"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              {/* Category & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Entry Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    {CATEGORIES.filter((c) => c !== "All Categories").map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Status *
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="Planned">Planned</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              {/* Information Origin (Important distinction) */}
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                <label className="block font-bold text-slate-800">
                  Information Authority & Origin *
                </label>
                <p className="text-[11px] text-slate-500 mb-2">
                  Official notices represent verified university directives; external observances provide content opportunities; AI suggestions require staff ratification.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <label
                    className={`p-2.5 rounded-lg border flex flex-col justify-between cursor-pointer transition-all ${
                      informationType === "OFFICIAL_ADBU"
                        ? "bg-blue-50/80 border-blue-500 text-blue-900"
                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-bold mb-1">
                      <input
                        type="radio"
                        name="infoType"
                        value="OFFICIAL_ADBU"
                        checked={informationType === "OFFICIAL_ADBU"}
                        onChange={() => setInformationType("OFFICIAL_ADBU")}
                        className="text-blue-600"
                      />
                      <span>Official ADBU</span>
                    </div>
                    <span className="text-[10px] text-slate-500">
                      Authorized by Registrar / University Gazette
                    </span>
                  </label>

                  <label
                    className={`p-2.5 rounded-lg border flex flex-col justify-between cursor-pointer transition-all ${
                      informationType === "EXTERNAL_OBSERVANCE"
                        ? "bg-purple-50/80 border-purple-500 text-purple-900"
                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-bold mb-1">
                      <input
                        type="radio"
                        name="infoType"
                        value="EXTERNAL_OBSERVANCE"
                        checked={informationType === "EXTERNAL_OBSERVANCE"}
                        onChange={() => setInformationType("EXTERNAL_OBSERVANCE")}
                        className="text-purple-600"
                      />
                      <span>Observance</span>
                    </div>
                    <span className="text-[10px] text-slate-500">
                      National / International content day
                    </span>
                  </label>

                  <label
                    className={`p-2.5 rounded-lg border flex flex-col justify-between cursor-pointer transition-all ${
                      informationType === "AI_SUGGESTION"
                        ? "bg-amber-50/80 border-amber-500 text-amber-900"
                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-bold mb-1">
                      <input
                        type="radio"
                        name="infoType"
                        value="AI_SUGGESTION"
                        checked={informationType === "AI_SUGGESTION"}
                        onChange={() => setInformationType("AI_SUGGESTION")}
                        className="text-amber-600"
                      />
                      <span>AI Suggestion</span>
                    </div>
                    <span className="text-[10px] text-slate-500">
                      Draft concept (Never official until approved)
                    </span>
                  </label>
                </div>
              </div>

              {/* Location & Department */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Location (Optional)</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Academic Amphitheatre, Tapesia Campus"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Department / School (Optional)</label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="">-- Select or None --</option>
                    {DEPARTMENTS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Organizer & Source */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Organizer (Optional)</label>
                  <input
                    type="text"
                    value={organizer}
                    onChange={(e) => setOrganizer(e.target.value)}
                    placeholder="e.g. Examination Directorate / Student Affairs"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Source / Reference *</label>
                  <input
                    type="text"
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    placeholder="e.g. Registrar Notification Ref #ADBU/2026/104"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Internal Editorial Notes</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Coordinate photography team; chief guest pending confirmation"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEventModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-100 rounded-lg font-semibold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingEvent}
                  className="inline-flex items-center gap-1.5 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-sm transition-colors cursor-pointer disabled:opacity-50"
                >
                  {submittingEvent && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  {editingEvent ? "Update Entry" : "Save Calendar Entry"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE CONTENT FOR EVENT QUICK MODAL */}
      {isContentModalOpen && contentEvent && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in duration-150">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-blue-50">
              <div>
                <h3 className="text-base font-bold text-blue-950 flex items-center gap-2">
                  <Share2 className="w-4 h-4 text-blue-600" />
                  Create Social Media Post for Event
                </h3>
                <p className="text-xs text-blue-800/80 mt-0.5">
                  Linked to: <strong>{contentEvent.title}</strong>
                </p>
              </div>
              <button
                onClick={() => setIsContentModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleContentSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
              {contentFormError && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{contentFormError}</span>
                </div>
              )}

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Post Headline *</label>
                <input
                  type="text"
                  required
                  value={contentTitle}
                  onChange={(e) => setContentTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Target Channel *</label>
                  <select
                    value={contentPlatform}
                    onChange={(e) => setContentPlatform(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="MULTI">Cross-Platform (Multi)</option>
                    <option value="INSTAGRAM">Instagram</option>
                    <option value="FACEBOOK">Facebook</option>
                    <option value="LINKEDIN">LinkedIn</option>
                    <option value="X">X (Twitter)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Status *</label>
                  <select
                    value={contentStatus}
                    onChange={(e) => setContentStatus(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="DRAFT">Draft</option>
                    <option value="SCHEDULED">Scheduled</option>
                    <option value="PUBLISHED">Published</option>
                  </select>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-semibold text-slate-700">Caption / Copy *</label>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {contentCaption.length} characters
                  </span>
                </div>
                <textarea
                  required
                  rows={6}
                  value={contentCaption}
                  onChange={(e) => setContentCaption(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Publishing Date & Time (Optional)
                </label>
                <input
                  type="datetime-local"
                  value={contentScheduledAt}
                  onChange={(e) => setContentScheduledAt(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsContentModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-100 rounded-lg font-semibold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingContent}
                  className="inline-flex items-center gap-1.5 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-sm transition-colors cursor-pointer disabled:opacity-50"
                >
                  {submittingContent && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Save Linked Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
