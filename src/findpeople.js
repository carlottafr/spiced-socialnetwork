import React, { useState, useEffect } from "react";
import axios from "./axios";
import ProfilePic from "./profilepic";

export default function FindPeople() {
    const [user, setUser] = useState("");
    const [users, setUsers] = useState([]);

    useEffect(() => {
        let abort;
        (async () => {
            const { data } = await axios.get("/api/users/" + (user || "user"));
            console.log("The data: ", data);
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
            <h3>Find People</h3>
            <input
                onChange={(e) => setUser(e.target.value)}
                placeholder="Jane Doe"
            />
            <div className="users">
                {users.map((user) => (
                    <div key={user.id}>
                        <ProfilePic
                            first={user.first}
                            last={user.last}
                            imageUrl={user.image_url}
                        />
                        <div>
                            {user.first} {user.last}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
