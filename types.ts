
export type Message = {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  suggestions?: string[];
};

export type User = {
  id: string;
  fullName: string;
  email: string;
  university: string;
  degree: string;
  semester: string;
}

export enum Feature {
  SMART_NOTES = "Smart Notes Generator",
  MCQ_GENERATOR = "Exam MCQ Generator",
  VIVA_PREP = "Viva Preparation Mode",
  ASSIGNMENT_HELPER = "Assignment Helper",
  CODE_DEBUG = "Code Debug Assistant",
  STUDY_PLANNER = "Study Planner Generator",
  CONCEPT_SIMPLIFIER = "Concept Simplifier",
  PAST_PAPER_ANALYZER = "Past Paper Analyzer",
}
