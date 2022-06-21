import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import {
    Button,
    Box,
    Typography,
    Table,
    TableBody,
    TableHead,
    TableRow,
    TableCell,
} from "@mui/material";

function Home() {
    const [citizen, set_citizen] = useState([]);
    useEffect(() => {
        axios
            .get(`${process.env.REACT_APP_BACKEND_HOST}/citizen`)
            .then((res) => {
                set_citizen(res.data);
            });
    }, []);

    const on_click = async () => {
        axios
            .get(`${process.env.REACT_APP_BACKEND_HOST}/misc`, {
                withCredentials: true,
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
            .get(`${process.env.REACT_APP_BACKEND_HOST}/misc/mock`)
            .then((res) => {
                console.log(res.data);
                window.location.reload(false);
            })
            .catch((obj) => {
                console.log(obj.response.data);
            });
    };
    return (
        <>
            <Box sx={{ width: "100%", my: 5 }}>
                <Typography variant="h2" align="center" gutterBottom>
                    Willkommen zum Bürgerbüro
                </Typography>
                <div align="center">
                    <Button
                        sx={{
                            my: 2,
                            mx: 1,
                            color: "black",
                            bgcolor: "red",
                            border: 2,
                            borderColor: "white",
                            ":hover": { borderColor: "black" },
                        }}
                        onClick={on_click}
                    >
                        test auth
                    </Button>
                    <Button
                        sx={{
                            my: 2,
                            mx: 1,
                            color: "black",
                            bgcolor: "green",
                            border: 2,
                            borderColor: "white",
                            ":hover": { borderColor: "black" },
                        }}
                        onClick={on_click_mock}
                    >
                        add mock data
                    </Button>
                </div>
                <Typography variant="h2" align="center" gutterBottom>
                    Bürger
                </Typography>
                <Typography variant="h5" align="center" gutterBottom>
                    Neue Büger sind oben in der Tabelle :)
                </Typography>
                <Table
                    sx={{
                        minWidth: 650,
                        maxWidth: "80%",
                    }}
                    align="center"
                >
                    <TableHead bgcolor="lightgreen">
                        <TableRow>
                            <TableCell width="400">Vorname</TableCell>
                            <TableCell width="400">Nachname</TableCell>
                            <TableCell width="400">E-Mail</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Array.isArray(citizen) &&
                            citizen
                                .slice(0)
                                .reverse()
                                .map((value, key) => {
                                    return (
                                        <TableRow
                                            key={key}
                                            sx={
                                                key % 2
                                                    ? { bgcolor: "lightgrey" }
                                                    : { bgcolor: "lightblue" }
                                            }
                                        >
                                            <TableCell>
                                                {value.first_name}
                                            </TableCell>
                                            <TableCell>
                                                {value.last_name}
                                            </TableCell>
                                            <TableCell>{value.email}</TableCell>
                                        </TableRow>
                                    );
                                })}
                    </TableBody>
                </Table>
            </Box>
        </>
    );
}

export default Home;
