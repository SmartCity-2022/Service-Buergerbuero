import React, {
    createRef,
    useContext,
    useEffect,
    useState,
    Redirect,
} from "react";
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
import Access_Denied from "../components/access_denied";
const moment = require("moment");

const steps = ["Anliegen auswählen", "Termin wählen", "Bestätigen"];

const optional = [];

function Make_Appointment() {
    const { authState } = useContext(AuthContext);
    const [activeStep, setActiveStep] = useState(0);
    const [skipped, setSkipped] = useState(new Set());
    const [cw_offset, set_cw_offset] = useState(0);
    const [times, set_times] = useState([]);
    const [is_open, set_is_open] = useState(false);
    const [time_taken, set_time_taken] = useState(new Map());
    const [appointments, set_appointments] = useState([]);
    const [selected_time, set_selected_time] = useState({});

    const [modal, set_modal] = useState({
        title: "Fehler",
        content:
            "Bei der Bearbeitung ist etwas schiefgelaufen. Versuchen Sie es später erneut oder kontaktieren Sie uns hier: 3171023!",
    });

    const initial_values = {
        issue: "",
        mon: "",
        tue: "",
        wed: "",
        thu: "",
        fri: "",
    };

    const [form_values, set_from_values] = useState(initial_values);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name && value) {
            set_from_values({
                ...form_values,
                [name]: value,
            });
            set_selected_time({ name, value });
        } else {
            const { name, value } = e.target.parentNode;
            set_from_values({
                ...form_values,
                [name]: value,
            });
            set_selected_time({ name, value });
        }
    };

    useEffect(() => {
        if (authState.status) {
            let tmp_times = [];
            for (let i = 0; i < 40; i++) {
                tmp_times[i] = moment()
                    .local("de")
                    .startOf("day")
                    .add(8, "hours")
                    .add(i * 15, "minutes")
                    .format("HH:mm");
            }
            set_times(tmp_times);

            fetch_appointments(0);
        }
    }, [authState.status]);

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
        if (form_values.issue !== "") {
            if (
                activeStep != 1 ||
                form_values.mon != "" ||
                form_values.tue != "" ||
                form_values.wed != "" ||
                form_values.thu != "" ||
                form_values.fri != ""
            ) {
                let newSkipped = skipped;
                if (isStepSkipped(activeStep)) {
                    newSkipped = new Set(newSkipped.values());
                    newSkipped.delete(activeStep);
                }

                setActiveStep((prevActiveStep) => prevActiveStep + 1);
                setSkipped(newSkipped);
            }
        }
    };

    async function fetch_appointments(offset) {
        await axios
            .get(
                `${process.env.REACT_APP_BACKEND_HOST}/appointment?start_date=${
                    cw(offset).mon
                }&end_date=${cw(offset).sun}`,
                {
                    withCredentials: true,
                }
            )
            .then((res) => {
                console.log(res.data[0]);
                set_appointments(res.data[0]);
                let tmp_map = new Map();
                tmp_map.set("mon", new Map());
                tmp_map.set("tue", new Map());
                tmp_map.set("wed", new Map());
                tmp_map.set("thu", new Map());
                tmp_map.set("fri", new Map());
                for (let i = 0; i < res.data[0].length; i++) {
                    console.log(res.data[0][i]);
                    let day = "";
                    if (
                        res.data[0][i].date ===
                        moment(cw(offset).mon).format("YYYY-MM-DD")
                    ) {
                        day = "mon";
                    }
                    if (
                        res.data[0][i].date ===
                        moment(cw(offset).mon)
                            .add(1, "days")
                            .format("YYYY-MM-DD")
                    ) {
                        day = "tue";
                    }
                    if (
                        res.data[0][i].date ===
                        moment(cw(offset).mon)
                            .add(2, "days")
                            .format("YYYY-MM-DD")
                    ) {
                        day = "wed";
                    }
                    if (
                        res.data[0][i].date ===
                        moment(cw(offset).mon)
                            .add(3, "days")
                            .format("YYYY-MM-DD")
                    ) {
                        day = "thu";
                    }
                    if (
                        res.data[0][i].date ===
                        moment(cw(offset).mon)
                            .add(4, "days")
                            .format("YYYY-MM-DD")
                    ) {
                        day = "fri";
                    }
                    const split = res.data[0][i].time.split(":");
                    console.log(split);
                    const time = `${split[0]}:${split[1]}`;
                    tmp_map.get(day).set(time, true);
                }
                set_time_taken(tmp_map);
                console.log(tmp_map);
            })
            .catch((err) => {
                console.log(err.response.data);
            });
    }

    const cw_handle_next = async () => {
        if (cw_offset <= 6) {
            set_cw_offset((curr) => curr + 1);
            await fetch_appointments(cw_offset + 1);
        }
    };

    const cw_handle_back = async () => {
        if (cw_offset > 0) {
            set_cw_offset((curr) => curr - 1);
            await fetch_appointments(cw_offset - 1);
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
        set_cw_offset(0);
        set_from_values(initial_values);
        fetch_appointments(0);
        set_is_open(false);
        setActiveStep(0);
    };

    const submit = async (event) => {
        event.preventDefault();
        handleNext();
        const data = form_values;
        let date = "";
        let time = "";
        if (data.mon !== "") {
            date = moment(cw(cw_offset).mon)
                .add(0, "days")
                .format("YYYY-MM-DD");
            time = data.mon;
        }
        if (data.tue !== "") {
            date = moment(cw(cw_offset).mon)
                .add(1, "days")
                .format("YYYY-MM-DD");
            time = data.tue;
        }
        if (data.wed !== "") {
            date = moment(cw(cw_offset).mon)
                .add(2, "days")
                .format("YYYY-MM-DD");
            time = data.wed;
        }
        if (data.thu !== "") {
            date = moment(cw(cw_offset).mon)
                .add(3, "days")
                .format("YYYY-MM-DD");
            time = data.thu;
        }
        if (data.fri !== "") {
            date = moment(cw(cw_offset).mon)
                .add(4, "days")
                .format("YYYY-MM-DD");
            time = data.fri;
        }
        let appointment = { date: date, time: time, issue: data.issue };
        console.log(appointment);
        await axios
            .post(
                `${process.env.REACT_APP_BACKEND_HOST}/appointment`,
                appointment,
                {
                    withCredentials: true,
                }
            )
            .then((res) => {
                console.log(res.data);
                set_modal({
                    title: "Erfolg",
                    content: "Die Termin reservierung war erfolgreich!",
                });
            })
            .catch((err) => {
                console.log(err.response.data);
            });
        set_is_open(true);
    };

    const issue_info = () => {
        if (form_values.issue === "An- und Ummelden") {
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
        if (form_values.issue === "Beantragung Ausweisdokumente") {
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
        if (form_values.issue === "Beglaubigungen") {
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
        if (form_values.issue === "Fischereischein") {
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
        if (form_values.issue === "Ausländer-Angelegenheiten") {
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
        if (form_values.issue === "Führerscheinangelegenheiten") {
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
                            value={form_values.issue}
                            onChange={handleInputChange}
                        >
                            <MenuItem value={"Beantragung Ausweisdokumente"}>
                                Beantragung Ausweisdokumente
                            </MenuItem>
                            <MenuItem value={"Beglaubigungen"}>
                                Beglaubigungen
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
            <Box
                sx={{
                    border: 1,
                    borderColor: "lightgray",
                    minHeight: "333px",
                    m: "2%",
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                        m: "1%",
                    }}
                >
                    <Button
                        color="inherit"
                        disabled={cw_offset === 0}
                        onClick={cw_handle_back}
                        sx={{ mr: 1 }}
                    >
                        {`KW ${cw(cw_offset - 1).week}`}
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
                            {`bis: ${moment(cw(cw_offset).sun).format(
                                "DD.MM.YY"
                            )}`}
                        </Typography>
                    </Box>
                    <Box sx={{ flex: "1 1 auto" }} />
                    <Button onClick={cw_handle_next} disabled={cw_offset === 6}>
                        {`KW ${cw(cw_offset + 1).week}`}
                    </Button>
                </Box>

                <Grid container columns={5} align="center" sx={{ m: "1%" }}>
                    <Grid item xs={1}>
                        <Typography variant="h6">Montag</Typography>
                        {times.map((time, index) => {
                            return (
                                <>
                                    <Button
                                        variant="contained"
                                        sx={{
                                            m: "1px",
                                            width: "20px",
                                            height: "20px",
                                            bgcolor: time_taken
                                                .get("mon")
                                                .get(time)
                                                ? "lightgray"
                                                : selected_time.name ===
                                                      "mon" &&
                                                  selected_time.value == time
                                                ? "lightseagreen"
                                                : "theme.primary",
                                        }}
                                        name="mon"
                                        value={time}
                                        onClick={handleInputChange}
                                        disabled={time_taken
                                            .get("mon")
                                            .get(time)}
                                    >
                                        <Typography
                                            key={time}
                                            sx={{ fontSize: 12 }}
                                        >
                                            {time}
                                        </Typography>
                                    </Button>
                                    <br />
                                </>
                            );
                        })}
                    </Grid>
                    <Grid item xs={1}>
                        <Typography variant="h6">Dienstag</Typography>
                        {times.map((time, index) => {
                            return (
                                <>
                                    <Button
                                        variant="contained"
                                        sx={{
                                            m: "1px",
                                            width: "20px",
                                            height: "20px",
                                            bgcolor: time_taken
                                                .get("tue")
                                                .get(time)
                                                ? "lightgray"
                                                : selected_time.name ===
                                                      "tue" &&
                                                  selected_time.value == time
                                                ? "lightseagreen"
                                                : "theme.primary",
                                        }}
                                        name="tue"
                                        value={time}
                                        onClick={handleInputChange}
                                        disabled={time_taken
                                            .get("tue")
                                            .get(time)}
                                    >
                                        <Typography
                                            key={time}
                                            sx={{ fontSize: 12 }}
                                        >
                                            {time}
                                        </Typography>
                                    </Button>
                                    <br />
                                </>
                            );
                        })}
                    </Grid>
                    <Grid item xs={1}>
                        <Typography variant="h6">Mittwoch</Typography>
                        {times.map((time, index) => {
                            return (
                                <>
                                    <Button
                                        variant="contained"
                                        sx={{
                                            m: "1px",
                                            width: "20px",
                                            height: "20px",
                                            bgcolor: time_taken
                                                .get("wed")
                                                .get(time)
                                                ? "lightgray"
                                                : selected_time.name ===
                                                      "wed" &&
                                                  selected_time.value == time
                                                ? "lightseagreen"
                                                : "theme.primary",
                                        }}
                                        name="wed"
                                        value={time}
                                        onClick={handleInputChange}
                                        disabled={time_taken
                                            .get("wed")
                                            .get(time)}
                                    >
                                        <Typography
                                            key={time}
                                            sx={{ fontSize: 12 }}
                                        >
                                            {time}
                                        </Typography>
                                    </Button>
                                    <br />
                                </>
                            );
                        })}
                    </Grid>
                    <Grid item xs={1}>
                        <Typography variant="h6">Donnerstag</Typography>
                        {times.map((time, index) => {
                            return (
                                <>
                                    <Button
                                        variant="contained"
                                        sx={{
                                            m: "1px",
                                            width: "20px",
                                            height: "20px",
                                            bgcolor: time_taken
                                                .get("thu")
                                                .get(time)
                                                ? "lightgray"
                                                : selected_time.name ===
                                                      "thu" &&
                                                  selected_time.value == time
                                                ? "lightseagreen"
                                                : "theme.primary",
                                        }}
                                        name="thu"
                                        value={time}
                                        onClick={handleInputChange}
                                        disabled={time_taken
                                            .get("thu")
                                            .get(time)}
                                    >
                                        <Typography
                                            key={time}
                                            sx={{ fontSize: 12 }}
                                        >
                                            {time}
                                        </Typography>
                                    </Button>
                                    <br />
                                </>
                            );
                        })}
                    </Grid>
                    <Grid item xs={1}>
                        <Typography variant="h6">Freitag</Typography>
                        {times.map((time, index) => {
                            return (
                                <>
                                    <Button
                                        variant="contained"
                                        sx={{
                                            m: "1px",
                                            width: "20px",
                                            height: "20px",
                                            bgcolor: time_taken
                                                .get("fri")
                                                .get(time)
                                                ? "lightgray"
                                                : selected_time.name ===
                                                      "fri" &&
                                                  selected_time.value == time
                                                ? "lightseagreen"
                                                : "theme.primary",
                                        }}
                                        name="fri"
                                        value={time}
                                        onClick={handleInputChange}
                                        disabled={time_taken
                                            .get("fri")
                                            .get(time)}
                                    >
                                        <Typography
                                            key={time}
                                            sx={{ fontSize: 12 }}
                                        >
                                            {time}
                                        </Typography>
                                    </Button>
                                    <br />
                                </>
                            );
                        })}
                    </Grid>
                </Grid>
            </Box>
        );
    };

    const step_3 = () => {
        const data = form_values;
        let date = "";
        let time = "";
        if (data.mon !== "") {
            date = moment(cw(cw_offset).mon)
                .add(0, "days")
                .format("YYYY-MM-DD");
            time = data.mon;
        }
        if (data.tue !== "") {
            date = moment(cw(cw_offset).mon)
                .add(1, "days")
                .format("YYYY-MM-DD");
            time = data.tue;
        }
        if (data.wed !== "") {
            date = moment(cw(cw_offset).mon)
                .add(2, "days")
                .format("YYYY-MM-DD");
            time = data.wed;
        }
        if (data.thu !== "") {
            date = moment(cw(cw_offset).mon)
                .add(3, "days")
                .format("YYYY-MM-DD");
            time = data.thu;
        }
        if (data.fri !== "") {
            date = moment(cw(cw_offset).mon)
                .add(4, "days")
                .format("YYYY-MM-DD");
            time = data.fri;
        }
        let appointment = { date: date, time: time, issue: data.issue };
        return (
            <>
                <Typography sx={{ m: "1%" }} variant="h5" align="left">
                    Zusammenfassung
                    <Typography sx={{ m: "2%" }} align="left">
                        Anliegen: {appointment.issue}
                        <br />
                        <br />
                        Datum: {moment(appointment.date).format("DD/MM/YYYY")}
                        <br />
                        <br />
                        Uhrzeit: {appointment.time}
                        <br />
                        <br />
                    </Typography>
                    {issue_info()}
                </Typography>
            </>
        );
    };

    const step_content = [step_1, step_2, step_3];

    if (!authState.status) {
        return (
            <>
                <Access_Denied />
            </>
        );
    } else {
        return (
            <>
                <Box sx={{ width: "100%", my: 5 }}>
                    {is_open && (
                        <AlertModal
                            title={modal.title}
                            content={modal.content}
                            open={is_open}
                        />
                    )}
                    <Typography variant="h2" align="center" gutterBottom>
                        Termin Reservieren
                    </Typography>
                    <Typography sx={{ mx: "5%" }} variant="h6" align="center">
                        Hier können Sie einen Termin bei uns Reservieren, folgen
                        Sie einfachen den Schritten unten.
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
                            <form onSubmit={submit}>
                                <Stepper activeStep={activeStep}>
                                    {steps.map((label, index) => {
                                        const stepProps = {};
                                        const labelProps = {};
                                        if (isStepOptional(index)) {
                                            labelProps.optional = (
                                                <Typography
                                                    key={label}
                                                    variant="caption"
                                                >
                                                    Optional
                                                </Typography>
                                            );
                                        }
                                        if (isStepSkipped(index)) {
                                            stepProps.completed = false;
                                        }
                                        return (
                                            <Step key={label} {...stepProps}>
                                                <StepLabel
                                                    key={label}
                                                    {...labelProps}
                                                >
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
                                            Eine E-Mail mit den wichtigsten
                                            Infos wird ihnen auch zugesendet.
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
                                            {activeStep ===
                                                steps.length - 1 && (
                                                <Button type="submit">
                                                    Fertig
                                                </Button>
                                            )}
                                            {activeStep !==
                                                steps.length - 1 && (
                                                <Button onClick={handleNext}>
                                                    Weiter
                                                </Button>
                                            )}
                                        </Box>
                                    </React.Fragment>
                                )}
                            </form>
                        </Grid>
                    </Grid>
                </Box>
            </>
        );
    }
}

export default Make_Appointment;
