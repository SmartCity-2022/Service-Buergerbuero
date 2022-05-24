import "./App.css";
import axios from "axios";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

function App() {
    const [citizen, set_citizen] = useState([]);
    useEffect(() => {
        axios
            .get(`${process.env.REACT_APP_BACKEND_HOST}/citizen`)
            .then((res) => {
                set_citizen(res.data);
            });
    }, []);

    const on_click = async () => {
        //Cookies.set("accessToken", "ac");
        //Cookies.set("refreshToken", "rf");
        const auth_header = {
            access_token: Cookies.get("accessToken"),
            refresh_token: Cookies.get("refreshToken"),
        };
        axios
            .get(`${process.env.REACT_APP_BACKEND_HOST}/test`, {
                headers: {
                    Authorization: JSON.stringify(auth_header),
                },
            })
            .then((res) => {
                console.log(res.data);
            })
            .catch((obj) => {
                console.log(obj.response.data);
            });
    };

    const on_click_mock = async () => {
        axios
            .get(`${process.env.REACT_APP_BACKEND_HOST}/test/mock`)
            .then((res) => {
                console.log(res.data);
                window.location.reload(false);
            })
            .catch((obj) => {
                console.log(obj.response.data);
            });
    };

    return (
        <div className="App">
            <h1>Bürger</h1>
            <table bgcolor="black" align="center">
                <tbody>
                    <tr bgcolor="grey">
                        <th width="400">Vorname</th>
                        <th width="400">Nachname</th>
                        <th width="400">E-Mail</th>
                    </tr>
                    {Array.isArray(citizen) ? (
                        citizen.map((value, key) => {
                            return (
                                <tr key={key} bgcolor="lightgrey">
                                    <td>{value.first_name}</td>
                                    <td>{value.last_name}</td>
                                    <td>{value.email}</td>
                                </tr>
                            );
                        })
                    ) : (
                        <>
                            <h1>citizen ist kein array lol why</h1>
                        </>
                    )}
                </tbody>
            </table>
            <button onClick={on_click}>test auth</button>
            <button onClick={on_click_mock}>add mock data</button>
        </div>
    );
}

export default App;
