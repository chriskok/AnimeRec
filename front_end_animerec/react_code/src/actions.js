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

const HOSTNAME = "http://127.0.0.1:5000";

export function getNames() {
	return fetchJson("http://127.0.0.1:5000/get-names");
}

export function getRecommendations(title) {
	return fetchJson(`http://127.0.0.1:5000/get-recommendations/${title}`, {
		method: "POST",
	});
}
