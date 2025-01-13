export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
}

export interface Project {
  name: string;
  description: string;
}
export interface WorkExperience {
  jobTitle: string;
  company: string;
  duration: string;
  description: string;
}
export interface Education {
  degree: string;
  institution: string;
  year: string;
}

export interface Template {
  name: string;
  path: string;
}
export interface ResumeData {
  selectedTemplate: string;
  personalInfo: PersonalInfo;
  workExperiences: WorkExperience[];
  educations: Education[];
  skills: string[];
  projects: Project[];
}
