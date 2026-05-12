import React, { ReactElement } from "react";
import { Text, ActionIcon } from '@mantine/core';
import { Inline } from '@/components/DesignSystem';
import { Button } from '@/components/DesignSystem';
import { IconX } from '@tabler/icons-react';
import { RiFlashlightFill } from '@remixicon/react';
import { translate } from '../translations';

interface CustomToolbarAlertBannerContentProps {
  numberOfSelectedRows: number;
  onClearSelection: () => void;
}

const CustomToolbarAlertBannerContent = ({
  numberOfSelectedRows,
  onClearSelection,
}: CustomToolbarAlertBannerContentProps): ReactElement => {
  
  if (numberOfSelectedRows === 0) {
    return <></>;
  }

  const selectedRowsText = numberOfSelectedRows === 1 
    ? translate("table.selected.row") 
    : translate("table.selected.rows", { count: numberOfSelectedRows });
  

  return (
    <Inline
      gap="sm"
      align="center"
      style={{
        background: 'var(--ad-color-brand-primary)',
        color: 'var(--ad-white)',
        borderRadius: 0,
        minHeight: 'var(--mantine-spacing-xl)',
      }}
    >
      <ActionIcon
        variant="transparent"
        color="white"
        onClick={onClearSelection}
        aria-label="Clear selection"

        size="sm"
      >
        <IconX size={16} />
      </ActionIcon>
      <Button
        variant="outline"
        color="gray"
        size="xs"
        leftSection={<RiFlashlightFill size={16} />}
        style={{ borderColor: 'white', color: 'white' }}
      >
        Button one
      </Button>
      <Button
        variant="outline"
        color="gray"
        size="xs"
        leftSection={<RiFlashlightFill size={16} />}
        style={{ borderColor: 'white', color: 'white' }}
      >
        Button two
      </Button>
      <Text size="sm" c="white" fw={500}>
        {selectedRowsText}
      </Text>
    </Inline>
  );
};

export default CustomToolbarAlertBannerContent; 