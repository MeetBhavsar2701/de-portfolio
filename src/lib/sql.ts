import { PROFILE } from '../content/profile';

export type TableRow = Record<string, string | number>;

export const SQL_TABLES: Record<string, TableRow[]> = {
  profile: [
    {
      name: PROFILE.name,
      headline: PROFILE.headline,
      city_country: PROFILE.cityCountry,
      email: PROFILE.email,
      github: PROFILE.github,
      linkedin: PROFILE.linkedin,
      about: PROFILE.about,
      education: PROFILE.education,
    },
  ],
  skills: PROFILE.skills.map((skill, index) => ({
    id: index + 1,
    skill,
  })),
  projects: PROFILE.projects.map((p, index) => ({
    id: index + 1,
    name: p.name,
    description: p.description,
    stack: p.stack,
    link: p.link,
  })),
  experience: PROFILE.experience.bullets.map((bullet, index) => ({
    id: index + 1,
    role: PROFILE.experience.role,
    org: PROFILE.experience.org,
    dates: PROFILE.experience.dates,
    bullet,
  })),
  education: [
    {
      institution: PROFILE.education.split(',')[1]?.trim() || PROFILE.education,
      degree: PROFILE.education.split(',')[0]?.trim() || PROFILE.education,
      year: PROFILE.education.split(',')[2]?.trim() || '2025',
    },
  ],
  certificates: PROFILE.achievements.map((ach, index) => ({
    id: index + 1,
    achievement: ach,
  })),
};

export function executeSQL(query: string): string {
  const trimmed = query.trim().replace(/;$/, '');
  if (!trimmed) return '';

  const lower = trimmed.toLowerCase();

  if (lower === 'help') {
    return [
      'Supported SQL Queries:',
      '  - SHOW TABLES',
      '  - SELECT * FROM <table>',
      '  - SELECT col1, col2 FROM <table>',
      '  - SELECT ... WHERE col = \'value\'',
      '  - SELECT ... LIMIT <n>',
      '',
      'Available tables: ' + Object.keys(SQL_TABLES).join(', '),
    ].join('\n');
  }

  if (lower === 'show tables') {
    return ['Tables_in_portfolio', '-------------------', ...Object.keys(SQL_TABLES)].join(
      '\n'
    );
  }

  // Parse SELECT query regex
  // Format: SELECT <cols> FROM <table> [WHERE <col> = '<val>'] [LIMIT <n>]
  const selectMatch = trimmed.match(
    /^select\s+(.+?)\s+from\s+([a-zA-Z0-9_]+)(?:\s+where\s+([a-zA-Z0-9_]+)\s*=\s*['"](.*?)['"])?(?:\s+limit\s+(\d+))?$/i
  );

  if (!selectMatch) {
    return `SQL Syntax Error: Cannot parse query "${query}". Try 'HELP' or 'SHOW TABLES'.`;
  }

  const rawCols = selectMatch[1].trim();
  const tableName = selectMatch[2].toLowerCase();
  const whereCol = selectMatch[3]?.toLowerCase();
  const whereVal = selectMatch[4];
  const limit = selectMatch[5] ? parseInt(selectMatch[5], 10) : undefined;

  const tableData = SQL_TABLES[tableName];
  if (!tableData) {
    return `Error: Table '${tableName}' does not exist. Run 'SHOW TABLES' to list tables.`;
  }

  // Filter rows
  let rows = tableData;
  if (whereCol && whereVal !== undefined) {
    rows = rows.filter((row) => {
      const actual = row[whereCol];
      return String(actual).toLowerCase() === whereVal.toLowerCase();
    });
  }

  // Apply limit
  if (limit !== undefined) {
    rows = rows.slice(0, limit);
  }

  if (rows.length === 0) {
    return '0 rows returned.';
  }

  // Determine columns
  const allAvailableCols = Object.keys(rows[0]);
  let selectedCols: string[] = [];

  if (rawCols === '*') {
    selectedCols = allAvailableCols;
  } else {
    selectedCols = rawCols.split(',').map((c) => c.trim().toLowerCase());
    for (const c of selectedCols) {
      if (!allAvailableCols.includes(c)) {
        return `Error: Column '${c}' not found in table '${tableName}'. Available: ${allAvailableCols.join(', ')}`;
      }
    }
  }

  // Format as ASCII table
  const colWidths: Record<string, number> = {};
  for (const c of selectedCols) {
    colWidths[c] = c.length;
    for (const row of rows) {
      const strVal = String(row[c] ?? '');
      if (strVal.length > colWidths[c]) {
        colWidths[c] = Math.min(strVal.length, 60); // Cap width
      }
    }
  }

  const header = selectedCols.map((c) => c.padEnd(colWidths[c])).join(' | ');
  const divider = selectedCols.map((c) => '-'.repeat(colWidths[c])).join('-+-');

  const lines = [header, divider];
  for (const row of rows) {
    const rowStr = selectedCols
      .map((c) => String(row[c] ?? '').padEnd(colWidths[c]))
      .join(' | ');
    lines.push(rowStr);
  }

  lines.push(`\n(${rows.length} row${rows.length === 1 ? '' : 's'} in set)`);
  return lines.join('\n');
}

