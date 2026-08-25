import Image from "next/image";

import { FixedSectionBackground } from "@/components/ui/fixed-section-background";

type CombinedSectionsGroupProps = {
  children: React.ReactNode;
};

export function CombinedSectionsGroup({ children }: CombinedSectionsGroupProps) {
  return (
    <FixedSectionBackground
      background={
        <div className="relative mx-auto w-full max-w-[1920px]">
          <div className="absolute inset-x-0 top-0 mx-auto h-[1744px] w-full max-w-[1920px]">
            <div className="absolute inset-[-120.93%_-53.75%_-34.63%_-76.25%]">
              <Image
                src="/images/homepage/combined-sections-bg.svg"
                alt=""
                width={4416}
                height={4457}
                className="block size-full max-w-none"
                sizes="100vw"
                unoptimized
              />
            </div>
          </div>
        </div>
      }
    >
      {children}
    </FixedSectionBackground>
  );
}
