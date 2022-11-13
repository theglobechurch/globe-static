# Globe Website

[![Netlify Status](https://api.netlify.com/api/v1/badges/efe4b1e3-abc3-4d40-8c3c-ed27fd8365c0/deploy-status)](https://app.netlify.com/sites/tgc-static/deploys)

## In the box

- Eleventy
- Tailwind

## Data sources

- Wordpress CMS for page content
- iCal feed for calendar events and pages

See `_src/_data` for specific imports

## Dev setup

```bash
# Make sure we're all running the same Node version
nvm use

# Install packages
npm install

# Get your own env file (see below for details)
cp .env.example .env

# Let's get goings
npm run dev
```

### Environment

- `API_BASE` - Base URL for Wordpress API
- `EVENTS_ICAL_FEED` - iCal feed for where we'll be pulling all the events from
- `ENABLE_11TY_CACHE` - When enabled (`TRUE`) 11ty will pull in data just once and then store it, this will make the site build a bit quicker. Don't enable in production.

## To Do

### Critical before launch

- Add the RSS feed for the blog
- Add Podcast feed for the sermons
- Bring across Analytics
- Make sure the URL mapping is correct
- Double check timings for events (might be off by one errors)

### Post launch

- Sort out microdata on events, etc
