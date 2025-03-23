import { useState, useEffect, useMemo } from "react";

export const usePagination = <T>(items: T[], itemsPerPage: number) => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageCount = Math.max(Math.ceil(items.length / itemsPerPage), 1);

  useEffect(() => {
    if (currentPage > pageCount) {
      setCurrentPage(pageCount);
    }
  }, [items, pageCount]);

  const setPageSafely = (page: number) => {
    setCurrentPage(() => Math.min(Math.max(page, 1), pageCount));
  };

  const currentItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return items.slice(start, start + itemsPerPage);
  }, [items, currentPage, itemsPerPage]);

  return {
    currentItems,
    currentPage,
    setCurrentPage: setPageSafely,
    pageCount,
  };
};
