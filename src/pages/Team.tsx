import { Button } from 'antd'
import { Link } from 'react-router-dom'
import ListQuestions from '../components/ListQuestions'

const Team = () => {
    const fullName = JSON.parse(localStorage.getItem('user') || '{}')[
        'fullName'
    ]
    const userId = localStorage.getItem('id')
    return (
        <div>
            <div className="text-center text-2xl p-2">
                Welcome {fullName}! 👋
            </div>
            <div className="text-center text-md">You can add question here</div>
            <Link to={'/details/' + userId} className="flex justify-center p-3">
                <Button>Update Profile</Button>
            </Link>
            <Link to="/addquestion" className="flex justify-center p-3">
                <Button>Add New Question</Button>
            </Link>
            <ListQuestions />
        </div>
    )
}
export default Team
