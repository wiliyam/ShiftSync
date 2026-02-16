import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import CreateEmployeeForm from '../create-form';

// Mock the server action
const mockCreateEmployee = jest.fn();
jest.mock('@/app/lib/employee-actions', () => ({
    createEmployee: (...args: unknown[]) => mockCreateEmployee(...args),
    State: {},
}));

// Mock react's useActionState to simulate form behavior
let mockState: Record<string, unknown> = { message: null, errors: {} };
const mockFormAction = jest.fn();
jest.mock('react', () => {
    const actual = jest.requireActual('react');
    return {
        ...actual,
        useActionState: () => [mockState, mockFormAction, false],
    };
});

describe('CreateEmployeeForm', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockState = { message: null, errors: {} };
    });

    it('renders all form fields', () => {
        render(<CreateEmployeeForm />);

        expect(screen.getByPlaceholderText('John Doe')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('john@example.com')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('******')).toBeInTheDocument();
        expect(screen.getByDisplayValue('40')).toBeInTheDocument(); // default maxHours
    });

    it('renders all field labels', () => {
        render(<CreateEmployeeForm />);

        expect(screen.getByText('Full Name')).toBeInTheDocument();
        expect(screen.getByText('Email Address')).toBeInTheDocument();
        expect(screen.getByText('Password')).toBeInTheDocument();
        expect(screen.getByText('Max Hours / Week')).toBeInTheDocument();
    });

    it('renders the submit button', () => {
        render(<CreateEmployeeForm />);

        const button = screen.getByRole('button', { name: 'Create Employee' });
        expect(button).toBeInTheDocument();
        expect(button).not.toBeDisabled();
    });

    it('has correct input types', () => {
        render(<CreateEmployeeForm />);

        expect(screen.getByPlaceholderText('john@example.com')).toHaveAttribute('type', 'email');
        expect(screen.getByPlaceholderText('******')).toHaveAttribute('type', 'password');
        expect(screen.getByDisplayValue('40')).toHaveAttribute('type', 'number');
    });

    it('has required attributes on mandatory fields', () => {
        render(<CreateEmployeeForm />);

        expect(screen.getByPlaceholderText('John Doe')).toBeRequired();
        expect(screen.getByPlaceholderText('john@example.com')).toBeRequired();
        expect(screen.getByPlaceholderText('******')).toBeRequired();
        expect(screen.getByDisplayValue('40')).toBeRequired();
    });

    it('has max=168 on maxHours input', () => {
        render(<CreateEmployeeForm />);

        const maxHoursInput = screen.getByDisplayValue('40');
        expect(maxHoursInput).toHaveAttribute('max', '168');
        expect(maxHoursInput).toHaveAttribute('min', '1');
    });

    it('displays field-level validation errors for name', () => {
        mockState = {
            message: 'Missing Fields. Failed to Create Employee.',
            errors: { name: ['Name must be at least 2 characters'] },
        };

        render(<CreateEmployeeForm />);

        expect(screen.getByText('Name must be at least 2 characters')).toBeInTheDocument();
    });

    it('displays field-level validation errors for email', () => {
        mockState = {
            message: 'Missing Fields. Failed to Create Employee.',
            errors: { email: ['Invalid email address'] },
        };

        render(<CreateEmployeeForm />);

        expect(screen.getByText('Invalid email address')).toBeInTheDocument();
    });

    it('displays field-level validation errors for maxHours', () => {
        mockState = {
            message: 'Missing Fields. Failed to Create Employee.',
            errors: { maxHours: ['Max hours cannot exceed 168 (hours in a week)'] },
        };

        render(<CreateEmployeeForm />);

        expect(screen.getByText('Max hours cannot exceed 168 (hours in a week)')).toBeInTheDocument();
    });

    it('displays general error message', () => {
        mockState = {
            message: 'User with this email already exists.',
            errors: {},
        };

        render(<CreateEmployeeForm />);

        expect(screen.getByText('User with this email already exists.')).toBeInTheDocument();
    });

    it('does not display errors when state is clean', () => {
        mockState = { message: null, errors: {} };

        render(<CreateEmployeeForm />);

        expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/Failed/i)).not.toBeInTheDocument();
    });

    it('has accessible error descriptions linked to inputs', () => {
        render(<CreateEmployeeForm />);

        expect(screen.getByPlaceholderText('John Doe')).toHaveAttribute('aria-describedby', 'name-error');
        expect(screen.getByPlaceholderText('john@example.com')).toHaveAttribute('aria-describedby', 'email-error');
        expect(screen.getByPlaceholderText('******')).toHaveAttribute('aria-describedby', 'password-error');
        expect(screen.getByDisplayValue('40')).toHaveAttribute('aria-describedby', 'maxHours-error');
    });

    it('accepts user input in all fields', () => {
        render(<CreateEmployeeForm />);

        const nameInput = screen.getByPlaceholderText('John Doe');
        const emailInput = screen.getByPlaceholderText('john@example.com');
        const passwordInput = screen.getByPlaceholderText('******');

        fireEvent.change(nameInput, { target: { value: 'Alice Smith' } });
        fireEvent.change(emailInput, { target: { value: 'alice@test.com' } });
        fireEvent.change(passwordInput, { target: { value: 'secret123' } });

        expect(nameInput).toHaveValue('Alice Smith');
        expect(emailInput).toHaveValue('alice@test.com');
        expect(passwordInput).toHaveValue('secret123');
    });
});
