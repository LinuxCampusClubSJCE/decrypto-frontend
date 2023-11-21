export const fetchData = async ({
    path,
    method,
    body
}: {
    path: string
    method?: string
    body?: Record<string, any>
}): Promise<any> => {
    try {
        const requestOptions: RequestInit = {
            method: method || 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + localStorage.getItem('token') || ''
            },
            body: body ? JSON.stringify(body) : undefined
        }

        const response = await fetch(
            `${process.env.REACT_APP_SERVER_URL}${path}`,
            requestOptions
        )
        const data = await response.json()
        return data
    } catch (e) {
        console.error('Error:', e)
    }
}
