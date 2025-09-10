import { useRef } from 'react';
import { type IRefPhaserGame, PhaserGame } from './PhaserGame';
import { MainMenu } from './game/scenes/MainMenu';

function App() {
  const phaserRef = useRef<IRefPhaserGame | null>(null);

  const _changeScene = () => {
    if (phaserRef.current) {
      const scene = phaserRef.current.scene as MainMenu;

      if (scene) {
        scene.changeScene();
      }
    }
  };

  const currentScene = (_scene: Phaser.Scene) => {};

  return (
    <div id="app">
      <PhaserGame ref={phaserRef} currentActiveScene={currentScene} />
    </div>
  );
}

export default App;
