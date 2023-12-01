import { Button, Flex, Layout, message } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useCallback, useContext, useEffect, useState } from 'react'
import { fetchData } from '../utils/fetch'
import CountdownTimer from '../components/CountDownTimer'
import LoadingContext from '../utils/LoadingContext'
import Footer from '../components/Footer'

const Intro = () => {
    const { setLoading } = useContext(LoadingContext)
    const navigate = useNavigate()
    const [startTime, setStartTime] = useState<number>(0)
    const [started, setStarted] = useState<boolean>(false)
    const [ended, setEnded] = useState<boolean>(false)
    const checkContest = useCallback(async () => {
        const timer = setTimeout(() => {
            setLoading(true)
            message.loading('Starting the server. It may take upto 30 Seconds')
        }, 3000)
        const data = await fetchData({ path: '/contest/details' })
        clearTimeout(timer)
        setLoading(false)
        if (data.success === false) {
            message.error(data.message)
            if (data.ended === true) {
                setEnded(true)
            }
            navigator.vibrate(200)
        } else {
            if (data.started === true) {
                setStarted(true)
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
            <CountdownTimer
                futureTimestamp={startTime}
                started={started}
                ended={ended}
                onComplete={() => {}}
            />
            <Flex
                vertical
                gap={20}
                className="px-5 pb-5 min-h-[500px]"
                justify="center"
                align="center"
            >
                <img
                    src="/images/poster.jpeg"
                    alt="logo"
                    className="lg:mx-auto"
                />
                <Button
                    onClick={() => {
                        navigate('/login')
                    }}
                    className="w-full max-w-xl shadow-md"
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
