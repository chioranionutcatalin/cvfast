import type { CVType } from "./types";

export type CvLayout = "classic" | "compact";

export const HOME_MODEL_SECTIONS = {
  personal: true,
  experience: true,
  skills: true,
  languages: true,
  education: true,
} as const;

const harveySpectorClassicCv: CVType = {
  personalData: {
    firstName: "Harvey",
    lastName: "Specter",
    email: "harvey@specterlegal.com",
    phone: "+1 555 123 4567",
    country: "USA",
    city: "New York, NY",
    linkedInUrl: "https://www.linkedin.com/in/harvey-specter",
    personalWebsite: "https://specterlegal.com",
    driverLicenseCategory: "B",
    desiredJobTitle: "Senior Partner",
    summary:
      "Accomplished senior partner with over 15 years of experience in corporate law, specializing in mergers and acquisitions. Known for a strategic approach to complex legal challenges and a track record of securing favorable outcomes for high-profile clients.",
    profileImageUrl: "/avatars/harvey-specter.jpg",
  },
  experienceData: [
    {
      role: "Senior Partner",
      companyName: "Pearson Specter Litt",
      startDate: { day: null, month: 1, year: 2023 },
      stillWorkingHere: true,
      location: "New York, NY",
      description:
        "Led the firm's most critical and lucrative cases, consistently increasing firm revenue through successful high-stakes negotiations and litigation.",
    },
    {
      role: "Associate to Junior Partner",
      companyName: "Gordon Schmidt Van Dyke",
      startDate: { day: null, month: 1, year: 1998 },
      endDate: { day: null, month: 1, year: 2003 },
      location: "New York, NY",
      description:
        "Advanced rapidly through performance in mergers and acquisitions, advising multinational clients and delivering consistent wins in securities disputes.",
    },
  ],
  skillsData: [
    { name: "Corporate Law and Litigation", proficiencyLevel: "Expert" },
    { name: "Advanced Negotiation Techniques", proficiencyLevel: "Expert" },
    { name: "Risk Management", proficiencyLevel: "Advanced" },
    { name: "Strategic Planning", proficiencyLevel: "Advanced" },
    { name: "Leadership", proficiencyLevel: "Expert" },
  ],
  languagesData: [
    {
      language: "English",
      proficiencyLevel: "Native",
      cefrLevel: "C2",
      certificate: {
        name: "IELTS",
        date: { day: null, month: 6, year: 1997 },
        expires: { day: null, month: 6, year: 2007 },
      },
    },
    {
      language: "French",
      proficiencyLevel: "Fluent",
      cefrLevel: "C1",
    },
  ],
  educationData: [
    {
      institutionName: "Harvard Law School",
      startDate: { day: null, month: 9, year: 1994 },
      endDate: { day: null, month: 6, year: 1997 },
      location: "Cambridge, MA",
      degreeType: "Juris Doctor",
      fieldOfStudy: "Corporate Law",
    },
  ],
};

const harryPotterCompactCv: CVType = {
  personalData: {
    firstName: "Harry",
    lastName: "Potter",
    email: "harrypotter@hogwarts.edu",
    phone: "(018) 157-0842",
    country: "England",
    city: "London",
    linkedInUrl: "",
    personalWebsite: "",
    driverLicenseCategory: "",
    desiredJobTitle: "Professional Wizard",
    summary:
      "Mission-driven wizard with extensive field experience in high-risk defensive operations, dark arts countermeasures, and team leadership under pressure.",
    profileImageUrl: "/avatars/harry-potter.jpg",
  },
  experienceData: [
    {
      role: "Ministry Auror",
      companyName: "Ministry of Magic",
      startDate: { day: null, month: 5, year: 1998 },
      stillWorkingHere: true,
      location: "London, England",
      description:
        "Accepted into the Auror Department without N.E.W.T.s; helped reform operations, improved capture rates, and led field teams in post-war stabilization missions.",
    },
    {
      role: "Co-Founder & Field Leader",
      companyName: "Dumbledore's Army",
      startDate: { day: null, month: 9, year: 1995 },
      endDate: { day: null, month: 6, year: 1997 },
      location: "Hogwarts, Scotland",
      description:
        "Trained students in practical defensive magic and coordinated tactical response to high-threat encounters.",
    },
  ],
  skillsData: [
    { name: "Defensive Magic", proficiencyLevel: "Expert" },
    { name: "Dueling Under Pressure", proficiencyLevel: "Expert" },
    { name: "Dark Arts Countermeasures", proficiencyLevel: "Advanced" },
    { name: "Team Leadership", proficiencyLevel: "Advanced" },
    { name: "Strategic Decision-Making", proficiencyLevel: "Advanced" },
  ],
  languagesData: [
    {
      language: "English",
      proficiencyLevel: "Native",
      cefrLevel: "C2",
    },
    {
      language: "Parseltongue",
      proficiencyLevel: "Fluent",
    },
  ],
  educationData: [
    {
      institutionName: "Hogwarts School of Witchcraft and Wizardry",
      startDate: { day: null, month: 9, year: 1991 },
      endDate: { day: null, month: 6, year: 1998 },
      location: "Scotland",
      degreeType: "Bachelor of Wizardry",
      fieldOfStudy: "Defense Against the Dark Arts",
      description:
        "Primary concentration in practical defensive spellwork, with advanced coursework in Potions, Herbology, and Magical Creatures.",
    },
  ],
};

export const HOME_MODEL_CVS: Record<CvLayout, CVType> = {
  classic: harveySpectorClassicCv,
  compact: harryPotterCompactCv,
};
