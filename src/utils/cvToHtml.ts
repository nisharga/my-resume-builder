import type { CVData } from "@/types/cv";
import { formatDates, getContacts, getLinks, splitBullets } from "./cv";

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function cvToHtml(cv: CVData): string {
  const { accent, personal, summary, experience, education, skills } = cv;
  const contacts = getContacts(personal);
  const links = getLinks(personal);

  const contactHtml = [...contacts, ...links.map((l) => l.label)]
    .map((c) => `<span class="contact">${esc(c)}</span>`)
    .join('<span class="dot"> · </span>');

  const expHtml = experience
    .map((exp) => {
      const bullets = splitBullets(exp.desc)
        .map((b) => `<li>${esc(b)}</li>`)
        .join("");
      return `
        <div class="entry">
          <div class="entry-header">
            <span class="entry-role" style="color:${accent}">${esc(exp.role)}</span>
            <span class="entry-dates">${esc(formatDates(exp.start, exp.end))}</span>
          </div>
          <div class="entry-company">${esc(exp.company)}</div>
          ${bullets ? `<ul>${bullets}</ul>` : ""}
        </div>`;
    })
    .join("");

  const eduHtml = education
    .map(
      (edu) => `
        <div class="entry">
          <div class="entry-header">
            <span class="entry-role" style="color:${accent}">${esc(edu.degree)}</span>
            <span class="entry-dates">${esc(formatDates(edu.start, edu.end))}</span>
          </div>
          <div class="entry-company">${esc(edu.school)}</div>
        </div>`,
    )
    .join("");

  const skillsHtml = skills.map((s) => `<span class="skill">${esc(s)}</span>`).join(" · ");

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"/>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: Georgia, serif; font-size: 13px; color: #1E232B; padding: 48px 64px; }
  h1 { font-size: 28px; font-weight: 700; margin-bottom: 4px; }
  .job-title { font-size: 15px; color: ${accent}; margin-bottom: 10px; font-weight: 600; }
  .contacts { margin-bottom: 18px; color: #4A5260; font-size: 12px; }
  .contact {}
  .dot { color: #9AA3AF; }
  .section { margin-top: 20px; }
  .section-title {
    font-size: 14px; font-weight: 700; color: ${accent};
    border-bottom: 1.5px solid ${accent}; padding-bottom: 4px; margin-bottom: 10px;
  }
  .entry { margin-bottom: 12px; }
  .entry-header { display: flex; justify-content: space-between; }
  .entry-role { font-weight: 700; font-size: 13px; }
  .entry-dates { font-size: 12px; color: #5A6270; }
  .entry-company { font-size: 12.5px; color: #4A5260; font-style: italic; margin: 2px 0 4px; }
  ul { padding-left: 16px; }
  li { font-size: 12.5px; margin-bottom: 2px; line-height: 1.5; }
  .summary-text { font-size: 12.5px; line-height: 1.6; color: #1E232B; }
  .skill { font-size: 12.5px; color: #1E232B; }
</style>
</head>
<body>
  <h1>${esc(personal.name || "Your Name")}</h1>
  ${personal.title ? `<div class="job-title">${esc(personal.title)}</div>` : ""}
  ${contactHtml ? `<div class="contacts">${contactHtml}</div>` : ""}

  ${
    summary
      ? `<div class="section">
    <div class="section-title">Profile</div>
    <div class="summary-text">${esc(summary)}</div>
  </div>`
      : ""
  }

  ${
    experience.length > 0
      ? `<div class="section">
    <div class="section-title">Experience</div>
    ${expHtml}
  </div>`
      : ""
  }

  ${
    education.length > 0
      ? `<div class="section">
    <div class="section-title">Education</div>
    ${eduHtml}
  </div>`
      : ""
  }

  ${
    skills.length > 0
      ? `<div class="section">
    <div class="section-title">Skills</div>
    <div>${skillsHtml}</div>
  </div>`
      : ""
  }
</body>
</html>`;
}
