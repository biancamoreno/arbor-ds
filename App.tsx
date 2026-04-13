import React from 'react';
import { ArborProvider } from './src/ecosystem';
import { createTheme, themeLight } from './src/foundations';
import { Box, Button, Flex, Text } from './src/components';

const theme = createTheme(themeLight, {});

export default function App() {
  return (
    <ArborProvider theme={theme}>
      <Flex flex={1} backgroundColor="neutral.100" alignItems="center" justifyContent="center" padding="24px">
        <Box gap="16px" alignItems="center">
          <Text as="h1" variant="title1">Arbor DS</Text>
          <Text as="p" variant="body1" color="neutral.600">Design System Mobile + Web</Text>
          <Button>Entrar</Button>
        </Box>
      </Flex>
    </ArborProvider>
  );
}
