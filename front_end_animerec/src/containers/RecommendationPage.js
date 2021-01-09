import { Button, Container } from "@material-ui/core";
import KeyboardReturnIcon from "@material-ui/icons/KeyboardReturn";
import React, { useState, useEffect } from "react";
import { getAnime, getUserReview } from "../actions";
import { Link, useParams } from "react-router-dom";
import {
	Segment,
	Grid,
	Image,
	Header,
	Divider,
	Label,
} from "semantic-ui-react";
import _ from "lodash";

const RecommendationPage = () => {
	const { animeId, referenceId } = useParams();
	const [anime, setAnime] = useState(null);
	const [referenceAnime, setReferenceAnime] = useState(null);
	const [malUserReview, setMalUserReview] = useState(null);

	useEffect(() => {
		async function fetchAnimeData() {
			const anime = await getAnime(animeId);
			setAnime(anime);
			if (referenceId) {
				const referenceAnime = await getAnime(referenceId);
				setReferenceAnime(referenceAnime);
				const review = await getUserReview(animeId, referenceId);
				setMalUserReview(review);
				console.log(review);
			}
		}
		fetchAnimeData();
	}, [animeId, referenceId]);

	if (!anime) return null;

	const title = _.split(anime.show_titles, ";;")[0];

	return (
		<>
			<Container>
				<br />
				<Link to="/">
					<Button>
						<KeyboardReturnIcon /> Back to homepage
					</Button>
				</Link>
				<Segment padded="very">
					<Grid>
						<Grid.Column width={4}>
							<Image src={anime.image_url} />
						</Grid.Column>
						<Grid.Column width={12}>
							<Header as="h1">
								{title}
								<Header.Subheader>
									{anime.premiered}
								</Header.Subheader>
								<Header.Subheader>
									<b>Status:</b> N/A
								</Header.Subheader>
							</Header>

							<Label image basic>
								<Image
									src="https://image.myanimelist.net/ui/OK6W_koKDTOqqqLDbIoPAiC8a86sHufn_jOI-JGtoCQ"
									size="tiny"
								/>
								{anime.score} / 10
							</Label>

							<Divider hidden />

							{referenceAnime && (
								<>
									<b>
										Similar to{" "}
										{
											_.split(
												referenceAnime.show_titles,
												";;"
											)[0]
										}{" "}
										because it is
									</b>
									<br />
									{_.join(
										_.map(
											_.intersection(
												referenceAnime.genres,
												anime.genres
											),
											genre => _.capitalize(genre)
										),
										", "
									)}

									<Divider hidden />
									{malUserReview && malUserReview.text && (
										<>
											<b>
												Recommended by user from
												MyAnimeList
											</b>
											<p>
												<em>"{malUserReview.text}"</em>
											</p>
										</>
									)}
								</>
							)}

							<b>Genres: </b>
							{_.join(
								_.map(anime.genres, genre =>
									_.capitalize(genre)
								),
								", "
							)}

							<Divider hidden />
							<Link to={`/recommend/${animeId}`}>
								<Button variant="contained" color="primary">
									Recommend more like this!
								</Button>
							</Link>
						</Grid.Column>
					</Grid>

					<Divider section />

					<Header as="h4">Synopsis</Header>
					{anime.synopsis}
				</Segment>
			</Container>
		</>
	);
};

export default RecommendationPage;
