import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const Logout = () => {
    const navigate = useNavigate()
    useEffect(() => {
        localStorage.removeItem('token')
        localStorage.removeItem('login')
        localStorage.removeItem('user')
        localStorage.removeItem('id')
        navigate('/')
    }, [navigate])
    return null
}
export default Logout
