import { Button } from 'antd'
import { useNavigate } from 'react-router-dom'
import ListUsers from '../components/ListUsers'
const Admin = () => {
    const navigate = useNavigate()
    return (
        <div>
            <Button
                onClick={() => {
                    navigate('/createcontest')
                }}
            >
                Contest Details
            </Button>
            <Button
                onClick={() => {
                    navigate('/adduser')
                }}
            >
                Create New User
            </Button>

            <ListUsers />
        </div>
    )
}

export default Admin
