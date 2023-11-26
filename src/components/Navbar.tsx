import React, { useEffect, useState } from 'react'
import {
    HomeOutlined,
    LogoutOutlined,
    ReadOutlined,
    TrophyOutlined
} from '@ant-design/icons'
import type { MenuProps } from 'antd'
import { Avatar, Dropdown, Flex, Menu } from 'antd'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import '../glitch.css'
import { DarkModeSwitch } from 'react-toggle-dark-mode'

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

const Navbar: React.FC<{
    isDarkMode: boolean
    toggleDarkMode: (checked: boolean) => void
}> = ({ isDarkMode, toggleDarkMode }) => {
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
            className: 'home-icon',
            icon: <HomeOutlined />
        },
        {
            label: 'Leaderboard',
            key: '/leaderboard',
            className: 'leaderboard-icon',
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
            className: 'rules-icon',
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
        <div>
            <Flex align="center" justify="space-between" className="p-3">
                <div className="glitch text-3xl logo-container">
                    <span aria-hidden="true">Decrypto 2k23</span>
                    Decrypto 2k23
                    <span aria-hidden="true">Decrypto 2k23</span>
                </div>
                <div className="flex items-center space-x-4">
                    <DarkModeSwitch
                        // style={{ marginBottom: '2rem' }}
                        className="block"
                        checked={isDarkMode}
                        id="theme-changer"
                        onChange={toggleDarkMode}
                        size={40}
                    />
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
                </div>
            </Flex>
            <Menu
                onClick={onClick}
                selectedKeys={[current]}
                mode="horizontal"
                items={items}
                className="flex justify-center text-[16px] p-4"
            />
        </div>
    )
}

export default Navbar
