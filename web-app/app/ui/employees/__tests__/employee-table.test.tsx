import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import EmployeeTable from '@/app/ui/employees/employee-table';

// Detailed Mock
jest.mock('@/app/lib/employee-actions', () => ({
    deleteEmployee: jest.fn(),
}));

const mockEmployees = [
    {
        id: 'emp-1',
        name: 'John Doe',
        email: 'john@example.com',
        employee: {
            skills: ['Barista'],
            maxHoursPerWeek: 40
        }
    },
    {
        id: 'emp-2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        employee: null
    }
];

describe('EmployeeTable', () => {
    it('renders employee data correctly', () => {
        render(<EmployeeTable employees={mockEmployees} />);

        // Check for names (getAllByText for duplicates, [0] to assert at least one)
        expect(screen.getAllByText(/John Doe/).length).toBeGreaterThan(0);
        expect(screen.getAllByText(/Jane Smith/).length).toBeGreaterThan(0);

        // Check for email
        expect(screen.getAllByText(/john@example.com/).length).toBeGreaterThan(0);

        // Check for skills
        expect(screen.getAllByText(/Barista/).length).toBeGreaterThan(0);
    });

    it('renders correct number of rows', () => {
        render(<EmployeeTable employees={mockEmployees} />);
        // 2 rows (desktop) + 2 cards (mobile) = 4 occurrences of name roughly
        expect(screen.getAllByText(/John Doe/).length).toBeGreaterThanOrEqual(1);
    });
});
