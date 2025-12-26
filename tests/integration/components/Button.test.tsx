/** @vitest-environment jsdom */
import { describe, it, expect, vi } from 'vitest';
// FIX: `fireEvent` and `within` are not exported from `test-utils`, import from `@testing-library/react` instead.
import { fireEvent, within } from '@testing-library/react';
import { render } from '../../test-utils';
import { Button } from '../../../components/Button';

describe('components/Button', () => {
  it.concurrent('renders children correctly', () => {
    const { container } = render(<Button>Click Me</Button>);
    expect(within(container).getByRole('button', { name: /^Click Me$/i })).toBeInTheDocument();
  });

  it.concurrent('handles onClick events', () => {
    const handleClick = vi.fn();
    const { container } = render(<Button onClick={handleClick}>Click</Button>);
    fireEvent.click(within(container).getByRole('button', { name: /^Click$/i }));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it.concurrent('applies fullWidth class', () => {
    const { container } = render(<Button fullWidth>Wide</Button>);
    expect(within(container).getByRole('button', { name: /^Wide$/i })).toHaveClass('w-full');
  });

  it.concurrent('is disabled when the disabled prop is true', () => {
    const { container } = render(<Button disabled>Disabled</Button>);
    expect(within(container).getByRole('button', { name: /^Disabled$/i })).toBeDisabled();
  });

  // The test environment is configured for dark mode by default (see tests/setup.ts)
  describe('Variant Styling (Dark Mode)', () => {
    it.concurrent('applies correct dark mode styles for each variant', () => {
      const { container, rerender } = render(<Button variant="primary">Test</Button>);
      expect(within(container).getByRole('button', { name: /^Test$/i })).toHaveClass('bg-emerald-900');
      
      rerender(<Button variant="secondary">Test</Button>);
      expect(within(container).getByRole('button', { name: /^Test$/i })).toHaveClass('bg-amber-900/60');
      
      rerender(<Button variant="danger">Test</Button>);
      expect(within(container).getByRole('button', { name: /^Test$/i })).toHaveClass('bg-red-900');
    });
  });
});