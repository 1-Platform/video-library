import React from "react";
import {
  render as rtlRender,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import VideoGallery from "./VideoGallery";
import { videos } from "../mocks/mockVideo";
import { rest } from "msw";
import { server } from "../mocks/server";
import renderer from "react-test-renderer";

test("renders video list on home", async () => {
  server.use(
    rest.post("http://localhost:8080/graphql", async (req, res, ctx) => {
      return res(ctx.status(200), ctx.json(videos));
    })
  );
  const openAddModal = jest.fn();
  rtlRender(
    <MemoryRouter>
      <VideoGallery openAddModal={openAddModal} />
    </MemoryRouter>
  );

  await waitForElementToBeRemoved(() => screen.queryByText("Loading"));
  const videoTitle = screen.getByText("Test video");
  expect(videoTitle).toBeInTheDocument();
});

test("VideoGallery renders correctly", () => {
  server.use(
    rest.post("http://localhost:8080/graphql", async (req, res, ctx) => {
      return res(ctx.status(200), ctx.json(videos));
    })
  );
  const openAddModal = jest.fn();
  const tree = renderer
    .create(
      <MemoryRouter>
        <VideoGallery openAddModal={openAddModal} />
      </MemoryRouter>
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
