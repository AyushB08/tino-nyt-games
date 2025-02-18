import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import WordlePage from './routes/WordlePage.tsx';
import ConnectionsPage from './routes/ConnectionsPage.tsx';

function Home() {
  return (
    <div className="flex flex-col items-center">
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