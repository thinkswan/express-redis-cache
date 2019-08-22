const express = require("express")
const fetch = require("node-fetch")
const redis = require("redis")

const PORT = process.env.port || 5000
const REDIS_PORT = process.env.redis_port || 6379

const client = redis.createClient(REDIS_PORT)
const app = express()

async function getRepos(req, res, next) {
  try {
    const { username } = req.params

    console.log(`Fetching data for ${username}`)

    const response = await fetch(`https://api.github.com/users/${username}`)
    const data = await response.json()

    res.send(data)
  } catch (error) {
    console.error(error)

    res.status(500)
  }
}

app.get("/repos/:username", getRepos)

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`)
})
