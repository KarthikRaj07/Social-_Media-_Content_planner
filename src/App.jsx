import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './Home';
import Chatbot from './Chatbot';
import './App.css';

function App() {
  return (
    <Router>
      <nav className="nav-buttons">
        <Link to="/">Home</Link>
        <Link to="/chatbot">Chatbot</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chatbot" element={<Chatbot />} />
      </Routes>
    </Router>
  );
}

export default App;
