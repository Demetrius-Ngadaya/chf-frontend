import { apiGet } from "@/lib/api";
import { Card, CardText, CardTitle, IconBox, Section, SectionHead } from "@/components/design";

type AboutContent = {
  intro?: string;
  mission: string;
  vision: string;
  objectives: string[];
};

type AboutPage = {
  slug: string;
  title: string;
  content: AboutContent;
};

const FOCUS_ICONS = ["✦", "✓", "⊕", "☼"] as const;
const TONES = ["rose", "teal", "gold"] as const;

export default async function MissionSection() {
  const page = await apiGet<AboutPage>("/pages/about-us");
  const { intro, mission, vision, objectives } = page.content;

  return (
    <Section id="about">
      <SectionHead
        eyebrow="Who we are"
        title="A community-centered approach to health"
        intro={intro}
        action={{ href: "/about-us", label: "Read our story" }}
      />
      <div className="grid gap-[1.6rem] sm:grid-cols-2">
        <Card>
          <IconBox tone="teal">◎</IconBox>
          <CardTitle>Our Vision</CardTitle>
          <CardText>{vision}</CardText>
        </Card>
        <Card>
          <IconBox tone="rose">♥</IconBox>
          <CardTitle>Our Mission</CardTitle>
          <CardText>{mission}</CardText>
        </Card>
        {objectives.map((objective, index) => (
          <Card key={index}>
            <IconBox tone={TONES[index % TONES.length]}>{FOCUS_ICONS[index % FOCUS_ICONS.length]}</IconBox>
            <CardTitle>What we focus on</CardTitle>
            <CardText>{objective}</CardText>
          </Card>
        ))}
      </div>
    </Section>
  );
}
