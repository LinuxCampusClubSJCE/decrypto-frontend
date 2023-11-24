import { Button, Flex, message } from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import { Typography } from 'antd'
import { useCallback, useContext, useEffect, useState } from 'react'
import { fetchData } from '../utils/fetch'
import CountdownTimer from '../components/CountDownTimer'
import {
    ChromeOutlined,
    InstagramOutlined,
    LinkedinOutlined
} from '@ant-design/icons'
import LoadingContext from '../utils/LoadingContext'

const { Title } = Typography
const Intro = () => {
    const { setLoading } = useContext(LoadingContext)
    const navigate = useNavigate()
    const [startTime, setStartTime] = useState<number>(0)
    const checkContest = useCallback(async () => {
        setLoading(true)
        const data = await fetchData({ path: '/contest/details' })
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
        <div>
            <Title level={3} className="text-center">
                <CountdownTimer
                    futureTimestamp={startTime}
                    onComplete={() => {
                        navigate('/')
                    }}
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
                <Link to="/login" className="max-w-xl w-full">
                    <Button className="w-full shadow-md ">Login</Button>
                </Link>
                <Link to="/register" className="max-w-xl w-full">
                    <Button className="w-full shadow-md">Register</Button>
                </Link>
            </Flex>
            <div className="flex p-2 py-4 flex-col  justify-center bg-slate-900 font-extralight text-zinc-200">
                <div className="text-center mb-3">Linux Campus Club</div>
                <div className="flex justify-evenly items-center flex-col md:flex-row space-y-1">
                    <Link target="_blank" to="https://lccjssstuniv.org/">
                        <ChromeOutlined className="mr-1" />
                        Website
                    </Link>
                    <Link
                        target="_blank"
                        to="https://www.instagram.com/linuxcampusclub/"
                    >
                        <InstagramOutlined className="mr-1" />
                        Instagram
                    </Link>
                    <Link
                        target="_blank"
                        to="https://in.linkedin.com/company/linux-campus-club"
                    >
                        <LinkedinOutlined className="mr-1" />
                        Linkedin
                    </Link>
                </div>
                <div className="text-center mt-3">
                    Developed By
                    <div className="pt-3">
                        <Link
                            target="_blank"
                            to="https://www.linkedin.com/in/akshayurs/"
                        >
                            <LinkedinOutlined className="mr-1" />
                        </Link>
                        Akshay Urs
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Intro
