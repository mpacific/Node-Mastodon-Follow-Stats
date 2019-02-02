require('dotenv').config()
const Twitter = require('./lib/twitter')
const _ = require('lodash')
const Moment = require('moment')
const Promise = require('bluebird')
const fs = require('fs')

console.log(`Started report at: ${new Moment().format()}`)

Twitter.followers(null, {}).then((unorderedFollowers) => {
  let fileFollowers = fs.readFileSync('./json/followers.json')
  if (fileFollowers) {
    fileFollowers = JSON.parse(fileFollowers)
  }

  let followers = {}
  _.forEach(Object.keys(unorderedFollowers).sort(), (key) => {
    followers[key] = unorderedFollowers[key]
  })

  if (Object.keys(followers).length > 0) {
    fs.writeFileSync('./json/followers.json', JSON.stringify(followers))
  }

  Twitter.following(null, {}).then((unorderedFollowing) => {
    let fileFollowing = fs.readFileSync('./json/following.json')
    if (fileFollowing) {
      fileFollowing = JSON.parse(fileFollowing)
    }

    let following = {}
    _.forEach(Object.keys(unorderedFollowing).sort(), (key) => {
      following[key] = unorderedFollowing[key]
    })

    if (Object.keys(following).length > 0) {
      fs.writeFileSync('./json/following.json', JSON.stringify(following))
    }

    console.log(`Ended report at: ${new Moment().format()}`)
  }).catch((error) => {
    console.error(`Following error: ${error}`)
    console.log(`Ended report at: ${new Moment().format()}`)
  })
}).catch((error) => {
  console.error(`Follower error: ${error}`)
  console.log(`Ended report at: ${new Moment().format()}`)
})
