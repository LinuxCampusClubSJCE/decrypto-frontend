import { useNavigate } from 'react-router-dom'
import Admin from './Admin'
import Intro from './Intro'
import Play from './Play'
import Team from './Team'

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
        if (user.isTeam) return <Team />
        if (user.isAdmin) return <Admin />
    }
    return loggedin ? <Play /> : <Intro />
}

export default Home
