import { z } from "zod";

export const enquiryTypes = [
  { value: "collaboration", label: "Research collaboration" },
  { value: "research", label: "Research enquiry" },
  { value: "postgraduate", label: "Postgraduate study / supervision" },
  { value: "industry", label: "Industry partnership" },
  { value: "other", label: "Other" },
] as const;

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(120, "Name is too long."),
  email: z.email("Please enter a valid email address.").max(254),
  organisation: z.string().trim().max(160, "Organisation is too long.").optional().or(z.literal("")),
  enquiryType: z.enum(enquiryTypes.map((t) => t.value) as [string, ...string[]], {
    error: "Please choose an enquiry type.",
  }),
  subject: z.string().trim().min(3, "Please add a short subject.").max(160, "Subject is too long."),
  message: z
    .string()
    .trim()
    .min(20, "Please write at least 20 characters so we can help.")
    .max(4000, "Message is too long (4000 characters maximum)."),
  consent: z.literal(true, { error: "Please confirm we may use your details to reply." }),
  /** Honeypot: real users never see or fill this field. */
  website: z.string().max(0).optional().or(z.literal("")),
});

export type ContactInput = z.infer<typeof contactSchema>;
