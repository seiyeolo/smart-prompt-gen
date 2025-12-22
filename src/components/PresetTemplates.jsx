import React, { useState } from 'react';
import { Sparkles, Camera, Palette, Smartphone, Gamepad2, Film, BookOpen, ShoppingBag, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '../lib/utils';

// 프리셋 템플릿 데이터
const PRESETS = [
  {
    id: 'portrait',
    name: '인물 사진',
    icon: Camera,
    emoji: '📸',
    description: '전문적인 인물/프로필 사진',
    options: {
      aspectRatio: '3:4',
      selectedSubjects: ['Korean Female'],
      selectedMoods: ['Cinematic'],
      selectedAngles: ['Eye Level'],
      selectedFormats: ['Photography'],
      selectedArtStyles: [],
      selectedExpressions: ['Hyper Realistic'],
      selectedUsages: [],
    }
  },
  {
    id: 'illustration',
    name: '일러스트',
    icon: Palette,
    emoji: '🎨',
    description: '따뜻한 감성의 일러스트',
    options: {
      aspectRatio: '1:1',
      selectedSubjects: [],
      selectedMoods: ['Pastel', 'Peaceful'],
      selectedAngles: [],
      selectedFormats: ['Illustration'],
      selectedArtStyles: ['Studio Ghibli Style'],
      selectedExpressions: ['Flat Design'],
      selectedUsages: [],
    }
  },
  {
    id: 'sns',
    name: 'SNS 썸네일',
    icon: Smartphone,
    emoji: '📱',
    description: '릴스/틱톡/스토리용',
    options: {
      aspectRatio: '9:16',
      selectedSubjects: [],
      selectedMoods: ['Vibrant', 'Bright'],
      selectedAngles: ['Close Up'],
      selectedFormats: ['Photography'],
      selectedArtStyles: ['Pop Art'],
      selectedExpressions: [],
      selectedUsages: ['YouTube Thumbnail'],
    }
  },
  {
    id: 'game',
    name: '게임 아트',
    icon: Gamepad2,
    emoji: '🎮',
    description: 'SF/판타지 게임 컨셉',
    options: {
      aspectRatio: '16:9',
      selectedSubjects: [],
      selectedMoods: ['Mysterious', 'Dark'],
      selectedAngles: ['Low Angle'],
      selectedFormats: ['3D Render'],
      selectedArtStyles: ['Cyberpunk'],
      selectedExpressions: [],
      selectedUsages: [],
    }
  },
  {
    id: 'youtube',
    name: '유튜브 썸네일',
    icon: Film,
    emoji: '🎬',
    description: '클릭을 부르는 썸네일',
    options: {
      aspectRatio: '16:9',
      selectedSubjects: [],
      selectedMoods: ['Vibrant', 'Cinematic'],
      selectedAngles: ['Close Up', 'Eye Level'],
      selectedFormats: ['Photography'],
      selectedArtStyles: [],
      selectedExpressions: ['Hyper Realistic'],
      selectedUsages: ['YouTube Thumbnail'],
    }
  },
  {
    id: 'anime',
    name: '애니메 캐릭터',
    icon: BookOpen,
    emoji: '✨',
    description: '일본 애니메이션 스타일',
    options: {
      aspectRatio: '3:4',
      selectedSubjects: ['Asian Female'],
      selectedMoods: ['Bright', 'Pastel'],
      selectedAngles: ['Eye Level'],
      selectedFormats: ['Anime'],
      selectedArtStyles: ['Pixar Style'],
      selectedExpressions: [],
      selectedUsages: [],
    }
  },
  {
    id: 'product',
    name: '제품/광고',
    icon: ShoppingBag,
    emoji: '🛍️',
    description: '상업용 제품 이미지',
    options: {
      aspectRatio: '1:1',
      selectedSubjects: [],
      selectedMoods: ['Bright'],
      selectedAngles: ['Close Up', 'Eye Level'],
      selectedFormats: ['Photography'],
      selectedArtStyles: [],
      selectedExpressions: ['Hyper Realistic', 'Minimalist'],
      selectedUsages: [],
    }
  },
  {
    id: 'logo',
    name: '로고/아이콘',
    icon: Sparkles,
    emoji: '⭐',
    description: '미니멀한 로고 디자인',
    options: {
      aspectRatio: '1:1',
      selectedSubjects: [],
      selectedMoods: [],
      selectedAngles: [],
      selectedFormats: ['Illustration'],
      selectedArtStyles: [],
      selectedExpressions: ['Flat Design', 'Minimalist'],
      selectedUsages: ['Logo Design', 'Icon'],
    }
  },
];

const PresetTemplates = ({ onApplyPreset, currentOptions }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [activePreset, setActivePreset] = useState(null);

  const handlePresetClick = (preset) => {
    setActivePreset(preset.id);
    onApplyPreset(preset.options);
    
    // 시각적 피드백 후 해제
    setTimeout(() => setActivePreset(null), 1000);
  };

  // 현재 선택된 옵션과 프리셋이 일치하는지 확인
  const isPresetActive = (preset) => {
    return preset.options.aspectRatio === currentOptions.aspectRatio;
  };

  return (
    <div className="border border-gray-800 rounded-xl bg-dark-surface/50 overflow-hidden mb-6">
      {/* 헤더 */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-dark-surface/80 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-yellow-400" />
          <span className="text-sm font-medium text-gray-300">빠른 프리셋</span>
          <span className="text-[10px] text-gray-500 bg-gray-800 px-2 py-0.5 rounded-full">
            클릭하면 옵션 자동 선택
          </span>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-gray-500" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-500" />
        )}
      </button>

      {/* 프리셋 버튼들 */}
      {isExpanded && (
        <div className="p-4 pt-2 border-t border-gray-800/50">
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((preset) => {
              const Icon = preset.icon;
              const isActive = activePreset === preset.id;
              
              return (
                <button
                  key={preset.id}
                  onClick={() => handlePresetClick(preset)}
                  className={cn(
                    "group relative flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-300 border",
                    isActive
                      ? "bg-primary-500/20 border-primary-500 text-primary-300 scale-105 shadow-lg shadow-primary-500/20"
                      : "bg-dark-bg border-gray-700 text-gray-400 hover:border-primary-500/50 hover:text-gray-200 hover:bg-dark-surface"
                  )}
                >
                  <span className="text-base">{preset.emoji}</span>
                  <span>{preset.name}</span>
                  
                  {/* 호버 툴팁 */}
                  <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 
                                  bg-gray-900 border border-gray-700 rounded-lg shadow-xl
                                  text-[11px] text-gray-300 whitespace-nowrap
                                  opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    {preset.description}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 
                                    border-4 border-transparent border-t-gray-700"></div>
                  </div>
                </button>
              );
            })}
          </div>
          
          {/* 안내 텍스트 */}
          <p className="text-[10px] text-gray-600 mt-3 text-center">
            💡 프리셋 선택 후 개별 옵션을 추가로 조정할 수 있습니다
          </p>
        </div>
      )}
    </div>
  );
};

export default PresetTemplates;
