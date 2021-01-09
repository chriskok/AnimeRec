# Rekku: Third Cycle Pitch

## Problem
We have to get the API ready for integration with randomanime.org. The API is more trustworthy now with "number of users who recommended X for Y" and textual recommendations made by users. However, we're not fully differentiated with as a recommendation system yet and are hoping to add things like "similar characters" and "similar detailed tags".

## Solution
### The backend 
- Scrape data on detailed tags (tags beyond just action, comedy, etc.; e.g. 1960s, Androids, ...)
  - https://anidb.net/tag (tried scraping from aniDB previously but they have strict guidelines, either work around those or find other sources)
  - https://www.anime-planet.com/anime/tags
- Provide character similarity metrics in our knowledge graphs (measure the similarity either in tags or description similarity with NLP)
- Improve existing algorithms using the validation pipeline
- Serve the additional recommendation rows/types through the API for differentiation (based on characters or detailed anime tags)
- Create a EC2 instance that can handle both API and REACT code, deploy the running app on said instance

### The frontend
- Take a look at his current set up for anime-like recommendations, think about what we'll want to keep or change
  - https://www.randomanime.org/custom-list/?l=70b2432a&view=single&lang=any
- Edit our current system to make the idea presentable to Kyle (show him some example recommendations)
  - Keep in mind what it would take for integration on his existing PHP stuff

## Rabbit Holes
Details about the solution worth calling out to avoid future problems:
- We'll have to validate our assumptions on whether character or detailed anime tag similarity is good, might take a while to get it right
- Scraping detailed anime tags might prove difficult depending on where we can get them. If we do get them do we have to go through each and match them by name? (since it's not likely to follow MAL codes)
- After showing Kyle our prototype it might be the case that it's difficult to integrate with our existing REACT setup
- We'll have to dig further into what we and Kyle really want to keep or change with our existing setups

## No-Gos
Things we want to conciously and actively avoid this cycle:
- Producing more than 2 additional rows/types of recommendations
- Changing too much of our prototype to fit Kyle's existing system (we want ours only as a POC to let ideas flow; can leave the rest to imagination)

## Credits
- N/A