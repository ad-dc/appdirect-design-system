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
  Button,
} from '@/components/DesignSystem';
import manifest from '@/prototype-manifest.json';

export default function PrototypeIndexPage() {
  return (
    <AppShellLayout title="Prototypes" hideNav>
      <Stack gap="lg">
        <PageContentHeader
          title="Prototype Pages"
          subhead={manifest.prototypeName}
          contentSection="description"
          description=""
        />

        <Button component={Link} href="/slides" variant="outline">
          Factory deck
        </Button>

        <Stack gap="md">
          {manifest.pages.map((page) => (
            <Link
              key={page.slug}
              href={`/prototype/${page.slug}`}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <Card p="lg" styles={{ root: { cursor: 'pointer' } }}>
                <Inline justify="space-between" align="center">
                  <Stack gap={4}>
                    <Title order={4}>{page.title}</Title>
                    {page.description && (
                      <Text size="sm" c="dimmed">{page.description}</Text>
                    )}
                  </Stack>
                  <Inline gap="xs">
                    <Badge color="info" variant="outline">{page.template}</Badge>
                    <Badge color="default" variant="outline">{page.contentLayout}</Badge>
                  </Inline>
                </Inline>
              </Card>
            </Link>
          ))}
        </Stack>
      </Stack>
    </AppShellLayout>
  );
}
