import React, { Suspense } from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import { Box, Typography, Divider } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
const moment = require("moment");

function Lost_and_found() {
    const [rows, set_rows] = useState([]);
    const columns = [
        {
            field: "found_on",
            headerName: "Funddatum",
            type: "date",
            width: 500,
        },
        { field: "type", headerName: "Fundgruppe", width: 500 },
        {
            field: "desc",
            headerName: "Beschreibung",
            width: 500,
        },
    ];

    useEffect(() => {
        axios
            .get(`${process.env.REACT_APP_BACKEND_HOST}/lost_property`)
            .then((res) => {
                let data = res.data;
                for (let i = 0; i < Object.keys(data).length; i++) {
                    data[i].found_on = moment(data[i].found_on).format(
                        "DD/MM/YYYY"
                    );
                }
                set_rows(data);
            });
    }, []);

    return (
        <>
            <Suspense>
                <Box sx={{ width: "100%", my: 5 }}>
                    <Typography variant="h2" align="center" gutterBottom>
                        Fundsachen
                    </Typography>
                    <Typography sx={{ mx: "5%" }} variant="h6" align="center">
                        Hier finden Sie eine Liste aller Fundsachen, welche bei
                        uns hinterlegt sind.
                    </Typography>
                    <Typography
                        sx={{ mx: "5%" }}
                        variant="h6"
                        align="center"
                        gutterBottom
                    >
                        Wenn Sie in letzter Zeit etwas verloren haben und
                        glauben, dass einer dieser Gegenstände Ihnen gehören
                        könnte, dann melden Sie sich bitte bei uns.
                    </Typography>
                    <Divider />
                    <Box
                        sx={{ height: 600, width: "80%", m: "auto", my: "1%" }}
                    >
                        <DataGrid rows={rows} columns={columns} pageSize={9} />
                    </Box>
                </Box>
            </Suspense>
        </>
    );
}

export default Lost_and_found;
