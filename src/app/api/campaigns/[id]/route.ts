import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const campaign = await prisma.contentCampaign.findUnique({
      where: { id: params.id },
      include: {
        event: true,
        contentItems: true,
      },
    });

    if (!campaign) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
    }

    return NextResponse.json(campaign);
  } catch (error: any) {
    console.error("Failed to fetch campaign:", error);
    return NextResponse.json(
      { error: "Failed to fetch campaign" },
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
    if (body.status !== undefined) data.status = body.status;
    if (body.packageData !== undefined) {
      data.packageData =
        typeof body.packageData === "string"
          ? body.packageData
          : JSON.stringify(body.packageData);
    }
    if (body.strategy !== undefined) data.strategy = body.strategy;
    if (body.mainMessage !== undefined) data.mainMessage = body.mainMessage;
    if (body.targetAudience !== undefined) data.targetAudience = body.targetAudience;
    if (body.duration !== undefined) data.duration = body.duration;
    if (body.postingSchedule !== undefined) data.postingSchedule = body.postingSchedule;

    const updated = await prisma.contentCampaign.update({
      where: { id: params.id },
      data,
      include: {
        event: true,
        contentItems: true,
      },
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error("Failed to update campaign:", error);
    return NextResponse.json(
      { error: "Failed to update campaign" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.contentCampaign.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Failed to delete campaign:", error);
    return NextResponse.json(
      { error: "Failed to delete campaign" },
      { status: 500 }
    );
  }
}
