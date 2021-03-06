import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import HomeIcon from "@mui/icons-material/Home";
import Divider from "@mui/material/Divider";
import HelpTwoToneIcon from "@mui/icons-material/HelpTwoTone";

function Page_Error() {
    return (
        <>
            <Box sx={{ width: "100%", my: 15 }}>
                <Typography variant="h3" align="center">
                    <HelpTwoToneIcon
                        fontSize="large"
                        sx={{ color: "darkred", mx: 2 }}
                    />
                    Nicht gefunden
                    <HelpTwoToneIcon
                        fontSize="large"
                        sx={{ color: "darkred", mx: 2 }}
                    />
                </Typography>
                <Divider variant="middle" sx={{ mx: 75, my: 2 }} />
                <Typography variant="h5" align="center">
                    Die angeforderte Seite existiert nicht oder die URL ist
                    falsch!
                </Typography>
                <Typography sx={{ my: 2 }} variant="h6" align="center">
                    Vergewissern Sie sich, dass Sie die richtige URL eingegeben
                    haben oder kehren Sie zur{" "}
                    <a target="_self" href="/home" className="link">
                        Hauptseite
                    </a>{" "}
                    zurück.
                </Typography>
            </Box>
        </>
    );
}

export default Page_Error;
