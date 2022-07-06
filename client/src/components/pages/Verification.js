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
import {AxiosGetUser, AxiosRegister} from "../../services/auth";
import RegistrationForm from './Register';

const { Option } = Select;


const VerificationForm = (res) => {
    //Hook
    const [userType, setuserType] = useState('buyer')
    
    //AntD Form - Create instance of form
    const [form] = Form.useForm();

    const navigate = useNavigate();


    function handleChange(value) {
        console.log(`selected ${value}`);
        setuserType(value);
        console.log(userType)
    }

    const onFinish = async (otp) => {
        console.log('Received OTP values: ', otp);
        console.log("ID obtained from regsiter: ", RegistrationForm.newUserID);
        //  await AxiosValidateOTP(otp);
       
      
        // if (res) {
        //     if (res.status === 1) {
        //         message.error(res.error)
        //     }
        //     else navigate("/login")

        // }
    };

    useEffect(async () => {
        var res = await AxiosGetUser();
        
        console.log("user from axioGetUser: ");
        console.log(res);

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
                placeholder={"OTP"}/>
            </Form.Item>
 
            <Form.Item>
                <Button type="primary" htmlType="submit">
                    Register
                </Button>
            </Form.Item>
        </Form>
        </Container>
    );
};

export default VerificationForm;