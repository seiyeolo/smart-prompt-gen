import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/Card";
import { Button } from "./ui/Button";
import { Copy, RefreshCw, Check } from 'lucide-react';

const PromptOutput = ({
  output,
  copied,
  notionCopied,
  handleSaveToObsidian,
  handleOpenNewWindow,
  handleGenerate,
  handleCopy,
  handleCopyToNotion,
}) => {
  if (!output) {
    return null;
  }

  return (
    <>
      <Card className="border-primary-500/20 bg-dark-surface/50 animate-in fade-in run-in duration-500 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-primary-400 text-lg">결과 (Result)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-black/40 p-6 rounded-xl border border-white/5 font-mono text-sm leading-relaxed text-gray-200 whitespace-pre-wrap shadow-inner">
            {output}
          </div>
        </CardContent>
        <CardFooter className="flex flex-wrap justify-end gap-2">
           <Button variant="outline" onClick={handleSaveToObsidian} className="border-gray-600 text-gray-300 hover:text-white hover:border-gray-400">
             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
             Obsidian 저장
           </Button>
           <Button variant="outline" onClick={handleOpenNewWindow} className="border-gray-600 text-gray-300 hover:text-white hover:border-gray-400">
             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><line x1="15" x2="15" y1="3" y2="21"/><line x1="3" x2="21" y1="9" y2="9"/></svg>
             새 창에서 보기
           </Button>
          <Button variant="ghost" onClick={handleGenerate} className="text-gray-400 hover:text-white">
            <RefreshCw className="w-4 h-4 mr-2" />
            다시 생성
          </Button>
          <Button variant="secondary" onClick={handleCopy}>
            {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
            {copied ? '복사됨!' : '프롬프트 복사'}
          </Button>
          <Button variant="ghost" onClick={handleCopyToNotion} className="text-gray-400 hover:text-white border border-gray-700 hover:border-gray-500">
             <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 mr-2"><path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047.28.047.606v14.83c0 .327-.047.887-.606 1.12-1.353.653-3.264 2.192-3.264 2.192-.233.187-.606.094-.746-.14L4.086 5.655c-.28-.56.093-1.073.373-1.447zM6.93 17.553l1.912.653c.187.047.28-.093.28-.186v-9.52c0-.186-.14-.28-.326-.046L7.164 10.36c-.187.233-.234.326-.234.56v6.633zm3.498.98L18.49 14.8c.233-.047.28-.234.28-.374V5.42c0-.14-.14-.14-.233-.046l-7.928 6.995c-.094.093-.187.186-.187.327v5.696c0 .14.047.186.047.14z"/></svg>
             Notion 복사
          </Button>
        </CardFooter>
      </Card>

      {notionCopied && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-white text-black px-4 py-2 rounded-full text-sm font-bold shadow-2xl animate-in fade-in slide-in-from-bottom-2 z-50 flex items-center gap-2">
           <Check className="w-4 h-4 text-green-600" />
           Notion용 서식이 복사되었습니다! (Ctrl+V)
        </div>
      )}
    </>
  );
};

export default PromptOutput;
