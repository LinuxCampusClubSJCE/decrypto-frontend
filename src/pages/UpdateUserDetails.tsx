import React, { useCallback, useContext, useEffect } from 'react'
import { Button, Form, Input, message, Typography } from 'antd'
import { fetchData } from '../utils/fetch'
import { useNavigate, useParams } from 'react-router-dom'
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

const UpdateUserDetails: React.FC = () => {
    const { setLoading } = useContext(LoadingContext)
    const [form] = Form.useForm()
    const navigate = useNavigate()
    let { id } = useParams()
    const fetchUser = useCallback(
        async (id: string) => {
            setLoading(true)
            const data = await fetchData({ path: `/users/${id}` })
            setLoading(false)
            form.setFieldsValue({ ...data.user, password: '' })
        },
        [form, setLoading]
    )
    useEffect(() => {
        if (id) fetchUser(id)
    }, [fetchUser, id])
    const onFinish = async (values: any) => {
        let val = values
        if (values.password === '') {
            delete val['password']
        }
        setLoading(true)
        const data = await fetchData({
            path: `/users/${id}`,
            method: 'PUT',
            body: val
        })

        setLoading(false)
        if (data.success === false) {
            message.error(data.message)
            navigator.vibrate(200)
            return
        } else {
            message.success(data.message)
            // localStorage.setItem('user', JSON.stringify(data.user))
            navigate(-1)
        }
    }
    return (
        <div className="p-3">
            <Title level={3}>User Details</Title>
            <Form
                form={form}
                name="login"
                initialValues={{}}
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
                    <Input autoComplete="name" />
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
                    <Input disabled={true} autoComplete="username" />
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

                <Form.Item<FieldType> label="Password" name="password">
                    <Input.Password autoComplete="new-password" />
                </Form.Item>

                <Form.Item>
                    <Button htmlType="submit">Update</Button>
                </Form.Item>
            </Form>
        </div>
    )
}
export default UpdateUserDetails
