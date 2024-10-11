import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import axios from "../../api/axios";
import Register from "../Register";
import { BrowserRouter as Router } from "react-router-dom";

// Mock the axios module
jest.mock("../../api/axios");

describe("Register Component", () => {
  beforeEach(() => {
    axios.post.mockResolvedValue({
      data: { message: "User Registered Successfully" },
    });
  });

  test("renders register form with all fields", () => {
    render(
      <Router>
        <Register />
      </Router>
    );

    // Check if all input fields are rendered
    expect(screen.getByLabelText(/Username:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Phone Number:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Confirm:/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Sign Up/i })).toBeInTheDocument();
  });

  test("validates username, email, and password fields", async () => {
    render(
      <Router>
        <Register />
      </Router>
    );

    const usernameInput = screen.getByLabelText(/Username:/i);
    const emailInput = screen.getByLabelText(/Email:/i);
    const phoneInput =screen.getByLabelText(/Phone Number:/i);
    
    const passwordInput = screen.getByLabelText(/Password:/i);
    const confirmPasswordInput = screen.getByLabelText(/Confirm:/i);

    // Enter invalid username, email, and password
    fireEvent.change(usernameInput, { target: { value: "abc" } });
    fireEvent.change(emailInput, { target: { value: "invalidemail" } });
    fireEvent.change(phoneInput, { target: { value: "1234567" } });
    fireEvent.change(passwordInput, { target: { value: "password" } });
    fireEvent.change(confirmPasswordInput, { target: { value: "password" } });

    // Check error messages
    await waitFor(() => {
      expect(screen.getByText(/4 to 24 characters/i)).toBeInTheDocument();
      expect(screen.getByText(/Must be a valid email address/i)).toBeInTheDocument();
      expect(
        screen.getByText(/Must include uppercase and lowercase letters/i)
      ).toBeInTheDocument();
      expect(screen.getByText(/Must be a valid 10-digit phone number./i)).toBeInTheDocument();
    });
  });

  test("submits the form successfully when valid inputs are provided", async () => {
    render(
      <Router>
        <Register />
      </Router>
    );

    const usernameInput = screen.getByLabelText(/Username:/i);
    const emailInput = screen.getByLabelText(/Email:/i);
    const telnoInput = screen.getByLabelText(/Phone Number:/i);
    const passwordInput = screen.getByLabelText(/Password:/i);
    const confirmPasswordInput = screen.getByLabelText(/Confirm:/i);
    const submitButton = screen.getByRole("button", { name: /Sign Up/i });

    // Fill in the form with valid data
    fireEvent.change(usernameInput, { target: { value: "validUser" } });
    fireEvent.change(emailInput, { target: { value: "valid@example.com" } });
    fireEvent.change(telnoInput, { target: { value: "1234567890" } });
    fireEvent.change(passwordInput, { target: { value: "Password1!" } });
    fireEvent.change(confirmPasswordInput, { target: { value: "Password1!" } });

    fireEvent.click(submitButton);

    // Wait for the success message or navigation
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledTimes(1);
      expect(screen.queryByText(/Registration Failed/i)).toBeNull();
    });
  });

  test("shows error when registration fails", async () => {
    // Mock the failure response
    axios.post.mockRejectedValue({
      response: { status: 409, data: { message: "Username Taken" } },
    });

    render(
      <Router>
        <Register />
      </Router>
    );

 
    const usernameInput = screen.getByLabelText(/Username:/i);
    const emailInput = screen.getByLabelText(/Email:/i);
    const telnoInput = screen.getByLabelText(/Phone Number:/i);
    const passwordInput = screen.getByLabelText(/Password:/i);
    const confirmPasswordInput = screen.getByLabelText(/Confirm:/i);
    const submitButton = screen.getByRole("button", { name: /Sign Up/i });
    // Fill in the form with valid data
    fireEvent.change(usernameInput, { target: { value: "validUser" } });
    fireEvent.change(emailInput, { target: { value: "valid@example.com" } });
    fireEvent.change(telnoInput, { target: { value: "1234567890" } });
    fireEvent.change(passwordInput, { target: { value: "Password1!" } });
    fireEvent.change(confirmPasswordInput, { target: { value: "Password1!" } });

    fireEvent.click(submitButton);

    // Check for error message
    await waitFor(() => {
      expect(screen.getByText(/Username Taken/i)).toBeInTheDocument();
    });
  });
});
