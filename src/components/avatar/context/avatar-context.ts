import { createContext, useContext } from 'react';

export type AvatarImageStatus = 'idle' | 'loading' | 'loaded' | 'error';

export interface AvatarContextValue {
  imageStatus: AvatarImageStatus;
  setImageStatus: (status: AvatarImageStatus) => void;
}

export const AvatarContext = createContext<AvatarContextValue>({
  imageStatus: 'idle',
  setImageStatus: () => {},
});

export const useAvatarContext = () => useContext(AvatarContext);
