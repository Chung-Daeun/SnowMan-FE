"use client";

import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "@/shared/config/api";
import {
  BirthParts,
  normalizeTwoDigitsOnBlur,
  parseBirthDateToParts,
  toYyyyMmDdFromParts,
  validateBirthDate,
} from "@/shared/lib/birthDate";

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProfileEditModal({ isOpen, onClose }: ProfileEditModalProps) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [nickname, setNickname] = useState("");

  const [birthParts, setBirthParts] = useState<BirthParts>({
    year: "",
    month: "",
    day: "",
  });

  const [birthError, setBirthError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const now = useMemo(() => new Date(), []);

  useEffect(() => {
    if (!isOpen) return;

    const fetchProfile = async () => {
      const response = await apiFetch("/api/me");
      if (response.ok) {
        const json = await response.json();
        setNickname(json.nickname || "");
        setBirthParts(parseBirthDateToParts(json.birthDate || ""));
        setBirthError(null);
      }
    };

    fetchProfile();
    setIsEditMode(false);
  }, [isOpen]);

  useEffect(() => {
    setBirthError(validateBirthDate(birthParts, now));
  }, [birthParts, now]);

  const birthDate = useMemo(
    () => toYyyyMmDdFromParts(birthParts),
    [birthParts]
  );

  const handleSave = async () => {
    const err = validateBirthDate(birthParts, new Date());
    if (err) {
      setBirthError(err);
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiFetch("/api/me/update", {
        method: "POST",
        body: JSON.stringify({
          nickname,
          birthDate: birthDate === "" ? null : birthDate,
        }),
      });

      if (response.ok) {
        setIsEditMode(false);
        alert("프로필이 저장되었습니다.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onMouseDown={onClose}
    >
      <div
        className="relative w-full max-w-sm rounded-3xl bg-white px-7 py-6 shadow-2xl"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          {/* 타이틀에 컬러 포인트 */}
          <h2 className="text-xl font-semibold text-primary">
            내 프로필
          </h2>

          {!isEditMode && (
            <button
              type="button"
              onClick={() => setIsEditMode(true)}
              className="rounded-full p-2
                         bg-primary/10 text-primary
                         transition hover:bg-primary/20"
              aria-label="프로필 수정"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                />
              </svg>
            </button>
          )}
        </div>

        {/* Content */}
        <div className="space-y-5">
          {/* Nickname */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray">
              닉네임
            </label>
            <div className="relative">
              <input
                type="text"
                disabled={!isEditMode}
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="닉네임을 입력하세요"
                className="w-full rounded-2xl border border-gray-light/30 px-4 py-2.5
                           text-sm focus:outline-none focus:ring-2 focus:ring-primary
                           disabled:bg-gray-light/5 disabled:text-gray"
              />
              {isEditMode && nickname && (
                <button
                  type="button"
                  onClick={() => setNickname("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-light"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Birth Date */}
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label className="text-sm font-medium text-gray">
                생년월일
              </label>

              {isEditMode &&
                (birthParts.year || birthParts.month || birthParts.day) && (
                  <button
                    type="button"
                    onClick={() =>
                      setBirthParts({ year: "", month: "", day: "" })
                    }
                    className="rounded-lg px-2 py-1 text-xs font-medium
                               bg-primary/10 text-primary/80
                               hover:bg-primary/15 transition"
                  >
                    초기화
                  </button>
                )}
            </div>

            <div className="flex items-end gap-2">
              <input
                type="text"
                inputMode="numeric"
                maxLength={4}
                disabled={!isEditMode}
                value={birthParts.year}
                onChange={(e) =>
                  setBirthParts((p) => ({
                    ...p,
                    year: e.target.value.replace(/[^\d]/g, ""),
                  }))
                }
                placeholder="YYYY"
                className="w-[38%] rounded-2xl border border-gray-light/30 px-4 py-2.5
                           text-sm focus:outline-none focus:ring-2 focus:ring-primary
                           disabled:bg-gray-light/5 disabled:text-gray"
              />

              <input
                type="text"
                inputMode="numeric"
                maxLength={2}
                disabled={!isEditMode}
                value={birthParts.month}
                onChange={(e) =>
                  setBirthParts((p) => ({
                    ...p,
                    month: e.target.value.replace(/[^\d]/g, ""),
                  }))
                }
                onBlur={() =>
                  setBirthParts((p) => ({
                    ...p,
                    month: normalizeTwoDigitsOnBlur(p.month),
                  }))
                }
                placeholder="MM"
                className="w-[31%] rounded-2xl border border-gray-light/30 px-4 py-2.5
                           text-sm focus:outline-none focus:ring-2 focus:ring-primary
                           disabled:bg-gray-light/5 disabled:text-gray"
              />

              <input
                type="text"
                inputMode="numeric"
                maxLength={2}
                disabled={!isEditMode}
                value={birthParts.day}
                onChange={(e) =>
                  setBirthParts((p) => ({
                    ...p,
                    day: e.target.value.replace(/[^\d]/g, ""),
                  }))
                }
                onBlur={() =>
                  setBirthParts((p) => ({
                    ...p,
                    day: normalizeTwoDigitsOnBlur(p.day),
                  }))
                }
                placeholder="DD"
                className="w-[31%] rounded-2xl border border-gray-light/30 px-4 py-2.5
                           text-sm focus:outline-none focus:ring-2 focus:ring-primary
                           disabled:bg-gray-light/5 disabled:text-gray"
              />
            </div>

            {birthError ? (
              <p className="mt-1.5 text-sm text-red-500">{birthError}</p>
            ) : (
              isEditMode && (
                <p className="mt-1.5 text-xs leading-snug text-gray-light">
                  예: 2007 / 01 / 18 (미래 날짜는 불가)
                </p>
              )
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 border-t border-gray-light/20 pt-5">
          {isEditMode ? (
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setIsEditMode(false)}
                className="flex-1 rounded-2xl border border-gray-light/30 py-3
                           text-sm font-semibold text-gray"
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={isLoading}
                className="flex-1 rounded-2xl bg-primary py-3
                           text-sm font-semibold text-white
                           transition disabled:opacity-60"
              >
                {isLoading ? "저장 중..." : "저장하기"}
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="w-full rounded-2xl bg-gray-light/10 py-3
                         text-sm font-semibold text-foreground"
            >
              닫기
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
