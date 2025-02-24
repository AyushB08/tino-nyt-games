// Update: fetch call to increment connectionsPts
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

  const incrementConnectionsPts = async () => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      try {
        const response = await fetch(`http://localhost:5000/api/users/${user.id}/increase-connections-pts`, {
          method: 'PATCH'
        });
        if (!response.ok) {
          console.error(`Error incrementing points: ${response.status}`);
        } else {
          console.log('Connections points incremented successfully.');
        }
      } catch (error) {
        console.error('Failed to increment connections points:', error);
      }
    }
  };

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

  const submitSelection = async (): Promise<void> => {
    if (selectedTiles.length !== 4 || attemptsLeft === 0) return;

    const matchedGroup = groups.find(group => selectedTiles.every(word => group.words.includes(word)));

    if (matchedGroup && !completed.some(g => g.name === matchedGroup.name)) {
      setCompleted([...completed, matchedGroup]);
      setTiles(prevTiles => prevTiles.filter(word => !matchedGroup.words.includes(word)));
      await incrementConnectionsPts();
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
    <div className="connections-grid">
      {tiles.map((word, index) => (
        <div
          key={index}
          className={`connections-tile ${selectedTiles.includes(word) ? 'selected' : ''}`}
          onClick={() => selectTile(word)}
        >
          {word}
        </div>
      ))}
    </div>
  );

  const renderCompletedGroups = (): React.ReactElement => (
    <div id="completed-groups">
      {completed.map((group, index) => (
        <div key={index} className="completed-group" style={{ background: group.color }}>
          <div className="completed-title">{group.name}</div>
          {group.words.map((word, idx) => (
            <div key={idx} className="connections-tile">
              {word}
            </div>
          ))}
        </div>
      ))}
    </div>
  );

  const renderAttempts = (): React.ReactElement => (
    <div id="attempts-container">
      {[...Array(attemptsLeft)].map((_, index) => (
        <div key={index} className="connections-dot"></div>
      ))}
    </div>
  );

  return (
    <div className="connections-container">
      <div className="connections-title">TinoConnections</div>
      {renderCompletedGroups()}
      {renderGrid()}
      <div className="button-container">
        <button className="button" onClick={initializeGame}>Shuffle</button>
        <button className="button" onClick={submitSelection}>Submit</button>
      </div>
      {renderAttempts()}
    </div>
  );
};

export default ConnectionsPage;
