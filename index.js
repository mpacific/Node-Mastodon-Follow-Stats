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

    const unorderedFollowers = await Mastodon.followers(null, {});
    let fileFollowers = fs.readFileSync('./json/followers.json');
    if (fileFollowers) {
      fileFollowers = JSON.parse(fileFollowers);
    }

    const followers = {};
    _.forEach(Object.keys(unorderedFollowers).sort(), (key) => {
      followers[key] = unorderedFollowers[key];
    });

    if (Object.keys(followers).length > 0) {
      fs.writeFileSync('./json/followers.json', JSON.stringify(followers));
    }

    const newFollowers = []; const
      newUnfollowers = [];
    _.forEach(followers, (followerHandle, followerId) => {
      if (!fileFollowers[followerId]) {
        newFollowers.push(followerHandle);
      }
    });
    _.forEach(fileFollowers, (followerHandle, followerId) => {
      if (!followers[followerId]) {
        newUnfollowers.push(followerHandle);
      }
    });

    console.log('New Followers\n', newFollowers.join('\n'));
    console.log('\n\n');
    console.log('New Unfollowers\n', newUnfollowers.join('\n'));
    console.log('\n\n');
  } catch (error) {
    console.error(`Follower error: ${error}`);
  }
  console.log(`Ended report at: ${new Moment().format()}`);
})();
