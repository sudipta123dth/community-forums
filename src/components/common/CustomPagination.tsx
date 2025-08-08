import React from "react";
interface CustomPaginationProps {
  previousLabel?: string;
  nextLabel?: string;
  breakLabel?: string;
  breakClassName?: string;
  pageCount: number;
  marginPagesDisplayed?: number;
  pageRangeDisplayed?: number;
  onPageChange: (data: { selected: number }) => void;
  forcePage?: number;
  containerClassName?: string;
  activeClassName?: string;
  pageClassName?: string;
  previousClassName?: string;
  nextClassName?: string;
  disabledClassName?: string;
}

const CustomPagination: React.FC<CustomPaginationProps> = ({
  previousLabel = "← Previous",
  nextLabel = "Next →",
  breakLabel = "...",
  breakClassName = "px-3 py-1 text-gray-500",
  pageCount,
  marginPagesDisplayed = 2,
  pageRangeDisplayed = 3,
  onPageChange,
  forcePage = 0,
  containerClassName = "flex gap-2 flex-wrap md:justify-end mt-4",
  activeClassName = "bg-blue-600 text-white border-blue-600",
  pageClassName = "px-3 py-1 border rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors duration-200",
  previousClassName = "px-3 py-1 border rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors duration-200",
  nextClassName = "px-3 py-1 border rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors duration-200",
  disabledClassName = "opacity-50 cursor-not-allowed hover:bg-transparent text-gray-400",
}) => {
  const currentPage = forcePage;

  const handlePageChange = (pageIndex: number) => {
    if (pageIndex >= 0 && pageIndex < pageCount && pageIndex !== currentPage) {
      onPageChange({ selected: pageIndex });
    }
  };

  const getVisiblePages = (): (number | string)[] => {
    const pages: (number | string)[] = [];
    const totalPages = pageCount;

    if (totalPages <= pageRangeDisplayed + marginPagesDisplayed * 2) {
      for (let i = 0; i < totalPages; i++) {
        pages.push(i);
      }
      return pages;
    }

    for (let i = 0; i < marginPagesDisplayed; i++) {
      if (i < totalPages) pages.push(i);
    }

    const startPage = Math.max(
      marginPagesDisplayed,
      currentPage - Math.floor(pageRangeDisplayed / 2)
    );
    const endPage = Math.min(
      totalPages - marginPagesDisplayed - 1,
      startPage + pageRangeDisplayed - 1
    );

    if (startPage > marginPagesDisplayed) {
      pages.push("break-start");
    }

    for (let i = startPage; i <= endPage; i++) {
      if (i >= marginPagesDisplayed && i < totalPages - marginPagesDisplayed) {
        pages.push(i);
      }
    }

    if (endPage < totalPages - marginPagesDisplayed - 1) {
      pages.push("break-end");
    }

    for (let i = totalPages - marginPagesDisplayed; i < totalPages; i++) {
      if (i >= 0 && !pages.includes(i)) pages.push(i);
    }

    return pages;
  };

  const visiblePages = getVisiblePages();

  if (pageCount <= 1) return null;

  return (
    <div className={containerClassName}>
      <button
        className={`${previousClassName} ${currentPage === 0 ? disabledClassName : ""
          }`}
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 0}
        type="button"
      >
        {previousLabel}
      </button>

      {visiblePages.map((page, index) => {
        if (typeof page === "string") {
          return (
            <span key={index} className={breakClassName}>
              {breakLabel}
            </span>
          );
        }

        const isActive = page === currentPage;
        return (
          <button
            key={page}
            className={`${pageClassName} ${isActive ? activeClassName : ""}`}
            onClick={() => handlePageChange(page)}
            type="button"
          >
            {page + 1}
          </button>
        );
      })}

      <button
        className={`${nextClassName} ${currentPage === pageCount - 1 ? disabledClassName : ""
          }`}
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === pageCount - 1}
        type="button"
      >
        {nextLabel}
      </button>
    </div>
  );
};

export default CustomPagination;
