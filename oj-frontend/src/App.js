import { Route, Routes } from 'react-router';
import './App.css';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Questions from './pages/Questions';
import Login from './pages/Login';
import Register from './pages/Register';
import AddQuestion from './pages/AddQuestion';
import CodeEditor from './pages/CodeEditor';
import QuestionDetails from './pages/QuestionDetails';

const App = () => {
  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Register />} /> 
        <Route path="/signin" element={<Login />} />
        <Route path="/questions" element={<Questions />} />
        <Route path="/add-question" element={<AddQuestion />} />
        <Route path="/problems" element={<CodeEditor />} />
        <Route path="/details" element={<QuestionDetails />} />
      </Routes>
    </div>
  );
}

export default App;
