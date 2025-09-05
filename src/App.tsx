import { useEffect, useState } from "react";
import { Game } from "./Game";

const App = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_game, setGame] = useState<Game | null>(null);
    const [canvas, setCanvas] = useState<HTMLCanvasElement>();

    useEffect(() => {
        setCanvas(document.getElementById('game') as HTMLCanvasElement);
    }, []);

    return (
        <div>
            <button onClick={() => setGame(new Game(canvas!))}>asdf</button>
            <canvas id="game" width="1000" height="800"></canvas>
        </div>
    );
}
 
export default App;