import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import ShiftList from '@/app/ui/shifts/shift-list';

// Mock actions
jest.mock('@/app/lib/shift-actions', () => ({
    deleteShift: jest.fn(),
}));

const mockShifts = [
    {
        id: 'shift-1',
        start: new Date('2023-10-10T09:00:00Z'),
        end: new Date('2023-10-10T17:00:00Z'),
        employee: { user: { name: 'Alice' } },
        location: { name: 'Main Bar' },
        status: 'DRAFT'
    },
    {
        id: 'shift-2',
        start: new Date('2023-10-11T10:00:00Z'),
        end: new Date('2023-10-11T18:00:00Z'),
        employee: null,
        location: { name: 'Patio' },
        status: 'PUBLISHED'
    }
];

describe('ShiftList', () => {
    it('renders shift data correctly', () => {
        render(<ShiftList shifts={mockShifts} />);

        expect(screen.getByText('Alice')).toBeInTheDocument();
        expect(screen.getByText('Main Bar')).toBeInTheDocument();
        expect(screen.getByText('Patio')).toBeInTheDocument();
    });

    it('displays Unassigned for shifts without employee', () => {
        render(<ShiftList shifts={mockShifts} />);
        expect(screen.getByText('Unassigned')).toBeInTheDocument();
    });

    it('renders empty message when no shifts', () => {
        render(<ShiftList shifts={[]} />);
        expect(screen.getByText('No upcoming shifts scheduled.')).toBeInTheDocument();
    });
});
