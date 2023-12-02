import { useCallback, useEffect, useState, useRef } from 'react'
import { fetchData } from '../utils/fetch'
import {
    Button,
    Card,
    Form,
    Input,
    InputRef,
    Layout,
    Rate,
    Skeleton,
    Typography,
    message
} from 'antd'
import { Md5 } from 'ts-md5'
import Confetti from 'react-confetti'
import Joyride, { STATUS } from 'react-joyride'
import { Message } from '../components/Message'

const { Paragraph, Text } = Typography
interface Question {
    no: number
    image: string
    showedHint?: string
    answer: string
    rating: number
    rateCount: number
    avgAttempts: number
    creator: {
        codeName: string
    }
}
type FieldType = {
    answer: string
}
const modifyString = (inputString: string): string => {
    const modifiedString = inputString.replace(/\s+/g, '').toLowerCase()
    return modifiedString
}
const steps = [
    {
        target: '.question-creator',
        content: 'Code name of the question creator',
        disableBeacon: true
    },
    {
        target: '.rating-container',
        content: 'Ratings from other users and Number of users.'
    },
    {
        target: '.avg-attempts',
        content:
            'The average number of attempts made by other users to solve the question.'
    },
    {
        target: '.hint-text',
        content: 'Hint for the question (only displayed when everyone is stuck)'
    }
]
const Play = () => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [rating, setRating] = useState(0)
    const [answer, setAnswer] = useState('')
    const [form] = Form.useForm()
    const inputRef = useRef<InputRef>(null)
    const [completed, setCompleted] = useState(false)
    const [imgLoading, setImgLoading] = useState(false)
    const avgAttempts = useRef(Number(localStorage.getItem('avgAttempts') || 0))
    const [validateStatus, setValidateStatus] = useState<'success' | 'error'>(
        'success'
    )
    const [showConfettim, setShowConfettim] = useState(false)
    const [question, setQuestion] = useState<Question | undefined>({
        no: 0,
        image: '',
        showedHint: '',
        answer: '',
        rating: 0,
        rateCount: 0,
        avgAttempts: 0,
        creator: {
            codeName: ''
        }
    })
    const [notStarted, setNotStarted] = useState(false)
    const { innerWidth: width, innerHeight: height } = window
    const loadQuestion = useCallback(async () => {
        setImgLoading(true)
        const data = await fetchData({ path: '/question/my' })
        setImgLoading(false)
        if (data.success === false) {
            setNotStarted(true)
            message.error(data.message)
        } else if (data.completed === true) {
            setNotStarted(true)
            setCompleted(true)
            setQuestion(undefined)
            message.success(data.message)
        } else {
            form.setFieldValue('answer', '')
            setQuestion(data.question)
        }
    }, [form])
    useEffect(() => {
        console.log('calling effect')
        loadQuestion()
    }, [loadQuestion])
    useEffect(() => {
        ;(async () => {
            const timer = setTimeout(() => {
                message.loading(
                    'Starting the server. It may take upto 30 Seconds'
                )
            }, 3000)
            await fetchData({ path: '/' })
            clearTimeout(timer)
        })()
    }, [])
    const submitAns = async (values: FieldType) => {
        if (question === undefined) return
        const answer = modifyString(values.answer)
        avgAttempts.current++
        localStorage.setItem('avgAttempts', String(avgAttempts.current))
        if (Md5.hashStr(answer + '0') !== question.answer) {
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
        inputRef.current?.blur()
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
        setImgLoading(true)
        setIsModalOpen(false)
        const data = await fetchData({
            path: '/question/ans',
            method: 'POST',
            body: {
                answer,
                rate: rating,
                avgAttempts: localStorage.getItem('avgAttempts')
            }
        })
        if (data.success === 'false') {
            message.error(data.message)
        } else {
            localStorage.setItem('avgAttempts', '0')
            avgAttempts.current = 0
            loadQuestion()
        }
    }
    return (
        <Layout>
            {completed && (
                <Text className="text-3xl flex items-center justify-center h-screen text-center">
                    🎉 Congratulations you have successfully completed decrypto
                    2k23 🏆
                </Text>
            )}
            {isModalOpen && (
                <Layout className="z-10 fixed top-0 left-0 bg-black bg-opacity-25 w-full h-full backdrop-blur-sm">
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
                </Layout>
            )}
            {notStarted && (
                <Text className="text-xl flex items-center justify-center h-screen">
                    Contest Not Yet Started... ⏳
                </Text>
            )}
            {notStarted === false && question && (
                <div className="flex flex-col items-center space-y-1 text-center">
                    {localStorage.getItem('gameTutorialPassed') !== 'true' &&
                        question.image !== '' && (
                            <Joyride
                                steps={steps}
                                continuous={true}
                                showProgress={true}
                                callback={({ status }) => {
                                    if (
                                        (
                                            [STATUS.FINISHED] as string[]
                                        ).includes(status)
                                    ) {
                                        window.localStorage.setItem(
                                            'gameTutorialPassed',
                                            'true'
                                        )
                                    }
                                }}
                                spotlightClicks
                            />
                        )}
                    <div className="space-y-2 mb-8 mt-4">
                        <Text className="text-2xl text-center">
                            Question {question.no}
                        </Text>
                        <Paragraph className="question-creator">
                            by: {question.creator.codeName}
                        </Paragraph>
                        <div className="rating-container text-sm flex items-center mt-1">
                            <Rate
                                allowHalf
                                value={question.rating}
                                disabled
                                className="px-2"
                            />
                            <Text>
                                {question.rating.toFixed(1) || 0}(
                                {question.rateCount || 0})
                            </Text>
                        </div>
                        <Paragraph className="avg-attempts text-sm">
                            {question.avgAttempts !== 0 ? (
                                <>
                                    Avg Attempts to solve:{' '}
                                    {question.avgAttempts.toFixed(1)}
                                </>
                            ) : (
                                'Be the first to crack it'
                            )}
                        </Paragraph>
                    </div>
                    {imgLoading ? (
                        <Skeleton.Image
                            className="!w-full !h-56 max-h-96"
                            active
                        />
                    ) : (
                        <img
                            src={question.image}
                            className="block w-full max-h-96 object-contain"
                            alt="question"
                        />
                    )}
                    {question.showedHint && (
                        <Paragraph className="hint-text">
                            Hint: {question.showedHint}
                        </Paragraph>
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
                            <Input
                                className="mt-3"
                                placeholder="Answer..."
                                ref={inputRef}
                                autoComplete="off"
                            />
                        </Form.Item>
                        <Form.Item className="flex items-center justify-center">
                            <Button
                                htmlType="submit"
                                className="px-5 shadow-md"
                            >
                                Check
                            </Button>
                        </Form.Item>
                    </Form>
                    <Message questionno={question.no} />
                </div>
            )}
        </Layout>
    )
}
export default Play
