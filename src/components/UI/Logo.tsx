import React from 'react';
import {Image, StyleSheet, View} from 'react-native';

const Logo = () => (
  <View style={styles.container}>
    <Image source={require('../../assets/images/logo.png')} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
});

export default Logo;
