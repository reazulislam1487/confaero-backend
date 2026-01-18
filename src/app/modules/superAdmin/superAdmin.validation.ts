import { z } from "zod";

const create_organizer = z.object({
  email: z
    .string({ message: "Email is required" })
    .email("Invalid email format"),

  organizationName: z
    .string({ message: "Organization name is required" })
    .min(2, "Organization name must be at least 2 characters"),
});

const create_event = z.object({
  title: z.string().min(2),
  website: z.string().url().optional(),
  organizerEmails: z.array(z.string().email()).min(1),

  location: z.string().min(2),
  googleMapLink: z.string().url().optional(),

  startDate: z.string(),
  endDate: z.string(),

  expectedAttendee: z.number().optional(),
  boothSlot: z.number().optional(),
  details: z.string().optional(),
  floorMapImageUrl: z.array(z.string().url()).optional(),
  agenda: z.array(z.string()).optional(),
});

export const super_admin_validations = {
  create_organizer,
  create_event,
};
