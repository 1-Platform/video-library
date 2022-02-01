import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import PaginationBottom from "./PaginationBottom";

test("renders pagination controls", async () => {
  render(
    <MemoryRouter>
      <PaginationBottom />
    </MemoryRouter>
  );

  const currentPage = screen.getByRole("spinbutton", {
    name: /current page/i,
    hidden: true,
  });
  const nextPage = screen.getByRole("button", {
    name: /go to next page/i,
    hidden: true,
  });
  const lastPage = screen.getByRole("button", {
    name: /go to last page/i,
    hidden: true,
  });

  expect(currentPage).toBeInTheDocument();
  expect(nextPage).toBeInTheDocument();
  expect(lastPage).toBeInTheDocument();
});
