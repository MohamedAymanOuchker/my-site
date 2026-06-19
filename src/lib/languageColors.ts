/** Subset of GitHub Linguist language colors, covering the repos in this portfolio. */
export const LANGUAGE_COLORS: Record<string, string> = {
  Dart: '#00B4AB',
  Python: '#3572A5',
  TypeScript: '#3178C6',
  JavaScript: '#F1E05A',
  'C++': '#F34B7D',
  C: '#555555',
  Java: '#B07219',
  MATLAB: '#E16737',
  VHDL: '#ADB2CB',
  HTML: '#E34C26',
  CSS: '#563D7C',
  SCSS: '#C6538C',
  'Jupyter Notebook': '#DA5B0B',
  Go: '#00ADD8',
  Shell: '#89E051',
  Dockerfile: '#384D54',
  CMake: '#DA3434',
  Makefile: '#427819',
  Kotlin: '#A97BFF',
  Swift: '#F05138',
  Rust: '#DEA584',
  Vue: '#41B883',
  Ruby: '#701516',
};

export function langColor(name: string): string {
  return LANGUAGE_COLORS[name] ?? '#8A8F8B';
}
