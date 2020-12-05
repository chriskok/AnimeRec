import {
	AppBar,
	Button,
	Container,
	CssBaseline,
	Grid,
	TextField,
	Toolbar,
	Typography,
	makeStyles,
	withStyles,
} from "@material-ui/core";
import React from "react";
import { getNames, getRecommendations } from "../actions";
import RecommendationRow from "../components/RecommendationRow";

const styles = (theme) => ({
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
	};

	onInputFieldChange = (value) => {
		this.setState({ inputValue: value });
	};

	callGetNames = async () => {
		const names = await getNames();
		console.log(names);
	};

	recommend = async () => {
		const recommendations = await getRecommendations(this.state.inputValue);
		this.setState({
			recommendations,
			currentSearchTitle: this.state.inputValue,
		});
	};

	render() {
		const { classes } = this.props;
		const { recommendations } = this.state;

		return (
			<React.Fragment>
				<CssBaseline />

				<AppBar position='relative'>
					<Toolbar>
						<Typography variant='h6' color='inherit' noWrap>
							Chronic Coder Anime Recommendations
						</Typography>{" "}
					</Toolbar>
				</AppBar>

				<div className={classes.heroContent}>
					<Container maxWidth='md'>
						<Typography
							component='h1'
							variant='h2'
							align='center'
							color='textPrimary'
							gutterBottom
						>
							Anime Recommendation
						</Typography>

						<Typography
							variant='h5'
							align='center'
							color='textSecondary'
							paragraph
						>
							Enter the title of an anime that you enjoy - we'll recommend
							titles to you!
						</Typography>

						<TextField
							label='Search'
							variant='outlined'
							fullWidth
							value={this.state.inputValue}
							onChange={(e) => this.onInputFieldChange(e.target.value)}
						/>

						<div className={classes.heroButtons}>
							<Grid container spacing={2} justify='center'>
								<Grid item>
									<Button
										variant='contained'
										color='primary'
										onClick={this.recommend}
									>
										Recommend!
									</Button>
								</Grid>
								<Grid item>
									<Button variant='outlined' color='primary'>
										Secondary action
									</Button>
								</Grid>
							</Grid>
						</div>
					</Container>
				</div>

				{recommendations && (
					<>
						<Container maxWidth='xl'>
							<Typography variant='h4' align='center' gutterBottom>
								Showing anime similar to <b>{this.state.currentSearchTitle}</b>
							</Typography>
							<br />
							<br />

							<RecommendationRow
								sectionTitle='Similar Reviews'
								sectionDescription='Matches with anime that have similar review descriptions'
								data={recommendations.similarly_described}
							/>

							<RecommendationRow
								sectionTitle='Newest and Most Similar'
								sectionDescription='Matches with recently released anime that have similar review descriptions'
								data={this.state.recommendations.hot}
							/>

							<RecommendationRow
								sectionTitle='Popular and Most Similar'
								sectionDescription='Matches with the highest scoring anime on MyAnimeList that have similar review descriptions'
								data={this.state.recommendations.beloved}
							/>

							<RecommendationRow
								sectionTitle='Similar Plot'
								sectionDescription='Matches with anime that have similar plot, storyline or theme(s)'
								data={this.state.recommendations.similar_synopsis}
							/>
						</Container>
					</>
				)}
			</React.Fragment>
		);
	}
}

export default withStyles(styles)(Home);
