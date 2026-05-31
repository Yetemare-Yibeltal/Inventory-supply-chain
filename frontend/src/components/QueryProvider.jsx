import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Instantiate a high-performance memoized client data cluster configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Prevent aggressive background polling cycles by setting strategic structural buffers
      staleTime: 5 * 60 * 1000, // 5 minutes window before record indices are marked old
      cacheTime: 10 * 60 * 1000, // Retain underlying state mirror matrix for 10 minutes
      refetchOnWindowFocus: false, // Prevent automated network triggers on terminal window activation
      refetchOnReconnect: 'always', // Ensure local pipeline instantly synchronizes when reconnection state changes
      retry: 1 // Limit data failure retry executions to a single fallback command path
    }
  }
})

const QueryProvider = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

export default QueryProvider

