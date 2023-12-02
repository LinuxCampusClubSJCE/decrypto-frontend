import { Button, Form, Modal, message } from 'antd'
import { useState } from 'react'
import { fetchData } from '../utils/fetch'
import { MessageOutlined } from '@ant-design/icons'
import TextArea from 'antd/es/input/TextArea'

export const Message = ({ questionno }: { questionno: number }) => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [form] = Form.useForm()
    interface FieldType {
        message: String
    }
    const showModal = () => {
        setIsModalOpen(true)
    }

    const handleCancel = () => {
        setIsModalOpen(false)
    }
    return (
        <>
            <Button onClick={showModal} icon={<MessageOutlined />}>
                Send a Message
            </Button>
            <Modal
                title="Send a message"
                open={isModalOpen}
                okType={'default'}
                onOk={async () => {
                    const text = form.getFieldValue('message')
                    if (text === '') return
                    console.log({ message })
                    const data = await fetchData({
                        path: '/message/send',
                        method: 'POST',
                        body: {
                            message: `${questionno}) ${text}`
                        }
                    })
                    setIsModalOpen(false)
                    form.resetFields()
                    if (data.success === true) {
                        message.success(data.message)
                    } else {
                        message.error(data.message)
                    }
                }}
                onCancel={handleCancel}
            >
                <Form
                    name="game"
                    form={form}
                    className="w-full"
                    onFinishFailed={() => {
                        message.error('Please Enter your answer')
                    }}
                >
                    <Form.Item<FieldType>
                        name="message"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your Answer!'
                            }
                        ]}
                    >
                        <TextArea
                            className=""
                            rows={4}
                            placeholder="Ask hint, Give Feedback... or Anything you want to say"
                            autoComplete="off"
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}
