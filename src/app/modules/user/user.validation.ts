import { z } from "zod";

const affiliationSchema = z.object({
  company: z.string().optional(),
  position: z.string().optional(),
  from: z.string().optional(),
  to: z.string().optional(),
  isCurrent: z.boolean().optional(),
});

const educationSchema = z.object({
  institute: z.string().optional(),
  degree: z.string().optional(),
  major: z.string().optional(),
  from: z.string().optional(),
  to: z.string().optional(),
  isCurrent: z.boolean().optional(),
});

const locationSchema = z.object({
  address: z.string().optional(),
  isCurrent: z.boolean().optional(),
});

const contactSchema = z.object({
  phone: z.string().optional(),
  mobile: z.string().optional(),
  email: z.string().email().optional(),
});

const socialLinkSchema = z.object({
  platform: z.string().optional(),
  url: z.string().url().optional(),
});

const update_user = z.object({
  name: z.string().optional(),
  about: z.string().max(1000).optional(),

  affiliations: z.array(affiliationSchema).optional(),
  education: z.array(educationSchema).optional(),

  location: locationSchema.optional(),
  contact: contactSchema.optional(),

  socialLinks: z.array(socialLinkSchema).optional(),
  personalWebsites: z.array(z.string().url()).optional(),
});

export const user_validations = {
  update_user,
};
