const express = require("express")
const fetch = require("node-fetch")
const redis = require("redis")

const PORT = process.env.port || 5000
const REDIS_PORT = process.env.redis_port || 6379

const client = redis.createClient(REDIS_PORT)
const app = express()

function setResponse(username, repos) {
  return `<h2>${username} has ${repos} public repos on GitHub<h2>`
}

async function getRepos(req, res, next) {
  try {
    const { username } = req.params

    console.log(`Fetching GitHub data for ${username}...`)

    const response = await fetch(`https://api.github.com/users/${username}`)
    const data = await response.json()
    const repos = data.public_repos

    console.log(`Found ${repos} public repos for ${username}`)

    // Cache data in Redis
    client.setex(username, 3600, repos)

    res.send(setResponse(username, repos))
  } catch (error) {
    console.error(error)

    res.status(500)
  }
}

app.get("/repos/:username", getRepos)

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`)
})
