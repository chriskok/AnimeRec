import React from "react";
import { Link, withRouter } from "react-router-dom";
import {
	Card,
	Container,
	Divider,
	Dropdown,
	Grid,
	Header,
	Image,
} from "semantic-ui-react";
import { getAnime, getRecommendations } from "../actions";
import _ from "lodash";
import TextTruncate from "react-text-truncate";
import KeyboardReturnIcon from "@material-ui/icons/KeyboardReturn";
import { Button } from "@material-ui/core";

const RecommendationCard = ({ animeInfo, refAnimeId }) => {
	return (
		<Card link href={`/anime/${animeInfo.code}/reference/${refAnimeId}`}>
			<Card.Content>
				<Grid>
					<Grid.Column width={6}>
						<Image src={animeInfo.image_url} size="small" />
					</Grid.Column>
					<Grid.Column width={10}>
						<Card.Header>
							<TextTruncate
								text={_.split(animeInfo.show_titles, ";;")[0]}
								line={2}
								element="b"
								truncateText="..."
							/>
						</Card.Header>
						<br />
						<Card.Description>
							{animeInfo.premiered}
						</Card.Description>{" "}
						<br />
						<Card.Meta>
							<em>
								{_.join(
									_.map(animeInfo.genres, genre =>
										_.capitalize(genre)
									),
									", "
								)}
							</em>
						</Card.Meta>
					</Grid.Column>
				</Grid>
			</Card.Content>
		</Card>

		// <Segment padded>
		// 	<Grid>
		// 		<Grid.Column width={6}>
		// 			<Image src={animeInfo.image_url} size="tiny" />
		// 		</Grid.Column>

		// 		<Grid.Column width={10}>
		// 			<Header as="h4">
		// 				<TextTruncate
		// 					text={_.split(animeInfo.show_titles, ";;")[0]}
		// 					line={2}
		// 					element="span"
		// 					truncateText="..."
		// 				/>
		// 			</Header>

		// 			<Header as="h5">{animeInfo.premiered}</Header>

		// 			<Header as="h6">{_.join(animeInfo.genres, ", ")}</Header>
		// 		</Grid.Column>
		// 	</Grid>
		// </Segment>
	);
};

class Recommendations extends React.Component {
	state = {
		referenceAnime: null,
		recommendations: {},
		recCategory: "Genre",
	};

	componentDidMount = async () => {
		const animeId = this.props.match.params.searchId;
		const referenceAnime = await getAnime(animeId);
		const recommendations = await getRecommendations(animeId, 15);
		this.setState({ referenceAnime, recommendations });
	};

	render() {
		if (!this.state.referenceAnime) return null;

		const referenceAnimeTitle = _.split(
			this.state.referenceAnime.show_titles,
			";;"
		)[0];

		const { referenceAnime } = this.state;
		const recCategoryOptions = [
			"Genre",
			"Plot",
			"Popularity",
			"Release Date",
			"Reviews",
			"Similar Characters",
		];

		const recCategoryMapping = {
			Genre: "genre_match",
			Plot: "similar_synopsis",
			Popularity: "beloved",
			"Release Date": "hot",
			Reviews: "similarly_described",
			"Similar Characters": "characters_match",
		};

		const animeToDisplay = this.state.recommendations[
			recCategoryMapping[this.state.recCategory]
		];

		const topRecommendations = _.slice(animeToDisplay, 0, 3);

		const otherRecommendations = _.slice(
			animeToDisplay,
			3,
			_.size(animeToDisplay)
		);

		return (
			<>
				{/* Search bar */}
				<Container>
					<br />{" "}
					<Link to="/">
						<Button>
							<KeyboardReturnIcon /> Back to homepage
						</Button>
					</Link>
				</Container>
				{/* Header displaying reference anime title */}
				<Header as="h1" textAlign="center">
					Recommending anime similar to{" "}
					<Image src={referenceAnime.image_url} size="huge" />
					{referenceAnimeTitle}
				</Header>
				<Divider hidden section />

				<Container>
					{/* Dropdown to select recommendation category */}
					Recommend By{" "}
					<Dropdown
						inline
						options={recCategoryOptions.map(opt => ({
							key: opt,
							text: opt,
							value: opt,
						}))}
						value={this.state.recCategory}
						onChange={(e, { value }) =>
							this.setState({ recCategory: value })
						}
					/>
					<Header as="h2">Our Top Recommendations </Header>
					<Card.Group itemsPerRow={3}>
						{_.map(topRecommendations, anime => (
							<RecommendationCard
								key={anime.code}
								animeInfo={anime}
								refAnimeId={referenceAnime.code}
							/>
						))}
					</Card.Group>
					<Divider hidden />
					{/* <Grid columns={3} relaxed>
						{_.map(this.state.recommendations.beloved, anime => (
							<Grid.Column>
								<RecommendationCard animeInfo={anime} />
							</Grid.Column>
						))}
					</Grid> */}
					<Header as="h2">More Recommendations </Header>
					<Card.Group itemsPerRow={3}>
						{_.map(otherRecommendations, anime => (
							<RecommendationCard
								animeInfo={anime}
								key={anime.code}
								refAnimeId={referenceAnime.code}
							/>
						))}
					</Card.Group>
				</Container>
			</>
		);
	}
}

export default withRouter(Recommendations);
