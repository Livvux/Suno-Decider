import { motion } from 'framer-motion';
import { Check, Download, LoaderCircle, Music4 } from 'lucide-react';
import { useSonusPrimeStore } from '@/stores/useSonusPrimeStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useShallow } from 'zustand/react/shallow';
export const DownloadStep = () => {
  const { isProcessing, stemPairs } = useSonusPrimeStore(
    useShallow(state => ({
      isProcessing: state.isProcessing,
      stemPairs: Object.values(state.stemPairs),
    }))
  );
  const { reset, startProcessing } = useSonusPrimeStore.getState();
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="w-full space-y-12 text-center"
    >
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="inline-block p-4 bg-teal-100 dark:bg-teal-900/50 rounded-full mb-4"
      >
        {isProcessing ? (
          <LoaderCircle className="w-10 h-10 text-brand-teal animate-spin" />
        ) : (
          <Check className="w-10 h-10 text-brand-teal" />
        )}
      </motion.div>
      <h2 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
        {isProcessing ? 'Weaving Your Perfect Mix...' : 'Your Mix is Ready!'}
      </h2>
      <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
        {isProcessing
          ? 'The selected stems are being compiled into a new ZIP archive.'
          : 'Your definitive master mix, compiled from the best of both versions, is ready for download.'}
      </p>
      <Card className="max-w-md mx-auto text-left">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Selected Stems:</h3>
          <ul className="space-y-2">
            {stemPairs.map(pair => (
              <li key={pair.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Music4 className="w-4 h-4 text-slate-500" />
                  <span>{pair.name}</span>
                </div>
                <span className="font-mono px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-brand-teal font-bold">
                  Version {pair.selectedVersion}
                </span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Button
          size="lg"
          onClick={startProcessing}
          disabled={isProcessing}
          className="w-full sm:w-auto bg-brand-teal text-slate-900 font-bold hover:bg-teal-400 transition-all duration-200 disabled:bg-slate-300 disabled:cursor-not-allowed disabled:text-slate-500"
        >
          {isProcessing ? (
            <LoaderCircle className="w-5 h-5 mr-2 animate-spin" />
          ) : (
            <Download className="w-5 h-5 mr-2" />
          )}
          {isProcessing ? 'Processing...' : 'Download Mix'}
        </Button>
        <Button
          size="lg"
          variant="outline"
          onClick={reset}
          disabled={isProcessing}
          className="w-full sm:w-auto"
        >
          Start New Project
        </Button>
      </div>
    </motion.div>
  );
};