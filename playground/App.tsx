import React, { useState } from 'react';
import { View, StatusBar } from 'react-native';
import { ArborProvider } from '../src/ecosystem';
import { createTheme, themeLight } from '../src/foundations';
import { TabBar, FloatingActionButton } from '../src/components';
import {
  HomeScreen,
  ButtonsScreen,
  FormsScreen,
  FeedbackScreen,
  OverlayScreen,
  DataScreen,
} from './src/mobile/screens';

const theme = createTheme(themeLight, {});

const SCREENS = {
  home:     HomeScreen,
  buttons:  ButtonsScreen,
  forms:    FormsScreen,
  feedback: FeedbackScreen,
  overlay:  OverlayScreen,
  data:     DataScreen,
} as const;

type ScreenKey = keyof typeof SCREENS;

export default function App() {
  const [screen, setScreen] = useState<ScreenKey>('home');
  const Screen = SCREENS[screen];

  return (
    <ArborProvider theme={theme}>
      <View style={{ flex: 1 }}>
        <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
        <Screen />
        <TabBar
          value={screen}
          onChange={(v) => setScreen(v as ScreenKey)}
          aria-label="Navegação principal"
        >
          <TabBar.Item value="home"     icon="House"              label="Início"   />
          <TabBar.Item value="buttons"  icon="MousePointerClick"  label="Botões"   />
          <TabBar.Item value="forms"    icon="FileText"           label="Forms"    />
          <TabBar.Item value="feedback" icon="Bell"               label="Feedback" />
          <TabBar.Item value="overlay"  icon="Layers"             label="Overlay"  />
          <TabBar.Item value="data"     icon="Database"           label="Dados"    />
        </TabBar>
        {screen === 'buttons' && (
          <FloatingActionButton
            icon="Plus"
            label="Criar"
            position="bottom-right"
            offset={{ bottom: 90 }}
            onPress={() => console.log('[Arbor DS] FAB pressed')}
          />
        )}
      </View>
    </ArborProvider>
  );
}
