import { useCallback, useEffect, useState } from 'react'
import { fetchData } from '../utils/fetch'
import { Button, Layout, Table, Typography } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { WhatsAppOutlined } from '@ant-design/icons'

const { Paragraph, Text } = Typography
interface leaderboardType {
    _id: string
    rank: number
    username: string
    fullName?: string
    solvedQuestions: number
}

const columns: ColumnsType<leaderboardType> = [
    {
        title: 'Rank',
        dataIndex: 'rank',
        sorter: (a: leaderboardType, b: leaderboardType) => a.rank - b.rank,
        defaultSortOrder: 'ascend'
    },
    {
        title: 'Username',
        dataIndex: 'username',
        sorter: (a: leaderboardType, b: leaderboardType) =>
            a.username > b.username ? 1 : b.username > a.username ? -1 : 0
    },
    {
        title: 'Question',
        dataIndex: 'solvedQuestions'
    }
]

const Leaderboard = () => {
    const [isLoading, setLoading] = useState(false)

    const loadData = useCallback(async () => {
        setLoading(true)
        const isTeam =
            JSON.parse(localStorage.getItem('user') || '{}')['isTeam'] === true
        const data = await fetchData({
            path: isTeam ? '/users/teamleaderboard' : '/users/leaderboard'
        })
        setLoading(false)
        if (data.success) {
            let lastVal =
                data.leaderboard.length !== 0 &&
                data.leaderboard[0].solvedQuestions
            let rank = 1
            if (isTeam) {
                data.leaderboard = data.leaderboard.map(
                    (data: leaderboardType) => {
                        return { ...data, username: data.fullName }
                    }
                )
            }
            const leaderboardData = data.leaderboard.map(
                (item: leaderboardType) => {
                    if (lastVal !== item.solvedQuestions) {
                        lastVal = item.solvedQuestions
                        rank++
                    }
                    return {
                        ...item,
                        rank
                    }
                }
            )

            setLeaderboard(leaderboardData)
        }
    }, [setLoading])
    useEffect(() => {
        loadData()
    }, [loadData])
    const [leaderboard, setLeaderboard] = useState<leaderboardType[]>([])
    let user = localStorage.getItem('user')
    let userObj: {
        _id: string
        fullName: string
        username: string
        email: string
    } | null = null
    let userRank = -1
    if (user !== null) {
        userObj = JSON.parse(user)
        const userInd = leaderboard.findIndex((i) => i._id === userObj?._id)
        if (userInd !== -1) {
            userRank = leaderboard[userInd].rank
        }
    }
    return (
        <Layout className="min-h-screen">
            {userObj !== null && userRank !== -1 && (
                <div className="text-center space-y-1 mt-2">
                    <Text>Rank: {userRank}</Text>
                    <Paragraph>Name: {userObj.fullName}</Paragraph>
                    <Paragraph>username: {userObj.username}</Paragraph>
                </div>
            )}
            <Button
                onClick={() => {
                    window.location.href =
                        'https://chat.whatsapp.com/LdalrkM859WACWVTm9Be1x'
                }}
                icon={<WhatsAppOutlined />}
            >
                Join for hints
            </Button>
            <Table
                loading={isLoading}
                columns={columns}
                dataSource={leaderboard.map((val) => {
                    return { ...val, key: val._id }
                })}
                className="p-3"
            />
        </Layout>
    )
}
export default Leaderboard
