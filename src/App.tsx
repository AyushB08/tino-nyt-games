import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { motion } from "framer-motion";
import { BookText, Network } from 'lucide-react';
import "./App.css";
import WordlePage from "./routes/WordlePage.tsx";
import ConnectionsPage from "./routes/ConnectionsPage.tsx";
import AdminPage from "./routes/AdminPage.tsx";
import Navbar from "./components/Navbar";

function Home() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-yellow-50 font-inter"
    >
      <div className="relative w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-screen flex flex-col justify-center">
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.2 }}
            transition={{ duration: 0.8 }}
            className="absolute -right-1/4 -top-1/4 w-96 h-96 bg-gradient-to-br from-red-100 to-yellow-50 rounded-full blur-3xl"
          ></motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.2 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="absolute -left-1/4 -bottom-1/4 w-96 h-96 bg-gradient-to-br from-yellow-100 to-red-50 rounded-full blur-3xl"
          ></motion.div>
        </div>

        <div className="relative py-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-5xl md:text-6xl font-normal tracking-tight mb-6"
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-black">
                Tino Games
              </span>
            </motion.h1>
          </div>

  
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="group relative bg-white rounded-3xl shadow-lg overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative p-8">
                <div className="flex items-center justify-center mb-8">
                  <div className="relative">
                    <div className="absolute inset-0 bg-red-200 rounded-3xl blur-lg opacity-40 group-hover:opacity-60 transition-opacity duration-500"></div>
                    <div className="relative h-20 w-20 bg-gradient-to-br from-red-500 to-red-600 rounded-3xl flex items-center justify-center">
                      <BookText className="h-10 w-10 text-white" />
                    </div>
                  </div>
                </div>
                <h2 className="text-2xl text-gray-900 text-center mb-4 tracking-wide">
                  Wordle
                </h2>
                <p className="text-base text-gray-600 text-center mb-8 leading-relaxed font-light">
                  Get 6 chances to guess a 5-letter word
                </p>
                <div className="flex justify-center">
                  <Link to="/wordle">
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="group relative px-8 py-3 bg-red-600 text-white rounded-2xl font-light tracking-wide overflow-hidden transition-all duration-300 hover:bg-red-700"
                    >
                      <span className="relative z-10">Play Wordle</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </motion.button>
                  </Link>
                </div>
              </div>
            </motion.div>

         
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="group relative bg-white rounded-3xl shadow-lg overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative p-8">
                <div className="flex items-center justify-center mb-8">
                  <div className="relative">
                    <div className="absolute inset-0 bg-yellow-200 rounded-3xl blur-lg opacity-40 group-hover:opacity-60 transition-opacity duration-500"></div>
                    <div className="relative h-20 w-20 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-3xl flex items-center justify-center">
                      <Network className="h-10 w-10 text-white" />
                    </div>
                  </div>
                </div>
                <h2 className="text-2xl text-gray-900 text-center mb-4 tracking-wide">
                  Connections
                </h2>
                <p className="text-base text-gray-600 text-center mb-8 leading-relaxed font-light">
                  Group words that share a common thread
                </p>
                <div className="flex justify-center">
                  <Link to="/connections">
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="group relative px-8 py-3 bg-black text-white rounded-2xl font-light tracking-wide overflow-hidden transition-all duration-300 hover:bg-gray-900"
                    >
                      <span className="relative z-10">Play Connections</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-gray-800 to-black opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </motion.button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="text-center mt-12"
          >
            <p className="text-gray-600 font-light tracking-wide">
              This projec was inspired by The New York Times Games and built by Tinovation.
            </p>
          </motion.div>
        </div>
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
          <main className="h-screen">
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