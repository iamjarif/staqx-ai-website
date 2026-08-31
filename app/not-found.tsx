import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "Page not found",
  description: "This page does not exist or has been moved.",
  robots: { index: false, follow: false },
});

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="bg-surface-page flex flex-1 flex-col justify-center py-24">
        <Container className="flex flex-col items-start gap-6">
          <p className="text-code text-text-secondary">404</p>
          <h1 className="text-display-m text-text-primary">Page not found.</h1>
          <p className="text-body-medium text-text-tertiary max-w-[420px]">
            The page you are looking for does not exist or has been moved.
          </p>
          <Button href="/">Back to home</Button>
        </Container>
      </main>
      <Footer />
    </>
  );
}
