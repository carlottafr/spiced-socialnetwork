import React, { Component } from "react";
import axios from "./axios";

class OtherProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        console.log("this.props: ", this.props);
        const otherUserId = this.props.match.params.id;
        // make a request to the server
        // handle the case when a user tries to view their own profile
        // => homepage
        // handle the case when a user tries to view a profile that
        // doesn't exist yet => error / homepage
        axios.get("api/user/" + otherUserId).then((response) => {
            console.log("This is the data: ", response);
        });
    }

    render() {
        return (
            <>
                <h1>I am other Profile!</h1>
            </>
        );
    }
}

export default OtherProfile;
