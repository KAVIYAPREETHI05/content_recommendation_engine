// src/components/creator/__tests__/ManagePosts.test.js

global.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};


import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import ManagePosts from "../../components/pages/creator/ManagePosts";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import userEvent from "@testing-library/user-event";

// Mock useNavigate
const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));


// Mock global fetch
const mockPosts = [
  {
    _id: "1",
    title: "React Testing",
    author: "Kaviya",
    category: "Tech",
  },
  {
    _id: "2",
    title: "Cooking 101",
    author: "Preethi",
    category: "Food",
  },
];

beforeEach(() => {
  global.fetch = jest.fn((url, options) => {
    if (options?.method === "DELETE") {
      return Promise.resolve({ ok: true });
    }
    return Promise.resolve({
      json: () => Promise.resolve(mockPosts),
    });
  });
});

afterEach(() => {
  jest.clearAllMocks();
});

test("renders heading and input", async () => {
  render(
    <MemoryRouter initialEntries={["/creator/123/manage-posts"]}>
      <Routes>
        <Route path="/creator/:creatorId/manage-posts" element={<ManagePosts />} />
      </Routes>
    </MemoryRouter>
  );

  expect(screen.getByText("Your Posts")).toBeInTheDocument();
  expect(screen.getByPlaceholderText("Search by title, author, or category")).toBeInTheDocument();
});

test("fetches and displays posts", async () => {
  render(
    <MemoryRouter initialEntries={["/creator/123/manage-posts"]}>
      <Routes>
        <Route path="/creator/:creatorId/manage-posts" element={<ManagePosts />} />
      </Routes>
    </MemoryRouter>
  );

  await waitFor(() => {
    expect(screen.getByText("React Testing")).toBeInTheDocument();
    expect(screen.getByText("Cooking 101")).toBeInTheDocument();
  });
});

test("filters posts based on search input", async () => {
  render(
    <MemoryRouter initialEntries={["/creator/123/manage-posts"]}>
      <Routes>
        <Route path="/creator/:creatorId/manage-posts" element={<ManagePosts />} />
      </Routes>
    </MemoryRouter>
  );

  await waitFor(() => screen.getByText("React Testing"));

  fireEvent.change(screen.getByPlaceholderText(/search/i), {
    target: { value: "cooking" },
  });

  expect(screen.getByText("Cooking 101")).toBeInTheDocument();
  expect(screen.queryByText("React Testing")).not.toBeInTheDocument();
});
test("calls navigate on View and Edit button click", async () => {
  render(
    <MemoryRouter initialEntries={["/creator/123/manage-posts"]}>
      <Routes>
        <Route path="/creator/:creatorId/manage-posts" element={<ManagePosts />} />
      </Routes>
    </MemoryRouter>
  );

  await waitFor(() => screen.getByText("React Testing"));

  await userEvent.click(screen.getAllByText("View")[0]);
  expect(mockNavigate).toHaveBeenCalledWith("/creator/123/view-post/1");

  await userEvent.click(screen.getAllByText("Edit")[0]);
  expect(mockNavigate).toHaveBeenCalledWith("/creator/123/edit-post/1");
});


test("deletes a post and updates UI after confirmation", async () => {
  window.confirm = jest.fn(() => true);

  render(
    <MemoryRouter initialEntries={["/creator/123/manage-posts"]}>
      <Routes>
        <Route path="/creator/:creatorId/manage-posts" element={<ManagePosts />} />
      </Routes>
    </MemoryRouter>
  );

  await waitFor(() => screen.getByText("React Testing"));

  userEvent.click(screen.getAllByText("Delete")[0]);

  await waitFor(() => {
    expect(screen.queryByText("React Testing")).not.toBeInTheDocument();
  });
});

test("does not delete post if user cancels confirmation", async () => {
  window.confirm = jest.fn(() => false);

  render(
    <MemoryRouter initialEntries={["/creator/123/manage-posts"]}>
      <Routes>
        <Route path="/creator/:creatorId/manage-posts" element={<ManagePosts />} />
      </Routes>
    </MemoryRouter>
  );

  await waitFor(() => screen.getByText("React Testing"));

  userEvent.click(screen.getAllByText("Delete")[0]);

  expect(fetch).toHaveBeenCalledTimes(1); // only initial fetch
  expect(screen.getByText("React Testing")).toBeInTheDocument();
});
