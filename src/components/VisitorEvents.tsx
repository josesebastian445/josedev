"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { trackEvent } from "@/lib/analytics";
import { getEnquiryService } from "@/content/enquiries";

export default function VisitorEvents() {
  const pathname = usePathname();
  useEffect(() => {
    const seen = new Set<string>();
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        const service = (entry.target as HTMLElement).dataset.serviceSlug;
        if (entry.isIntersecting && service && !seen.has(service)) {
          seen.add(service);
          trackEvent("service_view", { service });
        }
      }
    }, { threshold: 0.4 });
    document.querySelectorAll("[data-service-slug]").forEach((element) => observer.observe(element));
    const onClick = (event: MouseEvent) => {
      const anchor = event.target instanceof Element ? event.target.closest("a[href]") : null;
      if (!anchor) return;
      const target = new URL(anchor.getAttribute("href")!, window.location.href);
      if (target.origin === window.location.origin && target.pathname === "/contact") {
        const service = target.searchParams.get("service") ?? "";
        if (getEnquiryService(service)) trackEvent("service_enquiry_click", { service });
      }
      const method = target.protocol === "mailto:" ? "email" : target.protocol === "tel:" ? "phone" : target.hostname === "wa.me" ? "whatsapp" : null;
      if (method) trackEvent("contact_method_click", { method });
    };
    document.addEventListener("click", onClick);
    return () => { observer.disconnect(); document.removeEventListener("click", onClick); };
  }, [pathname]);
  return null;
}
