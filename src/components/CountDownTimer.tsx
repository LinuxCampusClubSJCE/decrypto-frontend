import { Typography } from 'antd'
import { useCallback, useEffect, useState, useRef } from 'react'

const CountdownTimer = ({
    futureTimestamp,
    onComplete,
    started,
    ended
}: {
    futureTimestamp: number
    onComplete: () => void
    started: boolean
    ended: boolean
}) => {
    const timer = useRef<NodeJS.Timer>()
    const [localStarted, setLocalStarted] = useState(false)
    useEffect(() => {
        if (started) setLocalStarted(true)
    }, [started])
    const calculateTimeLeft = useCallback(() => {
        const difference = futureTimestamp - new Date().getTime()
        if (difference <= 0 && futureTimestamp !== 0) {
            onComplete()
            setLocalStarted(true)
            clearInterval(timer.current)
            return {
                hours: '00',
                minutes: '00',
                seconds: '00'
            }
        }
        if (started) {
            clearInterval(timer.current)
        }
        const hours = Math.floor(difference / (1000 * 60 * 60))
        const minutes = Math.floor((difference / 1000 / 60) % 60)
        const seconds = Math.floor((difference / 1000) % 60)

        return {
            hours: hours < 10 ? `0${hours}` : hours,
            minutes: minutes < 10 ? `0${minutes}` : minutes,
            seconds: seconds < 10 ? `0${seconds}` : seconds
        }
    }, [futureTimestamp, onComplete, started])

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft)
    useEffect(() => {
        timer.current = setInterval(() => {
            setTimeLeft(calculateTimeLeft())
        }, 1000)

        return () => clearInterval(timer.current)
    }, [calculateTimeLeft])
    return (
        <Typography.Title
            level={4}
            className="countdown-timer font-thin text-center mt-2"
        >
            {ended === true ? (
                <>The event's over, sorry.</>
            ) : futureTimestamp === 0 ? (
                <>Loading Event Details...</>
            ) : localStarted ? (
                <>🐧 Contest is Live 🎉</>
            ) : (
                <>
                    {timeLeft.hours}:{timeLeft.minutes}:{timeLeft.seconds}
                </>
            )}
        </Typography.Title>
    )
}

export default CountdownTimer
