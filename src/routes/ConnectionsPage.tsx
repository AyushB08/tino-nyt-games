import React, { useState, useEffect } from 'react';
import './styles.css';

const groups = [
  { name: "CHS Spirit and Nicknames", words: ["TINO", "PIONEERS", "10100", "RED"], color: "#FFD700" },
  { name: "IDEs", words: ["INTELLIJ", "BLUEJ", "ECLIPSE", "VSCODE"], color: "#87CEEB" },
  { name: "Microcontrollers", words: ["STM32", "ATMEGA32U4", "ARDUINO", "RASPBERRY PI PICO"], color: "#FFA07A" },
  { name: "APCS Exam Terms", words: ["AP EXAM", "FREE RESPONSE", "MULTIPLE CHOICE", "COLLEGE BOARD"], color: "#98FB98" }
];

function ConnectionsPage() {
  const [tiles, setTiles] = useState([]);
  const [selectedTiles, setSelectedTiles] = useState([]);
  const [completed, setCompleted] = useState([]);
  const [attemptsLeft, setAttemptsLeft] = useState(4);

  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    const shuffledTiles = groups.flatMap(group => group.words).sort(() => Math.random() - 0.5);
    setTiles(shuffledTiles);
  };

  const selectTile = (word) => {
    if (selectedTiles.includes(word)) {
      setSelectedTiles(selectedTiles.filter(t => t !== word));
    } else if (selectedTiles.length < 4) {
      setSelectedTiles([...selectedTiles, word]);
    }
  };

  const submitSelection = () => {
    if (selectedTiles.length !== 4 || attemptsLeft === 0) return;

    const matchedGroup = groups.find(group =>
      selectedTiles.every(word => group.words.includes(word))
    );

    if (matchedGroup && !completed.some(g => g.name === matchedGroup.name)) {
      setCompleted([...completed, matchedGroup]);
      setTiles(tiles.filter(word => !matchedGroup.words.includes(word)));
    } else {
      setAttemptsLeft(attemptsLeft - 1);
      if (attemptsLeft === 1) revealAnswers();
    }

    setSelectedTiles([]);
  };

  const revealAnswers = () => {
    setCompleted(groups);
    setTiles([]);
  };

  const renderGrid = () => (
    <div className="grid">
      {tiles.map((word, index) => (
        <div
          key={index}
          className={`tile ${selectedTiles.includes(word) ? 'selected' : ''}`}
          onClick={() => selectTile(word)}
        >
          {word}
        </div>
      ))}
    </div>
  );

  const renderCompletedGroups = () => (
    <div id="completed-groups">
      {completed.map((group, index) => (
        <div key={index} className="completed-group" style={{ background: group.color }}>
          <div className="completed-title">{group.name}</div>
          {group.words.map((word, idx) => (
            <div key={idx} className="tile">
              {word}
            </div>
          ))}
        </div>
      ))}
    </div>
  );

  const renderAttempts = () => (
    <div id="attempts-container">
      {[...Array(attemptsLeft)].map((_, index) => (
        <div key={index} className="dot"></div>
      ))}
    </div>
  );

  return (
    <div className="game-container">
      <div className="title">TinoConnections</div>
      {renderCompletedGroups()}
      {renderGrid()}
      <div className="button-container">
        <button className="button" onClick={initializeGame}>Shuffle</button>
        <button className="button" onClick={submitSelection}>Submit</button>
      </div>
      {renderAttempts()}
    </div>
  );
}

export default ConnectionsPage;