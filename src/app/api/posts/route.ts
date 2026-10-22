import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const campus = searchParams.get("campus");
    const search = searchParams.get("search");
    const eventId = searchParams.get("eventId");

    const where: any = {};
    if (status && status !== "ALL") {
      where.status = status;
    }
    if (campus && campus !== "ALL") {
      where.campus = campus;
    }
    if (eventId) {
      where.eventId = eventId;
    }
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { caption: { contains: search } },
        { department: { contains: search } },
        { tags: { contains: search } },
      ];
    }

    const posts = await prisma.contentItem.findMany({
      where,
      include: {
        event: {
          select: {
            id: true,
            title: true,
            category: true,
            date: true,
            informationType: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(posts);
  } catch (error) {
    console.error("Failed to fetch posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      title,
      caption,
      platform,
      department,
      campus,
      tags,
      notes,
      status,
      scheduledAt,
      eventId,
    } = body;

    if (!title || !caption) {
      return NextResponse.json(
        { error: "Title and caption are required" },
        { status: 400 }
      );
    }

    const post = await prisma.contentItem.create({
      data: {
        title: title.trim(),
        caption: caption.trim(),
        platform: platform || "MULTI",
        department: department || "General Communications",
        campus: campus || "Tapesia Campus",
        tags: tags || "",
        notes: notes || null,
        status: status || "DRAFT",
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
        eventId: eventId || null,
      },
      include: {
        event: true,
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error("Failed to create post:", error);
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    );
  }
}
