import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import { HUD } from '../../src/ui/HUD';
import { PROFILE } from '../../src/content/profile';

describe('HUD component', () => {
  it('renders profile name and headline without crashing', () => {
    const { getByText } = render(<HUD />);
    expect(getByText(PROFILE.name)).toBeInTheDocument();
    expect(getByText(PROFILE.headline)).toBeInTheDocument();
  });

  it('renders 2D resume link', () => {
    const { getByText } = render(<HUD />);
    const link = getByText('Skip to 2D Resume');
    expect(link).toBeInTheDocument();
    expect(link.getAttribute('href')).toBe('/resume/');
  });
});

