import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import Loader from './Loader';

describe('Loader', () => {
  it('should renders without crashing', () => {
    render(<Loader variant="fullscreen" />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });
});
