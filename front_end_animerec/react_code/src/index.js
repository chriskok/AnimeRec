import { Button } from "@material-ui/core";
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import Album from "./components/Album";
import Home from "./containers/Home";
import "./index.css";
import Layout from "./layout";

class Square extends React.Component {
	render() {
		return <button className='square'>{/* TODO */}</button>;
	}
}

class Board extends React.Component {
	renderSquare(i) {
		return <Square />;
	}

	render() {
		const status = "Next player: X";

		return (
			<div>
				<div className='status'>{status}</div>
				<div className='board-row'>
					{this.renderSquare(0)}
					{this.renderSquare(1)}
					{this.renderSquare(2)}
				</div>
				<div className='board-row'>
					{this.renderSquare(3)}
					{this.renderSquare(4)}
					{this.renderSquare(5)}
				</div>
				<div className='board-row'>
					{this.renderSquare(6)}
					{this.renderSquare(7)}
					{this.renderSquare(8)}
				</div>
			</div>
		);
	}
}

class Game extends React.Component {
	render() {
		return (
			<Router>
				<Layout />
			</Router>
		);
	}
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));
