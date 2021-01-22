import {
	Button,
	Container,
	Grid,
	TextField,
	Typography,
	makeStyles,
	withStyles,
} from "@material-ui/core";
import Autocomplete, {
	createFilterOptions,
} from "@material-ui/lab/Autocomplete";
import React from "react";
import _ from "lodash";
import { getNames, getRecommendations } from "../actions";
import RecommendationRow from "../components/RecommendationRow";
import { Button as SEMButton, Item, Segment } from "semantic-ui-react";
import matchSorter from "match-sorter";

const styles = theme => ({
	icon: {
		marginRight: theme.spacing(2),
	},
	heroContent: {
		backgroundColor: theme.palette.background.paper,
		padding: theme.spacing(8, 0, 6),
	},
	heroButtons: {
		marginTop: theme.spacing(4),
	},
	cardGrid: {
		paddingTop: theme.spacing(8),
		paddingBottom: theme.spacing(8),
	},
	card: {
		height: "100%",
		display: "flex",
		flexDirection: "column",
	},
	cardMedia: {
		paddingTop: "56.25%", // 16:9
	},
	cardContent: {
		flexGrow: 1,
	},
	footer: {
		backgroundColor: theme.palette.background.paper,
		padding: theme.spacing(6),
	},
});

class Home extends React.Component {
	state = {
		inputValue: "",
		recommendations: null,
		currentSearchTitle: null,
		animeList: [],
		selectedAnime: null,
	};

	componentDidMount = async () => {
		const animeList = await getNames();
		this.setState({ animeList });
	};

	onInputFieldChange = value => {
		this.setState({ inputValue: value });
	};

	callGetNames = async () => {
		const names = await getNames();
		console.log(names);
	};

	recommend = async () => {
		// const recommendations = await getRecommendations(
		// 	this.state.selectedAnime.anime_id
		// );
		// this.setState({
		// 	recommendations,
		// 	currentSearchTitle: this.state.selectedAnime.display_title,
		// });
		this.props.history.push(
			`/recommend/${this.state.selectedAnime.anime_id}`
		);
	};

	render() {
		const { classes } = this.props;
		const { recommendations, animeList } = this.state;

		const filterOptions = createFilterOptions({
			stringify: option =>
				_.join(_.concat(option.display_title, option.alternate_titles)),
			limit: 15,
		});

		return (
			<React.Fragment>
				<div className={classes.heroContent}>
					{/* <Segment
					textAlign="center"
					style={{ minHeight: 700, padding: "1em 0em" }}
					vertical
					inverted
				> */}
					<Container maxWidth="md">
						{/* <Typography
                            component="h1"
                            variant="h2"
                            align="center"
                            color="textPrimary"
                            gutterBottom
                        >
                            Rekku
                        </Typography> */}

						<Typography
							variant="h5"
							align="center"
							color="textSecondary"
							paragraph
						>
							Recommending what you will love.
						</Typography>

						{/* <TextField
							label='Search'
							variant='outlined'
							fullWidth
							value={this.state.inputValue}
							onChange={(e) => this.onInputFieldChange(e.target.value)}
						/> */}

						<Autocomplete
							id="search-input"
							options={animeList.search_info || []}
							getOptionLabel={option => option.display_title}
							renderInput={params => (
								<TextField
									{...params}
									label="Enter anime title"
									variant="outlined"
								/>
							)}
							onInputChange={(e, value) =>
								this.onInputFieldChange(value)
							}
							onChange={(e, value) =>
								this.setState({
									selectedAnime: value,
									inputValue: value
										? value.display_title
										: "",
								})
							}
							inputValue={this.state.inputValue}
							filterOptions={filterOptions}
							renderOption={option => (
								<Item.Group>
									<Item>
										<Item.Image
											size="tiny"
											src={option.image_url}
										/>
										<Item.Content verticalAlign="bottom">
											<Item.Header>
												{option.display_title}
											</Item.Header>
											<Item.Meta>
												{option.release_date}
											</Item.Meta>
											<Item.Meta>
												{" "}
												{option.type}
											</Item.Meta>

											<Item.Extra>
												<em>
													{_.join(
														_.map(
															option.genres,
															genre =>
																_.capitalize(
																	genre
																)
														),
														", "
													)}
												</em>
											</Item.Extra>
											<br />
										</Item.Content>
									</Item>
								</Item.Group>
							)}
						/>

						<div className={classes.heroButtons}>
							<Grid container spacing={2} justify="center">
								<Grid item>
									<Button
										variant="contained"
										color="primary"
										disabled={!this.state.selectedAnime}
										onClick={this.recommend}
									>
										Recommend!
									</Button>
								</Grid>
								{/* <Grid item>
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                    >
                                        Secondary action
                                    </Button>
                                </Grid> */}
							</Grid>
						</div>
					</Container>
				</div>
				{/* </Segment> */}

				{recommendations && (
					<>
						<Container maxWidth="xl">
							<Typography
								variant="h4"
								align="center"
								gutterBottom
							>
								Showing anime similar to{" "}
								<b>{this.state.currentSearchTitle}</b>
							</Typography>
							<br />

							<br />

							<RecommendationRow
								sectionTitle="Similar Reviews"
								sectionDescription="Matches with anime that have similar review descriptions"
								data={recommendations.similarly_described}
							/>

							<RecommendationRow
								sectionTitle="Newest and Most Similar"
								sectionDescription="Matches with recently released anime that have similar review descriptions"
								data={this.state.recommendations.hot}
							/>

							<RecommendationRow
								sectionTitle="Popular and Most Similar"
								sectionDescription="Matches with the highest scoring anime on MyAnimeList that have similar review descriptions"
								data={this.state.recommendations.beloved}
							/>

							<RecommendationRow
								sectionTitle="Similar Plot"
								sectionDescription="Matches with anime that have similar plot, storyline or theme(s)"
								data={
									this.state.recommendations.similar_synopsis
								}
							/>
						</Container>
					</>
				)}
			</React.Fragment>
		);
	}
}

export default withStyles(styles)(Home);
