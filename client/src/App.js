import "./App.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";

import Home from "./pages/home";
import Page_Error from "./pages/page_error";

function App() {
    return (
        <div className="App">
            <Router>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="*" element={<Page_Error />} />
                </Routes>
            </Router>
        </div>
    );
}

export default App;
