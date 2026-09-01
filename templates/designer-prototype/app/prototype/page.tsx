'use client';

import Link from 'next/link';
import {
  AppShellLayout,
  Stack,
  Card,
  Title,
  Text,
  Badge,
  Inline,
  PageContentHeader,
} from '@appdirect/ds-prototype-kit';
import manifest from '@/prototype-manifest.json';

type PrototypePage = {
  slug: string;
  title: string;
  template: string;
  contentLayout: string;
  description?: string;
};

const pages = manifest.pages as PrototypePage[];

export default function PrototypeIndexPage() {
  return (
    <AppShellLayout title="Prototypes" hideNav>
      <Stack gap="lg">
        <PageContentHeader
          title="Prototype Pages"
          subhead={manifest.prototypeName}
          contentSection="description"
          description="Add screens with npm run create-page. Shared UI comes from @appdirect/ds-prototype-kit; product-specific components belong in components/cbp."
        />

        {pages.length === 0 ? (
          <Card p="lg">
            <Stack gap="sm">
              <Title order={4}>No pages yet</Title>
              <Text size="sm" c="dimmed">
                Scaffold a page, then edit the file under app/prototype/.
              </Text>
              <Text size="sm" ff="monospace">
                npm run create-page -- --name &quot;Settings&quot; --template app-shell --layout single-column
              </Text>
            </Stack>
          </Card>
        ) : (
          <Stack gap="md">
            {pages.map((page) => (
              <Link key={page.slug} href={`/prototype/${page.slug}`}>
                <Card p="lg" styles={{ root: { cursor: 'pointer' } }}>
                  <Inline justify="space-between" align="center">
                    <Stack gap={4}>
                      <Title order={4}>{page.title}</Title>
                      {page.description ? (
                        <Text size="sm" c="dimmed">
                          {page.description}
                        </Text>
                      ) : null}
                    </Stack>
                    <Inline gap="xs">
                      <Badge color="info" variant="outline">
                        {page.template}
                      </Badge>
                      <Badge color="default" variant="outline">
                        {page.contentLayout}
                      </Badge>
                    </Inline>
                  </Inline>
                </Card>
              </Link>
            ))}
          </Stack>
        )}
      </Stack>
    </AppShellLayout>
  );
}
