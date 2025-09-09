import { useUIManager } from './ui';
import { useEffect, useRef, useState } from 'react';
import TestUI from './ui/components/react/TestUI';
import { Game } from './Game';

const App = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [game, setGame] = useState<Game | null>(null);
  const ui = useUIManager();

  useEffect(() => {
    if (!canvasRef.current) return;
    setGame(new Game(canvasRef.current));

    game?.start();

    ui.addDOMUI(<TestUI />);

    return () => game?.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClick = () => {
    if (!canvasRef.current) return;

    setGame(new Game(canvasRef.current));
    console.log(game);

    game?.start();
  };

  return (
    <div className="relative w-[1000px] h-[800px]">
      <button className="w-full bg-indigo-500" onClick={handleClick}>
        start
      </button>
      <canvas
        ref={canvasRef}
        width={1000}
        height={800}
        className="border rounded-lg border-gray-600 bg-black"
      />
      {ui.domComponents.map((Component, idx) => (
        <div key={idx}>{Component}</div>
      ))}
    </div>
  );
};

export default App;
