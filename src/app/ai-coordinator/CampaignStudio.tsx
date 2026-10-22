"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Bot,
  Sparkles,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Clock,
  MapPin,
  Building2,
  Share2,
  Copy,
  Check,
  RefreshCw,
  Save,
  ShieldCheck,
  Globe,
  Sliders,
  Layers,
  ChevronRight,
  ExternalLink,
  Loader2,
  Edit3,
  FileText,
  Video,
  Tv,
  Image as ImageIcon,
  DollarSign,
  Search,
  CheckSquare,
  Square,
  ArrowRight,
  Info,
} from "lucide-react";
import {
  CampaignPackage,
  EventInputData,
  PlatformType,
  CampaignObjective,
  AIProviderStatus,
} from "@/lib/ai/types";

const ALL_PLATFORMS: PlatformType[] = [
  "Instagram",
  "Facebook",
  "LinkedIn",
  "X",
  "Instagram Stories",
  "Instagram Reel",
  "Campus TV",
  "Poster",
];

const ALL_OBJECTIVES: CampaignObjective[] = [
  "Awareness",
  "Engagement",
  "Event Attendance",
  "Registration",
  "Website Traffic",
  "Admissions",
  "Lead Generation",
  "Recruitment",
];

export default function CampaignStudio() {
  const searchParams = useSearchParams();
  const initialEventId = searchParams.get("eventId");

  // State
  const [events, setEvents] = useState<EventInputData[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string>(initialEventId || "");
  const [loadingEvents, setLoadingEvents] = useState(true);

  // AI Connection State
  const [aiStatus, setAiStatus] = useState<AIProviderStatus | null>(null);
  const [checkingAi, setCheckingAi] = useState(true);

  // Selections
  const [selectedPlatforms, setSelectedPlatforms] = useState<PlatformType[]>([
    "Instagram",
    "Facebook",
    "LinkedIn",
    "X",
    "Instagram Stories",
    "Instagram Reel",
    "Campus TV",
    "Poster",
  ]);

  const [selectedObjectives, setSelectedObjectives] = useState<CampaignObjective[]>([
    "Awareness",
    "Event Attendance",
    "Engagement",
  ]);

  // Campaign Output State
  const [isGenerating, setIsGenerating] = useState(false);
  const [campaignPackage, setCampaignPackage] = useState<CampaignPackage | null>(null);
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [errorMessage, setErrorMessage] = useState("");
  const [savedSuccessMessage, setSavedSuccessMessage] = useState("");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [regeneratingSection, setRegeneratingSection] = useState(false);
  const [savingDraft, setSavingDraft] = useState(false);

  // Fetch Events from SQLite
  useEffect(() => {
    async function loadEvents() {
      try {
        setLoadingEvents(true);
        const res = await fetch("/api/events");
        if (res.ok) {
          const data = await res.json();
          setEvents(data);
          if (!selectedEventId && data.length > 0) {
            setSelectedEventId(data[0].id);
          }
        }
      } catch (err) {
        console.error("Failed to load events", err);
      } finally {
        setLoadingEvents(false);
      }
    }
    loadEvents();
  }, []);

  // Check Ollama AI Provider Health
  const checkAiHealth = async () => {
    try {
      setCheckingAi(true);
      const res = await fetch("/api/ai/status");
      const data = await res.json();
      setAiStatus(data);
    } catch (err) {
      setAiStatus({
        available: false,
        provider: "Ollama Local",
        endpoint: "http://localhost:11434",
        error: "Local AI is not currently available.",
        instructions:
          "To connect Local AI:\n1. Download and install Ollama from https://ollama.com\n2. Open your terminal and run: ollama run llama3.2\n3. Click 'Retry Connection'.",
      });
    } finally {
      setCheckingAi(false);
    }
  };

  useEffect(() => {
    checkAiHealth();
  }, []);

  // Find currently selected event
  const selectedEvent = useMemo(() => {
    return events.find((e) => e.id === selectedEventId) || null;
  }, [events, selectedEventId]);

  // Platform Toggle
  const togglePlatform = (p: PlatformType) => {
    setSelectedPlatforms((prev) =>
      prev.includes(p) ? prev.filter((item) => item !== p) : [...prev, p]
    );
  };

  // Objective Toggle
  const toggleObjective = (obj: CampaignObjective) => {
    setSelectedObjectives((prev) =>
      prev.includes(obj) ? prev.filter((item) => item !== obj) : [...prev, obj]
    );
  };

  // Generate Complete Campaign
  const handleGenerate = async (mode: "ai" | "template" = "ai") => {
    if (!selectedEventId) {
      setErrorMessage("Please select a university event first.");
      return;
    }
    if (selectedPlatforms.length === 0) {
      setErrorMessage("Please select at least one platform.");
      return;
    }

    setIsGenerating(true);
    setErrorMessage("");
    setSavedSuccessMessage("");

    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: selectedEventId,
          platforms: selectedPlatforms,
          objectives: selectedObjectives,
          mode,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setCampaignPackage(data);
        setActiveTab("overview");
      } else {
        setErrorMessage(data.error || "Failed to generate campaign.");
      }
    } catch (err: any) {
      setErrorMessage("Network error while generating campaign.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Regenerate Specific Section
  const handleRegenerateSection = async (platformName: string) => {
    if (!selectedEventId || !campaignPackage) return;

    setRegeneratingSection(true);
    try {
      const mode = campaignPackage.isAiGenerated ? "ai" : "template";
      const res = await fetch("/api/ai/generate-section", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: selectedEventId,
          platform: platformName,
          objectives: selectedObjectives,
          mode,
        }),
      });

      if (res.ok) {
        const { data } = await res.json();
        setCampaignPackage((prev: any) => {
          if (!prev) return prev;
          const copy = { ...prev };
          if (platformName === "Instagram") copy.instagram = data;
          else if (platformName === "Facebook") copy.facebook = data;
          else if (platformName === "LinkedIn") copy.linkedin = data;
          else if (platformName === "X") copy.x = data;
          else if (platformName === "Instagram Stories") copy.stories = data;
          else if (platformName === "Instagram Reel") copy.reel = data;
          else if (platformName === "Campus TV") copy.campusTv = data;
          else if (platformName === "Poster") copy.poster = data;
          else if (platformName === "Meta Ads") copy.metaAds = data;
          else if (platformName === "SEO") copy.seo = data;
          return copy;
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setRegeneratingSection(false);
    }
  };

  // Copy helper
  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Save Campaign to SQLite
  const handleSaveDraft = async (statusToSave: "DRAFT" | "APPROVED" = "DRAFT") => {
    if (!campaignPackage || !selectedEvent) return;

    setSavingDraft(true);
    setSavedSuccessMessage("");

    try {
      const payload = {
        eventId: selectedEvent.id,
        title: `${selectedEvent.title} - AI Campaign`,
        objectives: selectedObjectives,
        platforms: selectedPlatforms,
        overview: campaignPackage.overview,
        packageData: campaignPackage,
        status: statusToSave,
        isAiGenerated: campaignPackage.isAiGenerated,
        aiProvider: campaignPackage.aiProvider,
        modelUsed: campaignPackage.modelUsed,
        createContentItems: true,
      };

      const res = await fetch("/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const saved = await res.json();
        setSavedSuccessMessage(
          `Campaign successfully saved to SQLite as ${statusToSave}! Individual platform drafts were created in Content Studio.`
        );
      } else {
        const data = await res.json();
        setErrorMessage(data.error || "Failed to save campaign draft.");
      }
    } catch (err) {
      setErrorMessage("Network error while saving campaign draft.");
    } finally {
      setSavingDraft(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Workspace Header */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-800">
              AI Content Coordinator & Campaign Generator
            </h2>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
              Local Ollama • ₹0 Cost
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Generate complete, multi-platform promotional campaigns for Assam Don Bosco University events.
            Grounded strictly in verified database facts with 0 cloud dependencies.
          </p>
        </div>

        {/* AI Provider Health Status Pill */}
        <div className="flex items-center gap-2">
          {checkingAi ? (
            <span className="inline-flex items-center gap-1.5 text-xs text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" />
              Checking AI Service...
            </span>
          ) : aiStatus?.available ? (
            <span className="inline-flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              {aiStatus.provider} ({aiStatus.model || "Active"})
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-xs text-amber-800 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200 font-medium">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              {aiStatus?.provider || "AI Engine"} Offline (Fallback Mode)
            </span>
          )}
          <button
            onClick={checkAiHealth}
            className="p-1.5 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 border border-slate-200 transition-colors"
            title="Check AI Connection"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Offline Fallback Notice (Strict Truthfulness requirement) */}
      {!checkingAi && !aiStatus?.available && (
        <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-5 text-xs text-amber-900 space-y-3">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="space-y-1 flex-1">
              <h4 className="font-bold text-sm text-amber-900">
                AI Service is not currently connected.
              </h4>
              <p className="text-amber-800 leading-relaxed">
                Neither local Ollama (at <code className="bg-amber-100/80 px-1.5 py-0.5 rounded font-mono text-[11px]">http://localhost:11434</code>) nor a free Cloud AI key (<code className="bg-amber-100/80 px-1.5 py-0.5 rounded font-mono text-[11px]">GROQ_API_KEY</code>) is currently active.
                In accordance with university system integrity, we never pretend mock data is AI-generated.
              </p>
              <div className="pt-2 bg-white/60 p-3 rounded-lg border border-amber-200/80 space-y-1.5 font-mono text-[11px] text-slate-800">
                <p className="font-bold font-sans text-slate-700">Choose one free method to connect AI (100% free, ₹0):</p>
                <p>• <strong>Option A (Local AI):</strong> Download Ollama from <a href="https://ollama.com" target="_blank" rel="noreferrer" className="text-blue-600 underline">ollama.com</a> and run <strong className="text-blue-700">ollama run llama3.2</strong></p>
                <p>• <strong>Option B (Cloud 24/7 AI, No Card):</strong> Get a free key at <a href="https://console.groq.com" target="_blank" rel="noreferrer" className="text-blue-600 underline">console.groq.com</a> and add <strong className="text-emerald-700">GROQ_API_KEY=gsk_...</strong> to your .env</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-1">
            <button
              onClick={checkAiHealth}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-700 hover:bg-amber-800 text-white rounded-lg font-semibold shadow-2xs transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Retry Connection
            </button>
            <button
              onClick={() => handleGenerate("template")}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 rounded-lg font-semibold shadow-2xs transition-colors cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-blue-600" />
              Generate Structured Campaign Template (Offline Blueprint)
            </button>
          </div>
        </div>
      )}

      {/* Main Campaign Configuration Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Event Selector & Source of Truth Information */}
        <div className="space-y-6">
          {/* 1. Event Selection Card */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-600" />
                Select Event (Source of Truth)
              </h3>
              <Link
                href="/calendar"
                className="text-[11px] text-blue-600 hover:underline flex items-center gap-0.5"
              >
                Calendar <ChevronRight className="w-3 h-3" />
              </Link>
            </div>

            {loadingEvents ? (
              <div className="p-4 text-center text-xs text-slate-400">Loading events...</div>
            ) : (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Target University Event *
                </label>
                <select
                  value={selectedEventId}
                  onChange={(e) => {
                    setSelectedEventId(e.target.value);
                    setCampaignPackage(null);
                    setSavedSuccessMessage("");
                  }}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  {events.map((ev) => (
                    <option key={ev.id} value={ev.id}>
                      {ev.title} ({new Date(ev.date).toLocaleDateString("en-IN", { month: "short", day: "numeric" })})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Display Event Verified Data Box */}
            {selectedEvent && (
              <div className="bg-slate-50 rounded-lg p-3.5 border border-slate-200 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                    {selectedEvent.category}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-600">
                    {selectedEvent.status}
                  </span>
                </div>

                <h4 className="font-bold text-slate-800 text-xs leading-snug">
                  {selectedEvent.title}
                </h4>

                <p className="text-[11px] text-slate-600 line-clamp-3 leading-relaxed">
                  {selectedEvent.description}
                </p>

                <div className="pt-2 border-t border-slate-200/60 space-y-1 text-[11px] text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>
                      {new Date(selectedEvent.date).toLocaleDateString("en-IN", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}{" "}
                      {selectedEvent.startTime ? `• ${selectedEvent.startTime}` : ""}
                    </span>
                  </div>
                  {selectedEvent.location && (
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{selectedEvent.location}</span>
                    </div>
                  )}
                  {selectedEvent.department && (
                    <div className="flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      <span>{selectedEvent.department}</span>
                    </div>
                  )}
                  {selectedEvent.source && (
                    <div className="text-[10px] text-slate-400 italic">
                      Source: {selectedEvent.source}
                    </div>
                  )}
                </div>

                {/* Factual Accuracy Policy Note */}
                <div className="bg-white p-2 rounded border border-slate-200 text-[10px] text-slate-500 flex items-start gap-1.5 mt-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>Strict Factual Guardrail:</strong> AI is constrained to verified details above.
                    Missing fields will display <code>[Information required]</code>.
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* 2. Platform Selection Card */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700">
                Target Platforms
              </h3>
              <span className="text-[11px] text-slate-400">
                {selectedPlatforms.length} selected
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              {ALL_PLATFORMS.map((p) => {
                const isSelected = selectedPlatforms.includes(p);
                return (
                  <button
                    key={p}
                    onClick={() => togglePlatform(p)}
                    className={`flex items-center gap-2 p-2 rounded-lg border text-left transition-all cursor-pointer ${
                      isSelected
                        ? "bg-blue-50 border-blue-400 text-blue-900 font-semibold"
                        : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {isSelected ? (
                      <CheckSquare className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                    ) : (
                      <Square className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    )}
                    <span className="truncate">{p}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Campaign Objectives Card */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700">
                Campaign Objectives
              </h3>
              <span className="text-[11px] text-slate-400">
                {selectedObjectives.length} selected
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              {ALL_OBJECTIVES.map((obj) => {
                const isSelected = selectedObjectives.includes(obj);
                return (
                  <button
                    key={obj}
                    onClick={() => toggleObjective(obj)}
                    className={`flex items-center gap-2 p-2 rounded-lg border text-left transition-all cursor-pointer ${
                      isSelected
                        ? "bg-indigo-50 border-indigo-400 text-indigo-900 font-semibold"
                        : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {isSelected ? (
                      <CheckSquare className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0" />
                    ) : (
                      <Square className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    )}
                    <span className="truncate">{obj}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Main Generation Trigger */}
          <div className="space-y-2">
            <button
              onClick={() => handleGenerate(aiStatus?.available ? "ai" : "template")}
              disabled={isGenerating || !selectedEventId}
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white rounded-xl font-bold text-xs shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating Usable Campaign...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-blue-200" />
                  Generate Complete Campaign
                </>
              )}
            </button>

            {aiStatus?.available && (
              <p className="text-[10px] text-center text-slate-400">
                Inference via local Ollama ({aiStatus.model}) • 100% Free & Private
              </p>
            )}
          </div>
        </div>

        {/* Right Column (Span 2): Generated Campaign Workspace */}
        <div className="lg:col-span-2 space-y-4">
          {errorMessage && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {savedSuccessMessage && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{savedSuccessMessage}</span>
            </div>
          )}

          {!campaignPackage ? (
            /* Empty State */
            <div className="bg-white rounded-xl border border-dashed border-slate-300 p-16 text-center space-y-4">
              <div className="h-16 w-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
                <Bot className="w-8 h-8" />
              </div>
              <div className="max-w-md mx-auto space-y-1">
                <h3 className="text-base font-bold text-slate-800">
                  AI Campaign Workspace Ready
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Select an event and target channels on the left, then click{" "}
                  <strong>&quot;Generate Complete Campaign&quot;</strong> to produce production-grade,
                  factual copy across Instagram, Facebook, LinkedIn, X, Stories, Reels, Campus TV, and Posters.
                </p>
              </div>

              <div className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Zero-Cost Local Inference • No external API keys needed
              </div>
            </div>
          ) : (
            /* Active Campaign Workspace with Tabs */
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
              {/* Campaign Header Bar */}
              <div className="p-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-slate-50/80">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-800 truncate max-w-sm">
                    {selectedEvent?.title}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      campaignPackage.isAiGenerated
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-amber-50 text-amber-800 border-amber-200"
                    }`}
                  >
                    {campaignPackage.isAiGenerated
                      ? `AI (${campaignPackage.modelUsed || "Ollama"})`
                      : "Template Blueprint (Offline)"}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleSaveDraft("DRAFT")}
                    disabled={savingDraft}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-2xs transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {savingDraft ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                    Save Draft to Database
                  </button>
                  <button
                    onClick={() => handleSaveDraft("APPROVED")}
                    disabled={savingDraft}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-2xs transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Approve Campaign
                  </button>
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="flex items-center gap-1 px-4 pt-3 border-b border-slate-200 bg-slate-50/40 overflow-x-auto text-xs font-semibold">
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`pb-2.5 px-3 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                    activeTab === "overview"
                      ? "border-blue-600 text-blue-600 font-bold"
                      : "border-transparent text-slate-500 hover:text-slate-800"
                  }`}
                >
                  Overview & Strategy
                </button>
                {selectedPlatforms.includes("Instagram") && (
                  <button
                    onClick={() => setActiveTab("instagram")}
                    className={`pb-2.5 px-3 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                      activeTab === "instagram"
                        ? "border-blue-600 text-blue-600 font-bold"
                        : "border-transparent text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    Instagram
                  </button>
                )}
                {selectedPlatforms.includes("Facebook") && (
                  <button
                    onClick={() => setActiveTab("facebook")}
                    className={`pb-2.5 px-3 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                      activeTab === "facebook"
                        ? "border-blue-600 text-blue-600 font-bold"
                        : "border-transparent text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    Facebook
                  </button>
                )}
                {selectedPlatforms.includes("LinkedIn") && (
                  <button
                    onClick={() => setActiveTab("linkedin")}
                    className={`pb-2.5 px-3 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                      activeTab === "linkedin"
                        ? "border-blue-600 text-blue-600 font-bold"
                        : "border-transparent text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    LinkedIn
                  </button>
                )}
                {selectedPlatforms.includes("X") && (
                  <button
                    onClick={() => setActiveTab("x")}
                    className={`pb-2.5 px-3 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                      activeTab === "x"
                        ? "border-blue-600 text-blue-600 font-bold"
                        : "border-transparent text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    X (Twitter)
                  </button>
                )}
                {selectedPlatforms.includes("Instagram Stories") && (
                  <button
                    onClick={() => setActiveTab("stories")}
                    className={`pb-2.5 px-3 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                      activeTab === "stories"
                        ? "border-blue-600 text-blue-600 font-bold"
                        : "border-transparent text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    Stories
                  </button>
                )}
                {selectedPlatforms.includes("Instagram Reel") && (
                  <button
                    onClick={() => setActiveTab("reel")}
                    className={`pb-2.5 px-3 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                      activeTab === "reel"
                        ? "border-blue-600 text-blue-600 font-bold"
                        : "border-transparent text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    Reel
                  </button>
                )}
                {selectedPlatforms.includes("Campus TV") && (
                  <button
                    onClick={() => setActiveTab("campusTv")}
                    className={`pb-2.5 px-3 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                      activeTab === "campusTv"
                        ? "border-blue-600 text-blue-600 font-bold"
                        : "border-transparent text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    Campus TV
                  </button>
                )}
                {selectedPlatforms.includes("Poster") && (
                  <button
                    onClick={() => setActiveTab("poster")}
                    className={`pb-2.5 px-3 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                      activeTab === "poster"
                        ? "border-blue-600 text-blue-600 font-bold"
                        : "border-transparent text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    Poster
                  </button>
                )}
                <button
                  onClick={() => setActiveTab("metaAds")}
                  className={`pb-2.5 px-3 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                    activeTab === "metaAds"
                      ? "border-blue-600 text-blue-600 font-bold"
                      : "border-transparent text-slate-500 hover:text-slate-800"
                  }`}
                >
                  Meta Ads
                </button>
                <button
                  onClick={() => setActiveTab("seo")}
                  className={`pb-2.5 px-3 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                    activeTab === "seo"
                      ? "border-blue-600 text-blue-600 font-bold"
                      : "border-transparent text-slate-500 hover:text-slate-800"
                  }`}
                >
                  SEO
                </button>
              </div>

              {/* Tab Body Contents */}
              <div className="p-6 text-xs space-y-5">
                {/* 1. OVERVIEW TAB */}
                {activeTab === "overview" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <h4 className="font-bold text-sm text-slate-800 flex items-center gap-2">
                        <Sliders className="w-4 h-4 text-blue-600" />
                        Campaign Strategy & Schedule
                      </h4>
                      <span className="text-slate-400">Grounding: Official Event Data</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
                        <span className="text-[10px] uppercase font-bold text-slate-400">
                          Main Campaign Message
                        </span>
                        <p className="font-semibold text-slate-800 text-xs">
                          {campaignPackage.overview.mainCampaignMessage}
                        </p>
                      </div>

                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
                        <span className="text-[10px] uppercase font-bold text-slate-400">
                          Target Audience
                        </span>
                        <p className="font-semibold text-slate-800 text-xs">
                          {campaignPackage.overview.targetAudience}
                        </p>
                      </div>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1.5">
                      <span className="text-[10px] uppercase font-bold text-slate-400">
                        Strategic Angle & Rationale
                      </span>
                      <p className="text-slate-700 leading-relaxed">
                        {campaignPackage.overview.campaignStrategy}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
                        <span className="text-[10px] uppercase font-bold text-slate-400">
                          Recommended Duration
                        </span>
                        <p className="font-semibold text-slate-700 text-xs">
                          {campaignPackage.overview.recommendedCampaignDuration}
                        </p>
                      </div>

                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
                        <span className="text-[10px] uppercase font-bold text-slate-400">
                          Posting Cadence
                        </span>
                        <p className="font-semibold text-slate-700 text-xs">
                          {campaignPackage.overview.recommendedPostingSchedule}
                        </p>
                      </div>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                      <span className="text-[10px] uppercase font-bold text-slate-400">
                        Content Pillars
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {campaignPackage.overview.contentPillars.map((p, i) => (
                          <span
                            key={i}
                            className="px-2.5 py-1 rounded-md bg-white border border-slate-200 font-semibold text-slate-700"
                          >
                            {p}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. INSTAGRAM TAB */}
                {activeTab === "instagram" && campaignPackage.instagram && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <h4 className="font-bold text-sm text-slate-800 flex items-center gap-2">
                        <Share2 className="w-4 h-4 text-pink-600" />
                        Instagram Post Package
                      </h4>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleRegenerateSection("Instagram")}
                          disabled={regeneratingSection}
                          className="inline-flex items-center gap-1 text-[11px] text-blue-600 hover:underline cursor-pointer"
                        >
                          <RefreshCw className={`w-3 h-3 ${regeneratingSection ? "animate-spin" : ""}`} />
                          Regenerate
                        </button>
                        <button
                          onClick={() =>
                            handleCopy(campaignPackage.instagram!.completeCaption, "insta")
                          }
                          className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition-colors cursor-pointer"
                        >
                          {copiedKey === "insta" ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                          {copiedKey === "insta" ? "Copied" : "Copy Caption"}
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Format</span>
                        <p className="font-bold text-slate-800 mt-0.5">{campaignPackage.instagram.recommendedFormat}</p>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Best Timing</span>
                        <p className="font-bold text-slate-800 mt-0.5">{campaignPackage.instagram.recommendedPostingTiming}</p>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Call to Action</span>
                        <p className="font-bold text-blue-700 mt-0.5">{campaignPackage.instagram.cta}</p>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">Opening Hook</label>
                      <input
                        type="text"
                        value={campaignPackage.instagram.hook}
                        onChange={(e) => {
                          const val = e.target.value;
                          setCampaignPackage((prev: any) => ({
                            ...prev,
                            instagram: { ...prev.instagram, hook: val },
                          }));
                        }}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">Complete Caption Copy</label>
                      <textarea
                        rows={7}
                        value={campaignPackage.instagram.completeCaption}
                        onChange={(e) => {
                          const val = e.target.value;
                          setCampaignPackage((prev: any) => ({
                            ...prev,
                            instagram: { ...prev.instagram, completeCaption: val },
                          }));
                        }}
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs leading-relaxed font-sans"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="font-bold text-slate-700">Short Caption (Stories/Alt)</label>
                        <textarea
                          rows={3}
                          value={campaignPackage.instagram.shortCaption}
                          onChange={(e) => {
                            const val = e.target.value;
                            setCampaignPackage((prev: any) => ({
                              ...prev,
                              instagram: { ...prev.instagram, shortCaption: val },
                            }));
                          }}
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="font-bold text-slate-700">Visual & Design Direction</label>
                        <textarea
                          rows={3}
                          value={campaignPackage.instagram.visualDirection}
                          onChange={(e) => {
                            const val = e.target.value;
                            setCampaignPackage((prev: any) => ({
                              ...prev,
                              instagram: { ...prev.instagram, visualDirection: val },
                            }));
                          }}
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">Hashtags & SEO Keywords</label>
                      <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-blue-600 font-medium text-xs">
                        {campaignPackage.instagram.hashtags.join(" ")}
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. FACEBOOK TAB */}
                {activeTab === "facebook" && campaignPackage.facebook && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <h4 className="font-bold text-sm text-slate-800 flex items-center gap-2">
                        <Share2 className="w-4 h-4 text-blue-600" />
                        Facebook Post Copy & Graphics
                      </h4>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleRegenerateSection("Facebook")}
                          disabled={regeneratingSection}
                          className="inline-flex items-center gap-1 text-[11px] text-blue-600 hover:underline cursor-pointer"
                        >
                          <RefreshCw className={`w-3 h-3 ${regeneratingSection ? "animate-spin" : ""}`} />
                          Regenerate
                        </button>
                        <button
                          onClick={() =>
                            handleCopy(campaignPackage.facebook!.completePostCopy, "fb")
                          }
                          className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold cursor-pointer"
                        >
                          {copiedKey === "fb" ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                          Copy Post
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">Link Headline</label>
                      <input
                        type="text"
                        value={campaignPackage.facebook.headline}
                        onChange={(e) => {
                          const val = e.target.value;
                          setCampaignPackage((prev: any) => ({
                            ...prev,
                            facebook: { ...prev.facebook, headline: val },
                          }));
                        }}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">Complete Post Copy</label>
                      <textarea
                        rows={8}
                        value={campaignPackage.facebook.completePostCopy}
                        onChange={(e) => {
                          const val = e.target.value;
                          setCampaignPackage((prev: any) => ({
                            ...prev,
                            facebook: { ...prev.facebook, completePostCopy: val },
                          }));
                        }}
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs leading-relaxed"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">Visual Direction</label>
                      <p className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-slate-600">
                        {campaignPackage.facebook.visualDirection}
                      </p>
                    </div>
                  </div>
                )}

                {/* 4. LINKEDIN TAB */}
                {activeTab === "linkedin" && campaignPackage.linkedin && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <h4 className="font-bold text-sm text-slate-800 flex items-center gap-2">
                        <Share2 className="w-4 h-4 text-blue-700" />
                        LinkedIn Institutional & Academic Post
                      </h4>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleRegenerateSection("LinkedIn")}
                          disabled={regeneratingSection}
                          className="inline-flex items-center gap-1 text-[11px] text-blue-600 hover:underline cursor-pointer"
                        >
                          <RefreshCw className={`w-3 h-3 ${regeneratingSection ? "animate-spin" : ""}`} />
                          Regenerate
                        </button>
                        <button
                          onClick={() =>
                            handleCopy(campaignPackage.linkedin!.professionalPostCopy, "li")
                          }
                          className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold cursor-pointer"
                        >
                          {copiedKey === "li" ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                          Copy Post
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">Professional Post Copy</label>
                      <textarea
                        rows={8}
                        value={campaignPackage.linkedin.professionalPostCopy}
                        onChange={(e) => {
                          const val = e.target.value;
                          setCampaignPackage((prev: any) => ({
                            ...prev,
                            linkedin: { ...prev.linkedin, professionalPostCopy: val },
                          }));
                        }}
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs leading-relaxed"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="font-bold text-slate-700">CTA & Hashtags</label>
                        <p className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-blue-700 font-medium">
                          {campaignPackage.linkedin.hashtags.join(" ")}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <label className="font-bold text-slate-700">Visual Recommendation</label>
                        <p className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-slate-600">
                          {campaignPackage.linkedin.visualRecommendation}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* 5. X (TWITTER) TAB */}
                {activeTab === "x" && campaignPackage.x && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <h4 className="font-bold text-sm text-slate-800 flex items-center gap-2">
                        <Share2 className="w-4 h-4 text-slate-900" />
                        X (Twitter) Posts (Character Guardrail)
                      </h4>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleRegenerateSection("X")}
                          disabled={regeneratingSection}
                          className="inline-flex items-center gap-1 text-[11px] text-blue-600 hover:underline cursor-pointer"
                        >
                          <RefreshCw className={`w-3 h-3 ${regeneratingSection ? "animate-spin" : ""}`} />
                          Regenerate
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="font-bold text-slate-700">Primary Post (Under 280 Chars)</label>
                        <span className="font-mono text-[10px] text-slate-400">
                          {campaignPackage.x.completePost.length}/280
                        </span>
                      </div>
                      <textarea
                        rows={3}
                        value={campaignPackage.x.completePost}
                        onChange={(e) => {
                          const val = e.target.value;
                          setCampaignPackage((prev: any) => ({
                            ...prev,
                            x: { ...prev.x, completePost: val },
                          }));
                        }}
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                      />
                      <button
                        onClick={() => handleCopy(campaignPackage.x!.completePost, "x1")}
                        className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded bg-slate-100 text-slate-700 font-semibold cursor-pointer"
                      >
                        {copiedKey === "x1" ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        Copy Primary Tweet
                      </button>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-slate-100">
                      <div className="flex items-center justify-between">
                        <label className="font-bold text-slate-700">Alternative Short Announcement</label>
                        <span className="font-mono text-[10px] text-slate-400">
                          {campaignPackage.x.alternativeShorterVersion.length} chars
                        </span>
                      </div>
                      <textarea
                        rows={2}
                        value={campaignPackage.x.alternativeShorterVersion}
                        onChange={(e) => {
                          const val = e.target.value;
                          setCampaignPackage((prev: any) => ({
                            ...prev,
                            x: { ...prev.x, alternativeShorterVersion: val },
                          }));
                        }}
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                      />
                      <button
                        onClick={() => handleCopy(campaignPackage.x!.alternativeShorterVersion, "x2")}
                        className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded bg-slate-100 text-slate-700 font-semibold cursor-pointer"
                      >
                        {copiedKey === "x2" ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        Copy Short Tweet
                      </button>
                    </div>
                  </div>
                )}

                {/* 6. INSTAGRAM STORIES TAB */}
                {activeTab === "stories" && campaignPackage.stories && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <h4 className="font-bold text-sm text-slate-800 flex items-center gap-2">
                        <Layers className="w-4 h-4 text-purple-600" />
                        5-Part Instagram Story Sequence
                      </h4>
                      <button
                        onClick={() => handleRegenerateSection("Instagram Stories")}
                        disabled={regeneratingSection}
                        className="inline-flex items-center gap-1 text-[11px] text-blue-600 hover:underline cursor-pointer"
                      >
                        <RefreshCw className={`w-3 h-3 ${regeneratingSection ? "animate-spin" : ""}`} />
                        Regenerate Stories
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                      {campaignPackage.stories.stories.map((story, i) => (
                        <div
                          key={i}
                          className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2 flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-100 text-purple-800">
                                Story {story.storyNumber}
                              </span>
                              <button
                                onClick={() => handleCopy(story.text, `story-${i}`)}
                                className="text-slate-400 hover:text-slate-700 p-0.5"
                                title="Copy Text"
                              >
                                {copiedKey === `story-${i}` ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                              </button>
                            </div>
                            <p className="font-semibold text-slate-800 whitespace-pre-line text-xs">
                              {story.text}
                            </p>
                          </div>

                          <div className="pt-2 border-t border-slate-200/70 text-[10px] text-slate-500 space-y-1">
                            <p>
                              <strong>Visual:</strong> {story.visualRecommendation}
                            </p>
                            {story.cta && (
                              <p className="text-purple-700 font-semibold">
                                <strong>Sticker:</strong> {story.cta}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 7. INSTAGRAM REEL TAB */}
                {activeTab === "reel" && campaignPackage.reel && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <h4 className="font-bold text-sm text-slate-800 flex items-center gap-2">
                        <Video className="w-4 h-4 text-rose-600" />
                        Reel Script & Scene-by-Scene Production Guide
                      </h4>
                      <button
                        onClick={() => handleRegenerateSection("Instagram Reel")}
                        disabled={regeneratingSection}
                        className="inline-flex items-center gap-1 text-[11px] text-blue-600 hover:underline cursor-pointer"
                      >
                        <RefreshCw className={`w-3 h-3 ${regeneratingSection ? "animate-spin" : ""}`} />
                        Regenerate Reel
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1.5">
                        <span className="text-[10px] uppercase font-bold text-slate-400">15-Second Paced Script</span>
                        <p className="text-slate-800 font-medium whitespace-pre-line text-xs leading-relaxed">
                          {campaignPackage.reel.fifteenSecondScript}
                        </p>
                      </div>
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1.5">
                        <span className="text-[10px] uppercase font-bold text-slate-400">30-Second Full Script</span>
                        <p className="text-slate-800 font-medium whitespace-pre-line text-xs leading-relaxed">
                          {campaignPackage.reel.thirtySecondScript}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h5 className="font-bold text-slate-700">Scene-by-Scene Shot List</h5>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {campaignPackage.reel.sceneBySceneStructure?.map((scene, i) => (
                          <div key={i} className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                            <span className="text-[10px] font-bold text-blue-700">Scene {scene.scene}</span>
                            <p className="text-slate-700 font-medium text-xs">{scene.action}</p>
                            <p className="text-[10px] text-slate-500 italic">Text: {scene.onScreenText}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                      <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Suggested B-Roll</span>
                        <p className="text-slate-700">{campaignPackage.reel.suggestedBroll}</p>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Audio & Music</span>
                        <p className="text-slate-700">{campaignPackage.reel.musicAudioDirection}</p>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Editing Tempo</span>
                        <p className="text-slate-700">{campaignPackage.reel.editingDirection}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* 8. CAMPUS TV TAB */}
                {activeTab === "campusTv" && campaignPackage.campusTv && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <h4 className="font-bold text-sm text-slate-800 flex items-center gap-2">
                        <Tv className="w-4 h-4 text-indigo-600" />
                        Campus Digital Signage / TV Foyer Bulletins
                      </h4>
                      <button
                        onClick={() => handleRegenerateSection("Campus TV")}
                        disabled={regeneratingSection}
                        className="inline-flex items-center gap-1 text-[11px] text-blue-600 hover:underline cursor-pointer"
                      >
                        <RefreshCw className={`w-3 h-3 ${regeneratingSection ? "animate-spin" : ""}`} />
                        Regenerate
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase text-indigo-700">5-Second Flash</span>
                          <button
                            onClick={() => handleCopy(campaignPackage.campusTv!.fiveSecondVersion, "ctv5")}
                            className="text-slate-400 hover:text-slate-600"
                          >
                            {copiedKey === "ctv5" ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                          </button>
                        </div>
                        <p className="font-bold text-slate-800 whitespace-pre-line text-xs">
                          {campaignPackage.campusTv.fiveSecondVersion}
                        </p>
                        <p className="text-[10px] text-slate-400">Suitable for main entrance hallway loop</p>
                      </div>

                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase text-indigo-700">10-Second Notice</span>
                          <button
                            onClick={() => handleCopy(campaignPackage.campusTv!.tenSecondVersion, "ctv10")}
                            className="text-slate-400 hover:text-slate-600"
                          >
                            {copiedKey === "ctv10" ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                          </button>
                        </div>
                        <p className="font-bold text-slate-800 whitespace-pre-line text-xs">
                          {campaignPackage.campusTv.tenSecondVersion}
                        </p>
                        <p className="text-[10px] text-slate-400">Ideal for cafeteria & library lobby displays</p>
                      </div>

                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase text-indigo-700">15-Second Full</span>
                          <button
                            onClick={() => handleCopy(campaignPackage.campusTv!.fifteenSecondVersion, "ctv15")}
                            className="text-slate-400 hover:text-slate-600"
                          >
                            {copiedKey === "ctv15" ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                          </button>
                        </div>
                        <p className="font-bold text-slate-800 whitespace-pre-line text-xs">
                          {campaignPackage.campusTv.fifteenSecondVersion}
                        </p>
                        <p className="text-[10px] text-slate-400">Complete bulletin with departments & dates</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* 9. POSTER TAB */}
                {activeTab === "poster" && campaignPackage.poster && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <h4 className="font-bold text-sm text-slate-800 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-amber-600" />
                        Campus Notice Board Poster Copy
                      </h4>
                      <button
                        onClick={() => handleRegenerateSection("Poster")}
                        disabled={regeneratingSection}
                        className="inline-flex items-center gap-1 text-[11px] text-blue-600 hover:underline cursor-pointer"
                      >
                        <RefreshCw className={`w-3 h-3 ${regeneratingSection ? "animate-spin" : ""}`} />
                        Regenerate
                      </button>
                    </div>

                    <div className="bg-gradient-to-br from-slate-900 to-blue-950 text-white p-6 rounded-xl border border-slate-800 space-y-3">
                      <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                        Assam Don Bosco University
                      </span>
                      <h2 className="text-xl font-extrabold tracking-tight text-white">
                        {campaignPackage.poster.mainHeadline}
                      </h2>
                      <p className="text-xs text-blue-200 font-medium">
                        {campaignPackage.poster.supportingHeadline}
                      </p>

                      <div className="pt-3 border-t border-blue-900/60 font-mono text-xs whitespace-pre-line text-slate-300">
                        {campaignPackage.poster.eventInformation}
                      </div>

                      <div className="pt-2 text-xs font-bold text-amber-300">
                        {campaignPackage.poster.cta}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Design & Layout Direction</span>
                        <p className="text-slate-700">{campaignPackage.poster.designDirection}</p>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Visual & Photography</span>
                        <p className="text-slate-700">{campaignPackage.poster.visualRecommendation}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* 10. META ADS TAB */}
                {activeTab === "metaAds" && campaignPackage.metaAds && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <div>
                        <h4 className="font-bold text-sm text-slate-800 flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-emerald-600" />
                          Meta Ads Strategy & Budgets
                        </h4>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 mt-1 inline-block">
                          AI RECOMMENDATION ONLY
                        </span>
                      </div>
                      <button
                        onClick={() => handleRegenerateSection("Meta Ads")}
                        disabled={regeneratingSection}
                        className="inline-flex items-center gap-1 text-[11px] text-blue-600 hover:underline cursor-pointer"
                      >
                        <RefreshCw className={`w-3 h-3 ${regeneratingSection ? "animate-spin" : ""}`} />
                        Regenerate
                      </button>
                    </div>

                    {/* Disclaimer Banner */}
                    <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg text-amber-900 text-xs flex items-start gap-2">
                      <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                      <span>{campaignPackage.metaAds.disclaimer}</span>
                    </div>

                    {/* Test Budget Tiers */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                        <span className="text-[10px] font-bold uppercase text-slate-500">Low-Budget Test</span>
                        <p className="font-extrabold text-sm text-slate-800">{campaignPackage.metaAds.lowBudgetOption}</p>
                        <p className="text-[10px] text-slate-400">Guwahati metro immediate radius</p>
                      </div>
                      <div className="p-4 bg-blue-50/70 rounded-xl border border-blue-200 space-y-1">
                        <span className="text-[10px] font-bold uppercase text-blue-700">Medium-Budget</span>
                        <p className="font-extrabold text-sm text-blue-900">{campaignPackage.metaAds.mediumBudgetOption}</p>
                        <p className="text-[10px] text-blue-600">Assam statewide student outreach</p>
                      </div>
                      <div className="p-4 bg-indigo-50/70 rounded-xl border border-indigo-200 space-y-1">
                        <span className="text-[10px] font-bold uppercase text-indigo-700">Full Regional Boost</span>
                        <p className="font-extrabold text-sm text-indigo-900">{campaignPackage.metaAds.higherBudgetOption}</p>
                        <p className="text-[10px] text-indigo-600">All North-Eastern states</p>
                      </div>
                    </div>

                    {/* Targeting Specs */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                        <span className="font-bold text-slate-800">Audience & Demographic Targeting</span>
                        <div className="space-y-1 text-slate-600">
                          <p><strong>Audience:</strong> {campaignPackage.metaAds.recommendedAudience}</p>
                          <p><strong>Age:</strong> {campaignPackage.metaAds.ageRange} • <strong>Gender:</strong> {campaignPackage.metaAds.gender}</p>
                          <p><strong>Geographic:</strong> {campaignPackage.metaAds.location}</p>
                          <p><strong>Interests:</strong> {campaignPackage.metaAds.interestTargetingIdeas.join(", ")}</p>
                        </div>
                      </div>

                      <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                        <span className="font-bold text-slate-800">Ad Creative Copy</span>
                        <div className="space-y-1 text-slate-600">
                          <p><strong>Primary Headline:</strong> {campaignPackage.metaAds.headline}</p>
                          <p><strong>Primary Text:</strong> {campaignPackage.metaAds.primaryAdText}</p>
                          <p><strong>Alternative Text:</strong> {campaignPackage.metaAds.alternativeAdText}</p>
                          <p><strong>CTA:</strong> {campaignPackage.metaAds.cta}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 11. SEO TAB */}
                {activeTab === "seo" && campaignPackage.seo && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <h4 className="font-bold text-sm text-slate-800 flex items-center gap-2">
                        <Search className="w-4 h-4 text-blue-600" />
                        Search Engine Optimization & Social Discovery
                      </h4>
                      <button
                        onClick={() => handleRegenerateSection("SEO")}
                        disabled={regeneratingSection}
                        className="inline-flex items-center gap-1 text-[11px] text-blue-600 hover:underline cursor-pointer"
                      >
                        <RefreshCw className={`w-3 h-3 ${regeneratingSection ? "animate-spin" : ""}`} />
                        Regenerate
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Primary Keyword</span>
                        <p className="font-bold text-blue-700 text-sm">{campaignPackage.seo.primaryKeyword}</p>
                        <div className="pt-2 text-slate-600 space-y-1">
                          <p><strong>Secondary:</strong> {campaignPackage.seo.secondaryKeywords.join(", ")}</p>
                          <p><strong>Long-tail:</strong> {campaignPackage.seo.longTailKeywords.join(" • ")}</p>
                        </div>
                      </div>

                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Suggested URL Slug</span>
                        <p className="font-mono text-xs text-slate-800 bg-white p-2 rounded border border-slate-200">
                          dbuniversity.ac.in/events/{campaignPackage.seo.urlSlug}
                        </p>
                        <div className="pt-1 text-slate-600">
                          <p><strong>Suggested Page Title:</strong> {campaignPackage.seo.suggestedTitle}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Meta Description (Under 155 Chars)</span>
                      <p className="text-slate-800 text-xs leading-relaxed">{campaignPackage.seo.metaDescription}</p>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Image Alt Text (Accessibility & Image Search)</span>
                      <p className="text-slate-700 text-xs">{campaignPackage.seo.imageAltText}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
