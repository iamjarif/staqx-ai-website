import { JsonLd } from "@/components/seo/json-ld";
import { createMetadata } from "@/lib/metadata";
import { organizationSchema, websiteSchema } from "@/lib/schema";
import { dmSans } from "@/lib/fonts";
import { LenisProvider } from "@/components/providers/LenisProvider";

import "./globals.css";
import "lenis/dist/lenis.css";

export const metadata = createMetadata();

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${dmSans.variable} h-full`}>
      <head>
        <link rel="preconnect" href="https://cdn.sanity.io" />
        <link rel="dns-prefetch" href="https://cdn.sanity.io" />
      </head>
      <body className="flex min-h-full min-w-0 flex-col antialiased">
        <JsonLd data={[organizationSchema(), websiteSchema()]} />
        <LenisProvider>{children}</LenisProvider>
      </body>
    </html>
  );
}
