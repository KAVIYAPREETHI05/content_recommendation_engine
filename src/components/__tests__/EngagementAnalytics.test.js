global.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// src/components/creator/__tests__/EngagementAnalytics.test.js
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import EngagementAnalytics from "../../components/pages/creator/EngagementAnalytics";
import { BrowserRouter, MemoryRouter, Route, Routes } from "react-router-dom";

// Mock fetch
beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () =>
        Promise.resolve([
          {
            title: "Post 1",
            views: 100,
            likes: 25,
            comments: 10,
            category: "Tech"
          },
          {
            title: "Post 2",
            views: 150,
            likes: 40,
            comments: 20,
            category: "Tech"
          },
          {
            title: "Post 3",
            views: 50,
            likes: 15,
            comments: 5,
            category: "Food"
          }
        ])
    })
  );
});

afterEach(() => {
  jest.resetAllMocks();
});

test("renders analytics summary correctly", async () => {
  render(
    <MemoryRouter initialEntries={["/analytics/123"]}>
      <Routes>
        <Route path="/analytics/:creatorId" element={<EngagementAnalytics />} />
      </Routes>
    </MemoryRouter>
  );

  expect(screen.getByText("Post Engagement Analytics")).toBeInTheDocument();

  // Wait for fetch and DOM update
  await waitFor(() => {
    expect(screen.getByText("Total Blogs")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument(); // total posts
    expect(screen.getByText("80")).toBeInTheDocument(); // total likes
    expect(screen.getByText("35")).toBeInTheDocument(); // total comments
    expect(screen.getByText("Tech")).toBeInTheDocument(); // top category
  });
});
