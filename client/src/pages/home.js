import React from "react";
import axios from "axios";
import { useEffect, useState, useContext } from "react";
import {
    Button,
    Box,
    Typography,
    Table,
    TableBody,
    TableHead,
    TableRow,
    TableCell,
    Divider,
} from "@mui/material";
import { AuthContext } from "../App";

function Home() {
    const { authState } = useContext(AuthContext);

    useEffect(() => {
        console.log(authState);
    }, [authState.status]);

    return (
        <>
            <Box sx={{ width: "100%", my: 20 }}>
                <Typography variant="h2" align="center" gutterBottom>
                    Microservice Bürgerbüro
                </Typography>
                <Divider sx={{ mx: 10, my: 5 }} />
                <Typography variant="h4" align="center" gutterBottom>
                    Willkommen zum Bürgerbüro!
                </Typography>
                <Typography variant="h5" align="center" gutterBottom>
                    Hier finden Sie alle Dienstleistungen und Informationen
                    welche von unserem Bürgerbüro zu Verfügung gestellt werden.
                </Typography>
            </Box>
        </>
    );
}

export default Home;
