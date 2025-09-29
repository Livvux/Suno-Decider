import { SonusPrimeApp } from "@/components/sonusprime/SonusPrimeApp";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Toaster } from "@/components/ui/sonner";
export function HomePage() {
  return (
    <>
      <ThemeToggle className="fixed top-4 right-4 sm:top-6 sm:right-6" />
      <main className="min-h-screen flex flex-col items-center justify-center">
        <SonusPrimeApp />
      </main>
      <footer className="text-center py-8 text-sm text-muted-foreground">
        Built with <span role="img" aria-label="love">♥️</span> at Cloudflare
      </footer>
      <Toaster richColors />
    </>
  );
}