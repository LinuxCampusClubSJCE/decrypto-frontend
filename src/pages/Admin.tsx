import { Button } from 'antd'
import { useNavigate } from 'react-router-dom'
import ListUsers from '../components/ListUsers'
import ListQuestionCount from '../components/ListQuestionCount'
import ListCategoryCount from '../components/ListCategoryCount'
const Admin = () => {
    const navigate = useNavigate()
    return (
        <div>
            <div className="flex flex-col items-center justify-center space-y-3 p-3">
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
                <Button
                    onClick={() => {
                        navigate('/arrange')
                    }}
                >
                    Arrange Question
                </Button>
            </div>
            <ListQuestionCount />
            <ListCategoryCount />
            <ListUsers />
        </div>
    )
}

export default Admin
