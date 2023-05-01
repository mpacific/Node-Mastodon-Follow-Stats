# Node Mastodon Follow Stats
A script to run at a scheduled interval (or on demand) to retrieve new/removed follows and followers. This is based off of the work of [Node-Twitter-Follow-Stats](https://github.com/mpacific/Node-Twitter-Follow-Stats)

## Requirements
* Node 18
* If using the cron script:
  * Bash

## Installation
* `npm install`
* Copy `.envSample` to `.env` and update the values appropriately. You can get many of these values by creating a Mastodon app at `https://[instance URL]/settings/applications`. The only permission you need is `read`.
* Ensure the `json` directory has the correct write permissions.
* If using the cron script:
  * `chmod +x run.sh`
  * Ensure the `log` directory has the correct write permissions

## Running
* Single use: `npm start`
* If using the cron script:
  * `/path/to/this/directory/run.sh`
  * I suggest spacing it out by at least every 5 minutes (but really, every hour should suffice, if not more, don't get *that* concerned about who's following you 😀)

## TODO
* Email options instead of just a console.log
* Caching or adding a wait() to avoid rate limit issues. This usually only applies when having > 12,000 followers (lucky you!) if you're spacing out your script runtime enough
* Tests
