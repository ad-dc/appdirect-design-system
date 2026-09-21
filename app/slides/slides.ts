export const SHOWCASE_PROMPT =
  'Show the building blocks: code-connected Figma components; token adapters for n+1 consumers (Mantine, Tailwind, Vue, Figma, …); Next.js DS + prototype template, measured by contracts.';

export const CODE_CONNECT_PROMPT =
  'Show Code Connect: a Figma component mapped to DS source so agents read real props — not a screenshot.';

export type FactorySlide = {
  id: string;
  number: string;
  name: string;
  command: string;
};

export const SLIDES: FactorySlide[] = [
  {
    id: 'building-blocks',
    number: '01',
    name: 'Building blocks',
    command: '› SHOW BUILDING BLOCKS',
  },
  {
    id: 'code-connect',
    number: '02',
    name: 'Code Connect',
    command: '› SHOW CODE CONNECT',
  },
];

export const BUILDING_BLOCKS = [
  {
    number: '01',
    title: 'Code Connect',
    body: 'Figma components mapped to DS React source. Agents read real props and variants — they do not invent APIs from a screenshot.',
    tags: ['*.figma.tsx', 'Dev Mode', 'real props'],
  },
  {
    number: '02',
    title: 'Token adapters',
    body: 'One token source. Emitters for Mantine, Tailwind, Vue, Figma, CSS variables, and the next consumer. Adapters — not a static palette.',
    tags: ['Mantine', 'Tailwind', 'Vue', 'Figma', 'n+1'],
  },
  {
    number: '03',
    title: 'DS + prototype + contracts',
    body: 'Next.js design system is canonical. The GitHub template is the counter for new work. Contracts + ds-audit attach every clone to metrics.',
    tags: ['Next.js DS', 'template', 'ds-audit'],
  },
] as const;

export const CODE_CONNECT_MAPPINGS = [
  { figma: 'variant', connect: "figma.enum('variant')", ds: 'variant="primary"' },
  { figma: 'size', connect: "figma.enum('size')", ds: 'size="sm"' },
  { figma: 'children', connect: "figma.string('children')", ds: 'Save' },
] as const;
