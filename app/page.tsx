import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { Box, Container, Paper } from '@/components/DesignSystem';
import { ReadmeDocument } from './ReadmeDocument';

export default async function HomePage() {
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
