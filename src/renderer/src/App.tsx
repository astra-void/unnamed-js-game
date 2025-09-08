import { useEffect, useState } from 'react';
import { Game } from './Game';

const App = () => {
  const [_game, setGame] = useState<Game | null>(null);
  const [canvas, setCanvas] = useState<HTMLCanvasElement>();

  useEffect(() => {
    setCanvas(document.getElementById('game') as HTMLCanvasElement);
  }, []);

  return (
    <>
      <button onClick={() => setGame(new Game(canvas!))}>asdf</button>
      <canvas id="game" width="1000" height="800"></canvas>
      {/*<canvas id="game" width="1000" height="800"></canvas> */}
    </>
  );
};

export default App;
