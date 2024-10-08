import { localePrefix, locales, pathnames } from "~/../reliverse.i18n";
import { createLocalizedPathnamesNavigation } from "next-intl/navigation";

export const { getPathname, Link, redirect, usePathname, useRouter } =
  createLocalizedPathnamesNavigation({ localePrefix, locales, pathnames });
