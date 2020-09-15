import React from "react";
import { render } from "@testing-library/react";
import VideoLibrary from "./VideoLibrary";

test("renders learn react link", () => {
  const { getByText } = render(<VideoLibrary />);
  const linkElement = getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
