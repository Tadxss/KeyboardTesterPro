import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ModeSelector from './ModeSelector';
import { testModes } from '../data/testModes';

describe('ModeSelector', () => {
  it('shows the current mode name on the trigger button', () => {
    render(
      <ModeSelector
        testModes={testModes}
        testMode="basic"
        currentModeName="Basic"
        onSelect={() => {}}
      />
    );
    expect(screen.getByRole('button', { name: /Basic Mode/ })).toBeInTheDocument();
  });

  it('opens the menu and calls onSelect with the chosen mode key, then closes the menu', async () => {
    const onSelect = vi.fn();
    render(
      <ModeSelector
        testModes={testModes}
        testMode="basic"
        currentModeName="Basic"
        onSelect={onSelect}
      />
    );

    await userEvent.click(screen.getByRole('button', { name: /Basic Mode/ }));
    expect(screen.getByText('Professional')).toBeInTheDocument();

    await userEvent.click(screen.getByText('Professional'));
    expect(onSelect).toHaveBeenCalledWith('pro');
    expect(
      screen.queryByText('Simple keyboard testing - just visual feedback')
    ).not.toBeInTheDocument();
  });
});
