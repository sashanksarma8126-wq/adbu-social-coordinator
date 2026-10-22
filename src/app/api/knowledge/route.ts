import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");

    const where: any = {};
    if (category && category !== "ALL") {
      where.category = category;
    }
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { content: { contains: search } },
        { tags: { contains: search } },
      ];
    }

    const docs = await prisma.knowledgeDocument.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(docs);
  } catch (error) {
    console.error("Failed to fetch knowledge docs:", error);
    return NextResponse.json(
      { error: "Failed to fetch knowledge docs" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, category, content, tags } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      );
    }

    const doc = await prisma.knowledgeDocument.create({
      data: {
        title: title.trim(),
        category: category || "General",
        content: content.trim(),
        tags: tags || "",
      },
    });

    return NextResponse.json(doc, { status: 201 });
  } catch (error) {
    console.error("Failed to create knowledge doc:", error);
    return NextResponse.json(
      { error: "Failed to create knowledge doc" },
      { status: 500 }
    );
  }
}
