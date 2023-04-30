const Moment = require('moment');

module.exports = {
  baseUrl: 'https://api.twitter.com/1.1/',
  sign(url, method, params) {
    const signatureBase = `${method.toUpperCase()}&${encodeURIComponent(url)}&${encodeURIComponent(params)}`;
    const signingKey = `${encodeURIComponent(process.env.TWITTER_CONSUMER_SECRET)}&${encodeURIComponent(process.env.TWITTER_ACCESS_SECRET)}`;

    return CryptoJs.enc.Base64.stringify(CryptoJs.HmacSHA1(signatureBase, signingKey));
  },
  formatParams(params) {
    const formattedParams = [];

    Object.keys(params).sort().forEach((key) => {
      const value = params[key];
      formattedParams.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
    });

    return formattedParams.join('&');
  },
  request(uri, method, params) {
    const url = `${this.baseUrl}${uri}.json`;
    const nonce = RandomString.generate();
    const timestamp = new Moment().unix();
    const oAuthParams = {
      include_entities: true,
      oauth_consumer_key: process.env.TWITTER_CONSUMER_KEY,
      oauth_nonce: nonce,
      oauth_signature_method: 'HMAC-SHA1',
      oauth_timestamp: timestamp,
      oauth_token: process.env.TWITTER_ACCESS_TOKEN,
      oauth_version: '1.0',
    };
    const signature = this.sign(url, method, this.formatParams({ ...params, ...oAuthParams }));

    const oAuthHeaders = [
      `OAuth oauth_consumer_key="${process.env.TWITTER_CONSUMER_KEY}"`,
      `oauth_nonce="${nonce}"`,
      `oauth_signature="${encodeURIComponent(signature)}"`,
      'oauth_signature_method="HMAC-SHA1"',
      `oauth_timestamp="${timestamp}"`,
      `oauth_token="${process.env.TWITTER_ACCESS_TOKEN}"`,
      'oauth_version="1.0"',
    ];

    const requestOptions = {
      url,
      method,
      qs: { ...params, ...oAuthParams },
      headers: {
        Authorization: oAuthHeaders.join(', '),
      },
      json: true,
    };

    return Request(requestOptions);
  },
  followers(cursor, followerList) {
    const maxLength = 200;
    const params = {
      screen_name: process.env.TWITTER_USERNAME,
      count: maxLength,
    };
    if (cursor) {
      params.cursor = cursor;
    }

    return this.request('followers/list', 'GET', params).then((response) => {
      if (response && response.users.length > 1) {
        _.forEach(response.users, (user) => {
          followerList[user.id_str] = user.screen_name;
        });

        if (response.next_cursor_str && response.users.length >= maxLength) {
          return this.followers(response.next_cursor_str, followerList);
        }
      }

      return followerList;
    });
  },
  following(cursor, followingList) {
    const maxLength = 200;
    const params = {
      screen_name: process.env.TWITTER_USERNAME,
      count: maxLength,
    };
    if (cursor) {
      params.cursor = cursor;
    }

    return this.request('friends/list', 'GET', params).then((response) => {
      if (response && response.users.length > 1) {
        _.forEach(response.users, (user) => {
          followingList[user.id_str] = user.screen_name;
        });

        if (response.next_cursor_str && response.users.length >= maxLength) {
          return this.following(response.next_cursor_str, followingList);
        }
      }

      return followingList;
    });
  },
};
