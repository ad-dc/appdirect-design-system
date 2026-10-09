import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { Box, Container, Paper } from '@/components/DesignSystem';
import { ReadmeDocument } from './ReadmeDocument';

/** Shared README landing page for `/` and legacy `/prototype`. */
export default async function HomeReadmePage() {
  const markdown = await readFile(path.join(process.cwd(), 'README.md'), 'utf8');

  return (
    <Box bg="gray.0" mih="100vh" py="xl" px="md">
      <Container size="md">
        <Paper p="xl" radius="md" withBorder bg="white">
          <ReadmeDocument markdown={markdown} />
        </Paper>
      </Container>
    </Box>
  );
}
