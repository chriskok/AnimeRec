function fetchJson(url, kwds) {
	return fetch(url, {
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
		},
		credentials: "include",
		...kwds,
	}).then(res => res.json());
}

export function getNames() {
	return fetchJson(`/api/v1/search_info`);
}

export function getRecommendations(animeId, quantity = 5) {
	return fetchJson(
		`/api/v1/recommendations?anime_code=${animeId}&n_recommendations=${quantity}`
	);
}

export function getAnime(animeId) {
	return fetchJson(`/api/v1/anime?anime_code=${animeId}`);
}

export function getUserReview(animeId, referenceId) {
	return fetchJson(
		`/api/v1/user_recommendations?search_anime=${animeId}&recommended_anime=${referenceId}`
	);
}
