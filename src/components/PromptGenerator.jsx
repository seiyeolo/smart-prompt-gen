import React, { useReducer, useEffect, useRef } from 'react';
import PromptInput from './PromptInput';
import PromptOptions from './PromptOptions';
import PromptOutput from './PromptOutput';
import SettingsPanel from './SettingsPanel';
import PromptHistory from './PromptHistory';
import PresetTemplates from './PresetTemplates';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/Card";
import { Button } from "./ui/Button";
import { Wand2, Zap } from 'lucide-react';
import { generateContent } from '../lib/gemini';
import { buildPrompt } from '../lib/promptBuilder';

// 히스토리 관련 유틸리티 함수
const HISTORY_KEY = 'prompt_history';
const MAX_HISTORY = 50;

const loadHistory = () => {
  try {
    const saved = localStorage.getItem(HISTORY_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const saveHistory = (history) => {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, MAX_HISTORY)));
  } catch (e) {
    console.error('Failed to save history:', e);
  }
};

const initialState = {
  input: '',
  output: '',
  isLoading: false,
  modelMode: 'flash-preview',
  copied: false,
  error: null,
  aspectRatio: null,
  selectedSubjects: [],
  selectedMoods: [],
  selectedImage: null,
  previewUrl: '',
  selectedFormats: [],
  selectedArtStyles: [],
  selectedExpressions: [],
  selectedUsages: [],
  selectedAngles: [],
  vaultName: localStorage.getItem('obsidian_vault_name') || 'My Vault',
  userName: localStorage.getItem('user_name') || '',
  apiKey: localStorage.getItem('user_api_key') || sessionStorage.getItem('user_api_key') || '',
  saveApiKey: !!localStorage.getItem('user_api_key'),
  showSettings: false,
  notionCopied: false,
  isDragging: false,
  history: loadHistory(),
};


function reducer(state, action) {
  switch (action.type) {
    case 'SET_FIELD':
      return { ...state, [action.field]: action.value };
    case 'SET_MULTI_SELECT': {
      const { field, value } = action;
      const currentSelection = state[field];
      const newSelection = currentSelection.includes(value)
        ? currentSelection.filter(item => item !== value)
        : [...currentSelection, value];
      return { ...state, [field]: newSelection };
    }
    case 'START_GENERATION':
      return { ...state, isLoading: true, output: '', error: null };
    case 'GENERATION_SUCCESS': {
      // 히스토리에 추가
      const newHistoryItem = {
        id: Date.now(),
        timestamp: Date.now(),
        input: state.input,
        output: action.output,
        model: state.modelMode,
        options: {
          aspectRatio: state.aspectRatio,
          subjects: state.selectedSubjects,
          moods: state.selectedMoods,
          formats: state.selectedFormats,
          artStyles: state.selectedArtStyles,
          expressions: state.selectedExpressions,
          usages: state.selectedUsages,
          angles: state.selectedAngles,
        }
      };
      const newHistory = [newHistoryItem, ...state.history].slice(0, MAX_HISTORY);
      saveHistory(newHistory);
      return { ...state, isLoading: false, output: action.output, history: newHistory };
    }
    case 'GENERATION_ERROR':
      return { ...state, isLoading: false, error: action.error };
    case 'SET_IMAGE':
      return { ...state, selectedImage: action.file, previewUrl: action.url };
    case 'DELETE_HISTORY': {
      const newHistory = state.history.filter(item => item.id !== action.id);
      saveHistory(newHistory);
      return { ...state, history: newHistory };
    }
    case 'CLEAR_HISTORY':
      saveHistory([]);
      return { ...state, history: [] };
    case 'LOAD_FROM_HISTORY':
      return {
        ...state,
        input: action.item.input || '',
        output: action.item.output,
        aspectRatio: action.item.options?.aspectRatio || null,
        selectedSubjects: action.item.options?.subjects || [],
        selectedMoods: action.item.options?.moods || [],
        selectedFormats: action.item.options?.formats || [],
        selectedArtStyles: action.item.options?.artStyles || [],
        selectedExpressions: action.item.options?.expressions || [],
        selectedUsages: action.item.options?.usages || [],
        selectedAngles: action.item.options?.angles || [],
      };
    case 'APPLY_PRESET':
      return {
        ...state,
        aspectRatio: action.options.aspectRatio || null,
        selectedSubjects: action.options.selectedSubjects || [],
        selectedMoods: action.options.selectedMoods || [],
        selectedFormats: action.options.selectedFormats || [],
        selectedArtStyles: action.options.selectedArtStyles || [],
        selectedExpressions: action.options.selectedExpressions || [],
        selectedUsages: action.options.selectedUsages || [],
        selectedAngles: action.options.selectedAngles || [],
      };
    default:
      return state;
  }
}


const PromptGenerator = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const {
    input, output, isLoading, modelMode, copied, error, aspectRatio,
    selectedSubjects, selectedMoods, selectedImage, previewUrl,
    selectedFormats, selectedArtStyles, selectedExpressions, selectedUsages, selectedAngles,
    vaultName, userName, apiKey, saveApiKey, showSettings, notionCopied, isDragging, history
  } = state;

  const fileInputRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('obsidian_vault_name', vaultName);
    localStorage.setItem('user_name', userName);
    
    if (saveApiKey) {
      if (apiKey) {
        localStorage.setItem('user_api_key', apiKey);
        sessionStorage.setItem('user_api_key', apiKey);
      }
    } else {
      localStorage.removeItem('user_api_key');
      if (apiKey) {
        sessionStorage.setItem('user_api_key', apiKey);
      }
    }
  }, [vaultName, userName, apiKey, saveApiKey]);

  const handleGenerate = async () => {
    dispatch({ type: 'START_GENERATION' });
    try {
      const prompt = buildPrompt({
        input, aspectRatio, selectedSubjects, selectedFormats,
        selectedArtStyles, selectedExpressions, selectedUsages,
        selectedMoods, selectedImage, selectedAngles
      });

      const result = await generateContent(prompt, { 
        image: selectedImage, 
        model: modelMode,
        apiKey: apiKey
      });
      dispatch({ type: 'GENERATION_SUCCESS', output: result });
    } catch (error) {
      console.error("Error generating prompt:", error);
      dispatch({ type: 'GENERATION_ERROR', error: error.message || "프롬프트 생성 중 오류가 발생했습니다." });
    }
  };
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      dispatch({ type: 'SET_IMAGE', file, url: URL.createObjectURL(file) });
    }
  };
  
  const handleDragOver = (e) => {
    e.preventDefault();
    dispatch({ type: 'SET_FIELD', field: 'isDragging', value: true });
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    dispatch({ type: 'SET_FIELD', field: 'isDragging', value: false });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    dispatch({ type: 'SET_FIELD', field: 'isDragging', value: false });
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      dispatch({ type: 'SET_IMAGE', file, url: URL.createObjectURL(file) });
    }
  };

  // 히스토리 핸들러
  const handleHistorySelect = (item) => {
    dispatch({ type: 'LOAD_FROM_HISTORY', item });
  };

  const handleHistoryDelete = (id) => {
    dispatch({ type: 'DELETE_HISTORY', id });
  };

  const handleHistoryClear = () => {
    dispatch({ type: 'CLEAR_HISTORY' });
  };

  // 프리셋 핸들러
  const handleApplyPreset = (options) => {
    dispatch({ type: 'APPLY_PRESET', options });
  };

  const handleSaveToObsidian = () => {
    if (!output) return;
    const date = new Date().toISOString().split('T')[0];
    const fileName = `${date}_Prompt`;
    const fileContent = `---
created: ${new Date().toISOString()}
tags: [ai-prompt, generator]
---
# AI Prompt Generated

**Input:** ${input}

**Prompt:**
\`\`\`
${output}
\`\`\`
`;
    const encodedVault = encodeURIComponent(vaultName);
    const encodedFile = encodeURIComponent(fileName);
    const encodedContent = encodeURIComponent(fileContent);
    const obsidianUri = `obsidian://new?vault=${encodedVault}&name=${encodedFile}&content=${encodedContent}`;
    window.location.href = obsidianUri;
  };

  const handleOpenNewWindow = () => {
    if (!output) return;
    const newWindow = window.open('', '_blank', 'width=800,height=600');
    if (newWindow) {
      newWindow.document.title = 'Generated Prompt';
      const container = newWindow.document.createElement('pre');
      container.style.whiteSpace = 'pre-wrap';
      container.style.wordBreak = 'break-word';
      container.style.padding = '20px';
      container.style.fontFamily = 'monospace';
      container.textContent = output;
      newWindow.document.body.appendChild(container);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    dispatch({ type: 'SET_FIELD', field: 'copied', value: true });
    setTimeout(() => dispatch({ type: 'SET_FIELD', field: 'copied', value: false }), 2000);
  };

  const handleCopyToNotion = () => {
    if (!output) return;
    const date = new Date().toISOString().split('T')[0];
    const notionText = `# 🤖 AI Prompt - ${date}\n\n**Input Idea:**\n${input}\n\n**Generated Prompt:**\n\`\`\`\n${output}\n\`\`\`\n\n#AI #PromptGenerator`;
    navigator.clipboard.writeText(notionText);
    dispatch({ type: 'SET_FIELD', field: 'notionCopied', value: true });
    setTimeout(() => dispatch({ type: 'SET_FIELD', field: 'notionCopied', value: false }), 3000);
  };


  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <SettingsPanel
        showSettings={showSettings}
        setShowSettings={(value) => dispatch({ type: 'SET_FIELD', field: 'showSettings', value })}
        userName={userName}
        setUserName={(value) => dispatch({ type: 'SET_FIELD', field: 'userName', value })}
        vaultName={vaultName}
        setVaultName={(value) => dispatch({ type: 'SET_FIELD', field: 'vaultName', value })}
        apiKey={apiKey}
        setApiKey={(value) => dispatch({ type: 'SET_FIELD', field: 'apiKey', value })}
        saveApiKey={saveApiKey}
        setSaveApiKey={(value) => dispatch({ type: 'SET_FIELD', field: 'saveApiKey', value })}
      />

      <Card className="border-primary-500/20 shadow-primary-500/5 overflow-hidden">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary-400" />
              {userName ? `${userName}` : '스마트 프롬프트 빌더'}
            </CardTitle>
            <select 
              className="w-full sm:w-auto px-3 py-1 rounded-md bg-dark-bg border border-gray-700 text-xs text-gray-400 focus:ring-1 focus:ring-primary-500 outline-none"
              value={modelMode}
              onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'modelMode', value: e.target.value })}
            >
              <option value="flash-preview">Gemini 3.0 Flash (Recommended)</option>
              <option value="pro-preview">Gemini 3.0 Pro (High Intelligence)</option>
              <option value="flash-2.5">Gemini 2.5 Flash (Legacy)</option>
              <option value="pro-2.5">Gemini 2.5 Pro (Legacy)</option>
            </select>
          </div>
          <CardDescription>
            원하는 옵션을 선택하여 완벽한 프롬프트를 생성하세요.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <PromptInput
            input={input}
            setInput={(value) => dispatch({ type: 'SET_FIELD', field: 'input', value })}
            isDragging={isDragging}
            handleDragOver={handleDragOver}
            handleDragLeave={handleDragLeave}
            handleDrop={handleDrop}
            handleImageChange={handleImageChange}
            previewUrl={previewUrl}
            setSelectedImage={(file) => dispatch({ type: 'SET_IMAGE', file, url: file ? URL.createObjectURL(file) : '' })}
            setPreviewUrl={(url) => dispatch({ type: 'SET_FIELD', field: 'previewUrl', value: url })}
            fileInputRef={fileInputRef}
          />
          
          {/* 프리셋 템플릿 */}
          <PresetTemplates
            onApplyPreset={handleApplyPreset}
            currentOptions={{
              aspectRatio,
              selectedSubjects,
              selectedMoods,
              selectedFormats,
              selectedArtStyles,
              selectedExpressions,
              selectedUsages,
              selectedAngles,
            }}
          />
          
          <PromptOptions
            aspectRatio={aspectRatio}
            setAspectRatio={(value) => dispatch({ type: 'SET_FIELD', field: 'aspectRatio', value })}
            selectedSubjects={selectedSubjects}
            setSelectedSubjects={(value) => dispatch({ type: 'SET_FIELD', field: 'selectedSubjects', value })}
            selectedMoods={selectedMoods}
            setSelectedMoods={(value) => dispatch({ type: 'SET_FIELD', field: 'selectedMoods', value })}
            selectedFormats={selectedFormats}
            setSelectedFormats={(value) => dispatch({ type: 'SET_FIELD', field: 'selectedFormats', value })}
            selectedArtStyles={selectedArtStyles}
            setSelectedArtStyles={(value) => dispatch({ type: 'SET_FIELD', field: 'selectedArtStyles', value })}
            selectedExpressions={selectedExpressions}
            setSelectedExpressions={(value) => dispatch({ type: 'SET_FIELD', field: 'selectedExpressions', value })}
            selectedUsages={selectedUsages}
            setSelectedUsages={(value) => dispatch({ type: 'SET_FIELD', field: 'selectedUsages', value })}
            selectedAngles={selectedAngles}
            setSelectedAngles={(value) => dispatch({ type: 'SET_FIELD', field: 'selectedAngles', value })}
          />
        </CardContent>
        <CardFooter className="flex justify-end bg-dark-surface/30 p-4">
          <Button 
            size="lg" 
            onClick={handleGenerate} 
            disabled={(!input.trim() && !selectedImage) || isLoading}
            className="w-full md:w-auto font-semibold shadow-lg shadow-primary-500/20"
          >
            {isLoading ? '프롬프트 생성 중...' : (
              <>
                <Wand2 className="w-4 h-4 mr-2" />
                최적화 프롬프트 생성
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-lg text-sm text-center animate-in fade-in">
          ⚠️ {error}
        </div>
      )}

      <PromptOutput
        output={output}
        copied={copied}
        notionCopied={notionCopied}
        handleSaveToObsidian={handleSaveToObsidian}
        handleOpenNewWindow={handleOpenNewWindow}
        handleGenerate={handleGenerate}
        handleCopy={handleCopy}
        handleCopyToNotion={handleCopyToNotion}
      />

      {/* 히스토리 섹션 */}
      <PromptHistory
        history={history}
        onSelect={handleHistorySelect}
        onDelete={handleHistoryDelete}
        onClear={handleHistoryClear}
      />
      
      <div className="text-center mt-12 pt-6 border-t border-gray-800 text-gray-600 text-xs">
        <p>© {new Date().getFullYear()} {userName || 'Prompt Generator'}. All rights reserved.</p>
        <p className="mt-1">Powered by Google Gemini</p>
      </div>

      <div className="max-w-4xl mx-auto mt-8 p-4 border border-dashed border-gray-800 rounded-lg text-center bg-dark-bg/30 hidden">
        <p className="text-xs text-gray-600">Sponsored Ad Space</p>
        <div className="h-24 flex items-center justify-center text-gray-700 text-sm">
           광고 영역 (Google AdSense 등 연동 예정)
        </div>
      </div>
    </div>
  );
};

export default PromptGenerator;
