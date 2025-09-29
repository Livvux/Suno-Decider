import { AnimatePresence } from 'framer-motion';
import { useSonusPrimeStore } from '@/stores/useSonusPrimeStore';
import { UploadStep } from './UploadStep';
import { AnalysisStep } from './AnalysisStep';
import { DownloadStep } from './DownloadStep';
import { Waves } from 'lucide-react';
const stepComponents = {
  upload: <UploadStep />,
  analysis: <AnalysisStep />,
  download: <DownloadStep />,
};
export const SonusPrimeApp = () => {
  const step = useSonusPrimeStore(state => state.step);
  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      <header className="text-center mb-16">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Waves className="w-10 h-10 text-brand-teal" />
          <h1 className="text-5xl font-bold tracking-tighter text-slate-900 dark:text-slate-50">
            SonusPrime
          </h1>
        </div>
        <p className="text-lg text-muted-foreground">AI Stem Weaver</p>
      </header>
      <main className="flex items-center justify-center">
        <AnimatePresence mode="wait">
          <div key={step} className="w-full">
            {stepComponents[step]}
          </div>
        </AnimatePresence>
      </main>
    </div>
  );
};