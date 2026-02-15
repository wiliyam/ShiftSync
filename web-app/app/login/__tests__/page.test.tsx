import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import LoginPage from '../page'

// Mock the LoginForm client component since we are testing the Page structure
// and we don't want to deal with Server Actions in a unit test of the Page.
jest.mock('@/app/ui/login-form', () => {
    return function DummyLoginForm() {
        return <div data-testid="login-form">Login Form Mock</div>;
    };
});

describe('LoginPage', () => {
    it('renders the brand name', () => {
        render(<LoginPage />)
        const heading = screen.getByText('ShiftSync')
        expect(heading).toBeInTheDocument()
    })

    it('renders the login prompt', () => {
        render(<LoginPage />)
        expect(screen.getByText('Please log in to continue.')).toBeInTheDocument()
    })
})
