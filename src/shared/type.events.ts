import z from "zod";

export const TorlifyEventName = z.enum(["ModelSubmit", "Navigation"]);

export const ModelSubmitEventDetail = z.object({});
export type ModelSubmitEventDetail = z.infer<typeof ModelSubmitEventDetail>;

export const ModelSubmitEventData = z.object({
  name: z.literal(TorlifyEventName.enum.ModelSubmit),
  detail: ModelSubmitEventDetail,
});
export type ModelSubmitEventData = z.infer<typeof ModelSubmitEventData>;

export const ModelSubmitEvent = (): ModelSubmitEventData => ({
    name: TorlifyEventName.enum.ModelSubmit,
    detail: {},
});

export const NavigationEventDetail = z.object({
    path: z.string().describe("The path to navigate to."),
});
export type NavigationEventDetail = z.infer<typeof NavigationEventDetail>;

export const NavigationEventData = z.object({
  name: z.literal(TorlifyEventName.enum.Navigation),
  detail: NavigationEventDetail,
});
export type NavigationEventData = z.infer<typeof NavigationEventData>;

export const NavigationEvent = (detail: NavigationEventDetail): NavigationEventData => ({
    name: TorlifyEventName.enum.Navigation,
    detail,
});

export const TorlifyEvent = z.union([
  ModelSubmitEventData,
  NavigationEventData,
]);
export type TorlifyEvent = z.infer<typeof TorlifyEvent>;
