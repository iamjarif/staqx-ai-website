import { Header } from "@/components/layout/Header";
import { BlogSection } from "@/components/sections/BlogSection";
import { CombinedSectionsGroup } from "@/components/sections/CombinedSectionsGroup";
import { ContactSection } from "@/components/sections/ContactSection";
import { EngagementModelsSection } from "@/components/sections/EngagementModelsSection";
import { ExpertiseSection } from "@/components/sections/ExpertiseSection";
import { HeroSection } from "@/components/sections/HeroSection";
import { MissionSection } from "@/components/sections/MissionSection";
import { SecuritySection } from "@/components/sections/SecuritySection";
import { SecurityWhyGroup } from "@/components/sections/SecurityWhyGroup";
import { WhySection } from "@/components/sections/WhySection";
import { WorkstepSection } from "@/components/sections/WorkstepSection";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  alternates: { canonical: "/" },
});

export default function Home() {
  return (
    <>
      <Header />
      <main className="bg-surface-page">
        <HeroSection />
        <MissionSection />
        <CombinedSectionsGroup>
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
