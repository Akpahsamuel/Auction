import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles/main.css';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/home/Home';
import Create from './pages/create/Create';
import Bidding from './pages/bidding/Bidding';
import About from './pages/about/About';

function App() {
  return (
    <Router>
      <div className="app">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<Create />} />
          <Route path="/bidding" element={<Bidding />} />
          <Route path="/about" element={<About />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
