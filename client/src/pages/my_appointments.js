import React, { createRef, useContext, useEffect, useState } from "react";
import {
    Button,
    Box,
    Typography,
    TextField,
    Checkbox,
    FormControlLabel,
    Card,
    CardContent,
} from "@mui/material";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import { AuthContext } from "../App";
import { useFormik } from "formik";
import axios from "axios";
import * as yup from "yup";
import AlertModal from "../components/alert_modal";

function My_Appointments() {
    const { authState } = useContext(AuthContext);
    const [appointments, set_appointments] = useState([]);

    useEffect(() => {
        if (authState.status) {
            axios
                .get(
                    `${process.env.REACT_APP_BACKEND_HOST}/appointment/mine/`,
                    {
                        withCredentials: true,
                    }
                )
                .then((res) => {
                    console.log(res.data);
                    set_appointments(res.data);
                })
                .catch((err) => {
                    console.log(err.response.data);
                });
        }
    }, []);

    const issue_info = (issue) => {
        if (issue === "An- und Ummelden") {
            return (
                <Typography sx={{ m: "1%" }} variant="h5" align="left">
                    An- und Ummelden Informationen:
                    <Typography sx={{ m: "2%" }} align="left">
                        erforderliche Unterlagen:
                        <br />
                        <br />- Ausweisdokument(e)
                        <br />- Wohnungsgeberbestätigung
                    </Typography>
                </Typography>
            );
        }
        if (issue === "Beantragung Ausweisdokumente") {
            return (
                <Typography sx={{ m: "2%" }} align="left">
                    erforderliche Unterlagen / Gebühren für Personalausweise /
                    Reisepässe:
                    <br />
                    <br />- Personalausweis oder Reisepass
                    <br />- Geburts- oder Heiratsurkunde
                    <br />- aktuelle biometrisches Lichtbild
                    <br />
                    <br />- Gebühr: 37,00 € (Personalausweis) oder 60,00 €
                    (Reisepass)
                    <br />
                    <br />
                    <br />
                    erforderliche Unterlagen für Kinderreisepässe:
                    <br />
                    <br />- Geburtsurkunde des Kindes
                    <br />- Zustimmungserklärung aller Sorgeberechtigten
                    <br />- aktuelles Lichtbild des Kindes
                    <br />- Vorsprache mit Kind
                    <br />
                    <br />- Gebühr: 13,00 € (Neuausstellung) oder 6,00 €
                    (Verlängerung/Bildaktualisierung)
                    <br />
                    <br />
                    <br />
                    Die Zustimmungserklärung zur Antragstellung/Aushändigung von
                    Kinderreisepässen können Sie über diesen Formularassistenten
                    ausfüllen und anschließend ausdrucken:
                    <br />
                    https://formulare-owl.de/metaform/Form-Solutions/sid/assistant/6253e3021b302b43227b8354
                </Typography>
            );
        }
        if (issue === "Beglaubiegungen") {
            return (
                <Typography sx={{ m: "2%" }} align="left">
                    erforderliche Unterlagen / Gebühren:
                    <br />
                    <br />- Original des Dokuments
                    <br />- Kopie(n) des Dokuments
                    <br />- Gebühr (Höhe abhängig von der Anzahl)
                </Typography>
            );
        }
        if (issue === "Fischereischein") {
            return (
                <Typography sx={{ m: "2%" }} align="left">
                    erforderliche Unterlagen:
                    <br />
                    <br />- Personalausweis oder Reisepass
                    <br />- Fischereischein oder Prüfungszeugnis
                </Typography>
            );
        }
        if (issue === "Ausländer-Angelegenheiten") {
            return (
                <Typography sx={{ m: "2%" }} align="left">
                    - Aufenthaltstitel oder
                    <br />- gestattung oder Duldung
                    <br />- Pass (wenn vorhanden)
                </Typography>
            );
        }
        if (issue === "Führerscheinangelegenheiten") {
            return (
                <Typography sx={{ m: "2%" }} align="left">
                    erforderliche Unterlagen:
                    <br />
                    <br />- Personalausweis oder Reisepass
                    <br />- aktuelles biometrisches Passbild
                    <br />- Führerschein
                    <br />
                    <br />
                    Im Hinblick auf weitere Unterlagen erkundigen Sie sich bitte
                    im Vorfeld bei Ihrer Fahrschule, beim Straßenverkehrsamt des
                    Kreises Herford oder beim Bürgerbüro der Stadt Löhne.
                </Typography>
            );
        }
    };

    if (!authState.status) {
        return (
            <>
                <h1>
                    Sie haben keinen Zugriff auf diese Seite bitte melden Sie
                    sich zuerst an!
                </h1>
            </>
        );
    } else {
        return (
            <>
                <Box sx={{ width: "100%", my: 5 }}>
                    <Typography variant="h2" align="center" gutterBottom>
                        Meine Termine
                    </Typography>
                    <Typography sx={{ mx: "5%" }} variant="h6" align="center">
                        Hier finden Sie eine Auflistung all ihrer Termine
                    </Typography>
                    <Divider />

                    {appointments.map((appointment, index) => {
                        return (
                            <>
                                <Box
                                    sx={{
                                        width: "50%",
                                        m: "auto",
                                        my: "1%",
                                    }}
                                >
                                    <Card variant="outlined">
                                        <CardContent>
                                            <Typography
                                                variant="h5"
                                                component="div"
                                            >
                                                {appointment.issue}
                                            </Typography>
                                            <Typography
                                                sx={{ mb: 1.5 }}
                                                color="text.secondary"
                                            >
                                                {appointment.date}
                                            </Typography>
                                            <Typography variant="body2">
                                                {appointment.time.replace(
                                                    /:00+$/,
                                                    ""
                                                )}{" "}
                                                Uhr
                                            </Typography>
                                            <Divider sx={{ my: 1 }} />
                                            {issue_info(appointment.issue)}
                                        </CardContent>
                                    </Card>
                                </Box>
                            </>
                        );
                    })}
                </Box>
            </>
        );
    }
}

export default My_Appointments;
