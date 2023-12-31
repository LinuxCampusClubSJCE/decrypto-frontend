import React, { useCallback, useContext, useEffect } from 'react'
import { Button, Form, Input, message, Typography, Checkbox } from 'antd'
import { fetchData } from '../utils/fetch'
import { useNavigate, useParams } from 'react-router-dom'
import LoadingContext from '../utils/LoadingContext'

const { Title } = Typography
type FieldType = {
    fullName: string
    username: string
    codeName: string
    password: string
    email: string
    usn: string
    phone: string
    isTeam: boolean
    isAdmin: boolean
    solvedQuestions: number
}

const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo)
}

const AddUserAdmin: React.FC = () => {
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
        let data
        let val = values
        if (values.password === '') {
            delete val['password']
        }
        setLoading(true)
        if (id) {
            data = await fetchData({
                path: `/users/${id}`,
                method: 'PUT',
                body: values
            })
        } else {
            data = await fetchData({
                path: '/auth/registerTeam',
                method: 'POST',
                body: values
            })
        }
        setLoading(false)
        if (data.success === false) {
            message.error(data.message)
            navigator.vibrate(200)
            return
        } else {
            message.success(data.message)
            navigate(-1)
        }
    }
    return (
        <div className="p-3">
            <Title level={3}>{id ? 'Update User' : 'Create User'}</Title>
            <Form
                form={form}
                name="login"
                initialValues={{}}
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
                    label="Code Name"
                    extra="Only For Team Members"
                    name="codeName"
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

                <Form.Item<FieldType> label="Password" name="password">
                    <Input />
                </Form.Item>
                <Form.Item<FieldType>
                    label="Solved Questions"
                    name="solvedQuestions"
                >
                    <Input type="number" defaultValue={0} />
                </Form.Item>
                <Form.Item<FieldType> name="isTeam" valuePropName="checked">
                    <Checkbox>In LCC Team?</Checkbox>
                </Form.Item>
                <Form.Item<FieldType> name="isAdmin" valuePropName="checked">
                    <Checkbox>Is Admin?</Checkbox>
                </Form.Item>

                <Form.Item>
                    <Button htmlType="submit">
                        {id ? 'Update' : 'Create'}
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}
export default AddUserAdmin
