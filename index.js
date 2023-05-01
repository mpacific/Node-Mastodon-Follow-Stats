require('dotenv').config();
const Moment = require('moment');
const fs = require('fs');
const Mastodon = require('./lib/mastodon');

const packageJSON = require('./package.json');
require('please-upgrade-node')(packageJSON, {
  exitCode: 0,
});

(async () => {
  try {
    console.log(`Started report at: ${new Moment().format()}`);

    const followersJSONPath = './json/followers.json';

    let fileFollowers = fs.existsSync(followersJSONPath) ? fs.readFileSync(followersJSONPath) : '{}';
    if (fileFollowers) {
      fileFollowers = JSON.parse(fileFollowers);
    }

    const unorderedFollowers = await Mastodon.followers(null, {});

    const followers = {};
    Object.keys(unorderedFollowers).sort().forEach((key) => {
      followers[key] = unorderedFollowers[key];
    });

    if (Object.keys(followers).length > 0) {
      fs.writeFileSync(followersJSONPath, JSON.stringify(followers));
    }

    const newFollowers = [];
    const newUnfollowers = [];
    Object.keys(followers).forEach((followerId) => {
      const followerHandle = followers[followerId];
      if (!fileFollowers[followerId]) {
        newFollowers.push(followerHandle);
      }
    });
    Object.keys(fileFollowers).forEach((followerId) => {
      const followerHandle = fileFollowers[followerId];
      if (!followers[followerId]) {
        newUnfollowers.push(followerHandle);
      }
    });

    console.log(`New Followers\n${newFollowers.join('\n')}\n\n`);
    console.log(`New Unfollowers\n${newUnfollowers.join('\n')}\n\n`);
  } catch (error) {
    console.log(`Follower error: ${error}`);
  }
  console.log(`Ended report at: ${new Moment().format()}`);
})();
