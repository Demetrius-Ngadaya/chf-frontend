import Header from "./Header";
import HeroSlider from "./HeroSlider";
import PulseDivider from "./PulseDivider";

export default function Hero() {
  return (
    <>
      <section className="relative flex min-h-[92vh] flex-col justify-end overflow-hidden bg-baobab px-6 pb-20 pt-32 md:px-12">
        <HeroSlider />
        <Header />
      </section>
      <PulseDivider />
    </>
  );
}
