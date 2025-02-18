import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import WordlePage from './routes/WordlePage';
import ConnectionsPage from './routes/ConnectionsPage';

function Home() {
  const [count, setCount] = useState(0);

  return (
    <div>
        <button><Link to="/wordle">Go to Wordle</Link></button>
        <button><Link to="/connections">Go to Connections</Link></button>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/wordle" element={<WordlePage />} />
        <Route path="/connections" element={<ConnectionsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
