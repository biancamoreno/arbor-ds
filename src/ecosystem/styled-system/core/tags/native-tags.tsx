import type { ElementType } from 'react';
import { View, Text, Pressable, Image, ScrollView } from 'react-native';

export type NativeTags = Record<string, ElementType>;

export const nativeTags: NativeTags = {
  div: View,
  span: Text,
  p: Text,
  h1: Text,
  h2: Text,
  h3: Text,
  h4: Text,
  h5: Text,
  h6: Text,
  button: Pressable,
  a: Pressable,
  img: Image,
  scroll: ScrollView,
};
