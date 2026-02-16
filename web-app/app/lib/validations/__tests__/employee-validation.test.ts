import {
  SkillSchema,
  parseSkillsInput,
  validateSkills,
} from '../employee-validation';

describe('Employee Skill Validation', () => {
  describe('parseSkillsInput', () => {
    it('splits comma-separated skills', () => {
      expect(parseSkillsInput('React, Node, Python')).toEqual([
        'React',
        'Node',
        'Python',
      ]);
    });

    it('trims whitespace from skills', () => {
      expect(parseSkillsInput('  React  ,  Node  ')).toEqual([
        'React',
        'Node',
      ]);
    });

    it('filters out empty strings', () => {
      expect(parseSkillsInput('React,,Node,,')).toEqual(['React', 'Node']);
    });

    it('handles empty input', () => {
      expect(parseSkillsInput('')).toEqual([]);
    });

    it('handles whitespace-only input', () => {
      expect(parseSkillsInput('   ,  ,  ')).toEqual([]);
    });

    it('handles single skill', () => {
      expect(parseSkillsInput('React')).toEqual(['React']);
    });
  });

  describe('SkillSchema', () => {
    it('accepts valid skill names', () => {
      expect(SkillSchema.safeParse('BARTENDER').success).toBe(true);
      expect(SkillSchema.safeParse('LINE COOK').success).toBe(true);
      expect(SkillSchema.safeParse('FRONT-END').success).toBe(true);
    });

    it('rejects skills shorter than 2 characters', () => {
      const result = SkillSchema.safeParse('A');
      expect(result.success).toBe(false);
    });

    it('rejects skills longer than 50 characters', () => {
      const result = SkillSchema.safeParse('A'.repeat(51));
      expect(result.success).toBe(false);
    });

    it('rejects skills with special characters', () => {
      expect(SkillSchema.safeParse('REACT@JS').success).toBe(false);
      expect(SkillSchema.safeParse('NODE.JS').success).toBe(false);
      expect(SkillSchema.safeParse('C++').success).toBe(false);
      expect(SkillSchema.safeParse('SKILL!').success).toBe(false);
    });

    it('accepts skills with numbers', () => {
      expect(SkillSchema.safeParse('WEB3').success).toBe(true);
      expect(SkillSchema.safeParse('LEVEL 2 COOK').success).toBe(true);
    });
  });

  describe('validateSkills', () => {
    it('normalizes skills to uppercase', () => {
      const result = validateSkills(['react', 'node']);
      expect(result.normalized).toEqual(['REACT', 'NODE']);
    });

    it('trims whitespace from skills', () => {
      const result = validateSkills(['  REACT  ', '  NODE  ']);
      expect(result.normalized).toEqual(['REACT', 'NODE']);
    });

    it('filters out empty and whitespace-only skills', () => {
      const result = validateSkills(['REACT', '', '  ', 'NODE']);
      expect(result.valid).toBe(true);
      expect(result.normalized).toEqual(['REACT', 'NODE']);
    });

    it('detects duplicate skills (case-insensitive)', () => {
      const result = validateSkills(['React', 'REACT', 'react']);
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.toLowerCase().includes('duplicate'))).toBe(true);
      expect(result.normalized).toEqual(['REACT']);
    });

    it('rejects skills with invalid characters', () => {
      const result = validateSkills(['REACT@JS']);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('rejects skills that are too short', () => {
      const result = validateSkills(['A']);
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes('2'))).toBe(true);
    });

    it('rejects skills that are too long', () => {
      const result = validateSkills(['A'.repeat(51)]);
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes('50'))).toBe(true);
    });

    it('returns valid for empty array', () => {
      const result = validateSkills([]);
      expect(result.valid).toBe(true);
      expect(result.errors).toEqual([]);
      expect(result.normalized).toEqual([]);
    });

    it('handles single valid skill', () => {
      const result = validateSkills(['BARTENDER']);
      expect(result.valid).toBe(true);
      expect(result.normalized).toEqual(['BARTENDER']);
    });

    it('handles many valid skills', () => {
      const skills = ['BARTENDER', 'SERVER', 'LINE COOK', 'FRONT-END', 'MANAGER'];
      const result = validateSkills(skills);
      expect(result.valid).toBe(true);
      expect(result.normalized).toEqual(skills);
    });

    it('collects multiple errors', () => {
      const result = validateSkills(['A', 'REACT@JS', 'B']);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(1);
    });

    it('normalizes before duplicate detection', () => {
      const result = validateSkills(['  react  ', 'REACT']);
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.toLowerCase().includes('duplicate'))).toBe(true);
    });
  });
});
