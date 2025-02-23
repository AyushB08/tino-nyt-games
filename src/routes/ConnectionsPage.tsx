import React, { useState, useEffect } from 'react';

type Group = {
  name: string;
  words: string[];
  color: string;
};

const groups: Group[] = [
  { name: "CHS Spirit and Nicknames", words: ["TINO", "PIONEERS", "10100", "RED"], color: "#FFD700" },
  { name: "IDEs", words: ["INTELLIJ", "BLUEJ", "ECLIPSE", "VSCODE"], color: "#87CEEB" },
  { name: "Microcontrollers", words: ["STM32", "ATMEGA32U4", "ARDUINO", "RASPBERRY PI PICO"], color: "#FFA07A" },
  { name: "APCS Exam Terms", words: ["AP EXAM", "FREE RESPONSE", "MULTIPLE CHOICE", "COLLEGE BOARD"], color: "#98FB98" }
];

const ConnectionsPage: React.FC = () => {
  const [tiles, setTiles] = useState<string[]>([]);
  const [selectedTiles, setSelectedTiles] = useState<string[]>([]);
  const [completed, setCompleted] = useState<Group[]>([]);
  const [attemptsLeft, setAttemptsLeft] = useState<number>(4);

  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = (): void => {
    const shuffledTiles = groups.flatMap(group => group.words).sort(() => Math.random() - 0.5);
    setTiles(shuffledTiles);
    setSelectedTiles([]);
    setCompleted([]);
    setAttemptsLeft(4);
  };

  const selectTile = (word: string): void => {
    setSelectedTiles(prevSelected =>
      prevSelected.includes(word) ? prevSelected.filter(t => t !== word) : prevSelected.length < 4 ? [...prevSelected, word] : prevSelected
    );
  };

  const submitSelection = (): void => {
    if (selectedTiles.length !== 4 || attemptsLeft === 0) return;

    const matchedGroup = groups.find(group => selectedTiles.every(word => group.words.includes(word)));

    if (matchedGroup && !completed.some(g => g.name === matchedGroup.name)) {
      setCompleted([...completed, matchedGroup]);
      setTiles(prevTiles => prevTiles.filter(word => !matchedGroup.words.includes(word)));
    } else {
      setAttemptsLeft(prevAttempts => prevAttempts - 1);
      if (attemptsLeft === 1) revealAnswers();
    }

    setSelectedTiles([]);
  };

  const revealAnswers = (): void => {
    setCompleted(groups);
    setTiles([]);
  };

  const renderGrid = (): React.ReactElement => (
    <div className="grid grid-cols-4 gap-4 mt-6">
      {tiles.map((word, index) => (
        <div
          key={index}
          className={`
            w-60 h-32 text-center flex items-center justify-center text-2xl font-bold rounded-lg
            transition-all duration-200 ease-in-out cursor-pointer
            ${selectedTiles.includes(word) ? 'bg-gray-300 text-gray-900 shadow-md' : 'bg-gray-100 border border-gray-200'}
            hover:bg-gray-300 hover:text-gray-900 hover:shadow-md
          `}
          onClick={() => selectTile(word)}
        >
          {word}
        </div>
      ))}
    </div>
  );

  const renderCompletedGroups = (): React.ReactElement => (
    <div className="grid grid-cols-1 gap-4 mt-6">
      {completed.map((group, index) => (
        <div key={index} className="p-4 rounded-lg shadow-md" style={{ background: group.color }}>
          <div className="text-lg font-semibold mb-2">{group.name}</div>
          <div className="flex gap-4">
            {group.words.map((word, idx) => (
              <div
                key={idx}
                className="w-60 h-32 text-center flex items-center justify-center text-2xl font-bold rounded-lg bg-white bg-opacity-80"
              >
                {word}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  const renderAttempts = (): React.ReactElement => (
    <div className="flex justify-center gap-2 mt-6">
      {[...Array(attemptsLeft)].map((_, index) => (
        <div key={index} className="w-4 h-4 bg-gray-300 rounded-full"></div>
      ))}
    </div>
  );

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="flex flex-col items-center p-8 bg-white rounded-2xl shadow-xl">
        <h1 className="text-3xl font-bold mb-6">TinoConnections</h1>
        {renderCompletedGroups()}
        {renderGrid()}
        <div className="flex gap-4 mt-6">
          <button
            className="px-6 py-2 bg-gray-200 rounded-lg font-semibold hover:bg-gray-300 transition-all duration-200"
            onClick={initializeGame}
          >
            Shuffle
          </button>
          <button
            className="px-6 py-2 bg-blue-500 text-white rounded-lg font-semibold bg-gray-600 hover:bg-gray-500 transition-all duration-200"
            onClick={submitSelection}
          >
            Submit
          </button>
        </div>
        {renderAttempts()}
      </div>
    </div>
  );
};

export default ConnectionsPage;