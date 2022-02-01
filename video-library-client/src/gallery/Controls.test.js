import React from "react";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import Controls from "./Controls";

test("renders controls like sort select and Add Video btn", async () => {
  const openAddModal = jest.fn();
  render(
    <MemoryRouter>
      <Controls openAddModal={openAddModal} />
    </MemoryRouter>
  );

  const addVideoBtn = screen.getByRole("button", { name: "Add Video" });
  const searchBox = screen.getByRole("searchbox", {
    name: /search videos by title, description, tags, createdby, source/i,
    hidden: true,
  });
  const searchButton = screen.getByRole("button", {
    name: /search button for video/i,
    hidden: true,
  });

  userEvent.click(addVideoBtn);
  await waitFor(() => {
    expect(openAddModal).toHaveBeenCalledTimes(1);
  });
  expect(addVideoBtn).toBeInTheDocument();
  expect(searchBox).toBeInTheDocument();
  expect(searchButton).toBeInTheDocument();
});
