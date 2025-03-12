import React, { useState, useEffect, useRef } from 'react';
import * as SecureStore from 'expo-secure-store';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, Dimensions, PanResponder } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { Gyroscope } from 'expo-sensors';
import { useDispatch } from 'react-redux';
import { logout } from '@store/authSlice';
const { width, height } = Dimensions.get('window');
import { Image } from 'react-native';

// Composant joystick
const CustomJoystick = ({ onMove }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const maxDistance = 40; 

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gesture) => {
        let dx = gesture.dx;
        let dy = gesture.dy;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > maxDistance) {
          dx = (dx / distance) * maxDistance;
          dy = (dy / distance) * maxDistance;
        }

        setPosition({ x: dx, y: dy });

        onMove({
          angle: Math.atan2(dy, dx) * (180 / Math.PI),
          distance: (distance / maxDistance) * 100,
        });
      },
      onPanResponderRelease: () => {
        setPosition({ x: 0, y: 0 });
        onMove({ angle: 0, distance: 0 });
      },
    })
  ).current;

  return (
    <View style={styles.joystickBase}>
      <View {...panResponder.panHandlers} style={[styles.joystickStick, { transform: [{ translateX: position.x }, { translateY: position.y }] }]} />
    </View>
  );
};

export default function LobbyScreen({ navigation }) {
    const dispatch = useDispatch();
    const [characterPosition, setCharacterPosition] = useState({ x: width / 2, y: height / 2 });
    const [gyroData, setGyroData] = useState({ x: 0, y: 0 });
    const [joystickData, setJoystickData] = useState({ angle: 0, distance: 0 });
    const animationRef = useRef(null);
  
    const gyroSensitivity = 10;
    const joystickSpeed = 12;
  
    useEffect(() => {
      const subscription = Gyroscope.addListener((data) => {
        setGyroData({ x: data.x, y: data.y });
      });
      Gyroscope.setUpdateInterval(70);
  
      return () => subscription.remove();
    }, []);
  
    useEffect(() => {
      const updatePosition = () => {
        const gyroX = gyroData.y * gyroSensitivity;
        const gyroY = gyroData.x * gyroSensitivity;
  
        const joystickX = Math.cos(joystickData.angle * Math.PI / 180) * joystickData.distance * joystickSpeed / 100;
        const joystickY = Math.sin(joystickData.angle * Math.PI / 180) * joystickData.distance * joystickSpeed / 100;
  
        let newX = characterPosition.x + gyroX + joystickX;
        let newY = characterPosition.y + gyroY + joystickY;
  
        newX = Math.max(25, Math.min(width - 25, newX));
        newY = Math.max(25, Math.min(height - 25, newY));
  
        setCharacterPosition({ x: newX, y: newY });
  
        animationRef.current = requestAnimationFrame(updatePosition);
      };
  
      animationRef.current = requestAnimationFrame(updatePosition);
      return () => cancelAnimationFrame(animationRef.current);
    }, [gyroData, joystickData]);
  
    const handleLogout = async () => {
      try {
        dispatch(logout());
        await SecureStore.deleteItemAsync('accessToken');
        await SecureStore.deleteItemAsync('refreshToken');
  
        navigation.reset({
          index: 0,
          routes: [{ name: 'Auth' }],
        });
      } catch (error) {
        console.error('Error with logout =>', error);
      }
    };
  
    return (
      <ImageBackground source={require('@assets/background/background.png')} style={styles.backgroundImage}>
        <SafeAreaProvider>
          <SafeAreaView style={styles.container} edges={['top', 'left']}>
  
            {/* Personnage animé */}
            <View style={[styles.character, { left: characterPosition.x - 25, top: characterPosition.y - 25 }]}>
            <Text style={styles.characterText}>
            <Image source={require('@assets/avatars/feles.png')} style={styles.characterImage} />
            </Text>
            </View>
  
  
            {/* Joystick */}
            <View style={styles.joystickContainer}>
              <CustomJoystick onMove={setJoystickData} />
            </View>
  
            {/* Debug info */}
            <View style={styles.debugInfo}>
              <Text style={styles.debugText}>Gyro: X: {gyroData.x.toFixed(2)}, Y: {gyroData.y.toFixed(2)}</Text>
              <Text style={styles.debugText}>Joystick: Angle: {joystickData.angle.toFixed(2)}°, Distance: {joystickData.distance.toFixed(2)}%</Text>
            </View>
  
          </SafeAreaView>
        </SafeAreaProvider>
      </ImageBackground>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    character: {
      position: 'absolute',
      width: 50,  
      height: 50, 
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1, 
    },
    vortexContainer: {
      position: 'absolute',
      top: height / 3, 
      left: width / 2 - 50, 
      zIndex: 0, 
    },
    joystickContainer: {
      top: 500,
      left: '50%',
      transform: [{ translateX: -50 }],
      width: 120,
      height: 120,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 60,
    },
    joystickBase: {
      width: 100,
      height: 100,
      borderRadius: 500,
      backgroundColor: 'rgba(0,0,0,0.1)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    joystickStick: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: 'black',
      position: 'absolute',
      zIndex: 0, 
    },
    debugInfo: {
      position: 'absolute',
      top: 50,
      left: 20,
      right: 20,
      backgroundColor: 'rgba(0,0,0,0.5)',
      padding: 10,
      borderRadius: 5,
    },
    debugText: {
      color: 'white',
      fontSize: 12,
    },
  });