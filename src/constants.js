// 각 옵션에 tooltip 설명 추가 - 초보자 가이드용

export const ASPECT_RATIOS = [
  { label: '1:1', value: '1:1', tooltip: '정사각형. 인스타그램 피드, 프로필 이미지에 적합' },
  { label: '16:9', value: '16:9', tooltip: '와이드 가로형. 유튜브 썸네일, 배경화면, 영화 느낌' },
  { label: '9:16', value: '9:16', tooltip: '세로형. 인스타 릴스, 틱톡, 스마트폰 배경' },
  { label: '4:3', value: '4:3', tooltip: '클래식 가로형. 전통적인 사진 비율' },
  { label: '3:4', value: '3:4', tooltip: '세로 사진형. 인물 사진, 포트레이트에 적합' },
];

export const SUBJECTS = [
  { label: '한국 여성', value: 'Korean Female', tooltip: '한국인 여성 인물. K-뷰티, 한복 등에 적합' },
  { label: '한국 남성', value: 'Korean Male', tooltip: '한국인 남성 인물. K-패션, 비즈니스 이미지' },
  { label: '서양 여성', value: 'Western Female', tooltip: '서양인 여성. 글로벌 광고, 패션 이미지' },
  { label: '서양 남성', value: 'Western Male', tooltip: '서양인 남성. 비즈니스, 라이프스타일' },
  { label: '아시아 여성', value: 'Asian Female', tooltip: '아시아계 여성. 다양한 아시아 문화권 표현' },
  { label: '아시아 남성', value: 'Asian Male', tooltip: '아시아계 남성. 동양적 분위기 연출' },
  { label: '어린이', value: 'Child', tooltip: '아동 캐릭터. 교육용, 가족 컨텐츠' },
  { label: '노인', value: 'Elderly', tooltip: '고령 인물. 지혜, 경험을 표현할 때' },
];

export const FORMAT_OPTIONS = [
  { label: '사진', value: 'Photography', tooltip: '실제 카메라로 찍은 듯한 사실적 이미지' },
  { label: '일러스트', value: 'Illustration', tooltip: '손으로 그린 듯한 그림체. 책 삽화, 포스터' },
  { label: '3D 렌더', value: '3D Render', tooltip: '3D 모델링 느낌. 게임, 제품 시각화에 적합' },
  { label: '애니메', value: 'Anime', tooltip: '일본 애니메이션 스타일. 캐릭터 중심 이미지' },
  { label: '만화', value: 'Manga', tooltip: '일본 만화 스타일. 흑백 또는 스크린톤 느낌' },
  { label: '스케치', value: 'Sketch', tooltip: '연필 드로잉 느낌. 컨셉 아트, 초안용' },
];

export const ART_STYLE_OPTIONS = [
  { label: '픽사', value: 'Pixar Style', tooltip: '디즈니/픽사 3D 애니메이션 스타일. 귀엽고 부드러운 느낌' },
  { label: '지브리', value: 'Studio Ghibli Style', tooltip: '스튜디오 지브리 느낌. 따뜻하고 자연친화적인 분위기' },
  { label: '캐리커쳐', value: 'Caricature', tooltip: '특징을 과장한 풍자화 스타일' },
  { label: '팝아트', value: 'Pop Art', tooltip: '앤디 워홀 스타일. 강렬한 색상, 대중문화 느낌' },
  { label: '빈티지', value: 'Vintage', tooltip: '복고풍. 60-80년대 레트로 감성' },
  { label: '사이버펑크', value: 'Cyberpunk', tooltip: '네온, SF 미래도시 느낌. 보라+청록 색상' },
  { label: '시네마틱', value: 'Cinematic', tooltip: '영화 한 장면 같은 느낌. 드라마틱한 조명' },
];

export const EXPRESSION_OPTIONS = [
  { label: '플랫', value: 'Flat Design', tooltip: '단순한 평면 디자인. 앱 아이콘, 인포그래픽에 적합' },
  { label: '로우폴리', value: 'Low Poly', tooltip: '적은 폴리곤의 기하학적 스타일. 모던하고 심플' },
  { label: '라인아트', value: 'Line Art', tooltip: '선으로만 표현. 깔끔하고 미니멀한 느낌' },
  { label: '리얼리스틱', value: 'Hyper Realistic', tooltip: '초현실적으로 정밀한 표현. 실사와 구분 불가' },
  { label: '미니멀', value: 'Minimalist', tooltip: '최소한의 요소만 사용. 여백의 미' },
];

export const USAGE_OPTIONS = [
  { label: '인포그래픽', value: 'Infographic', tooltip: '정보 전달용 그래픽. 데이터 시각화' },
  { label: '아이콘', value: 'Icon', tooltip: '앱/웹 아이콘용. 단순하고 인식하기 쉬운' },
  { label: '로고', value: 'Logo Design', tooltip: '브랜드 로고 스타일. 심볼릭하고 기억에 남는' },
  { label: '아이소메트릭', value: 'Isometric View', tooltip: '30도 기울어진 입체 뷰. 건물, 공간 표현에 적합' },
  { label: '썸네일', value: 'YouTube Thumbnail', tooltip: '유튜브 썸네일용. 눈에 띄고 클릭을 유도하는' },
];

export const MOODS = [
  { label: '밝은', value: 'Bright', tooltip: '밝고 선명한 조명. 긍정적이고 활기찬 분위기' },
  { label: '어두운', value: 'Dark', tooltip: '어두운 톤. 미스터리, 공포, 심각한 분위기' },
  { label: '평화로운', value: 'Peaceful', tooltip: '차분하고 고요한 느낌. 명상, 힐링 컨텐츠' },
  { label: '활기찬', value: 'Vibrant', tooltip: '생동감 넘치는 밝은 색상. 에너지틱한 느낌' },
  { label: '파스텔', value: 'Pastel', tooltip: '부드러운 파스텔 톤. 귀엽고 따뜻한 분위기' },
  { label: '신비로운', value: 'Mysterious', tooltip: '몽환적이고 신비한 느낌. 판타지, 마법' },
  { label: '시네마틱', value: 'Cinematic', tooltip: '영화 같은 조명. 깊이감 있는 그림자와 하이라이트' },
];

export const ANGLE_OPTIONS = [
  { label: '기본', value: 'Default', tooltip: '특별한 앵글 지정 없음. AI가 자동으로 선택' },
  { label: '눈높이', value: 'Eye Level', tooltip: '눈높이에서 정면 촬영. 가장 자연스러운 구도' },
  { label: '로우 앵글', value: 'Low Angle', tooltip: '아래에서 위로 올려다보는 앵글. 위엄, 힘을 강조' },
  { label: '하이 앵글', value: 'High Angle', tooltip: '위에서 아래로 내려다보는 앵글. 귀여움, 연약함' },
  { label: '버즈 아이 뷰', value: "Bird's Eye View", tooltip: '새가 하늘에서 보는 시점. 전체 공간 조망' },
  { label: '웜즈 아이 뷰', value: "Worm's Eye View", tooltip: '벌레 시점. 극단적 로우앵글, 건물/나무 강조' },
  { label: '광각', value: 'Wide Angle', tooltip: '넓은 화각 렌즈 효과. 공간감이 과장됨' },
  { label: '망원', value: 'Telephoto', tooltip: '망원 렌즈 효과. 배경 압축, 피사체 집중' },
  { label: '클로즈업', value: 'Close Up', tooltip: '얼굴이나 물체를 가까이서. 디테일과 감정 강조' },
  { label: '매크로', value: 'Macro Photography', tooltip: '극접사 촬영. 작은 물체를 크게 확대' },
  { label: '셀피', value: 'Selfie', tooltip: '셀카 느낌. 약간 위에서 찍는 친근한 앵글' },
];

// 카테고리별 도움말 (제목 옆 ? 아이콘용)
export const CATEGORY_HELP = {
  aspectRatio: {
    title: '비율 (Aspect Ratio)',
    description: '이미지의 가로:세로 비율입니다. 사용 목적에 따라 선택하세요.',
    tip: '💡 SNS용은 9:16, 유튜브는 16:9, 프로필은 1:1 추천'
  },
  subjects: {
    title: '피사체 (Subjects)',
    description: '이미지에 등장할 인물 유형입니다. 복수 선택 가능.',
    tip: '💡 선택 안하면 아이디어 텍스트 기반으로 AI가 판단'
  },
  mood: {
    title: '감성 & 조명 (Mood)',
    description: '이미지의 전체적인 분위기와 조명 톤입니다.',
    tip: '💡 "파스텔 + 평화로운" = 힐링 느낌, "어두운 + 시네마틱" = 영화 느낌'
  },
  angle: {
    title: '카메라 앵글 & 구도',
    description: '카메라가 피사체를 바라보는 각도와 거리입니다.',
    tip: '💡 인물 사진은 "눈높이", 제품 사진은 "클로즈업" 추천'
  },
  format: {
    title: '형식',
    description: '이미지의 기본 표현 방식입니다. 사진 vs 그림 vs 3D',
    tip: '💡 실사 느낌은 "사진", 캐릭터는 "일러스트"나 "애니메"'
  },
  artStyle: {
    title: '화풍',
    description: '특정 예술 스타일이나 레퍼런스입니다.',
    tip: '💡 "지브리" = 따뜻한 자연, "사이버펑크" = SF 미래도시'
  },
  expression: {
    title: '표현',
    description: '디자인의 복잡도와 렌더링 스타일입니다.',
    tip: '💡 아이콘/로고는 "플랫"이나 "미니멀", 사진은 "리얼리스틱"'
  },
  usage: {
    title: '용도',
    description: '최종 사용 목적에 맞는 최적화입니다.',
    tip: '💡 용도를 선택하면 해당 포맷에 맞게 최적화됨'
  }
};
