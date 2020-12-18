import {
	Button,
	Container,
	Divider,
	Grid,
	Paper,
	Typography,
} from "@material-ui/core";
import React, { useState, useEffect } from "react";
import { getAnime } from "../actions";
import { Link, useParams } from "react-router-dom";

const RecommendationPage = () => {
	const [anime, setAnime] = useState(null);
	const { animeId } = useParams();

	useEffect(() => {
		async function fetchAnimeData() {
			const anime = await getAnime(animeId);
			setAnime(anime);
		}
		fetchAnimeData();
	}, [animeId]);

	if (!anime) return null;

	return (
		<Container>
			<Link to='/'>
				<Button>Back to homepage</Button>
			</Link>
			<Paper>
				<Grid container spacing={3}>
					<Grid item xs={3}>
						<img src={anime.image_url} />
					</Grid>
					<Grid item xs={9}>
						<Typography variant='h4' component='h4'>
							{anime.show_titles}
						</Typography>
						<Typography variant='subtitle1' component='h5'>
							{anime.premiered}
							<br />
							<b>Status: </b> <em>(Data not collected)</em>
							<br />
							<br />
							MAL Rating: {anime.score}
							<br />
							<br />
							<b>Genres: </b>
							{anime.genres}
							<br />
							<br />
							<b>Studio: </b>
							<em>(Data not collected)</em>
						</Typography>
						<br />
						<Button variant='contained' color='primary' size='large'>
							Rekku It!
						</Button>
					</Grid>

					<Grid container item xs={12}>
						<Divider />
						<br />
						<Typography variant='h6' component='h2'>
							<b>Synopsis</b>
						</Typography>
						<br />
						<Typography variant='body1' component='span'>
							{anime.synopsis}
						</Typography>
					</Grid>
				</Grid>
			</Paper>
		</Container>
	);
};

export default RecommendationPage;
