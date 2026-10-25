import { useState, useEffect } from "react"
import { type GetPrefectureResponse } from "@/app/_types/prefecture";
import { useFetch } from "@/app/_hooks/useFetch";


type PrefectureFilterModalProps = {
  isOpen: boolean;
  selectedPrefectureId: number | null;
  onClose: () => void;
  onApply: (prefectureId: number | null) => void;
};

export const PrefectureFilterModal = ({
  isOpen,
  selectedPrefectureId,
  onClose,
  onApply
}: PrefectureFilterModalProps) => {

  const [draftPrefectureId, setDraftPrefectureId] = useState<number | null>(selectedPrefectureId);
  const { data: prefectures, error, isLoading } = useFetch<GetPrefectureResponse>("api/prefectures");

  // モーダルを開いたとき、現在適用されている条件を選択状態にする
  useEffect(() => {
    if (isOpen) {
      setDraftPrefectureId(selectedPrefectureId);
    }
  }, [isOpen, selectedPrefectureId]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="prefecture-modal-title"
        className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 id="prefecture-modal-title" className="text-xl font-bold">エリアを選択</h2>

          <button
            type="button"
            onClick={onClose}
            aria-label="モーダルを閉じる"
            className="text-2xl"
          >
            ×
          </button>
        </div>
        {/* 都道府県一覧 */}
        {isLoading ? (
          <p>都道府県を読み込み中…</p>
        ) : error ? (
          <p>都道府県の取得に失敗しました。</p>
          ) : (
            <div className="grid max-h-80 grid-cols-2 gap-3 overflow-y-auto sm:grid-cols-3">
              {prefectures?.map((prefecture) => (
                <label
                  key={prefecture.id}
                  className="flex cursor-pointer items-center gap-2 rounded-lg border p-3"
                >
                  <input
                    type="radio"
                    name="prefecture"
                    value={prefecture.id}
                    checked={draftPrefectureId === prefecture.id}
                    onChange={() =>
                      setDraftPrefectureId(prefecture.id)
                    }
                  />
                  <span>{prefecture.name}</span>
                </label>
              ))}
            </div>
        )}
        {/* 操作ボタン */}
        <div className="mt-6 flex justify-between gap-3">
          <button
            type="button"
            onClick={() => setDraftPrefectureId(null)}
            className="rounded-lg border px-4 py-2"
          >
            リセット
          </button>
          <button
            type="button"
            onClick={() => onApply(draftPrefectureId)}
            disabled={isLoading || error !== undefined}
            className="rounded-lg border px-4 py-2"
          >
            この条件で検索
          </button>
        </div>

      </div>

    </div>
  )
}
