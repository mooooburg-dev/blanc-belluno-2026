import Header from "./components/Header";
import Hero from "./components/Hero";
import Services from "./components/Services";
import Gallery from "./components/Gallery";
import InstagramFeed from "./components/InstagramFeed";
import ContactForm from "./components/ContactForm";
import Footer from "./components/Footer";
import { getPortfolioItems } from "@/lib/portfolio";
import { getSettings } from "@/lib/settings";
import { getHeroSlides } from "@/lib/hero-slides";

export const dynamic = "force-dynamic";

export default async function Home() {
  const portfolioItems = await getPortfolioItems();
  const settings = await getSettings();
  const heroSlides = await getHeroSlides();

  return (
    <>
      <Header />
      <main>
        <Hero slides={heroSlides} />
        <Services />
        <Gallery items={portfolioItems} />
        <InstagramFeed settings={settings} />
        <ContactForm settings={settings} />
      </main>
      <Footer settings={settings} />
    </>
  );
}
