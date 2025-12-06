import React from 'react';
import { HeaderLogo } from './HeaderLogo';

export function defaultScreenOptions(title: string) {
  return {
    title,
    headerTitleAlign: 'left' as const,
    headerRight: () => <HeaderLogo />,
  };
}
