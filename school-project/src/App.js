import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import AddSchool from "./pages/AddSchool";
import ShowSchools from "./pages/ShowSchools";

function App() {
  return (
    <Router>
      <nav style={styles.nav}>
        <Link to="/addschool" style={styles.link}>Add School</Link>
        <Link to="/showschools" style={styles.link}>Show Schools</Link>
      </nav>
      <Routes>
        <Route path="/addschool" element={<AddSchool />} />
        <Route path="/showschools" element={<ShowSchools />} />
      </Routes>
    </Router>
  );
}

const styles = {
  nav: {
    padding: "10px",
    background: "#007bff",
    display: "flex",
    justifyContent: "center",
    gap: "20px"
  },
  link: {
    color: "#fff",
    textDecoration: "none",
    fontWeight: "bold"
  }
};

export default App;

