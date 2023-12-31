import {
    ChromeOutlined,
    GithubOutlined,
    InstagramOutlined,
    LinkedinOutlined,
    RobotOutlined
} from '@ant-design/icons'
import { Layout } from 'antd'
import { Link } from 'react-router-dom'
const Footer = () => {
    return (
        <Layout
            style={{
                backgroundColor: '#141414'
            }}
            className={
                'flex p-2 py-4 flex-col  justify-center bg-gray-950 font-extralight text-zinc-200'
            }
        >
            <div className="text-center mb-3">Linux Campus Club</div>
            <div className="lcc-links flex justify-evenly items-center flex-col md:flex-row space-y-1">
                <Link target="_blank" to="https://lccjssstuniv.org/">
                    <ChromeOutlined className="mr-1" />
                    Website
                </Link>
                <Link
                    target="_blank"
                    to="https://github.com/LinuxCampusClubSJCE"
                >
                    <GithubOutlined className="mr-1" />
                    Github
                </Link>
                <Link
                    target="_blank"
                    to="https://discord.com/invite/c3NwvbEk7H"
                >
                    <RobotOutlined className="mr-1" />
                    Discord
                </Link>
                <Link
                    target="_blank"
                    to="https://www.instagram.com/linuxcampusclub/"
                >
                    <InstagramOutlined className="mr-1" />
                    Instagram
                </Link>
                <Link
                    target="_blank"
                    to="https://in.linkedin.com/company/linux-campus-club"
                >
                    <LinkedinOutlined className="mr-1" />
                    Linkedin
                </Link>
            </div>
            <div className="text-center mt-3 developed-by">
                Developed By
                <div className="pt-3">
                    <Link
                        target="_blank"
                        to="https://www.linkedin.com/in/akshayurs/"
                    >
                        <LinkedinOutlined className="mr-1" />
                    </Link>
                    Akshay Urs
                </div>
            </div>
        </Layout>
    )
}

export default Footer
