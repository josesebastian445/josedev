/**
 * Real contact details, in one place. These were previously hardcoded in six
 * separate components, which is how a site ends up with two different email
 * addresses on it.
 */
export const SITE = {
  name: "Jose Sebastian",
  role: "IT Manager & Web Developer",
  location: "Dubai, United Arab Emirates",
  locationShort: "Dubai, UAE",
  email: "hi@joseviews.com",
  phone: "+971 58 920 2967",
  /** wa.me needs the number bare: no +, spaces or dashes */
  whatsapp: "https://wa.me/971589202967",
  years: "7+",
  timezone: "Asia/Dubai",
  replyTime: "Within a few hours",
} as const;

export const MAILTO = `mailto:${SITE.email}`;
export const TEL = `tel:${SITE.phone.replace(/\s/g, "")}`;
