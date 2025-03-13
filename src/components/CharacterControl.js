import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet } from 'react-native';

const SPRITE_WIDTH = 50;  
const SPRITE_HEIGHT = 80; 
const FRAME_COUNT = 8;    
const ANIMATION_SPEED = 100; 

const AnimatedCharacter = () => {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setFrame((prevFrame) => (prevFrame + 1) % FRAME_COUNT);
    }, ANIMATION_SPEED);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.character}>
      <Image
        source={require('@assets/sprites/B_witch_run.png')}
        style={[
          styles.sprite,
          { 
            
            marginTop: -frame * SPRITE_HEIGHT
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  character: {
    width: SPRITE_WIDTH,
    height: SPRITE_HEIGHT,
    overflow: 'hidden',  
  },
  sprite: {
    width: SPRITE_WIDTH,   
    height: SPRITE_HEIGHT * FRAME_COUNT,
  },
});

export default AnimatedCharacter;
