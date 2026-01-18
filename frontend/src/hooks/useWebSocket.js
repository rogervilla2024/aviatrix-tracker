import { useState, useEffect, useCallback, useRef } from 'react'

/**
 * Custom hook for WebSocket connection to Aviatrix Tracker backend
 *
 * @param {string} url - WebSocket URL (default: /ws)
 * @param {Object} options - Configuration options
 * @returns {Object} WebSocket state and methods
 */
export const useWebSocket = (url = '/ws', options = {}) => {
  const {
    reconnectAttempts = 5,
    reconnectInterval = 3000,
    onMessage,
    onConnect,
    onDisconnect,
    onError
  } = options

  const [isConnected, setIsConnected] = useState(false)
  const [lastMessage, setLastMessage] = useState(null)
  const [connectionState, setConnectionState] = useState('disconnected')

  const wsRef = useRef(null)
  const reconnectCountRef = useRef(0)
  const reconnectTimeoutRef = useRef(null)

  // Build WebSocket URL
  const getWebSocketUrl = useCallback(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    const host = window.location.host

    // If URL starts with /, it's a relative path
    if (url.startsWith('/')) {
      return `${protocol}//${host}${url}`
    }
    return url
  }, [url])

  // Connect to WebSocket
  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return
    }

    setConnectionState('connecting')

    try {
      const wsUrl = getWebSocketUrl()
      wsRef.current = new WebSocket(wsUrl)

      wsRef.current.onopen = () => {
        setIsConnected(true)
        setConnectionState('connected')
        reconnectCountRef.current = 0
        onConnect?.()
      }

      wsRef.current.onclose = (event) => {
        setIsConnected(false)
        setConnectionState('disconnected')
        onDisconnect?.(event)

        // Attempt reconnection
        if (reconnectCountRef.current < reconnectAttempts) {
          reconnectCountRef.current++
          setConnectionState('reconnecting')
          reconnectTimeoutRef.current = setTimeout(() => {
            connect()
          }, reconnectInterval)
        }
      }

      wsRef.current.onerror = (error) => {
        setConnectionState('error')
        onError?.(error)
      }

      wsRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          setLastMessage(data)
          onMessage?.(data)
        } catch (e) {
          // Handle non-JSON messages
          setLastMessage(event.data)
          onMessage?.(event.data)
        }
      }
    } catch (error) {
      setConnectionState('error')
      onError?.(error)
    }
  }, [getWebSocketUrl, onConnect, onDisconnect, onError, onMessage, reconnectAttempts, reconnectInterval])

  // Disconnect from WebSocket
  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
    }
    reconnectCountRef.current = reconnectAttempts // Prevent auto-reconnect
    if (wsRef.current) {
      wsRef.current.close()
      wsRef.current = null
    }
    setIsConnected(false)
    setConnectionState('disconnected')
  }, [reconnectAttempts])

  // Send message through WebSocket
  const sendMessage = useCallback((message) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      const data = typeof message === 'string' ? message : JSON.stringify(message)
      wsRef.current.send(data)
      return true
    }
    return false
  }, [])

  // Subscribe to a specific channel/event
  const subscribe = useCallback((channel) => {
    return sendMessage({ type: 'subscribe', channel })
  }, [sendMessage])

  // Unsubscribe from a channel/event
  const unsubscribe = useCallback((channel) => {
    return sendMessage({ type: 'unsubscribe', channel })
  }, [sendMessage])

  // Connect on mount, disconnect on unmount
  useEffect(() => {
    connect()

    return () => {
      disconnect()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return {
    isConnected,
    connectionState,
    lastMessage,
    connect,
    disconnect,
    sendMessage,
    subscribe,
    unsubscribe
  }
}

export default useWebSocket
