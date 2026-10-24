/**
 * CHF design system primitives.
 *
 * Every public page composes these instead of re-declaring Tailwind strings, so
 * spacing, radius, type scale and colour stay consistent. Tokens live in
 * `src/app/globals.css` (@theme). All components here are server-safe (no hooks).
 */
import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

/* ---------- Layout ---------- */

export function Container({
  className,
  ...props
}: ComponentProps<"div">) {
  return <div className={cn("mx-auto w-[min(1180px,92%)]", className)} {...props} />;
}

type Tone = "default" | "soft" | "white" | "navy";

const TONES: Record<Tone, string> = {
  default: "",
  soft: "bg-white",
  white: "bg-white",
  navy: "bg-gradient-to-br from-baobab to-teal text-white",
};

export function Section({
  tone = "default",
  className,
  children,
  id,
}: {
  tone?: Tone;
  className?: string;
  children: ReactNode;
  id?: string;
}) {
  return (
    <section
      id={id}
      className={cn("py-[72px] max-sm:py-12", TONES[tone], className)}
    >
      <Container>{children}</Container>
    </section>
  );
}

/* ---------- Typography ---------- */

export function Eyebrow({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <p
      className={cn(
        "font-body text-[0.78rem] font-bold uppercase tracking-[0.12em] text-clay",
        className,
      )}
    >
      {children}
    </p>
  );
}

export function SectionHead({
  eyebrow,
  title,
  intro,
  action,
  className,
}: {
  eyebrow?: string;
  title: string;
  intro?: ReactNode;
  action?: { href: string; label: string };
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mb-[26px] flex flex-wrap items-end justify-between gap-4",
        className,
      )}
    >
      <div className="max-w-[700px]">
        {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
        <h2 className="my-2.5 font-display text-[clamp(1.7rem,3vw,2.4rem)] leading-[1.25] text-ink">
          {title}
        </h2>
        {intro && (
          <p className="font-body text-base leading-[1.7] text-muted">
            {intro}
          </p>
        )}
      </div>
      {action && (
        <Link
          href={action.href}
          className="font-body text-[0.9rem] font-semibold text-clay transition-colors hover:text-red-dark"
        >
          {action.label} →
        </Link>
      )}
    </div>
  );
}

/* ---------- Surfaces ---------- */

export function Card({
  className,
  ...props
}: ComponentProps<"article">) {
  return (
    <article
      className={cn(
        "rounded-card border-t-4 border-t-transparent bg-white p-[1.8rem] shadow-card transition duration-[250ms] hover:-translate-y-1.5 hover:border-t-clay",
        className,
      )}
      {...props}
    />
  );
}

const ICON_TONES = {
  rose: "bg-rose",
  teal: "bg-teal-soft",
  gold: "bg-gold-soft",
} as const;

export function IconBox({
  tone = "rose",
  className,
  children,
}: {
  tone?: keyof typeof ICON_TONES;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      aria-hidden
      className={cn(
        "grid h-[54px] w-[54px] place-items-center rounded-2xl text-[1.5rem]",
        ICON_TONES[tone],
        className,
      )}
    >
      {children}
    </div>
  );
}

export function CardTitle({ className, ...props }: ComponentProps<"h3">) {
  return (
    <h3
      className={cn("mb-2 mt-4 font-body text-[1.05rem] font-semibold text-ink", className)}
      {...props}
    />
  );
}

export function CardText({ className, ...props }: ComponentProps<"p">) {
  return (
    <p
      className={cn("font-body text-[0.95rem] leading-[1.7] text-muted", className)}
      {...props}
    />
  );
}

export function Metric({
  value,
  label,
  dark,
}: {
  value: ReactNode;
  label: string;
  /** glass style for use on the navy/teal band */
  dark?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-[18px] p-6",
        dark
          ? "border border-white/[0.18] bg-white/10 backdrop-blur-[6px]"
          : "bg-white shadow-card",
      )}
    >
      <div className={cn("font-body text-[2rem] font-bold leading-tight", dark ? "text-white" : "text-teal")}>
        {value}
      </div>
      <p className={cn("mt-1 font-body text-[0.85rem]", dark ? "text-white/80" : "text-muted")}>
        {label}
      </p>
    </div>
  );
}

/* ---------- Controls ---------- */

type ButtonVariant = "primary" | "secondary" | "navy";

const BUTTON_BASE =
  "inline-flex items-center justify-center gap-2 rounded-full border-2 px-[1.6rem] py-[0.85rem] font-body text-[0.95rem] font-semibold transition duration-[250ms] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-clay disabled:opacity-50";

const BUTTON_VARIANTS: Record<ButtonVariant, string> = {
  primary:
    "border-transparent bg-gradient-to-br from-clay to-red-dark text-white shadow-cta hover:-translate-y-0.5",
  secondary: "border-teal bg-white text-teal hover:bg-teal hover:text-white",
  navy: "border-baobab bg-baobab text-white hover:-translate-y-0.5 hover:bg-teal hover:border-teal",
};

export function buttonClass(variant: ButtonVariant = "primary", className?: string) {
  return cn(BUTTON_BASE, BUTTON_VARIANTS[variant], className);
}

export function ButtonLink({
  variant = "primary",
  className,
  ...props
}: ComponentProps<typeof Link> & { variant?: ButtonVariant }) {
  return <Link className={buttonClass(variant, className)} {...props} />;
}

export function Pill({
  active,
  className,
  ...props
}: ComponentProps<"button"> & { active?: boolean }) {
  return (
    <button
      type="button"
      className={cn(
        "rounded-full border-2 px-4 py-2 font-body text-[0.85rem] font-semibold transition-colors",
        active
          ? "border-clay bg-[#fff5f4] text-red-dark"
          : "border-line bg-white text-ink hover:border-clay hover:bg-[#fff5f4] hover:text-red-dark",
        className,
      )}
      {...props}
    />
  );
}

export function Tag({
  tone = "warm",
  className,
  children,
}: {
  tone?: "warm" | "active";
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex self-start rounded-full px-3 py-1 font-body text-[0.72rem] font-bold",
        tone === "active" ? "bg-rose text-red-dark" : "bg-teal-tag text-teal",
        className,
      )}
    >
      {children}
    </span>
  );
}

/* ---------- Call to action ---------- */

export function CtaPanel({
  eyebrow,
  title,
  text,
  children,
}: {
  eyebrow: string;
  title: string;
  text: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-[22px] rounded-panel bg-gradient-to-br from-baobab to-teal p-10 text-white shadow-card max-sm:p-7">
      <div>
        <p className="font-body text-[0.78rem] font-bold uppercase tracking-[0.12em] text-[#fca5a5]">
          {eyebrow}
        </p>
        <h2 className="my-2.5 font-display text-[1.8rem] leading-[1.25]">{title}</h2>
        <p className="max-w-[650px] font-body text-base leading-[1.7] text-[#cbd5e1]">
          {text}
        </p>
      </div>
      <div className="flex flex-wrap gap-2.5">{children}</div>
    </div>
  );
}

/* ---------- Inner-page header ---------- */

export function PageHeader({
  eyebrow,
  title,
  intro,
}: {
  eyebrow: string;
  title: string;
  intro?: ReactNode;
}) {
  return (
    <div className="border-b border-line bg-[linear-gradient(120deg,#fff,#ffe9e4_45%,#e7f6f4)] py-[64px] max-sm:py-12">
      <Container>
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1 className="mb-0 mt-3 font-display text-[clamp(2.1rem,4.5vw,3.4rem)] leading-[1.15] text-ink">
          {title}
        </h1>
        {intro && (
          <p className="mt-4 max-w-[34rem] font-body text-base leading-[1.7] text-muted">
            {intro}
          </p>
        )}
      </Container>
    </div>
  );
}
