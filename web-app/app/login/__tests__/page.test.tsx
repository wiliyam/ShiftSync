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
        const headings = screen.getAllByText('ShiftSync')
        expect(headings.length).toBeGreaterThan(0)
        expect(headings[0]).toBeInTheDocument()
    })

    it('renders the welcome heading', () => {
        render(<LoginPage />)
        expect(screen.getByText('Welcome Back')).toBeInTheDocument()
    })

    it('renders the sign in prompt', () => {
        render(<LoginPage />)
        expect(screen.getByText('Please sign in to your account')).toBeInTheDocument()
    })

    it('renders the login form', () => {
        render(<LoginPage />)
        expect(screen.getByTestId('login-form')).toBeInTheDocument()
    })
})
