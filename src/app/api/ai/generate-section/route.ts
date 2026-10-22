import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { AIService } from "@/lib/ai/aiService";
import { EventInputData } from "@/lib/ai/types";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { eventId, platform, objectives = [], mode = "ai" } = body;

    if (!eventId || !platform) {
      return NextResponse.json(
        { error: "Event ID and platform are required." },
        { status: 400 }
      );
    }

    const event = await prisma.calendarEvent.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      return NextResponse.json(
        { error: "Event not found in database." },
        { status: 404 }
      );
    }

    const eventData: EventInputData = {
      id: event.id,
      title: event.title,
      description: event.description,
      date: event.date.toISOString(),
      startTime: event.startTime,
      endTime: event.endTime,
      location: event.location,
      category: event.category,
      department: event.department,
      organizer: event.organizer,
      source: event.source,
      notes: event.notes,
      status: event.status,
      informationType: event.informationType,
    };

    const aiService = new AIService();

    if (mode === "template") {
      const fullTemplate = aiService.generateOfflineTemplate(
        eventData,
        [platform],
        objectives
      );

      let sectionData = null;
      if (platform === "Instagram") sectionData = fullTemplate.instagram;
      else if (platform === "Facebook") sectionData = fullTemplate.facebook;
      else if (platform === "LinkedIn") sectionData = fullTemplate.linkedin;
      else if (platform === "X") sectionData = fullTemplate.x;
      else if (platform === "Instagram Stories") sectionData = fullTemplate.stories;
      else if (platform === "Instagram Reel") sectionData = fullTemplate.reel;
      else if (platform === "Campus TV") sectionData = fullTemplate.campusTv;
      else if (platform === "Poster") sectionData = fullTemplate.poster;
      else if (platform === "Meta Ads") sectionData = fullTemplate.metaAds;
      else if (platform === "SEO") sectionData = fullTemplate.seo;

      return NextResponse.json({
        data: sectionData,
        isAiGenerated: false,
        aiProvider: "offline_template (Ollama offline)",
      });
    }

    const status = await aiService.checkStatus();
    if (!status.available) {
      return NextResponse.json(
        {
          error: "Local AI is not currently available.",
          instructions: status.instructions,
          available: false,
        },
        { status: 503 }
      );
    }

    const result = await aiService.generatePlatformContent(
      platform,
      eventData,
      objectives
    );

    return NextResponse.json({
      data: result,
      isAiGenerated: true,
      aiProvider: "ollama",
      modelUsed: status.model,
    });
  } catch (error: any) {
    console.error("Section generation error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to regenerate section" },
      { status: 500 }
    );
  }
}
