import React, { createRef, useContext, useEffect, useState } from "react";
import {
    Button,
    Box,
    Typography,
    TextField,
    Checkbox,
    FormControlLabel,
} from "@mui/material";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import { AuthContext } from "../App";
import { useFormik } from "formik";
import axios from "axios";
import * as yup from "yup";
import AlertModal from "../components/alert_modal";

function Report_move() {
    const { authState } = useContext(AuthContext);
    const [checked, set_checked] = useState(true);
    const [is_disabled, set_is_disabled] = useState(false);
    const [is_open, set_is_open] = useState(false);
    const [citizen, set_citizen] = useState({});
    const [modal, set_modal] = useState({
        title: "Fehler",
        content:
            "Bei der Bearbeitung ist etwas schiefgelaufen.Versuchen Sie es später erneut oder kontaktieren Sie uns hier: 3171023!",
    });
    const [initial_values, set_initial_values] = useState({
        first_name: "",
        last_name: "",
        street: "",
        building_number: "",
        email: "",
        phone: "",
    });

    const validation_schema = yup.object({
        email: yup
            .string("E-Mail angeben")
            .email("E-Mail ist Fehlerhaft")
            .required("E-Mail ist ein Plichtfeld"),
        first_name: yup
            .string("Vorname angeben")
            .required("Vorname ist ein Plichtfeld"),
        last_name: yup
            .string("Nachname angeben")
            .required("Nachname ist ein Plichtfeld"),
        street: yup
            .string("Straße angeben")
            .required("Straße ist ein Plichtfeld"),
        building_number: yup
            .number("Hausnummer angeben")
            .required("Hausnummer ist ein Plichtfeld"),
    });

    useEffect(() => {
        console.log(authState);
        if (authState.status) {
            axios
                .get(
                    `${process.env.REACT_APP_BACKEND_HOST}/citizen?email=${authState.email}`
                )
                .then((res) => {
                    console.log(res.data);
                    set_citizen(res.data);
                    set_initial_values(res.data);
                })
                .catch((err) => {
                    console.err(err.response.data);
                    set_citizen({});
                });
        }
    }, [authState.status]);

    const cb_change = (event) => {
        set_checked(event.target.checked);
    };

    const citizen_submit = async (data) => {
        console.log(data);
        if (checked) {
            data.type = "within";
        } else {
            data.type = "away";
        }
        set_is_disabled(true);
        await axios
            .patch(`${process.env.REACT_APP_BACKEND_HOST}/citizen/move`, data)
            .then((res) => {
                console.log(res.data);
                set_modal({
                    title: "Erfolg",
                    content: "Die meldung ihres Umzugs war erfolgreich!",
                });
            })
            .catch((obj) => {
                console.log(obj.response.data);
            });
        set_is_open(true);
    };

    const citizen_formik = useFormik({
        initialValues: initial_values,
        validationSchema: validation_schema,
        onSubmit: citizen_submit,
        enableReinitialize: true,
    });

    const logged_in = () => {
        return (
            <Box
                sx={{
                    display: "flex",
                    flexWrap: "nowrap",
                    m: 5,
                    bgcolor: "background.paper",
                    borderRadius: 1,
                    justifyContent: "flex-start",
                }}
            >
                {is_open && (
                    <AlertModal
                        title={modal.title}
                        content={modal.content}
                        open={true}
                    />
                )}
                <Box sx={{ mx: "5em", width: "33%" }}>
                    <Typography sx={{}} variant="h3" align="left" gutterBottom>
                        Umzug melden
                    </Typography>
                    <Typography
                        sx={{
                            wordWrap: "break-word",
                            fontWeight: "bold",
                            fontSize: 16,
                        }}
                        align="left"
                        gutterBottom
                    >
                        Hier können Sie ihren Umzug melden.
                    </Typography>
                    <Typography
                        sx={{
                            wordWrap: "break-word",
                            fontSize: 13,
                        }}
                        align="left"
                        gutterBottom
                    >
                        Sie können hier sowohl einen Umzug innerhalb unserer
                        Stadt melden als auch einen Umzug aus unserer Stadt
                        heraus.
                    </Typography>
                </Box>
                <Divider
                    sx={{
                        borderWidth: "1px",
                        borderColor: "lightgray",
                    }}
                />
                <Box sx={{ mx: "5em" }}>
                    <Typography variant="h5" align="left" gutterBottom>
                        Aktuelle Daten
                    </Typography>
                    <Typography
                        sx={{
                            wordWrap: "break-word",
                            fontWeight: "bold",
                            fontSize: 14,
                        }}
                        align="left"
                        gutterBottom
                    >
                        Dies sind die Daten unter welchen Sie aktuell bei uns
                        gemeldet sind.
                    </Typography>

                    <Box
                        sx={{
                            border: 1,
                            p: "5px",
                            pb: "10px",
                            borderColor: "lightgray",
                            my: "20px",
                        }}
                        maxWidth="75%"
                    >
                        <Grid container columns={2}>
                            <Grid item xs={1}>
                                <Typography
                                    sx={{
                                        wordWrap: "break-word",
                                        fontSize: 14,
                                        mx: "3px",
                                        my: "6px",
                                    }}
                                    align="left"
                                    gutterBottom
                                >
                                    {`Vorname: ${citizen.first_name}`}
                                </Typography>
                            </Grid>
                            <Grid item xs={1}>
                                <Typography
                                    sx={{
                                        wordWrap: "break-word",
                                        fontSize: 14,
                                        mx: "3px",
                                        my: "6px",
                                    }}
                                    align="left"
                                    gutterBottom
                                >
                                    {`Nachname: ${citizen.last_name}`}
                                </Typography>
                            </Grid>
                            <Grid item xs={1}>
                                <Typography
                                    sx={{
                                        wordWrap: "break-word",
                                        fontSize: 14,
                                        mx: "3px",
                                        my: "6px",
                                    }}
                                    align="left"
                                    gutterBottom
                                >
                                    {`E-Mail: ${citizen.email}`}
                                </Typography>
                            </Grid>
                            <Grid item xs={1}>
                                <Typography
                                    sx={{
                                        wordWrap: "break-word",
                                        fontSize: 14,
                                        mx: "3px",
                                        my: "6px",
                                    }}
                                    align="left"
                                    gutterBottom
                                >
                                    {`Telefon: ${citizen.phone}`}
                                </Typography>
                            </Grid>
                            <Grid item xs={1}>
                                <Typography
                                    sx={{
                                        wordWrap: "break-word",
                                        fontSize: 14,
                                        mx: "3px",
                                        my: "6px",
                                    }}
                                    align="left"
                                    gutterBottom
                                >
                                    {`Straße: ${citizen.street}`}
                                </Typography>
                            </Grid>
                            <Grid item xs={1}>
                                <Typography
                                    sx={{
                                        wordWrap: "break-word",
                                        fontSize: 14,
                                        mx: "3px",
                                        my: "6px",
                                    }}
                                    align="left"
                                    gutterBottom
                                >
                                    {`Hausnummer: ${citizen.building_number}`}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Box>
                    <Typography variant="h5" align="left" gutterBottom>
                        Neue Adresse
                    </Typography>
                    <Typography
                        sx={{
                            wordWrap: "break-word",
                            fontWeight: "bold",
                            fontSize: 14,
                        }}
                        align="left"
                        gutterBottom
                    >
                        Geben Sie hier bitte die Adresse ein, unter welchen Sie
                        zukünftig gemeldet wollen sein.
                    </Typography>
                    <form onSubmit={citizen_formik.handleSubmit}>
                        <Box
                            sx={{
                                border: 1,
                                p: "5px",
                                pb: "10px",
                                borderColor: "lightgray",
                                mt: "20px",
                            }}
                            maxWidth="75%"
                        >
                            <TextField
                                name="street"
                                type="text"
                                label="Straße"
                                sx={{ m: "5px", mr: "10%" }}
                                variant="standard"
                                value={citizen_formik.values.street}
                                onChange={citizen_formik.handleChange}
                                error={
                                    citizen_formik.touched.street &&
                                    Boolean(citizen_formik.errors.street)
                                }
                                helperText={
                                    citizen_formik.touched.street &&
                                    citizen_formik.errors.street
                                }
                            />
                            <TextField
                                name="building_number"
                                type="number"
                                label="Hausnummer"
                                sx={{ m: "5px" }}
                                variant="standard"
                                value={citizen_formik.values.building_number}
                                onChange={citizen_formik.handleChange}
                                error={
                                    citizen_formik.touched.building_number &&
                                    Boolean(
                                        citizen_formik.errors.building_number
                                    )
                                }
                                helperText={
                                    citizen_formik.touched.building_number &&
                                    citizen_formik.errors.building_number
                                }
                            />
                            <br />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={checked}
                                        onChange={cb_change}
                                        size="small"
                                        sx={{ ml: "5px" }}
                                    />
                                }
                                sx={{ mt: "5px" }}
                                label="Umzug Innerhalb"
                            />
                        </Box>
                        <Box>
                            <Button
                                sx={{
                                    mt: "3%",
                                }}
                                variant="contained"
                                color="primary"
                                type="submit"
                                disabled={is_disabled}
                            >
                                Melden
                            </Button>
                        </Box>
                    </form>
                </Box>
            </Box>
        );
    };

    const guest_submit = async (data) => {
        console.log(data);
        set_is_disabled(true);
        await axios
            .post(`${process.env.REACT_APP_BACKEND_HOST}/citizen`, data)
            .then((res) => {
                console.log(res.data);
                set_modal({
                    title: "Erfolg",
                    content:
                        "Die Anmeldung als zugezogener Bürger war erfolgreich!",
                });
            })
            .catch((obj) => {
                console.log(obj.response.data);
            });
        set_is_open(true);
    };

    const guest_formik = useFormik({
        initialValues: initial_values,
        validationSchema: validation_schema,
        onSubmit: guest_submit,
    });

    const guest = () => {
        return (
            <Box
                sx={{
                    display: "flex",
                    flexWrap: "nowrap",
                    m: 5,
                    bgcolor: "background.paper",
                    borderRadius: 1,
                    justifyContent: "flex-start",
                }}
            >
                {is_open && (
                    <AlertModal
                        title={modal.title}
                        content={modal.content}
                        open={true}
                    />
                )}
                <Box sx={{ mx: "5em", width: "33%" }}>
                    <Typography sx={{}} variant="h3" align="left" gutterBottom>
                        Zuzug melden
                    </Typography>
                    <Typography
                        sx={{
                            wordWrap: "break-word",
                            fontWeight: "bold",
                            fontSize: 16,
                        }}
                        align="left"
                        gutterBottom
                    >
                        Hier können Sie ihren Zuzug in unsere Stadt melden.
                    </Typography>
                    <Typography
                        sx={{
                            wordWrap: "break-word",
                            fontSize: 13,
                        }}
                        align="left"
                        gutterBottom
                    >
                        Falls Sie schon in unserer Stadt wohnen und innerhalb
                        umziehen oder aus unserer Stadt wegziehen wollen, dann
                        melden Sie sich bitte im MainHub an und kommen dann zu
                        dieser Seite zurück.
                    </Typography>
                </Box>
                <Divider
                    sx={{
                        borderWidth: "1px",
                        borderColor: "lightgray",
                    }}
                />
                <Box sx={{ mx: "5em" }}>
                    <Typography variant="h4" align="left" gutterBottom>
                        Zukünftige Adresse
                    </Typography>
                    <Typography
                        sx={{
                            wordWrap: "break-word",
                            fontWeight: "bold",
                            fontSize: 14,
                        }}
                        align="left"
                        gutterBottom
                    >
                        Geben Sie hier bitte ihre Daten und die Adresse ein
                        unter welcher Sie zukünftig gemeldet sein wollen.
                    </Typography>

                    <form onSubmit={guest_formik.handleSubmit}>
                        <Box
                            sx={{
                                border: 1,
                                p: "5px",
                                pb: "10px",
                                borderColor: "lightgray",
                            }}
                        >
                            <TextField
                                name="first_name"
                                type="text"
                                label="Vorname"
                                sx={{ m: "5px", mr: "10%" }}
                                variant="standard"
                                value={guest_formik.values.first_name}
                                onChange={guest_formik.handleChange}
                                error={
                                    guest_formik.touched.first_name &&
                                    Boolean(guest_formik.errors.first_name)
                                }
                                helperText={
                                    guest_formik.touched.first_name &&
                                    guest_formik.errors.first_name
                                }
                            />
                            <TextField
                                name="last_name"
                                type="text"
                                label="Nachname"
                                sx={{ m: "5px" }}
                                variant="standard"
                                value={guest_formik.values.last_name}
                                onChange={guest_formik.handleChange}
                                error={
                                    guest_formik.touched.last_name &&
                                    Boolean(guest_formik.errors.last_name)
                                }
                                helperText={
                                    guest_formik.touched.last_name &&
                                    guest_formik.errors.last_name
                                }
                            />
                            <br />
                            <TextField
                                id="email"
                                name="email"
                                type="email"
                                label="E-Mail"
                                sx={{ m: "5px", mr: "10%" }}
                                variant="standard"
                                value={guest_formik.values.email}
                                onChange={guest_formik.handleChange}
                                error={
                                    guest_formik.touched.email &&
                                    Boolean(guest_formik.errors.email)
                                }
                                helperText={
                                    guest_formik.touched.email &&
                                    guest_formik.errors.email
                                }
                            />
                            <TextField
                                name="phone"
                                type="text"
                                label="Telefon"
                                sx={{ m: "5px" }}
                                variant="standard"
                                value={guest_formik.values.phone}
                                onChange={guest_formik.handleChange}
                            />
                            <br />
                            <TextField
                                name="street"
                                type="text"
                                label="Straße"
                                sx={{ m: "5px", mr: "10%" }}
                                variant="standard"
                                value={guest_formik.values.street}
                                onChange={guest_formik.handleChange}
                                error={
                                    guest_formik.touched.street &&
                                    Boolean(guest_formik.errors.street)
                                }
                                helperText={
                                    guest_formik.touched.street &&
                                    guest_formik.errors.street
                                }
                            />
                            <TextField
                                name="building_number"
                                type="number"
                                label="Hausnummer"
                                sx={{ m: "5px" }}
                                variant="standard"
                                value={guest_formik.values.building_number}
                                onChange={guest_formik.handleChange}
                                error={
                                    guest_formik.touched.building_number &&
                                    Boolean(guest_formik.errors.building_number)
                                }
                                helperText={
                                    guest_formik.touched.building_number &&
                                    guest_formik.errors.building_number
                                }
                            />
                        </Box>
                        <Box>
                            <Button
                                sx={{
                                    mt: "3%",
                                }}
                                variant="contained"
                                color="primary"
                                type="submit"
                                disabled={is_disabled}
                            >
                                Melden
                            </Button>
                        </Box>
                    </form>
                </Box>
            </Box>
        );
    };

    return <>{authState.status ? logged_in() : guest()}</>;
}

export default Report_move;
