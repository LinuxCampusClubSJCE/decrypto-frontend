import { useCallback, useContext, useEffect, useState, useRef } from 'react'
import { fetchData } from '../utils/fetch'
import LoadingContext from '../utils/LoadingContext'
import { Button, Card, Form, Input, InputRef, Rate, message } from 'antd'
import { Md5 } from 'ts-md5'
import Confetti from 'react-confetti'
interface Question {
    no: number
    image: string
    showedHint?: string
    answer: string
    rating: number
    rateCount: number
}
type FieldType = {
    answer: string
}
const modifyString = (inputString: string): string => {
    const modifiedString = inputString.replace(/\s+/g, '').toLowerCase()
    return modifiedString
}
const Play = () => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [rating, setRating] = useState(0)
    const [answer, setAnswer] = useState('')
    const [form] = Form.useForm()
    const inputRef = useRef<InputRef>(null)
    const [completed, setCompleted] = useState(false)
    const [validateStatus, setValidateStatus] = useState<'success' | 'error'>(
        'success'
    )
    const [showConfettim, setShowConfettim] = useState(false)
    const [question, setQuestion] = useState<Question>()
    const { setLoading } = useContext(LoadingContext)
    const { innerWidth: width, innerHeight: height } = window
    const loadQuestion = useCallback(async () => {
        setLoading(true)
        const data = await fetchData({ path: '/question/my' })
        setLoading(false)
        if (data.success === 'false') {
            message.error(data.message)
        } else if (data.completed === true) {
            setCompleted(true)
            setQuestion(undefined)
            message.success(data.message)
        } else {
            form.setFieldValue('answer', '')
            setQuestion(data.question)
        }
    }, [setLoading, form])
    useEffect(() => {
        loadQuestion()
    }, [loadQuestion, setLoading, setQuestion])
    const submitAns = async (values: FieldType) => {
        if (question === undefined) return
        const answer = modifyString(values.answer)
        console.log(values.answer, answer, question.answer, Md5.hashStr(answer))
        if (Md5.hashStr(answer) !== question.answer) {
            inputRef.current?.input?.classList.add('apply-shake')
            navigator.vibrate(100)
            setValidateStatus('error')
            setTimeout(() => {
                setValidateStatus('success')
                inputRef.current?.input?.classList.remove('apply-shake')
            }, 1000)
            message.error('Answer is incorrect', 1)
            return
        }
        setShowConfettim(true)
        setTimeout(() => {
            setShowConfettim(false)
        }, 5000)
        setIsModalOpen(true)
        setAnswer(values.answer)
    }
    const handleNext = async () => {
        setRating(0)
        if (rating === 0) {
            message.error('Please rate the question')
            return
        }
        setLoading(true)
        const data = await fetchData({
            path: '/question/ans',
            method: 'POST',
            body: {
                answer,
                rate: rating
            }
        })
        if (data.success === 'false') {
            message.error(data.message)
        }
        setIsModalOpen(false)
        setLoading(false)
        loadQuestion()
    }
    return (
        <div>
            {completed && (
                <div className="text-3xl flex items-center justify-center h-screen text-center">
                    🎉 Congratulations you have successfully completed decrypto
                    2k23 🏆
                </div>
            )}
            {isModalOpen && (
                <div className="z-10 fixed top-0 left-0 bg-black bg-opacity-25 w-full h-full backdrop-blur-sm">
                    {showConfettim && (
                        <Confetti width={width} height={height} />
                    )}
                    <Card
                        title="Rate this Question"
                        className="p-4 rounded-md fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                    >
                        <div className="flex flex-col items-center space-y-6">
                            <Rate
                                onChange={(val) => {
                                    setRating(val)
                                }}
                                allowHalf
                                value={rating}
                            />
                            <Button onClick={handleNext}>Next</Button>
                        </div>
                    </Card>
                </div>
            )}
            {question && (
                <div className="flex flex-col items-center space-y-1">
                    <div className="text-2xl font-normal text-center">
                        Question {question.no}
                        <div className="text-sm flex items-center mt-1">
                            <Rate
                                allowHalf
                                value={question.rating}
                                disabled
                                className="px-2"
                            />
                            {question.rating.toFixed(2) || 0}(
                            {question.rateCount || 0})
                        </div>
                    </div>

                    <img
                        src={question.image}
                        className="w-full m-6 max-h-96 object-contain"
                        alt=""
                    />
                    {question.showedHint && (
                        <div>Hint: {question.showedHint}</div>
                    )}
                    <Form
                        name="game"
                        form={form}
                        onFinish={submitAns}
                        className="w-full px-16"
                        onFinishFailed={() => {
                            message.error('Please Enter your answer')
                        }}
                    >
                        <Form.Item<FieldType>
                            name="answer"
                            validateStatus={validateStatus}
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your Answer!'
                                }
                            ]}
                        >
                            <Input placeholder="Answer..." ref={inputRef} />
                        </Form.Item>
                        <Form.Item className="flex items-center justify-center">
                            <Button htmlType="submit" className="px-5">
                                Check
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            )}
        </div>
    )
}
export default Play
