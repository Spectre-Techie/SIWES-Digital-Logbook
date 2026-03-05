import { render, screen } from '@testing-library/react';
import Spinner from '../Spinner';

// Mock Phosphor icons
jest.mock('@phosphor-icons/react', () => ({
    CircleNotch: (props) => <svg data-testid="spinner-icon" {...props} />,
}));

describe('Spinner', () => {
    it('renders inline spinner by default', () => {
        render(<Spinner />);
        expect(screen.getByTestId('spinner-icon')).toBeInTheDocument();
    });

    it('renders full-page spinner when fullPage is true', () => {
        render(<Spinner fullPage />);
        expect(screen.getByText('Loading...')).toBeInTheDocument();
        expect(screen.getByTestId('spinner-icon')).toBeInTheDocument();
    });

    it('applies custom className', () => {
        const { container } = render(<Spinner className="my-custom" />);
        expect(container.firstChild.className).toContain('my-custom');
    });
});
