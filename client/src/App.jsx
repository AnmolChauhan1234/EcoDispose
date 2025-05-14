// App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import QrScanner from './Components/QrScanner';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/scan" element={<QrScanner />} />
      </Routes>
    </Router>
  );
}

export default App;
