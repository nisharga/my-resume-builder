import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { CVData, Education, Experience, TemplateId } from "@/types/cv";
import { genCVId, getCV } from "@/utils/cvStorage";

const LEGACY_KEY = "@cv_data_v1";

export const DEFAULT_CV: CVData = {
  id: "default",
  updatedAt: Date.now(),
  template: "sidebar",
  accent: "#2B5F75",
  personal: {
    name: "",
    title: "",
    email: "",
    phone: "",
    location: "",
    website: "",
    portfolio: "",
    linkedin: "",
  },
  summary: "",
  experience: [],
  education: [],
  skills: [],
};

// ─── thunks ───────────────────────────────────────────────────────────────────

/** Load the last active CV (with legacy fallback). */
export const loadCV = createAsyncThunk("cv/load", async () => {
  const json = await AsyncStorage.getItem(LEGACY_KEY);
  return json ? (JSON.parse(json) as CVData) : null;
});

/** Load a specific CV from the multi-CV store by ID. */
export const loadCVById = createAsyncThunk("cv/loadById", async (id: string) => {
  return getCV(id);
});

// ─── slice ────────────────────────────────────────────────────────────────────

const cvSlice = createSlice({
  name: "cv",
  initialState: DEFAULT_CV as CVData,
  reducers: {
    /** Replace the active CV with a fresh blank one. */
    resetToNewCV(state) {
      return { ...DEFAULT_CV, id: genCVId(), updatedAt: Date.now() };
    },
    setTemplate(state, action: PayloadAction<TemplateId>) {
      state.template = action.payload;
      state.updatedAt = Date.now();
    },
    setAccent(state, action: PayloadAction<string>) {
      state.accent = action.payload;
      state.updatedAt = Date.now();
    },
    updatePersonal(state, action: PayloadAction<Partial<CVData["personal"]>>) {
      Object.assign(state.personal, action.payload);
      state.updatedAt = Date.now();
    },
    updateSummary(state, action: PayloadAction<string>) {
      state.summary = action.payload;
      state.updatedAt = Date.now();
    },
    addExperience(state, action: PayloadAction<Omit<Experience, "id">>) {
      state.experience.push({ ...action.payload, id: Date.now().toString() });
      state.updatedAt = Date.now();
    },
    updateExperience(state, action: PayloadAction<Experience>) {
      const i = state.experience.findIndex((e) => e.id === action.payload.id);
      if (i !== -1) state.experience[i] = action.payload;
      state.updatedAt = Date.now();
    },
    removeExperience(state, action: PayloadAction<string>) {
      state.experience = state.experience.filter((e) => e.id !== action.payload);
      state.updatedAt = Date.now();
    },
    addEducation(state, action: PayloadAction<Omit<Education, "id">>) {
      state.education.push({ ...action.payload, id: Date.now().toString() });
      state.updatedAt = Date.now();
    },
    updateEducation(state, action: PayloadAction<Education>) {
      const i = state.education.findIndex((e) => e.id === action.payload.id);
      if (i !== -1) state.education[i] = action.payload;
      state.updatedAt = Date.now();
    },
    removeEducation(state, action: PayloadAction<string>) {
      state.education = state.education.filter((e) => e.id !== action.payload);
      state.updatedAt = Date.now();
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
      state.updatedAt = Date.now();
    },
    removeSkill(state, action: PayloadAction<string>) {
      state.skills = state.skills.filter((s) => s !== action.payload);
      state.updatedAt = Date.now();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadCV.fulfilled, (state, action) => {
        if (action.payload) {
          return {
            ...DEFAULT_CV,
            ...action.payload,
            id: action.payload.id ?? genCVId(),
            updatedAt: action.payload.updatedAt ?? Date.now(),
            personal: { ...DEFAULT_CV.personal, ...action.payload.personal },
          };
        }
        return state;
      })
      .addCase(loadCVById.fulfilled, (state, action) => {
        if (action.payload) {
          return {
            ...DEFAULT_CV,
            ...action.payload,
            personal: { ...DEFAULT_CV.personal, ...action.payload.personal },
          };
        }
        return state;
      });
  },
});

export const {
  resetToNewCV,
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
