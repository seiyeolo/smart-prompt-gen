import React, { useState } from 'react';
import { Layout, Users, Wand2, Palette, ImageIcon, PenTool, Layers, Monitor, Camera, HelpCircle } from 'lucide-react';
import { cn } from '../lib/utils';
import { 
  ASPECT_RATIOS, 
  SUBJECTS, 
  MOODS,
  FORMAT_OPTIONS, 
  ART_STYLE_OPTIONS, 
  EXPRESSION_OPTIONS, 
  USAGE_OPTIONS,
  ANGLE_OPTIONS,
  CATEGORY_HELP
} from '../constants';

// 툴팁 컴포넌트
const Tooltip = ({ children, text }) => {
  const [show, setShow] = useState(false);
  
  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onTouchStart={() => setShow(!show)}
      >
        {children}
      </div>
      {show && text && (
        <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 
                        bg-gray-900 border border-gray-700 rounded-lg shadow-xl
                        text-xs text-gray-200 whitespace-normal w-48 text-center
                        animate-in fade-in zoom-in-95 duration-200">
          {text}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 
                          border-4 border-transparent border-t-gray-700"></div>
        </div>
      )}
    </div>
  );
};

// 카테고리 도움말 팝업
const CategoryHelp = ({ helpKey }) => {
  const [show, setShow] = useState(false);
  const help = CATEGORY_HELP[helpKey];
  
  if (!help) return null;
  
  return (
    <div className="relative inline-block ml-1">
      <button
        onClick={() => setShow(!show)}
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        className="text-gray-500 hover:text-primary-400 transition-colors"
      >
        <HelpCircle className="w-3.5 h-3.5" />
      </button>
      {show && (
        <div className="absolute z-50 bottom-full left-0 mb-2 p-3
                        bg-gray-900 border border-primary-500/30 rounded-lg shadow-xl
                        text-xs w-64 animate-in fade-in zoom-in-95 duration-200">
          <p className="text-gray-300 mb-2">{help.description}</p>
          <p className="text-primary-400 text-[11px]">{help.tip}</p>
          <div className="absolute top-full left-4 -mt-1 
                          border-4 border-transparent border-t-primary-500/30"></div>
        </div>
      )}
    </div>
  );
};


// ChipGroup 컴포넌트 - 툴팁 지원 추가
const ChipGroup = ({ title, icon: Icon, options, selected, onChange, multiSelect = false, helpKey }) => {
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
        {helpKey && <CategoryHelp helpKey={helpKey} />}
      </div>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isSelected = multiSelect 
            ? selected.includes(option.value)
            : selected === option.value;
            
          return (
            <Tooltip key={option.value} text={option.tooltip}>
              <button
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
            </Tooltip>
          );
        })}
      </div>
    </div>
  );
};


const PromptOptions = ({
  aspectRatio,
  setAspectRatio,
  selectedSubjects,
  setSelectedSubjects,
  selectedMoods,
  setSelectedMoods,
  selectedFormats,
  setSelectedFormats,
  selectedArtStyles,
  setSelectedArtStyles,
  selectedExpressions,
  setSelectedExpressions,
  selectedUsages,
  setSelectedUsages,
  selectedAngles,
  setSelectedAngles,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Left Column: Ratio & Subject & Mood */}
      <div className="space-y-8">
        <ChipGroup 
          title="비율 (Aspect Ratio)" 
          icon={Layout}
          options={ASPECT_RATIOS} 
          selected={aspectRatio} 
          onChange={setAspectRatio}
          helpKey="aspectRatio"
        />
        <ChipGroup 
          title="피사체 (Subjects)" 
          icon={Users}
          options={SUBJECTS} 
          selected={selectedSubjects} 
          onChange={setSelectedSubjects} 
          multiSelect
          helpKey="subjects"
        />
        <ChipGroup 
          title="감성 & 조명 (Mood)" 
          icon={Wand2}
          options={MOODS} 
          selected={selectedMoods} 
          onChange={setSelectedMoods} 
          multiSelect
          helpKey="mood"
        />
      </div>

      {/* Right Column: Style Breakdown */}
      <div className="space-y-8 p-4 bg-dark-surface/30 rounded-xl border border-white/5">
        <div className="flex items-center gap-2 mb-2">
          <Palette className="w-4 h-4 text-primary-400" />
          <h3 className="font-semibold text-gray-200 text-sm">스타일 (Style)</h3>
        </div>
        
        <ChipGroup 
          title="카메라 앵글 & 구도 (Camera Angle)" 
          icon={Camera}
          options={ANGLE_OPTIONS} 
          selected={selectedAngles} 
          onChange={setSelectedAngles} 
          multiSelect
          helpKey="angle"
        />
        
        <ChipGroup 
          title="형식" 
          icon={ImageIcon}
          options={FORMAT_OPTIONS} 
          selected={selectedFormats} 
          onChange={setSelectedFormats} 
          multiSelect
          helpKey="format"
        />
        <ChipGroup 
          title="화풍" 
          icon={PenTool}
          options={ART_STYLE_OPTIONS} 
          selected={selectedArtStyles} 
          onChange={setSelectedArtStyles} 
          multiSelect
          helpKey="artStyle"
        />
        <ChipGroup 
          title="표현" 
          icon={Layers}
          options={EXPRESSION_OPTIONS} 
          selected={selectedExpressions} 
          onChange={setSelectedExpressions} 
          multiSelect
          helpKey="expression"
        />
        <ChipGroup 
          title="용도" 
          icon={Monitor}
          options={USAGE_OPTIONS} 
          selected={selectedUsages} 
          onChange={setSelectedUsages} 
          multiSelect
          helpKey="usage"
        />
      </div>
    </div>
  );
};

export default PromptOptions;
