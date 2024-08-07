import type { HTMLAttributeAnchorTarget } from "react";

import type { RichTranslationValues } from "next-intl";

import { useTranslations } from "next-intl";

import type {
  FormattedMessage,
  NavigationEntry,
  NavigationKeys,
} from "~/types";

const isString = (a: unknown) => typeof a === "string";

// TODO: Finish implementing or eliminate this hook
type Context = Record<string, RichTranslationValues>;

type Navigation = Record<string, NavigationEntry>;

type MappedNavigationEntry = {
  items: [string, MappedNavigationEntry][];
  label: FormattedMessage;
  link: string;
  target?: HTMLAttributeAnchorTarget | undefined;
};

// Provides Context replacement for variables within the Link, this is also
// something that is not going to happen in the future with the codebase
const replaceLinkWithContext = (
  link: string,
  context?: RichTranslationValues,
) =>
  Object.entries(
    context ||
      {
        //
      },
  ).reduce(
    (finalLink, [find, replace]) =>
      finalLink.replace(`{${find}}`, isString(replace) ? replace : ""),
    link,
  );

const useSiteNavigation = () => {
  const t = useTranslations();

  const mapNavigationEntries = (entries: Navigation, context: Context = {}) => {
    const getFormattedMessage = (label: string, key: string) =>
      t.rich(
        label,
        context[key] ||
          {
            //
          },
      );

    return Object.entries(entries).map(
      ([key, { items, label, link, target }]): [
        string,
        MappedNavigationEntry,
      ] => [
        key,
        {
          items: items ? mapNavigationEntries(items, context) : [],
          label: label ? getFormattedMessage(label, key) : "",
          link: link ? replaceLinkWithContext(link, context[key]) : "",
          target,
        },
      ],
    );
  };

  const getSideNavigation = (keys: NavigationKeys[], context: Context = {}) => {
    const navigationEntries: Navigation = keys.reduce(
      (accumulator) => ({
        ...accumulator,

        // [key]: siteNavigation.sideNavigation[key],
      }),
      {
        //
      },
    );

    return mapNavigationEntries(navigationEntries, context);
  };

  // const navigationItems = mapNavigationEntries(siteNavigation.topNavigation);
  return {
    getSideNavigation,

    // navigationItems,
  };
};

export default useSiteNavigation;

// @see https://github.com/nodejs/nodejs.org/blob/main/hooks/react-generic/useSiteNavigation.ts
