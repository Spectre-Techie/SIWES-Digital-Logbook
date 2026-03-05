import { render, screen } from '@testing-library/react';
import Input from '../Input';

describe('Input', () => {
    it('renders with a label', () => {
        render(<Input label="Email" />);
        expect(screen.getByLabelText('Email')).toBeInTheDocument();
    });

    it('renders without a label', () => {
        render(<Input placeholder="Type here" />);
        expect(screen.getByPlaceholderText('Type here')).toBeInTheDocument();
    });

    it('generates id from label', () => {
        render(<Input label="Full Name" />);
        expect(screen.getByLabelText('Full Name')).toHaveAttribute('id', 'full-name');
    });

    it('uses provided id over generated one', () => {
        render(<Input label="Email" id="custom-id" />);
        expect(screen.getByLabelText('Email')).toHaveAttribute('id', 'custom-id');
    });

    it('defaults to type="text"', () => {
        render(<Input label="Name" />);
        expect(screen.getByLabelText('Name')).toHaveAttribute('type', 'text');
    });

    it('accepts type="email"', () => {
        render(<Input label="Email" type="email" />);
        expect(screen.getByLabelText('Email')).toHaveAttribute('type', 'email');
    });

    it('shows error message', () => {
        render(<Input label="Email" error="Email is required" />);
        expect(screen.getByRole('alert')).toHaveTextContent('Email is required');
    });

    it('sets aria-invalid when error exists', () => {
        render(<Input label="Email" error="Required" />);
        expect(screen.getByLabelText('Email')).toHaveAttribute('aria-invalid', 'true');
    });

    it('sets aria-describedby linking to error', () => {
        render(<Input label="Email" error="Required" />);
        const input = screen.getByLabelText('Email');
        const errorId = input.getAttribute('aria-describedby');
        expect(errorId).toBeTruthy();
        expect(screen.getByRole('alert')).toHaveAttribute('id', errorId);
    });

    it('does not set aria-invalid when no error', () => {
        render(<Input label="Email" />);
        expect(screen.getByLabelText('Email')).not.toHaveAttribute('aria-invalid');
    });

    it('forwards ref', () => {
        const ref = { current: null };
        render(<Input label="Test" ref={ref} />);
        expect(ref.current).toBeInstanceOf(HTMLInputElement);
    });

    it('applies disabled state', () => {
        render(<Input label="Test" disabled />);
        expect(screen.getByLabelText('Test')).toBeDisabled();
    });
});
