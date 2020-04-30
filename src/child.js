import React from "react";

export default class Child extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        console.log("this.props: ", this.props);
        return <h2>{this.props.last} is the best</h2>;
    }
}
