import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Destinations from './pages/Destinations';
import Itineraries from './pages/Itineraries';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
          <Route path="/destinations" element={<Destinations />} />
          <Route path="/itineraries" element={<Itineraries />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;