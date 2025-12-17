/**
 * Joins class names together, filtering out falsy values.
 * Useful for conditional Tailwind classes.
 */
export const cls = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};
