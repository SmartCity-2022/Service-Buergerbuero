import "./App.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";

import Home from "./pages/home";
import Page_Error from "./pages/page_error";
import Nav from "./components/navbar";

function App() {
    return (
        <div className="App">
            <Nav />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="home" element={<Home />} />
                <Route path="error" element={<Page_Error />} />
                <Route path="*" element={<Page_Error />} />
            </Routes>
        </div>
    );
}

export default App;
