import React, { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { generateContent } from '../lib/gemini';
import { Copy, RefreshCw, Zap, Wand2, Check, Layout, Users, Palette, ImageIcon, Layers, PenTool, Monitor, Settings } from 'lucide-react';
import { cn } from '../lib/utils';
import { Button } from "./ui/Button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/Card";

// --- Option Constants with Korean Labels and English Values ---

const ASPECT_RATIOS = [
  { label: '1:1', value: '1:1' },
  { label: '16:9', value: '16:9' },
  { label: '9:16', value: '9:16' },
  { label: '4:3', value: '4:3' },
  { label: '3:4', value: '3:4' },
];

const SUBJECTS = [
  { label: '한국 여성', value: 'Korean Female' },
  { label: '한국 남성', value: 'Korean Male' },
  { label: '서양 여성', value: 'Western Female' },
  { label: '서양 남성', value: 'Western Male' },
  { label: '아시아 여성', value: 'Asian Female' },
  { label: '아시아 남성', value: 'Asian Male' },
  { label: '어린이', value: 'Child' },
  { label: '노인', value: 'Elderly' },
];

// New Style Categories
const FORMAT_OPTIONS = [
  { label: '사진', value: 'Photography' },
  { label: '일러스트', value: 'Illustration' },
  { label: '3D 렌더', value: '3D Render' },
  { label: '애니메', value: 'Anime' },
  { label: '만화', value: 'Manga' },
  { label: '스케치', value: 'Sketch' },
];

const ART_STYLE_OPTIONS = [
  { label: '픽사', value: 'Pixar Style' },
  { label: '지브리', value: 'Studio Ghibli Style' },
  { label: '캐리커쳐', value: 'Caricature' },
  { label: '팝아트', value: 'Pop Art' },
  { label: '빈티지', value: 'Vintage' },
  { label: '사이버펑크', value: 'Cyberpunk' },
  { label: '시네마틱', value: 'Cinematic' },
];

const EXPRESSION_OPTIONS = [
  { label: '플랫', value: 'Flat Design' },
  { label: '로우폴리', value: 'Low Poly' },
  { label: '라인아트', value: 'Line Art' },
  { label: '리얼리스틱', value: 'Hyper Realistic' },
  { label: '미니멀', value: 'Minimalist' },
];

const USAGE_OPTIONS = [
  { label: '인포그래픽', value: 'Infographic' },
  { label: '아이콘', value: 'Icon' },
  { label: '로고', value: 'Logo Design' },
  { label: '아이소메트릭', value: 'Isometric View' },
  { label: '썸네일', value: 'YouTube Thumbnail' },
];

const MOODS = [
  { label: '밝은', value: 'Bright' },
  { label: '어두운', value: 'Dark' },
  { label: '평화로운', value: 'Peaceful' },
  { label: '활기찬', value: 'Vibrant' },
  { label: '파스텔', value: 'Pastel' },
  { label: '신비로운', value: 'Mysterious' },
  { label: '시네마틱', value: 'Cinematic' },
];


const ChipGroup = ({ title, icon: Icon, options, selected, onChange, multiSelect = false }) => {
  const handleSelect = (value) => {
    if (multiSelect) {
      if (selected.includes(value)) {
        onChange(selected.filter(item => item !== value));
      } else {
        onChange([...selected, value]);
      }
    } else {
      onChange(selected === value ? null : value);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm font-medium text-gray-300">
        {Icon && <Icon className="w-4 h-4 text-primary-400" />}
        <span>{title}</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isSelected = multiSelect 
            ? selected.includes(option.value)
            : selected === option.value;
            
          return (
            <button
              key={option.value}
              onClick={() => handleSelect(option.value)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border",
                isSelected 
                  ? "bg-primary-500/20 border-primary-500 text-primary-300 shadow-[0_0_10px_rgba(34,197,94,0.2)]" 
                  : "bg-dark-surface border-gray-700 text-gray-400 hover:border-gray-500 hover:text-gray-200"
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

const PromptGenerator = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [modelMode, setModelMode] = useState('pro-preview'); // Default to 3.0 Pro Preview
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(null);
  
  // State for Parameters
  const [aspectRatio, setAspectRatio] = useState(null);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [selectedMoods, setSelectedMoods] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  // Extended Style States
  const [selectedFormats, setSelectedFormats] = useState([]);
  const [selectedArtStyles, setSelectedArtStyles] = useState([]);
  const [selectedExpressions, setSelectedExpressions] = useState([]);
  const [selectedUsages, setSelectedUsages] = useState([]);


  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleGenerate = async () => {
    setIsLoading(true);
    setOutput('');
    setError(null);
    try {
      // Construct Parameter Strings
      const subjectsStr = selectedSubjects.length > 0 ? selectedSubjects.join(', ') : '사용자 입력 참조';
      const moodsStr = selectedMoods.length > 0 ? selectedMoods.join(', ') : '사용자 입력 참조';
      
      // Combine all style selections
      const combinedStyles = [
        ...selectedFormats, 
        ...selectedArtStyles, 
        ...selectedExpressions, 
        ...selectedUsages
      ];
      const stylesStr = combinedStyles.length > 0 ? combinedStyles.join(', ') : '사용자 입력 참조';

      let prompt = `
        You are an expert prompt engineer specialized in creating detailed prompts for generative AI models (like Midjourney, Stable Diffusion, DALL-E) based on user input.
        
        Original User Input: "${input}"
        
        Selected AI Parameters (Prioritize these settings):
        - Aspect Ratio: ${aspectRatio || 'Not specified'}
        - Subjects/Characters: ${subjectsStr}
        - Art Styles/Format: ${stylesStr}
        - Atmosphere/Mood: ${moodsStr}
        
        Task:
        Transform the Original User Input into a high-quality, descriptive **English** prompt optimized for image generation.
        ${selectedImage ? "An image has been provided as context. Create a prompt that describes this image's key visual elements and composition." : ""}
        
        Guidelines:
        1. **Language**: The final prompt MUST be in **English**, even if the input is Korean.
        2. **Structure**: 
           - [Main Subject & Action]
           - [Detailed Visual Description (Clothing, Environment, Props)]
           - [Art Style & Medium Keywords]
           - [Lighting, Color Palette, Mood]
           - [Technical Specifications (e.g., 8k, photorealistic, cinematic lighting)]
           - [Aspect Ratio parameter if specified (e.g., --ar 16:9)]
        3. **Integration**: Seamlessly integrate the "Selected AI Parameters" into the narrative description.
        4. **Output**: Return ONLY the final prompt text. No conversational filler.
      `;

      const result = await generateContent(prompt, { 
        image: selectedImage, 
        model: modelMode 
      });
      setOutput(result);
    } catch (error) {
      console.error("Error generating prompt:", error);
      setError(error.message || "프롬프트 생성 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  // Obsidian & Settings State
  const [vaultName, setVaultName] = useState(() => localStorage.getItem('obsidian_vault_name') || 'My Vault');
  const [showSettings, setShowSettings] = useState(false);

  // Persist Vault Name
  React.useEffect(() => {
    localStorage.setItem('obsidian_vault_name', vaultName);
  }, [vaultName]);


  const handleSaveToObsidian = () => {
    if (!output) {
      alert("생성된 프롬프트가 없습니다. 먼저 프롬프트를 생성해주세요.");
      return;
    }
    
    // Create filename YYYY-MM-DD_Prompt
    const date = new Date().toISOString().split('T')[0];
    const fileName = `${date}_Prompt`;
    
    // Construct Content
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

    // Encode URI
    const encodedVault = encodeURIComponent(vaultName);
    const encodedFile = encodeURIComponent(fileName);
    const encodedContent = encodeURIComponent(fileContent);
    
    // obsidian://new?vault=my%20vault&name=my%20note&content=Hello%20World
    const obsidianUri = `obsidian://new?vault=${encodedVault}&name=${encodedFile}&content=${encodedContent}`;
    
    // Open URI
    try {
      window.location.href = obsidianUri;
    } catch (e) {
      alert("Obsidian을 열 수 없습니다. Obsidian이 설치되어 있는지 확인해주세요.");
    }
  };

  const handleOpenNewWindow = () => {
    if (!output) {
      alert("생성된 프롬프트가 없습니다. 먼저 프롬프트를 생성해주세요.");
      return;
    }
    
    const newWindow = window.open('', '_blank', 'width=800,height=600');
    if (newWindow) {
      newWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>AI Prompt Result</title>
          <style>
            body { background: #0f172a; color: #e2e8f0; font-family: system-ui, sans-serif; padding: 2rem; line-height: 1.6; }
            pre { background: #1e293b; padding: 1.5rem; border-radius: 0.5rem; overflow-x: auto; font-family: monospace; white-space: pre-wrap; border: 1px solid #334155; }
            h1 { color: #22c55e; font-size: 1.25rem; margin-bottom: 2rem; border-bottom: 1px solid #334155; padding-bottom: 1rem; }
            .copy-btn { background: #22c55e; color: #000; border: none; padding: 0.5rem 1rem; border-radius: 0.25rem; font-weight: bold; cursor: pointer; float: right; }
          </style>
        </head>
        <body>
          <button class="copy-btn" onclick="navigator.clipboard.writeText(document.querySelector('pre').innerText); alert('Copied!');">Copy</button>
          <h1>Generated Prompt</h1>
          <pre>${output}</pre>
        </body>
        </html>
      `);
      newWindow.document.close();
    } else {
      alert("팝업이 차단되었습니다. 브라우저 설정에서 팝업을 허용해주세요.");
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Drag and Drop Handlers
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = React.useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      
      {/* Settings Toggle */}
      <div className="flex justify-end">
         <button 
           onClick={() => setShowSettings(!showSettings)}
           className="text-xs text-gray-500 hover:text-primary-400 flex items-center gap-1 transition-colors"
         >
           {showSettings ? '설정 닫기' : '설정 열기'}
           <Settings className="w-3 h-3" />
         </button>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <Card className="border-gray-800 bg-dark-bg/50 mb-4 animate-in fade-in slide-in-from-top-2">
           <CardContent className="p-4 flex items-center gap-4">
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
             <div className="text-xs text-gray-500 mt-5">
               * 옵시디언 앱이 설치되어 있어야 합니다.
             </div>
           </CardContent>
        </Card>
      )}

      {/* Input Section */}
      <Card className="border-primary-500/20 shadow-primary-500/5 overflow-hidden">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary-400" />
              스마트 프롬프트 빌더
            </CardTitle>
            <select 
              className="px-3 py-1 rounded-md bg-dark-bg border border-gray-700 text-xs text-gray-400 focus:ring-1 focus:ring-primary-500 outline-none"
              value={modelMode}
              onChange={(e) => setModelMode(e.target.value)}
            >
              <option value="flash-2.5">Gemini 2.5 Flash</option>
              <option value="pro-2.5">Gemini 2.5 Pro</option>
              <option value="flash-preview">Gemini 3.0 Flash</option>
              <option value="pro-preview">Gemini 3.0 Pro</option>
            </select>
          </div>
          <CardDescription>
            원하는 옵션을 선택하여 완벽한 프롬프트를 생성하세요.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <textarea
            className="w-full min-h-[100px] p-4 rounded-lg bg-dark-bg border border-gray-700 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all resize-none text-sm"
            placeholder="아이디어를 설명해주세요 (예: 날아다니는 자동차가 있는 미래 도시...)"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column: Ratio & Subject & Mood */}
            <div className="space-y-8">
              <ChipGroup 
                title="비율 (Aspect Ratio)" 
                icon={Layout}
                options={ASPECT_RATIOS} 
                selected={aspectRatio} 
                onChange={setAspectRatio} 
              />
              <ChipGroup 
                title="피사체 (Subjects)" 
                icon={Users}
                options={SUBJECTS} 
                selected={selectedSubjects} 
                onChange={setSelectedSubjects} 
                multiSelect
              />
              <ChipGroup 
                title="감성 & 조명 (Mood)" 
                icon={Wand2}
                options={MOODS} 
                selected={selectedMoods} 
                onChange={setSelectedMoods} 
                multiSelect
              />
            </div>

            {/* Right Column: Style Breakdown */}
            <div className="space-y-8 p-4 bg-dark-surface/30 rounded-xl border border-white/5">
              <div className="flex items-center gap-2 mb-2">
                <Palette className="w-4 h-4 text-primary-400" />
                <h3 className="font-semibold text-gray-200 text-sm">스타일 (Style)</h3>
              </div>
              
              <ChipGroup 
                title="형식" 
                icon={ImageIcon}
                options={FORMAT_OPTIONS} 
                selected={selectedFormats} 
                onChange={setSelectedFormats} 
                multiSelect
              />
              <ChipGroup 
                title="화풍" 
                icon={PenTool}
                options={ART_STYLE_OPTIONS} 
                selected={selectedArtStyles} 
                onChange={setSelectedArtStyles} 
                multiSelect
              />
              <ChipGroup 
                title="표현" 
                icon={Layers}
                options={EXPRESSION_OPTIONS} 
                selected={selectedExpressions} 
                onChange={setSelectedExpressions} 
                multiSelect
              />
              <ChipGroup 
                title="용도" 
                icon={Monitor}
                options={USAGE_OPTIONS} 
                selected={selectedUsages} 
                onChange={setSelectedUsages} 
                multiSelect
              />
            </div>
          </div>

          {/* Image Upload Area */}
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

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-lg text-sm text-center animate-in fade-in">
          ⚠️ {error}
        </div>
      )}

      {/* Output Section */}
      {output && (
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
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default PromptGenerator;
