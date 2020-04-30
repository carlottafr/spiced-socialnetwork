import React from "react";
// import axios from "axios";
import Child from "./child";

export default class HelloWorld extends React.Component {
    constructor() {
        super();
        this.state = {
            first: "Carlotta",
            last: "Frommer",
        };
    }

    componentDidMount() {
        // lifecycle method (equivalent to Vue mounted)
        // same pattern as with axios requests
        // axios.get("/abc").then((res) => {
        // ^ not a real route
        // this.setState({
        // ^ function we use to update state in React
        // first: res.data.first,
        // last: res.data.last,
        // ^ example code
        // });
        // });
        setTimeout(() => {
            this.setState({
                first: "Noam",
                last: "Chomsky",
            });
        }, 3000);
    }

    handleClick() {
        this.setState({
            first: "Tom",
            last: "Nook",
        });
    }

    render() {
        return (
            <div>
                Hello, {this.state.first} {this.state.last}!
                <Child last={this.state.last} />
                <p onClick={() => this.handleClick()}>Click me!</p>
            </div>
            // pass "last" as a prop to the Child component
        );
    }
}

// export default function HelloWorld() {
//     return <div>Hello, World!</div>;
// JSX
// JS code that looks like HTML but only
// describes the UI
// }
