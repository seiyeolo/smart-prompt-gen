import React from 'react';
import { Card, CardContent } from "./ui/Card";
import { Settings } from 'lucide-react';

const SettingsPanel = ({
  showSettings,
  setShowSettings,
  userName,
  setUserName,
  vaultName,
  setVaultName,
  apiKey,
  setApiKey,
  saveApiKey,
  setSaveApiKey
}) => {
  if (!showSettings) {
    return (
      <div className="flex justify-end">
         <button 
           onClick={() => setShowSettings(true)}
           className="text-xs text-gray-500 hover:text-primary-400 flex items-center gap-1 transition-colors"
         >
           설정 열기
           <Settings className="w-3 h-3" />
         </button>
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-end">
         <button 
           onClick={() => setShowSettings(false)}
           className="text-xs text-gray-500 hover:text-primary-400 flex items-center gap-1 transition-colors"
         >
           설정 닫기
           <Settings className="w-3 h-3" />
         </button>
      </div>
      <Card className="border-gray-800 bg-dark-bg/50 mb-4 animate-in fade-in slide-in-from-top-2">
         <CardContent className="p-4 flex flex-col gap-4">
           <div className="flex gap-4">
             <div className="flex-1">
               <label className="block text-xs text-gray-400 mb-1">사용자 이름 / 스튜디오명</label>
               <input 
                 type="text" 
                 value={userName}
                 onChange={(e) => setUserName(e.target.value)}
                 className="w-full bg-dark-surface border border-gray-700 rounded px-3 py-1.5 text-sm text-gray-200 focus:border-primary-500 outline-none"
                 placeholder="예: 홍길동의 AI 파트너"
               />
             </div>
             <div className="flex-1">
               <label className="block text-xs text-gray-400 mb-1">Obsidian Vault Name</label>
               <input 
                 type="text" 
                 value={vaultName}
                 onChange={(e) => setVaultName(e.target.value)}
                 className="w-full bg-dark-surface border border-gray-700 rounded px-3 py-1.5 text-sm text-gray-200 focus:border-primary-500 outline-none"
                 placeholder="예: My Vault"
               />
             </div>
           </div>

           <div>
             <label className="block text-xs text-gray-400 mb-1 flex items-center gap-2">
               <span>Gemini API Key</span>
               <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-primary-400 hover:text-primary-300 underline text-[10px]">
                 (키 발급받기 ↗)
               </a>
             </label>
             <input 
               type="password" 
               value={apiKey}
               onChange={(e) => setApiKey(e.target.value)}
               className="w-full bg-dark-surface border border-gray-700 rounded px-3 py-1.5 text-sm text-gray-200 focus:border-primary-500 outline-none font-mono mb-2"
               placeholder="이곳에 Gemini API Key를 붙여넣으세요"
             />
             
             <div className="flex items-center gap-2 mb-1">
               <input 
                 type="checkbox" 
                 id="saveApiKey"
                 checked={saveApiKey}
                 onChange={(e) => setSaveApiKey(e.target.checked)}
                 className="rounded border-gray-700 bg-dark-surface text-primary-500 focus:ring-primary-500/50"
               />
               <label htmlFor="saveApiKey" className="text-xs text-gray-400 cursor-pointer select-none">
                 API 키를 이 기기에 저장 (브라우저를 닫아도 유지됨)
               </label>
             </div>

             <p className="text-[10px] text-gray-500">
               {saveApiKey 
                 ? "✅ API 키가 로컬 스토리지에 암호화되지 않은 상태로 저장됩니다. 공용 컴퓨터에서는 사용하지 마세요."
                 : "🔒 보안 모드: API 키는 브라우저 종료 시 삭제됩니다."}
             </p>
           </div>

           <div className="text-xs text-gray-500 pt-2 border-t border-gray-800">
             * 옵시디언 앱이 설치되어 있어야 'Obsidian 저장' 기능을 사용할 수 있습니다.
           </div>
         </CardContent>
      </Card>
    </>
  );
};

export default SettingsPanel;
