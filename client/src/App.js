import "./App.css";
import axios from "axios";
import { useEffect, useState, createContext } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { Paper } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import cw from "./utils/date_helper";

import Home from "./pages/home";
import Page_Error from "./pages/page_error";
import Nav from "./components/navbar";
import My_Appointments from "./pages/my_appointments";
import Lost_and_found from "./pages/lost_and_found";
import Report_move from "./pages/report_move";
import Make_Appointment from "./pages/make_appointment";
import Bulk_Waste from "./pages/bulk_waste";

export const AuthContext = createContext();

function App() {
    const [authState, setAuthState] = useState({ email: "", status: false });

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

    useEffect(() => {
        axios
            .get(`${process.env.REACT_APP_BACKEND_HOST}/misc`, {
                withCredentials: true,
            })
            .then((res) => {
                console.log(res.data);
                setAuthState({ email: res.data, status: true });
            })
            .catch((error) => {
                console.log(error.response.data);
                setAuthState({ email: "", status: false });
            });
    }, []);

    return (
        <>
            <AuthContext.Provider value={{ authState, setAuthState }}>
                <Router>
                    <ThemeProvider theme={theme}>
                        <Nav />
                        <main>
                            <Routes>
                                <Route path="/" element={<Home />} />
                                <Route path="home" element={<Home />} />
                                <Route path="error" element={<Page_Error />} />
                                <Route
                                    path="fundsachen"
                                    element={<Lost_and_found />}
                                />
                                <Route
                                    path="umzug_melden"
                                    element={<Report_move />}
                                />
                                <Route
                                    path="termin_reservieren"
                                    element={<Make_Appointment />}
                                />
                                <Route
                                    path="meine_termine"
                                    element={<My_Appointments />}
                                />
                                <Route
                                    path="sperrmuell"
                                    element={<Bulk_Waste />}
                                />
                                <Route path="*" element={<Page_Error />} />
                            </Routes>
                        </main>
                    </ThemeProvider>
                </Router>
            </AuthContext.Provider>
        </>
    );
}

export default App;
