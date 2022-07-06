import axios from "axios"
import {AxiosGetUser} from "./auth";

axios.defaults.url = "/api";

const AxiosGetProducts = async () => {
    //IS THIS CHECK NEEDED ? I AM ALREADY CHECKING USER IN buyerDashboard
    const res = await AxiosGetUser();
    if (!res) return null
    const productList = await axios.get("https://canteen-app-2.herokuapp.com/api/product/")
    if (productList && productList.data.status === 1) console.log(productList.data.error)
    
    console.log("PRODUCTS LIST :");
    console.log(productList);
    
    return productList.data;
}

const AxiosUpdateFavourite = async (id) => {
    const res = await axios.post("https://canteen-app-2.herokuapp.com/api/product/favourite", {pid: id})
    if (!res || res.data.status === 1) console.log(res.data.error)
    return res.data
}

const AxiosGetMyProducts = async () => {
    const res = await axios.get("https://canteen-app-2.herokuapp.com/api/product/my")
    if (!res || res.data.status === 1) console.log(res.data.error)
    return res.data
}

const AxiosDeleteProduct = async (val) => {
    const res = await axios.post("https://canteen-app-2.herokuapp.com/api/product/delete", val)
    if (!res || res.data.status === 1) console.log(res.data.error)
    return res.data
}

const AxiosUpdateProduct = async (val) => {
    const res = await axios.post("https://canteen-app-2.herokuapp.com/api/product/update", val)
    if (!res || res.data.status === 1) console.log(res.data.error)
    return res.data
}

const AxiosAddProduct = async (val) => {
    console.log("val---"+val)
    const res = await axios.post("https://canteen-app-2.herokuapp.com/api/product/add", val)
    if (!res || res.data.status === 1) console.log(res.data.error)
    return res.data
}

export {AxiosGetProducts, AxiosUpdateFavourite, AxiosGetMyProducts, AxiosDeleteProduct, AxiosUpdateProduct, AxiosAddProduct}
