import { PrismaClient } from "@prisma/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";
import { createClient } from "@libsql/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  initializedTurso: boolean | undefined;
};

const INIT_SQL = `
CREATE TABLE IF NOT EXISTS "CalendarEvent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "startTime" TEXT,
    "endTime" TEXT,
    "location" TEXT,
    "category" TEXT NOT NULL,
    "department" TEXT,
    "organizer" TEXT,
    "source" TEXT,
    "notes" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Planned',
    "informationType" TEXT NOT NULL DEFAULT 'OFFICIAL_ADBU',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

CREATE TABLE IF NOT EXISTS "ContentCampaign" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "eventId" TEXT,
    "objectives" TEXT NOT NULL,
    "platforms" TEXT NOT NULL,
    "strategy" TEXT,
    "mainMessage" TEXT,
    "targetAudience" TEXT,
    "duration" TEXT,
    "postingSchedule" TEXT,
    "contentPillars" TEXT,
    "packageData" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "isAiGenerated" BOOLEAN NOT NULL DEFAULT 1,
    "aiProvider" TEXT NOT NULL DEFAULT 'ollama',
    "modelUsed" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    FOREIGN KEY ("eventId") REFERENCES "CalendarEvent" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "ContentItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "caption" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "platform" TEXT NOT NULL,
    "department" TEXT NOT NULL DEFAULT 'General Communications',
    "campus" TEXT NOT NULL DEFAULT 'Tapesia Campus',
    "tags" TEXT NOT NULL DEFAULT '',
    "notes" TEXT,
    "scheduledAt" DATETIME,
    "publishedAt" DATETIME,
    "eventId" TEXT,
    "campaignId" TEXT,
    "metadata" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    FOREIGN KEY ("eventId") REFERENCES "CalendarEvent" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY ("campaignId") REFERENCES "ContentCampaign" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "MediaItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "filename" TEXT NOT NULL,
    "filePath" TEXT NOT NULL,
    "fileType" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "KnowledgeDocument" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "tags" TEXT DEFAULT '',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

CREATE TABLE IF NOT EXISTS "AppSetting" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "key" TEXT NOT NULL UNIQUE,
    "value" TEXT NOT NULL
);
`;

function createPrismaClient(): PrismaClient {
  const rawUrl = process.env.DATABASE_URL || process.env.TURSO_DATABASE_URL || "";
  
  if (rawUrl.startsWith("libsql://") || rawUrl.startsWith("https://")) {
    let url = rawUrl;
    let authToken = process.env.TURSO_AUTH_TOKEN;

    if (rawUrl.includes("?authToken=")) {
      const parts = rawUrl.split("?authToken=");
      url = parts[0];
      authToken = parts[1];
    }

    const libsql = createClient({
      url,
      authToken,
    });

    if (!globalForPrisma.initializedTurso) {
      globalForPrisma.initializedTurso = true;
      libsql.executeMultiple(INIT_SQL).catch((err) => {
        console.warn("Turso schema auto-init notice:", err.message);
      });
    }

    const adapter = new PrismaLibSQL(libsql);
    return new PrismaClient({ adapter });
  }

  return new PrismaClient();
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
