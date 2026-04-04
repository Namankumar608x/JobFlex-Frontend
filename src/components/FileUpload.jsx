import { useState, useRef } from "react";
import { Upload, FileText, X } from "lucide-react";

/**
 * FileUpload
 * Props:
 *  - onFileSelect: (file: File) => void
 *  - accept: string  (e.g. ".pdf,.doc,.docx")
 *  - label: string
 */
export default function FileUpload({ onFileSelect, accept = ".pdf,.doc,.docx", label = "Upload File" }) {
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef(null);

  const handleFile = (f) => {
    if (!f) return;
    setFile(f);
    onFileSelect?.(f);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files?.[0];
    if (f) handleFile(f);
  };

  const handleClear = () => {
    setFile(null);
    onFileSelect?.(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div>
      {!file ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl px-6 py-10 flex flex-col items-center justify-center cursor-pointer transition-all
            ${dragging
              ? "border-zinc-900 bg-zinc-50"
              : "border-zinc-200 bg-zinc-50/50 hover:border-zinc-400 hover:bg-zinc-50"
            }`}
        >
          <div className="w-12 h-12 rounded-2xl bg-white border border-zinc-200 flex items-center justify-center mb-3 shadow-sm">
            <Upload size={20} className="text-zinc-400" />
          </div>
          <p className="text-sm font-semibold text-zinc-700 mb-1">{label}</p>
          <p className="text-xs text-zinc-400 font-light">Drag & drop or click to browse</p>
          <p className="text-[10px] text-zinc-300 mt-2 uppercase tracking-widest font-medium">PDF · DOC · DOCX</p>
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
        </div>
      ) : (
        <div className="flex items-center gap-4 bg-white border border-zinc-200 rounded-2xl px-5 py-4">
          <div className="w-10 h-10 rounded-xl bg-zinc-100 flex items-center justify-center flex-shrink-0">
            <FileText size={18} className="text-zinc-500" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-zinc-900 truncate">{file.name}</p>
            <p className="text-xs text-zinc-400 font-light mt-0.5">
              {(file.size / 1024).toFixed(1)} KB
            </p>
          </div>
          <button
            onClick={handleClear}
            className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-zinc-100 text-zinc-400 hover:text-zinc-700 transition-all"
          >
            <X size={14} />
          </button>
        </div>
      )}
    </div>
  );
}