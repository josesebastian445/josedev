import Script from "next/script";

/**
 * Google Analytics 4.
 *
 * The measurement ID is not a secret — it ships in the HTML of every page, and
 * anyone can read it with View Source. It is hardcoded rather than taken from
 * an env var on purpose: a NEXT_PUBLIC_ variable is inlined at build time, so
 * on Cloudflare Workers Builds it would have to be set in the dashboard's build
 * environment, and a missing one would fail silently by shipping no analytics
 * at all. Set it to an empty string to turn tracking off.
 */
const GA_ID = "G-GBS2K2FYSS";

/**
 * Never loads outside production, so local development does not pollute the
 * property with sessions from `next dev`.
 *
 * Client-side route changes are covered by GA4's enhanced measurement, which
 * tracks page changes from browser history events by default — hence no manual
 * pageview call here, which would double-count every navigation.
 */
export default function Analytics() {
  if (!GA_ID || process.env.NODE_ENV !== "production") return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_ID}');`}
      </Script>
    </>
  );
}
