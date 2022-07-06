import axios from "axios"

axios.defaults.url = "/api";

const AxiosGetUserProfile = async () => {
    let res = await axios.get("http://localhost:4000/api/user/profile");
    if (!res) {
        console.log("Axios GET error")
        return null;
    }
    else {
        if (res.data.status === 1) {
            console.log(res.data.error)
        }
        return res.data;
    }
}

const AxiosUpdateUserProfile = async (user) => {
    let res = await axios.post("http://localhost:4000/api/user/profile/update", user);
    if (!res) {
        console.log("Axios POST error")
        return null;
    }
    else {
        if (res.data.status === 1) {
            console.log(res.data.error)
        }
        return res.data;
    }
}

export {AxiosGetUserProfile, AxiosUpdateUserProfile};
