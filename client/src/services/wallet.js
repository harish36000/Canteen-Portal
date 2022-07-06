import axios from "axios"

axios.defaults.url = "/api"

const AxiosGetWallet = async () => {
    var res = await axios.get("https://canteen-app-2.herokuapp.com/api/wallet");
    if (!res) {
        return {status: 1, error: "Axios GET error"}
    }
    if (res.data.status === 1) console.log(res.data.error);
    return res.data;
}

const AxiosUpdateWallet = async (req) => {

    console.log("axios update wallet in req");
    console.log(req)

    var res = await axios.post("https://canteen-app-2.herokuapp.com/api/wallet/update", req);
    if (!res) return {status: 1, error: "Axios POST error"}
    if (res.data.status === 1) console.log(res.data.error);
    return res.data;
}

export {AxiosGetWallet, AxiosUpdateWallet};
