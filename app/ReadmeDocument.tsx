'use client';

import type { ReactNode } from 'react';
import {
  Box,
  Code,
  Divider,
  List,
  Stack,
  Text,
  Title,
} from '@/components/DesignSystem';

type InlineToken =
  | { type: 'text'; value: string }
  | { type: 'code'; value: string }
  | { type: 'link'; href: string; value: string }
  | { type: 'strong'; value: string }
  | { type: 'em'; value: string };

type Block =
  | { type: 'heading'; depth: 1 | 2 | 3 | 4 | 5 | 6; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'code'; value: string }
  | { type: 'list'; ordered: boolean; items: string[] }
  | { type: 'blockquote'; text: string }
  | { type: 'hr' };

function parseInline(text: string): InlineToken[] {
  const tokens: InlineToken[] = [];
  const pattern =
    /(`[^`]+`)|(\[[^\]]+\]\([^)]+\))|(\*\*[^*]+\*\*)|(__[^_]+__)|(\*[^*]+\*)|(_[^_]+_)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      tokens.push({ type: 'text', value: text.slice(lastIndex, match.index) });
    }

    const [raw, code, link, strongStar, strongUnder, emStar, emUnder] = match;
    if (code) {
      tokens.push({ type: 'code', value: code.slice(1, -1) });
    } else if (link) {
      const linkMatch = link.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (linkMatch) {
        tokens.push({ type: 'link', value: linkMatch[1], href: linkMatch[2] });
      } else {
        tokens.push({ type: 'text', value: raw });
      }
    } else if (strongStar || strongUnder) {
      tokens.push({ type: 'strong', value: raw.slice(2, -2) });
    } else if (emStar || emUnder) {
      tokens.push({ type: 'em', value: raw.slice(1, -1) });
    }

    lastIndex = match.index + raw.length;
  }

  if (lastIndex < text.length) {
    tokens.push({ type: 'text', value: text.slice(lastIndex) });
  }

  return tokens.length ? tokens : [{ type: 'text', value: text }];
}

function renderInline(text: string): ReactNode {
  return parseInline(text).map((token, index) => {
    switch (token.type) {
      case 'code':
        return (
          <Code key={index} fz="sm">
            {token.value}
          </Code>
        );
      case 'link': {
        const external = /^https?:\/\//.test(token.href);
        return (
          <a
            key={index}
            href={token.href}
            {...(external
              ? { target: '_blank', rel: 'noopener noreferrer' }
              : {})}
          >
            <Text span c="blue" td="underline">
              {token.value}
            </Text>
          </a>
        );
      }
      case 'strong':
        return (
          <Text key={index} span fw={700}>
            {token.value}
          </Text>
        );
      case 'em':
        return (
          <Text key={index} span fs="italic">
            {token.value}
          </Text>
        );
      default:
        return <span key={index}>{token.value}</span>;
    }
  });
}

function parseMarkdown(markdown: string): Block[] {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  const blocks: Block[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (!line.trim()) {
      i += 1;
      continue;
    }

    if (/^---+$/.test(line.trim())) {
      blocks.push({ type: 'hr' });
      i += 1;
      continue;
    }

    const heading = line.match(/^(#{1,6})\s+(.*)$/);
    if (heading) {
      blocks.push({
        type: 'heading',
        depth: heading[1].length as 1 | 2 | 3 | 4 | 5 | 6,
        text: heading[2].trim(),
      });
      i += 1;
      continue;
    }

    if (line.startsWith('```')) {
      i += 1;
      const codeLines: string[] = [];
      while (i < lines.length && !lines[i].startsWith('```')) {
        codeLines.push(lines[i]);
        i += 1;
      }
      if (i < lines.length) i += 1;
      blocks.push({ type: 'code', value: codeLines.join('\n') });
      continue;
    }

    if (/^>\s?/.test(line)) {
      const quoteLines: string[] = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) {
        quoteLines.push(lines[i].replace(/^>\s?/, ''));
        i += 1;
      }
      blocks.push({ type: 'blockquote', text: quoteLines.join(' ') });
      continue;
    }

    if (/^\s*[-*]\s+/.test(line) || /^\s*\d+\.\s+/.test(line)) {
      const ordered = /^\s*\d+\.\s+/.test(line);
      const items: string[] = [];
      while (
        i < lines.length &&
        (ordered ? /^\s*\d+\.\s+/.test(lines[i]) : /^\s*[-*]\s+/.test(lines[i]))
      ) {
        items.push(
          lines[i].replace(ordered ? /^\s*\d+\.\s+/ : /^\s*[-*]\s+/, '').trim()
        );
        i += 1;
      }
      blocks.push({ type: 'list', ordered, items });
      continue;
    }

    const paragraphLines: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() &&
      !lines[i].startsWith('#') &&
      !lines[i].startsWith('```') &&
      !/^---+$/.test(lines[i].trim()) &&
      !/^>\s?/.test(lines[i]) &&
      !/^\s*[-*]\s+/.test(lines[i]) &&
      !/^\s*\d+\.\s+/.test(lines[i])
    ) {
      paragraphLines.push(lines[i].trim());
      i += 1;
    }
    blocks.push({ type: 'paragraph', text: paragraphLines.join(' ') });
  }

  return blocks;
}

export function ReadmeDocument({ markdown }: { markdown: string }) {
  const blocks = parseMarkdown(markdown);

  return (
    <Stack gap="md">
      {blocks.map((block, index) => {
        switch (block.type) {
          case 'heading':
            return (
              <Title key={index} order={block.depth} mt={index === 0 ? 0 : 'sm'}>
                {renderInline(block.text)}
              </Title>
            );
          case 'paragraph':
            return <Text key={index}>{renderInline(block.text)}</Text>;
          case 'code':
            return (
              <Code key={index} block>
                {block.value}
              </Code>
            );
          case 'list':
            return (
              <List key={index} type={block.ordered ? 'ordered' : 'unordered'} spacing="xs">
                {block.items.map((item, itemIndex) => (
                  <List.Item key={itemIndex}>{renderInline(item)}</List.Item>
                ))}
              </List>
            );
          case 'blockquote':
            return (
              <Box key={index} pl="md" bd="0 0 0 3px solid gray.3">
                <Text c="dimmed" fs="italic">
                  {renderInline(block.text)}
                </Text>
              </Box>
            );
          case 'hr':
            return <Divider key={index} my="sm" />;
          default:
            return null;
        }
      })}
    </Stack>
  );
}
