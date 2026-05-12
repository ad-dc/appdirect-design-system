'use client';

import React, { useMemo } from 'react';
import {
  useMantineReactTable,
  MantineReactTable,
  MRT_PaginationState as PaginationState,
  MRT_RowSelectionState as RowSelectionState,
  MRT_DensityState as DensityState,
  MRT_RowData,
  MRT_ColumnDef as ColumnDef,
} from 'mantine-react-table-open';
import { useTableState } from '../../../../hooks/useTableState';
import { useTableHandlers } from '../../../../hooks/useTableHandlers';
import { useTableRenderFunctions } from '../../../../hooks/useTableRenderFunctions';
import { type Filters, type DateRange, type City } from './CustomTopToolbar';

// ========================== EXPORTS ==========================
/**
 * Re-export commonly used types from sub-components for convenience
 * This allows consumers to import these types directly from the Table component
 */
export type { Filters, DateRange, City };

// TODO: Review integration with PageContentHeader Description feature
// - Consider adding table description/subtitle support
// - Evaluate if table metadata should be displayed in header area
// - Review accessibility implications of description placement

// ========================== TYPES ==========================
/**
 * Union type for sort directions used throughout the table
 * null represents no sorting applied to a column
 */
type SortDirection = 'asc' | 'desc' | null;

/**
 * Enhanced TableColumn interface with better typing and additional options
 * Extends the basic column definition with custom properties
 */
export interface DataTableColumn<T extends MRT_RowData> {
  /** The key from the data object to access the column value */
  accessorKey: keyof T;
  /** Column header - can be static text or a React component function */
  header: string | (() => React.ReactNode);
  /** Optional fixed width for the column in pixels */
  size?: number;
  /** Whether this column can be sorted by the user */
  enableSorting?: boolean;
  /** Whether filtering is enabled for this column */
  enableColumnFilter?: boolean;
}

/**
 * Page information interface for cursor-based pagination
 * Used to determine navigation availability and cursor positions
 */
export interface PageInfo {
  /** Whether there are more pages after the current one */
  hasNextPage: boolean;
  /** Whether there are pages before the current one */
  hasPreviousPage: boolean;
  /** Cursor pointing to the start of the current page (for cursor-based pagination) */
  startCursor?: string;
  /** Cursor pointing to the end of the current page (for cursor-based pagination) */
  endCursor?: string;
}

/**
 * Comprehensive props interface for the Table component
 * Organized by functionality for better maintainability
 */
export interface DataTableProps<T extends MRT_RowData> {
  // ==================== DATA PROPS ====================
  /** Array of data objects to display in the table */
  data: T[];
  /** Column definitions specifying how to render each column */
  columns: ColumnDef<T>[];
  /** Total number of items across all pages (for pagination display) */
  totalCount?: number;
  
  // ==================== LOADING AND ERROR STATES ====================
  /** Whether the table is currently loading data */
  isLoading?: boolean;
  /** Whether an error has occurred while loading data */
  isError?: boolean;
  /** Error message to display when isError is true */
  error?: string;
  /** Callback function to retry loading data after an error */
  onRetry?: () => void;
  
  // ==================== PAGINATION PROPS ====================
  /** Page information for cursor-based pagination */
  pageInfo?: PageInfo;
  /** Callback fired when pagination state changes (page or page size) */
  onPaginationChange?: (pagination: PaginationState) => void;
  /** Default number of rows to show per page */
  defaultPageSize?: number;
  
  // ==================== SELECTION PROPS ====================
  /** Callback fired when row selection changes */
  onRowSelectionChange?: (rowSelection: RowSelectionState) => void;
  
  // ==================== UI STATE PROPS ====================
  /** Callback fired when table density (row height) changes */
  onDensityChange?: (density: DensityState) => void;
  /** Default density setting for the table */
  defaultDensity?: DensityState;
  
  // ==================== SORTING PROPS ====================
  /** Callback fired when column sorting changes */
  onSortChange?: (field: string, direction: SortDirection) => void;
  
  // ==================== FILTER PROPS ====================
  /** Current state of all applied filters */
  filtersState?: Filters;
  /** Callback fired when filters are modified */
  onFiltersChange?: (filters: Filters) => void;
  /** Locale string for internationalization */
  locale?: string;
  
  // ==================== FEATURE TOGGLES ====================
  /** Whether to show the filters panel */
  showFilters?: boolean;
  /** Whether to show the global search input */
  showSearch?: boolean;
  /** Whether to show the density toggle button */
  showDensityToggle?: boolean;
  /** Whether to show the fullscreen toggle button */
  showFullScreenToggle?: boolean;
  
  // ==================== STYLE CUSTOMIZATION ====================
  /** Additional props to pass to the table container element */
  mantineTableContainerProps?: Record<string, any>;
  /** Additional props to pass to the paper wrapper element */
  mantinePaperProps?: Record<string, any>;
  
  // ==================== DEPRECATED/UNUSED PROPS ====================
  /** @deprecated Use totalCount instead - kept for backward compatibility */
  resultCount?: number;
}

// ========================== CONSTANTS ==========================
/**
 * Default values for various table configuration options
 * Centralized to ensure consistency and easy modification
 */
const DEFAULT_VALUES = {
  /** Default number of rows per page */
  PAGE_SIZE: 10,
  /** Default table density (row height) - 'xs' is most compact */
  DENSITY: 'xs' as DensityState,
  /** Default locale for internationalization */
  LOCALE: 'en',
  /** Default total count when not provided */
  TOTAL_COUNT: 0,
  /** Default result count (deprecated) */
  RESULT_COUNT: 0,
} as const;

/**
 * Feature flags that control which table features are enabled by default
 * Can be overridden by props but provide sensible defaults
 */
const FEATURE_FLAGS = {
  /** Enable filters panel by default */
  SHOW_FILTERS: true,
  /** Enable global search by default */
  SHOW_SEARCH: true,
  /** Enable density toggle by default */
  SHOW_DENSITY_TOGGLE: true,
  /** Enable fullscreen toggle by default */
  SHOW_FULL_SCREEN_TOGGLE: true,
} as const;

// ========================== CUSTOM HOOKS ==========================

/**
 * DataTable Component
 * 
 * A powerful, feature-rich data table component built on top of Mantine React Table.
 * Supports pagination, sorting, filtering, row selection, density controls, and more.
 * Perfect for displaying large datasets with complex interaction requirements.
 * 
 * @example
 * // Basic usage with minimal configuration
 * const userData = [
 *   { id: '1', name: 'John Doe', email: 'john@example.com', status: 'Active' },
 *   { id: '2', name: 'Jane Smith', email: 'jane@example.com', status: 'Inactive' },
 * ];
 * 
 * const columns = [
 *   { accessorKey: 'name', header: 'Name' },
 *   { accessorKey: 'email', header: 'Email' },
 *   { accessorKey: 'status', header: 'Status' },
 * ];
 * 
 * <DataTable
 *   data={userData}
 *   columns={columns}
 * />
 * 
 * @example
 * // Advanced usage with pagination and filtering
 * const [tableData, setTableData] = useState([]);
 * const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
 * const [filters, setFilters] = useState({});
 * const [isLoading, setIsLoading] = useState(false);
 * 
 * // Fetch data when pagination or filters change
 * useEffect(() => {
 *   fetchData(pagination, filters);
 * }, [pagination, filters]);
 * 
 * <DataTable
 *   data={tableData}
 *   columns={columns}
 *   isLoading={isLoading}
 *   totalCount={1000}
 *   defaultPageSize={20}
 *   filtersState={filters}
 *   onPaginationChange={setPagination}
 *   onFiltersChange={setFilters}
 *   pageInfo={{
 *     hasNextPage: true,
 *     hasPreviousPage: false,
 *     startCursor: 'cursor-start',
 *     endCursor: 'cursor-end'
 *   }}
 * />
 * 
 * @example
 * // With row selection and custom actions
 * const [selectedRows, setSelectedRows] = useState({});
 * 
 * const handleRowSelection = (rowSelection) => {
 *   setSelectedRows(rowSelection);
 *   console.log('Selected rows:', Object.keys(rowSelection));
 * };
 * 
 * const handleBulkAction = () => {
 *   const selectedIds = Object.keys(selectedRows);
 *   // Perform bulk action on selected rows
 * };
 * 
 * <DataTable
 *   data={tableData}
 *   columns={columns}
 *   onRowSelectionChange={handleRowSelection}
 *   // Custom toolbar actions will appear when rows are selected
 * />
 * 
 * @example
 * // Error handling and retry functionality
 * const [error, setError] = useState(null);
 * const [isError, setIsError] = useState(false);
 * 
 * const handleRetry = () => {
 *   setError(null);
 *   setIsError(false);
 *   // Retry data fetching logic
 *   fetchData();
 * };
 * 
 * <DataTable
 *   data={tableData}
 *   columns={columns}
 *   isError={isError}
 *   error={error}
 *   onRetry={handleRetry}
 * />
 * 
 * @example
 * // Customized table features and styling
 * <DataTable
 *   data={tableData}
 *   columns={columns}
 *   defaultDensity="md"
 *   showFilters={true}
 *   showSearch={true}
 *   showDensityToggle={true}
 *   showFullScreenToggle={false}
 *   locale="en-US"
 *   mantineTableContainerProps={{
 *     style: { maxHeight: '600px' }
 *   }}
 *   mantinePaperProps={{
 *     shadow: 'md',
 *     radius: 'md'
 *   }}
 * />
 * 
 * @example
 * // Dynamic columns with conditional rendering
 * const columns = useMemo(() => [
 *   { accessorKey: 'name', header: 'Name', enableSorting: true },
 *   { accessorKey: 'email', header: 'Email', enableColumnFilter: true },
 *   { 
 *     accessorKey: 'status', 
 *     header: () => <Text fw="bold">Status</Text>,
 *     size: 120,
 *     enableSorting: false
 *   },
 *   {
 *     accessorKey: 'actions',
 *     header: 'Actions',
 *     enableSorting: false,
 *     enableColumnFilter: false,
 *     Cell: ({ row }) => (
 *       <Inline>
 *         <Button size="xs" onClick={() => handleEdit(row.original)}>
 *           Edit
 *         </Button>
 *         <Button size="xs" color="red" onClick={() => handleDelete(row.original)}>
 *           Delete
 *         </Button>
 *       </Inline>
 *     )
 *   }
 * ], []);
 * 
 * <DataTable
 *   data={tableData}
 *   columns={columns}
 *   onSortChange={(field, direction) => {
 *     console.log(`Sorting ${field} in ${direction} order`);
 *   }}
 * />
 */
export function DataTable<T extends MRT_RowData>({
  // ==================== DATA PROPS ====================
  data,
  columns,
  totalCount = DEFAULT_VALUES.TOTAL_COUNT,
  
  // ==================== LOADING AND ERROR STATES ====================
  isLoading = false,
  isError = false,
  error,
  onRetry,
  
  // ==================== PAGINATION PROPS ====================
  pageInfo,
  onPaginationChange,
  defaultPageSize = DEFAULT_VALUES.PAGE_SIZE,
  
  // ==================== SELECTION PROPS ====================
  onRowSelectionChange,
  
  // ==================== UI STATE PROPS ====================
  onDensityChange,
  defaultDensity = DEFAULT_VALUES.DENSITY,
  
  // ==================== SORTING PROPS ====================
  onSortChange,
  
  // ==================== FILTER PROPS ====================
  filtersState = {},
  onFiltersChange = () => {},
  locale = DEFAULT_VALUES.LOCALE,
  
  // ==================== FEATURE TOGGLES ====================
  showFilters = FEATURE_FLAGS.SHOW_FILTERS,
  showSearch = FEATURE_FLAGS.SHOW_SEARCH,
  showDensityToggle = FEATURE_FLAGS.SHOW_DENSITY_TOGGLE,
  showFullScreenToggle = FEATURE_FLAGS.SHOW_FULL_SCREEN_TOGGLE,
  
  // ==================== STYLE CUSTOMIZATION ====================
  mantineTableContainerProps = {},
  mantinePaperProps = {},
  
  // ==================== DEPRECATED/UNUSED PROPS ====================
  resultCount = DEFAULT_VALUES.RESULT_COUNT,
}: DataTableProps<T>) {
  // ==================== HOOK INITIALIZATION ====================
  /** Initialize table state management */
  const tableState = useTableState(defaultPageSize, defaultDensity);
  
  /** Initialize event handlers with proper memoization */
  const handlers = useTableHandlers(tableState, {
    onPaginationChange,
    onRowSelectionChange,
    onDensityChange,
    onSortChange,
  });
  
  /** Initialize render functions with all required dependencies */
  const renderFunctions = useTableRenderFunctions(
    {
      filtersState,
      locale,
      onFiltersChange,
      data,
      showFilters,
      isLoading,
      totalCount,
      pageInfo,
      error,
      onRetry,
    },
    { numberOfSelectedRows: tableState.numberOfSelectedRows },
    { handleClearSelection: handlers.handleClearSelection }
  );

  // ==================== TABLE CONFIGURATION ====================
  /**
   * Memoized table configuration object
   * Contains all options, state, and handlers for Mantine React Table
   */
  const tableConfig = useMemo(() => ({
    // ==================== CORE DATA AND COLUMNS ====================
    columns,
    data,
    /** Use the 'id' field from each row for unique identification (enables proper selection tracking) */
    getRowId: (row: T) => row.id as string,
    
    // ==================== FEATURE ENABLEMENT ====================
    /** Enable row selection with checkboxes */
    enableRowSelection: true,
    /** Allow multiple rows to be selected simultaneously */
    enableMultiRowSelection: true,
    /** Show select all checkbox in header */
    enableSelectAll: true,
    /** Enable column-specific filtering */
    enableColumnFilters: true,
    /** Enable column sorting */
    enableSorting: true,
    /** Allow users to resize columns */
    enableColumnResizing: true,
    /** Keep header visible when scrolling */
    enableStickyHeader: true,
    /** Show density toggle button */
    enableDensityToggle: showDensityToggle,
    /** Show fullscreen toggle button */
    enableFullScreenToggle: showFullScreenToggle,
    /** Enable pagination controls */
    enablePagination: true,
    /** Disable built-in row actions (we handle them manually) */
    enableRowActions: false,
    /** Disable individual column actions - we'll use a custom column visibility button */
    enableColumnActions: false,
    /** Enable column hiding feature */
    enableHiding: true,
    /** Use manual pagination (parent handles data slicing) */
    manualPagination: true,
    
    // ==================== DATA AND STATE ====================
    /** Total number of rows across all pages */
    rowCount: totalCount,
    /** Initial state with pinned actions column */
    initialState: {
      columnPinning: {
        right: ['actions'],
      },
    },
    /** Current state object passed to Mantine React Table */
    state: {
      pagination: tableState.pagination,
      rowSelection: tableState.rowSelection,
      density: tableState.density,
      isLoading,
      showAlertBanner: tableState.showAlertBanner,
    },
    
    // ==================== LAYOUT CONFIGURATION ====================
    /** Use grid layout for better column control */
    layoutMode: 'grid' as const,
    /** Configure display columns (selection, etc.) */
    displayColumnDefOptions: {
      'mrt-row-select': {
        size: 40, // Minimal width for checkbox
        grow: false, // Don't grow this column
      },
    },
    /** Enable column pinning to keep actions column fixed */
    enablePinning: true,
    
    // ==================== EVENT HANDLERS ====================
    /** Handle pagination changes (page navigation, page size changes) */
    onPaginationChange: handlers.handlePaginationChange,
    /** Handle row selection changes */
    onRowSelectionChange: handlers.handleRowSelectionChange,
    /** Handle density changes */
    onDensityChange: handlers.handleDensityChange,
    /** Handle sorting changes */
    onSortingChange: handlers.handleSortingChange,
    
    // ==================== RENDER FUNCTIONS ====================
    /** Custom top toolbar with filters and actions */
    renderTopToolbar: renderFunctions.renderTopToolbar,
    /** Custom bottom toolbar with pagination */
    renderBottomToolbar: renderFunctions.renderBottomToolbar,
    /** Custom alert banner for selection state */
    renderToolbarAlertBannerContent: renderFunctions.renderToolbarAlertBannerContent,
    /** Custom empty state with error handling */
    renderEmptyRowsFallback: renderFunctions.renderEmptyRowsFallback,
    /** Custom header cell renderer */
    mantineTableHeadCellProps: renderFunctions.renderTableHeadCell,
    
    // ==================== ACCESSIBILITY AND STYLING ====================
    /** Accessibility props for select all checkbox */
    mantineSelectAllCheckboxProps: {
      'aria-label': 'Select all rows on this page',
    },
    /** Accessibility props for individual row checkboxes */
    mantineSelectCheckboxProps: {
      'aria-label': 'Select row',
    },
    /** Table styling options */
    mantineTableProps: {
      striped: true, // Alternating row colors
      highlightOnHover: true, // Highlight rows on hover
      withColumnBorders: false, // No vertical borders between columns
    },
    /** Header row styling */
    mantineTableHeadRowProps: {
      style: {
        borderBottom: '2px solid var(--ad-color-border-subtle)',
      },
    },
    /** Body cell styling */
    mantineTableBodyCellProps: {
      style: {
        padding: 'var(--mantine-spacing-xs)',
      },
    },
    /** Alert banner styling */
    mantineToolbarAlertBannerProps: {
      color: 'blue',
    },
    /** Table container styling */
    mantineTableContainerProps: {
        style: {
        backgroundColor: 'var(--ad-color-bg-default)',
      },
      ...mantineTableContainerProps, // Allow prop overrides
    },
    /** Paper wrapper styling */
    mantinePaperProps: {
      style: {
        backgroundColor: 'var(--ad-color-bg-default)',
      },
      ...mantinePaperProps, // Allow prop overrides
    },
  }), [
    // ==================== MEMOIZATION DEPENDENCIES ====================
    // Core data dependencies
    columns,
    data,
    showDensityToggle,
    showFullScreenToggle,
    totalCount,
    isLoading,
    // State dependencies
    tableState.pagination,
    tableState.rowSelection,
    tableState.density,
    tableState.showAlertBanner,
    // Handler dependencies
    handlers.handlePaginationChange,
    handlers.handleRowSelectionChange,
    handlers.handleDensityChange,
    handlers.handleSortingChange,
    // Render function dependencies
    renderFunctions.renderTopToolbar,
    renderFunctions.renderBottomToolbar,
    renderFunctions.renderToolbarAlertBannerContent,
    renderFunctions.renderEmptyRowsFallback,
    renderFunctions.renderTableHeadCell,
    // Style customization dependencies
    mantineTableContainerProps,
    mantinePaperProps,
  ]);

  // ==================== COMPONENT INITIALIZATION ====================
  /** Initialize the Mantine React Table instance with our configuration */
  const table = useMantineReactTable(tableConfig);

  // ==================== RENDER ====================
  /** Render the table component */
  return <MantineReactTable table={table} />;
} 