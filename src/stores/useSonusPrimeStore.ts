import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { toast } from 'sonner';
import { mockAnalyze, mockCreateMix, mockUpload } from '@/lib/analyzer';
export type AppStep = 'upload' | 'analysis' | 'download';
export interface Stem {
  id: string;
  name: string;
  version: 'A' | 'B';
  score: number | null;
}
export interface StemPair {
  name: string;
  stems: {
    A: Stem;
    B: Stem;
  };
  selectedVersion: 'A' | 'B';
}
interface SonusPrimeState {
  step: AppStep;
  files: { A: File | null; B: File | null };
  stemLists: { A: string[]; B: string[] };
  stemPairs: Record<string, StemPair>;
  isUploading: 'A' | 'B' | null;
  isAnalyzing: boolean;
  isProcessing: boolean;
  setFile: (version: 'A' | 'B', file: File) => void;
  startAnalysis: () => Promise<void>;
  selectStem: (pairName: string, version: 'A' | 'B') => void;
  startProcessing: () => Promise<void>;
  reset: () => void;
}
const initialState = {
  step: 'upload' as AppStep,
  files: { A: null, B: null },
  stemLists: { A: [], B: [] },
  stemPairs: {},
  isUploading: null,
  isAnalyzing: false,
  isProcessing: false,
};
export const useSonusPrimeStore = create<SonusPrimeState>()(
  immer((set, get) => {
    const actions = {
      setFile: async (version: 'A' | 'B', file: File) => {
        set({ isUploading: version });
        try {
          const result = await mockUpload(file);
          if (!result.success) throw new Error(result.error || 'Failed to process file.');
          set(state => {
            state.files[version] = file;
            state.stemLists[version] = result.data.stems;
          });
          toast.success(`Version ${version} uploaded successfully!`);
        } catch (error) {
          console.error(error);
          toast.error(`Version ${version} upload failed. Please try again.`);
        } finally {
          set({ isUploading: null });
        }
      },
      startAnalysis: async () => {
        const { stemLists } = get();
        if (!stemLists.A.length || !stemLists.B.length) return;
        set({ isAnalyzing: true, step: 'analysis' });
        try {
          const result = await mockAnalyze(stemLists.A, stemLists.B);
          if (!result.success) throw new Error(result.error || 'Analysis failed.');
          const analysisResults = result.data;
          if (!analysisResults || analysisResults.length === 0) {
            toast.error("No common stems found between the two ZIP files.");
            set({ step: 'upload' });
            return;
          }
          const newStemPairs: Record<string, StemPair> = {};
          analysisResults.forEach((res: any) => {
            newStemPairs[res.name] = {
              name: res.name,
              stems: {
                A: { id: `${res.name}-A`, name: res.name, version: 'A', score: res.scores.A },
                B: { id: `${res.name}-B`, name: res.name, version: 'B', score: res.scores.B },
              },
              selectedVersion: res.scores.A >= res.scores.B ? 'A' : 'B',
            };
          });
          set({ stemPairs: newStemPairs });
        } catch (error) {
          console.error(error);
          toast.error('An error occurred during analysis.');
          set({ step: 'upload' }); // Revert to upload step on error
        } finally {
          set({ isAnalyzing: false });
        }
      },
      selectStem: (pairName: string, version: 'A' | 'B') => {
        set((state) => {
          const pair = state.stemPairs[pairName];
          if (pair) {
            pair.selectedVersion = version;
          }
        });
      },
      startProcessing: async () => {
        const { files, stemPairs } = get();
        if (!files.A || !files.B) return;
        set({ isProcessing: true, step: 'download' });
        try {
          const selections = Object.values(stemPairs).map(p => ({
            name: p.name,
            selectedVersion: p.selectedVersion,
          }));
          const blob = await mockCreateMix(files.A, files.B, selections);
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'SonusPrime_Mix.zip';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          toast.success("Your mix has been downloaded!");
        } catch (error) {
          console.error(error);
          toast.error('An error occurred while creating your mix.');
        } finally {
          set({ isProcessing: false });
        }
      },
      reset: () => {
        set(initialState);
      },
    };
    return { ...initialState, ...actions };
  })
);