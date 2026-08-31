import { CheckFat } from "@phosphor-icons/react/dist/ssr/CheckFat";
import { Cpu } from "@phosphor-icons/react/dist/ssr/Cpu";
import { Cube } from "@phosphor-icons/react/dist/ssr/Cube";
import { CubeTransparent } from "@phosphor-icons/react/dist/ssr/CubeTransparent";
import { Network } from "@phosphor-icons/react/dist/ssr/Network";
import { Stack } from "@phosphor-icons/react/dist/ssr/Stack";
import { WaveSine } from "@phosphor-icons/react/dist/ssr/WaveSine";

import { Container } from "@/components/ui/container";
import { SectionHeader } from "@/components/ui/section-header";
import { SectionRevealItem } from "@/components/ui/section-reveal";
import { services } from "@/lib/homepage-data";

function ServiceIcon({ id }: { id: string }) {
  const iconClassName = "size-7 lg:size-11";
  const color = "var(--color-primary-500)";

  switch (id) {
    case "3d-ic":
      return <Stack weight="duotone" className={iconClassName} color={color} aria-hidden />;
    case "photonics":
      return <WaveSine weight="duotone" className={iconClassName} color={color} aria-hidden />;
    case "rf-analog":
      return <Network weight="duotone" className={iconClassName} color={color} aria-hidden />;
    case "tcad":
      return (
        <CubeTransparent weight="duotone" className={iconClassName} color={color} aria-hidden />
      );
    case "quantum":
      return <Cpu weight="duotone" className={iconClassName} color={color} aria-hidden />;
    case "physical-design":
      return <Cube weight="duotone" className={iconClassName} color={color} aria-hidden />;
    case "ams":
      return <CheckFat weight="duotone" className={iconClassName} color={color} aria-hidden />;
    default:
      return null;
  }
}

function ServiceCard({
  id,
  title,
  description,
}: {
  id: string;
  title: string;
  description: string;
}) {
  return (
    <SectionRevealItem
      as="article"
      className="flex h-full flex-col gap-6 overflow-hidden rounded-lg bg-surface-card p-6 sm:gap-8 sm:p-8 lg:p-[42px]"
    >
      <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-border-subtle p-3 sm:size-16 sm:p-4 lg:size-[86px] lg:p-[21px]">
        <ServiceIcon id={id} />
      </div>
      <div className="flex flex-col gap-4">
        <h3 className="text-heading-h4 text-text-primary">{title}</h3>
        <p className="text-body-small text-text-tertiary leading-[1.45]">{description}</p>
      </div>
    </SectionRevealItem>
  );
}

export function ExpertiseCarousel() {
  return (
    <Container>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
        <SectionRevealItem className="flex flex-col justify-center sm:col-span-2 lg:col-span-2">
          <SectionHeader
            eyebrow="CORE SERVICES"
            title={
              <>
                Our <span>Expertise.</span>
              </>
            }
            titleClassName="lg:whitespace-nowrap"
            description="Full-stack semiconductor design capability, mapped the way our engineers actually think about a chip."
          />
        </SectionRevealItem>

        {services.map((service) => (
          <ServiceCard key={service.id} {...service} />
        ))}
      </div>
    </Container>
  );
}
