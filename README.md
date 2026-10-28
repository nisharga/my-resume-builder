# My Resume Builder

A mobile resume builder app built with **React Native + Expo**. Create, customize, and export professional resumes directly from your phone.

---

## Screenshots

### Welcome & Onboarding

<table>
  <tr>
    <td><img src="https://i.postimg.cc/QBqyR7Jd/Screenshot-1793193399.png" width="200"/></td>
    <td><img src="https://i.postimg.cc/SXGvw9fR/Screenshot-1793193400.png" width="200"/></td>
    <td><img src="https://i.postimg.cc/R3TDjtLq/Screenshot-1793193402.png" width="200"/></td>
    <td><img src="https://i.postimg.cc/HJthfM98/Screenshot-1793193406.png" width="200"/></td>
  </tr>
</table>

### Authentication

<table>
  <tr>
    <td><img src="https://i.postimg.cc/2qxKPW7V/Screenshot-1793193408.png" width="200"/></td>
    <td><img src="https://i.postimg.cc/DWcMtGPX/Screenshot-1793193438.png" width="200"/></td>
    <td><img src="https://i.postimg.cc/CZ4QW8sb/Screenshot-1793193442.png" width="200"/></td>
  </tr>
</table>

### Home & Dashboard

<table>
  <tr>
    <td><img src="https://i.postimg.cc/34Jc7wtR/Screenshot-1793193473.png" width="200"/></td>
    <td><img src="https://i.postimg.cc/VrLV1NKd/Screenshot-1793193480.png" width="200"/></td>
    <td><img src="https://i.postimg.cc/zbXc5fxL/Screenshot-1793193488.png" width="200"/></td>
    <td><img src="https://i.postimg.cc/ZBKMZqww/Screenshot-1793193492.png" width="200"/></td>
  </tr>
</table>

### Resume Builder

<table>
  <tr>
    <td><img src="https://i.postimg.cc/wyTGHBwD/Screenshot-1793202364.png" width="200"/></td>
    <td><img src="https://i.postimg.cc/xJT4Yd6g/Screenshot-1793202381.png" width="200"/></td>
    <td><img src="https://i.postimg.cc/WFbHj45X/Screenshot-1793202388.png" width="200"/></td>
    <td><img src="https://i.postimg.cc/FdsBmKTn/Screenshot-1793202391.png" width="200"/></td>
  </tr>
  <tr>
    <td><img src="https://i.postimg.cc/phX6xdsS/Screenshot-1793202398.png" width="200"/></td>
    <td><img src="https://i.postimg.cc/k6Xp95TZ/Screenshot-1793202408.png" width="200"/></td>
    <td><img src="https://i.postimg.cc/ZB7DqhQL/Screenshot-1793202414.png" width="200"/></td>
    <td><img src="https://i.postimg.cc/wyfbBdrV/Screenshot-1793202417.png" width="200"/></td>
  </tr>
</table>

### Upload & Import

<table>
  <tr>
    <td><img src="https://i.postimg.cc/CBP6KV2v/Screenshot-1793202425.png" width="200"/></td>
    <td><img src="https://i.postimg.cc/2bcX5ftc/Screenshot-1793202430.png" width="200"/></td>
    <td><img src="https://i.postimg.cc/7GsQLyRQ/Screenshot-1793202438.png" width="200"/></td>
  </tr>
</table>

### Export & Share

<table>
  <tr>
    <td><img src="https://i.postimg.cc/Pp3Fqk7V/Screenshot-1793202444.png" width="200"/></td>
    <td><img src="https://i.postimg.cc/BLYwvGzd/Screenshot-1793202457.png" width="200"/></td>
  </tr>
</table>

---

## Features

- Onboarding flow for new users
- Email/password authentication
- Build resumes from scratch with structured forms
- Upload and import existing resumes
- Multiple CV templates
- Export to PDF or DOCX
- Push notifications

---

## Tech Stack

| Layer          | Technology                           |
| -------------- | ------------------------------------ |
| Framework      | Expo (React Native)                  |
| Routing        | Expo Router (file-based)             |
| State          | Redux Toolkit                        |
| Forms          | React Hook Form                      |
| Animations     | Legend Motion                        |
| Notifications  | Expo Notifications                   |
| Export         | `docx`, `expo-print`, `expo-sharing` |
| Error tracking | Sentry                               |

---

## Getting Started

### Prerequisites

- Node.js 18+
- Expo CLI
- iOS Simulator or Android Emulator (or Expo Go)

### Install

```bash
npm install
```

### Run

```bash
npx expo start
```

Open in:

- iOS Simulator — press `i`
- Android Emulator — press `a`
- Expo Go — scan the QR code

### Reset to blank project

```bash
npm run reset-project
```

---

## Project Structure

```
src/
├── app/              # Expo Router screens
├── components/       # Shared UI components
├── features/         # Feature modules (auth, cv, onboarding, etc.)
├── hooks/            # Custom React hooks
├── redux/            # Redux store and slices
├── services/         # API and external services
├── styles/           # Global styles and themes
├── types/            # TypeScript type definitions
└── utils/            # Utility functions
```

---

## License

MIT
