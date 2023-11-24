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
            let lastVal =
                data.leaderboard.length !== 0 &&
                data.leaderboard[0].solvedQuestions
            let rank = 1
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
    return (
        <div>
            <Table columns={columns} dataSource={leaderboard} className="p-3" />
        </div>
    )
}
export default Leaderboard
