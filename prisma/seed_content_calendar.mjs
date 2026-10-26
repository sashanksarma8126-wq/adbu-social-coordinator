import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * ADBU Social Coordinator — Content Calendar Aug–Dec 2026
 * Seeding all events from the editorial content calendar.
 */
async function main() {
  console.log("🗓  Seeding ADBU Content Calendar (Aug–Dec 2026)...\n");

  const events = [
    // ──────────── AUGUST 2026 ────────────
    {
      title: "CSE Alumni Talk",
      description:
        "Career & Industry Readiness — Alumni from CSE share their journey from ADBU to industry. Talking-head clip format. LED: Alumni spotlight loop.",
      date: new Date("2026-08-06T10:00:00+05:30"),
      startTime: "10:00 AM",
      endTime: null,
      location: "Azara Campus",
      category: "Department Event",
      department: "School of Technology",
      organizer: "Dept of Computer Science & Engineering",
      source: "Content Calendar 2026",
      notes:
        "Priority: Medium | Platforms: Instagram, LinkedIn | Type: Talking-head clip | Hook: From ADBU to industry — alumni share their journey | LED: Alumni spotlight loop",
      status: "Planned",
      informationType: "OFFICIAL_ADBU",
    },
    {
      title: "Staff Development Programme — Azara",
      description:
        "Academic Excellence & Research — Investing in our people through professional development for faculty and staff.",
      date: new Date("2026-08-08T09:00:00+05:30"),
      startTime: "09:00 AM",
      endTime: null,
      location: "Azara Campus",
      category: "Workshop / Seminar",
      department: "Office of the Registrar",
      organizer: "HR & Faculty Development",
      source: "Content Calendar 2026",
      notes:
        "Priority: Low | Platforms: LinkedIn | Type: Photo post | Hook: Investing in our people | LED: —",
      status: "Planned",
      informationType: "OFFICIAL_ADBU",
    },
    {
      title: "1st Semester Commencement (Non-B.Tech) + MSW Orientation",
      description:
        "Student Life & Culture — Another cohort begins their ADBU journey. First semester classes commence for non-B.Tech programmes and MSW orientation takes place.",
      date: new Date("2026-08-10T09:00:00+05:30"),
      startTime: "09:00 AM",
      endTime: null,
      location: "Tapesia Campus",
      category: "Academic Calendar",
      department: "Office of the Registrar",
      organizer: "Registrar's Office",
      source: "Content Calendar 2026",
      notes:
        "Priority: HIGH | Platforms: Instagram, YouTube Shorts | Type: Reel | Hook: Another cohort begins their ADBU journey | LED: Orientation day info screen",
      status: "Confirmed",
      informationType: "OFFICIAL_ADBU",
    },
    {
      title: "International Youth Day — Good Governance GD (SHSS-PAD)",
      description:
        "Community & Regional Pride — Students debate the future of governance on International Youth Day. Group discussion organised by the Dept of Public Administration.",
      date: new Date("2026-08-12T10:00:00+05:30"),
      startTime: "10:00 AM",
      endTime: null,
      location: "Tapesia Campus",
      category: "International / National Observance",
      department: "School of Humanities & Social Sciences",
      organizer: "Dept of Public Administration",
      source: "Content Calendar 2026",
      notes:
        "Priority: Medium | Platforms: Instagram | Type: Carousel + quotes | Hook: Students debate the future of governance | LED: Event highlights loop",
      status: "Planned",
      informationType: "EXTERNAL_OBSERVANCE",
    },
    {
      title: "Blood Donation Camp + World Photography Day Workshop",
      description:
        "Community & Regional Pride — Every drop counts — ADBU gives back. Blood donation camp combined with a World Photography Day workshop on campus.",
      date: new Date("2026-08-14T09:00:00+05:30"),
      startTime: "09:00 AM",
      endTime: "05:00 PM",
      location: "Tapesia Campus",
      category: "Student Activity",
      department: "Campus Ministry & Student Affairs",
      organizer: "Student Council & NSS",
      source: "Content Calendar 2026",
      notes:
        "Priority: HIGH | Platforms: Instagram, Facebook | Type: Live coverage reel | Hook: Every drop counts — ADBU gives back | LED: Donor thank-you wall + live count",
      status: "Planned",
      informationType: "OFFICIAL_ADBU",
    },
    {
      title: "Independence Day Celebration",
      description:
        "Community & Regional Pride — Patriotic tribute with flag hoisting ceremony on campus. Flagship post/reel across all platforms.",
      date: new Date("2026-08-15T08:00:00+05:30"),
      startTime: "08:00 AM",
      endTime: "12:00 PM",
      location: "All Campuses",
      category: "Important University Date",
      department: "Office of the Registrar",
      organizer: "University Administration",
      source: "Content Calendar 2026",
      notes:
        "Priority: HIGH | Platforms: All platforms | Type: Flagship post/reel | Hook: Patriotic tribute — flag hoisting on campus | LED: Independence Day graphic all day",
      status: "Confirmed",
      informationType: "OFFICIAL_ADBU",
    },
    {
      title: "National Counselling Psychology Day",
      description:
        "Student Life & Culture — Mental health matters. Meet our counselling team and learn about the support systems available at ADBU.",
      date: new Date("2026-08-17T10:00:00+05:30"),
      startTime: "10:00 AM",
      endTime: null,
      location: "Tapesia Campus",
      category: "International / National Observance",
      department: "School of Humanities & Social Sciences",
      organizer: "Dept of Psychology",
      source: "Content Calendar 2026",
      notes:
        "Priority: Low | Platforms: Instagram | Type: Static post | Hook: Mental health matters — meet our counselling team | LED: Counselling helpline info",
      status: "Planned",
      informationType: "EXTERNAL_OBSERVANCE",
    },
    {
      title: "Raspberry Pi & Python Workshop (SOT-EEE) + VAANI Programme",
      description:
        "Academic Excellence & Research — Hands-on tech: students building real projects. Multi-day workshop on Raspberry Pi and Python by the Dept of EEE, alongside the VAANI communication programme.",
      date: new Date("2026-08-18T09:00:00+05:30"),
      startTime: "09:00 AM",
      endTime: "05:00 PM",
      location: "Azara Campus",
      category: "Workshop / Seminar",
      department: "School of Technology",
      organizer: "Dept of Electrical & Electronics Engineering",
      source: "Content Calendar 2026",
      notes:
        "Priority: Medium | Platforms: Instagram, LinkedIn | Type: Reel + carousel | Hook: Hands-on tech: students building real projects | LED: Workshop registration QR | Duration: 18–20 Aug",
      status: "Planned",
      informationType: "OFFICIAL_ADBU",
    },
    {
      title: "Induction: 1st/3rd Sem Lateral Entry (SOT-ECE)",
      description:
        "Student Life & Culture — Welcoming our lateral entry students into the ECE department for their 1st and 3rd semesters.",
      date: new Date("2026-08-22T10:00:00+05:30"),
      startTime: "10:00 AM",
      endTime: null,
      location: "Azara Campus",
      category: "Academic Calendar",
      department: "School of Technology",
      organizer: "Dept of Electronics & Communication Engineering",
      source: "Content Calendar 2026",
      notes:
        "Priority: Low | Platforms: Instagram | Type: Photo post | Hook: Welcoming our lateral entry students | LED: —",
      status: "Planned",
      informationType: "OFFICIAL_ADBU",
    },
    {
      title: "Symposium on Research Funding Opportunities (Science & Tech)",
      description:
        "Academic Excellence & Research — Fuelling research ambition at ADBU. Symposium exploring funding avenues for Science and Technology research.",
      date: new Date("2026-08-27T10:00:00+05:30"),
      startTime: "10:00 AM",
      endTime: "04:00 PM",
      location: "Tapesia Campus",
      category: "Conference",
      department: "School of Fundamental & Applied Sciences",
      organizer: "Research & Innovation Cell",
      source: "Content Calendar 2026",
      notes:
        "Priority: Medium | Platforms: LinkedIn | Type: Highlight reel | Hook: Fuelling research ambition at ADBU | LED: Research grant deadlines",
      status: "Planned",
      informationType: "OFFICIAL_ADBU",
    },
    {
      title: "VAC Launch (BBA/MBA/IMBA)",
      description:
        "New Programs & Admissions — New value-added course now live for BBA, MBA, and IMBA programmes.",
      date: new Date("2026-08-28T10:00:00+05:30"),
      startTime: "10:00 AM",
      endTime: null,
      location: "Tapesia Campus",
      category: "Admission-related Date",
      department: "School of Commerce & Management",
      organizer: "Director of Admissions",
      source: "Content Calendar 2026",
      notes:
        "Priority: Medium | Platforms: Instagram, LinkedIn | Type: Announcement post | Hook: New value-added course now live | LED: VAC enrolment info",
      status: "Planned",
      informationType: "OFFICIAL_ADBU",
    },
    {
      title: "Symposium: Research Funding (Commerce, Mgmt, Humanities)",
      description:
        "Academic Excellence & Research — Opening doors to research funding across disciplines. Symposium for Commerce, Management, and Humanities departments.",
      date: new Date("2026-08-29T10:00:00+05:30"),
      startTime: "10:00 AM",
      endTime: "04:00 PM",
      location: "Tapesia Campus",
      category: "Conference",
      department: "School of Commerce & Management",
      organizer: "Research & Innovation Cell",
      source: "Content Calendar 2026",
      notes:
        "Priority: Low | Platforms: LinkedIn | Type: Photo post | Hook: Opening doors to research funding across disciplines | LED: —",
      status: "Planned",
      informationType: "OFFICIAL_ADBU",
    },

    // ──────────── SEPTEMBER 2026 ────────────
    {
      title: "Janmashtami — University Holiday",
      description:
        "Community & Regional Pride — Janmashtami greetings from ADBU. University holiday for the auspicious occasion.",
      date: new Date("2026-09-04T00:00:00+05:30"),
      startTime: null,
      endTime: null,
      location: "All Campuses",
      category: "Important University Date",
      department: null,
      organizer: null,
      source: "Content Calendar 2026",
      notes:
        "Priority: Low | Platforms: Instagram | Type: Festive graphic | Hook: Janmashtami greetings from ADBU | LED: Holiday notice",
      status: "Confirmed",
      informationType: "EXTERNAL_OBSERVANCE",
    },
    {
      title: "Dr. Bhupen Hazarika Birth Anniversary",
      description:
        "Community & Regional Pride — Remembering Sudhakantha — the voice of the Brahmaputra. Tribute reel/video across all platforms.",
      date: new Date("2026-09-08T00:00:00+05:30"),
      startTime: null,
      endTime: null,
      location: "All Campuses",
      category: "International / National Observance",
      department: null,
      organizer: "Communications Division",
      source: "Content Calendar 2026",
      notes:
        "Priority: HIGH | Platforms: All platforms | Type: Tribute reel/video | Hook: Remembering Sudhakantha — the voice of the Brahmaputra | LED: Full-day tribute loop with his music",
      status: "Confirmed",
      informationType: "EXTERNAL_OBSERVANCE",
    },
    {
      title: "International Literacy Day + Launch of Bosco Mellifluence",
      description:
        "Academic Excellence & Research — Introducing Bosco Mellifluence — literacy meets creativity. International Literacy Day paired with the launch of the Bosco Mellifluence programme.",
      date: new Date("2026-09-08T10:00:00+05:30"),
      startTime: "10:00 AM",
      endTime: null,
      location: "Tapesia Campus",
      category: "University Event",
      department: "School of Humanities & Social Sciences",
      organizer: "Academic Council",
      source: "Content Calendar 2026",
      notes:
        "Priority: Medium | Platforms: Instagram, YouTube | Type: Launch reel | Hook: Introducing Bosco Mellifluence — literacy meets creativity | LED: Launch announcement",
      status: "Planned",
      informationType: "OFFICIAL_ADBU",
    },
    {
      title: "World Suicide Prevention Day (SHSS-PSY)",
      description:
        "Student Life & Culture — You are not alone — ADBU's mental health support. Awareness initiative by the Dept of Psychology.",
      date: new Date("2026-09-10T10:00:00+05:30"),
      startTime: "10:00 AM",
      endTime: null,
      location: "Tapesia Campus",
      category: "International / National Observance",
      department: "School of Humanities & Social Sciences",
      organizer: "Dept of Psychology",
      source: "Content Calendar 2026",
      notes:
        "Priority: Medium | Platforms: Instagram | Type: Value-led static post | Hook: You are not alone — ADBU's mental health support | LED: Helpline numbers on loop",
      status: "Planned",
      informationType: "EXTERNAL_OBSERVANCE",
    },
    {
      title: "Foundation Day — Department of Psychology",
      description:
        "Academic Excellence & Research — Celebrating the Psychology department's journey on its Foundation Day.",
      date: new Date("2026-09-11T10:00:00+05:30"),
      startTime: "10:00 AM",
      endTime: null,
      location: "Tapesia Campus",
      category: "Department Event",
      department: "School of Humanities & Social Sciences",
      organizer: "Dept of Psychology",
      source: "Content Calendar 2026",
      notes:
        "Priority: Low | Platforms: Instagram | Type: Photo carousel | Hook: Celebrating the Psychology department's journey | LED: —",
      status: "Planned",
      informationType: "OFFICIAL_ADBU",
    },
    {
      title: "CONVOCATION 2026",
      description:
        "Student Life & Culture — Our graduates, our pride — Convocation 2026. Flagship event with multi-cam live coverage, reels, and long-form YouTube content.",
      date: new Date("2026-09-16T09:00:00+05:30"),
      startTime: "09:00 AM",
      endTime: "04:00 PM",
      location: "Academic Amphitheatre, Tapesia Campus",
      category: "University Event",
      department: "Office of the Registrar",
      organizer: "Examination & Convocation Directorate",
      source: "Content Calendar 2026",
      notes:
        "Priority: FLAGSHIP | Platforms: All platforms | Type: Multi-cam live coverage + reels + long-form YouTube | Hook: Our graduates, our pride — Convocation 2026 | LED: Full-day convocation live feed graduate wall",
      status: "Confirmed",
      informationType: "OFFICIAL_ADBU",
    },
    {
      title: "Techstorm 2.0 — IIMCIP-TIC",
      description:
        "Student Life & Culture — Innovation takes the stage at Techstorm 2.0. Multi-day tech competition with live reels and winner announcements.",
      date: new Date("2026-09-18T09:00:00+05:30"),
      startTime: "09:00 AM",
      endTime: "06:00 PM",
      location: "Azara Campus",
      category: "Student Activity",
      department: "School of Technology",
      organizer: "IIMCIP-TIC",
      source: "Content Calendar 2026",
      notes:
        "Priority: HIGH | Platforms: Instagram, YouTube Shorts | Type: Live reels + winner announcements | Hook: Innovation takes the stage at Techstorm 2.0 | LED: Live leaderboard / schedule | Duration: 18–19 Sep",
      status: "Planned",
      informationType: "OFFICIAL_ADBU",
    },
    {
      title: "Prajyukttam / Arthavarhana / MERCEMOC Week",
      description:
        "Student Life & Culture — Three fests, one week of ADBU energy. Combined departmental fests spanning multiple days.",
      date: new Date("2026-09-22T09:00:00+05:30"),
      startTime: "09:00 AM",
      endTime: "06:00 PM",
      location: "Tapesia & Azara Campuses",
      category: "Student Activity",
      department: "Multiple Departments",
      organizer: "Student Council & Department Heads",
      source: "Content Calendar 2026",
      notes:
        "Priority: Medium | Platforms: Instagram, YouTube | Type: Event reels | Hook: Three fests, one week of ADBU energy | LED: Fest schedule loop | Duration: 22–24 Sep",
      status: "Planned",
      informationType: "OFFICIAL_ADBU",
    },
    {
      title: "World Pharmacist Day + Sustainable Engineering Symposium (SOT-EEE)",
      description:
        "Academic Excellence & Research — Honouring our pharmacists shaping healthcare. World Pharmacist Day combined with the SOT-EEE Sustainable Engineering Symposium.",
      date: new Date("2026-09-25T10:00:00+05:30"),
      startTime: "10:00 AM",
      endTime: "04:00 PM",
      location: "Tapesia Campus",
      category: "International / National Observance",
      department: "School of Life Sciences",
      organizer: "Institute of Pharmacy & SOT-EEE",
      source: "Content Calendar 2026",
      notes:
        "Priority: Medium | Platforms: LinkedIn, Instagram | Type: Photo post | Hook: Honouring our pharmacists shaping healthcare | LED: —",
      status: "Planned",
      informationType: "EXTERNAL_OBSERVANCE",
    },
    {
      title: "World Tourism Day (SHSS-HHA)",
      description:
        "Career & Industry Readiness — Hospitality students celebrate World Tourism Day. Activities organised by the Dept of Hotel & Hospitality Administration.",
      date: new Date("2026-09-27T10:00:00+05:30"),
      startTime: "10:00 AM",
      endTime: null,
      location: "Tapesia Campus",
      category: "International / National Observance",
      department: "School of Humanities & Social Sciences",
      organizer: "Dept of Hotel & Hospitality Administration",
      source: "Content Calendar 2026",
      notes:
        "Priority: Low | Platforms: Instagram | Type: Static post | Hook: Hospitality students celebrate World Tourism Day | LED: —",
      status: "Planned",
      informationType: "EXTERNAL_OBSERVANCE",
    },
    {
      title: "World Heart Day (SLS-ZG)",
      description:
        "Student Life & Culture — Take care of your heart — health tips from ADBU. Awareness initiative by the Dept of Zoology & Life Sciences.",
      date: new Date("2026-09-29T10:00:00+05:30"),
      startTime: "10:00 AM",
      endTime: null,
      location: "Tapesia Campus",
      category: "International / National Observance",
      department: "School of Life Sciences",
      organizer: "Dept of Zoology",
      source: "Content Calendar 2026",
      notes:
        "Priority: Low | Platforms: Instagram | Type: Static post | Hook: Take care of your heart — health tips from ADBU | LED: Health awareness slide",
      status: "Planned",
      informationType: "EXTERNAL_OBSERVANCE",
    },

    // ──────────── OCTOBER 2026 ────────────
    {
      title: "Gandhi Jayanti",
      description:
        "Community & Regional Pride — Remembering the Father of the Nation. Tribute post across all platforms.",
      date: new Date("2026-10-02T00:00:00+05:30"),
      startTime: null,
      endTime: null,
      location: "All Campuses",
      category: "Important University Date",
      department: null,
      organizer: "University Administration",
      source: "Content Calendar 2026",
      notes:
        "Priority: Medium | Platforms: All platforms | Type: Tribute post | Hook: Remembering the Father of the Nation | LED: Holiday graphic",
      status: "Confirmed",
      informationType: "EXTERNAL_OBSERVANCE",
    },
    {
      title: "World Animal Day & Wildlife Week (SLS-ZG)",
      description:
        "Academic Excellence & Research — Celebrating wildlife with our Zoology department. Awareness carousel for World Animal Day and Wildlife Week.",
      date: new Date("2026-10-05T10:00:00+05:30"),
      startTime: "10:00 AM",
      endTime: null,
      location: "Tapesia Campus",
      category: "International / National Observance",
      department: "School of Life Sciences",
      organizer: "Dept of Zoology",
      source: "Content Calendar 2026",
      notes:
        "Priority: Low | Platforms: Instagram | Type: Carousel | Hook: Celebrating wildlife with our Zoology department | LED: —",
      status: "Planned",
      informationType: "EXTERNAL_OBSERVANCE",
    },
    {
      title: "World Mental Health Day (SHSS-PSY)",
      description:
        "Student Life & Culture — Mental health is health — ADBU's support systems. Awareness post by the Dept of Psychology.",
      date: new Date("2026-10-10T10:00:00+05:30"),
      startTime: "10:00 AM",
      endTime: null,
      location: "Tapesia Campus",
      category: "International / National Observance",
      department: "School of Humanities & Social Sciences",
      organizer: "Dept of Psychology",
      source: "Content Calendar 2026",
      notes:
        "Priority: Medium | Platforms: Instagram | Type: Value-led static post | Hook: Mental health is health — ADBU's support systems | LED: Counselling contact info",
      status: "Planned",
      informationType: "EXTERNAL_OBSERVANCE",
    },
    {
      title: "Special Lecture with University of Le Havre, Normandie France (SOT-CVE)",
      description:
        "Academic Excellence & Research — Global collaboration: ADBU meets Le Havre, France. Special lecture co-hosted by SOT-CVE and the University of Le Havre.",
      date: new Date("2026-10-10T14:00:00+05:30"),
      startTime: "02:00 PM",
      endTime: "04:00 PM",
      location: "Azara Campus",
      category: "Workshop / Seminar",
      department: "School of Technology",
      organizer: "Dept of Civil Engineering",
      source: "Content Calendar 2026",
      notes:
        "Priority: Medium | Platforms: LinkedIn | Type: Announcement post | Hook: Global collaboration: ADBU meets Le Havre, France | LED: International tie-up banner",
      status: "Planned",
      informationType: "OFFICIAL_ADBU",
    },
    {
      title: "Mid-Semester Break + Durga Puja",
      description:
        "Community & Regional Pride — Durga Puja greetings — campus takes a festive pause. University mid-semester break coinciding with Durga Puja celebrations.",
      date: new Date("2026-10-17T00:00:00+05:30"),
      startTime: null,
      endTime: null,
      location: "All Campuses",
      category: "Important University Date",
      department: null,
      organizer: null,
      source: "Content Calendar 2026",
      notes:
        "Priority: Medium | Platforms: Instagram | Type: Festive greetings | Hook: Durga Puja greetings — campus takes a festive pause | LED: Holiday notice | Duration: 17–21 Oct",
      status: "Confirmed",
      informationType: "EXTERNAL_OBSERVANCE",
    },
    {
      title: "World Polio Day (SLS-IoP)",
      description:
        "Career & Industry Readiness — Pharmacy students raise polio awareness. Observance led by the Institute of Pharmacy.",
      date: new Date("2026-10-24T10:00:00+05:30"),
      startTime: "10:00 AM",
      endTime: null,
      location: "Tapesia Campus",
      category: "International / National Observance",
      department: "School of Life Sciences",
      organizer: "Institute of Pharmacy",
      source: "Content Calendar 2026",
      notes:
        "Priority: Low | Platforms: Instagram | Type: Static post | Hook: Pharmacy students raise polio awareness | LED: —",
      status: "Planned",
      informationType: "EXTERNAL_OBSERVANCE",
    },
    {
      title: "Vigilance Awareness Week",
      description:
        "Community & Regional Pride — A week dedicated to integrity and vigilance. Carousel series across the week.",
      date: new Date("2026-10-27T00:00:00+05:30"),
      startTime: null,
      endTime: null,
      location: "All Campuses",
      category: "Important University Date",
      department: null,
      organizer: "University Administration",
      source: "Content Calendar 2026",
      notes:
        "Priority: Medium | Platforms: Instagram, LinkedIn | Type: Carousel series | Hook: A week dedicated to integrity and vigilance | LED: Daily theme slide | Duration: 27 Oct – 2 Nov",
      status: "Planned",
      informationType: "EXTERNAL_OBSERVANCE",
    },

    // ──────────── NOVEMBER 2026 ────────────
    {
      title: "ICMAST-2026 Conference",
      description:
        "Academic Excellence & Research — ADBU hosts ICMAST-2026 — research on a national stage. Multi-day international conference with highlight reels and speaker clips.",
      date: new Date("2026-11-05T09:00:00+05:30"),
      startTime: "09:00 AM",
      endTime: "05:00 PM",
      location: "Tapesia Campus",
      category: "Conference",
      department: "School of Fundamental & Applied Sciences",
      organizer: "Research & Innovation Cell",
      source: "Content Calendar 2026",
      notes:
        "Priority: HIGH | Platforms: LinkedIn, YouTube | Type: Highlight reel + speaker clips | Hook: ADBU hosts ICMAST-2026 — research on a national stage | LED: Conference schedule + speaker wall | Duration: 5–6 Nov",
      status: "Planned",
      informationType: "OFFICIAL_ADBU",
    },
    {
      title: "Diwali",
      description:
        "Community & Regional Pride — Happy Diwali from the ADBU family. Festive flagship post across all platforms.",
      date: new Date("2026-11-08T00:00:00+05:30"),
      startTime: null,
      endTime: null,
      location: "All Campuses",
      category: "Important University Date",
      department: null,
      organizer: null,
      source: "Content Calendar 2026",
      notes:
        "Priority: HIGH | Platforms: All platforms | Type: Festive flagship post | Hook: Happy Diwali from the ADBU family | LED: Diwali greeting loop",
      status: "Confirmed",
      informationType: "EXTERNAL_OBSERVANCE",
    },
    {
      title: "Alumni Meet & Interaction (SLS-ZG)",
      description:
        "Career & Industry Readiness — Where are they now? ADBU alumni reconnect. Alumni meet organised by the Dept of Zoology.",
      date: new Date("2026-11-10T10:00:00+05:30"),
      startTime: "10:00 AM",
      endTime: "04:00 PM",
      location: "Tapesia Campus",
      category: "Department Event",
      department: "School of Life Sciences",
      organizer: "Dept of Zoology",
      source: "Content Calendar 2026",
      notes:
        "Priority: Medium | Platforms: Instagram, LinkedIn | Type: Reel | Hook: Where are they now? ADBU alumni reconnect | LED: Alumni spotlight loop",
      status: "Planned",
      informationType: "OFFICIAL_ADBU",
    },
    {
      title: "Regional Food Festival (SHSS-HHA)",
      description:
        "Student Life & Culture — A taste of the Northeast — ADBU's food festival. Vlog-style reel coverage of the regional food fest by Hotel & Hospitality students.",
      date: new Date("2026-11-13T10:00:00+05:30"),
      startTime: "10:00 AM",
      endTime: "06:00 PM",
      location: "Tapesia Campus",
      category: "Student Activity",
      department: "School of Humanities & Social Sciences",
      organizer: "Dept of Hotel & Hospitality Administration",
      source: "Content Calendar 2026",
      notes:
        "Priority: Medium | Platforms: Instagram, YouTube Shorts | Type: Vlog-style reel | Hook: A taste of the Northeast — ADBU's food festival | LED: Food fest menu + map",
      status: "Planned",
      informationType: "OFFICIAL_ADBU",
    },
    {
      title: "World Diabetes Day (SLS-ZG)",
      description:
        "Student Life & Culture — Health awareness from our Zoology & Life Sciences team. Awareness post for World Diabetes Day.",
      date: new Date("2026-11-14T10:00:00+05:30"),
      startTime: "10:00 AM",
      endTime: null,
      location: "Tapesia Campus",
      category: "International / National Observance",
      department: "School of Life Sciences",
      organizer: "Dept of Zoology",
      source: "Content Calendar 2026",
      notes:
        "Priority: Low | Platforms: Instagram | Type: Static post | Hook: Health awareness from our Zoology & Life Sciences team | LED: —",
      status: "Planned",
      informationType: "EXTERNAL_OBSERVANCE",
    },
    {
      title: "National Pharmacy Week",
      description:
        "Career & Industry Readiness — Celebrating our future pharmacists all week. Daily carousel content throughout the week.",
      date: new Date("2026-11-16T10:00:00+05:30"),
      startTime: "10:00 AM",
      endTime: null,
      location: "Tapesia Campus",
      category: "International / National Observance",
      department: "School of Life Sciences",
      organizer: "Institute of Pharmacy",
      source: "Content Calendar 2026",
      notes:
        "Priority: Medium | Platforms: Instagram, LinkedIn | Type: Daily carousel | Hook: Celebrating our future pharmacists all week | LED: Daily theme slide | Duration: 16–20 Nov",
      status: "Planned",
      informationType: "EXTERNAL_OBSERVANCE",
    },
    {
      title: "World GIS Day (SOT-CVE)",
      description:
        "Academic Excellence & Research — Mapping the future with GIS at ADBU. World GIS Day observance by the Civil Engineering department.",
      date: new Date("2026-11-18T10:00:00+05:30"),
      startTime: "10:00 AM",
      endTime: null,
      location: "Azara Campus",
      category: "International / National Observance",
      department: "School of Technology",
      organizer: "Dept of Civil Engineering",
      source: "Content Calendar 2026",
      notes:
        "Priority: Low | Platforms: Instagram | Type: Static post | Hook: Mapping the future with GIS at ADBU | LED: —",
      status: "Planned",
      informationType: "EXTERNAL_OBSERVANCE",
    },
    {
      title: "Lachit Divas",
      description:
        "Community & Regional Pride — Honouring Lachit Borphukan — Assam's legendary warrior. Tribute post/reel across all platforms.",
      date: new Date("2026-11-24T00:00:00+05:30"),
      startTime: null,
      endTime: null,
      location: "All Campuses",
      category: "Important University Date",
      department: null,
      organizer: "Communications Division",
      source: "Content Calendar 2026",
      notes:
        "Priority: HIGH | Platforms: All platforms | Type: Tribute post/reel | Hook: Honouring Lachit Borphukan — Assam's legendary warrior | LED: Full-day tribute loop",
      status: "Confirmed",
      informationType: "EXTERNAL_OBSERVANCE",
    },
    {
      title: "Constitution Day (SHSS-PAD) — BA LLB Tie-in",
      description:
        "New Programs & Admissions — On Constitution Day, discover ADBU's new BA LLB programme. Themed post with a tie-in to the new BA LLB offering.",
      date: new Date("2026-11-26T10:00:00+05:30"),
      startTime: "10:00 AM",
      endTime: null,
      location: "Tapesia Campus",
      category: "International / National Observance",
      department: "School of Humanities & Social Sciences",
      organizer: "Dept of Public Administration",
      source: "Content Calendar 2026",
      notes:
        "Priority: HIGH | Platforms: All platforms | Type: Themed post + BA LLB tie-in | Hook: On Constitution Day, discover ADBU's new BA LLB programme | LED: BA LLB promo + Constitution Day quote",
      status: "Planned",
      informationType: "OFFICIAL_ADBU",
    },

    // ──────────── DECEMBER 2026 ────────────
    {
      title: "National Mathematics Day (SOT-BS)",
      description:
        "Academic Excellence & Research — Celebrating numbers — National Mathematics Day. Observance by the Dept of Basic Sciences.",
      date: new Date("2026-12-22T10:00:00+05:30"),
      startTime: "10:00 AM",
      endTime: null,
      location: "Azara Campus",
      category: "International / National Observance",
      department: "School of Technology",
      organizer: "Dept of Basic Sciences",
      source: "Content Calendar 2026",
      notes:
        "Priority: Low | Platforms: Instagram, LinkedIn | Type: Static post | Hook: Celebrating numbers — National Mathematics Day | LED: —",
      status: "Planned",
      informationType: "EXTERNAL_OBSERVANCE",
    },
    {
      title: "Christmas",
      description:
        "Community & Regional Pride — Merry Christmas from the Don Bosco family. Festive flagship post across all platforms.",
      date: new Date("2026-12-25T00:00:00+05:30"),
      startTime: null,
      endTime: null,
      location: "All Campuses",
      category: "Important University Date",
      department: "Campus Ministry & Student Affairs",
      organizer: "Campus Ministry",
      source: "Content Calendar 2026",
      notes:
        "Priority: HIGH | Platforms: All platforms | Type: Festive flagship post | Hook: Merry Christmas from the Don Bosco family | LED: Christmas greeting loop",
      status: "Confirmed",
      informationType: "OFFICIAL_ADBU",
    },
  ];

  let created = 0;
  let skipped = 0;

  for (const evt of events) {
    // Check for existing duplicate
    const startOfDay = new Date(evt.date);
    startOfDay.setUTCHours(0, 0, 0, 0);
    const endOfDay = new Date(evt.date);
    endOfDay.setUTCHours(23, 59, 59, 999);

    const existing = await prisma.calendarEvent.findFirst({
      where: {
        title: evt.title,
        date: { gte: startOfDay, lte: endOfDay },
      },
    });

    if (existing) {
      console.log(`  ⏭  Skipped (already exists): ${evt.title}`);
      skipped++;
      continue;
    }

    await prisma.calendarEvent.create({ data: evt });
    console.log(`  ✅ Created: ${evt.title} — ${evt.date.toLocaleDateString("en-IN")}`);
    created++;
  }

  console.log(`\n🎉 Done! Created ${created} events, skipped ${skipped} duplicates.`);
  console.log(`   Total events in DB: ${await prisma.calendarEvent.count()}`);
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
