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
import { useEffect } from 'react'
import { fetchData } from './utils/fetch'
import AddQuestionTeam from './pages/AddQuestionTeam'
import CreateContest from './components/CreateContest'
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
    return (
        <ConfigProvider
            theme={{
                algorithm: theme.defaultAlgorithm,
                token: {
                    // colorPrimary: "#000000",
                    // colorPrimaryBg: "#fffff",
                    fontFamily: 'Roboto Mono',
                    borderRadius: 2
                    // boxShadow: "0px 0px 10px black",
                    // colorBgContainer: "#fff",
                }
            }}
        >
            <Router>
                <Navbar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/rules" element={<Rules />} />
                    <Route path="/leaderboard" element={<Leaderboard />} />
                    <Route path="/logout" element={<Logout />} />
                    {/* Admin */}
                    <Route path="/adduser" element={<AddUserAdmin />} />
                    <Route path="/adduser/:id" element={<AddUserAdmin />} />
                    <Route path="/createcontest" element={<CreateContest />} />
                    {/* Team */}
                    <Route path="/addquestion/" element={<AddQuestionTeam />} />
                    <Route
                        path="/addquestion/:id"
                        element={<AddQuestionTeam />}
                    />
                </Routes>
            </Router>
        </ConfigProvider>
    )
}

export default App
