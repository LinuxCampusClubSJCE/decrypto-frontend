import React, { useCallback, useEffect, useState } from 'react'
import { Button, Form, Input, Rate, Upload } from 'antd'
import { Typography } from 'antd'
import { fetchData } from '../utils/fetch'
import { useNavigate, useParams } from 'react-router-dom'
import { message } from 'antd'
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons'
import type { UploadChangeParam } from 'antd/es/upload'
const { Title } = Typography
type FieldType = {
    image: string
    answer: string
    hint: string
    difficulty: number
}
const getBase64 = (img: RcFile, callback: (url: string) => void) => {
    console.log({ img })
    const reader = new FileReader()
    reader.addEventListener('load', () => callback(reader.result as string))
    reader.readAsDataURL(img)
}
const compressImage = (file: File, maxSizeInBytes: number): Promise<File> => {
    return new Promise((resolve) => {
        const reader = new FileReader()
        reader.onload = (event) => {
            const img = new Image()
            img.onload = () => {
                const canvas = document.createElement('canvas')
                const ctx = canvas.getContext('2d')!
                ctx.drawImage(img, 0, 0)

                let width = img.width
                let height = img.height

                const MAX_WIDTH = 1024
                const MAX_HEIGHT = 1024

                if (width > height) {
                    if (width > MAX_WIDTH) {
                        height *= MAX_WIDTH / width
                        width = MAX_WIDTH
                    }
                } else {
                    if (height > MAX_HEIGHT) {
                        width *= MAX_HEIGHT / height
                        height = MAX_HEIGHT
                    }
                }

                canvas.width = width
                canvas.height = height

                ctx.drawImage(img, 0, 0, width, height)

                canvas.toBlob(
                    (blob) => {
                        const compressedFile = new File([blob!], file.name, {
                            type: 'image/jpeg'
                        })
                        resolve(compressedFile)
                    },
                    'image/jpeg',
                    0.7
                ) // Adjust quality as needed (0.7 is 70% quality)
            }
            img.src = event.target!.result as string
        }
        reader.readAsDataURL(file)
    })
}
const beforeUpload = (file: RcFile) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
    if (!isJpgOrPng) {
        message.error('You can only upload JPG/PNG file!')
        navigator.vibrate(300)
    }
    const imgSize = file.size / 1024 / 1024
    const isLt10M = imgSize < 10
    if (!isLt10M) {
        message.error(`Image - ${imgSize}. Image must smaller than 10MB!`)
        navigator.vibrate(300)
    }
    return isJpgOrPng && isLt10M
}

const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo)
}
const AddQuestionTeam = () => {
    const [imageLoading, setImageLoading] = useState(false)
    const [form] = Form.useForm()
    const navigate = useNavigate()
    let { id } = useParams()
    const fetchUser = useCallback(
        async (id: string) => {
            const data = await fetchData({ path: `/question/${id}` })
            if (data.success === false) {
                message.error(data.message)
                navigator.vibrate(300)
            } else {
                form.setFieldsValue(data.question)
                setImageUrl(data.question.image)
            }
        },
        [form]
    )
    const checkStarted = async () => {
        const data = await fetchData({
            path: '/question/modifyallowed'
        })
        if (data.success && data.allowed === false) {
            message.error('Registration not yet started')
        }
    }

    useEffect(() => {
        checkStarted()
        if (id) fetchUser(id)
    }, [fetchUser, id])

    const onFinish = async (values: any) => {
        console.log('Success:', values)
        let data
        if (id) {
            data = data = await fetchData({
                path: `/question/${id}`,
                method: 'PUT',
                body: { ...values, image: imageUrl }
            })
        } else {
            data = await fetchData({
                path: '/question/add',
                method: 'POST',
                body: { ...values, image: imageUrl }
            })
        }
        if (data.success === false) {
            message.error(data.message)
            navigator.vibrate(300)
            return
        }
        message.success(data.message)
        navigate('/')
    }
    const [imageUrl, setImageUrl] = useState<string>()

    const handleChange: UploadProps['onChange'] = async (
        info: UploadChangeParam<UploadFile>
    ) => {
        if (info.file.originFileObj) {
            setImageLoading(true)
            const compressedFile = await compressImage(
                info.file.originFileObj as File,
                1000 * 1024
            ) // Max size: 1000KB
            getBase64(compressedFile as RcFile, (url) => {
                setImageUrl(url)
                setImageLoading(false)
            })
        }
    }

    return (
        <div className="p-3">
            <Title level={3}>New Question</Title>
            <Form
                form={form}
                name="question"
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
            >
                <Form.Item<FieldType>
                    label="Image"
                    name="image"
                    rules={[
                        {
                            required: true,
                            message: 'Please Upload Your image!'
                        }
                    ]}
                >
                    <Upload
                        name="avatar"
                        accept="image/*"
                        listType="picture-card"
                        className="avatar-uploader question-upload-container !flex justify-center"
                        showUploadList={false}
                        maxCount={1}
                        beforeUpload={beforeUpload}
                        onChange={handleChange}
                    >
                        {imageUrl ? (
                            <img
                                src={imageUrl}
                                alt="Question"
                                className="w-full object-contain"
                                // style={{ width: '100%' }}
                            />
                        ) : (
                            <div>
                                {imageLoading ? (
                                    <LoadingOutlined />
                                ) : (
                                    <PlusOutlined />
                                )}
                                <div style={{ marginTop: 8 }}>Upload</div>
                            </div>
                        )}
                    </Upload>
                </Form.Item>

                <Form.Item<FieldType>
                    label="Answer"
                    name="answer"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your username!'
                        }
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item<FieldType> label="Hint" name="hint">
                    <Input />
                </Form.Item>
                <Form.Item<FieldType> label="Difficulty" name="difficulty">
                    <Rate
                        tooltips={[
                            'Very Easy',
                            'Easy',
                            'Medium',
                            'Hard',
                            'Very Hard'
                        ]}
                    />
                </Form.Item>

                <Form.Item>
                    <Button htmlType="submit">{id ? 'Update' : 'add'}</Button>
                </Form.Item>
            </Form>
        </div>
    )
}

export default AddQuestionTeam
