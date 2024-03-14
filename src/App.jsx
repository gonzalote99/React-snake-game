import {useEffect, useRef, useState} from 'react';
import './App.css';
import Snake from './components/Snake';
import Food from './components/Food';

const randomFoodPosition = () => {
  const pos = {x: 0, y: 0};
  let x = Math.floor(Math.random() * 96);  
  let y = Math.floor(Math.random() * 96);
  pos.x = x - (x % 4);
  pos.y = y - (y % 4);
  return pos;

};


const initialStake = {
  snake: [
    {x: 0, y: 0},    
    {x: 4, y: 0},
    {x: 8, y: 0},

  ],

  direction: 'ArrowRight',
  speed: 100,
};

function App() {
  const [snake, setSnake] = useState(initialStake.snake);
  const [lastDirection, setLastDirection] = useState(initialStake.direction);
  const [foodPosition, setFoodPosition] = useState(randomFoodPosition);
  const [isStarted, setIsStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const playgroundRef = useRef();


  useEffect(() => {
    if(!isStarted) return;

    if(
      snake[snake.length - 1].x === 100 ||       
      snake[snake.length - 1].x === 0 || 
      snake[snake.length - 1].y === 100 || 
      snake[snake.length - 1].y === -4 


    ) {
      setGameOver(true);
      return;
    }

    const interval = setInterval(move, initialStake.speed);
    return () => clearInterval(interval);
  });

  const move = () => {
    const tmpSnake = [...snake];
    let x = tmpSnake[tmpSnake.length - 1].x,   
      y = tmpSnake[tmpSnake.length - 1].y;
    switch(lastDirection) {
      case 'ArrowUp':
        y -= 4;
        break;
      case 'ArrowRight':
        x += 4;
        break;
      case 'ArrowDown':
        y += 4;
        break;
      case 'ArrowLeft':
        x -= 4;
        break;
      default:
        break;

    }
    tmpSnake.push({
      x,
      y,
    });
    if( x !== foodPosition.x || y !== foodPosition.y) tmpSnake.shift();
    else setFoodPosition(randomFoodPosition());
    setSnake(tmpSnake)






  };

  return(
    <div className='App'
     onKeyDown={(e) => setLastDirection(e.key)}
      ref={playgroundRef} tabIndex={0}
      >
      {isStarted && <div className='count'>score: {snake.length -3} </div> }
      {!isStarted && (
        <>
          <button onClick={() => {
          setIsStarted(true);
          playgroundRef.current.focus()

          }}
            type='submit'
            >start</button>
          <div className='arrow-msg text'>press arrow keys to play</div>
        </>
      )}
      {gameOver &&  (
        <>
        <div className='game-over'>game over! </div>
          <button
            onClick={() => {
              setIsStarted(true)
              setGameOver(false)
              setSnake(initialStake.snake)
              setLastDirection(initialStake.direction)
              playgroundRef.current.focus()
            }}

            type='submit'
            >restart</button>
        </>
      )}
      <Snake snake={snake} lastDirection={lastDirection} />
      {!gameOver && (
        <>
        <Food position={foodPosition} />
        </>
      )}
    </div>
  )

}


export default App;