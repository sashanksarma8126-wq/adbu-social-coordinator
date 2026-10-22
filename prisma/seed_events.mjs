import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding ADBU events and content relationships...");

  // Fetch existing posts
  const convocationPost = await prisma.contentItem.findFirst({
    where: { title: { contains: "Convocation" } },
  });
  const hackathonPost = await prisma.contentItem.findFirst({
    where: { title: { contains: "Technovation" } },
  });
  const admissionsPost = await prisma.contentItem.findFirst({
    where: { title: { contains: "Admissions" } },
  });
  const festPost = await prisma.contentItem.findFirst({
    where: { title: { contains: "D'Verve" } },
  });

  // Clear existing calendar events
  await prisma.calendarEvent.deleteMany();

  // Create Events
  const event1 = await prisma.calendarEvent.create({
    data: {
      title: "ADBU 14th Annual Convocation 2026",
      description: "Official convocation ceremony conferring undergraduate, postgraduate, and doctoral degrees upon the graduating batch of 2026.",
      date: new Date("2026-11-15T09:30:00Z"),
      startTime: "09:30 AM",
      endTime: "02:00 PM",
      location: "Academic Amphitheatre, Tapesia Campus",
      category: "University Event",
      department: "Office of the Registrar",
      organizer: "Examination & Convocation Directorate",
      source: "Registrar Office Notification Ref: ADBU/REG/2026/104",
      notes: "Chief Guest to be confirmed by Chancellor's office. High social media priority.",
      status: "Confirmed",
      informationType: "OFFICIAL_ADBU",
    },
  });

  if (convocationPost) {
    await prisma.contentItem.update({
      where: { id: convocationPost.id },
      data: { eventId: event1.id },
    });
  }

  const event2 = await prisma.calendarEvent.create({
    data: {
      title: "Technovation 2026: 36-Hour National Hackathon",
      description: "Annual university technical hackathon inviting developers, engineers, and designers across Northeast India.",
      date: new Date("2026-10-25T10:00:00Z"),
      startTime: "10:00 AM",
      endTime: "10:00 PM",
      location: "Azara Campus Auditorium & Computer Labs",
      category: "Workshop / Seminar",
      department: "School of Technology",
      organizer: "Dept of Computer Science & Engineering",
      source: "School of Technology Circular #42/2026",
      notes: "Industry sponsors confirmed. Poster and teasers in progress.",
      status: "Confirmed",
      informationType: "OFFICIAL_ADBU",
    },
  });

  if (hackathonPost) {
    await prisma.contentItem.update({
      where: { id: hackathonPost.id },
      data: { eventId: event2.id },
    });
  }

  const event3 = await prisma.calendarEvent.create({
    data: {
      title: "Autumn Semester Mid-Term Examinations",
      description: "Mid-semester evaluations for B.Tech, BCA, MCA, M.Tech, and MSc programs across Azara and Tapesia campuses.",
      date: new Date("2026-10-28T09:00:00Z"),
      startTime: "09:00 AM",
      endTime: "04:30 PM",
      location: "All Campuses",
      category: "Examination-related Date",
      department: "Office of Controller of Examinations",
      organizer: "Examination Cell",
      source: "ADBU Academic Calendar 2026-27 (Gazetted)",
      notes: "Publish reminder notices on student portal and Instagram stories.",
      status: "Confirmed",
      informationType: "OFFICIAL_ADBU",
    },
  });

  const event4 = await prisma.calendarEvent.create({
    data: {
      title: "World Science Day for Peace & Development",
      description: "International observance promoting science for society and inspiring youth in scientific research.",
      date: new Date("2026-11-10T10:00:00Z"),
      startTime: "10:00 AM",
      endTime: "12:30 PM",
      location: "Science Complex, Tapesia Campus",
      category: "International / National Observance",
      department: "School of Fundamental & Applied Sciences",
      organizer: "Eco & Science Council",
      source: "UNESCO International Calendar",
      notes: "External opportunity to highlight ADBU's research achievements and student science exhibits.",
      status: "Planned",
      informationType: "EXTERNAL_OBSERVANCE",
    },
  });

  const event5 = await prisma.calendarEvent.create({
    data: {
      title: "D'Verve 2026: Annual Inter-Campus Cultural & Sports Fest",
      description: "3-day festival uniting students from Tapesia, Azara, and Kharguli in music, dance, athletics, and cultural exhibitions.",
      date: new Date("2026-11-24T09:00:00Z"),
      startTime: "09:00 AM",
      endTime: "07:00 PM",
      location: "Tapesia Sports Complex & Cultural Grounds",
      category: "Student Activity",
      department: "Campus Ministry & Student Affairs",
      organizer: "Student Council & Cultural Committee",
      source: "Director of Student Affairs Circular 2026/19",
      notes: "Main event of the semester. Requires full campaign coverage.",
      status: "Planned",
      informationType: "OFFICIAL_ADBU",
    },
  });

  if (festPost) {
    await prisma.contentItem.update({
      where: { id: festPost.id },
      data: { eventId: event5.id },
    });
  }

  const event6 = await prisma.calendarEvent.create({
    data: {
      title: "Spring 2027 Admissions Application Portal Opens",
      description: "Official launch of online applications for undergraduate and postgraduate programs for the spring academic intake.",
      date: new Date("2026-11-01T00:00:00Z"),
      startTime: "08:00 AM",
      endTime: "11:59 PM",
      location: "Online (admissions.dbuniversity.ac.in)",
      category: "Admission-related Date",
      department: "Admissions Office",
      organizer: "Director of Admissions",
      source: "Admissions Committee Resolution #03/2026",
      notes: "Campaign to highlight merit scholarships for North-Eastern students.",
      status: "Confirmed",
      informationType: "OFFICIAL_ADBU",
    },
  });

  if (admissionsPost) {
    await prisma.contentItem.update({
      where: { id: admissionsPost.id },
      data: { eventId: event6.id },
    });
  }

  const event7 = await prisma.calendarEvent.create({
    data: {
      title: "AI Suggested: Regional Green Campus & Sustainable Water Forum",
      description: "Proposed department symposium leveraging recent faculty water purification research and regional environmental challenges.",
      date: new Date("2026-11-18T14:00:00Z"),
      startTime: "02:00 PM",
      endTime: "05:00 PM",
      location: "Conference Hall, Azara Campus",
      category: "Conference",
      department: "School of Fundamental & Applied Sciences",
      organizer: "AI Coordination Planner",
      source: "AI Idea Synthesis based on ADBU Water Purification Publication",
      notes: "AI Suggestion — Never treat as official until vetted and approved by HoD/Dean.",
      status: "Planned",
      informationType: "AI_SUGGESTION",
    },
  });

  console.log("Successfully seeded 7 calendar events with connected content items!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
