import Script from "next/script";

/**
 * Google Analytics 4 and Google Tag Manager.
 *
 * Neither ID is a secret — both ship in the HTML of every page and anyone can
 * read them with View Source. They are hardcoded rather than taken from env
 * vars on purpose: a NEXT_PUBLIC_ variable is inlined at build time, so on
 * Cloudflare Workers Builds it would have to be set in the dashboard's build
 * environment, and a missing one would fail silently by shipping no tracking at
 * all. Set either to an empty string to switch that one off.
 *
 * Both need matching entries in the CSP in custom-worker.js — script-src for
 * the loaders, img-src and connect-src for the beacons, and frame-src for the
 * GTM noscript iframe. A missing entry does not throw anywhere a visitor would
 * notice; the tag is simply blocked and records nothing.
 */
const GA_ID = "G-GBS2K2FYSS";
const GTM_ID = "GTM-MKJP6947";

/**
 * Nothing loads outside production, so local development does not pollute
 * either property with sessions from `next dev`.
 *
 * Client-side route changes are covered by GA4's enhanced measurement, which
 * tracks page changes from browser history events by default — hence no manual
 * pageview call here, which would double-count every navigation.
 *
 * NB: if the GTM container also holds a GA4 configuration tag for GA_ID, every
 * event is counted twice — once by gtag.js below and once through GTM. Measure
 * GA4 from one of the two, not both.
 */
export default function Analytics() {
  if (process.env.NODE_ENV !== "production") return null;

  return (
    <>
      {GTM_ID ? (
        <>
          <Script id="gtm-init" strategy="afterInteractive">
            {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`}
          </Script>
          {/* Visitors with JavaScript disabled. Needs frame-src in the CSP or
              the iframe is blocked — default-src 'self' does not cover it. */}
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
              title="Google Tag Manager"
            />
          </noscript>
        </>
      ) : null}

      {GA_ID ? (
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
      ) : null}
    </>
  );
}
