export const SITE_NAME = "Pulsevian";
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://pulsevian.com").replace(/\/$/, "");
export const SITE_TAGLINE = "Practical AI tools and workflows for India";
export const SITE_DESCRIPTION =
  "Free AI tools, practical workflows, honest comparisons, and learning resources for Indian creators, job seekers, students, and small businesses.";
export const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "contact@pulsevian.com";

export function absoluteUrl(path = "/") {
  return new URL(path, `${SITE_URL}/`).toString();
}
