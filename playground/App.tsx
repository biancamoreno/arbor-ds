import React from 'react';
import { ArborProvider } from '../src/ecosystem';
import { createTheme, themeLight } from '../src/foundations';
import { Badge, Button, Flex, Text } from '../src/components';

const theme = createTheme(themeLight, {});

export default function App() {
  return (
    <ArborProvider theme={theme}>
      <Flex flex={1} backgroundColor="background.default" alignItems="center" justifyContent="center" padding="24px">
        <Flex
          flexDirection="column"
          gap="16px"
          alignItems="center"
          padding="24px"
          borderRadius="large"
          backgroundColor="surface.raised"
        >
          <Badge tone="brand">Arbor DS</Badge>
          <Text as="h1" variant="title1">
            Core design system
          </Text>
          <Text as="p" variant="body" style={{ textAlign: 'center', maxWidth: 320 }}>
            Foundations, provider and component primitives shared between web and mobile surfaces.
          </Text>
          <Button>Open playground on web</Button>
        </Flex>
      </Flex>
    </ArborProvider>
  );
}
