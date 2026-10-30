import { afterEach, beforeEach, describe, expect, it, jest } from "@jest/globals";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { configureStore, type UnknownAction } from "@reduxjs/toolkit";

import reducer, {
  DEFAULT_CV,
  addAchievement,
  addEducation,
  addExperience,
  addSkill,
  loadCV,
  loadCVById,
  removeAchievement,
  removeEducation,
  removeExperience,
  removeSkill,
  resetToNewCV,
  setAccent,
  setTemplate,
  toggleAchievement,
  updateAchievementValue,
  updateEducation,
  updateExperience,
  updatePersonal,
  updateSummary,
} from "@/redux/features/cvSlice";
import type { Achievement, CVData, Education, Experience, TemplateId } from "@/types/cv";
import { genCVId, getCV } from "@/utils/cvStorage";

jest.mock("@/utils/cvStorage", () => ({
  genCVId: jest.fn(),
  getCV: jest.fn(),
}));

// ─── test data ────────────────────────────────────────────────────────────────

const NOW = 1_700_000_000_000;
const NEW_ID = "cv_new";
const LEGACY_KEY = "@cv_data_v1";

// TODO: replace these field names with the real ones from @/types/cv
const newJob = (data: Record<string, unknown> = {}) =>
  ({ title: "Full Stack Developer", company: "Taqwa", ...data }) as unknown as Omit<
    Experience,
    "id"
  >;

const newEducation = (data: Record<string, unknown> = {}) =>
  ({ degree: "BSc in CSE", institution: "Dhaka University", ...data }) as unknown as Omit<
    Education,
    "id"
  >;

const newAchievement = (data: Partial<Omit<Achievement, "id">> = {}): Omit<Achievement, "id"> => ({
  name: "Hackathon winner",
  enabled: true,
  value: "1st place",
  ...data,
});

const initialState = reducer(undefined, { type: "@@INIT" });

/** Run several actions in order, starting from the initial state. */
const apply = (...actions: UnknownAction[]) =>
  actions.reduce<CVData>((state, action) => reducer(state, action), initialState);

const makeStore = () => configureStore({ reducer: { cv: reducer } });

// ─── setup ────────────────────────────────────────────────────────────────────

let dateSpy: ReturnType<typeof jest.spyOn>;

beforeEach(async () => {
  dateSpy = jest.spyOn(Date, "now").mockReturnValue(NOW);
  jest.mocked(genCVId).mockReturnValue(NEW_ID);
  await AsyncStorage.clear();
});

afterEach(() => {
  dateSpy.mockRestore();
});

// ─── tests ────────────────────────────────────────────────────────────────────

describe("cvSlice", () => {
  it("starts from DEFAULT_CV", () => {
    expect(initialState).toEqual(DEFAULT_CV);
  });

  it("does not mutate the previous state", () => {
    const before = initialState;
    reducer(before, addSkill("React"));
    expect(before.skills).toEqual([]);
  });

  describe("resetToNewCV", () => {
    it("replaces everything with a blank CV, new id and timestamp", () => {
      const state = apply(
        updatePersonal({ name: "Nisharga Kabir" }),
        updateSummary("Old summary"),
        addSkill("React"),
        resetToNewCV(),
      );

      expect(state).toEqual({ ...DEFAULT_CV, id: NEW_ID, updatedAt: NOW });
    });
  });

  describe("setTemplate / setAccent", () => {
    it("sets the template and updates the timestamp", () => {
      const template = "modern" as TemplateId; // use a real non-default TemplateId
      const state = apply(setTemplate(template));

      expect(state.template).toBe(template);
      expect(state.updatedAt).toBe(NOW);
    });

    it("sets the accent color", () => {
      const state = apply(setAccent("#2563EB"));

      expect(state.accent).toBe("#2563EB");
      expect(state.updatedAt).toBe(NOW);
    });
  });

  describe("updatePersonal", () => {
    it("merges the given fields and keeps the others", () => {
      const state = apply(
        updatePersonal({ name: "Nisharga Kabir", email: "nisharga@example.com" }),
        updatePersonal({ location: "Dhaka" }),
      );

      expect(state.personal).toEqual({
        ...DEFAULT_CV.personal,
        name: "Nisharga Kabir",
        email: "nisharga@example.com",
        location: "Dhaka",
      });
      expect(state.updatedAt).toBe(NOW);
    });
  });

  describe("updateSummary", () => {
    it("replaces the summary", () => {
      const state = apply(updateSummary("I build mobile apps."));

      expect(state.summary).toBe("I build mobile apps.");
      expect(state.updatedAt).toBe(NOW);
    });
  });

  describe("experience", () => {
    it("adds a job with a timestamp id", () => {
      const state = apply(addExperience(newJob()));

      expect(state.experience).toEqual([{ ...newJob(), id: String(NOW) }]);
      expect(state.updatedAt).toBe(NOW);
    });

    it("updates the job with the matching id", () => {
      const withJob = apply(addExperience(newJob()));
      const added = withJob.experience[0]!;
      const edited = { ...added, ...newJob({ company: "Acme Ltd" }) };

      const state = reducer(withJob, updateExperience(edited));

      expect(state.experience).toEqual([edited]);
    });

    it("ignores an update for an unknown id", () => {
      const withJob = apply(addExperience(newJob()));
      const added = withJob.experience[0]!;

      const state = reducer(withJob, updateExperience({ ...added, id: "missing" }));

      expect(state.experience).toEqual(withJob.experience);
    });

    it("removes the job with the matching id", () => {
      const withJob = apply(addExperience(newJob()));

      const state = reducer(withJob, removeExperience(String(NOW)));

      expect(state.experience).toEqual([]);
    });

    it("keeps the list when removing an unknown id", () => {
      const withJob = apply(addExperience(newJob()));

      const state = reducer(withJob, removeExperience("missing"));

      expect(state.experience).toEqual(withJob.experience);
    });

    // KNOWN BUG: ids come from Date.now(), so two jobs added in the same
    // millisecond share an id. `it.failing` passes while the bug exists.
    // After switching ids to nanoid(), change this to a normal `it`.
    it.failing("gives unique ids to jobs added at the same moment", () => {
      const state = apply(addExperience(newJob()), addExperience(newJob()));
      const ids = state.experience.map((e) => e.id);

      expect(new Set(ids).size).toBe(ids.length);
    });
  });

  describe("education", () => {
    it("adds an education entry with a timestamp id", () => {
      const state = apply(addEducation(newEducation()));

      expect(state.education).toEqual([{ ...newEducation(), id: String(NOW) }]);
    });

    it("updates the entry with the matching id", () => {
      const withEdu = apply(addEducation(newEducation()));
      const added = withEdu.education[0]!;
      const edited = { ...added, ...newEducation({ degree: "MSc in CSE" }) };

      const state = reducer(withEdu, updateEducation(edited));

      expect(state.education).toEqual([edited]);
    });

    it("removes the entry with the matching id", () => {
      const withEdu = apply(addEducation(newEducation()));

      const state = reducer(withEdu, removeEducation(String(NOW)));

      expect(state.education).toEqual([]);
    });
  });

  describe("skills", () => {
    it("adds a single skill", () => {
      expect(apply(addSkill("React")).skills).toEqual(["React"]);
    });

    it("splits comma-separated input and trims spaces", () => {
      const state = apply(addSkill("React,  TypeScript , Node.js"));

      expect(state.skills).toEqual(["React", "TypeScript", "Node.js"]);
    });

    it("ignores empty items", () => {
      expect(apply(addSkill(" , ,React,")).skills).toEqual(["React"]);
    });

    it("skips skills that already exist, ignoring case", () => {
      const state = apply(addSkill("React"), addSkill("react, REACT"));

      expect(state.skills).toEqual(["React"]);
    });

    it("skips duplicates inside the same input", () => {
      expect(apply(addSkill("Go, go")).skills).toEqual(["Go"]);
    });

    it("removes a skill", () => {
      const state = apply(addSkill("React, TypeScript"), removeSkill("React"));

      expect(state.skills).toEqual(["TypeScript"]);
    });
  });

  describe("achievements", () => {
    const defaultId = DEFAULT_CV.achievements[0]!.id;

    it("adds an achievement with a timestamp id", () => {
      const state = apply(addAchievement(newAchievement()));

      expect(state.achievements).toHaveLength(DEFAULT_CV.achievements.length + 1);
      expect(state.achievements.at(-1)).toEqual({ ...newAchievement(), id: String(NOW) });
    });

    it("toggles enabled on and off", () => {
      const on = apply(toggleAchievement(defaultId));
      const off = reducer(on, toggleAchievement(defaultId));

      expect(on.achievements[0]?.enabled).toBe(true);
      expect(on.updatedAt).toBe(NOW);
      expect(off.achievements[0]?.enabled).toBe(false);
    });

    it("changes nothing when toggling an unknown id", () => {
      expect(apply(toggleAchievement("missing"))).toEqual(initialState);
    });

    it("updates the value of an achievement", () => {
      const state = apply(updateAchievementValue({ id: defaultId, value: "Best Developer 2025" }));

      expect(state.achievements[0]?.value).toBe("Best Developer 2025");
      expect(state.updatedAt).toBe(NOW);
    });

    it("changes nothing when updating the value of an unknown id", () => {
      expect(apply(updateAchievementValue({ id: "missing", value: "x" }))).toEqual(initialState);
    });

    it("removes an achievement", () => {
      const state = apply(removeAchievement(defaultId));

      expect(state.achievements).toEqual([]);
    });
  });

  describe("loadCV thunk", () => {
    it("keeps the current state when nothing is saved", async () => {
      const store = makeStore();

      await store.dispatch(loadCV());

      expect(store.getState().cv).toEqual(DEFAULT_CV);
    });

    it("restores a saved CV", async () => {
      const saved: CVData = {
        ...DEFAULT_CV,
        id: "cv_saved",
        updatedAt: 123,
        summary: "Saved summary",
        skills: ["React"],
      };
      await AsyncStorage.setItem(LEGACY_KEY, JSON.stringify(saved));
      const store = makeStore();

      await store.dispatch(loadCV());

      expect(store.getState().cv).toEqual(saved);
    });

    it("fills missing fields from defaults for old saved data", async () => {
      const oldData = { summary: "Old summary", personal: { name: "Nisharga Kabir" } };
      await AsyncStorage.setItem(LEGACY_KEY, JSON.stringify(oldData));
      const store = makeStore();

      await store.dispatch(loadCV());
      const cv = store.getState().cv;

      expect(cv.id).toBe(NEW_ID);
      expect(cv.updatedAt).toBe(NOW);
      expect(cv.summary).toBe("Old summary");
      expect(cv.personal).toEqual({ ...DEFAULT_CV.personal, name: "Nisharga Kabir" });
      expect(cv.achievements).toEqual(DEFAULT_CV.achievements);
      expect(cv.experience).toEqual([]);
    });

    it("rejects and keeps the state when saved data is corrupted", async () => {
      await AsyncStorage.setItem(LEGACY_KEY, "{not valid json");
      const store = makeStore();

      const result = await store.dispatch(loadCV());

      expect(loadCV.rejected.match(result)).toBe(true);
      expect(store.getState().cv).toEqual(DEFAULT_CV);
    });
  });

  describe("loadCVById thunk", () => {
    it("loads the CV by id and fills missing fields from defaults", async () => {
      const stored = {
        id: "cv_42",
        updatedAt: 456,
        summary: "From storage",
        personal: { name: "Nisharga Kabir" },
      };
      jest.mocked(getCV).mockResolvedValue(stored as CVData);
      const store = makeStore();

      await store.dispatch(loadCVById("cv_42"));
      const cv = store.getState().cv;

      expect(getCV).toHaveBeenCalledWith("cv_42");
      expect(cv.id).toBe("cv_42");
      expect(cv.summary).toBe("From storage");
      expect(cv.personal).toEqual({ ...DEFAULT_CV.personal, name: "Nisharga Kabir" });
      expect(cv.achievements).toEqual(DEFAULT_CV.achievements);
    });

    it("keeps the current state when the CV is not found", async () => {
      jest.mocked(getCV).mockResolvedValue(null);
      const store = makeStore();

      await store.dispatch(loadCVById("missing"));

      expect(store.getState().cv).toEqual(DEFAULT_CV);
    });
  });
});
