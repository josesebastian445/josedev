/**
 * Lives here rather than in `content/posts.ts` so client components can format
 * a date without importing the module that holds every committed article. That
 * import used to ship all thirteen post bodies to the browser.
 */
export function formatDate(iso: string) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}
