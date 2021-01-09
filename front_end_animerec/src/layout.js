import { CssBaseline } from "@material-ui/core";
import React from "react";
import { Route, Switch } from "react-router";
import Home from "./containers/Home";
import RecommendationPage from "./containers/RecommendationPage";
import Recommendations from "./containers/Recommendations";
import SemanticHome from "./containers/SemanticHome";
import { Menu, Segment } from "semantic-ui-react";
import { Link } from "react-router-dom";

const Layout = () => {
	return (
		<React.Fragment>
			<CssBaseline />

			<Segment inverted vertical>
				<Menu fixed inverted pointing size="massive">
					<Menu.Item as={Link} to="/">
						Home
					</Menu.Item>
					<Menu.Item position="right" as={Link} to="/about">
						About
					</Menu.Item>
				</Menu>
			</Segment>

			<Switch>
				<Route exact path="/" component={Home} />
				<Route exact path="/home" component={SemanticHome} />
				<Route
					path={`/anime/:animeId`}
					exact
					component={RecommendationPage}
				/>
				<Route
					path={`/anime/:animeId/reference/:referenceId`}
					exact
					component={RecommendationPage}
				/>
				<Route
					exact
					path={`/recommend/:searchId`}
					component={Recommendations}
				/>
			</Switch>
		</React.Fragment>
	);
};

export default Layout;
