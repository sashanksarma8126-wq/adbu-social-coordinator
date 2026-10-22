import { OllamaProvider } from "./ollamaProvider";
import { GroqProvider } from "./groqProvider";
import {
  AIProvider,
  AIProviderStatus,
  CampaignPackage,
  EventInputData,
  InstagramContent,
  FacebookContent,
  LinkedInContent,
  XContent,
  StoriesContent,
  ReelContent,
  CampusTVContent,
  PosterContent,
  MetaAdsContent,
  SEOContent,
  CampaignStrategyOverview,
} from "./types";

export class AIService {
  private provider: AIProvider;

  constructor(provider?: AIProvider) {
    if (provider) {
      this.provider = provider;
    } else if (process.env.GROQ_API_KEY) {
      this.provider = new GroqProvider();
    } else {
      this.provider = new OllamaProvider();
    }
  }

  async checkStatus(): Promise<AIProviderStatus> {
    return this.provider.checkStatus();
  }

  private buildSystemPrompt(): string {
    return `You are the AI Social Media Coordinator for Assam Don Bosco University (ADBU), an esteemed NAAC 'A' Grade university in Northeast India with campuses at Tapesia Gardens, Azara, and Kharguli.

CRITICAL FACTUAL ACCURACY INSTRUCTIONS:
1. The event data provided is the absolute source of truth.
2. NEVER invent missing information: do not invent people names, keynote speakers, dates, times, room numbers, registration links, statistics, awards, prizes, quotes, or sponsors.
3. If any detail is missing from the provided event data (e.g. registration URL, chief guest, speaker, prize amount), you MUST write: "[Information required]".
4. Creative recommendations (hooks, visual directions, audio recommendations) are allowed and encouraged, but confirmed facts must adhere strictly to the supplied record.
5. All budget numbers for ads must be clearly framed as AI recommendations, not guarantees.
6. Return your output strictly as valid JSON adhering to the requested schema. No markdown conversational filler.`;
  }

  private buildEventContext(event: EventInputData, objectives: string[]): string {
    return `
EVENT SOURCE DATA:
- Title: ${event.title}
- Description: ${event.description}
- Date: ${new Date(event.date).toLocaleDateString("en-IN", { month: "long", day: "numeric", year: "numeric" })}
- Time: ${event.startTime || "[Information required]"} ${event.endTime ? `to ${event.endTime}` : ""}
- Location/Campus: ${event.location || "[Information required]"}
- Category: ${event.category}
- Organizing Department: ${event.department || "[Information required]"}
- Formal Organizer: ${event.organizer || "[Information required]"}
- Reference / Official Source: ${event.source || "[Information required]"}
- Internal Notes: ${event.notes || "None"}
- Status: ${event.status}
- Information Authority: ${event.informationType}

CAMPAIGN OBJECTIVES:
${objectives.join(", ") || "Awareness, Engagement, Event Attendance"}
`;
  }

  // 1. Generate Full Campaign
  async generateCampaign(
    eventData: EventInputData,
    platforms: string[],
    objectives: string[]
  ): Promise<CampaignPackage> {
    const status = await this.checkStatus();
    if (!status.available) {
      throw new Error(
        status.instructions || "Local AI is not currently available."
      );
    }

    const eventContext = this.buildEventContext(eventData, objectives);

    const prompt = `
Create a complete, multi-platform social media campaign for the following Assam Don Bosco University event.

${eventContext}

SELECTED PLATFORMS TO GENERATE:
${platforms.join(", ")}

Generate a structured JSON object with the following schema:
{
  "overview": {
    "campaignStrategy": "Comprehensive strategic angle tailored for ADBU",
    "mainCampaignMessage": "Core hook and primary message",
    "targetAudience": "Demographics and segments (students, alumni, researchers, faculty)",
    "recommendedCampaignDuration": "e.g. 10 days leading up to event",
    "recommendedPostingSchedule": "e.g. T-7 days teaser, T-3 days agenda, T-1 day reminder",
    "contentPillars": ["Pillar 1", "Pillar 2", "Pillar 3"]
  },
  ${platforms.includes("Instagram") ? `"instagram": {
    "contentConcept": "Visual concept",
    "hook": "Scroll-stopping first line",
    "completeCaption": "Full caption with spacing and verified facts only",
    "shortCaption": "Condensed version",
    "cta": "Clear call to action",
    "hashtags": ["#AssamDonBoscoUniversity", "#ADBU", "#CarpeDiem"],
    "seoKeywords": ["keyword1", "keyword2"],
    "altText": "Descriptive accessibility text for graphic/photo",
    "firstComment": "Pin-worthy first comment or FAQ link",
    "visualDirection": "Detailed visual layout instructions",
    "recommendedFormat": "Carousel / Single Image / Reel",
    "recommendedPostingTiming": "e.g. 6:30 PM IST"
  },` : ""}
  ${platforms.includes("Facebook") ? `"facebook": {
    "completePostCopy": "Comprehensive community-focused post",
    "hook": "Opening hook",
    "headline": "Post link headline",
    "cta": "Call to action",
    "hashtags": ["#ADBU", "#AssamDonBosco"],
    "seoKeywords": ["keyword1", "keyword2"],
    "visualDirection": "Visual recommendations"
  },` : ""}
  ${platforms.includes("LinkedIn") ? `"linkedin": {
    "professionalPostCopy": "Academic and institutional tone copy",
    "hook": "Thought-provoking opening",
    "cta": "Professional CTA",
    "hashtags": ["#HigherEducation", "#ADBU", "#NortheastIndia"],
    "seoKeywords": ["academic keyword1", "keyword2"],
    "visualRecommendation": "Document slide or campus executive photo"
  },` : ""}
  ${platforms.includes("X") ? `"x": {
    "completePost": "Punchy post under 280 characters",
    "alternativeShorterVersion": "Ultra-short announcement under 160 characters",
    "cta": "Brief CTA",
    "relevantHashtags": ["#ADBU", "#HigherEd"]
  },` : ""}
  ${platforms.includes("Instagram Stories") ? `"stories": {
    "stories": [
      { "storyNumber": 1, "text": "Story 1 Text", "visualRecommendation": "Visual direction 1", "cta": "Swipe/Link sticker" },
      { "storyNumber": 2, "text": "Story 2 Text", "visualRecommendation": "Visual direction 2", "cta": "Question sticker" },
      { "storyNumber": 3, "text": "Story 3 Text", "visualRecommendation": "Visual direction 3", "cta": "Poll sticker" },
      { "storyNumber": 4, "text": "Story 4 Text", "visualRecommendation": "Visual direction 4", "cta": "Countdown sticker" },
      { "storyNumber": 5, "text": "Story 5 Text", "visualRecommendation": "Visual direction 5", "cta": "Registration link" }
    ]
  },` : ""}
  ${platforms.includes("Instagram Reel") ? `"reel": {
    "reelConcept": "Creative short-form concept",
    "hook": "Visual and spoken hook in first 2 seconds",
    "fifteenSecondScript": "Paced 15s script",
    "thirtySecondScript": "Full 30s script",
    "voiceover": "Voiceover audio copy",
    "shotList": ["Shot 1: Wide campus", "Shot 2: Action", "Shot 3: Text overlay"],
    "sceneBySceneStructure": [
      { "scene": 1, "action": "Action 1", "onScreenText": "Text 1" },
      { "scene": 2, "action": "Action 2", "onScreenText": "Text 2" },
      { "scene": 3, "action": "Action 3", "onScreenText": "Text 3" }
    ],
    "onScreenText": ["Text 1", "Text 2", "Text 3"],
    "caption": "Reel caption",
    "cta": "Share & save audio",
    "hashtags": ["#ADBUReels", "#CampusVibes"],
    "seoKeywords": ["reel keyword"],
    "editingDirection": "Fast cuts, upbeat tempo",
    "suggestedBroll": "B-roll clips of labs/tea gardens/amphitheatre",
    "musicAudioDirection": "Instrumental upbeat indie folk/electronic"
  },` : ""}
  ${platforms.includes("Campus TV") ? `"campusTv": {
    "fiveSecondVersion": "Ultra-brief headline and date for quick screen passing",
    "tenSecondVersion": "Headline, venue, and date for digital foyer displays",
    "fifteenSecondVersion": "Complete bulletin readable in 15 seconds"
  },` : ""}
  ${platforms.includes("Poster") ? `"poster": {
    "mainHeadline": "Catchy primary poster title",
    "supportingHeadline": "Subheading or tagline",
    "eventInformation": "Date, Time, Venue (factual only)",
    "cta": "Registration/Attendance action",
    "designDirection": "Color palette (Navy, Gold, White) and layout typography",
    "visualRecommendation": "Photography / graphic illustration direction"
  },` : ""}
  "metaAds": {
    "campaignObjective": "Traffic / Event Responses",
    "recommendedAudience": "Students, Parents, Academics in Assam & Meghalaya",
    "ageRange": "17 - 45",
    "gender": "All",
    "location": "Guwahati, Kamrup, Shillong, Tezpur (+50km radius)",
    "language": "English, Assamese",
    "interestTargetingIdeas": ["Higher education", "Technology", "Universities in India"],
    "audienceExclusions": "Current enrolled students where applicable",
    "customAudienceIdeas": "Website visitors past 90 days",
    "retargetingIdeas": "Engaged with Instagram/Facebook profile past 30 days",
    "campaignDuration": "7 days",
    "suggestedDailyBudget": "₹300 - ₹500",
    "suggestedTotalTestBudget": "₹2,500 - ₹3,500",
    "lowBudgetOption": "₹1,500 test (Focus on Guwahati metro)",
    "mediumBudgetOption": "₹3,500 campaign (Assam statewide)",
    "higherBudgetOption": "₹8,000 campaign (Entire Northeast states)",
    "recommendedCreativeFormat": "Single Video or Carousel with clear ADBU branding",
    "recommendedPlacement": "Instagram Feed, Reels, Facebook Feed",
    "primaryAdText": "Primary ad copy with value proposition",
    "alternativeAdText": "Alternative short benefit-driven copy",
    "headline": "Ad headline (under 40 chars)",
    "alternativeHeadline": "Alternative punchy headline",
    "description": "Ad description link text",
    "cta": "Learn More / Sign Up",
    "testingRecommendations": "A/B test headline variation A vs B",
    "disclaimer": "AI RECOMMENDATION: Budget figures and audience estimates are strategic recommendations only. Human coordinator must authorize advertising spend."
  },
  "seo": {
    "primaryKeyword": "Primary search term",
    "secondaryKeywords": ["keyword 1", "keyword 2", "keyword 3"],
    "longTailKeywords": ["long tail 1", "long tail 2"],
    "socialSearchKeywords": ["social keyword 1", "social keyword 2"],
    "suggestedTitle": "SEO Page / Announcement Title (50-60 chars)",
    "metaDescription": "Engaging meta description under 155 chars",
    "urlSlug": "kebab-case-url-slug",
    "imageAltText": "SEO-friendly accessibility image alt text",
    "suggestedContentTopics": ["Topic 1", "Topic 2"]
  }
}

Respond ONLY with the JSON object.
`;

    const rawResponse = await this.provider.generateText(
      prompt,
      this.buildSystemPrompt()
    );

    const parsed = this.cleanAndParseJSON(rawResponse);

    return {
      overview: parsed.overview || {
        campaignStrategy: `Comprehensive promotion strategy for ${eventData.title}`,
        mainCampaignMessage: `Join us for ${eventData.title} at ${eventData.location || "Assam Don Bosco University"}.`,
        targetAudience: "ADBU students, faculty, alumni, and prospective applicants",
        recommendedCampaignDuration: "7-10 days leading up to event",
        recommendedPostingSchedule: "T-7 announcement, T-3 details, T-1 reminder, Event day live updates",
        contentPillars: ["Academic Excellence", "Campus Life", "Student Empowerment"],
      },
      instagram: parsed.instagram,
      facebook: parsed.facebook,
      linkedin: parsed.linkedin,
      x: parsed.x,
      stories: parsed.stories,
      reel: parsed.reel,
      campusTv: parsed.campusTv,
      poster: parsed.poster,
      metaAds: parsed.metaAds,
      seo: parsed.seo,
      isAiGenerated: true,
      aiProvider: this.provider.name,
      modelUsed: status.model,
      generatedAt: new Date().toISOString(),
    };
  }

  // 2. Individual Platform Generators
  async generatePlatformContent(
    platform: string,
    eventData: EventInputData,
    objectives: string[]
  ): Promise<any> {
    if (platform === "Instagram Reel") return this.generateReel(eventData, objectives);
    if (platform === "Instagram Stories") return this.generateStories(eventData, objectives);
    if (platform === "Campus TV") return this.generateCampusTV(eventData, objectives);
    if (platform === "Poster") return this.generatePoster(eventData, objectives);
    if (platform === "Meta Ads") return this.generateMetaAdsStrategy(eventData, objectives);
    if (platform === "SEO") return this.generateSEO(eventData, objectives);

    const status = await this.checkStatus();
    if (!status.available) {
      throw new Error(status.instructions || "Local AI is not currently available.");
    }

    const eventContext = this.buildEventContext(eventData, objectives);
    const prompt = `Generate tailored content for ${platform} for this ADBU event:
${eventContext}

Return JSON with platform-specific fields.
`;
    const res = await this.provider.generateText(prompt, this.buildSystemPrompt());
    return this.cleanAndParseJSON(res);
  }

  async generateReel(eventData: EventInputData, objectives: string[]): Promise<ReelContent> {
    const status = await this.checkStatus();
    if (!status.available) throw new Error(status.instructions || "Local AI is not currently available.");

    const prompt = `Generate an Instagram Reel script and production package for:
${this.buildEventContext(eventData, objectives)}

Return JSON with reelConcept, hook, fifteenSecondScript, thirtySecondScript, voiceover, shotList (array), sceneBySceneStructure (array of {scene, action, onScreenText}), onScreenText (array), caption, cta, hashtags (array), seoKeywords (array), editingDirection, suggestedBroll, musicAudioDirection.`;

    const res = await this.provider.generateText(prompt, this.buildSystemPrompt());
    return this.cleanAndParseJSON(res);
  }

  async generateStories(eventData: EventInputData, objectives: string[]): Promise<StoriesContent> {
    const status = await this.checkStatus();
    if (!status.available) throw new Error(status.instructions || "Local AI is not currently available.");

    const prompt = `Generate a 5-part Instagram Story sequence for:
${this.buildEventContext(eventData, objectives)}

Return JSON: { "stories": [ { "storyNumber": 1..5, "text": "...", "visualRecommendation": "...", "cta": "..." } ] }`;

    const res = await this.provider.generateText(prompt, this.buildSystemPrompt());
    return this.cleanAndParseJSON(res);
  }

  async generateCampusTV(eventData: EventInputData, objectives: string[]): Promise<CampusTVContent> {
    const status = await this.checkStatus();
    if (!status.available) throw new Error(status.instructions || "Local AI is not currently available.");

    const prompt = `Generate text bulletins for university digital signage / Campus TV displays (5s, 10s, 15s) for:
${this.buildEventContext(eventData, objectives)}

Return JSON: { "fiveSecondVersion": "...", "tenSecondVersion": "...", "fifteenSecondVersion": "..." }`;

    const res = await this.provider.generateText(prompt, this.buildSystemPrompt());
    return this.cleanAndParseJSON(res);
  }

  async generatePoster(eventData: EventInputData, objectives: string[]): Promise<PosterContent> {
    const status = await this.checkStatus();
    if (!status.available) throw new Error(status.instructions || "Local AI is not currently available.");

    const prompt = `Generate campus poster copy and design direction for:
${this.buildEventContext(eventData, objectives)}

Return JSON: { "mainHeadline": "...", "supportingHeadline": "...", "eventInformation": "...", "cta": "...", "designDirection": "...", "visualRecommendation": "..." }`;

    const res = await this.provider.generateText(prompt, this.buildSystemPrompt());
    return this.cleanAndParseJSON(res);
  }

  async generateMetaAdsStrategy(eventData: EventInputData, objectives: string[]): Promise<MetaAdsContent> {
    const status = await this.checkStatus();
    if (!status.available) throw new Error(status.instructions || "Local AI is not currently available.");

    const prompt = `Generate a Meta Ads paid campaign strategy with low/medium/high test budgets and ad copy for:
${this.buildEventContext(eventData, objectives)}

Return JSON with campaignObjective, recommendedAudience, ageRange, gender, location, language, interestTargetingIdeas (array), audienceExclusions, customAudienceIdeas, retargetingIdeas, campaignDuration, suggestedDailyBudget, suggestedTotalTestBudget, lowBudgetOption, mediumBudgetOption, higherBudgetOption, recommendedCreativeFormat, recommendedPlacement, primaryAdText, alternativeAdText, headline, alternativeHeadline, description, cta, testingRecommendations, disclaimer.`;

    const res = await this.provider.generateText(prompt, this.buildSystemPrompt());
    return this.cleanAndParseJSON(res);
  }

  async generateSEO(eventData: EventInputData, objectives: string[]): Promise<SEOContent> {
    const status = await this.checkStatus();
    if (!status.available) throw new Error(status.instructions || "Local AI is not currently available.");

    const prompt = `Generate SEO and social search keywords and meta descriptions for:
${this.buildEventContext(eventData, objectives)}

Return JSON: { "primaryKeyword": "...", "secondaryKeywords": [...], "longTailKeywords": [...], "socialSearchKeywords": [...], "suggestedTitle": "...", "metaDescription": "...", "urlSlug": "...", "imageAltText": "...", "suggestedContentTopics": [...] }`;

    const res = await this.provider.generateText(prompt, this.buildSystemPrompt());
    return this.cleanAndParseJSON(res);
  }

  // Robust JSON cleaner & parser
  private cleanAndParseJSON(text: string): any {
    try {
      const trimmed = text.trim();
      // Remove markdown code fences if present
      const jsonStart = trimmed.indexOf("{");
      const jsonEnd = trimmed.lastIndexOf("}");
      if (jsonStart !== -1 && jsonEnd !== -1) {
        const cleaned = trimmed.substring(jsonStart, jsonEnd + 1);
        return JSON.parse(cleaned);
      }
      return JSON.parse(trimmed);
    } catch (e) {
      console.error("Failed to parse AI JSON response:", text);
      throw new Error("Local AI generated invalid JSON. Please try regenerating.");
    }
  }

  // Explicit, transparent offline blueprint generator if user explicitly requests fallback
  generateOfflineTemplate(
    eventData: EventInputData,
    platforms: string[],
    objectives: string[]
  ): CampaignPackage {
    const dateFormatted = new Date(eventData.date).toLocaleDateString("en-IN", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });

    const timeStr = eventData.startTime ? `${eventData.startTime}` : "[Information required]";
    const venueStr = eventData.location || "Assam Don Bosco University";
    const deptStr = eventData.department || "ADBU Communications Division";

    return {
      overview: {
        campaignStrategy: `Strategic promotion campaign for '${eventData.title}'. Focuses on highlighting academic distinction, community participation, and university pride across digital touchpoints.`,
        mainCampaignMessage: `Join us for ${eventData.title} on ${dateFormatted} at ${venueStr}.`,
        targetAudience: "ADBU students, alumni, faculty, researchers, and regional education stakeholders",
        recommendedCampaignDuration: "10-14 days leading up to the event date",
        recommendedPostingSchedule: "T-10 Days: Official announcement • T-5 Days: Speaker/agenda highlights • T-2 Days: Final registration reminder • Event Day: Live photos and stories",
        contentPillars: [
          "Academic Distinction & Leadership",
          "Student Achievement & Innovation",
          "Campus Life at Tapesia & Azara",
        ],
      },
      instagram: platforms.includes("Instagram")
        ? {
            contentConcept: "High-contrast university branded carousel graphic with official Don Bosco navy & gold accents",
            hook: `🎓 Mark your calendars: ${eventData.title} is officially announced at Assam Don Bosco University!`,
            completeCaption: `✨ We are pleased to announce ${eventData.title}.\n\n${eventData.description}\n\n🗓 Date: ${dateFormatted}\n⏰ Time: ${timeStr}\n📍 Venue: ${venueStr}\n🏛 Division: ${deptStr}\n\nJoin the university community as we celebrate excellence. For inquiries, refer to official notice ${eventData.source || "[Information required]"}.\n\n#AssamDonBoscoUniversity #ADBU #CarpeDiem #HigherEducation #NortheastIndia`,
            shortCaption: `Save the date: ${eventData.title} on ${dateFormatted} at ${venueStr}. #ADBU`,
            cta: "Save this post and share with your classmates!",
            hashtags: [
              "#AssamDonBoscoUniversity",
              "#ADBU",
              "#CarpeDiem",
              "#DonBoscoGuwahati",
              "#HigherEdAssam",
            ],
            seoKeywords: [
              "Assam Don Bosco University events",
              eventData.title,
              "ADBU Guwahati",
            ],
            altText: `Official announcement poster for ${eventData.title} featuring Assam Don Bosco University emblem.`,
            firstComment: "Questions about attending? Drop them below or contact your departmental coordinator.",
            visualDirection: "Clean editorial layout. Blue header (#0b1d3a), gold badge (#c99700), clean white typography with photo of ADBU campus.",
            recommendedFormat: "Multi-slide Carousel (1080x1350px)",
            recommendedPostingTiming: "6:00 PM – 8:00 PM IST (peak student engagement)",
          }
        : undefined,
      facebook: platforms.includes("Facebook")
        ? {
            completePostCopy: `Assam Don Bosco University is pleased to present: ${eventData.title}.\n\n${eventData.description}\n\nEvent Information:\n• Date: ${dateFormatted}\n• Time: ${timeStr}\n• Venue: ${venueStr}\n• Organized by: ${deptStr}\n\nAll students, faculty, and stakeholders are cordially invited to participate.\n\nOfficial Reference: ${eventData.source || "[Information required]"}`,
            hook: `Official Announcement: ${eventData.title} at Assam Don Bosco University`,
            headline: `${eventData.title} | Assam Don Bosco University`,
            cta: "Click below to learn more or confirm your attendance.",
            hashtags: ["#AssamDonBoscoUniversity", "#ADBU", "#UniversityEvents"],
            seoKeywords: ["ADBU event", eventData.title, "Don Bosco Assam"],
            visualDirection: "16:9 Landscape event banner with official university seal and high-contrast typography.",
          }
        : undefined,
      linkedin: platforms.includes("LinkedIn")
        ? {
            professionalPostCopy: `Assam Don Bosco University continues its commitment to academic excellence and student development with the announcement of ${eventData.title}.\n\n${eventData.description}\n\nKey Details:\n• Date: ${dateFormatted}\n• Time: ${timeStr}\n• Location: ${venueStr}\n• Institutional Division: ${deptStr}\n\nWe look forward to meaningful discussions and institutional advancement.\n\n#HigherEducation #AssamDonBoscoUniversity #AcademicLeadership #NortheastIndia #InstitutionalExcellence`,
            hook: `Institutional Milestone: Announcing ${eventData.title}`,
            cta: "Connect with our academic coordinator or share with colleagues.",
            hashtags: [
              "#HigherEducation",
              "#AssamDonBoscoUniversity",
              "#AcademicExcellence",
              "#NortheastIndia",
            ],
            seoKeywords: [
              "ADBU research",
              "Higher education Assam",
              eventData.title,
            ],
            visualRecommendation: "Document slide PDF or high-resolution executive campus photograph.",
          }
        : undefined,
      x: platforms.includes("X")
        ? {
            completePost: `📢 Announcing ${eventData.title} at @AssamDonBosco!\n\n🗓 ${dateFormatted} | ⏰ ${timeStr}\n📍 ${venueStr}\n\nDetails: ${eventData.source || "[Information required]"}\n\n#ADBU #CarpeDiem`,
            alternativeShorterVersion: `Mark your calendars: ${eventData.title} on ${dateFormatted} at ADBU. #ADBU`,
            cta: "Retweet to spread the word to fellow students!",
            relevantHashtags: ["#ADBU", "#AssamDonBosco", "#HigherEd"],
          }
        : undefined,
      stories: platforms.includes("Instagram Stories")
        ? {
            stories: [
              {
                storyNumber: 1,
                text: `🚨 BIG ANNOUNCEMENT\n\n${eventData.title}\n\nTap to discover details ➡️`,
                visualRecommendation: "Bold typography card with university blue background and animated sound sticker.",
                cta: "Tap next for date & venue",
              },
              {
                storyNumber: 2,
                text: `🗓 WHEN & WHERE\n\nDate: ${dateFormatted}\nTime: ${timeStr}\nLocation: ${venueStr}`,
                visualRecommendation: "Photo of campus location with location pin graphic sticker.",
                cta: "Save the date sticker",
              },
              {
                storyNumber: 3,
                text: `💡 WHAT TO EXPECT\n\n${eventData.description.slice(0, 140)}...`,
                visualRecommendation: "Split screen with highlight bullet points.",
                cta: "Interactive quiz or reaction slider",
              },
              {
                storyNumber: 4,
                text: `🏛 ORGANIZED BY\n\n${deptStr}\nOfficial Ref: ${eventData.source || "[Information required]"}`,
                visualRecommendation: "Faculty/Department graphic badge.",
                cta: "DM us your questions",
              },
              {
                storyNumber: 5,
                text: `🔔 DON'T MISS OUT!\n\nTag your friends below and set your reminder!`,
                visualRecommendation: "Countdown sticker set to event date.",
                cta: "Set Reminder Sticker",
              },
            ],
          }
        : undefined,
      reel: platforms.includes("Instagram Reel")
        ? {
            reelConcept: "Fast-paced dynamic campus tour transitioning into event announcement",
            hook: "Stop scrolling if you're looking for what's happening at ADBU this month! 👀",
            fifteenSecondScript: `(0-3s) Fast cut of Tapesia Gardens: "Something major is coming to campus!"\n(3-10s) Quick text on screen: "${eventData.title} on ${dateFormatted}."\n(10-15s) "Be there at ${venueStr}! Link in bio."`,
            thirtySecondScript: `(0-5s) Aerial shot of ADBU gate: "Mark your calendars for ${dateFormatted}."\n(5-15s) Laboratory / amphitheatre montage: "${eventData.description.slice(0, 100)}."\n(15-25s) "Hosted by ${deptStr} at ${venueStr}."\n(25-30s) "Full details in bio. Don't miss it!"`,
            voiceover: `Get ready for ${eventData.title} at Assam Don Bosco University. Taking place on ${dateFormatted} at ${venueStr}. Tag your friends and see you there!`,
            shotList: [
              "Shot 1: Wide angle of Don Bosco statue and main university building",
              "Shot 2: Students collaborating in academic blocks",
              "Shot 3: Close-up of notice flyer and calendar graphic",
              "Shot 4: Dynamic pan across the event venue",
            ],
            sceneBySceneStructure: [
              { scene: 1, action: "Student walking toward camera smiling", onScreenText: "Big news dropping at ADBU..." },
              { scene: 2, action: "Fast zoom into venue", onScreenText: eventData.title },
              { scene: 3, action: "Date graphic pop-up", onScreenText: `${dateFormatted} • ${venueStr}` },
            ],
            onScreenText: [
              "Are you ready for this?",
              eventData.title,
              `${dateFormatted} @ ${venueStr}`,
              "Save & Share!",
            ],
            caption: `Get ready for ${eventData.title}! 🔥 Mark your calendars for ${dateFormatted} at ${venueStr}. Full info in bio. #ADBU #Reels #CampusVibes`,
            cta: "Share this Reel to your university group chats!",
            hashtags: ["#ADBUReels", "#AssamDonBosco", "#StudentLife", "#Guwahati"],
            seoKeywords: ["ADBU campus life", eventData.title, "events in Guwahati"],
            editingDirection: "Snappy 0.8-second cuts on beat, subtle motion blur, bold yellow subtitles.",
            suggestedBroll: "Footage of Tapesia tea gardens, Azara labs, students in library.",
            musicAudioDirection: "Trending upbeat lo-fi or indie instrumental track.",
          }
        : undefined,
      campusTv: platforms.includes("Campus TV")
        ? {
            fiveSecondVersion: `${eventData.title.toUpperCase()}\n${dateFormatted} | ${venueStr}`,
            tenSecondVersion: `${eventData.title}\nDate: ${dateFormatted} • Time: ${timeStr}\nVenue: ${venueStr} • ${deptStr}`,
            fifteenSecondVersion: `CAMPUS BULLETIN\n${eventData.title}\n\n• Date: ${dateFormatted} | Time: ${timeStr}\n• Venue: ${venueStr}\n• Organized by: ${deptStr}\n\nRefer to notice ${eventData.source || "[Information required]"}`,
          }
        : undefined,
      poster: platforms.includes("Poster")
        ? {
            mainHeadline: eventData.title,
            supportingHeadline: `Presented by ${deptStr}`,
            eventInformation: `DATE: ${dateFormatted}\nTIME: ${timeStr}\nVENUE: ${venueStr}\nREF: ${eventData.source || "[Information required]"}`,
            cta: "All students and faculty are welcome • Check department notice board",
            designDirection: "Deep university navy background (#0b1d3a), clean white Sans-Serif headings with warm gold (#c99700) sub-banners and QR code frame.",
            visualRecommendation: "High-resolution photograph of the ADBU campus amphitheatre or laboratory background with 40% dark overlay.",
          }
        : undefined,
      metaAds: {
        campaignObjective: "Event Attendance & Engagement",
        recommendedAudience: "Undergraduate & postgraduate students, faculty, and academic professionals in Assam & Meghalaya",
        ageRange: "18 - 35",
        gender: "All",
        location: "Guwahati, Kamrup, Shillong, Dispur, Nagaon (+40 km radius)",
        language: "English, Assamese",
        interestTargetingIdeas: [
          "Higher education",
          "University events",
          "Science and technology",
          "Academic conferences",
        ],
        audienceExclusions: "Non-student profiles outside Northeast region",
        customAudienceIdeas: "Website visitors to dbuniversity.ac.in past 60 days",
        retargetingIdeas: "Followers of ADBU Facebook & Instagram pages past 30 days",
        campaignDuration: "7 days prior to event date",
        suggestedDailyBudget: "₹250 - ₹500",
        suggestedTotalTestBudget: "₹2,000 - ₹3,500",
        lowBudgetOption: "₹1,200 test budget (Focus strictly on Guwahati campus radius)",
        mediumBudgetOption: "₹3,000 campaign budget (Covering Kamrup and surrounding districts)",
        higherBudgetOption: "₹6,500 full regional boost (Across Assam, Meghalaya, and Nagaland)",
        recommendedCreativeFormat: "Single Video or Carousel (1:1 and 4:5 ratios)",
        recommendedPlacement: "Instagram Feed, Reels, Facebook Feed",
        primaryAdText: `Join us at Assam Don Bosco University for ${eventData.title}. Happening on ${dateFormatted} at ${venueStr}. Experience academic innovation and student excellence.`,
        alternativeAdText: `Don't miss ${eventData.title} at ADBU. Date: ${dateFormatted}. Connect with students, faculty, and leading minds.`,
        headline: `${eventData.title} | ADBU`,
        alternativeHeadline: `Register / Learn More • ADBU`,
        description: `Official event at Assam Don Bosco University`,
        cta: "Learn More",
        testingRecommendations: "A/B test Image creative vs 15s Video Reel; compare Student interest vs General Academic interest.",
        disclaimer: "AI RECOMMENDATION: Budget figures and audience reach are strategic estimates. The human coordinator must authorize and execute advertising spend.",
      },
      seo: {
        primaryKeyword: eventData.title,
        secondaryKeywords: [
          "Assam Don Bosco University",
          "ADBU Guwahati events",
          deptStr,
        ],
        longTailKeywords: [
          `${eventData.title} ADBU registration details`,
          "events at Assam Don Bosco University Tapesia",
        ],
        socialSearchKeywords: [
          "#ADBU",
          "#AssamDonBosco",
          eventData.title.toLowerCase().replace(/[^a-z0-9]/g, ""),
        ],
        suggestedTitle: `${eventData.title} | Assam Don Bosco University`,
        metaDescription: `Discover official details for ${eventData.title} at Assam Don Bosco University on ${dateFormatted} at ${venueStr}.`,
        urlSlug: eventData.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
        imageAltText: `Official promotional graphic for ${eventData.title} at Assam Don Bosco University.`,
        suggestedContentTopics: [
          "Key event agenda and session breakdowns",
          "Student project demonstrations and highlights",
        ],
      },
      isAiGenerated: false,
      aiProvider: "offline_template (Ollama offline)",
      modelUsed: "none",
      generatedAt: new Date().toISOString(),
    };
  }
}
