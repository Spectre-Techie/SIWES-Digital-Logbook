import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Button from '../Button';

// Mock Phosphor icon
jest.mock('@phosphor-icons/react', () => ({
    CircleNotch: (props) => <svg data-testid="spinner" {...props} />,
}));

describe('Button', () => {
    it('renders children text', () => {
        render(<Button>Click me</Button>);
        expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
    });

    it('defaults to type="button"', () => {
        render(<Button>Test</Button>);
        expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
    });

    it('accepts type="submit"', () => {
        render(<Button type="submit">Submit</Button>);
        expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
    });

    it('calls onClick when clicked', async () => {
        const user = userEvent.setup();
        const onClick = jest.fn();
        render(<Button onClick={onClick}>Click</Button>);
        await user.click(screen.getByRole('button'));
        expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('is disabled when disabled prop is true', () => {
        render(<Button disabled>Disabled</Button>);
        expect(screen.getByRole('button')).toBeDisabled();
    });

    it('is disabled when loading is true', () => {
        render(<Button loading>Loading</Button>);
        expect(screen.getByRole('button')).toBeDisabled();
    });

    it('shows spinner when loading', () => {
        render(<Button loading>Loading</Button>);
        expect(screen.getByTestId('spinner')).toBeInTheDocument();
    });

    it('sets aria-busy when loading', () => {
        render(<Button loading>Loading</Button>);
        expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'true');
    });

    it('does not set aria-busy when not loading', () => {
        render(<Button>Normal</Button>);
        expect(screen.getByRole('button')).not.toHaveAttribute('aria-busy');
    });

    it('does not call onClick when disabled', async () => {
        const user = userEvent.setup();
        const onClick = jest.fn();
        render(<Button disabled onClick={onClick}>Disabled</Button>);
        await user.click(screen.getByRole('button'));
        expect(onClick).not.toHaveBeenCalled();
    });

    it('applies variant classes', () => {
        render(<Button variant="danger">Delete</Button>);
        const btn = screen.getByRole('button');
        expect(btn.className).toContain('bg-danger');
    });

    it('applies size classes', () => {
        render(<Button size="lg">Large</Button>);
        const btn = screen.getByRole('button');
        expect(btn.className).toContain('h-11');
    });

    it('applies custom className', () => {
        render(<Button className="w-full">Full</Button>);
        const btn = screen.getByRole('button');
        expect(btn.className).toContain('w-full');
    });

    it('forwards ref', () => {
        const ref = { current: null };
        render(<Button ref={ref}>Ref</Button>);
        expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    });
});
