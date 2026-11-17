/** Where things live. One place, so a route change is one edit. */
export const paths = {
  project: (slug: string) => `/projects/${slug}/`,
  maker: (slug: string) => `/makers/${slug}/`,
  update: (projectSlug: string, updateId: string) => `/projects/${projectSlug}/#update-${updateId}`,
  /** One of the four rooms: /game/, /iot/, /web/, /idea/. */
  room: (categoryId: string) => `/${categoryId}/`,
  /** A room with one genre already picked. */
  roomGenre: (categoryId: string, genreId: string) => `/${categoryId}/?genre=${genreId}`,
  about: "/#about",
};
