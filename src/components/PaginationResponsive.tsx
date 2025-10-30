import React from 'react';

type Props = {
  current: number;
  total: number;
  onChange: (page: number) => void;
  ariaLabel?: string;
};

const generateDesktopPages = (current: number, total: number) => {
  const pages: (number | 'e')[] = [];
  const showEllipsisStart = current > 4;
  const showEllipsisEnd = current < total - 3;

  pages.push(1);

  if (showEllipsisStart) {
    pages.push('e');
    for (let i = current - 2; i < current; i++) {
      if (i > 1 && i < total) pages.push(i);
    }
  } else {
    for (let i = 2; i < current; i++) {
      if (i < total) pages.push(i);
    }
  }

  if (current !== 1 && current !== total) pages.push(current);

  if (showEllipsisEnd) {
    for (let i = current + 1; i <= current + 2; i++) {
      if (i > 1 && i < total) pages.push(i);
    }
    pages.push('e');
  } else {
    for (let i = current + 1; i < total; i++) {
      pages.push(i);
    }
  }

  if (total > 1) pages.push(total);
  return pages;
};

const generateMobilePages = (current: number, total: number) => {
  const pages: (number | 'e')[] = [];
  pages.push(1);
  if (current > 2) pages.push('e');
  if (current > 1 && current < total) {
    if (current > 2) pages.push(current - 1);
    pages.push(current);
    if (current < total - 1) pages.push(current + 1);
  }
  if (current < total - 1) pages.push('e');
  if (total > 1) pages.push(total);
  return pages;
};

export default function PaginationResponsive({ current, total, onChange, ariaLabel }: Props) {
  if (!total || total <= 1) return null;

  const handlePrev = () => onChange(Math.max(1, current - 1));
  const handleNext = () => onChange(Math.min(total, current + 1));

  return (
    <div>
      {/* Desktop / Tablet */}
      <div className="hidden md:flex items-center justify-center gap-2">
        <nav className="flex items-center gap-2" aria-label={ariaLabel || 'Pagination'}>
          <button onClick={handlePrev} disabled={current === 1} className={`px-4 py-2 rounded font-medium transition-all ${current === 1 ? 'bg-zinc-800 text-gray-600 cursor-not-allowed' : 'bg-zinc-800 text-white hover:bg-zinc-700'}`}>
            السابق
          </button>

          <div className="flex items-center gap-1 mx-2">
            {generateDesktopPages(current, total).map((pg, idx) => (
              typeof pg === 'string' ? (
                <span key={`e-${idx}`} className="px-3 py-2 text-gray-500">…</span>
              ) : (
                <button key={pg} onClick={() => onChange(Number(pg))} className={`min-w-[44px] px-4 py-2 rounded font-medium transition-all ${pg === current ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/50' : 'bg-zinc-800 text-white hover:bg-zinc-700'}`}>
                  {pg}
                </button>
              )
            ))}
          </div>

          <button onClick={handleNext} disabled={current === total} className={`px-4 py-2 rounded font-medium transition-all ${current === total ? 'bg-zinc-800 text-gray-600 cursor-not-allowed' : 'bg-zinc-800 text-white hover:bg-zinc-700'}`}>
            التالي
          </button>
        </nav>

        <div className="ml-3 text-sm text-gray-300 hidden md:flex items-center">
          <span className="font-medium text-white">{current}</span>
          <span className="mx-1 text-gray-400">/</span>
          <span className="text-gray-300">{total}</span>
        </div>
      </div>

      {/* Mobile compact */}
      <div className="md:hidden flex items-center justify-center gap-3">
        <button onClick={handlePrev} disabled={current === 1} className={`px-3 py-2 rounded bg-zinc-800 text-white text-sm ${current === 1 ? 'opacity-60 cursor-not-allowed' : ''}`}>
          السابق
        </button>

        <div className="px-4 py-2 bg-zinc-900 rounded text-sm font-medium flex items-center gap-2 min-w-[100px] justify-center">
          <span className="text-white font-bold text-lg">{current}</span>
          <span className="text-gray-500">/</span>
          <span className="text-white text-lg">{total}</span>
        </div>

        <button onClick={handleNext} disabled={current === total} className={`px-3 py-2 rounded bg-zinc-800 text-white text-sm ${current === total ? 'opacity-60 cursor-not-allowed' : ''}`}>
          التالي
        </button>
      </div>
    </div>
  );
}
