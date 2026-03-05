import { render, screen } from '@testing-library/react';
import StatusBadge from '../StatusBadge';

// Mock Phosphor icons
jest.mock('@phosphor-icons/react', () => ({
    Clock: (props) => <svg data-testid="icon-clock" {...props} />,
    CheckCircle: (props) => <svg data-testid="icon-check" {...props} />,
    XCircle: (props) => <svg data-testid="icon-x" {...props} />,
}));

describe('StatusBadge', () => {
    it('renders pending status', () => {
        render(<StatusBadge status="pending" />);
        expect(screen.getByText('Pending')).toBeInTheDocument();
        expect(screen.getByTestId('icon-clock')).toBeInTheDocument();
    });

    it('renders approved status', () => {
        render(<StatusBadge status="approved" />);
        expect(screen.getByText('Approved')).toBeInTheDocument();
        expect(screen.getByTestId('icon-check')).toBeInTheDocument();
    });

    it('renders rejected status', () => {
        render(<StatusBadge status="rejected" />);
        expect(screen.getByText('Rejected')).toBeInTheDocument();
        expect(screen.getByTestId('icon-x')).toBeInTheDocument();
    });

    it('applies correct badge class for each status', () => {
        const { container, rerender } = render(<StatusBadge status="pending" />);
        expect(container.firstChild.className).toContain('badge-pending');

        rerender(<StatusBadge status="approved" />);
        expect(container.firstChild.className).toContain('badge-approved');

        rerender(<StatusBadge status="rejected" />);
        expect(container.firstChild.className).toContain('badge-rejected');
    });

    it('defaults to pending for unknown status', () => {
        render(<StatusBadge status="unknown" />);
        expect(screen.getByText('Pending')).toBeInTheDocument();
    });

    it('applies md size classes when size="md"', () => {
        const { container } = render(<StatusBadge status="pending" size="md" />);
        expect(container.firstChild.className).toContain('px-3');
    });
});
