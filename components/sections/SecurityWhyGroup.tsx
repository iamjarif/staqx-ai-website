import Image from "next/image";

import { FixedSectionBackground } from "@/components/ui/fixed-section-background";

type SecurityWhyGroupProps = {
  children: React.ReactNode;
};

export function SecurityWhyGroup({ children }: SecurityWhyGroupProps) {
  return (
    <FixedSectionBackground
      className="bg-surface-section"
      background={
        <div className="relative mx-auto w-full max-w-[1920px]">
          <div className="absolute left-[-256px] top-[-1188px] h-[2567px] w-[2566px]">
            <Image
              src="/images/homepage/security-ellipse.svg"
              alt=""
              width={2566}
              height={2567}
              className="block size-full max-w-none"
              sizes="2566px"
              unoptimized
            />
          </div>
        </div>
      }
    >
      {children}
    </FixedSectionBackground>
  );
}
