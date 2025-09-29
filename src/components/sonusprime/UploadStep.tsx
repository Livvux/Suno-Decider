import React, { useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { UploadCloud, FileCheck2, LoaderCircle } from 'lucide-react';
import { useSonusPrimeStore } from '@/stores/useSonusPrimeStore';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useShallow } from 'zustand/react/shallow';
import { toast } from 'sonner';
const DropZone = ({ id }: { id: 'A' | 'B' }) => {
  const setFile = useSonusPrimeStore(state => state.setFile);
  const { isUploading, file } = useSonusPrimeStore(
    useShallow(state => ({
      isUploading: state.isUploading === id,
      file: state.files[id],
    }))
  );
  const [isHovering, setIsHovering] = React.useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const handleFile = useCallback((selectedFile: File | null) => {
    if (selectedFile) {
      if (selectedFile.type === 'application/zip' || selectedFile.name.endsWith('.zip')) {
        setFile(id, selectedFile);
      } else {
        toast.error('Invalid file type. Please upload a ZIP file.');
      }
    }
  }, [id, setFile]);
  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsHovering(true);
  }, []);
  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsHovering(false);
  }, []);
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsHovering(false);
    if (!file && !isUploading) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, [file, isUploading, handleFile]);
  const handleClick = useCallback(() => {
    if (!file && !isUploading) {
      inputRef.current?.click();
    }
  }, [file, isUploading]);
  return (
    <>
      <input
        type="file"
        ref={inputRef}
        onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
        accept=".zip,application/zip"
        className="hidden"
        disabled={isUploading}
      />
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        className={cn(
          "relative flex flex-col items-center justify-center w-full h-64 sm:h-80 rounded-2xl border-2 border-dashed transition-all duration-300 ease-in-out cursor-pointer group",
          file ? "border-brand-teal bg-teal-500/10" : "border-slate-300 dark:border-slate-700",
          isHovering && !file && !isUploading ? "border-brand-teal bg-teal-500/5 scale-105" : "",
          isUploading ? "border-slate-400 bg-slate-500/10 cursor-wait" : ""
        )}
      >
        <div className="text-center space-y-4 z-10 p-4">
          <motion.div
            animate={{ y: isHovering && !file ? [-4, 4, -4] : 0 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
          >
            {file ? (
              <FileCheck2 className="w-16 h-16 mx-auto text-brand-teal" />
            ) : isUploading ? (
              <LoaderCircle className="w-16 h-16 mx-auto text-slate-500 animate-spin" />
            ) : (
              <UploadCloud className="w-16 h-16 mx-auto text-slate-400 group-hover:text-brand-teal transition-colors" />
            )}
          </motion.div>
          <h3 className="text-2xl font-semibold text-slate-800 dark:text-slate-200">Version {id}</h3>
          <p className="text-muted-foreground break-words">
            {file ? file.name : isUploading ? "Uploading..." : "Drag & drop a ZIP file or click"}
          </p>
        </div>
      </div>
    </>
  );
};
export const UploadStep = () => {
  const { startAnalysis, files, isUploading } = useSonusPrimeStore(
    useShallow(state => ({
      startAnalysis: state.startAnalysis,
      files: state.files,
      isUploading: state.isUploading,
    }))
  );
  const allUploaded = files.A && files.B;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="w-full space-y-16"
    >
      <div className="text-center">
        <h2 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-50">Upload Your Stems</h2>
        <p className="mt-4 text-lg text-muted-foreground">Provide two ZIP files containing the different versions of your song stems.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <DropZone id="A" />
        <DropZone id="B" />
      </div>
      <div className="text-center">
        <Button
          size="lg"
          onClick={startAnalysis}
          disabled={!allUploaded || !!isUploading}
          className="w-full max-w-xs bg-brand-teal text-slate-900 font-bold hover:bg-teal-400 transition-all duration-200 disabled:bg-slate-300 disabled:cursor-not-allowed disabled:text-slate-500"
        >
          {isUploading ? <><LoaderCircle className="w-5 h-5 mr-2 animate-spin" /> Uploading...</> : allUploaded ? 'Analyze Stems' : 'Waiting for Uploads'}
        </Button>
      </div>
    </motion.div>
  );
};