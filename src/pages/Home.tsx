import { useNavigate } from 'react-router-dom'
import Intro from './Intro'
import Play from './Play'
import { Suspense } from 'react'
import React from 'react'
import { Typography } from 'antd'
const LazyAdmin = React.lazy(() => import('./Admin'))
const LazyTeam = React.lazy(() => import('./Team'))
const { Text } = Typography
const Home = () => {
    const navigate = useNavigate()
    let loggedin = false
    let user

    try {
        loggedin = localStorage.getItem('login') === 'true'
        user = JSON.parse(localStorage.getItem('user') || '{}')
    } catch (error) {
        navigate('/logout')
        return null
    }

    if (loggedin) {
        if (user.isTeam)
            return (
                <Suspense
                    fallback={
                        <Text className="flex items-center justify-center h-full text-lg monospace">
                            loading...
                        </Text>
                    }
                >
                    <LazyTeam />
                </Suspense>
            )
        if (user.isAdmin)
            return (
                <Suspense
                    fallback={
                        <Text className="flex items-center justify-center h-full text-lg monospace">
                            loading...
                        </Text>
                    }
                >
                    <LazyAdmin />
                </Suspense>
            )
    }

    return loggedin ? <Play /> : <Intro />
}

export default Home
