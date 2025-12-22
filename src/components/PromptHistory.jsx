import React, { useState } from 'react';
import { History, Trash2, Copy, ChevronDown, ChevronUp, Clock, Check, X } from 'lucide-react';
import { cn } from '../lib/utils';

const PromptHistory = ({ history, onSelect, onDelete, onClear }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleCopy = (e, item) => {
    e.stopPropagation();
    navigator.clipboard.writeText(item.output);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = (e, id) => {
    e.stopPropagation();
    onDelete(id);
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    // 1시간 이내
    if (diff < 3600000) {
      const mins = Math.floor(diff / 60000);
      return mins <= 1 ? '방금 전' : `${mins}분 전`;
    }
    // 24시간 이내
    if (diff < 86400000) {
      const hours = Math.floor(diff / 3600000);
      return `${hours}시간 전`;
    }
    // 7일 이내
    if (diff < 604800000) {
      const days = Math.floor(diff / 86400000);
      return `${days}일 전`;
    }
    // 그 이상
    return date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
  };

  if (history.length === 0) {
    return null;
  }

  return (
    <div className="border border-gray-800 rounded-xl bg-dark-surface/50 overflow-hidden">
      {/* 헤더 - 토글 버튼 */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-dark-surface/80 transition-colors"
      >
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-primary-400" />
          <span className="text-sm font-medium text-gray-300">히스토리</span>
          <span className="text-xs text-gray-500 bg-gray-800 px-2 py-0.5 rounded-full">
            {history.length}
          </span>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-gray-500" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-500" />
        )}
      </button>

      {/* 히스토리 목록 */}
      {isExpanded && (
        <div className="border-t border-gray-800">
          {/* 전체 삭제 버튼 */}
          <div className="px-4 py-2 border-b border-gray-800/50 flex justify-end">
            {showClearConfirm ? (
              <div className="flex items-center gap-2 text-xs">
                <span className="text-gray-400">전체 삭제?</span>
                <button
                  onClick={() => { onClear(); setShowClearConfirm(false); }}
                  className="text-red-400 hover:text-red-300 p-1"
                >
                  <Check className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="text-gray-400 hover:text-gray-300 p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowClearConfirm(true)}
                className="text-xs text-gray-500 hover:text-red-400 transition-colors"
              >
                전체 삭제
              </button>
            )}
          </div>

          {/* 목록 */}
          <div className="max-h-80 overflow-y-auto">
            {history.map((item) => (
              <div
                key={item.id}
                onClick={() => onSelect(item)}
                className="px-4 py-3 border-b border-gray-800/50 last:border-b-0 
                           hover:bg-primary-500/5 cursor-pointer transition-colors group"
              >
                <div className="flex items-start justify-between gap-3">
                  {/* 왼쪽: 입력 & 출력 미리보기 */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-300 font-medium truncate">
                      {item.input || '(이미지만 입력)'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                      {item.output.substring(0, 100)}...
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Clock className="w-3 h-3 text-gray-600" />
                      <span className="text-[10px] text-gray-600">
                        {formatDate(item.timestamp)}
                      </span>
                      {item.model && (
                        <span className="text-[10px] text-gray-600 bg-gray-800 px-1.5 py-0.5 rounded">
                          {item.model}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* 오른쪽: 액션 버튼 */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => handleCopy(e, item)}
                      className={cn(
                        "p-1.5 rounded-md transition-colors",
                        copiedId === item.id
                          ? "bg-green-500/20 text-green-400"
                          : "hover:bg-gray-700 text-gray-400"
                      )}
                      title="복사"
                    >
                      {copiedId === item.id ? (
                        <Check className="w-3.5 h-3.5" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <button
                      onClick={(e) => handleDelete(e, item.id)}
                      className="p-1.5 rounded-md hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors"
                      title="삭제"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PromptHistory;
