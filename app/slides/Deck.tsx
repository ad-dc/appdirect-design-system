'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  Badge,
  Box,
  Grid,
  Inline,
  Stack,
  Text,
  Title,
} from '@/components/DesignSystem';
import { BUILDING_BLOCKS, SHOWCASE_PROMPT, SLIDES } from './slides';

const NAVY = '#011B58';
const NAVY_LIFT = '#0A2A6E';
const PRIMARY = '#326FDE';

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
        <Box w={180} h={8} bg={PRIMARY} radius="xs" />

        <Grid gutter="xxl" align="center">
          <Grid.Col span={{ base: 12, md: 5 }}>
            <Stack gap="lg">
              <Text size="sm" tt="uppercase" lts={2} c={PRIMARY} fw={600}>
                Working toward
              </Text>
              <Title order={1} c="gray.0" fz={48} lh={1.15} fw={700}>
                Three surfaces.
                <br />
                One factory.
              </Title>
              <Text size="lg" c="gray.3" maw={440}>
                An agent should not invent product UI. It should traverse these
                three surfaces — then the prototype template tells us if it
                stayed on contract.
              </Text>
              <Box bg={NAVY_LIFT} p="lg" radius="md">
                <Text size="xs" tt="uppercase" lts={1} c={PRIMARY} fw={600} mb="xs">
                  Showcase prompt
                </Text>
                <Text size="sm" c="gray.0" ff="monospace" lh={1.6}>
                  {SHOWCASE_PROMPT}
                </Text>
              </Box>
            </Stack>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 7 }}>
            <Stack gap="lg">
              {BUILDING_BLOCKS.map((block) => (
                <Box key={block.number} bg={NAVY_LIFT} p="lg" radius="md">
                  <Inline gap="lg" align="flex-start" wrap="nowrap">
                    <Text fz={32} fw={700} c={PRIMARY} ff="monospace" lh={1}>
                      {block.number}
                    </Text>
                    <Stack gap="xs">
                      <Title order={3} c="gray.0">
                        {block.title}
                      </Title>
                      <Text size="md" c="gray.3">
                        {block.body}
                      </Text>
                      <Inline gap="xs" mt="xs">
                        {block.tags.map((tag) => (
                          <Badge key={tag} variant="outline" color="info">
                            {tag}
                          </Badge>
                        ))}
                      </Inline>
                    </Stack>
                  </Inline>
                </Box>
              ))}
            </Stack>
          </Grid.Col>
        </Grid>

        <Inline justify="space-between" align="center">
          <Text size="xs" ff="monospace" c="gray.5">
            › SHOW BUILDING BLOCKS
          </Text>
          <Text size="xs" ff="monospace" c="gray.5">
            {slide.number}  {slide.name}
          </Text>
        </Inline>
      </Stack>
    </Box>
  );
}
