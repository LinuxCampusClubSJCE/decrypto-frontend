import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Home from './pages/Home'
import Navbar from './components/Navbar'
import Rules from './pages/Rules'
import Register from './pages/Register'
import Leaderboard from './pages/Leaderboard'
import Logout from './pages/Logout'
import { ConfigProvider, Layout, theme } from 'antd'
import AddUserAdmin from './pages/AddUserAdmin'
import { useEffect, useState } from 'react'
import { fetchData } from './utils/fetch'
import AddQuestionTeam from './pages/AddQuestionTeam'
import CreateContest from './pages/CreateContest'
import LoadingContext from './utils/LoadingContext'
import { PropagateLoader } from 'react-spinners'
import UpdateUserDetails from './pages/UpdateUserDetails'
import ArrangeQuestions from './components/ArrangeQuestions'
import Joyride, { STATUS } from 'react-joyride'

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
function App() {
    const checkLogin = async () => {
        if (localStorage.getItem('login') === 'true') {
            const data = await fetchData({ path: '/auth/check' })
            if (data.success === false) {
                localStorage.clear()
                window.location.reload()
            }
        }
    }
    useEffect(() => {
        checkLogin()
    }, [])
    const [isLoading, setLoading] = useState(false)
    const [isDarkMode, setDarkMode] = useState(false)

    const toggleDarkMode = (checked: boolean) => {
        setDarkMode(checked)
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
                        borderRadius: 2
                    }
                }}
            >
                <Layout className="min-h-screen">
                    {isLoading && (
                        <div className="fixed flex items-center justify-center z-30 top-0 left-0 h-screen w-screen bg-slate-800 bg-opacity-30 backdrop-blur-sm">
                            <PropagateLoader color="white" />
                        </div>
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
                            <Route path="/rules" element={<Rules />} />
                            <Route
                                path="/leaderboard"
                                element={<Leaderboard />}
                            />
                            <Route path="/logout" element={<Logout />} />
                            <Route
                                path="/details/:id"
                                element={<UpdateUserDetails />}
                            />
                            {/* Admin */}
                            <Route path="/adduser" element={<AddUserAdmin />} />
                            <Route
                                path="/editquestionadmin/:id"
                                element={<AddQuestionTeam isAdmin={true} />}
                            />
                            <Route
                                path="/adduser/:id"
                                element={<AddUserAdmin />}
                            />
                            <Route
                                path="/createcontest"
                                element={<CreateContest />}
                            />
                            <Route
                                path="/arrange"
                                element={<ArrangeQuestions />}
                            />
                            {/* Team */}
                            <Route
                                path="/addquestion/"
                                element={<AddQuestionTeam />}
                            />
                            <Route
                                path="/addquestion/:id"
                                element={<AddQuestionTeam />}
                            />
                        </Routes>
                    </Router>
                </Layout>
            </ConfigProvider>
        </LoadingContext.Provider>
    )
}

export default App
