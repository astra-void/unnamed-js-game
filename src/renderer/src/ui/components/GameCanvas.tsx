import { useEffect, useRef } from 'react';
import { Game } from '../../Game';

interface GameCanvasProps {
  onReady?: (game: Game) => void;
}

const GameCanvas = ({ onReady }: GameCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const game = new Game(canvasRef.current);
    if (onReady) onReady(game);

    return () => game.stop();
  }, [onReady]);

  return (
    <canvas
      ref={canvasRef}
      width={1000}
      height={800}
      className="border rounded-lg border-gray-600 bg-black"
    />
  );
};

export default GameCanvas;
