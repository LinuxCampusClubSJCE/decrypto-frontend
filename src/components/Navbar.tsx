import React, { useEffect, useState } from 'react'
import {
    HomeOutlined,
    LogoutOutlined,
    ReadOutlined,
    TrophyOutlined
} from '@ant-design/icons'
import type { MenuProps } from 'antd'
import { Avatar, Dropdown, Flex, Layout, Menu } from 'antd'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import '../glitch.css'

const menu: MenuProps['items'] = [
    {
        key: 'website',
        label: (
            <Link target="_blank" to="https://lccjssstuniv.org/">
                Website
            </Link>
        )
    },
    {
        key: 'instagram',
        label: (
            <Link
                target="_blank"
                to="https://www.instagram.com/linuxcampusclub/"
            >
                Instagram
            </Link>
        )
    },
    {
        key: 'linkedin',
        label: (
            <Link
                target="_blank"
                to="https://in.linkedin.com/company/linux-campus-club"
            >
                Linkedin
            </Link>
        )
    }
]

const Navbar: React.FC = () => {
    const navigate = useNavigate()
    let { pathname: location } = useLocation()
    const [current, setCurrent] = useState(
        location === '/' ? '/home' : location
    )
    useEffect(() => {
        let path = location
        if (path === '/') {
            path = '/home'
        }
        setCurrent(path)
    }, [location])
    const items: MenuProps['items'] = [
        {
            label: 'Home',
            key: '/home',
            icon: <HomeOutlined />
        },
        {
            label: 'Leaderboard',
            key: '/leaderboard',
            icon: <TrophyOutlined />
        }
    ]
    if (localStorage.getItem('login') === 'true') {
        items.push({
            label: 'Logout',
            key: '/logout',
            icon: <LogoutOutlined />
        })
    } else {
        items.push({
            label: 'Rules',
            key: '/rules',
            icon: <ReadOutlined />
        })
    }
    const onClick: MenuProps['onClick'] = (e) => {
        let path = e.key
        if (path === '/home') {
            path = ''
        }
        setCurrent(e.key)
        navigate(path)
    }

    return (
        <Layout>
            <Flex align="center" justify="space-between" className="p-3">
                <div className="glitch text-3xl">
                    <span aria-hidden="true">Decrypto 2k23</span>
                    Decrypto 2k23
                    <span aria-hidden="true">Decrypto 2k23</span>
                </div>
                <Dropdown menu={{ items: menu }}>
                    <Avatar
                        size="large"
                        icon={
                            <img
                                src="/images/logo.jpeg"
                                alt="logo"
                                className="rounded-full"
                            />
                        }
                    />
                </Dropdown>
            </Flex>
            <Menu
                onClick={onClick}
                selectedKeys={[current]}
                mode="horizontal"
                items={items}
                className="flex justify-center text-[16px] p-4"
            />
        </Layout>
    )
}

export default Navbar
