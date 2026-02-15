
import React, { useState, useRef } from 'react';
import Icon from './Icon';
import { analyzeFiles } from '../services/geminiService';
import type { Part } from '@google/genai';

interface UploadedFile {
  file: File;
  id: string;
  progress: number;
}

const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve((reader.result as string).split(',')[1]);
        reader.onerror = error => reject(error);
    });
};

const fileToText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsText(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
    });
};

interface UploadNotesPageProps {
    onAnalysisComplete: (analysisText: string, fileNames: string[]) => void;
}

const UploadNotesPage: React.FC<UploadNotesPageProps> = ({ onAnalysisComplete }) => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (selectedFiles: FileList) => {
    const newFiles = Array.from(selectedFiles).map(file => ({
      file,
      id: `${file.name}-${file.lastModified}`,
      progress: 0,
    }));

    setFiles(prev => [...prev, ...newFiles]);

    // Simulate upload progress
    newFiles.forEach(newFile => {
      const interval = setInterval(() => {
        setFiles(currentFiles =>
          currentFiles.map(f => {
            if (f.id === newFile.id && f.progress < 100) {
              return { ...f, progress: f.progress + 10 };
            }
            return f;
          })
        );
      }, 100);

      setTimeout(() => {
        clearInterval(interval);
        setFiles(currentFiles =>
            currentFiles.map(f => f.id === newFile.id ? { ...f, progress: 100 } : f)
        );
      }, 1100);
    });
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); e.stopPropagation(); setIsDragging(true);
  };
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); e.stopPropagation(); setIsDragging(false);
  };
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); e.stopPropagation();
  };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
      e.dataTransfer.clearData();
    }
  };

  const onBrowseClick = () => { fileInputRef.current?.click(); };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if(e.target.files) { handleFiles(e.target.files); }
  };

  const removeFile = (id: string) => {
    setFiles(files.filter(f => f.id !== id));
  };
  
  const handleAnalyze = async () => {
      if (files.length === 0 || isAnalyzing) return;
      setIsAnalyzing(true);
      
      const filePartsPromises: Promise<Part | null>[] = files.map(async (uploadedFile) => {
        const file = uploadedFile.file;
        if (file.type.startsWith('image/')) {
            const data = await fileToBase64(file);
            return { inlineData: { mimeType: file.type, data } };
        } else if (file.type === 'text/plain') {
            try {
                const text = await fileToText(file);
                return { text: `\n\n--- File Content: ${file.name} ---\n${text}` };
            } catch (e) {
                 console.warn(`Could not read file ${file.name} as text.`);
                 return null;
            }
        }
        console.warn(`Unsupported file type: ${file.type}. Skipping ${file.name}.`);
        return null;
    });

    try {
        const fileParts = (await Promise.all(filePartsPromises)).filter(Boolean) as Part[];

        if (fileParts.length > 0) {
            const analysisResult = await analyzeFiles(fileParts);
            onAnalysisComplete(analysisResult, files.map(f => f.file.name));
            setFiles([]);
        } else {
             alert("No supported files to analyze. Please upload .txt or image files.");
        }
    } catch (error) {
        console.error("Analysis failed:", error);
        alert("An error occurred during analysis. Please try again.");
    } finally {
        setIsAnalyzing(false);
    }
  }

  return (
    <div className="glass-card rounded-2xl p-6 flex flex-col h-full">
      <h2 className="text-xl font-semibold mb-2 text-white">Upload Your Notes</h2>
      <p className="text-sm text-gray-400 mb-6">Get summaries, key concepts, and practice questions from your course materials.</p>
      
      <div 
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors duration-300 ${isDragging ? 'border-purple-500 bg-purple-500/10' : 'border-white/20 hover:border-purple-400'}`}
        onDragEnter={handleDragEnter} onDragLeave={handleDragLeave} onDragOver={handleDragOver} onDrop={handleDrop} onClick={onBrowseClick}
      >
        <input 
            ref={fileInputRef} type="file" multiple className="hidden" onChange={handleFileChange}
            accept=".pdf,.docx,.txt,.png,.jpg,.jpeg"
        />
        <div className="flex flex-col items-center justify-center text-gray-400">
            <Icon name="upload" className="w-12 h-12 mb-4 text-gray-500" />
            <p className="font-semibold text-gray-300">Drag & Drop your files here</p>
            <p className="text-sm">or <span className="text-purple-400 font-medium">click to browse</span></p>
            <p className="text-xs mt-4 text-gray-500">Supported formats: PDF, DOCX, TXT, PNG, JPG</p>
        </div>
      </div>
      
      {files.length > 0 && (
        <div className="mt-6 space-y-3 flex-grow overflow-y-auto">
            <h3 className="font-semibold text-gray-300">Uploaded Files</h3>
            {files.map(({ file, id, progress }) => (
                <div key={id} className="bg-black/20 p-3 rounded-lg flex items-center gap-4">
                    <Icon name="document" className="w-6 h-6 text-cyan-400 flex-shrink-0" />
                    <div className="flex-grow">
                        <div className="flex justify-between items-center">
                            <p className="text-sm text-white truncate pr-4">{file.name}</p>
                            <p className="text-xs text-gray-400 flex-shrink-0">{formatBytes(file.size)}</p>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                            <div className="w-full bg-black/30 rounded-full h-1.5">
                                <div className="bg-gradient-to-r from-purple-500 to-cyan-400 h-1.5 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
                            </div>
                            <span className="text-xs font-mono text-gray-300">{progress}%</span>
                        </div>
                    </div>
                    <button onClick={() => removeFile(id)} className="text-gray-500 hover:text-white transition-colors">
                        <Icon name="x-circle" className="w-6 h-6" />
                    </button>
                </div>
            ))}
        </div>
      )}

      <div className="mt-auto pt-6">
        <button 
          onClick={handleAnalyze}
          disabled={files.length === 0 || isAnalyzing}
          className="w-full bg-gradient-to-br from-purple-600 to-cyan-500 text-white font-semibold py-3 rounded-lg transition-all duration-300 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isAnalyzing ? 'Analyzing...' : 'Analyze Notes & Generate Insights'}
        </button>
      </div>
    </div>
  );
};

export default UploadNotesPage;
