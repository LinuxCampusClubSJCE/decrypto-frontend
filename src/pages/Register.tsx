import React, { useCallback, useContext, useEffect } from 'react'
import { Button, Form, Input } from 'antd'
import { Typography } from 'antd'
import { fetchData } from '../utils/fetch'
import { useNavigate } from 'react-router-dom'
import { message } from 'antd'
import LoadingContext from '../utils/LoadingContext'

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
    const { setLoading } = useContext(LoadingContext)

    const checkStarted = useCallback(async () => {
        const data = await fetchData({
            path: '/auth/registerstarted'
        })
        if (data.success && data.started === false) {
            message.error('Registration not yet started')
        }
    }, [])
    useEffect(() => {
        checkStarted()
    }, [checkStarted])
    const onFinish = async (values: any) => {
        setLoading(true)
        const data = await fetchData({
            path: '/auth/register',
            method: 'POST',
            body: values
        })
        setLoading(false)
        if (data.success === false) {
            message.error(data.message)
            navigator.vibrate(200)
            return
        }
        message.success(data.message)
        navigate('/')
    }
    return (
        <div className="p-3">
            <Title level={3}>Register</Title>
            <Typography.Paragraph>
                Please ensure that the details are correct as they cannot be
                changed later
            </Typography.Paragraph>
            <Form
                name="login"
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                layout="vertical"
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
                    <Input autoComplete="name" />
                </Form.Item>
                <Form.Item<FieldType>
                    label="Username"
                    extra="Displayed on the leaderboard"
                    name="username"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your username!'
                        },
                        {
                            validator: (_, value) => {
                                const alphanumericRegex = /^[a-zA-Z0-9]*$/

                                if (!alphanumericRegex.test(value)) {
                                    return Promise.reject(
                                        new Error(
                                            'Only alphanumeric characters are allowed.'
                                        )
                                    )
                                }

                                return Promise.resolve()
                            }
                        },
                        {
                            min: 3
                        },
                        {
                            max: 15
                        }
                    ]}
                >
                    <Input autoComplete="username" />
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
                    <Input type="email" autoComplete="email" />
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
                    <Input autoComplete="off" />
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
                    <Input autoComplete="tel" />
                </Form.Item>

                <Form.Item<FieldType>
                    label="Password"
                    name="password"
                    extra="Please avoid using common passwords"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your password!'
                        }
                    ]}
                >
                    <Input.Password autoComplete="new-password" />
                </Form.Item>

                <Form.Item>
                    <Button htmlType="submit">Register</Button>
                </Form.Item>
            </Form>
        </div>
    )
}
export default Register
