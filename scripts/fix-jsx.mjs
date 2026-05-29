import fs from "fs";

const close = "</" + "div>";

const files = [
  "src/components/layout/SiteFooter.tsx",
  "src/components/layout/MobileNav.tsx",
  "src/app/news/[slug]/page.tsx",
  "src/components/layout/BreakingTicker.tsx",
];

for (const f of files) {
  let t = fs.readFileSync(f, "utf8");
  t = t.replace(/<\/motion\.div>/g, close);
  t = t.replace(/<motion\.div/g, "<div");
  fs.writeFileSync(f, t);
  console.log("ok", f);
}
