export interface PersonalDataType {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  linkedInUrl?: string;
  personalWebsite?: string;
  profileImageUrl?: string;
  driverLicenseCategory?: string;
  desiredJobTitle?: string;
  summary?: string;
}

export type DateParts = {
  day: number | null;
  month: number;
  year: number;
};

export interface ExperienceType {
  role: string;
  companyName: string;
  startDate: DateParts;
  endDate?: DateParts;
  location?: string;
  remote?: boolean;
  stillWorkingHere?: boolean;
  description?: string;
}

export interface SkillType {
  name: string;
  proficiencyLevel?: 'N/A' | 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
}

export interface LanguageType {
  language: string;
  proficiencyLevel?: 'Beginner' | 'Intermediate' | 'Advanced' | 'Fluent' | 'Native';
  cefrLevel?: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  certificate?: {
    name: string;
    date?: DateParts;
    expires?: DateParts;
  };
}

export interface EducationType {
  institutionName: string;
  startDate: DateParts;
  endDate?: DateParts;
  location?: string;
  degreeType?: string;
  fieldOfStudy?: string;
  description?: string;
  stillStudying?: boolean;
}

export interface CVType {
  personalData: PersonalDataType;
  experienceData: ExperienceType[];
  skillsData: SkillType[];
  languagesData: LanguageType[];
  educationData: EducationType[];
}
