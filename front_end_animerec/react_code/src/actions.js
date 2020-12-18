function fetchJson(url, kwds) {
	return fetch(url, {
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
		},
		credentials: "include",
		...kwds,
	}).then((res) => res.json());
}

export function getNames() {
	return fetchJson(`/api/v1/get_names`);
}

export function getRecommendations(animeId) {
	return fetchJson(`/api/v1/get_recommendations?anime_code=${animeId}`);
}

export function getAnime(animeId) {
	return fetchJson(`/api/v1/get_anime?anime_code=${animeId}`);
}
