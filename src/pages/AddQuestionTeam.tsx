import { useCallback, useContext, useEffect, useState } from 'react'
import { Button, Form, Input, Rate, Select, Upload } from 'antd'
import { Typography } from 'antd'
import { fetchData } from '../utils/fetch'
import { useNavigate, useParams } from 'react-router-dom'
import { message } from 'antd'
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons'
import type { UploadChangeParam } from 'antd/es/upload'
import LoadingContext from '../utils/LoadingContext'
const { Title } = Typography

enum QuestionCategory {
    Other = 'Other',
    Technical = 'Technical',
    Movie = 'Movie',
    Music = 'Music',
    Celebrity = 'Celebrity',
    Sports = 'Sports',
    Place = 'Place',
    Brand = 'Brand',
    Food = 'Food'
}
type FieldType = {
    image: string
    answer: string
    hint: string
    difficulty: number
    showedHint: string
    category: QuestionCategory
    rating: number
    avgAttempts: number
    rateCount: number
}
const getBase64 = (img: RcFile, callback: (url: string) => void) => {
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

                const MAX_SIZE_BYTES = maxSizeInBytes // Target size in bytes (50KB)

                const calculateSize = () => {
                    canvas.width = width
                    canvas.height = height
                    ctx.drawImage(img, 0, 0, width, height)

                    canvas.toBlob(
                        (blob) => {
                            const fileSize = blob!.size // Size in bytes
                            if (
                                fileSize <= MAX_SIZE_BYTES ||
                                width <= 10 ||
                                height <= 10
                            ) {
                                // If the image size is within limits or the dimensions are too small, resolve with the compressed file
                                const compressedFile = new File(
                                    [blob!],
                                    file.name,
                                    {
                                        type: 'image/jpeg'
                                    }
                                )
                                resolve(compressedFile)
                            } else {
                                // Resize the image by reducing dimensions and recheck size
                                width *= 0.9 // Reduce width by 10%
                                height *= 0.9 // Reduce height by 10%
                                calculateSize() // Recursively call to check new size
                            }
                        },
                        'image/jpeg',
                        0.7 // Adjust quality as needed (0.7 is 70% quality)
                    )
                }

                calculateSize() // Start the resizing process
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
        navigator.vibrate(200)
    }
    const imgSize = file.size / 1024 / 1024
    const isLt10M = imgSize < 10
    if (!isLt10M) {
        message.error(`Image - ${imgSize}. Image must smaller than 10MB!`)
        navigator.vibrate(200)
    }
    return isJpgOrPng && isLt10M
}

const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo)
}
const AddQuestionTeam = ({ isAdmin }: { isAdmin?: boolean }) => {
    const { setLoading } = useContext(LoadingContext)
    const [imageLoading, setImageLoading] = useState(false)
    const [form] = Form.useForm()
    const navigate = useNavigate()
    let { id } = useParams()

    const fetchUser = useCallback(
        async (id: string) => {
            setLoading(true)
            const data = await fetchData({ path: `/question/${id}` })
            setLoading(false)
            if (data.success === false) {
                message.error(data.message)
                navigator.vibrate(200)
            } else {
                form.setFieldsValue(data.question)
                setImageUrl(data.question.image)
            }
        },
        [form, setLoading]
    )
    const checkStarted = useCallback(async () => {
        setLoading(true)
        const data = await fetchData({
            path: '/question/modifyallowed'
        })
        setLoading(false)
        if (data.success && data.allowed === false) {
            message.error("Can't Modify the Question Now, Ask Admin!")
        }
    }, [setLoading])

    useEffect(() => {
        checkStarted()
        if (id) fetchUser(id)
    }, [checkStarted, fetchUser, id])

    const onFinish = async (values: any) => {
        let data
        setLoading(true)
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
        setLoading(false)
        if (data.success === false) {
            message.error(data.message)
            navigator.vibrate(200)
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
                40 * 1024
            ) // Max size: 40KB
            getBase64(compressedFile as RcFile, (url) => {
                setImageUrl(url)
                setImageLoading(false)
            })
        }
    }

    return (
        <div className="p-3">
            <Typography.Title level={4}>
                Check for existing questions that have been uploaded by others
            </Typography.Title>
            <Form
                name="checkans"
                layout="vertical"
                onFinish={async (values) => {
                    const answer = values.answer
                        .replace(/\s+/g, '')
                        .toLowerCase()
                    const data = await fetchData({
                        path: `/question/exist/${answer}`
                    })
                    if (data.exist === true) {
                        message.error(
                            'Question Already Uploaded by Someone else'
                        )
                    } else {
                        message.success('Be the first one to upload')
                    }
                }}
            >
                <Form.Item<FieldType>
                    name="answer"
                    extra="Please don't spend your time creating duplicate questions."
                    rules={[
                        {
                            required: true,
                            message: 'Please input the Answer!'
                        }
                    ]}
                >
                    <Input placeholder="Answer..." />
                </Form.Item>
                <Form.Item>
                    <Button htmlType="submit">Check</Button>
                </Form.Item>
            </Form>
            <Title level={3}>New Question</Title>
            <Typography.Paragraph>
                Questions will not be published by default. The admin will
                select the questions and determine their arrangement order.
            </Typography.Paragraph>
            <Form
                form={form}
                name="question"
                onFinish={onFinish}
                layout="vertical"
                initialValues={{
                    category: 'Other'
                }}
                onFinishFailed={onFinishFailed}
            >
                <Form.Item<FieldType>
                    label="Image"
                    name="image"
                    extra="Same will be displayed to users"
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
                    extra="(Use Space Between Words and Uppercase if required)"
                    name="answer"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your Answer!'
                        }
                    ]}
                >
                    <Input placeholder="Ex: Linux Campus Club" />
                </Form.Item>
                <Form.Item<FieldType>
                    label="Category"
                    name="category"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your Answer!'
                        }
                    ]}
                >
                    <Select>
                        {Object.values(QuestionCategory).map((val) => (
                            <Select.Option value={val}>{val}</Select.Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item<FieldType>
                    label="Hint"
                    name="hint"
                    extra="hint is displayed to users only when they are stuck"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your hint!'
                        }
                    ]}
                >
                    <Input placeholder="Ex: Penguin" />
                </Form.Item>
                {isAdmin && (
                    <>
                        <Form.Item<FieldType>
                            label="Showed Hint"
                            name="showedHint"
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item<FieldType>
                            label="Rating Int()"
                            name="rating"
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item<FieldType> label="Rating" name="rating">
                            <Rate allowHalf />
                        </Form.Item>
                        <Form.Item<FieldType>
                            label="Rate Count"
                            name="rateCount"
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item<FieldType>
                            label="Avg Attempts"
                            name="avgAttempts"
                        >
                            <Input />
                        </Form.Item>
                    </>
                )}
                <Form.Item<FieldType>
                    label="Difficulty"
                    extra="(Not Displayed to User. Only to arrange Question)"
                    name="difficulty"
                    rules={[
                        {
                            required: true,
                            message: 'Please mention its difficulty!'
                        }
                    ]}
                >
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
                    <Button htmlType="submit">{id ? 'Update' : 'Add'}</Button>
                </Form.Item>
            </Form>
        </div>
    )
}

export default AddQuestionTeam
