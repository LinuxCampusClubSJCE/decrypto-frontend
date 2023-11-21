import { createContext } from 'react'

// Create the LoadingContext
const LoadingContext = createContext<{
    isLoading: boolean
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
}>({
    isLoading: false,
    setLoading: () => {}
})

export default LoadingContext
