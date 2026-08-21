import "dotenv/config";
import { db } from "./index";
import { categories, brands, users, settings } from "./schema";
import bcrypt from "bcryptjs";

async function main() {
  console.log("→ Seed: setări companie (PVC CONSTRUCT SRL)...");
  await db
    .insert(settings)
    .values({
      id: 1,
      companyName: "PVC CONSTRUCT SRL",
      cui: "24213480",
      regCom: "J2008001329267",
      euid: "ROONRC.J2008001329267",
      foundedAt: "2008-07-18",
      county: "Mureș",
      city: "Sat Albești",
      address: "Str. Florilor 13, Bl. C1",
      postalCode: "547025",
      phone: "",
      email: "",
      heroHeadline: "Utilaje de construcții pentru proiectele tale.",
      heroSubheadline:
        "Vânzare și închiriere de utilaje verificate, cu disponibilitate rapidă și suport tehnic complet.",
      heroImageUrl: "/images/hero-utilaje.jpg",
    })
    .onConflictDoUpdate({
      target: settings.id,
      set: {
        companyName: "PVC CONSTRUCT SRL",
        cui: "24213480",
        regCom: "J2008001329267",
        euid: "ROONRC.J2008001329267",
        foundedAt: "2008-07-18",
        county: "Mureș",
        city: "Sat Albești",
        address: "Str. Florilor 13, Bl. C1",
        postalCode: "547025",
        heroImageUrl: "/images/hero-utilaje.jpg",
      },
    });

  console.log("→ Seed: categorii...");
  const categoryList = [
    { name: "Excavatoare", slug: "excavatoare" },
    { name: "Mini excavatoare", slug: "mini-excavatoare" },
    { name: "Încărcătoare frontale", slug: "incarcatoare-frontale" },
    { name: "Buldoexcavatoare", slug: "buldoexcavatoare" },
    { name: "Nacele", slug: "nacele" },
    { name: "Stivuitoare", slug: "stivuitoare" },
    { name: "Compactoare", slug: "compactoare" },
    { name: "Dumpere", slug: "dumpere" },
    { name: "Macarale", slug: "macarale" },
    { name: "Utilaje pentru terasamente", slug: "utilaje-terasamente" },
    { name: "Utilaje pentru demolări", slug: "utilaje-demolari" },
    { name: "Generatoare", slug: "generatoare" },
    { name: "Alte echipamente", slug: "alte-echipamente" },
  ];
  for (const [i, c] of categoryList.entries()) {
    await db
      .insert(categories)
      .values({ ...c, sortOrder: i, active: true })
      .onConflictDoNothing();
  }

  console.log("→ Seed: mărci utilaje...");
  const brandList = [
    "Caterpillar",
    "JCB",
    "Komatsu",
    "Volvo",
    "Liebherr",
    "Hitachi",
    "Case",
    "Manitou",
    "JLG",
    "Bobcat",
    "Hyundai",
    "Doosan",
    "Wacker Neuson",
    "Ammann",
  ];
  for (const name of brandList) {
    await db
      .insert(brands)
      .values({
        name,
        slug: name
          .toLowerCase()
          .normalize("NFD")
          .replace(/[̀-ͯ]/g, "")
          .replace(/[^a-z0-9]+/g, "-"),
        active: true,
      })
      .onConflictDoNothing();
  }

  console.log("→ Seed: cont admin...");
  const adminEmail = process.env.SEED_ADMIN_EMAIL || "admin@pvcconstruct.ro";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || "SchimbaParola123!";
  const passwordHash = await bcrypt.hash(adminPassword, 10);
  await db
    .insert(users)
    .values({
      name: "Administrator",
      email: adminEmail,
      passwordHash,
      role: "ADMIN",
      active: true,
    })
    .onConflictDoNothing();

  console.log("✓ Seed complet.");
  console.log(`  Admin: ${adminEmail} / parolă din SEED_ADMIN_PASSWORD (implicit: ${adminPassword})`);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
