import React, { useCallback, useContext, useEffect, useState } from 'react'
import { Button, DatePicker, Form, Input } from 'antd'
import { Typography } from 'antd'
import { fetchData } from '../utils/fetch'
import { useNavigate } from 'react-router-dom'
import { message } from 'antd'
import moment from 'moment'
import LoadingContext from '../utils/LoadingContext'

const { Title } = Typography
type FieldType = {
    _id: string
    name: string
    questionOrder: Array<string>
    time: Date[]
}

const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo)
}

const CreateContest: React.FC = () => {
    const { setLoading } = useContext(LoadingContext)
    const [form] = Form.useForm()
    const navigate = useNavigate()
    const [contestId, setContestId] = useState<string>()
    const loadContest = useCallback(async () => {
        setLoading(true)
        const data = await fetchData({ path: '/contest/' })
        setLoading(false)
        const contest: {
            _id: string
            startTime: Date
            endTime: Date
            questionOrder: Array<string>
            name: string
        } = data.contest
        if (data.success === true) {
            setContestId(data.contest._id)
            form.setFieldsValue({
                name: contest.name,
                _id: contest._id,
                questionOrder: contest.questionOrder,
                time: [moment(contest.startTime), moment(contest.endTime)]
            })
        }
    }, [form, setLoading])
    useEffect(() => {
        loadContest()
    }, [loadContest])
    const onFinish = async (values: any) => {
        let data
        setLoading(true)
        if (contestId === undefined) {
            data = await fetchData({
                path: '/contest/create',
                method: 'POST',
                body: {
                    name: values.name,
                    startTime: values.time[0],
                    endTime: values.time[1]
                }
            })
        } else {
            data = await fetchData({
                path: '/contest/' + contestId,
                method: 'PUT',
                body: {
                    name: values.name,
                    startTime: values.time[0],
                    endTime: values.time[1]
                }
            })
        }
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
            <Title level={3}>Contest</Title>
            <Form
                form={form}
                name="login"
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
            >
                <Form.Item<FieldType>
                    label="Name"
                    name="name"
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
                    label="Start"
                    name="time"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your password!'
                        }
                    ]}
                >
                    <DatePicker.RangePicker
                        showTime
                        format="YYYY-MM-DD HH:mm:ss"
                    />
                </Form.Item>

                <Form.Item>
                    <Button htmlType="submit">Create</Button>
                </Form.Item>
            </Form>
        </div>
    )
}
export default CreateContest
