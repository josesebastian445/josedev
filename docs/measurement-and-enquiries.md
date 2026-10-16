# Visitor measurement and enquiry checks

## Existing analytics

The site already loads GA4 property measurement ID `G-GBS2K2FYSS` and GTM container `GTM-MKJP6947` in production. This change adds events to that existing Google tag; it does not add another analytics loader or send additional page views. Keep GA4 enhanced measurement enabled for history-based navigation. Avoid configuring a second GA4 tag for this same measurement ID inside GTM.

## Events

| Event | Trigger | Useful parameters |
| --- | --- | --- |
| service_view | At least 40% of a service card enters the viewport; once per service per route visit | service, page_path |
| service_enquiry_click | A visitor follows a service-specific contact link | service, page_path |
| contact_view | The enquiry form mounts | service when preselected, page_path |
| enquiry_start | First focus in the enquiry form | service when selected, page_path |
| enquiry_service_selected | Visitor changes the service radio selection | service, page_path |
| enquiry_submit | Browser-valid form submission reaches the submit handler | service, page_path |
| enquiry_error | Server returns validation or delivery failure | service, outcome, page_path |
| generate_lead | Server action reports an accepted enquiry | service, page_path |
| contact_method_click | Visitor clicks an email, phone or WhatsApp link | method, page_path |

Custom events contain fixed service slugs and category values. They do not contain names, email addresses, phone numbers, message text, website/team context, budget, or URL query strings. The existing GA/GTM configuration determines other automatically collected data. Scripts and events can be blocked by browsers or privacy tools, so analytics is not an exact count of every visitor.

Development emits `joseviews:analytics` DOM events for testing without sending custom analytics to Google. Production sends through `gtag` with `send_to` restricted to the existing measurement ID. Events queued before the Google loader initializes are preserved in its dataLayer.

## GA4 setup and useful reports

In the existing GA4 property, create event-scoped custom dimensions for `service`, `outcome`, and `method` under Admin > Custom definitions. Mark `generate_lead` as a key event. Dashboard changes require access to the GA4 account; no dashboard configuration was performed from this checkout.

Build an Explore > Funnel exploration using:

1. `contact_view`
2. `enquiry_start`
3. `enquiry_submit`
4. `generate_lead`

Compare users progressing between steps rather than subtracting raw event totals: visitors can retry a submission. Break down by `service` and device category. Service may be absent at the start of a generic contact visit until the visitor chooses one, so compare the preselected-service flow separately.

For interest before contact, compare `service_view` with `service_enquiry_click` by service. Use Pages and screens and Path exploration for article/service routes leading to the contact page. Use `enquiry_error` by `outcome` to distinguish server validation failures from delivery failures. Native browser validation can stop a submission before `enquiry_submit` fires.

These stages infer drop-off from missing subsequent events. They do not assert that every tab close was an abandoned enquiry. No background tracking of form text or unreliable per-tab exit conversion is added.

## Live enquiry check — 16 October 2026

Reference: `JV-LIVE-20261016T092021`.

Four clearly labelled messages were submitted through the current public form at `https://joseviews.com/contact`, representing website development, SEO, maintenance and IT support. All four submissions displayed the live site's success state. The site owner confirmed receipt of the four messages and a successful reply to `hi@joseviews.com` in this chat.

The live form at test time was the older form without service selection. Each test named its service in the message; the new service-selector flow was verified locally separately. New production form and tracking behavior require deploying these source changes.

The visitor test address `hi@joseviews.com` forwards to the same configured destination inbox. This confirms the existing forwarding/reply route with owner confirmation, not delivery to an unrelated customer's provider. Inbox receipt is owner-confirmed; no mailbox connector was used to inspect private mail. No additional reply emails were sent by the agent.
