import React from "react";
import { render as rtlRender, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "./App";

test("renders video library SPA home", async () => {
  rtlRender(
    <MemoryRouter initialEntries={["/"]}>
      <App />
    </MemoryRouter>
  );
  const addVideoBtn = screen.getByRole("button", { name: "Add Video" });
  const searchInput = screen.getByPlaceholderText(
    "Search videos by title, description, tags, createdBy, source"
  );
  const sortBySelect = screen.getByRole("button", { name: /newest first/i });

  expect(addVideoBtn).toBeInTheDocument();
  expect(sortBySelect).toBeInTheDocument();
  expect(searchInput).toBeInTheDocument();
});
