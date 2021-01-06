import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import "./index.css";
import Layout from "./layout";
import "tailwindcss/tailwind.css";
import "semantic-ui-css/semantic.min.css";

class App extends React.Component {
    render() {
        return (
            <Router>
                <Layout />
            </Router>
        );
    }
}

// ========================================

ReactDOM.render(<App />, document.getElementById("root"));
