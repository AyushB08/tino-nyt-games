import { useState, useEffect } from 'react';

const WORD_LENGTH = 5;
const MAX_GUESSES = 6;
const VALID_WORDS = ['TESTS', 'APPLE', "TASER"];

const WordleGame = () => {
  const [targetWord, setTargetWord] = useState('');
  const [guesses, setGuesses] = useState(Array(MAX_GUESSES).fill(''));
  const [currentGuess, setCurrentGuess] = useState('');
  const [currentRow, setCurrentRow] = useState(0);
  const [gameStatus, setGameStatus] = useState('playing');
  const [shake, setShake] = useState(false);
  const [showInvalidMessage, setShowInvalidMessage] = useState(false);

  useEffect(() => {
    const randomWord = VALID_WORDS[Math.floor(Math.random() * VALID_WORDS.length)];
    setTargetWord(randomWord);
  }, []);

  const handleKeyPress = (e: KeyboardEvent) => {
    if (gameStatus !== 'playing') return;

    const key = e.key.toUpperCase();
    
    if (key === 'ENTER') {
      handleSubmitGuess();
    } else if (key === 'BACKSPACE') {
      handleBackspace();
    } else if (/^[A-Z]$/.test(key) && currentGuess.length < WORD_LENGTH) {
      setCurrentGuess((prev) => prev + key);
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentGuess, currentRow, gameStatus]);

  const handleBackspace = () => {
    setCurrentGuess((prev) => prev.slice(0, -1));
  };

  const handleSubmitGuess = () => {
    if (currentGuess.length !== WORD_LENGTH) return;
    
    if (!VALID_WORDS.includes(currentGuess)) {
      setShake(true);
      setShowInvalidMessage(true);
      setTimeout(() => {
        setShake(false);
        setShowInvalidMessage(false);
      }, 1000);
      return;
    }

    const newGuesses = [...guesses];
    newGuesses[currentRow] = currentGuess;
    setGuesses(newGuesses);

    if (currentGuess === targetWord) {
      setGameStatus('won');
    } else if (currentRow === MAX_GUESSES - 1) {
      setGameStatus('lost');
    } else {
      setCurrentRow((prev) => prev + 1);
      setCurrentGuess('');
    }
    
    
  };

  const getLetterStatus = (letter: string, position: number, rowIndex: number) => {
    if (rowIndex > currentRow) return '';
    if (!guesses[rowIndex]) return '';
  
    if (gameStatus === 'won' && rowIndex === currentRow) {
      return 'correct'; 
    }
  
    if (targetWord[position] === letter) {
      return 'correct';
    }
    if (targetWord.includes(letter)) {
      return 'present';
    }
    return 'absent';
  };
  

  return (
    <div className="wordle-container">
      <h1 className="wordle-title">Wordle Clone</h1>
      
      <div className="board">
        {Array(MAX_GUESSES).fill(null).map((_, rowIndex) => (
          <div 
            key={rowIndex}
            className={`board-row ${rowIndex === currentRow && shake ? 'shake' : ''}`}
          >
            {Array(WORD_LENGTH).fill(null).map((_, colIndex) => {
              const letter = rowIndex === currentRow 
                ? currentGuess[colIndex] 
                : guesses[rowIndex][colIndex];
              
              return (
                <div
                  key={colIndex}
                  className={`wordle-tile ${letter ? 'filled' : ''} ${getLetterStatus(letter, colIndex, rowIndex)}`}
                >
                  {letter}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {showInvalidMessage && (
        <div className="invalid-message">Not in word list!</div>
      )}

      {gameStatus !== 'playing' && (
        <div className="game-message">
          {gameStatus === 'won' 
            ? 'Congratulations! You won!' 
            : `Game Over! The word was ${targetWord}`}
        </div>
      )}

      <div className="button-container">
        <button
          onClick={() => window.location.reload()}
          className="new-game-button"
        >
          New Game
        </button>
      </div>
    </div>
  );
};

export default WordleGame;