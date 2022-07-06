import axios from "axios"

axios.defaults.url = "/api";

const AxiosPlaceOrder = async (val) => {
    var res = await axios.post("https://canteen-app-2.herokuapp.com/api/order/new", val)
    if (!res || res.data.status === 1) console.log(res.data.error)
    return res.data
}

const AxiosGetOrders = async () => {
    var res = await axios.get("https://canteen-app-2.herokuapp.com/api/order/")
    if (!res || res.data.status === 1) {
        // console.log(res.data.error)
    }
    return res.data;
}

const AxiosPickUp = async (id) => {
    var res = await axios.post("https://canteen-app-2.herokuapp.com/api/order/pickup", {pid: id})
    if (!res || res.data.status === 1) console.log(res.data.error)
    return res.data
}

const AxiosRateOrder = async (val) => {
    var res = await axios.post("https://canteen-app-2.herokuapp.com/api/order/rate", val)
    if (!res || res.data.status === 1) console.log(res.data.error)
    return res.data
}

const AxiosOrderAccept = async (val) => {
    var res = await axios.post("https://canteen-app-2.herokuapp.com/api/order/accept", val)
    if (!res || res.data.status === 1) console.log(res.data.error)
    return res.data
}
const AxiosOrderReject = async (val) => {
    var res = await axios.post("https://canteen-app-2.herokuapp.com/api/order/reject", val)
    if (!res || res.data.status === 1) console.log(res.data.error)
    return res.data
}
const AxiosOrderProgress = async (val) => {
    var res = await axios.post("https://canteen-app-2.herokuapp.com/api/order/progress", val)
    if (!res || res.data.status === 1) console.log(res.data.error)
    return res.data
}

const AxiosGetProductStats = async () => {
    var res = await axios.get("https://canteen-app-2.herokuapp.com/api/order/stats")
    if (!res || res.data.status === 1) console.log(res.data.error)
    return res.data
}

const AxiosGetAgeStats = async () => {
    var res = await axios.get("https://canteen-app-2.herokuapp.com/api/order/agestats")
    if (!res || res.data.status === 1) console.log(res.data.error)
    return res.data
}

const AxiosGetBatchStats = async () => {
    var res = await axios.get("https://canteen-app-2.herokuapp.com/api/order/batchstats")
    if (!res || res.data.status === 1) console.log(res.data.error)
    return res.data
}

export {
    AxiosPlaceOrder,
    AxiosGetOrders,
    AxiosPickUp,
    AxiosRateOrder,
    AxiosOrderReject,
    AxiosOrderAccept,
    AxiosOrderProgress,
    AxiosGetProductStats,
    AxiosGetAgeStats,
    AxiosGetBatchStats
}
