const Request = require('request-promise')
const RandomString = require('randomstring')
const Moment = require('moment')
const CryptoJs = require('crypto-js')
const _ = require('lodash')

module.exports = {
  baseUrl: 'https://api.twitter.com/1.1/',
  sign (url, method, params) {
    let signatureBase = `${method.toUpperCase()}&${encodeURIComponent(url)}&${encodeURIComponent(params)}`
    let signingKey = `${encodeURIComponent(process.env.TWITTER_CONSUMER_SECRET)}&${encodeURIComponent(process.env.TWITTER_ACCESS_SECRET)}`

    return CryptoJs.enc.Base64.stringify(CryptoJs.HmacSHA1(signatureBase, signingKey))
  },
  formatParams (params) {
    let formattedParams = []

    Object.keys(params).sort().forEach(function (key) {
      let value = params[key]
      formattedParams.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    })

    return formattedParams.join('&')
  },
  request (uri, method, params) {
    let url = `${this.baseUrl}${uri}.json`
    let nonce = RandomString.generate()
    let timestamp = new Moment().unix()
    let oAuthParams = {
      include_entities: true,
      oauth_consumer_key: process.env.TWITTER_CONSUMER_KEY,
      oauth_nonce: nonce,
      oauth_signature_method: 'HMAC-SHA1',
      oauth_timestamp: timestamp,
      oauth_token: process.env.TWITTER_ACCESS_TOKEN,
      oauth_version: '1.0'
    }
    let signature = this.sign(url, method, this.formatParams(Object.assign({}, params, oAuthParams)))

    let oAuthHeaders = [
      `OAuth oauth_consumer_key="${process.env.TWITTER_CONSUMER_KEY}"`,
      `oauth_nonce="${nonce}"`,
      `oauth_signature="${encodeURIComponent(signature)}"`,
      `oauth_signature_method="HMAC-SHA1"`,
      `oauth_timestamp="${timestamp}"`,
      `oauth_token="${process.env.TWITTER_ACCESS_TOKEN}"`,
      `oauth_version="1.0"`
    ]

    let requestOptions = {
      url: url,
      method: method,
      qs: Object.assign({}, params, oAuthParams),
      headers: {
        Authorization: oAuthHeaders.join(', ')
      },
      json: true
    }

    return Request(requestOptions)
  },
  followers (cursor, followerList) {
    let maxLength = 200
    let params = {
      screen_name: process.env.TWITTER_USERNAME,
      count: maxLength
    }
    if (cursor) {
      params.cursor = cursor
    }

    return this.request('followers/list', 'GET', params).then((response) => {
      if (response && response.users.length > 1) {
          _.forEach(response.users, function (user) {
            followerList[user.id_str] = user.screen_name
          })

        if (response.next_cursor_str && response.users.length >= maxLength) {
          return this.followers(response.next_cursor_str, followerList)
        }
      }

      return followerList
    })
  },
  following (cursor, followingList) {
    let maxLength = 200
    let params = {
      screen_name: process.env.TWITTER_USERNAME,
      count: maxLength
    }
    if (cursor) {
      params.cursor = cursor
    }

    return this.request('friends/list', 'GET', params).then((response) => {
      if (response && response.users.length > 1) {
          _.forEach(response.users, function (user) {
            followingList[user.id_str] = user.screen_name
          })

        if (response.next_cursor_str && response.users.length >= maxLength) {
          return this.following(response.next_cursor_str, followingList)
        }
      }

      return followingList
    })
  }
}
