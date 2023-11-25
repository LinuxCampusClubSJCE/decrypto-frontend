import { useCallback, useEffect, useState, useRef } from 'react'

const CountdownTimer = ({
    futureTimestamp,
    onComplete
}: {
    futureTimestamp: number
    onComplete: () => void
}) => {
    const timer = useRef<NodeJS.Timer>()
    const [completed, setCompleted] = useState(false)
    const calculateTimeLeft = useCallback(() => {
        const difference = futureTimestamp - new Date().getTime()
        if (difference <= 0) {
            onComplete()
            setCompleted(true)
            clearInterval(timer.current)
            return {
                hours: '00',
                minutes: '00',
                seconds: '00'
            }
        }

        const hours = Math.floor(difference / (1000 * 60 * 60))
        const minutes = Math.floor((difference / 1000 / 60) % 60)
        const seconds = Math.floor((difference / 1000) % 60)

        return {
            hours: hours < 10 ? `0${hours}` : hours,
            minutes: minutes < 10 ? `0${minutes}` : minutes,
            seconds: seconds < 10 ? `0${seconds}` : seconds
        }
    }, [onComplete, futureTimestamp])

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft)

    useEffect(() => {
        timer.current = setInterval(() => {
            setTimeLeft(calculateTimeLeft())
        }, 1000)

        return () => clearInterval(timer.current)
    }, [calculateTimeLeft])

    return (
        <div className="font-thin">
            {completed ? (
                <>🐧 Contest is Live 🎉</>
            ) : (
                <>
                    {timeLeft.hours}:{timeLeft.minutes}:{timeLeft.seconds}
                </>
            )}
        </div>
    )
}

export default CountdownTimer
