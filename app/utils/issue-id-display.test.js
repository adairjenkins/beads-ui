import { describe, expect, test } from 'vitest';
import { shortenIssueId } from './issue-id-display.js';

describe('utils/issue-id-display', () => {
  test('maps known prefixes to their pinned labels', () => {
    expect(shortenIssueId('sps-onboarding-agent-18a.1')).toBe('oa-18a.1');
    expect(shortenIssueId('sps-onboarding-agent-workspace-51w.7')).toBe(
      'ws-51w.7'
    );
  });

  test('keeps ids with the same suffix distinct across prefixes', () => {
    const a = shortenIssueId('sps-onboarding-agent-18a.1');
    const b = shortenIssueId('sps-onboarding-agent-workspace-18a.1');
    expect(a).not.toBe(b);
  });

  test('derives a label for unknown prefixes by dropping the org segment', () => {
    expect(shortenIssueId('sps-order-api-42')).toBe('oa-42');
    expect(shortenIssueId('acme-billing-7')).toBe('ab-7');
  });

  test('cuts single-segment prefixes rather than reducing to one letter', () => {
    expect(shortenIssueId('myproject-1')).toBe('myp-1');
  });

  test('leaves short prefixes untouched', () => {
    expect(shortenIssueId('UI-123')).toBe('UI-123');
    expect(shortenIssueId('bd-9')).toBe('bd-9');
  });

  test('shortens uuids using the random trailing group, not the timestamp', () => {
    expect(shortenIssueId('aed0e752-8aad-5b10-814c-0f9ce58043f0')).toBe(
      '0f9ce580'
    );
  });

  test('keeps uuidv7 ids minted in the same window distinct', () => {
    const a = shortenIssueId('01a015cd-c288-7d23-b6ea-49bda8686c37');
    const b = shortenIssueId('01a015cd-c702-7b5a-adaf-c6e09a98fb26');
    expect(a).not.toBe(b);
  });

  test('passes through ids with no prefix separator', () => {
    expect(shortenIssueId('123')).toBe('123');
    expect(shortenIssueId('')).toBe('');
  });
});
