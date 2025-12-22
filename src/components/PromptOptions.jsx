import React from 'react';
import { Layout, Users, Wand2, Palette, ImageIcon, PenTool, Layers, Monitor, Camera } from 'lucide-react';
import { cn } from '../lib/utils';
import { 
  ASPECT_RATIOS, 
  SUBJECTS, 
  MOODS,
  FORMAT_OPTIONS, 
  ART_STYLE_OPTIONS, 
  EXPRESSION_OPTIONS, 
  USAGE_OPTIONS,
  ANGLE_OPTIONS
} from '../constants';

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
          title="카메라 앵글 & 구도 (Camera Angle)" 
          icon={Camera}
          options={ANGLE_OPTIONS} 
          selected={selectedAngles} 
          onChange={setSelectedAngles} 
          multiSelect
        />
        
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
  );
};

export default PromptOptions;
