import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding ADBU database...");

  // Clear existing items
  await prisma.contentItem.deleteMany();
  await prisma.knowledgeDocument.deleteMany();

  // Seed Content Items
  const posts = [
    {
      title: "ADBU 14th Convocation 2026 - Registration & Robe Collection Notice",
      caption: "🎓 Attention ADBU Graduands! The 14th Annual Convocation of Assam Don Bosco University is scheduled for November 15, 2026 at the Tapesia Campus Academic Amphitheatre.\n\nGraduands are requested to complete formal registration and collect their academic regalia from the Examination Branch by October 30.\n\n#AssamDonBoscoUniversity #ADBUConvocation2026 #GraduationDay #CarpeDiem",
      status: "SCHEDULED",
      platform: "MULTI",
      department: "Office of the Registrar",
      campus: "Tapesia Campus",
      tags: "#ADBU, #Convocation2026, #Graduation",
      notes: "Cross-post to LinkedIn and Facebook simultaneously. Image asset: Convocation poster.",
      scheduledAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2), // 2 days ahead
    },
    {
      title: "School of Technology: National Hackathon 'Technovation 2026' Registrations",
      caption: "⚡ Calling all innovators, designers, and coders! The School of Technology, Azara Campus presents 'Technovation 2026' — 36-hour hackathon tackling AI for sustainability, smart healthcare, and disaster resilience.\n\n🏆 Cash prizes worth ₹1,50,000 + incubation support!\n\nLink in bio to register your team.\n\n#ADBUTech #Technovation2026 #HackathonAssam #CodingLife #SchoolOfTechnology",
      status: "SCHEDULED",
      platform: "INSTAGRAM",
      department: "School of Technology",
      campus: "Azara Campus",
      tags: "#Technovation2026, #Hackathon, #Coding",
      notes: "Target young tech community; attach flyer and schedule reels.",
      scheduledAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5), // 5 days ahead
    },
    {
      title: "Tapesia Campus Eco-Reserve: Bio-Diversity Walk & Photo Story",
      caption: "🌿 Glimpses from the dawn Bio-Diversity Walk at our 300-acre lush green Tapesia Gardens! Did you know our campus is home to over 120 species of birds and indigenous flora of the Brahmaputra valley?\n\nOrganized by the Eco Club and Dept. of Zoology. Preserving ecology while nurturing minds.\n\n#GreenCampus #EcoADBU #TapesiaGardens #BiodiversityWalk #NatureLovers",
      status: "PUBLISHED",
      platform: "INSTAGRAM",
      department: "Dept of Life Sciences",
      campus: "Tapesia Campus",
      tags: "#GreenCampus, #EcoADBU, #Nature",
      notes: "Post carousel completed successfully.",
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
    },
    {
      title: "Don Bosco Feast Day & Annual Cultural Fest 'D'Verve 2026'",
      caption: "✨ Celebrating the vision of Saint John Bosco with harmony, arts, and joyful celebration. D'Verve 2026 will bring students from Tapesia, Azara, and Kharguli together for 3 days of music, dance, and cultural unity.\n\nMark your calendars: November 24-26, 2026.\n\n#DonBoscoFeast #DVerve2026 #ADBUFest #CampusLife #AssamDonBosco",
      status: "DRAFT",
      platform: "FACEBOOK",
      department: "Campus Ministry & Student Affairs",
      campus: "All Campuses",
      tags: "#DVerve2026, #DonBoscoFeast, #Culture",
      notes: "Pending confirmation of guest list from Vice Chancellor's office.",
    },
    {
      title: "Admissions 2027: Merit Scholarships Announced for North-Eastern Students",
      caption: "Empowering dreams through accessible quality higher education. Assam Don Bosco University announces special merit scholarships covering up to 100% tuition for students from Northeast India excelling in academics, sports, and social innovation.\n\nExplore programs across engineering, management, humanities, and sciences.\n\n#ADBUAdmissions #Scholarships #NorthEastIndia #HigherEducation #CarpeDiem",
      status: "DRAFT",
      platform: "LINKEDIN",
      department: "Admissions Office",
      campus: "All Campuses",
      tags: "#ADBUAdmissions, #Scholarships, #Education",
      notes: "Review with Admissions director prior to scheduling.",
    },
    {
      title: "Research Milestone: Nanotechnology Lab breakthrough in water filtration",
      caption: "🔬 Researchers at ADBU School of Fundamental & Applied Sciences have published groundbreaking findings on low-cost graphene-composite membranes for filtering arsenic from groundwater in Assam.\n\nPublished in the International Journal of Environmental Science.\n\n#ADBUResearch #Nanotechnology #GreenTech #WaterPurification #AcademicExcellence",
      status: "DRAFT",
      platform: "LINKEDIN",
      department: "School of Fundamental & Applied Sciences",
      campus: "Tapesia Campus",
      tags: "#ADBUResearch, #Nanotech, #Science",
      notes: "Draft for academic social spotlight.",
    },
  ];

  for (const post of posts) {
    await prisma.contentItem.create({ data: post });
  }

  // Seed Knowledge Documents
  const knowledgeDocs = [
    {
      title: "ADBU Overview & Foundational Identity",
      category: "Branding",
      tags: "history, naac, vision, mission, motto",
      content: `Assam Don Bosco University (ADBU) was established in 2008 by the Salesians of Don Bosco (Don Bosco Society). It is the first university in Northeast India in the private sector.
- Motto: 'Carpe Diem' (Seize the Day)
- NAAC Accreditation: Accredited with 'A' Grade
- Core Values: Integrity, academic excellence, social commitment, cultural harmony, and eco-friendly stewardship.
- Recognition: Approved by UGC, AICTE, and member of the Association of Commonwealth Universities (ACU).`,
    },
    {
      title: "ADBU Campuses & Locations Guide",
      category: "Campus Life",
      tags: "tapesia, azara, kharguli, locations, facilities",
      content: `1. Tapesia Campus (Main Campus): Located at Sonapur, Kamrup District, Assam (approx 20 km from Guwahati). Spans 300+ acres with rolling tea gardens, natural lake, amphitheatre, botanical reserves, and hostels. Houses School of Humanities & Social Sciences, School of Fundamental & Applied Sciences, and School of Life Sciences.
2. Azara Campus: Located at Airport Road, Azara, Guwahati. Focuses on technological and business education. Houses School of Technology (Engineering & IT) and School of Commerce & Management.
3. Kharguli Campus: Situated atop scenic Kharguli Hills overlooking the Brahmaputra River. Houses the Don Bosco Institute (DBI), management training, skill development, and community programs.`,
    },
    {
      title: "Academic Schools & Divisions",
      category: "Academics",
      tags: "schools, engineering, humanities, science, management",
      content: `- School of Technology: Computer Science, Civil, Mechanical, Electronics, Electrical, AI & Data Science.
- School of Humanities & Social Sciences: Mass Communication, Education, Psychology, Social Work, English, Public Administration.
- School of Fundamental & Applied Sciences: Physics, Chemistry, Mathematics, Nanotechnology.
- School of Life Sciences: Biotechnology, Zoology, Botany, Biochemistry.
- School of Commerce & Management: BBA, MBA, Commerce, Logistics.`,
    },
    {
      title: "Social Media Tone & Communications Policy",
      category: "Branding",
      tags: "guidelines, hashtags, tone, voice, policy",
      content: `- Tone of Voice: Professional, warm, empowering, academically distinguished, celebrating student achievements.
- Official Hashtags: #AssamDonBoscoUniversity, #ADBU, #CarpeDiem, #DonBoscoGuwahati.
- Prohibitions: No partisan political statements, unverified notices, or unauthorized use of university emblem.
- Coordination Desk: Central Communications Division, Registrar's Office.`,
    },
    {
      title: "Admissions & Scholarship Programs",
      category: "Admissions",
      tags: "admissions, fees, eligibility, merit scholarship",
      content: `- Admissions Cycle: Typically opens in February for monsoon semester (commencing August).
- Merit Scholarship: Up to 100% waiver on tuition for meritorious students and sports achievers from North-Eastern states.
- Need-based Aid: Available through Don Bosco Scholarship Fund for underprivileged youth.`,
    },
  ];

  for (const doc of knowledgeDocs) {
    await prisma.knowledgeDocument.create({ data: doc });
  }

  console.log("Seeding complete! Added 6 posts and 5 knowledge documents.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
