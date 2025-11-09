import z from "zod";

export const HttpMethod = z.enum(["get", "post", "put", "delete"]);
export type HttpMethod = z.infer<typeof HttpMethod>;
