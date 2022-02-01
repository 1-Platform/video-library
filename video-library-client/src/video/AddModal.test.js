import { render, screen } from "@testing-library/react";
import AddModal from "./AddModal";
import { MemoryRouter } from "react-router-dom";

describe("Add Modal", function () {
  test("renders correctly", async () => {
    render(
      <MemoryRouter>
        <AddModal />
      </MemoryRouter>
    );
    const heading = screen.getByRole("heading", { name: /add video/i });
    expect(heading).toBeInTheDocument();
  });
});
