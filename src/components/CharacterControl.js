import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet } from 'react-native';

const SPRITE_WIDTH = 50;  // Largeur d'une frame
const SPRITE_HEIGHT = 80; // Hauteur d'une frame
const FRAME_COUNT = 8;    // Nombre total de frames (sur l'axe vertical)
const ANIMATION_SPEED = 100; // Vitesse en ms

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
            // Découpe l'image pour n'afficher qu'une seule frame à la fois
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
    overflow: 'hidden',  // Masque les autres frames
  },
  sprite: {
    width: SPRITE_WIDTH,    // La largeur d'une frame
    height: SPRITE_HEIGHT * FRAME_COUNT, // Hauteur totale du spritesheet (total des frames)
  },
});

export default AnimatedCharacter;
