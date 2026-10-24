import { ButtonLink, Container } from "@/components/design";

const QUICK_FACTS = [
  ["Health", "Our core focus"],
  ["Inclusion", "People-centered action"],
  ["Tanzania", "Community-rooted"],
] as const;

export default function HomeIntro() {
  return (
    <section className="overflow-hidden bg-[linear-gradient(120deg,#fff,#ffe9e4_45%,#e7f6f4)] pb-20 pt-20 max-sm:pb-14 max-sm:pt-12">
      <Container className="grid items-center gap-[38px] md:grid-cols-[1.1fr_.9fr]">
        <div>
          <span className="mb-4 inline-block rounded-full border border-[#ffd9d3] bg-white px-4 py-1.5 text-[0.8rem] font-semibold text-red-dark">
            💛 Healthier communities · Stronger futures
          </span>
          <h1 className="mb-4 font-display text-[clamp(2.1rem,4.5vw,3.4rem)] leading-[1.15] text-ink">
            Every life matters.
            <br />
            <span className="text-clay">Every heart counts.</span>
          </h1>
          <p className="mb-7 max-w-[34rem] font-body text-base leading-[1.7] text-muted">
            Caring Heart Foundation (CHF) is a Tanzania-based NGO focused on improving community
            health, preventing disease, promoting social inclusion and supporting vulnerable
            communities through education, advocacy, research and partnership.
          </p>
          <div className="flex flex-wrap gap-4">
            <ButtonLink href="/about-us">Discover CHF ↓</ButtonLink>
            <ButtonLink href="/projects" variant="secondary">
              Explore our projects
            </ButtonLink>
          </div>
          <dl className="mt-9 grid grid-cols-3 gap-4 sm:flex sm:gap-8">
            {QUICK_FACTS.map(([term, detail]) => (
              <div key={term}>
                <dt className="font-body text-[1.1rem] font-bold text-teal sm:text-[1.7rem]">{term}</dt>
                <dd className="font-body text-[0.72rem] text-muted sm:text-[0.85rem]">{detail}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative rounded-panel bg-white p-[1.6rem] shadow-card">
          <span className="absolute -top-[18px] right-[-10px] rounded-full bg-teal px-[0.9rem] py-2 text-[0.75rem] font-semibold text-white shadow-card">
            Our mission
          </span>
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <b className="font-body text-base text-ink">Care for people. Change lives.</b>
              <p className="mt-0.5 font-body text-[0.8rem] text-muted">
                Health education · Prevention · Advocacy · Research
              </p>
            </div>
            <div className="font-body text-[1.4rem] font-extrabold text-clay">♥</div>
          </div>
          <div className="my-2.5 h-3 overflow-hidden rounded-full bg-[#f1f5f9]">
            <i className="block h-full w-[72%] rounded-full bg-gradient-to-r from-clay to-gold" />
          </div>
          <div className="flex justify-between font-body text-[0.85rem] text-muted">
            <span>Community reach</span>
            <span>Growing every year</span>
          </div>
          <hr className="my-5 border-0 border-t border-line" />
          <ButtonLink href="/donate" className="w-full">
            Give Hope Now
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
