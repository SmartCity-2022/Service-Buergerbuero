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
import DoDisturbOnTwoToneIcon from "@mui/icons-material/DoDisturbOnTwoTone";

const Access_Denied = () => {
    return (
        <>
            <Box sx={{ width: "100%", my: 15 }}>
                <Typography variant="h3" align="center">
                    <DoDisturbOnTwoToneIcon
                        fontSize="large"
                        sx={{ color: "darkred", mx: 2 }}
                    />
                    Zugriff verweigert!
                    <DoDisturbOnTwoToneIcon
                        fontSize="large"
                        sx={{ color: "darkred", mx: 2 }}
                    />
                </Typography>
                <Divider variant="middle" sx={{ mx: 75, my: 2 }} />
                <Typography variant="h5" align="center">
                    Sie haben keinen Zugriff auf diese Seite!
                </Typography>
                <Typography sx={{ my: 2 }} variant="h6" align="center">
                    Um auf diese Seite zu gelangen, müssen Sie sich zuerst im
                    MainHub registriert und eingeloggt haben.
                </Typography>
            </Box>
        </>
    );
};
export default Access_Denied;
