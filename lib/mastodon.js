const axios = require('axios');

module.exports = {
  baseUrl: `https://${process.env.MASTODON_HOST}/api/v1`,
  async request(url, method) {
    const headers = {
      Authorization: `Bearer ${process.env.MASTODON_ACCESS_TOKEN}`,
    };
    const requestOptions = {
      url,
      method,
      headers,
    };

    return axios.request(requestOptions);
  },
  async followers(useLink, followerList) {
    const returnFollowerList = followerList;
    const maxLength = 40;
    const response = await this.request(useLink || `${this.baseUrl}/accounts/${process.env.MASTODON_ACCOUNT_ID}/followers?limit=${maxLength}`, 'get');
    response?.data?.forEach((user) => {
      returnFollowerList[user.id] = user.acct;
    });

    const linkRegex = /<(.*?)>/;
    const links = response?.headers?.link?.split(',');
    if (parseInt(response?.headers?.['x-ratelimit-remaining'] || 0, 10) <= 0) {
      throw Error('Rate limit exceeded, try again soon');
    }
    const nextLink = links?.find((link) => link.includes('rel="next"'))?.match(linkRegex);
    return nextLink?.[1] ? this.followers(nextLink?.[1], returnFollowerList) : returnFollowerList;
  },
};
