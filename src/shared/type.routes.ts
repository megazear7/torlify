import z from "zod";

export const RoutePath = z.string();
export type RoutePath = z.infer<typeof RoutePath>;

export const RouteName = z.enum([
  "home",
  "book",
  "chapter",
  "part",
  "not_found",
]);
export type RouteName = z.infer<typeof RouteName>;

export const RouteConfig = z.object({
  name: RouteName,
  path: RoutePath,
});
export type RouteConfig = z.infer<typeof RouteConfig>;

export const routes = [
  {
    name: RouteName.enum.home,
    path: "/",
  },
  {
    name: RouteName.enum.book,
    path: "/book/:bookId",
  },
  {
    name: RouteName.enum.chapter,
    path: "/book/:bookId/chapter/:chapterId",
  },
  {
    name: RouteName.enum.part,
    path: "/book/:bookId/chapter/:chapterId/part/:partId",
  },
];
