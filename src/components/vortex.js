import React from 'react';
import { View, Animated, ImageBackground, StyleSheet } from 'react-native';

const PortalAnimation = () => {
  const rotation = new Animated.Value(0);

  // Animation de rotation
  React.useEffect(() => {
    Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 7000,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  // Interpolation de la rotation
  const rotate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['359deg', '0deg'],
  });

  return (
    <View style={styles.container}>
      <View style={styles.portalFrame}>
        <Animated.View style={[styles.portal, { transform: [{ rotate }] }]}>
          <ImageBackground
            source={{ uri: 'https://i.imgur.com/oNjtnOI.png' }}
            style={styles.portalBackground}
            imageStyle={styles.portalMask}
          >
            <View style={styles.portalInner}></View>
          </ImageBackground>
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  portalFrame: {
    width: 500,
    height: 500,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ scaleX: 0.7 }],
    filter: 'contrast(1.75)', // À adapter selon les effets disponibles
  },
  portal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    animation: 'portal-spin 7s infinite linear', // Pas natif, voir avec une autre approche d'animation
  },
  portalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    resizeMode: 'cover',
  },
  portalMask: {
    opacity: 0.75,
    borderRadius: 50,
  },
  portalInner: {
    flex: 1,
    backgroundColor: 'orange',
    borderRadius: 50,
    position: 'absolute',
    top: -25,
    left: -25,
    right: -25,
    bottom: -25,
  },
});

export default PortalAnimation;
