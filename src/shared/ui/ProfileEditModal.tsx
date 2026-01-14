"use client";

import { useEffect, useState } from "react";

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialNickname?: string;
  initialBirthdate?: string; // YYYY-MM-DD
  onSave?: (data: { nickname: string; birthdate: string | null }) => void;
}

export function ProfileEditModal({
  isOpen,
  onClose,
  initialNickname = "",
  initialBirthdate = "",
  onSave,
}: ProfileEditModalProps) {
  const [nickname, setNickname] = useState(initialNickname);
  const [birthdate, setBirthdate] = useState(initialBirthdate);

  // 모달이 열릴 때마다 초기값으로 리셋
  useEffect(() => {
    if (isOpen) {
      setNickname(initialNickname);
      setBirthdate(initialBirthdate);
    }
  }, [isOpen, initialNickname, initialBirthdate]);

  const handleSave = () => {
    onSave?.({
      nickname: nickname.trim(),
      birthdate: birthdate || null,
    });
    onClose();
  };

  const handleOverlayClick = () => {
    onClose();
  };

  if (!isOpen) return null;

  const isSaveDisabled = nickname.trim().length === 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      onClick={handleOverlayClick}
    >
      {/* 배경 오버레이 */}
      <div className="absolute inset-0 bg-black/50" />

      {/* 모달 컨텐츠 */}
      <div
        className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 닫기 버튼 */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-light hover:text-foreground transition-colors"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* 헤더 */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-foreground mb-1">
            회원정보 수정
          </h2>
          <p className="text-gray text-xs">
            닉네임과 생년월일을 수정할 수 있어요
          </p>
        </div>

        {/* 폼 */}
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">
              닉네임
            </label>
            <input
              type="text"
              value={nickname}
              maxLength={20}
              onChange={(e) => setNickname(e.target.value)}
              className="w-full rounded-xl border border-gray-light/40 px-3 py-2 text-sm text-foreground placeholder-gray-light focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="표시할 닉네임을 입력하세요"
            />
            <p className="text-[11px] text-gray-light">
              최대 20자까지 입력할 수 있어요
            </p>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">
              생년월일
            </label>
            <input
              type="date"
              value={birthdate}
              onChange={(e) => setBirthdate(e.target.value)}
              className="w-full rounded-xl border border-gray-light/40 px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>

        {/* 버튼 영역 */}
        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 rounded-2xl border border-gray-light/30 text-gray text-sm font-semibold hover:bg-gray-light/10 transition-colors"
          >
            취소
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaveDisabled}
            className="flex-1 py-3 rounded-2xl bg-primary text-white text-sm font-semibold hover:bg-[#7a9588] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
}

