import Header from "./Header";
import HeroSlider from "./HeroSlider";
import PulseDivider from "./PulseDivider";

export default function Hero() {
  return (
    <>
      <section className="relative flex min-h-[92vh] flex-col justify-end overflow-hidden bg-baobab px-6 pb-20 pt-32 md:px-12">
        <HeroSlider />

        <Header />

        <div className="relative z-10 max-w-3xl">
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-gold">
            Caring Heart Foundation, Tanzania
          </p>
          <h1 className="font-display text-4xl font-semibold leading-[1.05] text-sand md:text-6xl">
            Health and dignity, reaching every community it has not reached
            yet.
          </h1>
          <p className="mt-6 max-w-xl font-body text-lg text-sand/80">
            We work alongside hospitals, schools, and local leaders across
            Tanzania to deliver maternal health, nutrition, and community
            care programs where they are needed most.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="/donate"
              className="rounded-full bg-clay px-6 py-3 font-body text-sm font-semibold text-sand transition-transform hover:scale-105"
            >
              Donate Now
            </a>
            <a
              href="/volunteer"
              className="rounded-full border border-sand/30 px-6 py-3 font-body text-sm font-semibold text-sand transition-colors hover:border-gold hover:text-gold"
            >
              Become a Volunteer
            </a>
          </div>
        </div>
      </section>

      <PulseDivider />
    </>
  );
}
