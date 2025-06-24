import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import Signup from '../../components/SignupPage';

// Proper fetch mock
beforeAll(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve({ message: 'Signup successful!' }),
    })
  );
  jest.spyOn(window, 'alert').mockImplementation(() => {});
});

afterEach(() => {
  fetch.mockClear();
  window.alert.mockClear();
});

describe('Signup Component', () => {
  it('renders all form fields', () => {
    render(<Signup />);
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Role/i)).toBeInTheDocument();
  });

  it('updates input fields on change', () => {
    render(<Signup />);
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: '123456' },
    });
    fireEvent.change(screen.getByLabelText(/Role/i), {
      target: { value: 'creator' },
    });

    expect(screen.getByLabelText(/Email/i).value).toBe('test@example.com');
    expect(screen.getByLabelText(/Password/i).value).toBe('123456');
    expect(screen.getByLabelText(/Role/i).value).toBe('creator');
  });

  it('submits form and displays alert with message', async () => {
    render(<Signup />);
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: '123456' },
    });
    fireEvent.change(screen.getByLabelText(/Role/i), {
      target: { value: 'reader' },
    });

    fireEvent.click(screen.getByRole('button', { name: /Create Account/i }));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Signup successful!');
    });
  });
});
