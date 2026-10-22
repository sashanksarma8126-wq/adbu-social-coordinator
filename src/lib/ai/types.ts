export type PlatformType =
  | "Instagram"
  | "Facebook"
  | "LinkedIn"
  | "X"
  | "Instagram Stories"
  | "Instagram Reel"
  | "Campus TV"
  | "Poster";

export type CampaignObjective =
  | "Awareness"
  | "Engagement"
  | "Event Attendance"
  | "Registration"
  | "Website Traffic"
  | "Admissions"
  | "Lead Generation"
  | "Recruitment";

export interface EventInputData {
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
  status: string;
  informationType: string;
}

export interface InstagramContent {
  contentConcept: string;
  hook: string;
  completeCaption: string;
  shortCaption: string;
  cta: string;
  hashtags: string[];
  seoKeywords: string[];
  altText: string;
  firstComment: string;
  visualDirection: string;
  recommendedFormat: string;
  recommendedPostingTiming: string;
}

export interface FacebookContent {
  completePostCopy: string;
  hook: string;
  headline: string;
  cta: string;
  hashtags: string[];
  seoKeywords: string[];
  visualDirection: string;
}

export interface LinkedInContent {
  professionalPostCopy: string;
  hook: string;
  cta: string;
  hashtags: string[];
  seoKeywords: string[];
  visualRecommendation: string;
}

export interface XContent {
  completePost: string;
  alternativeShorterVersion: string;
  cta: string;
  relevantHashtags: string[];
}

export interface StoryItem {
  storyNumber: number;
  text: string;
  visualRecommendation: string;
  cta?: string;
}

export interface StoriesContent {
  stories: StoryItem[];
}

export interface ReelContent {
  reelConcept: string;
  hook: string;
  fifteenSecondScript: string;
  thirtySecondScript: string;
  voiceover: string;
  shotList: string[];
  sceneBySceneStructure: { scene: number; action: string; onScreenText: string }[];
  onScreenText: string[];
  caption: string;
  cta: string;
  hashtags: string[];
  seoKeywords: string[];
  editingDirection: string;
  suggestedBroll: string;
  musicAudioDirection: string;
}

export interface CampusTVContent {
  fiveSecondVersion: string;
  tenSecondVersion: string;
  fifteenSecondVersion: string;
}

export interface PosterContent {
  mainHeadline: string;
  supportingHeadline: string;
  eventInformation: string;
  cta: string;
  designDirection: string;
  visualRecommendation: string;
}

export interface MetaAdsContent {
  campaignObjective: string;
  recommendedAudience: string;
  ageRange: string;
  gender: string;
  location: string;
  language: string;
  interestTargetingIdeas: string[];
  audienceExclusions: string;
  customAudienceIdeas: string;
  retargetingIdeas: string;
  campaignDuration: string;
  suggestedDailyBudget: string;
  suggestedTotalTestBudget: string;
  lowBudgetOption: string;
  mediumBudgetOption: string;
  higherBudgetOption: string;
  recommendedCreativeFormat: string;
  recommendedPlacement: string;
  primaryAdText: string;
  alternativeAdText: string;
  headline: string;
  alternativeHeadline: string;
  description: string;
  cta: string;
  testingRecommendations: string;
  disclaimer: string;
}

export interface SEOContent {
  primaryKeyword: string;
  secondaryKeywords: string[];
  longTailKeywords: string[];
  socialSearchKeywords: string[];
  suggestedTitle: string;
  metaDescription: string;
  urlSlug: string;
  imageAltText: string;
  suggestedContentTopics: string[];
}

export interface CampaignStrategyOverview {
  campaignStrategy: string;
  mainCampaignMessage: string;
  targetAudience: string;
  recommendedCampaignDuration: string;
  recommendedPostingSchedule: string;
  contentPillars: string[];
}

export interface CampaignPackage {
  overview: CampaignStrategyOverview;
  instagram?: InstagramContent;
  facebook?: FacebookContent;
  linkedin?: LinkedInContent;
  x?: XContent;
  stories?: StoriesContent;
  reel?: ReelContent;
  campusTv?: CampusTVContent;
  poster?: PosterContent;
  metaAds?: MetaAdsContent;
  seo?: SEOContent;
  isAiGenerated: boolean;
  aiProvider: string;
  modelUsed?: string;
  generatedAt: string;
}

export interface AIProviderStatus {
  available: boolean;
  provider: string;
  endpoint: string;
  model?: string;
  availableModels?: string[];
  error?: string;
  instructions?: string;
}

export interface AIProvider {
  name: string;
  checkStatus(): Promise<AIProviderStatus>;
  generateText(prompt: string, systemPrompt?: string): Promise<string>;
}
