import { useRef } from 'react';
import { type IRefPhaserGame, PhaserGame } from './PhaserGame';

function App() {
  const phaserRef = useRef<IRefPhaserGame | null>(null);

  const currentScene = (_scene: Phaser.Scene) => {};

  return (
    <div id="app">
      <PhaserGame ref={phaserRef} currentActiveScene={currentScene} />
    </div>
  );
}

export default App;
