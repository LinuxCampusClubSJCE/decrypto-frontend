import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Home from './pages/Home'
import Navbar from './components/Navbar'
import Rules from './pages/Rules'
import Register from './pages/Register'
import Leaderboard from './pages/Leaderboard'
import Logout from './pages/Logout'
import { ConfigProvider, theme } from 'antd'
import AddUserAdmin from './pages/AddUserAdmin'
import { useEffect, useState } from 'react'
import { fetchData } from './utils/fetch'
import AddQuestionTeam from './pages/AddQuestionTeam'
import CreateContest from './pages/CreateContest'
import LoadingContext from './utils/LoadingContext'
import { PropagateLoader } from 'react-spinners'
import UpdateUserDetails from './pages/UpdateUserDetails'
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

    return (
        <LoadingContext.Provider value={{ isLoading, setLoading }}>
            <ConfigProvider
                theme={{
                    algorithm: theme.defaultAlgorithm,
                    token: {
                        fontFamily: 'Roboto Mono',
                        borderRadius: 2
                    }
                }}
            >
                {isLoading && (
                    <div className="fixed flex items-center justify-center z-10 top-0 left-0 h-screen w-screen bg-slate-800 bg-opacity-30 backdrop-blur-sm">
                        <PropagateLoader color="white" />
                    </div>
                )}
                <Router>
                    <Navbar />
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/rules" element={<Rules />} />
                        <Route path="/leaderboard" element={<Leaderboard />} />
                        <Route path="/logout" element={<Logout />} />
                        <Route
                            path="/details/:id"
                            element={<UpdateUserDetails />}
                        />
                        {/* Admin */}
                        <Route path="/adduser" element={<AddUserAdmin />} />
                        <Route path="/adduser/:id" element={<AddUserAdmin />} />
                        <Route
                            path="/createcontest"
                            element={<CreateContest />}
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
            </ConfigProvider>
        </LoadingContext.Provider>
    )
}

export default App
