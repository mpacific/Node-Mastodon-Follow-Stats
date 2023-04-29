# Node Mastodon Follow Stats
A script to run at a scheduled interval (or on demand) to retrieve new/removed follows and followers. This is based off of the work of [Node-Twitter-Follow-Stats](https://github.com/mpacific/Node-Twitter-Follow-Stats)

## Installation
- `npm install`
- Copy `.envSample` to `.env` and update the values appropriately. You can get many of these values by creating a Mastodon app at `https://\[instance URL]/settings/applications`. The only permission you need is `read:follows`.
- Create the `json` directory and within that folder, create `followers.json`, `following.json`, and `reciprocated.json` with proper read + write permissions and begin with the file content of `{}`

## Running
- `npm start`

## TODO
- Email options instead of just a console.log
- Caching to avoid rate limit issues (will likely require a change to the JSON structure)
- Tests
- Fleshing out this README
