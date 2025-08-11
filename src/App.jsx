import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import About from "./pages/About";
import Skills from "./pages/Skills";
import Projects from "./pages/Projects";
import Contact from "./pages/Contact";
import UserList from "./components/UserList";
import Weather from "./pages/Weatther"; // Đã đổi thành Weather component
import GitHub from "./pages/GitHub";
import Animals from "./pages/Animals";
import "./App.css";

export default function App() {
  return (
    <Router>
      <nav className="navbar">
        <Link to="/">About</Link>
        <Link to="/skills">Skills</Link>
        <Link to="/projects">Projects</Link>
        <Link to="/contact">Contact</Link>
        <Link to="/users">Users</Link>
        <Link to="/weather">Weather</Link>
        <Link to="/github">GitHub</Link>
        <Link to="/animals">Animals</Link>
      </nav>

      <Routes>
        <Route path="/" element={<About />} />
        <Route path="/skills" element={<Skills />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/users" element={<UserList />} />
        <Route path="/weather" element={<Weather />} />
        <Route path="/github" element={<GitHub />} />
        <Route path="/animals" element={<Animals />} />
      </Routes>
    </Router>
  );
}
