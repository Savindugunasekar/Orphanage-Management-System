import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from '../Login';
import axios from '../../api/axios';
import toast from 'react-hot-toast';

// Mock axios
jest.mock('../../api/axios');

// Mock react-hot-toast
jest.mock('react-hot-toast', () => ({
  __esModule: true,
  default: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe('Login Component', () => {
  beforeEach(() => {
    jest.resetAllMocks(); // Reset mocks before each test
  });

  test('renders login form with all fields', () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    // Checking if fields are rendered
    expect(screen.getByLabelText(/Email:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password:/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Log in/i })).toBeInTheDocument();
    expect(screen.getByText(/Sign Up/i)).toBeInTheDocument();
  });

  test('validates email and password fields', async () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    const emailInput = screen.getByLabelText(/Email:/i);
    const passwordInput = screen.getByLabelText(/Password:/i);
    const submitButton = screen.getByRole('button', { name: /Log in/i });

    fireEvent.change(emailInput, { target: { value: '' } });
    fireEvent.change(passwordInput, { target: { value: '' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('No Server Response');
    });
  });

  test('handles successful login', async () => {
    axios.post.mockResolvedValue({
      data: {
        accessToken: 'mockAccessToken',
        UserInfo: {
          roles: [1010],
          userId: '123',
          orphanageid: '456',
          username: 'testuser',
        },
      },
    });

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    const emailInput = screen.getByLabelText(/Email:/i);
    const passwordInput = screen.getByLabelText(/Password:/i);
    const submitButton = screen.getByRole('button', { name: /Log in/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

   
  });

  test('handles server error', async () => {
    axios.post.mockRejectedValue({
      response: { status: 500 },
    });

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    const emailInput = screen.getByLabelText(/Email:/i);
    const passwordInput = screen.getByLabelText(/Password:/i);
    const submitButton = screen.getByRole('button', { name: /Log in/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Login Failed');
    });
  });

  test('handles unauthorized error', async () => {
    axios.post.mockRejectedValue({
      response: { status: 401 },
    });

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    const emailInput = screen.getByLabelText(/Email:/i);
    const passwordInput = screen.getByLabelText(/Password:/i);
    const submitButton = screen.getByRole('button', { name: /Log in/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Unauthorized');
    });
  });

  test('handles missing email or password error', async () => {
    axios.post.mockRejectedValue({
      response: { status: 400 },
    });

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    const emailInput = screen.getByLabelText(/Email:/i);
    const passwordInput = screen.getByLabelText(/Password:/i);
    const submitButton = screen.getByRole('button', { name: /Log in/i });

    fireEvent.change(emailInput, { target: { value: '' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Missing Email or Password');
    });
  });
});
