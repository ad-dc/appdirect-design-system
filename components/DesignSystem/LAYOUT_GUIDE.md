# Layout Primitives vs Mantine Core: Developer Guide

## 🎯 **Quick Decision Tree**

```
Need layout/spacing? 
├── YES → Use Design System Layout Primitives
│   ├── Vertical stacking → Stack
│   ├── Horizontal layout → Inline  
│   ├── Grid layout → Grid
│   └── Generic container → Box
└── NO → Use Mantine Core directly
    ├── Form controls → @mantine/core
    ├── Complex interactions → @mantine/core
    └── Advanced styling → @mantine/core
```

## 📋 **Component Usage Matrix**

| Component | Use DS Primitive | Use Mantine Core | Reason |
|-----------|------------------|------------------|---------|
| `Stack` | ✅ **Always** | ❌ Never | Ensures consistent vertical spacing with design tokens |
| `Group` | ✅ Use `Inline` (DS `Group` is the Mantine-named alias) | ❌ Never | One horizontal primitive for new code |
| `Box` | ✅ **Always** | ❌ Never | Provides design token access for spacing/colors |
| `SimpleGrid` | ✅ Use `Grid` | ❌ Never | Ensures consistent grid spacing with design tokens |
| `Grid` (CSS Grid) | ✅ **Always** | ❌ Never | DS wrapper provides consistent defaults |
| `Container` | ✅ **Always** | ❌ Never | DS wrapper keeps imports consistent |
| `Flex` | ✅ **Always** | ❌ Never | DS wrapper for advanced flexbox control |
| `Center` | ✅ **Always** | ❌ Never | DS wrapper keeps imports consistent |
| `Collapse` | ❌ Never | ✅ **Always** | Animation/interaction component (no DS wrapper) |

## 🎨 **Design System Layout Primitives**

### **Stack** - Vertical Layout
```tsx
// ✅ DO: Use DS Stack for vertical spacing
import { Stack } from '@/components/DesignSystem';

<Stack gap="md">
  <Title>Heading</Title>
  <Text>Content</Text>
  <Button>Action</Button>
</Stack>

// ❌ DON'T: Use Mantine Stack directly
import { Stack } from '@mantine/core';
<Stack gap="16px"> {/* Hard-coded values */}
```

**When to use:**
- Any vertical layout with spacing
- Form sections
- Card content
- Page sections

### **Inline** - Horizontal Layout
```tsx
// ✅ DO: Use DS Inline for horizontal spacing
import { Inline } from '@/components/DesignSystem';

<Inline gap="sm" justify="space-between">
  <Text>Label</Text>
  <Button>Action</Button>
</Inline>

// ❌ DON'T: Use Mantine Group directly
import { Group } from '@mantine/core';
<Group gap="8px"> {/* Hard-coded values */}
```

**When to use:**
- Button groups
- Form field layouts
- Navigation items
- Tag/badge collections

### **Box** - Generic Container
```tsx
// ✅ DO: Use DS Box for containers with design tokens
import { Box } from '@/components/DesignSystem';

<Box p="lg" bg="gray.1">
  <Text>Content with consistent padding</Text>
</Box>

// ❌ DON'T: Use Mantine Box directly for spacing
import { Box } from '@mantine/core';
<Box p="24px" bg="#f8f9fa"> {/* Hard-coded values */}
```

**When to use:**
- Generic containers needing padding/margin
- Background color containers
- Semantic HTML elements (`component` prop)

### **Grid** - Grid Layout
```tsx
// ✅ DO: Use DS Grid for consistent grid spacing
import { Grid } from '@/components/DesignSystem';

<Grid cols={{ base: 1, md: 2, lg: 3 }} spacing="lg">
  <Card>Item 1</Card>
  <Card>Item 2</Card>
  <Card>Item 3</Card>
</Grid>

// ❌ DON'T: Use Mantine SimpleGrid directly
import { SimpleGrid } from '@mantine/core';
<SimpleGrid cols={3} spacing="24px"> {/* Hard-coded values */}
```

**When to use:**
- Card grids
- Image galleries
- Dashboard layouts
- Responsive content grids

## 🔧 **Mantine Core Components**

### **When to Use Mantine Core Directly:**

#### **1. Animations & Interactions**
```tsx
// ✅ Use Mantine core for animation/interaction components with no DS wrapper
import { Collapse, Transition, Affix } from '@mantine/core';

<Collapse in={opened}>
  <Text>Animated content</Text>
</Collapse>
```

#### **2. Advanced Layout (still use DS imports)**
```tsx
// ✅ Use DS Flex for advanced flexbox control
import { Flex } from '@/components/DesignSystem';

<Flex
  direction={{ base: 'column', sm: 'row' }}
  gap={{ base: 'sm', sm: 'lg' }}
  justify={{ sm: 'center' }}
>
  <Text>Advanced responsive flex</Text>
</Flex>
```

#### **3. Page Containers & Centering (still use DS imports)**
```tsx
// ✅ Use DS versions for consistent imports
import { Center, Container } from '@/components/DesignSystem';

<Container size="md">
  <Center h="100vh">
    <Text>Perfectly centered</Text>
  </Center>
</Container>
```

## 🎯 **Best Practices**

### **✅ DO:**
- **Always use DS primitives for spacing** - ensures design token consistency
- **Import primitives from DS** - `import { Stack } from '@/components/DesignSystem'`
- **Use semantic spacing scales** - `gap="md"` instead of `gap="16px"`
- **Nest primitives** - Stack inside Box, Inline inside Stack, etc.
- **Use responsive props** - `cols={{ base: 1, md: 2 }}`

### **❌ DON'T:**
- **Hard-code spacing values** - `gap="16px"` breaks design consistency
- **Import layout primitives from Mantine** - bypasses design tokens
- **Mix DS and Mantine primitives** - creates inconsistent spacing
- **Use Box for everything** - use semantic primitives (Stack, Inline, Grid)

## 🏗️ **Common Patterns**

### **Card Layout**
```tsx
// ✅ Proper nesting of primitives
<Card>
  <Stack gap="md">
    <Inline justify="space-between">
      <Title order={3}>Card Title</Title>
      <Badge>Status</Badge>
    </Inline>
    <Text>Card description content</Text>
    <Inline gap="sm">
      <Button variant="primary">Primary</Button>
      <Button variant="outline">Secondary</Button>
    </Inline>
  </Stack>
</Card>
```

### **Form Layout**
```tsx
// ✅ Form with consistent spacing
<Stack gap="lg">
  <Title>Form Title</Title>
  <Stack gap="md">
    <TextInput label="Name" />
    <TextInput label="Email" />
    <Inline gap="sm">
      <Checkbox label="Subscribe" />
      <Checkbox label="Terms" />
    </Inline>
  </Stack>
  <Inline justify="flex-end" gap="sm">
    <Button variant="outline">Cancel</Button>
    <Button variant="primary">Submit</Button>
  </Inline>
</Stack>
```

### **Dashboard Grid**
```tsx
// ✅ Responsive dashboard layout
<Stack gap="xl">
  <PageContentHeader title="Dashboard" />
  <Grid cols={{ base: 1, md: 2, lg: 3 }} spacing="lg">
    <Card>
      <Stack gap="sm">
        <Text size="sm" c="dimmed">Total Users</Text>
        <Title order={2}>1,247</Title>
      </Stack>
    </Card>
    <Card>
      <Stack gap="sm">
        <Text size="sm" c="dimmed">Revenue</Text>
        <Title order={2}>$12,450</Title>
      </Stack>
    </Card>
    <Card>
      <Stack gap="sm">
        <Text size="sm" c="dimmed">Growth</Text>
        <Title order={2}>+8.5%</Title>
      </Stack>
    </Card>
  </Grid>
</Stack>
```

## 🎨 **Design Token Integration**

### **Spacing Scale**
```tsx
// Available spacing values (Mantine Core xs–xl plus none / xxs / xxl)
gap="none" // 0px
gap="xxs"  // 4px
gap="xs"   // 10px
gap="sm"   // 12px
gap="md"   // 16px (default)
gap="lg"   // 20px
gap="xl"   // 32px
gap="xxl"  // 48px

// Also accepts custom values when needed
gap="2rem"
gap={24}
```

### **Responsive Spacing**
```tsx
// Responsive spacing using Mantine's responsive syntax
<Stack gap={{ base: 'sm', md: 'lg' }}>
  <Text>Responsive spacing</Text>
</Stack>
```

## 🚀 **Migration Strategy**

### **Phase 1: New Development**
- Use DS Layout primitives for all new components
- Import from `@/components/DesignSystem`

### **Phase 2: Gradual Migration**
- Replace Mantine layout imports during feature updates
- Focus on high-traffic components first

### **Phase 3: Systematic Cleanup**
- Search and replace remaining Mantine layout imports
- Update component documentation

## 📚 **Quick Reference**

```tsx
// All layout primitives from DS (always)
import { Stack, Inline, Box, Grid, Flex, Center, Container } from '@/components/DesignSystem';

// Mantine Core (only for animations/interactions with no DS wrapper)
import { 
  Collapse,    // Animations
  Transition,  // Animations
  Affix,       // Positioning
} from '@mantine/core';
```

---

**Remember:** Layout primitives ensure design consistency and developer productivity. When in doubt, use the Design System version! 🎯 