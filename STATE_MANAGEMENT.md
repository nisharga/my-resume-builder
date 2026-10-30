# State Management — Resume Builder

This document explains how Redux state works in this app: what data is stored, how it moves, and how each screen connects to it.

---

## Redux Store Structure

The store has three slices:

```
RootState
├── api        → RTK Query network cache
├── auth       → login tokens + user profile
└── cv         → the active resume being edited
```

Day-to-day resume work only touches the `cv` slice. `auth` and `api` handle login flows.

---

## The `cv` Slice — Shape of a Resume

Defined in `src/redux/features/cvSlice.ts`.

```ts
CVData {
  id          string          unique ID (e.g. "mvjd7diszxeeb")
  updatedAt   number          Unix timestamp — updated on every change
  template    "classic" | "sidebar" | "minimal"
  accent      string          hex color (e.g. "#2B5F75")

  personal {
    name        string
    title       string        job title / headline
    email       string
    phone       string
    location    string
    website     string
    portfolio   string
    linkedin    string
  }

  summary       string        free-text bio / intro

  experience  Experience[]
    id          string
    role        string
    company     string
    start       string
    end         string
    desc        string        one bullet point per line

  education   Education[]
    id          string
    degree      string
    school      string
    start       string
    end         string

  skills      string[]        plain strings, deduplicated case-insensitively

  achievements Achievement[]
    id          string
    name        string        field label (e.g. "Achievement & Reward")
    enabled     boolean       shown on CV only when true
    value       string        the user-entered content
}
```

### Default / blank CV

When a new CV is created, the state starts here:

```ts
{
  id: genCVId(),
  updatedAt: Date.now(),
  template: "sidebar",
  accent: "#2B5F75",       // Ocean
  personal: { name: "", title: "", email: "", ... },
  summary: "",
  experience: [],
  education: [],
  skills: [],
  achievements: [
    { id: "default_ach_1", name: "Achievement & Reward", enabled: false, value: "" }
  ],
}
```

---

## All Available Actions

### Lifecycle

| Action                     | What it does                                            |
| -------------------------- | ------------------------------------------------------- |
| `resetToNewCV()`           | Replace active CV with a blank one (new ID + timestamp) |
| `loadCV()` _(async)_       | Hydrate from AsyncStorage on app launch                 |
| `loadCVById(id)` _(async)_ | Load a specific saved CV by ID into active state        |

### Template & Style

| Action            | Payload                               | What it does            |
| ----------------- | ------------------------------------- | ----------------------- |
| `setTemplate(id)` | `"classic" \| "sidebar" \| "minimal"` | Change the CV layout    |
| `setAccent(hex)`  | `"#2B5F75"` etc.                      | Change the accent color |

### Personal Info

| Action                    | Payload                 | What it does                                    |
| ------------------------- | ----------------------- | ----------------------------------------------- |
| `updatePersonal(partial)` | `Partial<PersonalInfo>` | Merge any personal fields (name, email, phone…) |

### Summary

| Action                | Payload  | What it does             |
| --------------------- | -------- | ------------------------ |
| `updateSummary(text)` | `string` | Replace the summary text |

### Experience

| Action                    | Payload                  | What it does                           |
| ------------------------- | ------------------------ | -------------------------------------- |
| `addExperience(entry)`    | `Omit<Experience, "id">` | Append a job entry (ID auto-generated) |
| `updateExperience(entry)` | `Experience`             | Replace a job entry by ID              |
| `removeExperience(id)`    | `string`                 | Delete a job entry                     |

### Education

| Action                   | Payload                 | What it does                     |
| ------------------------ | ----------------------- | -------------------------------- |
| `addEducation(entry)`    | `Omit<Education, "id">` | Append an education entry        |
| `updateEducation(entry)` | `Education`             | Replace an education entry by ID |
| `removeEducation(id)`    | `string`                | Delete an education entry        |

### Skills

| Action               | Payload  | What it does                                                  |
| -------------------- | -------- | ------------------------------------------------------------- |
| `addSkill(text)`     | `string` | Add one or more skills (comma-separated). Duplicates ignored. |
| `removeSkill(skill)` | `string` | Remove a skill by value                                       |

### Additional Fields (Achievements)

| Action                                  | Payload                    | What it does                     |
| --------------------------------------- | -------------------------- | -------------------------------- |
| `addAchievement(entry)`                 | `{ name, enabled, value }` | Add a new custom field           |
| `toggleAchievement(id)`                 | `string`                   | Flip enabled/disabled on a field |
| `updateAchievementValue({ id, value })` | `{ id, value }`            | Set the text content of a field  |
| `removeAchievement(id)`                 | `string`                   | Delete a custom field            |

Every single action above also bumps `updatedAt` to the current timestamp.

---

## Auto-Save Middleware

Defined in `src/redux/store.ts`.

```
User action → reducer updates cv state → middleware fires
                                              ↓
                               AsyncStorage.setItem("@cv_data_v1", ...)   ← legacy key
                               saveCV(state.cv)                           ← multi-CV store
```

The middleware watches for any action whose type starts with `"cv/"` and saves the entire `cv` state to AsyncStorage automatically. You never call save manually — it happens on every change.

---

## Storage Layer

Defined in `src/utils/cvStorage.ts`.

Two separate storage structures run in parallel:

```
AsyncStorage
├── @cv_data_v1              ← legacy: always stores the last active CV as a single blob
├── @cv_list_v1              ← index: array of CVListItem (id, name, template, accent, updatedAt)
├── @cv_<id1>                ← full CVData for CV #1
├── @cv_<id2>                ← full CVData for CV #2
└── ...
```

`CVListItem` is a lightweight preview (no experience/education/skills arrays) used for listing cards without loading the full data.

### Storage functions

| Function       | What it does                                                       |
| -------------- | ------------------------------------------------------------------ |
| `saveCV(cv)`   | Upsert — writes full data to `@cv_<id>` and updates the list index |
| `getCV(id)`    | Load full CVData by ID                                             |
| `getAllCVs()`  | Return all `CVListItem` previews from the index                    |
| `deleteCV(id)` | Remove from `@cv_<id>` and from the list index                     |
| `genCVId()`    | Generate a unique ID (`Date.now().toString(36) + random`)          |

---

## How a Full "Create Resume" Flow Works

```
1. User taps "Create CV"
      ↓
   dispatch(resetToNewCV())         → fresh blank CVData in Redux store
   router.push("/(tabs)/create-resume")

2. CreateResumeScreen mounts
      ↓
   dispatch(loadCV())               → hydrate from AsyncStorage (fills in saved data if any)
   useAppSelector(s => s.cv)        → subscribe to live cv state

3. User picks a template
      ↓
   dispatch(setTemplate("classic")) → cv.template updated
   middleware auto-saves to AsyncStorage

4. User picks a color
      ↓
   dispatch(setAccent("#6B3FA0"))   → cv.accent updated ("Violet")
   middleware auto-saves

5. User taps "Personal details"
      ↓
   router.push("/cv-section/personal")
   User fills in name, email, etc.
   dispatch(updatePersonal({ name: "John", email: "j@example.com" }))
   middleware auto-saves

6. Repeat for Experience, Education, Skills, Summary sections
   Each dispatches the relevant add/update actions
   Each auto-saves via middleware

7. User taps "Preview CV"
      ↓
   router.push("/cv-preview")       → renders current cv state as a PDF-style page

8. User returns to Home tab
      ↓
   useFocusEffect → getAllCVs()     → reads the @cv_list_v1 index
   Shows up to 5 most recent CVs sorted by updatedAt
```

---

## Template & Color Options

Defined in `src/features/cv/constants.ts`.

### Templates

| ID        | Name    |
| --------- | ------- |
| `classic` | Classic |
| `sidebar` | Sidebar |
| `minimal` | Minimal |

### Accent Colors

| Name   | Hex       |
| ------ | --------- |
| Ocean  | `#2B5F75` |
| Navy   | `#2F4B8A` |
| Violet | `#6B3FA0` |
| Forest | `#1F7A55` |
| Rust   | `#9A3B26` |
| Slate  | `#333A45` |

---

## Section Completion Logic

Defined in `src/utils/cv.ts` — `getSectionCompletion()`.

| Section    | Counts as complete when…          |
| ---------- | --------------------------------- |
| Personal   | `name` and `email` are non-empty  |
| Summary    | text is longer than 20 characters |
| Experience | at least 1 entry exists           |
| Education  | at least 1 entry exists           |
| Skills     | at least 3 skills added           |

Summary is **optional** — the progress bar counts only the other 4 sections.  
Progress percentage = `20% base + (completedSections / 4) × 80%`.

---

## How the Home Screen Works

`src/features/tabs/home/index.tsx`

- On focus (`useFocusEffect`): reads `getAllCVs()` from storage, sorts by `updatedAt` descending, shows top 5.
- **Edit**: `dispatch(loadCVById(id))` → loads that CV into Redux state → navigate to create-resume.
- **View**: same load → navigate to cv-preview.
- **Duplicate**: `getCV(id)` → clone with new `genCVId()` → `saveCV(copy)` → refresh list.
- **Delete**: `deleteCV(id)` → refresh list → toast.

The Home screen reads directly from AsyncStorage (not Redux state) for the list, so it always reflects what's persisted.

---

## File Map

```
src/
├── redux/
│   ├── store.ts                    Store config + cvPersistMiddleware
│   └── features/
│       ├── cvSlice.ts              All CV actions, thunks, DEFAULT_CV
│       └── authSlice.ts            Login tokens
├── types/
│   └── cv.ts                       CVData, PersonalInfo, Experience, Education, Achievement, CVListItem
├── utils/
│   ├── cvStorage.ts                AsyncStorage CRUD + genCVId + formatUpdatedAt
│   └── cv.ts                       getSectionCompletion, formatDates, splitBullets, getLinks
└── features/
    ├── cv/
    │   └── constants.ts            ACCENT_COLORS, ACCENT_COLOR_NAMES, TEMPLATES
    └── tabs/
        ├── home/index.tsx          CV list dashboard
        ├── create-resume/index.tsx Main editor screen
        └── templates/index.tsx     Template + color + additional fields picker
```
