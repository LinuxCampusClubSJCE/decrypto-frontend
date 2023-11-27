import { Button, Flex, Layout, message } from 'antd'
import { useNavigate } from 'react-router-dom'
import { Typography } from 'antd'
import { useCallback, useContext, useEffect, useState } from 'react'
import { fetchData } from '../utils/fetch'
import CountdownTimer from '../components/CountDownTimer'
import LoadingContext from '../utils/LoadingContext'
import Footer from '../components/Footer'

const { Title } = Typography
const Intro = () => {
    const { setLoading } = useContext(LoadingContext)
    const navigate = useNavigate()
    const [startTime, setStartTime] = useState<number>(0)
    const checkContest = useCallback(async () => {
        setLoading(true)
        const timer = setTimeout(() => {
            message.loading('Starting the server. It may take upto 30 Seconds')
        }, 3000)
        const data = await fetchData({ path: '/contest/details' })
        clearTimeout(timer)
        setLoading(false)
        if (data.success === false) {
            message.error(data.message)
            navigator.vibrate(200)
        } else {
            if (data.started === true) {
                message.success(data.message)
            } else {
                message.info(data.message)
            }
            setStartTime(Date.parse(data.startTime))
        }
    }, [setLoading])
    useEffect(() => {
        checkContest()
    }, [checkContest])
    return (
        <Layout>
            <Title level={3} className="text-center mt-2">
                <CountdownTimer
                    futureTimestamp={startTime}
                    onComplete={() => {}}
                />
            </Title>
            <Flex
                vertical
                gap={20}
                className="px-5 pb-5 min-h-[500px]"
                justify="center"
                align="center"
            >
                <img
                    src="/images/logo.jpeg"
                    alt="logo"
                    className="lg:mx-auto"
                />
                <Button
                    onClick={() => {
                        navigate('/login')
                    }}
                    className="w-full max-w-xl shadow-md "
                >
                    Login
                </Button>
                <Button
                    onClick={() => {
                        navigate('/register')
                    }}
                    className="w-full max-w-xl shadow-md"
                >
                    Register
                </Button>
            </Flex>
            <Footer />
        </Layout>
    )
}

export default Intro
