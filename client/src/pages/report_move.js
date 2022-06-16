import React, { useContext, useEffect, useState } from "react";
import { Button, Box, Typography, TextField } from "@mui/material";
import Divider from "@mui/material/Divider";
import { AuthContext } from "../App";
import { useFormik } from "formik";
import axios from "axios";
import * as yup from "yup";

function Report_move() {
    const { authState } = useContext(AuthContext);
    const [is_disabled, set_is_disabled] = useState(false);

    let initial_values = {
        first_name: "",
        last_name: "",
        street: "",
        building_number: "",
        email: "",
        phone: "",
    };

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
    }, []);

    const logged_in = () => {
        return (
            <Box sx={{ width: "100%", my: 5 }}>
                <Typography variant="h3" align="center" gutterBottom>
                    Innerhalb
                </Typography>
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
            })
            .catch((obj) => {
                console.log(obj.response.data);
            });
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
