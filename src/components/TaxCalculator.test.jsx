import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import TaxCalculator from './TaxCalculator';

// Mock the InfoTooltip component as its implementation details are not relevant here
vi.mock('./InfoTooltip', () => ({
    default: ({ term }) => <span>{term}</span>, // Simple mock displaying the term
}));

describe('TaxCalculator', () => {
    it('should render initial state correctly', () => {
        render(<TaxCalculator />);
        
        // Check initial labels and values
        expect(screen.getByLabelText(/Enter Est. Annual Gains\/Dividends/)).toBeInTheDocument();
        expect(screen.getByLabelText(/Enter Est. Annual Gains\/Dividends/)).toHaveValue('');
        expect(screen.getByText(/Covered by Pauschbetrag:/)).toHaveTextContent('€ 0,00');
        expect(screen.getByText(/Potentially Taxable Amount:/)).toHaveTextContent('€ 0,00');
    });

    it('should update amounts when user types gains below allowance', async () => {
        const user = userEvent.setup();
        render(<TaxCalculator />);
        
        const input = screen.getByLabelText(/Enter Est. Annual Gains\/Dividends/);
        await user.type(input, '500');

        expect(input).toHaveValue('500');
        expect(screen.getByText(/Covered by Pauschbetrag:/)).toHaveTextContent('€ 500,00');
        expect(screen.getByText(/Potentially Taxable Amount:/)).toHaveTextContent('€ 0,00');
    });

    it('should update amounts when user types gains above allowance', async () => {
        const user = userEvent.setup();
        render(<TaxCalculator />);
        
        const input = screen.getByLabelText(/Enter Est. Annual Gains\/Dividends/);
        await user.type(input, '1500.75');

        expect(input).toHaveValue('1500.75');
        expect(screen.getByText(/Covered by Pauschbetrag:/)).toHaveTextContent('€ 1.000,00');
        expect(screen.getByText(/Potentially Taxable Amount:/)).toHaveTextContent('€ 500,75');
    });

    it('should handle clearing the input', async () => {
        const user = userEvent.setup();
        render(<TaxCalculator />);
        
        const input = screen.getByLabelText(/Enter Est. Annual Gains\/Dividends/);
        await user.type(input, '123');
        expect(input).toHaveValue('123');

        await user.clear(input);
        expect(input).toHaveValue('');
        expect(screen.getByText(/Covered by Pauschbetrag:/)).toHaveTextContent('€ 0,00');
        expect(screen.getByText(/Potentially Taxable Amount:/)).toHaveTextContent('€ 0,00');
    });

    it('should ignore non-numeric input', async () => {
        const user = userEvent.setup();
        render(<TaxCalculator />);
        
        const input = screen.getByLabelText(/Enter Est. Annual Gains\/Dividends/);
        await user.type(input, 'abc');
        expect(input).toHaveValue('');

        await user.type(input, '12a3');
        expect(input).toHaveValue('123'); // Should only accept numbers
    });
}); 