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

const update_event = z.object({
  title: z.string().min(2).optional(),
  location: z.string().min(2).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  website: z.string().url().optional(),
  description: z.string().optional(),
  expectedParticipants: z.number().optional(),
  boothSlots: z.number().optional(),
  image: z.string().url().optional(),
  status: z.enum(["UPCOMING", "ONGOING", "COMPLETED", "CANCELLED"]).optional(),
  addOrganizers: z.array(z.string().email()).optional(),
  googleMapLink: z.string().optional(),
  floorMapImageUrl: z.array(z.string().url()).optional(),
  agenda: z.array(z.string()).optional(),
});

export const super_admin_validations = {
  create_organizer,
  create_event,
  update_event,
};
