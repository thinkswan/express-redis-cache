const express = require("express")
const fetch = require("node-fetch")
const redis = require("redis")

const PORT = process.env.port || 5000
const REDIS_PORT = process.env.redis_port || 6379

const client = redis.createClient(REDIS_PORT)
const app = express()

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`)
})
