import React, { createContext, useContext, useState, ReactNode } from "react";
import { WorkExperience, Project, Education } from "../interfaces/types";

interface GlobalStateContextType {
  workExperiences: WorkExperience[];
  setWorkExperiences: React.Dispatch<React.SetStateAction<WorkExperience[]>>;
  skills: string[];
  setSkills: React.Dispatch<React.SetStateAction<string[]>>;
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  educations: Education[];
  setEducations: React.Dispatch<React.SetStateAction<Education[]>>;
}

const GlobalStateContext = createContext<GlobalStateContextType | undefined>(
  undefined
);

export const useGlobalState = () => {
  const context = useContext(GlobalStateContext);
  if (!context) {
    throw new Error("useGlobalState must be used within a GlobalStateProvider");
  }
  return context;
};

interface GlobalStateProviderProps {
  children: ReactNode;
}

export const GlobalStateProvider = ({ children }: GlobalStateProviderProps) => {
  const [workExperiences, setWorkExperiences] = useState<WorkExperience[]>([
    { jobTitle: "", company: "", duration: "", description: "" },
  ]);
  const [skills, setSkills] = useState<string[]>([""]);
  const [projects, setProjects] = useState<Project[]>([
    { name: "", description: "" },
  ]);
  const [educations, setEducations] = useState<Education[]>([
    { degree: "", institution: "", year: "" },
  ]);

  return (
    <GlobalStateContext.Provider
      value={{
        workExperiences,
        setWorkExperiences,
        skills,
        setSkills,
        projects,
        setProjects,
        educations,
        setEducations,
      }}
    >
      {children}
    </GlobalStateContext.Provider>
  );
};
