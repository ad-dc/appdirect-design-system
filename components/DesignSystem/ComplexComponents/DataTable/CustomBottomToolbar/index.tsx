import React, { ReactElement, useMemo } from "react";
import { Select, rem, ActionIcon, Text } from '@mantine/core';
import { Inline } from '@/components/DesignSystem';
import {
  MRT_TableInstance as MRTTableInstance,
  MRT_RowData,
} from "mantine-react-table-open";
import { translate } from '../translations';
import { RiArrowLeftSLine, RiArrowRightSLine } from '@remixicon/react';

// Constants
const PAGE_SIZE_OPTIONS = [
  { value: "5", label: "5" },
  { value: "10", label: "10" },
  { value: "25", label: "25" },
  { value: "50", label: "50" },
  { value: "100", label: "100" },
] as const;

const TOOLBAR_STYLES = {
  container: {
    borderTop: "1px solid var(--ad-color-border-subtle)",
    padding: `${rem(5)} ${rem(12)}`,
    backgroundColor: "var(--ad-color-bg-subtle)",
  },
  select: {
    width: "80px",
  },
  selectInput: {
    backgroundColor: "transparent",
    border: "none",
    color: "var(--ad-color-text-default)",
    fontSize: "var(--mantine-font-size-xs)",
  },
} as const;

interface PageInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor?: string;
  endCursor?: string;
}

interface CustomBottomToolbarProps<T extends MRT_RowData> {
  table: MRTTableInstance<T>;
  totalCount: number;
  pageInfo?: PageInfo;
  numberOfSelectedRows?: number;
}

/**
 * Generate the appropriate selected rows text based on count
 */
const useSelectedRowsText = (numberOfSelectedRows: number): string | null => {
  return useMemo(() => {
    if (numberOfSelectedRows === 0) return null;
    
    return numberOfSelectedRows === 1 
      ? translate("table.selected.row")
      : translate("table.selected.rows", { count: numberOfSelectedRows });
  }, [numberOfSelectedRows]);
};

/**
 * Calculate pagination information
 */
const usePaginationInfo = (pageIndex: number, totalCount: number, pageSize: number) => {
  return useMemo(() => ({
    totalPages: Math.ceil(totalCount / pageSize),
    currentPage: pageIndex + 1,
  }), [pageIndex, totalCount, pageSize]);
};

const CustomBottomToolbar = <T extends MRT_RowData>({
  table,
  totalCount,
  pageInfo,
  numberOfSelectedRows = 0,
}: CustomBottomToolbarProps<T>): ReactElement => {
  const { getState, setPageIndex, setPageSize } = table;
  const { pagination } = getState();
  const { pageIndex, pageSize } = pagination;

  const selectedRowsText = useSelectedRowsText(numberOfSelectedRows);
  const { totalPages, currentPage } = usePaginationInfo(pageIndex, totalCount, pageSize);

  const handlePageSizeChange = (value: string | null) => {
    if (value) {
      setPageSize(Number(value));
    }
  };

  const handlePreviousPage = () => {
    if (pageIndex > 0) {
      setPageIndex(pageIndex - 1);
    }
  };

  const handleNextPage = () => {
    if (pageIndex < totalPages - 1) {
      setPageIndex(pageIndex + 1);
    }
  };

  const canGoPrevious = pageIndex > 0;
  const canGoNext = pageIndex < totalPages - 1;

  return (
    <Inline 
      justify="space-between" 
      style={TOOLBAR_STYLES.container}
    >
      {/* Left section - Rows per page selector */}
      <Inline gap="xs">
        <Text size="sm">
          {translate("table.rows.per.page")}
        </Text>
        <Select
          size="xs"
          value={String(pageSize)}
          onChange={handlePageSizeChange}
          data={PAGE_SIZE_OPTIONS}
          style={TOOLBAR_STYLES.select}
          styles={{
            input: TOOLBAR_STYLES.selectInput,
          }}
          aria-label={translate("table.rows.per.page")}
        />
      </Inline>
      
      {/* Middle section - Selected rows indicator */}
      
      <Inline gap="xs">
        {selectedRowsText && (
          <Text size="sm">
            {selectedRowsText}
          </Text>
        )}
      </Inline>

      {/* Right section - Page navigation */}
      <Inline gap="xs">
        <ActionIcon
          variant="subtle"
          color="gray"
          size="sm"
          onClick={handlePreviousPage}
          disabled={!canGoPrevious}
          aria-label="Previous page"
        >
          <RiArrowLeftSLine size={16} />
        </ActionIcon>
        
        <Text size="sm">
          {translate("table.pagination.page", {
            current: currentPage,
            total: totalPages,
          })}
        </Text>
        
        <ActionIcon
          variant="subtle"
          color="gray"
          size="sm"
          onClick={handleNextPage}
          disabled={!canGoNext}
          aria-label="Next page"
        >
          <RiArrowRightSLine size={16} />
        </ActionIcon>
      </Inline>

    </Inline>
  );
};

export default CustomBottomToolbar;
