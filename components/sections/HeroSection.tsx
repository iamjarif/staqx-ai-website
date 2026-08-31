import Image from "next/image";

import { HeroCopy } from "@/components/sections/HeroCopy";

export function HeroSection() {
  return (
    <section
      id="hero"
      className="relative flex min-h-[100svh] flex-col overflow-hidden lg:h-[95vh] lg:min-h-[95vh]"
    >
      <div className="absolute inset-0">
        <Image
          src="/images/homepage/hero.jpg"
          alt="Engineers working on semiconductor and IC design"
          fill
          priority
          fetchPriority="high"
          quality={80}
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black to-[74%]" />
      </div>

      <HeroCopy />
    </section>
  );
}
