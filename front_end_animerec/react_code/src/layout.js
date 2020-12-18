import { AppBar, CssBaseline, Toolbar, Typography } from "@material-ui/core";
import React from "react";
import { Route, Switch } from "react-router";
import Home from "./containers/Home";
import RecommendationPage from "./containers/RecommendationPage";

const Layout = () => {
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

			<Switch>
				<Route exact path='/' component={Home} />
				<Route
					exact
					path='/recommendation/:animeId'
					component={RecommendationPage}
				/>
			</Switch>
		</React.Fragment>
	);
};

export default Layout;
