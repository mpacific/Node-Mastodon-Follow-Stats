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

    let newFollows = [], newUnfollows = [], newFollowers = [], newUnfollowers = []
    _.forEach(following, (followerHandle, followerId) => {
      if (!fileFollowing[followerId]) {
        newFollows.push(followerHandle)
      }
    })
    _.forEach(fileFollowing, (followerHandle, followerId) => {
      if (!following[followerId]) {
        newUnfollows.push(followerHandle)
      }
    })
    _.forEach(followers, (followerHandle, followerId) => {
      if (!fileFollowers[followerId]) {
        newFollowers.push(followerHandle)
      }
    })
    _.forEach(fileFollowers, (followerHandle, followerId) => {
      if (!newUnfollowers[followerId]) {
        newUnfollows.push(followerHandle)
      }
    })

    console.log("New Following", newFollows.join("\n"))
    console.log("\n\n")
    console.log("New Unfollowing", newUnfollows.join("\n"))
    console.log("\n\n")
    console.log("New Followers", newFollowers.join("\n"))
    console.log("\n\n")
    console.log("New Unfollowers", newUnfollowers.join("\n"))
    console.log("\n\n")

    console.log(`Ended report at: ${new Moment().format()}`)
  }).catch((error) => {
    console.error(`Following error: ${error}`)
    console.log(`Ended report at: ${new Moment().format()}`)
  })
}).catch((error) => {
  console.error(`Follower error: ${error}`)
  console.log(`Ended report at: ${new Moment().format()}`)
})
