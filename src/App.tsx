import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { motion } from "framer-motion";
import "./App.css";
import WordlePage from "./routes/WordlePage.tsx";
import ConnectionsPage from "./routes/ConnectionsPage.tsx";
import AdminPage from "./routes/AdminPage.tsx";
import Navbar from "./components/Navbar";

function Home() {
  return (
    <motion.div 
      className="flex flex-col items-center justify-center h-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-bold mb-4">Welcome to Tino NYT Games</h1>
      <div className="space-y-4">
        <motion.div 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-4 bg-red-500 text-white text-center rounded hover:bg-red-600 transition-all"
        >
          <Link to="/wordle">Play Wordle</Link>
        </motion.div>
        <motion.div 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-4 bg-red-500 text-white text-center rounded hover:bg-red-600 transition-all"
        >
          <Link to="/connections">Play Connections</Link>
        </motion.div>
      </div>
    </motion.div>
  );
}

function App() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <motion.div 
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <Navbar />
          </motion.div>
          <main className="pt-16 h-screen">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/wordle" element={<WordlePage />} />
              <Route path="/connections" element={<ConnectionsPage />} />
              <Route path="/admin" element={<AdminPage />} />
            </Routes>
          </main>
        </div>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
