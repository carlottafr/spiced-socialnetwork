import React, { useState, useEffect } from "react";
import axios from "./axios";
import ProfilePic from "./profilepic";
import { Link } from "react-router-dom";

export default function FindPeople() {
    const [user, setUser] = useState("");
    const [users, setUsers] = useState([]);
    const [latest, setLatest] = useState(true);

    useEffect(() => {
        let abort;
        (async () => {
            const { data } = await axios.get("/api/users/" + (user || "user"));
            if (!abort) {
                setUsers(data);
            }
        })();
        return () => {
            abort = true;
        };
    }, [user]);

    return (
        <div className="find-users">
            <h2>Find People</h2>
            <input
                onChange={(e) => {
                    setLatest(false);
                    setUser(e.target.value);
                }}
                placeholder="Jane Doe"
            />
            {latest && (
                <h3>These are the latest members of this fine society:</h3>
            )}
            <div className="users">
                {users.map((user) => (
                    <div key={user.id}>
                        <Link to={"/user/" + user.id}>
                            <ProfilePic
                                first={user.first}
                                last={user.last}
                                imageUrl={user.image_url}
                            />
                            <div>
                                {user.first} {user.last}
                            </div>
                        </Link>
                    </div>
                ))}
                {!users.length && <div id="no-results">No results found</div>}
            </div>
        </div>
    );
}
