import Link from "next/link";

const ACTIONS = [
  { label: "Donate Now", href: "/donate", style: "solid" },
  { label: "Become a Volunteer", href: "/volunteer", style: "outline" },
  { label: "Partner With Us", href: "/become-a-partner", style: "outline" },
  { label: "Request Support", href: "/request-support", style: "outline" },
  { label: "Contact Our Team", href: "/contact-us", style: "outline" },
];

export default function CTABand() {
  return (
    <section className="bg-clay px-6 py-16 text-center md:px-12">
      <div className="mx-auto max-w-3xl">
        <h2 className="font-display text-3xl text-sand md:text-4xl">
          However you can help, there is a place for you at CHF.
        </h2>
        <p className="mt-4 font-body text-sand/85">
          Every contribution, whether time, funds, or partnership, reaches a
          real community across Tanzania.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {ACTIONS.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className={
                action.style === "solid"
                  ? "rounded-full bg-baobab-dark px-6 py-3 font-body text-sm font-semibold text-sand transition-transform hover:scale-105"
                  : "rounded-full border border-sand/40 px-6 py-3 font-body text-sm font-semibold text-sand transition-colors hover:border-sand hover:bg-sand/10"
              }
            >
              {action.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
