const errorMiddleware = (error) => {
    console.error('Socket.io error:', error)
}
module.exports = errorMiddleware;