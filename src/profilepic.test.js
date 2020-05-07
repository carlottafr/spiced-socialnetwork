import React from "react";
import ProfilePic from "./profilepic";
import { render, fireEvent } from "@testing-library/react";

test("renders img with src set to '/puppy.png' when it is passed that as a prop", () => {
    // container is the DOM
    const { container } = render(<ProfilePic imageUrl="/puppy.png" />);
    expect(container.querySelector("img").getAttribute("src")).toBe(
        "/puppy.png"
    );
});

test("renders img with src set to '/default.png' when no url prop is present", () => {
    const { container } = render(<ProfilePic />);
    expect(container.querySelector("img").getAttribute("src")).toBe(
        "/default.png"
    );
});

test("renders first and last props in alt attribute", () => {
    const { container } = render(<ProfilePic first="Noam" last="Chomsky" />);
    expect(container.querySelector("img").getAttribute("alt")).toBe(
        "Noam Chomsky"
    );
});

test("clicking the img triggers the click event handler", () => {
    const mockOnClick = jest.fn();
    const { container } = render(<ProfilePic toggleModal={mockOnClick} />);
    // simulate a click on the image selector that was rendered in the DOM
    fireEvent.click(container.querySelector("img"));
    expect(mockOnClick.mock.calls.length).toBe(1);
});
