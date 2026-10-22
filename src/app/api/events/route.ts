import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const status = searchParams.get("status");
    const informationType = searchParams.get("informationType");
    const search = searchParams.get("search");
    const month = searchParams.get("month"); // 1-12
    const year = searchParams.get("year");

    const where: any = {};

    if (category && category !== "ALL") {
      where.category = category;
    }

    if (status && status !== "ALL") {
      where.status = status;
    }

    if (informationType && informationType !== "ALL") {
      where.informationType = informationType;
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
        { location: { contains: search } },
        { department: { contains: search } },
        { organizer: { contains: search } },
        { source: { contains: search } },
        { notes: { contains: search } },
      ];
    }

    if (year && month) {
      const y = parseInt(year);
      const m = parseInt(month) - 1; // 0-indexed in JS
      const startDate = new Date(Date.UTC(y, m, 1));
      const endDate = new Date(Date.UTC(y, m + 1, 0, 23, 59, 59, 999));
      where.date = {
        gte: startDate,
        lte: endDate,
      };
    }

    const events = await prisma.calendarEvent.findMany({
      where,
      include: {
        contentItems: {
          select: {
            id: true,
            title: true,
            status: true,
            platform: true,
            scheduledAt: true,
            publishedAt: true,
          },
        },
      },
      orderBy: { date: "asc" },
    });

    return NextResponse.json(events);
  } catch (error) {
    console.error("Failed to fetch calendar events:", error);
    return NextResponse.json(
      { error: "Failed to fetch calendar events" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      title,
      description,
      date,
      startTime,
      endTime,
      location,
      category,
      department,
      organizer,
      source,
      notes,
      status,
      informationType,
    } = body;

    if (!title || !description || !date || !category) {
      return NextResponse.json(
        { error: "Title, description, date, and category are required." },
        { status: 400 }
      );
    }

    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      return NextResponse.json(
        { error: "Invalid date format provided." },
        { status: 400 }
      );
    }

    // Check for duplicate calendar entry on the same day with same title and category
    const startOfDay = new Date(parsedDate);
    startOfDay.setUTCHours(0, 0, 0, 0);
    const endOfDay = new Date(parsedDate);
    endOfDay.setUTCHours(23, 59, 59, 999);

    const existingDuplicate = await prisma.calendarEvent.findFirst({
      where: {
        title: { equals: title.trim() },
        category: category,
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });

    if (existingDuplicate) {
      return NextResponse.json(
        {
          error: `A calendar entry titled "${title.trim()}" in category "${category}" already exists for this date. Duplicate entries are not permitted.`,
        },
        { status: 409 }
      );
    }

    const newEvent = await prisma.calendarEvent.create({
      data: {
        title: title.trim(),
        description: description.trim(),
        date: parsedDate,
        startTime: startTime?.trim() || null,
        endTime: endTime?.trim() || null,
        location: location?.trim() || null,
        category,
        department: department?.trim() || null,
        organizer: organizer?.trim() || null,
        source: source?.trim() || null,
        notes: notes?.trim() || null,
        status: status || "Planned",
        informationType: informationType || "OFFICIAL_ADBU",
      },
      include: {
        contentItems: true,
      },
    });

    return NextResponse.json(newEvent, { status: 201 });
  } catch (error) {
    console.error("Failed to create calendar event:", error);
    return NextResponse.json(
      { error: "Failed to create calendar event" },
      { status: 500 }
    );
  }
}
