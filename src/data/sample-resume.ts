import type { CVData } from "@/types/cv";

export const sampleResume: Omit<CVData, "id" | "updatedAt"> = {
  template: "sidebar",
  accent: "#2B5F75",
  personal: {
    name: "Alex Johnson",
    title: "Senior Frontend Developer",
    email: "alex.johnson@email.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    website: "alexjohnson.dev",
    portfolio: "github.com/alexjohnson",
    linkedin: "linkedin.com/in/alexjohnson",
  },
  summary:
    "Experienced frontend developer with 6+ years building scalable web applications. Passionate about clean code, performance optimization, and great user experiences.",
  experience: [
    {
      id: "exp1",
      role: "Senior Frontend Developer",
      company: "TechCorp Inc.",
      start: "2021",
      end: "Present",
      desc: "Led development of React-based dashboard used by 50K+ users\nReduced page load time by 40% through code splitting and lazy loading\nMentored junior developers and conducted weekly code reviews",
    },
    {
      id: "exp2",
      role: "Frontend Developer",
      company: "StartupXYZ",
      start: "2019",
      end: "2021",
      desc: "Built responsive UI components with React and TypeScript\nIntegrated REST APIs and managed state with Redux\nImplemented pixel-perfect designs from Figma mockups",
    },
  ],
  education: [
    {
      id: "edu1",
      degree: "B.Sc. Computer Science",
      school: "University of California",
      start: "2015",
      end: "2019",
    },
  ],
  skills: ["React", "TypeScript", "JavaScript", "Redux", "Node.js", "CSS", "Git", "Figma"],
  achievements: [
    {
      id: "ach1",
      name: "Achievement & Reward",
      enabled: true,
      value: "Employee of the Year 2022 — TechCorp Inc.",
    },
  ],
};
