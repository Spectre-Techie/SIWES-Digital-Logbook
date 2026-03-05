import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ThemeToggle from '../ThemeToggle';

// Mock next-themes
const mockSetTheme = jest.fn();
jest.mock('next-themes', () => ({
    useTheme: () => ({
        theme: 'system',
        setTheme: mockSetTheme,
    }),
}));

// Mock Phosphor icons
jest.mock('@phosphor-icons/react', () => ({
    Sun: (props) => <svg data-testid="icon-sun" {...props} />,
    Moon: (props) => <svg data-testid="icon-moon" {...props} />,
    Desktop: (props) => <svg data-testid="icon-desktop" {...props} />,
}));

describe('ThemeToggle', () => {
    beforeEach(() => {
        mockSetTheme.mockClear();
    });

    it('renders three theme buttons after mount', () => {
        render(<ThemeToggle />);
        expect(screen.getByRole('button', { name: 'System theme' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Light theme' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Dark theme' })).toBeInTheDocument();
    });

    it('calls setTheme with "light" when light button is clicked', async () => {
        const user = userEvent.setup();
        render(<ThemeToggle />);
        await user.click(screen.getByRole('button', { name: 'Light theme' }));
        expect(mockSetTheme).toHaveBeenCalledWith('light');
    });

    it('calls setTheme with "dark" when dark button is clicked', async () => {
        const user = userEvent.setup();
        render(<ThemeToggle />);
        await user.click(screen.getByRole('button', { name: 'Dark theme' }));
        expect(mockSetTheme).toHaveBeenCalledWith('dark');
    });

    it('calls setTheme with "system" when system button is clicked', async () => {
        const user = userEvent.setup();
        render(<ThemeToggle />);
        await user.click(screen.getByRole('button', { name: 'System theme' }));
        expect(mockSetTheme).toHaveBeenCalledWith('system');
    });

    it('renders all three icons', () => {
        render(<ThemeToggle />);
        expect(screen.getByTestId('icon-desktop')).toBeInTheDocument();
        expect(screen.getByTestId('icon-sun')).toBeInTheDocument();
        expect(screen.getByTestId('icon-moon')).toBeInTheDocument();
    });

    it('applies custom className', () => {
        const { container } = render(<ThemeToggle className="mt-4" />);
        expect(container.firstChild.className).toContain('mt-4');
    });
});
