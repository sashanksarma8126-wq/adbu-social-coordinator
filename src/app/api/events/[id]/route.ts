import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const event = await prisma.calendarEvent.findUnique({
      where: { id: params.id },
      include: {
        contentItems: true,
      },
    });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    return NextResponse.json(event);
  } catch (error) {
    console.error("Failed to fetch event:", error);
    return NextResponse.json(
      { error: "Failed to fetch event" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const data: any = {};

    if (body.title !== undefined) data.title = body.title.trim();
    if (body.description !== undefined) data.description = body.description.trim();
    if (body.date !== undefined) data.date = new Date(body.date);
    if (body.startTime !== undefined) data.startTime = body.startTime?.trim() || null;
    if (body.endTime !== undefined) data.endTime = body.endTime?.trim() || null;
    if (body.location !== undefined) data.location = body.location?.trim() || null;
    if (body.category !== undefined) data.category = body.category;
    if (body.department !== undefined) data.department = body.department?.trim() || null;
    if (body.organizer !== undefined) data.organizer = body.organizer?.trim() || null;
    if (body.source !== undefined) data.source = body.source?.trim() || null;
    if (body.notes !== undefined) data.notes = body.notes?.trim() || null;
    if (body.status !== undefined) data.status = body.status;
    if (body.informationType !== undefined) data.informationType = body.informationType;

    const updated = await prisma.calendarEvent.update({
      where: { id: params.id },
      data,
      include: {
        contentItems: true,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Failed to update event:", error);
    return NextResponse.json(
      { error: "Failed to update event" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.calendarEvent.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete event:", error);
    return NextResponse.json(
      { error: "Failed to delete event" },
      { status: 500 }
    );
  }
}
