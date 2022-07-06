import axios from "axios"

// axios.defaults.url = "/api";
// axios.defaults.url = "http://localhost:4000/api";

const AxiosRegister = async (user) => {
    // const res = await axios.post("/auth/register", user);
    const res = await axios.post("http://localhost:4000/api/auth/register", user);
    if (!res) {
        console.log("Failed to axios post")
        return res
    }
    if (res.data.status === 1) {
        console.log("Error registering")
        console.log(res.data.error)
    }
    return res.data;
}

const AxiosLogin = async (user) => {
    const res = await axios.post("http://localhost:4000/api/auth/login", user);
    if (!res) {
            console.log("Failed to axios post")
            return res
        }
        if (res.data.status === 1) {
            console.log("Error logging in")
            console.log(res.data.error)
        }
        return res.data
}

const AxiosGetUser = async () => {
    var token = "";
    try {
        token = window.localStorage.getItem("Authorization")
    }
    catch {
        token = "";
    }
    if (token)
        axios.defaults.headers.common["Authorization"] = token;
    var res = await axios.get("http://localhost:4000/api/user/ret");
    if (res.data.status === 1) {
        try {
            window.localStorage.removeItem("Authorization")
            return null;
        }
        catch {
            //
        }
    }
    return res.data;
}

const AxiosValidateOTP = async (otp, userID) => {
    // const res = await axios.post("/auth/register", user);

    // const res1 = await AxiosGetUser();
    // const userID = res1.data.userId;

    console.log("NECESSARY DATA inside AUTH.JS: ");
    console.log('Received otp: ', otp);
    console.log('Received user: ', userID);

    const req  = {
        ID: userID,
        OTP: otp
    }

    // const res = await axios.post("http://localhost:4000/api/auth/verifyOTP", userID, otp);
    
    const res = await axios.post("http://localhost:4000/api/auth/verifyOTP", req);

    console.log("RESPONSE FROM VERIFYOTP API");
    console.log(res);

    if (!res) {
        console.log("Failed to axios post")
        return res
    }
    if (res.data.status === "FAILED") {
        console.log("MSG FROM AXIOS: Error registering")
        console.log(res.data);
        // console.log(res.data.error)
    }
    
    
    return res.data;
}

export { AxiosRegister, AxiosLogin, AxiosGetUser, AxiosValidateOTP };


