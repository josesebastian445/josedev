import { getEnquiryService } from "@/content/enquiries";

export const GA_MEASUREMENT_ID = "G-GBS2K2FYSS";
type EventName = "service_view" | "service_enquiry_click" | "contact_view" | "enquiry_start" | "enquiry_service_selected" | "enquiry_submit" | "enquiry_error" | "generate_lead" | "contact_method_click";
type Parameters = { service?: string; outcome?: "validation" | "delivery"; method?: "email" | "phone" | "whatsapp" };

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/** Only fixed categories are collected: never form values, email or message text. */
export function trackEvent(name: EventName, parameters: Parameters = {}) {
  if (typeof window === "undefined") return;
  const payload: Record<string, string> = { page_path: window.location.pathname, send_to: GA_MEASUREMENT_ID };
  if (getEnquiryService(parameters.service ?? "")) payload.service = parameters.service!;
  if (parameters.outcome === "validation" || parameters.outcome === "delivery") payload.outcome = parameters.outcome;
  if (["email", "phone", "whatsapp"].includes(parameters.method ?? "")) payload.method = parameters.method!;
  // A local diagnostic event lets browser checks inspect the payload without sending it.
  window.dispatchEvent(new CustomEvent("joseviews:analytics", { detail: { name, parameters: payload } }));
  if (process.env.NODE_ENV !== "production") return;
  const gtag: (...args: unknown[]) => void = window.gtag ?? function () { (window.dataLayer ??= []).push(arguments); };
  gtag("event", name, payload);
}
