import React, { Component } from "react";
import axios from "./axios";
import ProfilePic from "./profilepic";
import FriendshipButton from "./friendbutton";
import Wall from "./wall";

export default class OtherProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sameUser: false,
            friend: false,
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
                    avatar: data.image,
                    bio: data.bio,
                });
            }
        });
    }

    friendshipCheck(arg) {
        this.setState({
            friend: arg,
        });
        console.log("friendshipCheck fired!");
    }

    render() {
        return (
            <div className="otherprofile">
                <h1>
                    {this.state.first} {this.state.last}
                </h1>
                <ProfilePic
                    first={this.state.first}
                    last={this.state.last}
                    avatar={this.state.avatar}
                />
                <p className="showbio">{this.state.bio}</p>
                <FriendshipButton
                    otherId={this.props.match.params.id}
                    friendshipCheck={(arg) => this.friendshipCheck(arg)}
                />
                {this.state.friend && <Wall id={this.props.match.params.id} />}
            </div>
        );
    }
}
