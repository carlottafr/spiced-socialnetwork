import React from "react";
import App from "./app";
import { render, waitForElement } from "@testing-library/react";
import axios from "./axios";

// automatic mock:
// Jest makes a fake copy of axios
// with all the methods (get, post etc.)
jest.mock("./axios");

test("App shows nothing at first", async () => {
    axios.get.mockResolvedValue({
        data: {
            id: 1,
            first: "Noam",
            last: "Chomsky",
            image: "/puppy.png",
        },
    });
    const { container } = render(<App />);

    await waitForElement(() => container.querySelector("div"));
    expect(container.children.length).toBe(1);
});
