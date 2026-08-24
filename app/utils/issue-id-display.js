/**
 * Labels for known workspace prefixes. Anything not listed falls back to
 * `derivePrefixLabel`. Add an entry here to pin a prefix to a specific label.
 *
 * @type {Record<string, string>}
 */
const PREFIX_LABELS = {
  'sps-onboarding-agent': 'oa',
  'sps-onboarding-agent-workspace': 'ws'
};

/** Prefixes this short already carry their meaning, so they pass through. */
const PASSTHROUGH_PREFIX_LENGTH = 4;

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Build a label from a hyphenated prefix by taking the first letter of each
 * segment. Prefixes of three or more segments drop the first one, which is the
 * org name and constant across every workspace (`sps-onboarding-agent` → `oa`).
 * A prefix with no hyphens has no initials to take, so it is cut to three
 * characters instead.
 *
 * @param {string} prefix
 * @returns {string}
 */
function derivePrefixLabel(prefix) {
  const segments = prefix.split('-').filter(Boolean);
  if (segments.length === 1) {
    return segments[0].slice(0, 3);
  }
  const meaningful = segments.length > 2 ? segments.slice(1) : segments;
  return meaningful.map((segment) => segment[0]).join('');
}

/**
 * Shorten a full issue ID down to the part that distinguishes it from its
 * neighbours, for display in narrow contexts like the issues table ID column.
 * The full ID is still what gets copied to the clipboard and shown on hover,
 * so this only ever affects what is painted on screen.
 *
 * Beads IDs are `<prefix>-<suffix>`, where the prefix is the workspace name and
 * may itself contain hyphens (`sps-onboarding-agent-workspace-51w.7`). A single
 * database can hold more than one prefix, and a few rows carry raw UUIDs
 * instead (`aed0e752-8aad-5b10-814c-0f9ce58043f0`).
 *
 * @param {string} id - Full issue id including the prefix (e.g., "UI-123").
 * @returns {string} Text to display in place of the full id.
 */
export function shortenIssueId(id) {
  const full = String(id || '');
  if (!full) {
    return full;
  }
  if (UUID_RE.test(full)) {
    // These are UUIDv7: the leading groups encode a timestamp and are shared
    // by every id minted in the same window. The trailing group is the random
    // part, so it is the only slice that reliably tells them apart.
    return full.slice(-12, -4);
  }
  const split_at = full.lastIndexOf('-');
  if (split_at <= 0) {
    return full;
  }
  const prefix = full.slice(0, split_at);
  const suffix = full.slice(split_at + 1);
  if (prefix.length <= PASSTHROUGH_PREFIX_LENGTH) {
    return full;
  }
  const label = PREFIX_LABELS[prefix] || derivePrefixLabel(prefix);
  return `${label}-${suffix}`;
}
