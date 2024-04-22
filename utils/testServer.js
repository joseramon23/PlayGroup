import express from 'express'

export const testServer = (router) => {
    const app = express()
    app.use(express.json())
    router(app)
    return app
}