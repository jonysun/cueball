import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import App from './App';

describe('App', () => {
  it('shows teaching mode by default and switches to formula mode', () => {
    render(<App />);

    expect(screen.getByText('1. Find the object-ball path')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Formula' }));

    expect(screen.getByText(/coverage = 1 - sin/)).toBeInTheDocument();
  });

  it('toggles helper options', () => {
    render(<App />);

    const ghostBallToggle = screen.getByRole('checkbox', { name: 'Ghost ball' });

    expect(ghostBallToggle).toBeChecked();
    fireEvent.click(ghostBallToggle);
    expect(ghostBallToggle).not.toBeChecked();
  });

  it('changes the selected pocket', () => {
    render(<App />);

    fireEvent.change(screen.getByLabelText('Target pocket'), {
      target: { value: 'middle-s' }
    });

    expect(screen.getAllByText('South middle').length).toBeGreaterThanOrEqual(2);
  });
});
