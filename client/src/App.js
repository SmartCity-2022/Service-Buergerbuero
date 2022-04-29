import "./App.css";
import axios from "axios";
import { useEffect } from "react";

function App() {
    useEffect(() => {
        axios.get("http://localhost:3001/test").then((res) => {
            console.log(res.data);
        });
    }, []);

    return <div className="App">buegerbuero</div>;
}

export default App;
