import React from 'react'
import { Button, Form, Input } from 'antd'
import { Typography } from 'antd'
import { fetchData } from '../utils/fetch'
import { useNavigate } from 'react-router-dom'
import { message } from 'antd'

const { Title } = Typography
type FieldType = {
    username: string
    password: string
}

const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo)
}

const Login: React.FC = () => {
    const navigate = useNavigate()
    const onFinish = async (values: any) => {
        console.log('Success:', values)
        const data = await fetchData({
            path: '/auth/login',
            method: 'POST',
            body: {
                username: values.username,
                password: values.password
            }
        })
        if (data.success === false) {
            message.error(data.message)
            navigator.vibrate(300)
            return
        }
        message.success(data.message)
        localStorage.setItem('token', data.accessToken)
        localStorage.setItem('login', 'true')
        localStorage.setItem('user', JSON.stringify(data.user))
        navigate('/')
        console.log(data)
    }
    return (
        <div className="p-3">
            <Title level={3}>Login</Title>
            <Form
                name="login"
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
            >
                <Form.Item<FieldType>
                    label="Username or Email"
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
                    <Button htmlType="submit">Login</Button>
                </Form.Item>
            </Form>
        </div>
    )
}
export default Login
