import React from "react";
// need this whenever I write components
import ReactDOM from "react-dom";
// ^ only in start.js
import Welcome from "./welcome";
// no curly brackets because I export default it in the original file
// import Logo from "./logo";
import App from "./app";

let elem;
const userIsLoggedIn = location.pathname != "/welcome";

if (userIsLoggedIn) {
    // elem = <Logo />;
    elem = <App />;
} else {
    elem = <Welcome />;
}

ReactDOM.render(elem, document.querySelector("main"));
