import { Route, Routes } from 'react-router';
import './App.css';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Questions from './pages/Questions';
import Login from './pages/Login';
import Register from './pages/Register';
import AddQuestion from './pages/AddQuestion';

const App = () => {
  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} /> 
        <Route path="/login" element={<Login />} />
        <Route path="/questions" element={<Questions />} />
        <Route path="/add-question" element={<AddQuestion />} />
      </Routes>
    </div>
  );
}

export default App;
