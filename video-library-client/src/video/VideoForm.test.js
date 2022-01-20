import React from "react";
import { render as rtlRender, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import VideoForm from "./VideoForm";

test("renders video form", async () => {
  const handleModalClose = jest.fn();
  rtlRender(
    <MemoryRouter>
      <VideoForm handleModalClose={handleModalClose} />
    </MemoryRouter>
  );

  const videoTitle = screen.getByRole("textbox", { name: /video title/i });
  const videoDesc = screen.getByRole("textbox", {
    name: /video description/i,
  });
  const videoURL = screen.getByRole("textbox", { name: /video url/i });
  const mailingLists = screen.getByRole("textbox", {
    name: /mailing lists/i,
  });
  const showAdvancedFieldsBtn = screen.getByRole("button", {
    name: /show advanced fields/i,
  });
  const addVideoBtn = screen.getByRole("button", { name: /add video/i });
  const cancelBtn = screen.getByRole("button", { name: /cancel/i });
  const confirmCheck = screen.getByRole("checkbox", {
    name: /i confirm that this video is editable by all the red hat users/i,
  });

  expect(videoTitle).toBeInTheDocument();
  expect(videoDesc).toBeInTheDocument();
  expect(videoURL).toBeInTheDocument();
  expect(mailingLists).toBeInTheDocument();
  expect(showAdvancedFieldsBtn).toBeInTheDocument();
  expect(addVideoBtn).toBeInTheDocument();
  expect(addVideoBtn).toHaveAttribute("disabled");
  expect(cancelBtn).toBeInTheDocument();

  userEvent.type(videoTitle, "Test video");
  userEvent.type(videoDesc, "Test video description");
  userEvent.type(videoURL, "www.youtube.com");
  await waitFor(() => screen.getByRole("radio", { name: /< 1 min/i }));
  userEvent.click(showAdvancedFieldsBtn);
  await waitFor(() =>
    screen.getByRole("textbox", { name: /tags for the video/i })
  );
  userEvent.click(screen.getByRole("radio", { name: /< 1 min/i }));
  userEvent.click(confirmCheck);
  expect(addVideoBtn).not.toHaveAttribute("disabled");
});
