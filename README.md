## This project has been abandoned due to Twitter's new API price structure. A new Mastodon-based project is upcoming.

# Node Twitter Follow Stats
A script to run at a scheduled interval to retrieve new/removed follows and followers

## Installation
- `npm install`
- Copy `.envSample` to `.env` and update the values appropriately. You can get many of these values by creating a Twitter app at https://apps.twitter.com/.
- Create the `json` directory and within that folder, create `followers.json` with proper read + write permissions and begin with the file content of `{}`

## Running
- `node index.js`
- You may want to add this to a cron job to receive regular emails

## TODO
- Restoring following stats
- Email options instead of just a console.log
- Caching to avoid rate limit issues (will likely require a change to the JSON structure)
- Tests
- Fleshing out this README
