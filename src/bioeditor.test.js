import React from "react";
import BioEditor from "./bioeditor";
import { render, waitForElement, fireEvent } from "@testing-library/react";
import axios from "axios";

jest.mock("axios");

test("When no bio is passed to it, an 'Add' button is rendered.", () => {
    const { container } = render(<BioEditor bio="" />);
    expect(container.querySelector("p").getAttribute("id")).toBe("addbio");
});

test("When a bio is passed to it, an 'Edit' button is rendered.", () => {
    const { container } = render(
        <BioEditor bio="Both my brothers' names are Daryl." />
    );

    expect(container.querySelector("p").getAttribute("id")).toBe("editbio");
});

test("Clicking either the 'Add' or 'Edit' button causes a textarea and a 'Save' button to be rendered.", () => {
    const { container } = render(<BioEditor />);
    fireEvent.click(container.querySelector("p"));
    expect(container.getElementsByTagName("textarea").length).toBe(1);
    expect(container.getElementsByTagName("button")[0].innerHTML).toBe("Save");
});

test("Clicking the 'Save' button causes an ajax request.", async () => {
    // const mockOnClick = jest.fn();
    const { container } = render(<BioEditor />);
    fireEvent.click(container.querySelector("p"));
    let testBio = "Both my brothers' names are Daryl.";
    fireEvent.click(container.querySelector("button"));
    axios.get.mockResolvedValue({
        data: {
            bio: testBio,
        },
    });

    const elem = await waitForElement(() =>
        container.querySelectorAll("div.showbio")
    );
    // const { newContainer } = render(<BioEditor testBio />);
    // await waitForElement(() => container.getElementsByClassName("showbio"));
    expect(elem.innerHTML).toBe(
        <div className="showbio">
            <div className="bio">{testBio}</div>
            <p id="editbio">Edit</p>
        </div>
    );
    // expect(container.getElementsByClassName("bio")[0].innerHTML).toBe(testBio);
});
