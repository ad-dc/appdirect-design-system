import {
  Badge,
  Box,
  Button,
  Center,
  Grid,
  Inline,
  Stack,
  Text,
  Title,
} from '@/components/DesignSystem';
import { CODE_CONNECT_MAPPINGS } from './slides';
import { NAVY_LIFT, PRIMARY } from './theme';

function Arrow() {
  return (
    <Center h="100%">
      <Text fz={28} c={PRIMARY} fw={700} ff="monospace">
        →
      </Text>
    </Center>
  );
}

export function CodeConnectSlide() {
  return (
    <Stack gap="xl" h="100%" justify="space-between">
      <Inline justify="space-between" align="flex-start" wrap="nowrap">
        <Stack gap="sm" maw={760}>
          <Text size="sm" tt="uppercase" lts={2} c={PRIMARY} fw={600}>
            Code Connect
          </Text>
          <Title order={1} c="gray.0" fz={40} lh={1.15} fw={700}>
            The Figma component is not the API.
          </Title>
          <Text size="lg" c="gray.3" maw={640}>
            Code Connect maps that component onto DS source. Agents read
            variant, size, and children from the connected spec — they do not
            invent a Button from a screenshot.
          </Text>
        </Stack>
        <Box w={120} h={8} bg={PRIMARY} radius="xs" mt="sm" />
      </Inline>

      <Grid gutter="md" align="stretch">
        <Grid.Col span={{ base: 12, md: 3 }}>
          <Box bg={NAVY_LIFT} p="lg" radius="md" h="100%">
            <Stack gap="lg" h="100%" justify="space-between">
              <Stack gap="xs">
                <Text size="xs" tt="uppercase" lts={1} c={PRIMARY} fw={600}>
                  In Figma
                </Text>
                <Title order={4} c="gray.0">
                  Button
                </Title>
              </Stack>
              <Box>
                <Button variant="primary" size="sm">
                  Save
                </Button>
              </Box>
              <Text size="sm" c="gray.4" ff="monospace">
                primary · sm
              </Text>
            </Stack>
          </Box>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 1 }} visibleFrom="md">
          <Arrow />
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 4 }}>
          <Box bg={NAVY_LIFT} p="lg" radius="md" h="100%">
            <Stack gap="md">
              <Stack gap="xs">
                <Text size="xs" tt="uppercase" lts={1} c={PRIMARY} fw={600}>
                  In Code Connect
                </Text>
                <Title order={4} c="gray.0">
                  Button.figma.tsx
                </Title>
              </Stack>
              <Text size="sm" c="gray.3" ff="monospace">
                figma.connect(Button, …)
              </Text>
              <Stack gap="xs">
                {CODE_CONNECT_MAPPINGS.map((row) => (
                  <Inline key={row.figma} justify="space-between" gap="md" wrap="nowrap">
                    <Text size="sm" c="gray.0" ff="monospace">
                      {row.figma}
                    </Text>
                    <Text size="sm" c={PRIMARY} ff="monospace">
                      {row.connect}
                    </Text>
                  </Inline>
                ))}
              </Stack>
              <Inline gap="xs">
                <Badge variant="outline" color="info">
                  figma.enum
                </Badge>
                <Badge variant="outline" color="info">
                  Dev Mode
                </Badge>
              </Inline>
            </Stack>
          </Box>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 1 }} visibleFrom="md">
          <Arrow />
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 3 }}>
          <Box bg={NAVY_LIFT} p="lg" radius="md" h="100%">
            <Stack gap="md" h="100%" justify="space-between">
              <Stack gap="xs">
                <Text size="xs" tt="uppercase" lts={1} c={PRIMARY} fw={600}>
                  In the agent&apos;s hand
                </Text>
                <Title order={4} c="gray.0">
                  DS snippet
                </Title>
              </Stack>
              <Text size="sm" c="gray.0" ff="monospace" lh={1.7}>
                {'<Button'}
                <br />
                {'  variant="primary"'}
                <br />
                {'  size="sm"'}
                <br />
                {'>'}
                <br />
                {'  Save'}
                <br />
                {'</Button>'}
              </Text>
              <Text size="sm" c="gray.4">
                Real props. Real wrapper.
              </Text>
            </Stack>
          </Box>
        </Grid.Col>
      </Grid>

      <Text size="md" c="gray.3" maw={760}>
        Canonical correctness stays DS source. Code Connect is the bridge — not
        a second source of truth.
      </Text>
    </Stack>
  );
}
