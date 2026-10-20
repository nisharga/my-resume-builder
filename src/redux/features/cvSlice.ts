import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { CVData, Education, Experience, TemplateId } from "@/types/cv";

const STORAGE_KEY = "@cv_data_v1";

const DEFAULT_CV: CVData = {
  template: "sidebar",
  accent: "#2B5F75",
  personal: {
    name: "Nusrat Jahan",
    title: "Product Designer",
    email: "nusrat.jahan@mail.com",
    phone: "+880 1711 000000",
    location: "Dhaka, Bangladesh",
    website: "nusrat.design",
    portfolio: "",
    linkedin: "",
  },
  summary:
    "Product designer with 5 years of experience building mobile and web apps for fintech and e-commerce. I turn messy requirements into clear, accessible interfaces.",
  experience: [
    {
      id: "exp1",
      role: "Senior Product Designer",
      company: "Paywise",
      start: "2023",
      end: "Present",
      desc: "Led the redesign of the mobile wallet, raising monthly active users by 22%\nBuilt a shared design system used by 4 product teams",
    },
    {
      id: "exp2",
      role: "UI/UX Designer",
      company: "ShopBazar",
      start: "2020",
      end: "2023",
      desc: "Designed checkout flow that cut drop-off by 15%",
    },
  ],
  education: [
    {
      id: "edu1",
      degree: "B.Sc. in Computer Science",
      school: "University of Dhaka",
      start: "2016",
      end: "2020",
    },
  ],
  skills: ["Figma", "Prototyping", "User research", "Design systems", "Accessibility"],
};

// ─── async thunk: hydrate from AsyncStorage on app start ─────────────────────

export const loadCV = createAsyncThunk("cv/load", async () => {
  const json = await AsyncStorage.getItem(STORAGE_KEY);
  return json ? (JSON.parse(json) as CVData) : null;
});

// ─── slice ────────────────────────────────────────────────────────────────────

const cvSlice = createSlice({
  name: "cv",
  initialState: DEFAULT_CV,
  reducers: {
    setTemplate(state, action: PayloadAction<TemplateId>) {
      state.template = action.payload;
    },
    setAccent(state, action: PayloadAction<string>) {
      state.accent = action.payload;
    },
    updatePersonal(state, action: PayloadAction<Partial<CVData["personal"]>>) {
      Object.assign(state.personal, action.payload);
    },
    updateSummary(state, action: PayloadAction<string>) {
      state.summary = action.payload;
    },
    addExperience(state, action: PayloadAction<Omit<Experience, "id">>) {
      state.experience.push({ ...action.payload, id: Date.now().toString() });
    },
    updateExperience(state, action: PayloadAction<Experience>) {
      const i = state.experience.findIndex((e) => e.id === action.payload.id);
      if (i !== -1) state.experience[i] = action.payload;
    },
    removeExperience(state, action: PayloadAction<string>) {
      state.experience = state.experience.filter((e) => e.id !== action.payload);
    },
    addEducation(state, action: PayloadAction<Omit<Education, "id">>) {
      state.education.push({ ...action.payload, id: Date.now().toString() });
    },
    updateEducation(state, action: PayloadAction<Education>) {
      const i = state.education.findIndex((e) => e.id === action.payload.id);
      if (i !== -1) state.education[i] = action.payload;
    },
    removeEducation(state, action: PayloadAction<string>) {
      state.education = state.education.filter((e) => e.id !== action.payload);
    },
    addSkill(state, action: PayloadAction<string>) {
      action.payload
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
        .forEach((skill) => {
          if (!state.skills.some((s) => s.toLowerCase() === skill.toLowerCase())) {
            state.skills.push(skill);
          }
        });
    },
    removeSkill(state, action: PayloadAction<string>) {
      state.skills = state.skills.filter((s) => s !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadCV.fulfilled, (state, action) => {
      if (action.payload) {
        // Merge default personal so new fields (portfolio, linkedin) exist in old stored data
        return {
          ...action.payload,
          personal: { ...DEFAULT_CV.personal, ...action.payload.personal },
        };
      }
      return state;
    });
  },
});

export const {
  setTemplate,
  setAccent,
  updatePersonal,
  updateSummary,
  addExperience,
  updateExperience,
  removeExperience,
  addEducation,
  updateEducation,
  removeEducation,
  addSkill,
  removeSkill,
} = cvSlice.actions;

export default cvSlice.reducer;
