import { describe, it, expect } from 'vitest';
import { PROFILE } from '../../src/content/profile';

describe('Profile content integrity', () => {
  it('contains non-empty personal details', () => {
    expect(PROFILE.name.trim()).not.toBe('');
    expect(PROFILE.headline.trim()).not.toBe('');
    expect(PROFILE.cityCountry.trim()).not.toBe('');
    expect(PROFILE.email.trim()).not.toBe('');
    expect(PROFILE.github.trim()).not.toBe('');
    expect(PROFILE.linkedin.trim()).not.toBe('');
    expect(PROFILE.about.trim()).not.toBe('');
    expect(PROFILE.education.trim()).not.toBe('');
  });

  it('contains a valid list of skills', () => {
    expect(PROFILE.skills.length).toBeGreaterThan(0);
    PROFILE.skills.forEach((skill) => {
      expect(skill.trim()).not.toBe('');
    });
  });

  it('contains valid projects with stack and links', () => {
    expect(PROFILE.projects.length).toBeGreaterThanOrEqual(3);
    PROFILE.projects.forEach((proj) => {
      expect(proj.name.trim()).not.toBe('');
      expect(proj.description.trim()).not.toBe('');
      expect(proj.stack.trim()).not.toBe('');
      expect(proj.link.trim()).not.toBe('');
    });
  });

  it('contains valid experience details and bullets', () => {
    expect(PROFILE.experience.role.trim()).not.toBe('');
    expect(PROFILE.experience.org.trim()).not.toBe('');
    expect(PROFILE.experience.dates.trim()).not.toBe('');
    expect(PROFILE.experience.bullets.length).toBeGreaterThan(0);
    PROFILE.experience.bullets.forEach((bullet) => {
      expect(bullet.trim()).not.toBe('');
    });
  });

  it('contains valid certificates and achievements', () => {
    expect(PROFILE.achievements.length).toBeGreaterThan(0);
    PROFILE.achievements.forEach((ach) => {
      expect(ach.trim()).not.toBe('');
    });
  });
});

