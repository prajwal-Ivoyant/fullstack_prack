import { useState } from "react";
import { Card, Form, Input, Button, Typography, message } from "antd";
import {
    useLoginMutation,
    useRegisterMutation,
} from "../services/authApi";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);

    const [login, { isLoading: loginLoading }] = useLoginMutation();
    const [register, { isLoading: registerLoading }] =
        useRegisterMutation();

    const navigate = useNavigate();

    const onFinish = async (values: {
        email: string;
        password: string;
    }) => {
        try {
            if (isLogin) {
                const res = await login(values).unwrap();
               
                localStorage.setItem("token", res.token);

                message.success("Login successful");
                navigate("/posts");

            } else {
                await register(values).unwrap();

                message.success("Registered successfully");
                setIsLogin(true);
            }
        } catch (err: any) {
            console.error(err);
            message.error(err?.data?.msg || "Something went wrong");
        }
    };

    return (
        <div >
            <Card style={{ width: 300, margin: "175px auto" }}>
                <Title level={3} style={{ textAlign: "center" }}>
                    {isLogin ? "Login" : "Register"}
                </Title>

                <Form layout="vertical" onFinish={onFinish}>
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                            { required: true, message: "Email is required" },
                            { type: "email", message: "Enter valid email" },
                        ]}
                    >
                        <Input placeholder="Enter email" />
                    </Form.Item>

                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[
                            { required: true, message: "Password is required" },
                            { min: 6, message: "Min 6 characters" },
                        ]}
                    >
                        <Input.Password placeholder="Enter password" />
                    </Form.Item>

                    <Button
                        type="primary"
                        htmlType="submit"
                        block
                        loading={isLogin ? loginLoading : registerLoading}
                    >
                        {isLogin ? "Login" : "Register"}
                    </Button>
                </Form>

                <div style={{ marginTop: 15, textAlign: "center" }}>
                    <Text>
                        {isLogin
                            ? "Don't have an account?"
                            : "Already have an account?"}
                    </Text>
                    <Button type="link" onClick={() => setIsLogin(!isLogin)}>
                        {isLogin ? "Register" : "Login"}
                    </Button>
                </div>
            </Card>
        </div>
    );
}

