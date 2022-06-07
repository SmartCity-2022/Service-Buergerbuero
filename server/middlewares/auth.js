require("dotenv").config();
const { verify_jwt } = require("./verify_jwt");
const axios = require("axios");
const cookie_parser = require("cookie-parser");

const auth = async (req, res, next) => {
    // make it possible to skip actual auth for testing/development
    var skip = process.env.SKIP_AUTH === "true";
    if (skip) {
        return next();
    }

    const { cookies } = req;
    if (!cookies) {
        return res.status(401).send("missing Authorization cookies");
    }
    console.log(`auth recived cookies: ${cookies}`);

    const access_token = cookies.accessToken;
    const refresh_token = cookies.refreshToken;
    console.log(`access token: ${access_token}`);
    console.log(`refresh token: ${refresh_token}`);

    if (!access_token || !refresh_token) {
        return res.status(401).send("missing token");
    }

    const { payload, expired } = verify_jwt(access_token);
    console.log(`payload: ${payload}`);
    console.log(`expired: ${expired}`);

    if (payload && !expired) {
        req.user = payload;
        return next();
    }

    if (expired) {
        await axios
            .post(`${process.env.MAIN_HUB_HOST}/api/token`, {
                token: refresh_token,
            })
            .then((response) => {
                const { accessToken } = response.data;
                if (accessToken) {
                    res.cookie("accessToken", accessToken, {
                        domain: ".smartcity.w-mi.de",
                    });
                    const { payload } = verify_jwt(accessToken);
                    if (payload) {
                        req.user = payload;
                        return next();
                    }
                } else {
                    if (response.data.errMsg) {
                        console.log(
                            `token refresh error:\n ${response.data.errMsg}`
                        );
                    }
                    return res
                        .status(500)
                        .send("failed to retrieve access token from main hub");
                }
            })
            .catch((err) => {
                if (err.response.data.errMsg) {
                    console.log(
                        `token refresh error:\n ${err.response.data.errMsg}`
                    );
                } else {
                    console.error(err);
                }
            });
    }

    return res.status(500).send("auth failed");
};

module.exports = { auth };
