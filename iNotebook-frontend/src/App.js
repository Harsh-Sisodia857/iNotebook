import {
  Routes,
  Route,
} from "react-router-dom";
import Home from "./Component/Home";
import About from "./Component/About";
import Navbar from './Component/Navbar';
import NoteState from './Context/notes/NoteState';
import Signup from "./Component/Signup";
import Login from './Component/Login';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <div className="App">
      <NoteState>
        <Navbar />
        <ToastContainer/>
        <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
        </Routes>
        </div>
      </NoteState>
    </div>
  );
}

export default App;
