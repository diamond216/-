/** Where things live. One place, so a route change is one edit. */
export const paths = {
  project: (slug: string) => `/projects/${slug}/`,
  maker: (slug: string) => `/makers/${slug}/`,
  update: (projectSlug: string, updateId: string) => `/projects/${projectSlug}/#update-${updateId}`,
  /** The home shelf with one filter applied. Plain links, so the shelf reads the address fresh. */
  shelfCategory: (categoryId: string) => `/?cat=${categoryId}#shelf`,
  shelfGenre: (genreId: string) => `/?genre=${genreId}#shelf`,
};
