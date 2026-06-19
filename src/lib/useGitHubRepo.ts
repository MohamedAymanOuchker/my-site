import { useEffect, useState } from 'react';

export interface RepoStats {
  stars: number;
  forks: number;
  watchers: number;
  openIssues: number;
  pushedAt: string;
  license: string | null;
  homepage: string | null;
  htmlUrl: string;
}

export interface LanguageSlice {
  name: string;
  bytes: number;
  pct: number;
}

/** Pull "owner" and "repo" out of a github.com URL. */
function parseRepo(url?: string): { owner: string; repo: string } | null {
  if (!url) return null;
  const m = url.match(/github\.com\/([^/]+)\/([^/?#]+)/i);
  if (!m) return null;
  return { owner: m[1], repo: m[2].replace(/\.git$/, '') };
}

/**
 * Fetches live repository metadata + language breakdown from the public GitHub
 * REST API. No auth (60 req/hr per visitor is plenty for a portfolio). Fails
 * silently — the caller hides the panel when `error` is set or there is no repo.
 */
export function useGitHubRepo(repoUrl?: string) {
  const [stats, setStats] = useState<RepoStats | null>(null);
  const [languages, setLanguages] = useState<LanguageSlice[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const parsed = parseRepo(repoUrl);
    setStats(null);
    setLanguages([]);
    setError(false);

    if (!parsed) {
      setLoading(false);
      return;
    }

    const { owner, repo } = parsed;
    let cancelled = false;
    setLoading(true);

    Promise.all([
      fetch(`https://api.github.com/repos/${owner}/${repo}`).then((r) => {
        if (!r.ok) throw new Error('repo lookup failed');
        return r.json();
      }),
      fetch(`https://api.github.com/repos/${owner}/${repo}/languages`).then((r) =>
        r.ok ? r.json() : {}
      ),
    ])
      .then(([repoData, langData]) => {
        if (cancelled) return;
        setStats({
          stars: repoData.stargazers_count ?? 0,
          forks: repoData.forks_count ?? 0,
          watchers: repoData.subscribers_count ?? repoData.watchers_count ?? 0,
          openIssues: repoData.open_issues_count ?? 0,
          pushedAt: repoData.pushed_at,
          license: repoData.license?.spdx_id ?? null,
          homepage: repoData.homepage || null,
          htmlUrl: repoData.html_url,
        });

        const entries = Object.entries(langData as Record<string, number>);
        const total = entries.reduce((sum, [, bytes]) => sum + bytes, 0);
        const slices = entries
          .map(([name, bytes]) => ({
            name,
            bytes,
            pct: total ? (bytes / total) * 100 : 0,
          }))
          .sort((a, b) => b.bytes - a.bytes);
        setLanguages(slices);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [repoUrl]);

  return { stats, languages, loading, error };
}
