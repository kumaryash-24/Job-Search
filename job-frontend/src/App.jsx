// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NavBar from './components/Nav';
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import Hello from './components/Hello';
import Recruit from './components/Recruit';
import Explore from './components/Explore';



function App() {
  return (
    <BrowserRouter>
      <NavBar /> {/* 🧭 Static Navbar */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/hello" element={<Hello />} />
        <Route path="/recruit" element={<Recruit />} />
        <Route path="/explore" element={<Explore />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;