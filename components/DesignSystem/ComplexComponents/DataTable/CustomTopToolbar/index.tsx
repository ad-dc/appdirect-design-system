import React, { ReactElement, useEffect, useState } from "react";
import { ActionIcon, Indicator, Stack, Text, rem } from '@mantine/core';
import { Button } from '../../../Buttons/Button';
import { Grid } from '../../../Layout/Grid';
import { SimpleGrid } from '../../../Layout/SimpleGrid';
import { Inline } from '../../../Layout/Inline';
import { IconFilter, IconMaximize, IconMinimize, IconBaselineDensityMedium, IconBaselineDensitySmall, IconBaselineDensityLarge } from '@tabler/icons-react';
import { DatesRangeValue, type DateValue } from "@mantine/dates";
import {
  MRT_TableInstance as MRTTableInstance,
  MRT_ToggleFullScreenButton as MRTToggleFullScreenButton,
  MRT_ToggleDensePaddingButton as MRTToggleDensePaddingButton,
  MRT_ToolbarAlertBanner as BaseMRTToolbarAlertBanner,
  MRT_RowData,
} from "mantine-react-table-open";
import { translate } from '../translations';
import SelectFilter from "./SelectFilter";
import SearchFilter from "./SearchFilter";
import DateRangeSelector from "./DateRangeSelectorFilter";
import FilterChip from "./FilterChip";
import ResultCount from "./ResultCount/index";

// =============================================================================
// TYPES & INTERFACES
// =============================================================================

/**
 * Enum defining all available cities for filtering
 * @TODO: Consider moving this to a separate constants file for better maintainability
 */
export enum City {
  NEW_YORK = "New York",
  LOS_ANGELES = "Los Angeles",
  CHICAGO = "Chicago",
  SAN_FRANCISCO = "San Francisco",
  BOSTON = "Boston",
  SEATTLE = "Seattle",
  DENVER = "Denver",
  PORTLAND = "Portland",
  AUSTIN = "Austin",
  MIAMI = "Miami",
  PHOENIX = "Phoenix",
  LAS_VEGAS = "Las Vegas",
  DETROIT = "Detroit",
  NASHVILLE = "Nashville",
  ATLANTA = "Atlanta",
  ORLANDO = "Orlando",
  TAMPA = "Tampa",
  CHARLOTTE = "Charlotte",
  INDIANAPOLIS = "Indianapolis",
  COLUMBUS = "Columbus",
}

/**
 * Interface for date range filter values
 */
export interface DateRange {
  start: Date | null;
  end: Date | null;
}

/**
 * Central interface for all filter states
 */
export interface Filters {
  cities?: City[] | null;
  dateRange?: DateRange | null;
  searchTerm?: string;
}

/**
 * Props for the main CustomTopToolbar component
 */
export interface CustomTopToolbarProps<T extends MRT_RowData> {
  filtersState: Filters;
  locale: string;
  onChange: (filters: Filters) => void;
  resultCount: number;
  totalCount?: number; // Total records across all pages (unfiltered)
  numberOfSelectedRows: number;
  table: MRTTableInstance<T>;
  isLoading?: boolean;
  onFilterToggleChange: () => void;
  showFilters: boolean;
}

/**
 * Extended props for the MRT Toolbar Alert Banner
 */
interface ExtendedAlertBannerProps<T extends MRT_RowData> {
  stackAlertBanner?: boolean;
  table: MRTTableInstance<T>;
  bg?: string;
  numberofselectedrows: number;
  style?: React.CSSProperties;
}

/**
 * Props for the filter icon button component
 */
interface FilterIconButtonProps {
  onClick: () => void;
  areFiltersShown: boolean;
  text?: string;
}

/**
 * Props for action icon components (fullscreen, density)
 */
interface ActionIconButtonProps {
  onClick: () => void;
  ariaLabel: string;
  icon: ReactElement;
  testId?: string;
}

// =============================================================================
// CONSTANTS & UTILITIES
// =============================================================================

/**
 * Typed wrapper for the MRT Toolbar Alert Banner
 */
const MRTToolbarAlertBanner = BaseMRTToolbarAlertBanner as React.ComponentType<ExtendedAlertBannerProps<any>>;

/**
 * Date formatting options for display purposes
 */
const DATE_FORMAT_OPTIONS: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "long",
  day: "numeric",
};

/**
 * Shared styling for action buttons (30x30 square buttons)
 */
const ACTION_BUTTON_STYLES = {
  width: rem(30),
  height: rem(30),
  minWidth: rem(30),
  minHeight: rem(30),
  padding: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 'var(--mantine-radius-sm)',
  border: '1px solid var(--ad-color-border-default)',
  background: 'var(--ad-white)',
} as const;

const ACTION_ICON_STYLES = {
  width: rem(30),
  height: rem(30),
  borderRadius: 'var(--mantine-radius-sm)',
  border: '1px solid var(--ad-color-border-default)',
} as const;

/**
 * Icon styling for consistent appearance
 */
const ICON_STYLES = {
  color: 'var(--ad-color-text-default)',
};

/**
 * City options data for the select filter
 * @TODO: Consider moving this to a separate data file or fetching from an API
 */
const CITY_OPTIONS = [
  { value: City.ATLANTA, label: "table.filters.city.atlanta" as const },
  { value: City.AUSTIN, label: "table.filters.city.austin" as const },
  { value: City.BOSTON, label: "table.filters.city.boston" as const },
  { value: City.CHARLOTTE, label: "table.filters.city.charlotte" as const },
  { value: City.CHICAGO, label: "table.filters.city.chicago" as const },
  { value: City.COLUMBUS, label: "table.filters.city.columbus" as const },
  { value: City.DENVER, label: "table.filters.city.denver" as const },
  { value: City.DETROIT, label: "table.filters.city.detroit" as const },
  { value: City.INDIANAPOLIS, label: "table.filters.city.indianapolis" as const },
  { value: City.LAS_VEGAS, label: "table.filters.city.las.vegas" as const },
  { value: City.LOS_ANGELES, label: "table.filters.city.los.angeles" as const },
  { value: City.MIAMI, label: "table.filters.city.miami" as const },
  { value: City.NASHVILLE, label: "table.filters.city.nashville" as const },
  { value: City.NEW_YORK, label: "table.filters.city.new.york" as const },
  { value: City.ORLANDO, label: "table.filters.city.orlando" as const },
  { value: City.PHOENIX, label: "table.filters.city.phoenix" as const },
  { value: City.PORTLAND, label: "table.filters.city.portland" as const },
  { value: City.SAN_FRANCISCO, label: "table.filters.city.san.francisco" as const },
  { value: City.SEATTLE, label: "table.filters.city.seattle" as const },
  { value: City.TAMPA, label: "table.filters.city.tampa" as const },
].map(option => ({
  ...option,
  label: translate(option.label),
}));

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Utility function to determine if filters are currently active
 * @param filters - The current filter state
 * @returns boolean indicating if any filters are applied
 */
const hasActiveFilters = (filters: Filters): boolean => {
  const { cities, dateRange } = filters;
  return Boolean(
    (cities && cities.length > 0) || 
    (dateRange && dateRange.start && dateRange.end)
  );
};

/**
 * Utility function to process date range selection
 * Handles the logic for ensuring both dates are selected and sets end time to end of day
 * @param value - The selected date range value
 * @returns Processed DateRange or null
 */
const toBoundaryDate = (v: DateValue | null): Date | null => {
  if (v == null) return null;
  return v instanceof Date ? v : new Date(`${v}T12:00:00`);
};

const processDateRangeSelection = (value: DatesRangeValue | null): DateRange | null => {
  // Helper functions for date validation
  const isOnlyOneDateSelected = (): boolean => {
    return !!(value && (value[0] === null || value[1] === null));
  };

  const areBothDatesSelected = (): boolean => {
    return !!(value && value[0] !== null && value[1] !== null);
  };

  // Return early if only one date is selected (incomplete selection)
  if (isOnlyOneDateSelected()) {
    return null;
  }

  let range: DateRange | null = null;

  if (value !== null && areBothDatesSelected()) {
    const start = toBoundaryDate(value[0]);
    let endDate = toBoundaryDate(value[1]);

    if (endDate) {
      const endOfDay = new Date(endDate);
      endOfDay.setHours(23, 59, 59, 999);
      endDate = endOfDay;
    }

    range = {
      start,
      end: endDate,
    };
  }

  return range;
};

/**
 * Utility function to get the appropriate density icon based on current state
 * @param density - Current table density setting
 * @returns React element for the density icon
 */
const getDensityIcon = (density: string): ReactElement => {
  const iconProps = { size: 18, style: ICON_STYLES };
  
  switch (density) {
    case 'md':
      return <IconBaselineDensityMedium {...iconProps} />;
    case 'xs':
      return <IconBaselineDensitySmall {...iconProps} />;
    case 'xl':
      return <IconBaselineDensityLarge {...iconProps} />;
    default:
      return <IconBaselineDensityMedium {...iconProps} />;
  }
};

/**
 * Utility function to cycle through density options
 * @param currentDensity - Current density setting
 * @returns Next density setting in the cycle
 */
const getNextDensity = (currentDensity: string): 'xs' | 'md' | 'xl' => {
  const densityMap: Record<string, 'xs' | 'md' | 'xl'> = {
    'xs': 'md',
    'md': 'xl',
    'xl': 'xs'
  };
  return densityMap[currentDensity] || 'md';
};

// =============================================================================
// SUB-COMPONENTS
// =============================================================================

/**
 * Reusable action icon component with consistent styling
 * Used for fullscreen and density toggle buttons
 */
const ActionIconButton: React.FC<ActionIconButtonProps> = ({ 
  onClick, 
  ariaLabel, 
  icon, 
  testId 
}) => (
  <ActionIcon
    variant="subtle"
    onClick={onClick}
    aria-label={ariaLabel}
    style={ACTION_ICON_STYLES}
    data-testid={testId}
  >
    {icon}
  </ActionIcon>
);

/**
 * Filter toggle button with indicator support
 * Shows an indicator dot when filters are active
 * Conditionally renders ActionIcon (icon-only) or Button (icon+text) based on text prop
 */
const FilterIconButton: React.FC<FilterIconButtonProps> = ({ 
  onClick, 
  areFiltersShown,
  text
}) => {
  const icon = <IconFilter size={18} style={ICON_STYLES} />;
  
  // If no text provided or empty string, use ActionIcon for icon-only display with perfect centering
  if (!text || text.trim() === '') {
    return (
      <ActionIcon
        data-testid="additional-filter-toggle"
        onClick={onClick}
        aria-label={translate("table.filters.toggle.aria")}
        style={{
          width: rem(30),
          height: rem(30),
          borderRadius: 'var(--mantine-radius-sm)',
          border: areFiltersShown 
            ? '1px solid var(--ad-color-brand-primary)' 
            : '1px solid var(--ad-color-border-default)',
          background: 'var(--ad-white)',
          color: 'var(--ad-color-text-default)',
        }}
      >
        {icon}
      </ActionIcon>
    );
  }

  // If text is provided, use Button with leftSection for icon + text display
  return (
    <Button
      data-testid="additional-filter-toggle"
      variant={areFiltersShown ? "outline" : "default"}
      onClick={onClick}
      aria-label={translate("table.filters.toggle.aria")}
      size="xs"
      leftSection={icon}
      style={{
        height: rem(30),
        borderRadius: 'var(--mantine-radius-sm)',
        border: areFiltersShown 
          ? '1px solid var(--ad-color-brand-primary)' 
          : '1px solid var(--ad-color-border-default)',
        background: 'var(--ad-white)',
      }}
    >
      {text}
    </Button>
  );
};

/**
 * Active filters display section
 * Shows filter chips for currently applied filters and clear all button
 */
interface ActiveFiltersProps {
  filters: Filters;
  onClearFilters: () => void;
  onRemoveCity: (cityToRemove: City) => void;
  onRemoveDateRange: () => void;
}

const ActiveFilters: React.FC<ActiveFiltersProps> = ({
  filters,
  onClearFilters,
  onRemoveCity,
  onRemoveDateRange,
}) => {
  const { cities, dateRange } = filters;

  return (
    <>
      {/* Clear all filters button */}
      <Text
        size="xs"
        span
        role="button"
        fw={600}
        style={{ cursor: "pointer" }}
        onClick={onClearFilters}
        c="blue"
        data-testid="clear-filters"
      >
        {translate("table.filters.clear.filters")}
      </Text>

      {/* City filter chips */}
      {cities && cities.map((city) => (
        <FilterChip
          key={city}
          label={city}
          onClick={() => onRemoveCity(city)}
        />
      ))}

      {/* Date range filter chip */}
      {dateRange && (
        <FilterChip
          label={translate("table.filters.chip.date.range.label", {
            startDate: dateRange.start?.toLocaleDateString(undefined, DATE_FORMAT_OPTIONS) || '',
            endDate: dateRange.end?.toLocaleDateString(undefined, DATE_FORMAT_OPTIONS) || '',
          })}
          onClick={onRemoveDateRange}
        />
      )}
    </>
  );
};

/**
 * Toolbar action buttons section
 * Contains fullscreen toggle and density toggle buttons
 */
interface ToolbarActionsProps<T extends MRT_RowData> {
  table: MRTTableInstance<T>;
}

const ToolbarActions = <T extends MRT_RowData>({ table }: ToolbarActionsProps<T>) => {
  const isFullScreen = table.getState().isFullScreen ?? false;
  const currentDensity = table.getState().density;

  const handleFullscreenToggle = () => {
    table.setIsFullScreen(!isFullScreen);
  };

  const handleDensityToggle = () => {
    const nextDensity = getNextDensity(currentDensity);
    table.setDensity(nextDensity);
  };

  return (
    <Inline justify="flex-end" gap="xs">
      {/* Fullscreen toggle button */}
      <ActionIconButton
        onClick={handleFullscreenToggle}
        ariaLabel={isFullScreen ? "Exit fullscreen" : "Enter fullscreen"}
        icon={isFullScreen ? 
          <IconMinimize size={18} style={ICON_STYLES} /> : 
          <IconMaximize size={18} style={ICON_STYLES} />
        }
      />

      {/* Density toggle button */}
      <ActionIconButton
        onClick={handleDensityToggle}
        ariaLabel="Toggle density"
        icon={getDensityIcon(currentDensity)}
        testId="toggle-dense-padding"
      />
    </Inline>
  );
};

/**
 * Expandable filters section
 * Contains date range and city selection filters
 */
interface ExpandableFiltersProps {
  visible: boolean;
  locale: string;
  cities: City[] | null | undefined;
  onDateChange: (value: DatesRangeValue | null) => void;
  onCityChange: (value: string[] | null) => void;
  dateRangeSelectorKey: number;
}

const ExpandableFilters: React.FC<ExpandableFiltersProps> = ({
  visible,
  locale,
  cities,
  onDateChange,
  onCityChange,
  dateRangeSelectorKey,
}) => {
  if (!visible) return null;

  return (
    <SimpleGrid data-testid="additional-filters" cols={3} spacing="xs" role="menu">
      {/* Date range selector */}
      <DateRangeSelector
        key={dateRangeSelectorKey}
        label={translate("table.filters.applied.on")}
        locale={locale}
        onChange={onDateChange}
      />

      {/* City multi-select filter */}
      <SelectFilter
        label={translate("table.filters.city")}
        onChange={onCityChange}
        selectedValue={(cities as string[]) || null}
        placeholderEmpty={translate("table.filters.placeholder.all")}
        placeholderWithSelection={translate("table.filters.placeholder.select.more")}
        data={CITY_OPTIONS}
      />
    </SimpleGrid>
  );
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================

/**
 * CustomTopToolbar - Main toolbar component for data tables
 * 
 * Features:
 * - Search functionality
 * - Filter toggle with indicator
 * - Active filter chips with remove functionality
 * - Fullscreen and density controls
 * - Expandable filter section (date range, city selection)
 * - Result count display
 * - Selection alert banner integration
 * 
 * @param props - CustomTopToolbarProps containing all necessary data and handlers
 */
const CustomTopToolbar = <T extends MRT_RowData>({
  filtersState,
  locale,
  resultCount,
  totalCount,
  onChange,
  table,
  numberOfSelectedRows,
  isLoading,
  showFilters,
  onFilterToggleChange,
}: CustomTopToolbarProps<T>): ReactElement => {
  
  // =============================================================================
  // STATE MANAGEMENT
  // =============================================================================
  
  const { searchTerm, cities, dateRange } = filtersState;
  const [dateRangeSelectorRefreshKey, setDateRangeSelectorRefreshKey] = useState<number>(0);
  const [showFiltersState, setShowFiltersState] = useState(showFilters);

  // =============================================================================
  // EFFECTS
  // =============================================================================
  
  /**
   * Reset date range selector when date range is cleared
   * This forces the component to re-render and clear its internal state
   */
  useEffect(() => {
    if (dateRange === null) {
      setDateRangeSelectorRefreshKey(prev => prev + 1);
    }
  }, [dateRange]);

  // =============================================================================
  // EVENT HANDLERS
  // =============================================================================
  
  /**
   * Handles date range selection changes
   * Processes the raw date selection and converts it to our DateRange format
   */
  const handleDateChange = (value: DatesRangeValue | null): void => {
    const processedRange = processDateRangeSelection(value);
    
    // Only update if we have a complete range or null (clear)
    if (processedRange !== null || value === null) {
      onChange({ dateRange: processedRange });
    }
  };

  /**
   * Toggles the visibility of the expandable filters section
   */
  const handleFilterToggle = (): void => {
    const newShowFilters = !showFiltersState;
    setShowFiltersState(newShowFilters);
    onFilterToggleChange?.();
  };

  /**
   * Clears all applied filters except search term
   */
  const handleClearAllFilters = (): void => {
    onChange({
      searchTerm,
      cities: null,
      dateRange: null,
    });
    setDateRangeSelectorRefreshKey(prev => prev + 1);
  };

  /**
   * Removes a specific city from the cities filter
   */
  const handleRemoveCity = (cityToRemove: City): void => {
    const updatedCities = cities?.filter((city) => city !== cityToRemove) || [];
    onChange({
      cities: updatedCities.length > 0 ? updatedCities : null,
    });
  };

  /**
   * Removes the date range filter
   */
  const handleRemoveDateRange = (): void => {
    onChange({ dateRange: null });
  };

  /**
   * Handles search term changes
   */
  const handleSearchChange = (value: string): void => {
    onChange({ searchTerm: value });
  };

  /**
   * Handles city selection changes
   */
  const handleCityChange = (value: string[] | null): void => {
    onChange({ cities: value as City[] | null });
  };

  // =============================================================================
  // COMPUTED VALUES
  // =============================================================================
  
  const filtersAreActive = hasActiveFilters(filtersState);

  // Get correct result counts from table state
  const currentFilteredTotal = table.getFilteredRowModel().rows.length; // Total filtered results across all pages
  const totalRecords = table.getCoreRowModel().rows.length; // Total unfiltered records
  const currentPageSize = table.getState().pagination.pageSize;
  const currentPageData = table.getRowModel().rows.length; // Current page only

  // Determine the correct counts to display based on filter state and server-side vs client-side
  let displayResultCount: number;
  let displayTotalCount: number;

  if (totalCount !== undefined) {
    // Server-side/manual pagination: use provided props
    displayTotalCount = totalCount;
    
    if (filtersAreActive) {
      // When filters are active, show filtered count vs total
      displayResultCount = resultCount;
    } else {
      // When no filters are active, show total count only
      displayResultCount = totalCount;
    }
  } else {
    // Client-side pagination with full dataset: use table instance methods
    if (filtersAreActive) {
      // When filters are active, show filtered count
      displayResultCount = currentFilteredTotal;
      displayTotalCount = totalRecords;
    } else {
      // When no filters are active, show total count only
      displayResultCount = totalRecords;
      displayTotalCount = totalRecords;
    }
  }

  // =============================================================================
  // RENDER
  // =============================================================================
  
  return (
    <>
      {/* Main toolbar content */}
      <Stack
        p="md"
        gap="xshalf"
        style={{
          borderBottom: "1px solid var(--ad-color-border-subtle)",
        }}
      >
        {/* Top row: Search and action buttons */}
        <Grid gap="md">
          <Grid.Col span={{ base: 12, md: 6 }}>
            {/* Left side: Filter toggle and search */}
            <Inline gap="xs" align="center">
              {/* Filter toggle button with optional indicator */}
              {filtersAreActive ? (
                <Indicator size="8">
                  <FilterIconButton
                    areFiltersShown={showFiltersState}
                    onClick={handleFilterToggle}
                    text=""
                  />
                </Indicator>
              ) : (
                <FilterIconButton
                  areFiltersShown={showFiltersState}
                  onClick={handleFilterToggle}
                  text=""
                />
              )}

              {/* Search input */}
              <SearchFilter
                searchTerm={searchTerm as string}
                onChange={handleSearchChange}
              />
            </Inline>
          </Grid.Col>

          {/* Right side: Action buttons */}
          <Grid.Col span={{ base: 12, md: 6 }}>
            <ToolbarActions table={table} />
          </Grid.Col>
        </Grid>

        {/* Second row: Active filters and result count */}
        <Inline justify="space-between">
          <Inline gap="xs">
            {/* Show active filters if any exist */}
            {filtersAreActive && (
              <ActiveFilters
                filters={filtersState}
                onClearFilters={handleClearAllFilters}
                onRemoveCity={handleRemoveCity}
                onRemoveDateRange={handleRemoveDateRange}
              />
            )}
            
            {/* Result count display */}
            <ResultCount 
              resultCount={displayResultCount} 
              totalCount={displayTotalCount}
              isLoading={isLoading ?? false} 
              hasActiveFilters={filtersAreActive}
            />
          </Inline>
        </Inline>

        {/* Expandable filters section */}
        <ExpandableFilters
          visible={showFiltersState}
          locale={locale}
          cities={cities}
          onDateChange={handleDateChange}
          onCityChange={handleCityChange}
          dateRangeSelectorKey={dateRangeSelectorRefreshKey}
        />
      </Stack>

      {/* Selection alert banner */}
      <MRTToolbarAlertBanner
        stackAlertBanner
        table={table as any}
        bg="blue"
        numberofselectedrows={numberOfSelectedRows}
        style={{
          borderRadius: 0,
          color: 'var(--ad-white)',
          borderTop: '1px solid var(--ad-color-brand-primary)',
          padding: 'var(--mantine-spacing-xs)',
        }}
      />
    </>
  );
};

export default CustomTopToolbar;
