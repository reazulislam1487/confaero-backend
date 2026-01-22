import { z } from "zod";

const get_event_speakers = z.object({
  eventId: z.string(),
});

export const speaker_validations = {
  get_event_speakers,
};
