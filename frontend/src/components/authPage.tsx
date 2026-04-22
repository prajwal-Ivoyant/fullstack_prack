import { useState, useEffect } from "react";
import { Card, Form, Input, Button, Typography, message } from "antd";
import {
  useLoginMutation,
  useRegisterMutation,
} from "../services/authApi";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [form] = Form.useForm();

  const [login, { isLoading: loginLoading }] = useLoginMutation();
  const [register, { isLoading: registerLoading }] =
    useRegisterMutation();

  const navigate = useNavigate();

  // ✅ Auto redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/posts");
    }
  }, [navigate]);

  const onFinish = async (values: {
    email: string;
    password: string;
  }) => {
    try {
      if (isLogin) {
        const res = await login(values).unwrap();

        // ⚠️ For production → use httpOnly cookies instead
        localStorage.setItem("token", res.token);

        message.success("Login successful");
        navigate("/posts");
      } else {
        await register(values).unwrap();

        message.success("Registered successfully");
        setIsLogin(true);
        form.resetFields();
      }
    } catch (err: any) {
      console.error("AUTH ERROR:", err);

      const errorMsg =
        err?.data?.message ||
        err?.data?.msg ||
        err?.error ||
        "Unexpected error occurred";

      message.error(errorMsg);
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f5f5f5",
      }}
    >
      <Card style={{ width: 350 }}>
        <Title level={3} style={{ textAlign: "center" }}>
          {isLogin ? "Login" : "Register"}
        </Title>

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
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
            disabled={loginLoading || registerLoading}
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

          <Button
            type="link"
            onClick={() => {
              setIsLogin(!isLogin);
              form.resetFields(); // ✅ clear old inputs
            }}
          >
            {isLogin ? "Register" : "Login"}
          </Button>
        </div>
      </Card>
    </div>
  );
}
