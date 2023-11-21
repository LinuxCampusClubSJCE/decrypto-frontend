import { useCallback, useContext, useEffect, useState } from 'react'
import { fetchData } from '../utils/fetch'
import { Table } from 'antd'
import LoadingContext from '../utils/LoadingContext'

interface leaderboardType {
    rank: number
    username: string
    solvedQuestions: number
}

const columns = [
    {
        title: 'Rank',
        dataIndex: 'rank'
    },
    {
        title: 'Username',
        dataIndex: 'username'
    },
    {
        title: 'Question',
        dataIndex: 'solvedQuestions'
    }
]

const Leaderboard = () => {
    const { setLoading } = useContext(LoadingContext)

    const loadData = useCallback(async () => {
        setLoading(true)
        const data = await fetchData({ path: '/users/leaderboard' })
        setLoading(false)
        if (data.success) {
            const leaderboardData = data.leaderboard.map(
                (item: leaderboardType, index: number) => {
                    return {
                        ...item,
                        rank: index + 1
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
    return (
        <div>
            <Table columns={columns} dataSource={leaderboard} className="p-3" />
        </div>
    )
}
export default Leaderboard
