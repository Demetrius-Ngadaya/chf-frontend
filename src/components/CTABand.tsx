import Link from "next/link";

export default function CTABand() {
  return (
    <section className="px-[22px] py-[65px]">
      <div className="mx-auto flex max-w-[1120px] flex-wrap items-center justify-between gap-[22px] rounded-[18px] bg-baobab p-8 text-white max-sm:p-[23px]">
        <div>
          <div className="text-[0.72rem] font-extrabold uppercase tracking-[2px] text-[#ff9ba2]">Let&apos;s work together</div>
          <h2 className="my-2.5 text-[1.8rem] font-bold">Help build healthier communities.</h2>
          <p className="max-w-[650px] text-[0.86rem] leading-[1.8] text-[#d0dbe5]">
            Contact CHF to discuss volunteering, community projects, funding partnerships, technical
            support or general enquiries.
          </p>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <Link href="/donate" className="inline-flex items-center justify-center rounded-lg border border-clay bg-clay px-[15px] py-[11px] text-[0.82rem] font-bold text-white transition hover:-translate-y-px hover:bg-[#a91f2b]">
            Donate Now ↗
          </Link>
          <Link href="/volunteer" className="inline-flex items-center justify-center rounded-lg border border-[#cbd5e1] bg-white px-[15px] py-[11px] text-[0.82rem] font-bold text-baobab transition hover:-translate-y-px">
            Volunteer
          </Link>
        </div>
      </div>
    </section>
  );
}
