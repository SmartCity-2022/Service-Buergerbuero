require("dotenv").config();
const { verify_jwt } = require("./verify_jwt");
const axios = require("axios");

const auth = async (req, res, next) => {
    // make it possible to skip actual auth for testing/development
    var skip = process.env.SKIP_AUTH === "true";
    if (skip) {
        return next();
    }

    const access_token = req.header("accessToken");
    const refresh_token = req.header("refreshToken");

    if (!access_token || !refresh_token) {
        return res.status(401).send("missing token");
    }
    const { payload, expired } = verify_jwt(access_token);

    if (payload && !expired) {
        req.user = payload;
        return next();
    }

    if (expired) {
        await axios
            .post(`${process.env.MAIN_HUB_HOST}/api/token`, {
                refreshToken: refresh_token,
            })
            .then((res) => {
                const { accessToken } = res.body;
                if (accessToken) {
                    req.new_access_token = accessToken;
                    const { payload } = verify_jwt(access_token);
                    req.user = payload;
                    return next();
                } else {
                    return res.status(500).send("auth failed");
                }
            });
    }
    return res.status(500).send("auth failed");
};

module.exports = { auth };
