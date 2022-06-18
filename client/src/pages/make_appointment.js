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
} from "@mui/material";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import { AuthContext } from "../App";
import { useFormik } from "formik";
import axios from "axios";
import * as yup from "yup";
import AlertModal from "../components/alert_modal";

const steps = ["Anliegen auswählen", "Termin wählen", "Bestätigen"];

const optional = [];

function Make_Appointment() {
    const [activeStep, setActiveStep] = React.useState(0);
    const [skipped, setSkipped] = React.useState(new Set());

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
        if (formik.values.issue !== undefined) {
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
        setActiveStep(0);
    };

    const initial_values = {
        issue: undefined,
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
                <>
                    <Typography sx={{ mx: "5%" }} variant="h6" align="center">
                        An- und Ummelden INFOS
                    </Typography>
                </>
            );
        }
        if (formik.values.issue === "Beantragung Ausweisdokumente") {
            return (
                <>
                    <Typography sx={{ mx: "5%" }} variant="h6" align="center">
                        "Beantragung Ausweisdokumente" INFOS
                    </Typography>
                </>
            );
        }
        if (formik.values.issue === "Beglaubiegungen") {
            return (
                <>
                    <Typography sx={{ mx: "5%" }} variant="h6" align="center">
                        "Beglaubiegungen" INFOS
                    </Typography>
                </>
            );
        }
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
                            helperText={
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
                        </Select>
                    </FormControl>
                    {formik.values.issue !== undefined && issue_info()}
                </Box>
            </>
        );
    };
    const step_2 = () => {
        return (
            <>
                <h1>step 1 </h1>
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
                                    <Button onClick={handleReset}>Reset</Button>
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
