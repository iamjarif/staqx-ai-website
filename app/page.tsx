import dynamic from "next/dynamic";

import { Header } from "@/components/layout/Header";
import { BlogSection } from "@/components/sections/BlogSection";
import { CombinedSectionsGroup } from "@/components/sections/CombinedSectionsGroup";
import { EngagementModelsSection } from "@/components/sections/EngagementModelsSection";
import { ExpertiseSection } from "@/components/sections/ExpertiseSection";
import { HeroSection } from "@/components/sections/HeroSection";
import { SecuritySection } from "@/components/sections/SecuritySection";
import { SecurityWhyGroup } from "@/components/sections/SecurityWhyGroup";
import { WhySection } from "@/components/sections/WhySection";
import { JsonLd } from "@/components/seo/json-ld";
import { createMetadata } from "@/lib/metadata";
import { professionalServiceSchema } from "@/lib/schema";

const MissionSection = dynamic(() =>
  import("@/components/sections/MissionSection").then((mod) => mod.MissionSection)
);
const WorkstepSection = dynamic(() =>
  import("@/components/sections/WorkstepSection").then((mod) => mod.WorkstepSection)
);
const ContactSection = dynamic(() =>
  import("@/components/sections/ContactSection").then((mod) => mod.ContactSection)
);

export const metadata = createMetadata({
  alternates: { canonical: "/" },
});

export default function Home() {
  return (
    <>
      <Header />
      <JsonLd data={professionalServiceSchema()} />
      <main className="bg-surface-page">
        <HeroSection />
        <CombinedSectionsGroup>
          <MissionSection />
          <ExpertiseSection />
          <WorkstepSection />
        </CombinedSectionsGroup>
        <EngagementModelsSection />
        <SecurityWhyGroup>
          <SecuritySection />
          <WhySection />
        </SecurityWhyGroup>
        <BlogSection />
        <ContactSection />
      </main>
    </>
  );
}
