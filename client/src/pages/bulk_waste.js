import React, { createRef, useContext, useEffect, useState } from "react";
import {
    Button,
    Box,
    Typography,
    TextField,
    Checkbox,
    FormControlLabel,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from "@mui/material";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import { AuthContext } from "../App";
import { useFormik } from "formik";
import axios from "axios";
import * as yup from "yup";
import AlertModal from "../components/alert_modal";
import moment from "moment";
import Access_Denied from "../components/access_denied";

function Bulk_Waste() {
    const { authState } = useContext(AuthContext);
    const [submitted, set_submitted] = useState(false);
    const [citizen, set_citizen] = useState({});
    const [date, set_date] = useState(new Date());
    const [is_open, set_is_open] = useState(false);
    const [modal, set_modal] = useState({
        title: "Fehler",
        content:
            "Bei der Bearbeitung ist etwas schiefgelaufen. Versuchen Sie es später erneut oder kontaktieren Sie uns hier: 3171023!",
    });

    const handle_date_change = (newValue) => {
        set_date(newValue);
    };

    const initial_values = {
        street: "",
        building_number: "",
        type: "Sperrmüll",
    };

    const [form_values, set_from_values] = useState(initial_values);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name && value) {
            set_from_values({
                ...form_values,
                [name]: value,
            });
        }
    };

    const submit = async (event) => {
        event.preventDefault();
        set_is_open(false);

        const data = {
            ...form_values,
            date: moment(date).format("YYYY-MM-DD"),
        };
        console.log(data);
        await axios
            .post(
                `${process.env.REACT_APP_BACKEND_HOST}/misc/bulk_waste`,
                data,
                {
                    withCredentials: true,
                }
            )
            .then((res) => {
                console.log(res.data);
                set_modal({
                    title: "Erfolg",
                    content: "Die Anmeldung ihres Sperrmülls war erfolgreich!",
                });
            })
            .catch((err) => {
                console.log(err.response.data);
            });

        set_is_open(true);
    };

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
                    set_from_values({
                        ...form_values,
                        street: res.data.street,
                        building_number: res.data.building_number,
                    });
                })
                .catch((err) => {
                    console.log(err.response.data);
                    set_citizen({});
                });
        }
    }, [authState.status]);

    if (!authState.status) {
        return (
            <>
                <Access_Denied />
            </>
        );
    } else {
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
                        open={is_open}
                    />
                )}
                <Box sx={{ mx: "5em", width: "33%" }}>
                    <Typography sx={{}} variant="h3" align="left" gutterBottom>
                        Sperrmüllanmeldung
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
                        Informationen und Tipps
                    </Typography>
                    <Typography
                        sx={{
                            wordWrap: "break-word",
                            fontSize: 13,
                        }}
                        align="left"
                        gutterBottom
                    >
                        Um unsere Umwelt zu schonen und die Ressourcen sinnvoll
                        zu nutzen, können Sie Ihren Beitrag dazu leisten.
                        <br />
                        <br /> Richtiges Anmelden von Sperrmüll ermöglicht es
                        die Sperrmülltouren zu optimieren und die Kosten für die
                        Bürger transparent und gerecht zu gestalten.
                        <br />
                        <br /> Bitte geben Sie Schritt für Schritt alle bei
                        Ihnen abzuholenden Sperrgüter (Altholz, Elektro,
                        Sperrmüll) an. Nur angemeldeter und ausreichend mit
                        Marken versehener Sperrmüll wird abgefahren.
                        <br />
                        <br />
                        Bitte denken Sie daran, dass eine Markeneinheit
                        gleichzusetzen ist mit „was 2 Mann problemlos tragen
                        können“ (max. 50 kg je nach Sperrigkeit). Unsere
                        Fachkräfte sind körperliche Arbeit gewohnt, aber auch
                        sie sind nur Menschen.
                        <br />
                        <br />
                        Befestigen Sie bitte Ihre Marken gut und sichtbar am
                        Sperrgut.
                        <br />
                        <br />
                        Eine Bestätigung sowie eine Erinnerung zu Ihrer
                        Sperrmüllanmeldung erhalten Sie nur noch per E-Mail.
                        Auch hier entlasten wir unsere Umwelt, da wir auf den
                        bisher üblichen Versand von Briefen verzichten.
                        <br />
                        <br />
                        Wir danken Ihnen!
                    </Typography>
                </Box>
                <Divider
                    sx={{
                        borderWidth: "1px",
                        borderColor: "lightgray",
                    }}
                />
                <Box sx={{ my: "4%", mx: "5em" }}>
                    <form onSubmit={submit}>
                        <Typography
                            sx={{
                                wordWrap: "break-word",
                                fontWeight: "bold",
                                fontSize: 16,
                            }}
                            align="left"
                            gutterBottom
                        >
                            Abholadresse:
                        </Typography>
                        <TextField
                            name="street"
                            type="text"
                            label="Straße"
                            sx={{ m: "5px", mb: "15px" }}
                            variant="standard"
                            value={form_values.street}
                            onChange={handleInputChange}
                            reqired
                        />
                        <TextField
                            name="building_number"
                            type="number"
                            label="Hausnummer"
                            sx={{ m: "5px", mb: "15px" }}
                            variant="standard"
                            value={form_values.building_number}
                            onChange={handleInputChange}
                            reqired
                        />
                        <Typography
                            sx={{
                                wordWrap: "break-word",
                                fontWeight: "bold",
                                fontSize: 16,
                            }}
                            align="left"
                            gutterBottom
                        >
                            Ich melde an:
                        </Typography>
                        <FormControl
                            sx={{ m: "5px", mb: "15px", minWidth: "100px" }}
                        >
                            <InputLabel>Sperrgut </InputLabel>
                            <Select
                                reqired
                                variant="standard"
                                name="type"
                                value={form_values.type}
                                onChange={handleInputChange}
                            >
                                <MenuItem value={"Sperrmüll"}>
                                    Sperrmüll
                                </MenuItem>
                                <MenuItem value={"Altholz"}>Altholz</MenuItem>
                                <MenuItem value={"Elektro"}>Elektro</MenuItem>
                            </Select>
                        </FormControl>
                        <Typography
                            sx={{
                                wordWrap: "break-word",
                                fontWeight: "bold",
                                fontSize: 16,
                            }}
                            align="left"
                            gutterBottom
                        >
                            Abholen ab dem:
                        </Typography>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <Box sx={{ mx: "5px", my: "15px" }}>
                                <DesktopDatePicker
                                    label="Date desktop"
                                    inputFormat="dd/MM/yyyy"
                                    value={date}
                                    onChange={handle_date_change}
                                    renderInput={(params) => (
                                        <TextField {...params} />
                                    )}
                                />
                            </Box>
                        </LocalizationProvider>
                        <Button
                            sx={{ mx: "5px", mt: "15px" }}
                            variant="contained"
                            type="submit"
                        >
                            Anmelden
                        </Button>
                    </form>
                </Box>
            </Box>
        );
    }
}

export default Bulk_Waste;
