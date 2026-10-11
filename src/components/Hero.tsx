import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import HeroSlider from "@/components/HeroSlider";

export default function Hero() {
  return (
    <>
      <SiteHeader />
      <section className="bg-gradient-to-br from-[#f8fafc] to-[#fff1f2] px-[22px] pb-[52px] pt-[66px] max-sm:pt-[42px]">
        <div className="mx-auto grid max-w-[1120px] items-center gap-[38px] md:grid-cols-[1.1fr_.9fr]">
          <div>
            <div className="text-[0.72rem] font-extrabold uppercase tracking-[2px] text-clay">
              Healthier communities · Stronger futures
            </div>
            <h1 className="my-4 text-[clamp(2.4rem,5vw,4.2rem)] font-bold leading-[1.04] tracking-[-1.5px] text-baobab">
              Every life matters.
              <br />
              <span className="text-clay">Every heart counts.</span>
            </h1>
            <p className="max-w-[620px] text-base leading-[1.85] text-[#526174]">
              Caring Heart Foundation (CHF) is a Tanzania-based NGO focused on improving community
              health, preventing disease, promoting social inclusion and supporting vulnerable
              communities through education, advocacy, research and partnership.
            </p>
            <div className="mt-6 flex flex-wrap gap-2.5">
              <Link href="/about-us" className="inline-flex items-center justify-center gap-2 rounded-lg border border-clay bg-clay px-[15px] py-[11px] text-[0.82rem] font-bold text-white transition hover:-translate-y-px hover:bg-[#a91f2b]">
                Discover CHF ↓
              </Link>
              <Link href="/projects" className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#cbd5e1] bg-white px-[15px] py-[11px] text-[0.82rem] font-bold text-baobab transition hover:-translate-y-px">
                Explore our projects
              </Link>
            </div>
            <div className="mt-6 grid grid-cols-3 gap-2.5 max-sm:gap-1.5">
              {[
                ["Health", "Our core focus"],
                ["Inclusion", "People-centered action"],
                ["Tanzania", "Community-rooted"],
              ].map(([t, s]) => (
                <div key={t} className="rounded-[10px] border border-[#e2e8f0] bg-white p-[13px] max-sm:p-2.5">
                  <b className="block text-base text-baobab">{t}</b>
                  <span className="text-[0.7rem] text-[#64748b] max-sm:text-[0.64rem]">{s}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative flex min-h-[310px] flex-col justify-between overflow-hidden rounded-[22px] bg-baobab p-[30px] text-white">
            <div className="pointer-events-none absolute -right-[70px] -top-[80px] h-[260px] w-[260px] rounded-full border-[40px] border-white/[0.05]" />
            <div className="relative z-10 text-[76px] leading-none text-[#ff929b]">
              ♥<span className="text-[30px] text-white">✚</span>
            </div>
            <div className="relative z-10">
              <h2 className="max-w-[330px] text-[1.7rem] font-bold leading-[1.4]">Care for people. Change lives.</h2>
              <p className="mt-2 text-[0.8rem] text-[#d5e0e9]">Health education · Prevention · Advocacy · Research</p>
            </div>
          </div>
        </div>
      </section>
      <HeroSlider />
    </>
  );
}
