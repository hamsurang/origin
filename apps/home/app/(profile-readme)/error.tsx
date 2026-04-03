'use client'

export default function ErrorBoundary({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-8">
      <p className="text-sm text-gray-500">데이터를 불러올 수 없습니다</p>
      <button type="button" onClick={reset} className="text-xs text-blue-600 hover:underline">
        다시 시도
      </button>
    </div>
  )
}
