import React, {useEffect, useState} from 'react';

import {
    Form,
    Input,
    Button,
    Select,
    TimePicker, message,
} from 'antd'
import { Container } from "@mui/material"
import {useNavigate} from "react-router-dom";
import {AxiosGetUser, AxiosRegister, AxiosValidateOTP} from "../../services/auth";
const { Option } = Select;

const RegistrationForm = () => {
    //Hook
    const [userType, setuserType] = useState('buyer')
    const [componentDisable, setcomponentDisable] = useState(true);
    const [currUserID, setCurrUserID] = useState('');

    //AntD Form - Create instance of form
    const [form] = Form.useForm();
    const [formOTP] = Form.useForm();

    const navigate = useNavigate();

    const format = 'HH:mm';

    function handleChange(value) {
        console.log(`selected ${value}`);
        setuserType(value);
        console.log(userType)
    }

    const onFinish = async (values) => {
        console.log('Received values of form: ', values);
        if (!values.type) values.type = 'buyer'
        if (!values.batch) values.batch = "UG1"
        
        const res = await AxiosRegister(values);
        console.log(res);
        
        if (res) {
            if (res.status === 1) {
                message.error(res.error)
            }
            else if(res.verified === false)
            {
                message.error("Verify First!");
            }
            else 
            {
                // navigate("/login")
                setCurrUserID(res.userID); //send from backend
                console.log(currUserID);


                //res.data.userId -> id to be passed during verification
                setcomponentDisable(false);
            }
        }
    };
    const onFinishOTPform = async (otp) => {
        console.log("NECESSARY DATA inside REGISTER.JS: ");
        console.log('Received otp: ', otp);
        console.log('User id: ', currUserID);

        // console.log('Received id: ', window.localStorage._id);

        // if (!values.type) values.type = 'buyer'
        // if (!values.batch) values.batch = "UG1"
        
        
        const res = await AxiosValidateOTP(otp, currUserID)
        if (res) {

            console.log("RES OBTAINED INSIDE ONFINISH OTP FORM")
            console.log(res);
        
            if(res.status === 'FAILED')
            {
                console.log(res.message);
                message.error("Wrong OTP");
            }
            else 
            {
                navigate("/login");
            }
        }
    };

    useEffect(async () => {
        var res = await AxiosGetUser();
        if (res) {
            message.warning("User already registered")
            navigate("/profile")
        }
    }, [navigate])

    return (
        <Container align="center" maxWidth="sm">
        <Form
            form={form}
            name="register"
            onFinish={onFinish}
            scrollToFirstError
        >
            <Form.Item
                name="name"
                rules={[
                    {
                        required: true,
                        message: 'Please input your full name!',
                    },
                ]}
            >
                <Input placeholder={"Full name"}/>
            </Form.Item>
            <Form.Item
                name="email"
                rules={[
                    {
                        type: 'email',
                        message: 'The input is not valid E-mail!',
                    },
                    {
                        required: true,
                        message: 'Please input your E-mail!',
                    },
                ]}
            >
                <Input placeholder={"Email address"}/>
            </Form.Item>

            <Form.Item
                name="password"
                rules={[
                    {
                        required: true,
                        message: 'Please input your password!',
                    },
                    {
                        min: 8,
                        message: "Password must have at least 8 characters"
                    }
                ]}
                hasFeedback
            >
                <Input.Password
                type={"password"}
                placeholder={"Password"}/>
            </Form.Item>

            <Form.Item
                name="confirm"
                dependencies={['password']}
                hasFeedback
                rules={[
                    {
                        required: true,
                        message: 'Please confirm your password!',
                    },
                    ({ getFieldValue }) => ({
                        validator(_, value) {
                            if (!value || getFieldValue('password') === value) {
                                return Promise.resolve();
                            }

                            return Promise.reject(new Error('The two passwords that you entered do not match!'));
                        },
                    }),
                ]}
            >
                <Input.Password
                type={"password"}
                placeholder={"Confirm password"}/>
            </Form.Item>


            <Form.Item
                name="contact"
                rules={[
                    {
                        required: true,
                        message: 'Please input your phone number!',
                    },
                    {
                        len: 10, pattern: "^[0-9]*$",
                        message: "Enter a valid phone number"
                    }
                ]}
            >
                <Input
                    placeholder={"Phone number"}
                />
            </Form.Item>

            <Form.Item
            name={"type"}>
                <Select onChange={handleChange} defaultValue={"buyer"}>
                    <Option value="buyer">Buyer</Option>
                    <Option value="vendor">Vendor</Option>
                </Select>
            </Form.Item>
            {
                userType === "buyer" &&
                <>
                    <Form.Item
                        name="age"
                        rules={[
                            {
                                required: true,
                                message: "Please input your age"
                            },
                            {
                                pattern: "^[1-9][0-9]$",
                                message: "Please enter a valid age"
                            }
                        ]}
                    >
                        <Input
                        placeholder={"Age"}/>
                    </Form.Item>
                    <Form.Item
                        name={"batch"}>
                        <Select defaultValue={"UG1"}>
                            <Option value="UG1">UG1</Option>
                            <Option value="UG2">UG2</Option>
                            <Option value="UG3">UG3</Option>
                            <Option value="UG4">UG4</Option>
                            <Option value="UG5">UG5</Option>
                        </Select>
                    </Form.Item>
                </>
            }
            {
               userType === "vendor" &&
               <>
                   <Form.Item name={"shop"} rules={[
                       {
                           required: true,
                           message: "Please input the shop name!"
                       }
                   ]}>
                       <Input placeholder={"Shop name"} />
                   </Form.Item>
                   <Input.Group compact={true}>
                       <Form.Item name={"opening"} rules={[
                       {
                           required: true,
                           message: "Please input the opening time of the shop"
                       }
                   ]}>
                   <TimePicker format={format} placeholder={"Opening time"}/>
                   </Form.Item>
                   <Form.Item name={"closing"} rules={[
                       {
                           required: true,
                           message: "Please input the closing time of the shop"
                       }
                   ]}>
                       <TimePicker format={format} placeholder={"Closing time"}/>
                   </Form.Item></Input.Group>

               </>
            }


            <Form.Item>
                <Button type="primary" htmlType="submit">
                    Register
                </Button>
            </Form.Item>
        </Form>
        
        <Form
            form={formOTP}
            name="register"
            onFinish={onFinishOTPform}
            scrollToFirstError
        >

            <Form.Item
                name="otp"
                rules={[
                    {
                        required: true,
                        message: 'Please input your OTP!',
                    },
                    {
                        min: 4,
                        message: "OTP must have at least 4 characters"
                    }
                ]}
                hasFeedback
            >
                <Input.Password
                type={"password"}
                placeholder={"OTP"}
                disabled = {componentDisable}
                />
            </Form.Item>
 
            <Form.Item>
                <Button type="primary" htmlType="submit" disabled = {componentDisable}>
                    Submit OTP
                </Button>
            </Form.Item>
        </Form>


        </Container>
    );
};

export default RegistrationForm;