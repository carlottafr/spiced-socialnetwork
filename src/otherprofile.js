import React, { Component } from "react";
import axios from "./axios";
import ProfilePic from "./profilepic";
import FriendshipButton from "./friendbutton";

class OtherProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sameUser: false,
        };
    }

    componentDidMount() {
        const otherUserId = this.props.match.params.id;
        // make a request to the server
        // handle the case when a user tries to view their own profile
        // => homepage
        // handle the case when a user tries to view a profile that
        // doesn't exist yet => error / homepage
        axios.get("/api/user/" + otherUserId).then(({ data }) => {
            // console.log("This is the data: ", response);
            if (data.sameUser || data.noMatch) {
                this.props.history.push("/");
            } else {
                this.setState({
                    first: data.first,
                    last: data.last,
                    imageUrl: data.imageUrl,
                    bio: data.bio,
                });
            }
        });
    }

    render() {
        return (
            <>
                {/* <h1>
                    {this.state.first} {this.state.last}
                </h1> */}
                <ProfilePic
                    first={this.state.first}
                    last={this.state.last}
                    imageUrl={this.state.imageUrl}
                />
                <h3>
                    {this.state.first} {this.state.last}
                </h3>
                <p>{this.state.bio}</p>
                <FriendshipButton otherId={this.props.match.params.id} />
            </>
        );
    }
}

export default OtherProfile;
