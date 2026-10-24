import { ButtonLink, CtaPanel, Section } from "@/components/design";

export default function CTABand() {
  return (
    <Section>
      <CtaPanel
        eyebrow="Let's work together"
        title="Help build healthier communities."
        text="Contact CHF to discuss volunteering, community projects, funding partnerships, technical support or general enquiries."
      >
        <ButtonLink href="/donate">Donate Now ↗</ButtonLink>
        <ButtonLink href="/volunteer" variant="secondary">
          Volunteer
        </ButtonLink>
      </CtaPanel>
    </Section>
  );
}
