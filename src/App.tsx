import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./components/Home";
import Header from "./components/Header";
import DownloadPage from "./components/Download";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/download" element={<DownloadPage />} />
      </Routes>
    </Router>
  );
}

export default App;
