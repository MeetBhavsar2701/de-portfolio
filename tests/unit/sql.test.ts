import { describe, it, expect } from 'vitest';
import { executeSQL } from '../../src/lib/sql';

describe('SQL Interpreter tests (14 queries)', () => {
  it('1. returns help instructions', () => {
    const res = executeSQL('HELP');
    expect(res).toContain('Supported SQL Queries:');
    expect(res).toContain('SHOW TABLES');
  });

  it('2. lists all available tables in SHOW TABLES', () => {
    const res = executeSQL('SHOW TABLES');
    expect(res).toContain('skills');
    expect(res).toContain('projects');
    expect(res).toContain('experience');
  });

  it('3. selects all columns from skills', () => {
    const res = executeSQL('SELECT * FROM skills');
    expect(res).toContain('skill');
    expect(res).toContain('Python');
    expect(res).toContain('Kafka');
  });

  it('4. case-insensitivity on commands and table names', () => {
    const res = executeSQL('select * from SKILLS');
    expect(res).toContain('Python');
  });

  it('5. selects specific column', () => {
    const res = executeSQL('SELECT skill FROM skills');
    expect(res).toContain('Python');
    expect(res).not.toContain('id |');
  });

  it('6. selects multiple specific columns from projects', () => {
    const res = executeSQL('SELECT name, stack FROM projects');
    expect(res).toContain('StreamPulse');
    expect(res).toContain('Kafka, PySpark, Delta Lake, Docker');
  });

  it('7. applies WHERE condition accurately', () => {
    const res = executeSQL("SELECT * FROM skills WHERE skill = 'Python'");
    expect(res).toContain('Python');
    expect(res).not.toContain('Kafka');
    expect(res).toContain('1 row in set');
  });

  it('8. applies LIMIT clause correctly', () => {
    const res = executeSQL('SELECT * FROM skills LIMIT 2');
    expect(res).toContain('2 rows in set');
  });

  it('9. queries experience table', () => {
    const res = executeSQL('SELECT role, org FROM experience');
    expect(res).toContain('Data Platform Intern');
    expect(res).toContain('Nexus Data Labs');
  });

  it('10. queries education table', () => {
    const res = executeSQL('SELECT * FROM education');
    expect(res).toContain('Computer Science');
  });

  it('11. queries certificates table', () => {
    const res = executeSQL('SELECT * FROM certificates');
    expect(res).toContain('AWS Certified Data Engineer');
  });

  it('12. handles trailing semicolons gracefully', () => {
    const res = executeSQL('SELECT * FROM profile;');
    expect(res).toContain('Alex Rivera');
  });

  it('13. returns friendly error for non-existent table', () => {
    const res = executeSQL('SELECT * FROM secret_logs');
    expect(res).toContain("Error: Table 'secret_logs' does not exist");
  });

  it('14. returns friendly error for invalid column and syntax', () => {
    const resCol = executeSQL('SELECT nonexistent_col FROM skills');
    expect(resCol).toContain("Error: Column 'nonexistent_col' not found");

    const resSyntax = executeSQL('DELETE FROM skills');
    expect(resSyntax).toContain('SQL Syntax Error');
  });
});
