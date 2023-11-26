import { Link } from 'react-router-dom'
import { Button, Layout, Typography } from 'antd'
import ListQuestions from '../components/ListQuestions'
import { FileImageOutlined } from '@ant-design/icons'
const { Paragraph, Text } = Typography
const Team = () => {
    const fullName = JSON.parse(localStorage.getItem('user') || '{}')[
        'fullName'
    ]
    const userId = localStorage.getItem('id')
    return (
        <Layout>
            <Text className="text-center text-2xl p-2">
                Welcome {fullName}! 👋
            </Text>
            <Paragraph className="text-center text-md">
                You can add question here
            </Paragraph>
            <Link to={'/details/' + userId} className="flex justify-center p-3">
                <Button>Update Profile</Button>
            </Link>
            <Link
                to="https://www.photocollage.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex justify-center p-3"
            >
                <Button icon={<FileImageOutlined />}>Photo Collage</Button>
            </Link>
            <Link to="/addquestion" className="flex justify-center p-3">
                <Button>Add New Question</Button>
            </Link>
            <ListQuestions />
        </Layout>
    )
}
export default Team
