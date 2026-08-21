import { cookies } from "next/headers";
import { defaultLocale, getDictionary, locales, type Locale } from "./dictionaries";

export const LOCALE_COOKIE = "locale";

export async function getLocale(): Promise<Locale> {
  const store = await cookies();
  const value = store.get(LOCALE_COOKIE)?.value;
  return locales.includes(value as Locale) ? (value as Locale) : defaultLocale;
}

export async function getDict() {
  const locale = await getLocale();
  return { locale, dict: getDictionary(locale) };
}

export { locales, defaultLocale };
export type { Locale };
