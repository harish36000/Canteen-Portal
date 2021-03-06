import {BrowserRouter, Outlet, Route, Routes} from "react-router-dom";
import "./App.css";

import UsersList from "./components/users/UsersList";
import Home from "./components/pages/Home";
import RegistrationForm from "./components/pages/Register";
import LoginForm from "./components/pages/Login";
import Navbar from "./components/templates/Navbar";
import Profile from "./components/pages/Profile";
import Wallet from "./components/pages/Wallet";
import Dashboard from "./components/pages/Dashboard";
import Orders from "./components/pages/Orders";
import Stats from "./components/pages/Statistics";
import VerificationForm from "./components/pages/Verification";

import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'
import axios from 'axios'

axios.defaults.baseURL = "/api"

const Layout = () => {
    return (
        <div>
            <Navbar/>
            <div className="container">
                <Outlet/>
            </div>
        </div>
    );
};

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout/>}>
                    <Route path="/" element={<Home/>}/>
                    <Route path="users" element={<UsersList/>}/>
                    <Route path="register" element={<RegistrationForm/>}/>
                    <Route path="verification" element={<VerificationForm/>}/>
                    <Route path="profile" element={<Profile/>}/>
                    <Route path={"login"} element={<LoginForm/>}/>
                    <Route path={"wallet"} element={<Wallet />}/>
                    <Route path={"dashboard"} element={<Dashboard />}/>
                    <Route path={"orders"} element={<Orders />} />
                    <Route path={"statistics"} element={<Stats />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
