// components/pagination.tsx
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type Props = {
  page: number;
  pages: number;
  total: number;
  buildHref: (page: number) => string;  // caller owns URL shape
};

function pageNumbers(current: number, total: number): (number | '…')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const items: (number | '…')[] = [1];

  if (current > 3)          items.push('…');
  if (current > 2)          items.push(current - 1);
  if (current !== 1 && current !== total) items.push(current);
  if (current < total - 1)  items.push(current + 1);
  if (current < total - 2)  items.push('…');

  items.push(total);
  return items;
}

export function Pagination({ page, pages, total, buildHref }: Props) {
  if (pages <= 1) return null;   // nothing to render

  const items = pageNumbers(page, pages);
  const hasPrev = page > 1;
  const hasNext = page < pages;

  return (
    <nav
      aria-label="Pagination"
      className="flex flex-col items-center gap-3 py-8"
    >
      {/* page count label */}
      <p className="font-[Poppins] text-[12px] text-[#6B7D8F]">
        Page {page} of {pages} · {total.toLocaleString()} cars
      </p>

      <div className="flex items-center gap-1.5">
        {/* previous */}
        {hasPrev ? (
          <Link
            href={buildHref(page - 1)}
            aria-label="Previous page"
            className="flex items-center justify-center w-10 h-10
                       border border-[#DCE9F2] rounded-lg bg-white
                       text-[#16293D] hover:border-[#1479E0] hover:text-[#1479E0]
                       transition-colors"
          >
            <ChevronLeft size={18} aria-hidden="true" />
          </Link>
        ) : (
          <span
            aria-disabled="true"
            className="flex items-center justify-center w-10 h-10
                       border border-[#DCE9F2] rounded-lg bg-[#FBFBF9]
                       text-[#B5C4CC] cursor-not-allowed"
          >
            <ChevronLeft size={18} aria-hidden="true" />
          </span>
        )}

        {/* page numbers */}
        {items.map((item, i) =>
          item === '…' ? (
            <span
              key={`ellipsis-${i}`}
              className="flex items-center justify-center w-10 h-10
                         font-[Poppins] text-[13px] text-[#6B7D8F]"
              aria-hidden="true"
            >
              …
            </span>
          ) : (
            <Link
              key={item}
              href={buildHref(item)}
              aria-label={`Page ${item}`}
              aria-current={item === page ? 'page' : undefined}
              className={`flex items-center justify-center w-10 h-10
                          rounded-lg font-[Poppins] text-[13px] font-semibold
                          transition-colors
                          ${item === page
                            ? 'bg-[#1479E0] text-white border border-[#1479E0]'
                            : 'bg-white border border-[#DCE9F2] text-[#16293D] hover:border-[#1479E0] hover:text-[#1479E0]'
                          }`}
            >
              {item}
            </Link>
          ),
        )}

        {/* next */}
        {hasNext ? (
          <Link
            href={buildHref(page + 1)}
            aria-label="Next page"
            className="flex items-center justify-center w-10 h-10
                       border border-[#DCE9F2] rounded-lg bg-white
                       text-[#16293D] hover:border-[#1479E0] hover:text-[#1479E0]
                       transition-colors"
          >
            <ChevronRight size={18} aria-hidden="true" />
          </Link>
        ) : (
          <span
            aria-disabled="true"
            className="flex items-center justify-center w-10 h-10
                       border border-[#DCE9F2] rounded-lg bg-[#FBFBF9]
                       text-[#B5C4CC] cursor-not-allowed"
          >
            <ChevronRight size={18} aria-hidden="true" />
          </span>
        )}
      </div>
    </nav>
  );
}
