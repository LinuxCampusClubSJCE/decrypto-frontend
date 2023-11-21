import React, { useEffect } from 'react'
import { Button, Form, Input } from 'antd'
import { Typography } from 'antd'
import { fetchData } from '../utils/fetch'
import { useNavigate } from 'react-router-dom'
import { message } from 'antd'

const { Title } = Typography
type FieldType = {
    fullName: string
    username: string
    password: string
    email: string
    usn: string
    phone: string
}

const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo)
}

const Register: React.FC = () => {
    const navigate = useNavigate()
    const checkStarted = async () => {
        const data = await fetchData({
            path: '/auth/registerstarted'
        })
        if (data.success && data.started === false) {
            message.error('Registration not yet started')
        }
    }
    useEffect(() => {
        checkStarted()
    }, [])
    const onFinish = async (values: any) => {
        console.log('Success:', values)
        const data = await fetchData({
            path: '/auth/register',
            method: 'POST',
            body: values
        })
        if (data.success === false) {
            message.error(data.message)
            navigator.vibrate(300)
            return
        }
        message.success(data.message)
        navigate('/')
        console.log(data)
    }
    return (
        <div className="p-3">
            <Title level={3}>Register</Title>
            <Form
                name="login"
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
            >
                <Form.Item<FieldType>
                    label="Full Name"
                    name="fullName"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your Name!'
                        }
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item<FieldType>
                    label="Username"
                    name="username"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your username!'
                        }
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item<FieldType>
                    label="Email"
                    name="email"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your Email!'
                        }
                    ]}
                >
                    <Input type="email" />
                </Form.Item>
                <Form.Item<FieldType>
                    label="USN"
                    name="usn"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your USN!'
                        }
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item<FieldType>
                    label="Phone No"
                    name="phone"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your Phone!'
                        }
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item<FieldType>
                    label="Password"
                    name="password"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your password!'
                        }
                    ]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item>
                    <Button htmlType="submit">Register</Button>
                </Form.Item>
            </Form>
        </div>
    )
}
export default Register
