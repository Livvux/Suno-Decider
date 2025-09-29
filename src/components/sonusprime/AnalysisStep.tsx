import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Cpu, Music4, Sparkles } from 'lucide-react';
import { useSonusPrimeStore, type StemPair } from '@/stores/useSonusPrimeStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useShallow } from 'zustand/react/shallow';
const StemCard = ({ pair, version, onSelect }: { pair: StemPair; version: 'A' | 'B'; onSelect: () => void }) => {
  const stem = pair.stems[version];
  const isSelected = pair.selectedVersion === version;
  const isBest = (version === 'A' && (stem.score ?? 0) >= (pair.stems.B.score ?? 0)) || (version === 'B' && (stem.score ?? 0) > (pair.stems.A.score ?? 0));
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="w-full"
    >
      <Card
        onClick={onSelect}
        className={cn(
          "cursor-pointer transition-all duration-300 relative overflow-hidden",
          isSelected ? "border-brand-teal ring-2 ring-brand-teal shadow-lg" : "hover:shadow-md hover:border-slate-300 dark:hover:border-slate-600"
        )}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-medium">Version {version}</CardTitle>
          {isSelected && (
            <Badge variant="outline" className="bg-brand-teal text-slate-900 border-brand-teal font-semibold">
              <CheckCircle className="w-4 h-4 mr-1.5" />
              Selected
            </Badge>
          )}
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold text-brand-teal">{stem.score}</div>
          <p className="text-xs text-muted-foreground">AI Quality Score</p>
          {isBest && !isSelected && (
            <Badge variant="secondary" className="absolute top-2 right-2 text-xs">
              <Sparkles className="w-3 h-3 mr-1 text-amber-400" />
              AI Pick
            </Badge>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};
const StemPairRow = ({ pair }: { pair: StemPair }) => {
  const selectStem = useSonusPrimeStore(state => state.selectStem);
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="flex flex-col items-center space-y-4"
    >
      <div className="flex items-center gap-3">
        <Music4 className="w-6 h-6 text-slate-500" />
        <h3 className="text-2xl font-semibold text-slate-800 dark:text-slate-200">{pair.name}</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl">
        <StemCard pair={pair} version="A" onSelect={() => selectStem(pair.name, 'A')} />
        <StemCard pair={pair} version="B" onSelect={() => selectStem(pair.name, 'B')} />
      </div>
    </motion.div>
  );
};
const AnalysisSkeleton = () => (
  <div className="w-full space-y-12">
    {[...Array(4)].map((_, i) => (
      <div key={i} className="flex flex-col items-center space-y-4">
        <Skeleton className="h-8 w-40 rounded-md" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl">
          <Skeleton className="h-32 w-full rounded-xl" />
          <Skeleton className="h-32 w-full rounded-xl" />
        </div>
      </div>
    ))}
  </div>
);
export const AnalysisStep = () => {
  const { isAnalyzing, stemPairs } = useSonusPrimeStore(
    useShallow(state => ({
      isAnalyzing: state.isAnalyzing,
      stemPairs: state.stemPairs,
    }))
  );
  const startProcessing = useSonusPrimeStore(state => state.startProcessing);
  const stemPairList = Object.values(stemPairs);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full space-y-16"
    >
      <div className="text-center">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="inline-block p-4 bg-teal-100 dark:bg-teal-900/50 rounded-full mb-4"
        >
          <Cpu className="w-10 h-10 text-brand-teal" />
        </motion.div>
        <h2 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
          {isAnalyzing ? 'Analyzing Stems...' : 'Analysis Complete'}
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          {isAnalyzing
            ? 'Our AI is listening to each stem to determine the best performance.'
            : 'Review the AI selections and make any changes.'}
        </p>
      </div>
      <div className="space-y-12">
        <AnimatePresence mode="wait">
          {isAnalyzing || stemPairList.length === 0 ? (
            <motion.div key="skeleton">
              <AnalysisSkeleton />
            </motion.div>
          ) : (
            <motion.div key="results" className="space-y-12">
              {stemPairList.map(pair => (
                <StemPairRow key={pair.name} pair={pair} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="text-center">
        <Button
          size="lg"
          onClick={startProcessing}
          disabled={isAnalyzing || stemPairList.length === 0}
          className="w-full max-w-xs bg-brand-teal text-slate-900 font-bold hover:bg-teal-400 transition-all duration-200 disabled:bg-slate-300 disabled:cursor-not-allowed disabled:text-slate-500"
        >
          Create & Download Mix
        </Button>
      </div>
    </motion.div>
  );
};