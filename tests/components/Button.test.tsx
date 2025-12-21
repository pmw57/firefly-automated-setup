/** @vitest-environment jsdom */
import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { render } from '../test-utils';
import { Button } from '../../components/Button';

describe('components/Button', () => {
  it('renders children correctly', () => {
    render(<Button>Click Me</Button>);
    expect(screen.getByRole('button', { name: /Click Me/i })).toBeInTheDocument();
  });

  it('handles onClick events', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies fullWidth class', () => {
    render(<Button fullWidth>Wide</Button>);
    expect(screen.getByRole('button')).toHaveClass('w-full');
  });

  it('is disabled when the disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  // The test environment is configured for dark mode by default (see tests/setup.ts)
  describe('Variant Styling (Dark Mode)', () => {
    it('applies correct dark mode styles for each variant', () => {
      const { rerender } = render(<Button variant="primary">Test</Button>);
      expect(screen.getByRole('button')).toHaveClass('bg-emerald-900');
      
      rerender(<Button variant="secondary">Test</Button>);
      expect(screen.getByRole('button')).toHaveClass('bg-amber-900/60');
      
      rerender(<Button variant="danger">Test</Button>);
      expect(screen.getByRole('button')).toHaveClass('bg-red-900');
    });
  });
});