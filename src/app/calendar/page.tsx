import { prisma } from "@/lib/prisma";
import CalendarClient, { CalendarEventItem } from "./CalendarClient";

export const dynamic = "force-dynamic";

export default async function CalendarPage() {
  const rawEvents = await prisma.calendarEvent.findMany({
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

  // Serialize dates for Client Component props
  const initialEvents: CalendarEventItem[] = rawEvents.map((evt) => ({
    id: evt.id,
    title: evt.title,
    description: evt.description,
    date: evt.date.toISOString(),
    startTime: evt.startTime,
    endTime: evt.endTime,
    location: evt.location,
    category: evt.category,
    department: evt.department,
    organizer: evt.organizer,
    source: evt.source,
    notes: evt.notes,
    status: evt.status as any,
    informationType: evt.informationType as any,
    contentItems: evt.contentItems.map((c) => ({
      id: c.id,
      title: c.title,
      status: c.status as any,
      platform: c.platform,
      scheduledAt: c.scheduledAt ? c.scheduledAt.toISOString() : null,
      publishedAt: c.publishedAt ? c.publishedAt.toISOString() : null,
    })),
    createdAt: evt.createdAt.toISOString(),
    updatedAt: evt.updatedAt.toISOString(),
  }));

  return <CalendarClient initialEvents={initialEvents} />;
}
