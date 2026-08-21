import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

/**
 * Abstractizare pentru stocarea imaginilor.
 *
 * — Local (implicit, dezvoltare / server Node clasic): scrie în /public/uploads
 *   și returnează o cale relativă (`/uploads/...`). Funcționează din prima,
 *   fără cont extern.
 * — Supabase Storage (recomandat în producție, mai ales pe Vercel unde
 *   filesystem-ul e efemer): activată automat dacă în `.env` există
 *   SUPABASE_URL și SUPABASE_SERVICE_ROLE_KEY. Vezi README pentru pași.
 */

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];
const MAX_SIZE = 8 * 1024 * 1024; // 8MB

export type UploadFolder = "equipment" | "brand-logos" | "branding";

function safeExtension(filename: string) {
  const ext = path.extname(filename).toLowerCase();
  return [".jpg", ".jpeg", ".png", ".webp", ".avif"].includes(ext) ? ext : ".jpg";
}

async function uploadToSupabase(file: File, folder: UploadFolder, filename: string) {
  const { createClient } = await import("@supabase/supabase-js");
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  const bucket = process.env.SUPABASE_STORAGE_BUCKET || "public-assets";
  const objectPath = `${folder}/${filename}`;

  const { error } = await supabase.storage
    .from(bucket)
    .upload(objectPath, file, { contentType: file.type, upsert: false });

  if (error) throw new Error(`Supabase upload failed: ${error.message}`);

  const { data } = supabase.storage.from(bucket).getPublicUrl(objectPath);
  return data.publicUrl;
}

async function uploadToLocalFs(file: File, folder: UploadFolder, filename: string) {
  const dir = path.join(process.cwd(), "public", "uploads", folder);
  await mkdir(dir, { recursive: true });
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(dir, filename), buffer);
  return `/uploads/${folder}/${filename}`;
}

export async function uploadImage(file: File, folder: UploadFolder): Promise<string> {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error("Format neacceptat. Folosește JPG, PNG, WEBP sau AVIF.");
  }
  if (file.size > MAX_SIZE) {
    throw new Error("Fișierul depășește 8MB.");
  }

  const filename = `${randomUUID()}${safeExtension(file.name)}`;

  const useSupabase = Boolean(
    process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  return useSupabase
    ? uploadToSupabase(file, folder, filename)
    : uploadToLocalFs(file, folder, filename);
}
