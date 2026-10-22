import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [draftsCount, scheduledCount, publishedCount, knowledgeCount, mediaCount, recentPosts] =
      await Promise.all([
        prisma.contentItem.count({ where: { status: "DRAFT" } }),
        prisma.contentItem.count({ where: { status: "SCHEDULED" } }),
        prisma.contentItem.count({ where: { status: "PUBLISHED" } }),
        prisma.knowledgeDocument.count(),
        prisma.mediaItem.count(),
        prisma.contentItem.findMany({
          take: 5,
          orderBy: { createdAt: "desc" },
        }),
      ]);

    return NextResponse.json({
      draftsCount,
      scheduledCount,
      publishedCount,
      knowledgeCount,
      mediaCount,
      recentPosts,
    });
  } catch (error) {
    console.error("Failed to fetch stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
