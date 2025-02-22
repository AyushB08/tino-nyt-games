import React, { useState, useEffect } from 'react';

type GameStatus = 'playing' | 'won' | 'lost';
type LetterStatus = 'correct' | 'present' | 'absent' | '';

interface UsedLetters {
  [key: string]: LetterStatus;
}

const WORD_LENGTH = 5;
const MAX_GUESSES = 6;

const KEYBOARD_ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '←']
] as const;

interface PopupProps {
  message: string;
  isVisible: boolean;
}

const Popup: React.FC<PopupProps> = ({ message, isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed top-16 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-80 text-white px-6 py-3 rounded-lg shadow-lg animate-fade-in">
      <p className="text-center font-bold">{message}</p>
    </div>
  );
};

const WordleGame: React.FC = () => {
  const [validWords, setValidWords] = useState<string[]>([]);
  const [targetWord, setTargetWord] = useState<string>('');
  const [guesses, setGuesses] = useState<string[]>(Array(MAX_GUESSES).fill(''));
  const [currentGuess, setCurrentGuess] = useState<string>('');
  const [currentRow, setCurrentRow] = useState<number>(0);
  const [gameStatus, setGameStatus] = useState<GameStatus>('playing');
  const [shake, setShake] = useState<boolean>(false);
  const [usedLetters, setUsedLetters] = useState<UsedLetters>({});
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [popupMessage, setPopupMessage] = useState<string>('');

  useEffect(() => {
    const loadWords = async () => {
      try {
        const response = await fetch('/words.txt');
        const text = await response.text();
        const words = text.split('\n').map(word => word.trim().toUpperCase());
        setValidWords(words);
        setTargetWord("REACT");
      } catch (error) {
        console.error('Error loading words:', error);
      }
    };
    loadWords();
  }, []);

  const showTemporaryPopup = (message: string, duration: number = 2000) => {
    setPopupMessage(message);
    setShowPopup(true);
    setTimeout(() => {
      setShowPopup(false);
    }, duration);
  };

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
    
    if (!validWords.includes(currentGuess)) {
      setShake(true);
      showTemporaryPopup('Not in word list!');
      setTimeout(() => {
        setShake(false);
      }, 1000);
      return;
    }

    const newGuesses = [...guesses];
    newGuesses[currentRow] = currentGuess;
    setGuesses(newGuesses);

    const newUsedLetters = { ...usedLetters };
    for (let i = 0; i < currentGuess.length; i++) {
      const letter = currentGuess[i];
      if (targetWord[i] === letter) {
        newUsedLetters[letter] = 'correct';
      } else if (targetWord.includes(letter)) {
        if (newUsedLetters[letter] !== 'correct') {
          newUsedLetters[letter] = 'present';
        }
      } else {
        if (!newUsedLetters[letter]) {
          newUsedLetters[letter] = 'absent';
        }
      }
    }
    setUsedLetters(newUsedLetters);

    if (currentGuess === targetWord) {
      setGameStatus('won');
      showTemporaryPopup('Congratulations! You won!', 3000);
    } else if (currentRow === MAX_GUESSES - 1) {
      setGameStatus('lost');
      showTemporaryPopup(`Game Over! The word was ${targetWord}`, 3000);
    } else {
      setCurrentRow((prev) => prev + 1);
      setCurrentGuess('');
    }
  };

  const getLetterStatus = (letter: string, position: number, rowIndex: number): LetterStatus => {
    if (rowIndex > currentRow) return '';
    if (!guesses[rowIndex]) return '';
  
    if (targetWord[position] === letter) {
      return 'correct';
    }
    if (targetWord.includes(letter)) {
      return 'present';
    }
    return 'absent';
  };

  const handleKeyboardClick = (key: string) => {
    if (gameStatus !== 'playing') return;

    if (key === 'ENTER') {
      handleSubmitGuess();
    } else if (key === '←') {
      handleBackspace();
    } else if (currentGuess.length < WORD_LENGTH) {
      setCurrentGuess((prev) => prev + key);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 p-4">
      <Popup message={popupMessage} isVisible={showPopup} />
      
      <div className="grid gap-1">
        {Array(MAX_GUESSES).fill(null).map((_, rowIndex) => (
          <div 
            key={rowIndex}
            className={`grid grid-cols-5 gap-1 ${rowIndex === currentRow && shake ? 'animate-shake' : ''}`}
          >
            {Array(WORD_LENGTH).fill(null).map((_, colIndex) => {
              const letter = rowIndex === currentRow 
                ? currentGuess[colIndex] 
                : guesses[rowIndex]?.[colIndex];
              const status = getLetterStatus(letter || '', colIndex, rowIndex);
              
              return (
                <div
                  key={colIndex}
                  className={`
                    w-14 h-14 border-2 flex items-center justify-center text-2xl font-bold
                    ${!letter ? 'border-gray-300' : 'border-gray-400'}
                    ${status === 'correct' ? 'bg-green-500 text-white border-green-500' : ''}
                    ${status === 'present' ? 'bg-yellow-500 text-white border-yellow-500' : ''}
                    ${status === 'absent' ? 'bg-gray-600 text-white border-gray-600' : ''}
                  `}
                >
                  {letter}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <div className="w-full max-w-xl mt-4">
        {KEYBOARD_ROWS.map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-center gap-1 mb-1">
            {row.map((key) => {
              const status = usedLetters[key];
              return (
                <button
                  key={key}
                  onClick={() => handleKeyboardClick(key)}
                  className={`
                    font-bold rounded px-3 py-4 text-sm
                    ${key.length > 1 ? 'px-4' : 'min-w-[40px]'}
                    ${status === 'correct' ? 'bg-green-500 text-white' : ''}
                    ${status === 'present' ? 'bg-yellow-500 text-white' : ''}
                    ${status === 'absent' ? 'bg-gray-600 text-white' : ''}
                    ${!status ? 'bg-gray-200' : ''}
                    hover:opacity-90 transition-opacity
                  `}
                >
                  {key}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WordleGame;