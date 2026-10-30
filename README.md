# INSTALL — Setup & Dependency Management

This file covers three things:

1. **[Part 1 — Clone & configure as a new app](#part-1--clone--configure-as-a-new-app)** — how to use this project as a starting point for a brand-new app
2. **[Part 2 — Releasing builds and OTA updates](#part-2--releasing-builds-and-ota-updates)** — how `versions.json` works and when to bump it
3. **[Part 3 — Keeping dependencies up to date](#part-3--keeping-dependencies-up-to-date)** — how to update packages after the SDK or individual libraries release new versions

---

## Part 1 — Clone & configure as a new app

### Step 1 — Clone the repository

```bash
git clone https://github.com/your-username/your-repo.git my-new-app
cd my-new-app
```

```bash
.env
.env.local (You can pull it)
.expo-env-d.ts (Auto create)
```

---

### Step 2 — Update `package.json`

Change the `name` field to match your new app.

```json
{
  "name": "my-new-app"
}
```

---

### Step 3 — Update `app.json`

This file holds the core Expo identity. Replace every value that refers to the original app.

| Field                                             | Where               | What to change                 |
| ------------------------------------------------- | ------------------- | ------------------------------ |
| `expo.name`                                       | display name        | Your app's display name        |
| `expo.slug`                                       | URL-safe identifier | Unique slug for your app       |
| `expo.scheme`                                     | deep-link scheme    | Lowercase, no spaces           |
| `expo.ios.bundleIdentifier`                       | iOS bundle ID       | e.g. `com.yourcompany.yourapp` |
| `expo.android.package`                            | Android package     | e.g. `com.yourcompany.yourapp` |
| `expo.owner`                                      | EAS account         | Your Expo account username     |
| `expo.extra.eas.projectId`                        | EAS project ID      | See step 4                     |
| `expo.updates.url`                                | OTA URL             | See step 4                     |
| `plugins[@sentry/react-native/expo].organization` | Sentry org          | Your Sentry org slug           |
| `plugins[@sentry/react-native/expo].project`      | Sentry project      | Your Sentry project name       |

Example after editing:

```json
{
  "expo": {
    "name": "My New App",
    "slug": "my-new-app",
    "scheme": "mynewapp",
    "ios": {
      "bundleIdentifier": "com.yourcompany.mynewapp"
    },
    "android": {
      "package": "com.yourcompany.mynewapp"
    },
    "owner": "your-expo-username",
    "extra": {
      "eas": {
        "projectId": "YOUR-NEW-EAS-PROJECT-ID"
      }
    },
    "updates": {
      "url": "https://u.expo.dev/YOUR-NEW-EAS-PROJECT-ID"
    }
  }
}
```

---

### Step 4 — Create a new EAS project and get the project ID

```bash
# Log in to your Expo account
eas login

# Create the project (run from the repo root)
eas init
```

`eas init` creates a new project on expo.dev and writes the correct `projectId` into `app.json` automatically. Copy that ID and update the `expo.updates.url` field in `app.json` as well:

```
https://u.expo.dev/<YOUR-NEW-EAS-PROJECT-ID>
```

---

### Step 5 — Reset version counters in `versions.json`

```json
{
  "preview": {
    "major": 1,
    "ota": 1
  },
  "production": {
    "major": 1,
    "ota": 1
  }
}
```

---

### Step 6 — Replace app assets

Swap out these files in the `assets/` directory with your own:

| File                       | Purpose                                         |
| -------------------------- | ----------------------------------------------- |
| `assets/icon.png`          | App icon (1024×1024 px)                         |
| `assets/splash-icon.png`   | Splash screen icon                              |
| `assets/adaptive-icon.png` | Android adaptive icon foreground                |
| `assets/favicon.png`       | Web favicon / notification icon                 |
| `assets/logo.svg`          | In-app logo                                     |
| `assets/sounds/`           | Notification sounds (optional)                  |
| `assets/fonts/`            | Custom fonts (or remove the `expo-font` plugin) |

---

### Step 7 — Configure Sentry (optional)

If you are keeping Sentry error tracking, create a new project at [sentry.io](https://sentry.io), then:

1. Update the plugin config in `app.json` (organization + project — already covered in step 3).
2. Set your auth token as an EAS secret:

```bash
eas secret:create --scope project --name SENTRY_AUTH_TOKEN --value YOUR_TOKEN
```

If you are not using Sentry, remove the `@sentry/react-native/expo` plugin block from `app.json` and uninstall the package:

```bash
npm uninstall @sentry/react-native
```

---

### Step 8 — Install dependencies and verify

```bash
npm install

npm run typecheck
npm run lint
npm test
```

---

### Step 9 — Run the app

```bash
npx expo start
```

---

### Quick-reference checklist

```
[ ] package.json  — name
[ ] app.json      — name, slug, scheme
[ ] app.json      — ios.bundleIdentifier
[ ] app.json      — android.package
[ ] app.json      — owner
[ ] app.json      — extra.eas.projectId  (from `eas init`)
[ ] app.json      — updates.url          (same project ID)
[ ] app.json      — sentry organization + project (or removed)
[ ] versions.json — reset to 1 / 1
[ ] assets/       — icon, splash, adaptive-icon, favicon, logo
[ ] EAS secrets   — SENTRY_AUTH_TOKEN (if using Sentry)
```

---

## Part 2 — Releasing builds and OTA updates

### How `versions.json` works

`app.config.ts` reads `versions.json` and uses it to set two Expo fields:

| `versions.json` field | Expo field                      | Controls                                             |
| --------------------- | ------------------------------- | ---------------------------------------------------- |
| `major`               | `version` (e.g. `2.0.0`)        | The version shown in the App Store / Play Store      |
| `ota`                 | `runtimeVersion` (e.g. `3.0.0`) | Which native builds an OTA update is compatible with |

`runtimeVersion` is the critical one. Expo only delivers an OTA update to devices whose native build has the **same** `runtimeVersion`. If you bump `ota`, devices on the old native build will no longer receive your OTA updates until they install the new build.

---

### The two release scripts

Always use the npm scripts instead of running `eas` directly — the scripts bump `versions.json`, commit it, and then run the EAS command in one step.

```bash
# New native build (bumps major, commits, runs eas build)
npm run build:preview
npm run build:prod

# OTA update (bumps ota, commits, runs eas update)
npm run ota:preview
npm run ota:prod
```

---

### When to bump `ota` vs when NOT to

**Do NOT bump `ota` (regular OTA — most common case)**

A regular bug fix or JS-only change that is fully compatible with the existing native build. The current `runtimeVersion` stays the same so existing installs receive the update automatically.

```bash
# Wrong — bypasses the script, versions.json never updates
APP_VARIANT=preview eas update --channel preview --environment preview --message "Fix resume preview text"

# Correct — script bumps ota, commits, then runs eas update
npm run ota:preview
```

If you want to pass a custom message, edit `scripts/release.js` line 34 temporarily, or just use the script as-is (it auto-generates the message from the `ota` version).

**Do bump `ota` (new native build required)**

You changed something that requires a new native build: added a new native module, changed a native config in `app.json`, updated `react-native` or `react-native-reanimated` to a new major. In this case run `npm run build:preview` which bumps `major`. The `ota` counter resets conceptually because the new build starts receiving its own OTA chain.

> Rule of thumb: if `npx expo install --fix` changed any package that has native code, you need a new build — use `npm run build:*`. For pure JS changes, use `npm run ota:*`.

---

### Decision chart

```
Made a change →
  ├── Changed native code / config / native package version?
  │     └── YES → npm run build:preview / build:prod
  └── Pure JS / TS change only?
        └── YES → npm run ota:preview / ota:prod
```

---

### What to do if you already ran `eas update` directly

If you already sent an OTA without using the script (like running `eas update` manually), `versions.json` is now out of sync. Fix it by bumping `ota` manually and committing:

```bash
# 1. Edit versions.json — increment ota for the relevant profile by 1
# 2. Commit it
git add versions.json
git commit -m "chore: sync preview OTA counter after manual eas update"
```

This keeps the file accurate for next time so the script doesn't re-use a version number.

---

## Part 3 — Keeping dependencies up to date

### The core rule: Expo drives everything

This is an **Expo-managed** project. The Expo SDK version is the single source of truth. Every other package — React Native, React, all `expo-*` packages, `jest-expo`, `react-native-reanimated`, `nativewind`, etc. — must be compatible with the Expo SDK version you are on.

**Never upgrade individual packages blindly.** Always start with `npx expo install`, which resolves the correct peer-compatible versions for you.

---

### Scenario A — Minor patch updates (within the same Expo SDK)

You are on Expo 57 and `expo-notifications` has released patch updates (e.g. `57.0.24` → `57.0.31`). You want those fixes without changing the SDK major.

```bash
npx expo install --fix
npm install
```

`--fix` re-resolves all `expo-*` packages to their current compatible patch versions and updates `package.json`. It will not bump the Expo SDK itself.

Verify nothing broke:

```bash
npm run typecheck
npm test
```

---

### Scenario B — A new Expo SDK is released (e.g. SDK 57 → SDK 58)

Expo releases a new SDK roughly every quarter.

**Step 1 — Read the migration guide first**

Check the release notes at `https://expo.dev/changelog` for breaking changes in packages you use (Router, Notifications, Reanimated, NativeWind, etc.).

**Step 2 — Upgrade the SDK**

```bash
npx expo install expo@^58
```

**Step 3 — Fix all peer packages**

```bash
npx expo install --fix
npm install
```

**Step 4 — Upgrade non-Expo packages manually**

Some packages are not managed by Expo (`@reduxjs/toolkit`, `react-hook-form`, `zod`, `docx`). Update them separately, staying within minors (safe):

```bash
npx npm-check-updates -u --target minor --filter "@reduxjs/toolkit,react-hook-form,zod,docx,lucide-react-native"
npm install
```

**Step 5 — Verify**

```bash
npm run typecheck
npm run lint
npm test
```

---

### Scenario C — See everything that is outdated right now

```bash
# Expo-managed packages — shows mismatches against the current SDK
npx expo install --check

# All packages — shows all available semver upgrades
npx npm-check-updates
```

Act on `expo install --check` first. Fix those before touching anything else.

---

### Scenario D — One specific package is behind (e.g. Expo expects 55 but you have 54)

```bash
npx expo install <package-name>
```

Example:

```bash
npx expo install expo-notifications
```

Never use `npm install <expo-package>@latest` — you will pull a version ahead of what the SDK supports, causing runtime crashes.

---

### Package categories at a glance

| Category                          | How to update                                                               |
| --------------------------------- | --------------------------------------------------------------------------- |
| `expo` SDK itself                 | `npx expo install expo@^<new-version>`                                      |
| All `expo-*` packages             | `npx expo install --fix`                                                    |
| `react-native`                    | Updated automatically by `expo install --fix`                               |
| `react-native-reanimated`         | `npx expo install react-native-reanimated`                                  |
| `nativewind`                      | Check NativeWind changelog; only install when SDK-compatible                |
| `jest-expo`                       | Match major to Expo SDK: `npx expo install jest-expo`                       |
| `@reduxjs/toolkit`, `react-redux` | `npx npm-check-updates -u --target minor -f "@reduxjs/toolkit,react-redux"` |
| `react-hook-form`, `zod`          | `npx npm-check-updates -u --target minor`                                   |
| TypeScript types (`@types/*`)     | `npx npm-check-updates -u --target minor -f "@types/*"`                     |

---

### After any upgrade — full validation

```bash
npm install
npm run typecheck
npm run lint
npm run format:check
npm test
```

All four must pass before committing.

---

### Useful references

- Expo SDK changelog: `https://expo.dev/changelog`
- Expo upgrade guide: `https://docs.expo.dev/workflow/upgrading-expo-sdk/`
- React Native upgrade helper: `https://react-native-community.github.io/upgrade-helper/`
- NativeWind changelog: `https://www.nativewind.dev/changelog`
