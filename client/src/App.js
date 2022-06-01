import "./App.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { Paper } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import Home from "./pages/home";
import Page_Error from "./pages/page_error";
import Nav from "./components/navbar";
import My_Appointments from "./pages/my_appointments";

function App() {
    const theme = createTheme({
        status: {
            danger: "#e53e3e",
        },
        palette: {
            primary: {
                main: "#0971f1",
                darker: "#053e85",
            },
            secondary: {
                main: "#0971f1",
                darker: "#053e85",
            },
            neutral: {
                main: "#64748B",
                contrastText: "#fff",
            },
        },
    });
    return (
        <>
            <Router>
                <ThemeProvider theme={theme}>
                    <Nav />
                    <main>
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="home" element={<Home />} />
                            <Route path="error" element={<Page_Error />} />
                            <Route
                                path="Termine"
                                element={<My_Appointments />}
                            />
                            <Route path="*" element={<Page_Error />} />
                        </Routes>
                    </main>
                </ThemeProvider>
            </Router>
        </>
    );
}

export default App;
