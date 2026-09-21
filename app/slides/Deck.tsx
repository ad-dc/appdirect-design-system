'use client';

import { useCallback, useEffect, useState } from 'react';
import { Box, Inline, Stack, Text } from '@/components/DesignSystem';
import { BuildingBlocksSlide } from './BuildingBlocksSlide';
import { CodeConnectSlide } from './CodeConnectSlide';
import { SLIDES } from './slides';
import { NAVY } from './theme';

function slideFromHash() {
  if (typeof window === 'undefined') return 0;
  const id = window.location.hash.replace(/^#/, '');
  const index = SLIDES.findIndex((slide) => slide.id === id);
  return index >= 0 ? index : 0;
}

export function Deck() {
  const [index, setIndex] = useState(0);
  const last = SLIDES.length - 1;

  const go = useCallback(
    (delta: number) => {
      setIndex((current) => Math.min(last, Math.max(0, current + delta)));
    },
    [last]
  );

  useEffect(() => {
    setIndex(slideFromHash());
    const onHash = () => setIndex(slideFromHash());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  useEffect(() => {
    const id = SLIDES[index]?.id;
    if (!id) return;
    if (window.location.hash.replace(/^#/, '') !== id) {
      window.history.replaceState(null, '', `#${id}`);
    }
  }, [index]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight' || event.key === 'PageDown') go(1);
      if (event.key === 'ArrowLeft' || event.key === 'PageUp') go(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [go]);

  const slide = SLIDES[index];

  return (
    <Box h="100vh" bg={NAVY} px="xxl" py="xl">
      <Stack h="100%" justify="space-between" gap="xl">
        <Box flex={1} mih={0} h="100%">
          {slide?.id === 'building-blocks' ? <BuildingBlocksSlide /> : null}
          {slide?.id === 'code-connect' ? <CodeConnectSlide /> : null}
        </Box>

        <Inline justify="space-between" align="center">
          <Text size="xs" ff="monospace" c="gray.5">
            {slide?.command}
          </Text>
          <Text size="xs" ff="monospace" c="gray.5">
            {slide?.number}  {slide?.name}
          </Text>
        </Inline>
      </Stack>
    </Box>
  );
}
