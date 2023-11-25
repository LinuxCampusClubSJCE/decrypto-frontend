import React, { useCallback, useContext, useEffect, useState } from 'react'
import { Button, Checkbox, DatePicker, Form, Input, Select } from 'antd'
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
    allowRegistration: boolean
    allowQuestionModify: boolean
    forceState: 'start' | 'stop' | ''
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
            allowRegistration: boolean
            allowQuestionModify: boolean
            forceState: 'start' | 'stop' | ''
        } = data.contest
        if (data.success === true) {
            setContestId(data.contest._id)
            form.setFieldsValue({
                name: contest.name,
                _id: contest._id,
                questionOrder: contest.questionOrder,
                time: [moment(contest.startTime), moment(contest.endTime)],
                allowRegistration: contest.allowRegistration,
                allowQuestionModify: contest.allowQuestionModify,
                forceState: contest.forceState
            })
        }
    }, [form, setLoading])
    useEffect(() => {
        loadContest()
    }, [loadContest])
    const onFinish = async (values: FieldType) => {
        let data
        setLoading(true)
        console.log(values)
        const body = {
            name: values.name,
            startTime: values.time[0],
            endTime: values.time[1],
            allowRegistration: values.allowRegistration,
            allowQuestionModify: values.allowQuestionModify,
            forceState: values.forceState
        }
        if (contestId === undefined) {
            data = await fetchData({
                path: '/contest/create',
                method: 'POST',
                body
            })
        } else {
            data = await fetchData({
                path: '/contest/update/' + contestId,
                method: 'PUT',
                body
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
                            message: 'Please input Time!'
                        }
                    ]}
                >
                    <DatePicker.RangePicker
                        showTime
                        format="YYYY-MM-DD HH:mm:ss"
                    />
                </Form.Item>

                <Form.Item<FieldType>
                    label="Start Registration"
                    name="allowRegistration"
                    valuePropName="checked"
                >
                    <Checkbox />
                </Form.Item>
                <Form.Item<FieldType>
                    label="Allow Team To Modify Questions"
                    name="allowQuestionModify"
                    valuePropName="checked"
                >
                    <Checkbox />
                </Form.Item>
                <Form.Item<FieldType> label="Force State" name="forceState">
                    <Select>
                        <Select.Option value="">Nothing</Select.Option>
                        <Select.Option value="start">Start</Select.Option>
                        <Select.Option value="stop">Stop</Select.Option>
                    </Select>
                </Form.Item>

                <Form.Item>
                    <Button htmlType="submit">
                        {contestId ? 'Update' : 'Create'}
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}
export default CreateContest
