import { Button } from 'antd'
import { useNavigate } from 'react-router-dom'
import ListUsers from '../components/ListUsers'
import ListQuestionCount from '../components/ListQuestionCount'
import ListCategoryCount from '../components/ListCategoryCount'
import { ListMessages } from '../components/ListMessages'
import { ListLogs } from '../components/ListLogs'
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
                <Button
                    onClick={() => {
                        navigate('/arrangenoimg')
                    }}
                >
                    Arrange Question (without Images)
                </Button>
            </div>
            <ListQuestionCount />
            <ListCategoryCount />
            <ListUsers />
            <ListMessages />
            <ListLogs />
        </div>
    )
}

export default Admin
