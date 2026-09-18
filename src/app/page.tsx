import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import Capabilities from "@/components/Capabilities";
import Work from "@/components/Work";
import Process from "@/components/Process";
import About from "@/components/About";
import Writing from "@/components/Writing";
import Contact from "@/components/Contact";
import { getPostSummaries } from "@/lib/posts";

/**
 * Order follows the numbered sections in the copy:
 * 01 What I do · 02 Selected work · 03 How it works · 04 Who you'd be working
 * with · 05 Writing. The stat block now lives in the hero, and there is no
 * testimonials section — there are no real client quotes to put in it.
 */
export default async function Home() {
  const recent = (await getPostSummaries()).slice(0, 3);

  return (
    <main>
      <Hero />
      <Marquee />
      <Capabilities />
      <Work />
      <Process />
      <About />
      <Writing posts={recent} />
      <Contact />
    </main>
  );
}
