// LoginPage.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Login from '../pages/LoginPage';
import { BrowserRouter } from 'react-router-dom';

// Mock fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () =>
      Promise.resolve({
        message: 'Signup successful!',
        id: 'auto-generated-id-123',
        role: 'creator'
      }),
  })
);


jest.mock('react-router-dom', () => {
  const originalModule = jest.requireActual('react-router-dom');
  return {
    ...originalModule,
    useNavigate: () => jest.fn(),
  };
});



describe('Login Page', () => {
  beforeEach(() => {
    fetch.mockClear();
    mockedUsedNavigate.mockClear();
  });

  test('renders login form', () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
    expect(screen.getByText(/Login to Your Account/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/ReaderID \/ CreatorID/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Password/i)).toBeInTheDocument();
  });

  test('submits form and navigates on success', async () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/ReaderID \/ CreatorID/i), {
      target: { value: 'creator123', name: 'id' },
    });

    fireEvent.change(screen.getByPlaceholderText(/Password/i), {
      target: { value: 'password', name: 'password' },
    });

    fireEvent.click(screen.getByText('Login'));

    // Wait for navigation to be called
    await screen.findByText(/Login to Your Account/i); // Wait until rerender is done

    expect(fetch).toHaveBeenCalledWith('http://localhost:5000/api/login', expect.any(Object));
    expect(mockedUsedNavigate).toHaveBeenCalledWith('/creator/123/dashboard');
  });
});
