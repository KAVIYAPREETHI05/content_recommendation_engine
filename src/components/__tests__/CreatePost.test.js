test('dummy test', () => {
  expect(true).toBe(true);
});

import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import CreatePost from '../../components/pages/creator/CreatePost';

global.alert = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () =>
        Promise.resolve({
          message: 'Post created successfully!',
        }),
    })
  );
});

const renderWithRouter = (creatorId = '123') => {
  return render(
    <MemoryRouter initialEntries={[`/create-post/${creatorId}`]}>
      <Routes>
        <Route path="/create-post/:creatorId" element={<CreatePost />} />
      </Routes>
    </MemoryRouter>
  );
};

describe('CreatePost Component', () => {
  test('renders all input fields', () => {
    renderWithRouter();

    expect(screen.getByPlaceholderText(/title/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/author/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/tags/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/write your content/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/category/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /post/i })).toBeInTheDocument();
  });

  test('fills and submits the form successfully', async () => {
    renderWithRouter();

    fireEvent.change(screen.getByPlaceholderText(/title/i), {
      target: { value: 'Test Title' },
    });
    fireEvent.change(screen.getByPlaceholderText(/author/i), {
      target: { value: 'John Doe' },
    });
    fireEvent.change(screen.getByPlaceholderText(/tags/i), {
      target: { value: 'tech,react' },
    });
    fireEvent.change(screen.getByPlaceholderText(/write your content/i), {
      target: { value: 'This is the content of the blog.' },
    });
    fireEvent.change(screen.getByLabelText(/category/i), {
      target: { value: 'Tech' },
    });
    fireEvent.change(screen.getByLabelText(/published date/i), {
      target: { value: '2025-06-22' },
    });

    fireEvent.click(screen.getByRole('button', { name: /post/i }));

    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith('Post created successfully!');
    });

    expect(global.fetch).toHaveBeenCalledTimes(1);
  });
});
