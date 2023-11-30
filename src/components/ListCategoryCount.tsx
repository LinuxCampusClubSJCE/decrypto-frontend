import { Table, Typography } from 'antd'
import { useCallback, useContext, useEffect, useState } from 'react'
import { fetchData } from '../utils/fetch'
import LoadingContext from '../utils/LoadingContext'
const { Text } = Typography
interface category {
    _id: string
    count: number
}

const ListCategoryCount = () => {
    const { setLoading } = useContext(LoadingContext)

    const columns = [
        {
            title: 'Category',
            dataIndex: '_id',
            ellipsis: true,
            sorter: (a: category, b: category) =>
                a._id > b._id ? 1 : b._id > a._id ? -1 : 0
        },
        {
            title: 'Count',
            dataIndex: 'count',
            sorter: (a: category, b: category) => a.count - b.count
        }
    ]
    const loadUsers = useCallback(async () => {
        setLoading(true)
        const data = await fetchData({ path: '/question/categorycount' })
        setLoading(false)
        setCategoryCounts(data.categoryCounts)
    }, [setLoading])
    const [categoryCounts, setCategoryCounts] = useState<category[]>()
    useEffect(() => {
        loadUsers()
    }, [loadUsers])
    const totalQuestions = categoryCounts?.reduce(
        (total, category) => total + category.count,
        0
    )
    return (
        <div>
            <Table
                className="max-w-full"
                size="small"
                columns={columns}
                dataSource={categoryCounts?.map((val) => {
                    return { ...val, key: val._id }
                })}
                bordered={true}
                footer={() => <Text>Total Questions: {totalQuestions}</Text>}
            />
        </div>
    )
}
export default ListCategoryCount
