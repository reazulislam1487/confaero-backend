import { z } from "zod";

const create_organizer = z.object({
  email: z
    .string({ message: "Email is required" })
    .email("Invalid email format"),

  organizationName: z
    .string({ message: "Organization name is required" })
    .min(2, "Organization name must be at least 2 characters"),
});

export const super_admin_validations = {
  create_organizer,
};
