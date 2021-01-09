# Rekku: Third Cycle Pitch

## Problem
We have to get the API ready for integration with randomanime.org. The API is more trustworthy now with "number of users who recommended X for Y" and textual recommendations made by users. However, we're not fully differentiated with as a recommendation system yet and are hoping to add things like "similar characters" and "similar detailed tags".

## Solution
### The backend 
- Scrape data on detailed tags (tags beyond just action, comedy, etc.; e.g. 1960s, Androids, ...)
  - https://anidb.net/tag (tried scraping from aniDB previously but they have strict guidelines, either work around those or find other sources)
  - https://www.anime-planet.com/anime/tags
- Provide character similarity metrics in our knowledge graphs (measure the similarity either in tags or description similarity with NLP)
- Produce recommendations for differentiation (create more rows based on characters or detailed anime tags)

### The frontend
- Take a look at his current set up for anime-like recommendations, think about what we'll want to keep or change
  - https://www.randomanime.org/custom-list/?l=70b2432a&view=single&lang=any
- Edit our current system to make the idea presentable to Kyle (show him some example recommendations)
  - Keep in mind what it would take for integration on his existing PHP stuff

## Rabbit Holes
Details about the solution worth calling out to avoid future problems:
- Will it be possible to scrape from MAL's recommendations with the Jikan API that we've used - will it take too long to use typical webscraping tools like beautifulsoup?
- Will we be allowed to take the information gathered from reddit upvotes? We may need to ask for admin permission before grabbing that data. If allowed, scraping from reddit is easy with python!
- Where do we get "where to watch" data? I haven't found an easy solution personally but I don't have the internet rn to really search for one... My guess is there could be an API for each individual platform (crunchyroll, netflix, etc.)
- Might need a complete redesign and code from the ground up for the frontend. E.g. carousel rows were difficult to do with dynamic data from the last cycle (but we can cut down the scope for it if necessary). Plus it could make it more professional in general.


## No-Gos
Things we want to conciously and actively avoid this cycle (but they stand as good ideas going into future ones):
- Selection of multiple animes for more personalization
- Filtering by genres or any specific tags
- Allow users to select and avoid previously watched anime from being recommended
- Computer Vision techniques for poster or artstyle similarity to feed into existing algorithms
- Adding more rows with different algorithms (potentially collaborative filtering in the future)
- Adding more randomness to recommendations

## Credits
- N/A