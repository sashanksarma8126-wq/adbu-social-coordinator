import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { AIService } from "@/lib/ai/aiService";
import { EventInputData } from "@/lib/ai/types";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { eventId, platforms = [], objectives = [], mode = "ai" } = body;

    if (!eventId) {
      return NextResponse.json(
        { error: "Event ID is required to generate campaign content." },
        { status: 400 }
      );
    }

    const event = await prisma.calendarEvent.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      return NextResponse.json(
        { error: "Event not found in local database." },
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
      // Explicit offline template request (transparently labeled)
      const campaignPackage = aiService.generateOfflineTemplate(
        eventData,
        platforms,
        objectives
      );
      return NextResponse.json(campaignPackage);
    }

    // Try live local Ollama AI
    const status = await aiService.checkStatus();
    if (!status.available) {
      return NextResponse.json(
        {
          error: "Local AI is not currently available.",
          details: status.error,
          instructions:
            status.instructions ||
            "Please ensure Ollama is installed and running at http://localhost:11434.",
          available: false,
        },
        { status: 503 }
      );
    }

    const campaignPackage = await aiService.generateCampaign(
      eventData,
      platforms,
      objectives
    );

    return NextResponse.json(campaignPackage);
  } catch (error: any) {
    console.error("AI Generation error:", error);
    return NextResponse.json(
      {
        error: error.message || "Failed to generate campaign",
        details: error.toString(),
      },
      { status: 500 }
    );
  }
}
