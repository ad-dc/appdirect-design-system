/**
 * AppDirect Design System Components
 * 
 * This module exports all AppDirect design system components built on top of Mantine.
 * Components are organized by category and provide consistent styling,
 * behavior, and API across the application.
 * 
 * @example
 * // Import specific components
 * import { Button, TextInput, Badge } from '@/components/DesignSystem';
 * 
 * @example
 * // Import by category
 * import { Inputs, Buttons, DataDisplay } from '@/components/DesignSystem';
 */

// Import components for category exports
import { TextInput, TextArea, NumberInput, ColorInput, Slider, Switch, SegmentedControl, Checkbox, Radio, RadioGroup, DropZone, FileInput } from './Inputs';
import { Button, ActionIcon, CloseButton } from './Buttons';
import { Alert, Avatar, Badge, Card, CardSection, Chip, Pill, Indicator, Progress, ThemeIcon, List, Table, Skeleton, LoadingOverlay } from './DataDisplay';
import { SearchableSelect, AutocompleteClearable, Multiselect, Select, Combobox } from './Combobox';
import { Breadcrumb, BackBreadcrumb, NavLink, Stepper, Tabs } from './Navigation';
import { Drawer, Menu, Modal, ConfirmationModal, Popover, ConfirmationPopover, Tooltip } from './Overlays';
import { Kbd, Code, Text, Title, Anchor } from './Typography';
import { Divider, Paper } from './Misc';
import { Stack, Group, Inline, Box, SimpleGrid, Grid, Flex, Container, Center } from './Layout';
import { AppShellLayout, HeaderBar, SidebarNav, SidebarNavLink, SingleColumnLayout, TertiaryColumnLayout } from './Shell';
import { KeyInsight } from './ComplexComponents/KeyInsight';
import { NameValue, NameValueItem } from './ComplexComponents/NameValue';
import { CopyButton } from './ComplexComponents/Utilities';
import { PageContentHeader, DescriptionBlock } from './ComplexComponents/PageContentHeader';
import { DataTable } from './ComplexComponents/DataTable';
import { DashboardWidget } from './ComplexComponents/DashboardWidget';

// ========================== INPUTS ==========================
export { TextInput, TextArea, NumberInput, ColorInput, Slider, Switch, SegmentedControl, Checkbox, Radio, RadioGroup, DropZone, FileInput } from './Inputs';
export type { DSTextInputProps, DSTextAreaProps, DSNumberInputProps, DSColorInputProps, DSSliderProps, DSSwitchProps, DSSegmentedControlProps, DSCheckboxProps, DSRadioProps, DSRadioGroupProps, DropZoneProps, DSFileInputProps } from './Inputs';

// ========================== BUTTONS ==========================
export { Button, ActionIcon, CloseButton } from './Buttons';
export type { DSButtonProps, DSActionIconProps, DSCloseButtonProps } from './Buttons';

// ========================== COMBOBOX ==========================
export { SearchableSelect, AutocompleteClearable, Multiselect, Select, Combobox } from './Combobox';
export type { DSSearchableSelectProps, DSAutocompleteClearableProps, DSMultiselectProps, DSSelectProps, DSComboboxProps } from './Combobox';

// ========================== NAVIGATION ==========================
export { Breadcrumb, BackBreadcrumb, NavLink, Stepper, Tabs } from './Navigation';
export type { DSBreadcrumbProps, DSBackBreadcrumbProps, BreadcrumbItem, DSNavLinkProps, DSStepperProps, DSTabsProps } from './Navigation';

// ========================== OVERLAYS ==========================
export { Drawer, Menu, Modal, ConfirmationModal, Popover, ConfirmationPopover, Tooltip } from './Overlays';
export type { DSDrawerProps, DSMenuProps, MenuItem, MenuSection, DSModalProps, ConfirmationModalProps, DSPopoverProps, PopoverAction, ConfirmationPopoverProps, DSTooltipProps } from './Overlays';

// ========================== DATA DISPLAY ==========================
export { Alert, Avatar, Badge, Card, CardSection, Chip, Pill, Indicator, Progress, ThemeIcon, List, Table, Skeleton, LoadingOverlay } from './DataDisplay';
export type { DSAlertProps, DSAvatarProps, AvatarVariant, AvatarSize, DSBadgeProps, DSCardProps, DSCardSectionProps, DSChipProps, DSPillProps, DSIndicatorProps, DSProgressProps, DSThemeIconProps, ThemeIconSize, ThemeIconColor, DSListProps, DSTableProps, DSSkeletonProps, DSLoadingOverlayProps } from './DataDisplay';

// ========================== TYPOGRAPHY ==========================
export { Kbd, Code, Text, Title, Anchor } from './Typography';
export type { DSKbdProps, DSCodeProps, DSTextProps, DSTitleProps, DSAnchorProps } from './Typography';

// ========================== MISC ==========================
export { Divider, Paper } from './Misc';
export type { DSDividerProps, DSPaperProps } from './Misc';

// ========================== LAYOUT ==========================
export { Stack, Group, Inline, Box, SimpleGrid, Grid, Flex, Container, Center } from './Layout';
export type {
  DSStackProps,
  DSGroupProps,
  DSInlineProps,
  DSBoxProps,
  DSSimpleGridProps,
  DSGridProps,
  DSGridColProps,
  DSFlexProps,
  DSContainerProps,
  DSCenterProps,
  SpacingScale,
} from './Layout';

// ========================== SHELL ==========================
export { AppShellLayout, HeaderBar, SidebarNav, SidebarNavLink, SingleColumnLayout, TertiaryColumnLayout } from './Shell';
export type { DSAppShellLayoutProps, DSHeaderBarProps, DSSidebarNavProps, NavItem, DSSidebarNavLinkProps, DSSingleColumnLayoutProps, DSTertiaryColumnLayoutProps } from './Shell';

// ========================== COMPLEX COMPONENTS ==========================
export { KeyInsight } from './ComplexComponents/KeyInsight';
export type { KeyInsightProps } from './ComplexComponents/KeyInsight';
export { NameValue, NameValueItem } from './ComplexComponents/NameValue';
export type { NameValueProps, NameValuePair, NameValueItemProps } from './ComplexComponents/NameValue';
export { CopyButton } from './ComplexComponents/Utilities';
export type { CopyButtonProps } from './ComplexComponents/Utilities';
export { PageContentHeader, DescriptionBlock } from './ComplexComponents/PageContentHeader';
export type { PageContentHeaderProps, ContentSection, DescriptionBlockProps } from './ComplexComponents/PageContentHeader';
export { DataTable } from './ComplexComponents/DataTable';
export type { DataTableProps, DataTableColumn, PageInfo } from './ComplexComponents/DataTable';
export { DashboardWidget } from './ComplexComponents/DashboardWidget';
export type { DashboardWidgetProps, DashboardWidgetLink } from './ComplexComponents/DashboardWidget';

// ========================== CATEGORY EXPORTS ==========================
// Export components grouped by category for convenient importing
export const Inputs = {
  TextInput,
  TextArea,
  NumberInput,
  ColorInput,
  Slider,
  Switch,
  SegmentedControl,
  Checkbox,
  Radio,
  RadioGroup,
  DropZone,
  FileInput,
};

export const Buttons = {
  Button,
  ActionIcon,
  CloseButton,
};

export const ComboboxComponents = {
  SearchableSelect,
  AutocompleteClearable,
  Multiselect,
  Select,
  Combobox,
};

export const Navigation = {
  Breadcrumb,
  BackBreadcrumb,
  NavLink,
  Stepper,
  Tabs,
};

export const Overlays = {
  Drawer,
  Menu,
  Modal,
  ConfirmationModal,
  Popover,
  ConfirmationPopover,
  Tooltip,
};

export const DataDisplay = {
  Alert,
  Avatar,
  Badge,
  Card,
  CardSection,
  Chip,
  Pill,
  Indicator,
  Progress,
  ThemeIcon,
  List,
  Table,
  Skeleton,
  LoadingOverlay,
};

export const Typography = {
  Kbd,
  Code,
  Text,
  Title,
  Anchor,
};

export const Misc = {
  Divider,
  Paper,
};

export const Layout = {
  Stack,
  Group,
  Inline,
  Box,
  SimpleGrid,
  Grid,
  Flex,
  Container,
  Center,
};

export const Shell = {
  AppShellLayout,
  HeaderBar,
  SidebarNav,
  SidebarNavLink,
  SingleColumnLayout,
  TertiaryColumnLayout,
};

export const ComplexComponents = {
  KeyInsight,
  NameValue,
  NameValueItem,
  CopyButton,
  PageContentHeader,
  DescriptionBlock,
  DataTable,
  DashboardWidget,
};

// Placeholder export to prevent empty module errors
export {}; 