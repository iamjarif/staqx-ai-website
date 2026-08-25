import { Container } from "@/components/ui/container";
import { SectionHeader } from "@/components/ui/section-header";
import {
  SectionReveal,
  SectionRevealItem,
} from "@/components/ui/section-reveal";
import { engagementModels } from "@/lib/homepage-data";
import { cn } from "@/lib/utils";

export function EngagementModelsSection() {
  return (
    <SectionReveal className="py-12 lg:py-40">
      <Container className="flex flex-col gap-8 md:gap-16">
        <SectionRevealItem>
          <SectionHeader
            split
            className="max-w-none lg:max-w-[263px]"
            eyebrow="ENGAGEMENT MODELS"
            title={
              <>
                Two Ways to{" "}
                <span className="text-text-primary">Work With Us.</span>
              </>
            }
            titleClassName="lg:whitespace-nowrap"
            description="Flexible delivery structures, built around how chip projects actually run."
            descriptionClassName="lg:text-right"
          />
        </SectionRevealItem>

        <div className="grid gap-6 lg:grid-cols-2">
          {engagementModels.map((model) => (
            <SectionRevealItem
              key={model.eyebrow}
              as="article"
              className={cn(
                "flex flex-col gap-6 rounded-lg p-6 sm:gap-8 sm:p-8 lg:p-[42px]",
                model.variant === "section"
                  ? "bg-surface-section"
                  : "bg-transparent"
              )}
            >
              <div className="flex flex-col gap-4">
                <p className="text-code text-primary-500">{model.eyebrow}</p>
                <h3 className="text-heading-h4 text-text-primary">
                  {model.title}
                </h3>
              </div>
              <dl className="flex flex-col">
                {model.rows.map((row, index) => (
                  <div
                    key={row.label}
                    className={cn(
                      "flex flex-col items-start gap-1 pt-4 pb-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4",
                      index < model.rows.length - 1 &&
                        "border-surface-card border-b"
                    )}
                  >
                    <dt className="text-body-medium text-text-secondary">
                      {row.label}
                    </dt>
                    <dd className="text-body-medium text-text-tertiary sm:text-right">
                      {row.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </SectionRevealItem>
          ))}
        </div>
      </Container>
    </SectionReveal>
  );
}
