import React from "react";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import Sorters from "./Sorters";

test("renders sorters list", async () => {
  render(
    <MemoryRouter>
      <Sorters />
    </MemoryRouter>
  );

  const sortBySelect = screen.getByText(/newest first/i);
  expect(sortBySelect).toBeInTheDocument();

  userEvent.click(sortBySelect);
  await waitFor(() => {
    const list = screen.getByRole("listbox", { name: /select input/i });
    const { getAllByRole } = within(list);
    const items = getAllByRole("option");
    expect(list).toBeInTheDocument();
    expect(items.length).toBe(4);
  });
});
