export interface PersonalDataType {
  fullName: string;
  jobTitle?: string;
  summary?: string;
  email: string;
  phone?: string;
  location?: string;
  linkedInUrl?: string;
  personalWebsite?: string;
  profileImageUrl?: string;
  driverLicenseCategory?: string;
}

export interface ExperienceType {
  jobTitle: string;
  companyName: string;
  startDate: string;
  endDate?: string;
  location?: string;
  stillWorkingHere?: boolean;
}

export interface AbilityType {
  name: string;
  proficiencyLevel?: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
}

export interface LanguageType {
  language: string;
  proficiencyLevel?: 'Beginner' | 'Intermediate' | 'Advanced' | 'Fluent' | 'Native';
}

export interface EducationType {
  institutionName: string;
  startDate: string;
  endDate?: string;
  location?: string;
  degreeType?: string;
  fieldOfStudy?: string;
  description?: string;
}

export interface CVType {
  personalData: PersonalDataType;
  experienceData: ExperienceType[];
  abilitiesData: AbilityType[];
  languagesData: LanguageType[];
  educationData: EducationType[];
}
