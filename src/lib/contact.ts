/**
 * Shared contact-form types and the initial reducer state.
 *
 * These deliberately live outside app/actions.ts: a "use server" module may
 * only export async functions, so exporting a plain object from there throws
 * at request time (and not at build time, which makes it easy to miss).
 */
export type ContactState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: Partial<Record<"name" | "email" | "message", string>>;
  values?: { name: string; email: string; budget: string; message: string };
};

export const initialContactState: ContactState = { status: "idle" };
