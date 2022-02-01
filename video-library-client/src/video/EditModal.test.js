import { render, screen } from "@testing-library/react";
import EditModal from "./EditModal";
import { MemoryRouter } from "react-router-dom";

describe("Edit Modal", function () {
  test("renders correctly", async () => {
    render(
      <MemoryRouter initialEntries={[{ pathname: "/", state: { video: {} } }]}>
        <EditModal />
      </MemoryRouter>
    );
    const heading = screen.getByRole("heading", { name: /edit video/i });
    expect(heading).toBeInTheDocument();
  });
});
