// src/components/__tests__/EditPost.test.js
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import EditPost from '../pages/creator/EditPost';
import axios from "axios";

// Mock react-router-dom hooks
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: () => ({ creatorId: "123", postId: "456" }),
  useNavigate: () => jest.fn(),
}));

// Mock axios
jest.mock("axios");

describe("EditPost Component", () => {
  const mockPost = {
    title: "Sample Title",
    author: "John Doe",
    category: "Tech",
    content: "Initial post content",
  };

  beforeEach(() => {
    axios.get.mockResolvedValue({ data: mockPost });
  });

  test("renders input fields with fetched data", async () => {
    render(
      <MemoryRouter initialEntries={["/creator/123/edit-post/456"]}>
        <Routes>
          <Route path="/creator/:creatorId/edit-post/:postId" element={<EditPost />} />
        </Routes>
      </MemoryRouter>
    );

    // Wait for fetch to complete
    await waitFor(() => {
      expect(screen.getByDisplayValue("Sample Title")).toBeInTheDocument();
      expect(screen.getByDisplayValue("John Doe")).toBeInTheDocument();
      expect(screen.getByDisplayValue("Tech")).toBeInTheDocument();
      expect(screen.getByDisplayValue("Initial post content")).toBeInTheDocument();
    });
  });

  test("submits updated form", async () => {
    const mockNavigate = jest.fn();
    jest.spyOn(require("react-router-dom"), "useNavigate").mockReturnValue(mockNavigate);

    axios.put.mockResolvedValue({ status: 200 });

    render(
      <MemoryRouter initialEntries={["/creator/123/edit-post/456"]}>
        <Routes>
          <Route path="/creator/:creatorId/edit-post/:postId" element={<EditPost />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => screen.getByDisplayValue("Sample Title"));

    fireEvent.change(screen.getByLabelText(/Title:/i), {
      target: { value: "Updated Title" },
    });

    fireEvent.click(screen.getByRole("button", { name: /update post/i }));

    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledWith("http://localhost:5000/api/posts/456", {
        ...mockPost,
        title: "Updated Title",
      });
      expect(mockNavigate).toHaveBeenCalledWith("/creator/123/manage-posts");
    });
  });
});
