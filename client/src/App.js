import "./App.css";
import axios from "axios";
import { useEffect, useState } from "react";

function App() {
    const [citizen, set_citizen] = useState([]);
    useEffect(() => {
        axios.get("http://localhost:3001/citizen").then((res) => {
            set_citizen(res.data);
        });
    }, []);

    const on_click = async () => {
        //const mock = { accessToken: "a t lol", refreshToken: "r t xd" };
        //localStorage.setItem("tokens", JSON.stringify(mock));
        const { accessToken, refreshToken } = JSON.parse(
            localStorage.getItem("tokens")
        );
        const auth_header = {
            access_token: accessToken,
            refresh_token: refreshToken,
        };
        axios
            .get("http://localhost:3001/test", {
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

    return (
        <div className="App">
            <h1>Fundsachen</h1>
            <table bgcolor="black" align="center">
                <tbody>
                    <tr bgcolor="grey">
                        <th width="400">Vorname</th>
                        <th width="400">Nachname</th>
                        <th width="400">E-Mail</th>
                    </tr>

                    {citizen.map((value, key) => {
                        return (
                            <tr key={key} bgcolor="lightgrey">
                                <td>{value.first_name}</td>
                                <td>{value.last_name}</td>
                                <td>{value.email}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            <button onClick={on_click}>test auth</button>
        </div>
    );
}

export default App;
