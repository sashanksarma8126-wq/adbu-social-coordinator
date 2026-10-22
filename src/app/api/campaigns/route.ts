import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get("eventId");

    const where: any = {};
    if (eventId) {
      where.eventId = eventId;
    }

    const campaigns = await prisma.contentCampaign.findMany({
      where,
      include: {
        event: {
          select: {
            id: true,
            title: true,
            date: true,
            category: true,
            location: true,
            department: true,
          },
        },
        contentItems: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(campaigns);
  } catch (error: any) {
    console.error("Failed to fetch campaigns:", error);
    return NextResponse.json(
      { error: "Failed to fetch campaigns" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      eventId,
      title,
      objectives = [],
      platforms = [],
      overview,
      packageData,
      status = "DRAFT",
      isAiGenerated = true,
      aiProvider = "ollama",
      modelUsed,
      createContentItems = true,
    } = body;

    if (!title || !packageData) {
      return NextResponse.json(
        { error: "Campaign title and package data are required." },
        { status: 400 }
      );
    }

    const campaign = await prisma.contentCampaign.create({
      data: {
        title: title.trim(),
        eventId: eventId || null,
        objectives: Array.isArray(objectives) ? JSON.stringify(objectives) : objectives,
        platforms: Array.isArray(platforms) ? JSON.stringify(platforms) : platforms,
        strategy: overview?.campaignStrategy || null,
        mainMessage: overview?.mainCampaignMessage || null,
        targetAudience: overview?.targetAudience || null,
        duration: overview?.recommendedCampaignDuration || null,
        postingSchedule: overview?.recommendedPostingSchedule || null,
        contentPillars: Array.isArray(overview?.contentPillars)
          ? JSON.stringify(overview.contentPillars)
          : null,
        packageData: typeof packageData === "string" ? packageData : JSON.stringify(packageData),
        status,
        isAiGenerated: Boolean(isAiGenerated),
        aiProvider: aiProvider || "ollama",
        modelUsed: modelUsed || null,
      },
    });

    // Optionally create individual ContentItems for each generated platform
    if (createContentItems) {
      const pkg = typeof packageData === "string" ? JSON.parse(packageData) : packageData;
      const contentItemPromises: Promise<any>[] = [];

      if (pkg.instagram?.completeCaption) {
        contentItemPromises.push(
          prisma.contentItem.create({
            data: {
              title: `${title} - Instagram Post`,
              caption: pkg.instagram.completeCaption,
              platform: "INSTAGRAM",
              status: "DRAFT",
              department: "General Communications",
              campus: "All Campuses",
              tags: Array.isArray(pkg.instagram.hashtags) ? pkg.instagram.hashtags.join(", ") : "",
              eventId: eventId || null,
              campaignId: campaign.id,
              metadata: JSON.stringify({
                hook: pkg.instagram.hook,
                shortCaption: pkg.instagram.shortCaption,
                visualDirection: pkg.instagram.visualDirection,
                altText: pkg.instagram.altText,
              }),
            },
          })
        );
      }

      if (pkg.facebook?.completePostCopy) {
        contentItemPromises.push(
          prisma.contentItem.create({
            data: {
              title: `${title} - Facebook Post`,
              caption: pkg.facebook.completePostCopy,
              platform: "FACEBOOK",
              status: "DRAFT",
              department: "General Communications",
              campus: "All Campuses",
              tags: Array.isArray(pkg.facebook.hashtags) ? pkg.facebook.hashtags.join(", ") : "",
              eventId: eventId || null,
              campaignId: campaign.id,
              metadata: JSON.stringify({
                headline: pkg.facebook.headline,
                visualDirection: pkg.facebook.visualDirection,
              }),
            },
          })
        );
      }

      if (pkg.linkedin?.professionalPostCopy) {
        contentItemPromises.push(
          prisma.contentItem.create({
            data: {
              title: `${title} - LinkedIn Post`,
              caption: pkg.linkedin.professionalPostCopy,
              platform: "LINKEDIN",
              status: "DRAFT",
              department: "General Communications",
              campus: "All Campuses",
              tags: Array.isArray(pkg.linkedin.hashtags) ? pkg.linkedin.hashtags.join(", ") : "",
              eventId: eventId || null,
              campaignId: campaign.id,
              metadata: JSON.stringify({
                hook: pkg.linkedin.hook,
                visualRecommendation: pkg.linkedin.visualRecommendation,
              }),
            },
          })
        );
      }

      if (pkg.x?.completePost) {
        contentItemPromises.push(
          prisma.contentItem.create({
            data: {
              title: `${title} - X Post`,
              caption: pkg.x.completePost,
              platform: "X",
              status: "DRAFT",
              department: "General Communications",
              campus: "All Campuses",
              tags: Array.isArray(pkg.x.relevantHashtags) ? pkg.x.relevantHashtags.join(", ") : "",
              eventId: eventId || null,
              campaignId: campaign.id,
              metadata: JSON.stringify({
                shorterVersion: pkg.x.alternativeShorterVersion,
              }),
            },
          })
        );
      }

      if (pkg.poster?.mainHeadline) {
        contentItemPromises.push(
          prisma.contentItem.create({
            data: {
              title: `${title} - Campus Poster Copy`,
              caption: `${pkg.poster.mainHeadline}\n\n${pkg.poster.supportingHeadline}\n\n${pkg.poster.eventInformation}\n\n${pkg.poster.cta}`,
              platform: "POSTER",
              status: "DRAFT",
              department: "General Communications",
              campus: "All Campuses",
              eventId: eventId || null,
              campaignId: campaign.id,
              metadata: JSON.stringify({
                designDirection: pkg.poster.designDirection,
                visualRecommendation: pkg.poster.visualRecommendation,
              }),
            },
          })
        );
      }

      if (contentItemPromises.length > 0) {
        await Promise.all(contentItemPromises);
      }
    }

    const result = await prisma.contentCampaign.findUnique({
      where: { id: campaign.id },
      include: { contentItems: true, event: true },
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    console.error("Failed to create campaign:", error);
    return NextResponse.json(
      { error: "Failed to create campaign", details: error.toString() },
      { status: 500 }
    );
  }
}
