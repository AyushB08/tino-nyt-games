import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import './App.css';
import WordlePage from './routes/WordlePage.tsx';
import ConnectionsPage from './routes/ConnectionsPage.tsx';
import Navbar from './components/Navbar';

function Home() {
  return (
    <div className="flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-4">Welcome to Tino NYT Games</h1>
      <div className="space-y-4">
        <div className="p-4 bg-blue-500 text-white text-center rounded hover:bg-blue-600">
          <Link to="/wordle">Play Wordle</Link>
        </div>
        <div className="p-4 bg-blue-500 text-white text-center rounded hover:bg-blue-600">
          <Link to="/connections">Play Connections</Link>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <Router>
        <div className="min-h-screen bg-gray-100 min-w-screen">
          <Navbar />
          <div className="w-full h-[calc(100vh-64px)] flex items-center justify-center">
            <div className="max-w-screen mx-auto py-6 sm:px-6 lg:px-8">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/wordle" element={<WordlePage />} />
                <Route path="/connections" element={<ConnectionsPage />} />
              </Routes>
            </div>
          </div>
        </div>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;