import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import React, { Suspense } from 'react'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import Navbar from './components/Navbar'
import Leaderboard from './pages/Leaderboard'
import { ConfigProvider, Layout, Typography, theme } from 'antd'
import { useEffect, useState } from 'react'
import { fetchData } from './utils/fetch'
import LoadingContext from './utils/LoadingContext'
import { PropagateLoader } from 'react-spinners'
import Joyride, { STATUS } from 'react-joyride'
import { AliasToken } from 'antd/es/theme/internal'
const { Text } = Typography
const steps = [
    {
        target: '.logo-container',
        content: 'Welcome to Decrypto by LCC. Complete this tour to hide this',
        disableBeacon: true
    },
    {
        target: '#theme-changer',
        content: 'You can change Light/Dark Theme here'
    },
    {
        target: '.leaderboard-icon',
        content: 'You can see your rank and who is at the top'
    },
    {
        target: '.rules-icon',
        content: 'Check out the rules before starting the game'
    },
    {
        target: '.countdown-timer',
        content: 'Game Status'
    },
    {
        target: '.lcc-links',
        content: 'Checkout these links'
    },
    {
        target: '.developed-by',
        content: 'Have Fun 😉'
    }
]

const LazyRules = React.lazy(() => import('./pages/Rules'))
const LazyLogout = React.lazy(() => import('./pages/Logout'))
const LazyDetails = React.lazy(() => import('./pages/UpdateUserDetails'))
const LazyAddUserAdmin = React.lazy(() => import('./pages/AddUserAdmin'))
const LazyEditQuestionAdmin = React.lazy(() =>
    import('./pages/AddQuestionTeam').then(({ default: Component }) => ({
        default: () => <Component isAdmin={true} />
    }))
)
const LazyCreateContest = React.lazy(() => import('./pages/CreateContest'))
const LazyArrangeQuestions = React.lazy(
    () => import('./components/ArrangeQuestions')
)
const LazyAddQuestionTeam = React.lazy(() => import('./pages/AddQuestionTeam'))

function App() {
    const checkLogin = async () => {
        if (localStorage.getItem('login') === 'true') {
            const data = await fetchData({ path: '/auth/check' })
            if (data.success === false) {
                localStorage.removeItem('token')
                localStorage.removeItem('login')
                localStorage.removeItem('user')
                localStorage.removeItem('id')
                window.location.reload()
            }
        }
    }

    useEffect(() => {
        checkLogin()
    }, [])

    const [isLoading, setLoading] = useState(false)
    const [isDarkMode, setDarkMode] = useState(
        localStorage.getItem('theme') === 'light' ? false : true
    )

    const toggleDarkMode = (checked: boolean) => {
        localStorage.setItem('theme', checked ? 'dark' : 'light')
        setDarkMode(checked)
    }
    const lightTheme: Partial<AliasToken> = {
        colorBorder: '#3774ca'
    }
    const darkTheme: Partial<AliasToken> = {
        colorBgLayout: '#080808',
        colorBorder: '#371137',
        colorPrimary: '#ee95ee'
    }

    return (
        <LoadingContext.Provider value={{ isLoading, setLoading }}>
            <ConfigProvider
                theme={{
                    algorithm: isDarkMode
                        ? theme.darkAlgorithm
                        : theme.defaultAlgorithm,
                    token: {
                        fontFamily: 'Roboto Mono',
                        borderRadius: 2,
                        ...(isDarkMode ? darkTheme : lightTheme)
                    }
                }}
            >
                <Layout className="min-h-screen">
                    {isLoading && (
                        <Text className="fixed flex items-center justify-center z-30 top-0 left-0 h-screen w-screen bg bg-slate-800 bg-opacity-30 backdrop-blur-sm">
                            <PropagateLoader color="white" />
                        </Text>
                    )}
                    <Router>
                        <Navbar
                            isDarkMode={isDarkMode}
                            toggleDarkMode={toggleDarkMode}
                        />
                        {localStorage.getItem('introTutorialPassed') !==
                            'true' && (
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
                                            'introTutorialPassed',
                                            'true'
                                        )
                                    }
                                }}
                                hideCloseButton
                                spotlightClicks
                            />
                        )}
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route
                                path="/rules"
                                element={
                                    <Suspense
                                        fallback={
                                            <Text className="flex items-center justify-center h-full text-lg monospace">
                                                loading...
                                            </Text>
                                        }
                                    >
                                        <LazyRules />
                                    </Suspense>
                                }
                            />
                            <Route
                                path="/leaderboard"
                                element={<Leaderboard />}
                            />
                            <Route
                                path="/logout"
                                element={
                                    <Suspense
                                        fallback={
                                            <Text className="flex items-center justify-center h-full text-lg monospace">
                                                loading...
                                            </Text>
                                        }
                                    >
                                        <LazyLogout />
                                    </Suspense>
                                }
                            />
                            <Route
                                path="/details/:id"
                                element={
                                    <Suspense
                                        fallback={
                                            <Text className="flex items-center justify-center h-full text-lg monospace">
                                                loading...
                                            </Text>
                                        }
                                    >
                                        <LazyDetails />
                                    </Suspense>
                                }
                            />
                            {/* Admin */}
                            <Route
                                path="/adduser"
                                element={
                                    <Suspense
                                        fallback={
                                            <Text className="flex items-center justify-center h-full text-lg monospace">
                                                loading...
                                            </Text>
                                        }
                                    >
                                        <LazyAddUserAdmin />
                                    </Suspense>
                                }
                            />
                            <Route
                                path="/editquestionadmin/:id"
                                element={
                                    <Suspense
                                        fallback={
                                            <Text className="flex items-center justify-center h-full text-lg monospace">
                                                loading...
                                            </Text>
                                        }
                                    >
                                        <LazyEditQuestionAdmin />
                                    </Suspense>
                                }
                            />
                            <Route
                                path="/adduser/:id"
                                element={
                                    <Suspense
                                        fallback={
                                            <Text className="flex items-center justify-center h-full text-lg monospace">
                                                loading...
                                            </Text>
                                        }
                                    >
                                        <LazyAddUserAdmin />
                                    </Suspense>
                                }
                            />
                            <Route
                                path="/createcontest"
                                element={
                                    <Suspense
                                        fallback={
                                            <Text className="flex items-center justify-center h-full text-lg monospace">
                                                loading...
                                            </Text>
                                        }
                                    >
                                        <LazyCreateContest />
                                    </Suspense>
                                }
                            />
                            <Route
                                path="/arrange"
                                element={
                                    <Suspense
                                        fallback={
                                            <Text className="flex items-center justify-center h-full text-lg monospace">
                                                loading...
                                            </Text>
                                        }
                                    >
                                        <LazyArrangeQuestions />
                                    </Suspense>
                                }
                            />
                            {/* Team */}
                            <Route
                                path="/addquestion/"
                                element={
                                    <Suspense
                                        fallback={
                                            <Text className="flex items-center justify-center h-full text-lg monospace">
                                                loading...
                                            </Text>
                                        }
                                    >
                                        <LazyAddQuestionTeam />
                                    </Suspense>
                                }
                            />
                            <Route
                                path="/addquestion/:id"
                                element={
                                    <Suspense
                                        fallback={
                                            <Text className="flex items-center justify-center h-full text-lg monospace">
                                                loading...
                                            </Text>
                                        }
                                    >
                                        <LazyAddQuestionTeam />
                                    </Suspense>
                                }
                            />
                        </Routes>
                    </Router>
                </Layout>
            </ConfigProvider>
        </LoadingContext.Provider>
    )
}

export default App
