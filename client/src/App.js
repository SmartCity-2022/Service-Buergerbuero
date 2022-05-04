import "./App.css";
import axios from "axios";
import { useEffect, useState } from "react";

function App() {
    const [lost, set_lost] = useState([]);
    useEffect(() => {
        axios.get("http://localhost:3001/lost_property").then((res) => {
            console.log();
            set_lost(res.data);
        });
    }, []);

    return (
        <div className="App">
            <h1>Fundsachen</h1>
            <table bgcolor="black" align="center">
                <tbody>
                    <tr bgcolor="grey">
                        <th width="400">Datum gefunden</th>
                        <th width="400">Typ</th>
                        <th width="400">Beschreibung</th>
                    </tr>

                    {lost.map((value, key) => {
                        return (
                            <tr key={key} bgcolor="lightgrey">
                                <td>{value.found_on}</td>
                                <td>{value.type}</td>
                                <td>{value.desc}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

export default App;
