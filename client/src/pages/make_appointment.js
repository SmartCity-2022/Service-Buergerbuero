import React, { createRef, useContext, useEffect, useState } from "react";
import {
    Button,
    Box,
    Typography,
    TextField,
    Checkbox,
    FormControlLabel,
    Step,
    Stepper,
    StepLabel,
    Select,
    FormControl,
    MenuItem,
    InputLabel,
    Container,
    Toolbar,
} from "@mui/material";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import { AuthContext } from "../App";
import { useFormik } from "formik";
import axios from "axios";
import * as yup from "yup";
import AlertModal from "../components/alert_modal";
import cw from "../utils/date_helper";
const moment = require("moment");

const steps = ["Anliegen auswählen", "Termin wählen", "Bestätigen"];

const optional = [];

function Make_Appointment() {
    const [activeStep, setActiveStep] = React.useState(0);
    const [skipped, setSkipped] = React.useState(new Set());
    const [cw_offset, set_cw_offset] = React.useState(0);

    const isStepOptional = (step) => {
        if (step in optional) {
            return true;
        }
        return false;
    };

    const isStepSkipped = (step) => {
        return skipped.has(step);
    };

    const handleNext = () => {
        if (formik.values.issue !== "") {
            let newSkipped = skipped;
            if (isStepSkipped(activeStep)) {
                newSkipped = new Set(newSkipped.values());
                newSkipped.delete(activeStep);
            }

            setActiveStep((prevActiveStep) => prevActiveStep + 1);
            setSkipped(newSkipped);
        }
        if (activeStep === steps.length - 1) {
            formik.submitForm();
        }
    };

    const cw_handle_next = () => {
        if (cw_offset <= 6) {
            set_cw_offset((curr) => curr + 1);
        }
    };

    const cw_handle_back = () => {
        if (cw_offset > 0) {
            set_cw_offset((curr) => curr - 1);
        }
    };

    const handleSkip = () => {
        if (!isStepOptional(activeStep)) {
            // You probably want to guard against something like this,
            // it should never occur unless someone's actively trying to break something.
            throw new Error("You can't skip a step that isn't optional.");
        }
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        setSkipped((prevSkipped) => {
            const newSkipped = new Set(prevSkipped.values());
            newSkipped.add(activeStep);
            return newSkipped;
        });
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleReset = () => {
        formik.handleReset();
        setActiveStep(0);
    };

    const initial_values = {
        issue: "",
    };

    const submit = (data) => {
        console.log(data);
    };

    const formik = useFormik({
        initialValues: initial_values,
        onSubmit: submit,
    });

    const issue_info = () => {
        if (formik.values.issue === "An- und Ummelden") {
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
        if (formik.values.issue === "Beantragung Ausweisdokumente") {
            return (
                <Typography sx={{ m: "1%" }} variant="h5" align="left">
                    Beantragung Ausweisdokumente Informationen:
                    <Typography sx={{ m: "2%" }} align="left">
                        erforderliche Unterlagen / Gebühren für Personalausweise
                        / Reisepässe:
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
                        Die Zustimmungserklärung zur Antragstellung/Aushändigung
                        von Kinderreisepässen können Sie über diesen
                        Formularassistenten ausfüllen und anschließend
                        ausdrucken:
                        <br />
                        https://formulare-owl.de/metaform/Form-Solutions/sid/assistant/6253e3021b302b43227b8354
                    </Typography>
                </Typography>
            );
        }
        if (formik.values.issue === "Beglaubiegungen") {
            return (
                <Typography sx={{ m: "1%" }} variant="h5" align="left">
                    An- und Ummelden Informationen:
                    <Typography sx={{ m: "2%" }} align="left">
                        erforderliche Unterlagen / Gebühren:
                        <br />
                        <br />- Original des Dokuments
                        <br />- Kopie(n) des Dokuments
                        <br />- Gebühr (Höhe abhängig von der Anzahl)
                    </Typography>
                </Typography>
            );
        }
        if (formik.values.issue === "Fischereischein") {
            return (
                <Typography sx={{ m: "1%" }} variant="h5" align="left">
                    An- und Ummelden Informationen:
                    <Typography sx={{ m: "2%" }} align="left">
                        erforderliche Unterlagen:
                        <br />
                        <br />- Personalausweis oder Reisepass
                        <br />- Fischereischein oder Prüfungszeugnis
                    </Typography>
                </Typography>
            );
        }
        if (formik.values.issue === "Ausländer-Angelegenheiten") {
            return (
                <Typography sx={{ m: "1%" }} variant="h5" align="left">
                    An- und Ummelden Informationen:
                    <Typography sx={{ m: "2%" }} align="left">
                        - Aufenthaltstitel oder
                        <br />- gestattung oder Duldung
                        <br />- Pass (wenn vorhanden)
                    </Typography>
                </Typography>
            );
        }
        if (formik.values.issue === "Führerscheinangelegenheiten") {
            return (
                <Typography sx={{ m: "1%" }} variant="h5" align="left">
                    An- und Ummelden Informationen:
                    <Typography sx={{ m: "2%" }} align="left">
                        erforderliche Unterlagen:
                        <br />
                        <br />- Personalausweis oder Reisepass
                        <br />- aktuelles biometrisches Passbild
                        <br />- Führerschein
                        <br />
                        <br />
                        Im Hinblick auf weitere Unterlagen erkundigen Sie sich
                        bitte im Vorfeld bei Ihrer Fahrschule, beim
                        Straßenverkehrsamt des Kreises Herford oder beim
                        Bürgerbüro der Stadt Löhne.
                    </Typography>
                </Typography>
            );
        }

        return (
            <Typography sx={{ m: "1%" }} variant="h5" align="left" color="red">
                Bitte wählen Sie oben ein Anliegen aus!
            </Typography>
        );
    };

    const step_1 = () => {
        return (
            <>
                <Box sx={{ width: "100%", my: 2 }}>
                    <FormControl sx={{ m: 4, minWidth: "25%" }}>
                        <InputLabel>Anliegen</InputLabel>
                        <Select
                            variant="standard"
                            name="issue"
                            value={formik.values.issue}
                            onChange={formik.handleChange}
                            error={
                                formik.touched.issue &&
                                Boolean(formik.errors.issue)
                            }
                            helpertext={
                                formik.touched.issue && formik.errors.issue
                            }
                        >
                            <MenuItem value={"Beantragung Ausweisdokumente"}>
                                Beantragung Ausweisdokumente
                            </MenuItem>
                            <MenuItem value={"Beglaubiegungen"}>
                                Beglaubiegungen
                            </MenuItem>
                            <MenuItem value={"An- und Ummelden"}>
                                An- und Ummelden
                            </MenuItem>
                            <MenuItem value={"Fischereischein"}>
                                Fischereischein
                            </MenuItem>
                            <MenuItem value={"Ausländer-Angelegenheiten"}>
                                Ausländer-Angelegenheiten
                            </MenuItem>
                            <MenuItem value={"Führerscheinangelegenheiten"}>
                                Führerscheinangelegenheiten
                            </MenuItem>
                        </Select>
                    </FormControl>
                    <Box
                        sx={{
                            border: 1,
                            borderColor: "lightgray",
                            minHeight: "333px",
                            mx: "2.5%",
                        }}
                    >
                        {issue_info()}
                    </Box>
                </Box>
            </>
        );
    };
    const step_2 = () => {
        return (
            <>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                        pt: 2,
                        m: "2%",
                    }}
                >
                    <Button
                        color="inherit"
                        disabled={cw_offset === 0}
                        onClick={cw_handle_back}
                        sx={{ mr: 1 }}
                    >
                        Zurück
                    </Button>
                    <Box sx={{ flex: "1 1 auto" }} />
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                        }}
                    >
                        <Typography sx={{ fontStyle: "italic", fontSize: 14 }}>
                            {`vom: ${moment(cw(cw_offset).mon).format(
                                "DD.MM.YY"
                            )}`}
                        </Typography>
                        <Typography sx={{ mx: "10px", fontWeight: "bold" }}>
                            {`KW ${cw(cw_offset).week}`}
                        </Typography>
                        <Typography sx={{ fontStyle: "italic", fontSize: 14 }}>
                            {`bis: ${moment(cw(cw_offset).son).format(
                                "DD.MM.YY"
                            )}`}
                        </Typography>
                    </Box>
                    <Box sx={{ flex: "1 1 auto" }} />
                    <Button onClick={cw_handle_next} disabled={cw_offset === 6}>
                        Weiter
                    </Button>
                </Box>
            </>
        );
    };
    const step_3 = () => {
        return (
            <>
                <h1>step 1 </h1>
            </>
        );
    };

    const step_content = [step_1, step_2, step_3];

    return (
        <>
            <Box sx={{ width: "100%", my: 5 }}>
                <Typography variant="h2" align="center" gutterBottom>
                    Termin Reservieren
                </Typography>
                <Typography sx={{ mx: "5%" }} variant="h6" align="center">
                    Hier können Sie einen Termin bei uns Reservieren, folgen Sie
                    einfachen den Schritten unten.
                </Typography>
                <Divider />
                <Grid
                    container
                    spacing={0}
                    direction="column"
                    alignItems="center"
                    justifyContent="center"
                    sx={{ my: 5 }}
                >
                    <Grid item xs={1} width="66%">
                        <Stepper activeStep={activeStep}>
                            {steps.map((label, index) => {
                                const stepProps = {};
                                const labelProps = {};
                                if (isStepOptional(index)) {
                                    labelProps.optional = (
                                        <Typography variant="caption">
                                            Optional
                                        </Typography>
                                    );
                                }
                                if (isStepSkipped(index)) {
                                    stepProps.completed = false;
                                }
                                return (
                                    <Step key={label} {...stepProps}>
                                        <StepLabel {...labelProps}>
                                            {label}
                                        </StepLabel>
                                    </Step>
                                );
                            })}
                        </Stepper>
                        {activeStep === steps.length ? (
                            <React.Fragment>
                                <Typography sx={{ mt: 2, mb: 1 }}>
                                    Alles Fertig! <br />
                                    Eine E-Mail mit den wichtigsten Infos wird
                                    ihnen auch zugesendet.
                                </Typography>
                                <Box
                                    sx={{
                                        display: "flex",
                                        flexDirection: "row",
                                        pt: 2,
                                    }}
                                >
                                    <Box sx={{ flex: "1 1 auto" }} />
                                    <Button onClick={handleReset}>
                                        Noch einen Termin reservieren
                                    </Button>
                                </Box>
                            </React.Fragment>
                        ) : (
                            <React.Fragment>
                                {step_content[activeStep]()}
                                <Box
                                    sx={{
                                        display: "flex",
                                        flexDirection: "row",
                                        pt: 2,
                                    }}
                                >
                                    <Button
                                        color="inherit"
                                        disabled={activeStep === 0}
                                        onClick={handleBack}
                                        sx={{ mr: 1 }}
                                    >
                                        Zurück
                                    </Button>
                                    <Box sx={{ flex: "1 1 auto" }} />
                                    {isStepOptional(activeStep) && (
                                        <Button
                                            color="inherit"
                                            onClick={handleSkip}
                                            sx={{ mr: 1 }}
                                        >
                                            Überspringen
                                        </Button>
                                    )}
                                    {activeStep === steps.length - 1 ? (
                                        <Button onClick={handleNext}>
                                            Fertig
                                        </Button>
                                    ) : (
                                        <Button onClick={handleNext}>
                                            Weiter
                                        </Button>
                                    )}
                                </Box>
                            </React.Fragment>
                        )}
                    </Grid>
                </Grid>
            </Box>
        </>
    );
}

export default Make_Appointment;
