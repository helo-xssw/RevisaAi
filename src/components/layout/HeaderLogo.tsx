import React from 'react';
import { Image, ImageStyle } from 'react-native';

export function HeaderLogo() {
  return (
    <Image
      source={require('@/assets/images/moto_logo_1.png')}
      style={logoStyle}
      accessibilityLabel="Logo moto"
    />
  );
}

const logoStyle: ImageStyle = {
  width: 64,
  height: 64,
  resizeMode: 'contain',
  marginRight: 8,
};
