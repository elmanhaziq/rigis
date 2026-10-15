import type { ContactInput } from "./validation/contact";

export type ContactResult =
  | { ok: true }
  | { ok: false; reason: "not-configured" | "rate-limited" | "error"; message: string };

/**
 * Sends a contact enquiry.
 *
 * Phase 1 has no backend, so this reports that messages cannot be delivered
 * yet rather than pretending to succeed. Phase 2 replaces it with an insert
 * into the contact_messages table (anonymous INSERT only, no SELECT, rate
 * limited by a database trigger).
 */
export async function submitContact(input: ContactInput): Promise<ContactResult> {
  void input;
  return {
    ok: false,
    reason: "not-configured",
    message:
      "The contact form is not connected yet, so your message was not sent. It will be enabled when the website's database is configured.",
  };
}
