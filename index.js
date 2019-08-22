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
  } catch (err) {
    console.error(err)

    res.status(500)
  }
}

// Caching middleware
function cache(req, res, next) {
  const { username } = req.params

  client.get(username, (err, data) => {
    if (err) throw err
    if (!data) return next()

    res.send(setResponse(username, data))
  })
}

app.get("/repos/:username", cache, getRepos)

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`)
})
