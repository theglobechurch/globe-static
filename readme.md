# Globe Website

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

### Post launch
