import React from 'react';
import { cn } from '../lib/utils';
import { ImageIcon } from 'lucide-react';

const PromptInput = ({
  input,
  setInput,
  isDragging,
  handleDragOver,
  handleDragLeave,
  handleDrop,
  handleImageChange,
  previewUrl,
  setSelectedImage,
  setPreviewUrl,
  fileInputRef
}) => {
  return (
    <>
      <textarea
        className="w-full min-h-[100px] p-4 rounded-lg bg-dark-bg border border-gray-700 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all resize-none text-sm"
        placeholder="아이디어를 설명해주세요 (예: 날아다니는 자동차가 있는 미래 도시...)"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <div className="pt-4 border-t border-gray-800">
         <div 
            className={cn(
              "relative border-2 border-dashed rounded-xl p-6 transition-all duration-200 text-center cursor-pointer",
              isDragging 
                ? "border-primary-500 bg-primary-500/10" 
                : "border-gray-700 hover:border-gray-500 hover:bg-dark-surface/50",
              previewUrl ? "border-solid border-gray-600 p-2" : ""
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => !previewUrl && fileInputRef.current?.click()}
         >
            <input 
              type="file" 
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              ref={fileInputRef}
            />
            
            {previewUrl ? (
              <div className="relative group w-full h-48 bg-black/50 rounded-lg overflow-hidden flex items-center justify-center">
                <img src={previewUrl} alt="Preview" className="h-full object-contain" />
                <button 
                  onClick={(e) => { 
                    e.stopPropagation();
                    setSelectedImage(null); 
                    setPreviewUrl(''); 
                  }}
                  className="absolute top-2 right-2 bg-black/80 hover:bg-black text-white rounded-full p-1.5 transition-colors"
                >
                  <span className="sr-only">삭제</span>
                  ✕
                </button>
                <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/70 rounded text-xs text-white">
                  이미지 변경: 클릭 또는 드래그
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 pointer-events-none">
                <div className="p-3 bg-dark-surface rounded-full">
                   <ImageIcon className="w-6 h-6 text-gray-400" />
                </div>
                <p className="text-sm font-medium text-gray-300">
                  이미지를 드래그하거나 클릭하여 업로드
                </p>
                <p className="text-xs text-gray-500">
                  AI가 이미지를 분석하여 프롬프트를 생성합니다
                </p>
              </div>
            )}
         </div>
      </div>
    </>
  );
};

export default PromptInput;
