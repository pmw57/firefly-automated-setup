/** @vitest-environment node */
import { describe, it, expect } from 'vitest';
import { cls } from '../../../utils/style';

describe('utils/style', () => {
  describe('cls', () => {
    it.concurrent('joins multiple string arguments', () => {
      expect(cls('a', 'b', 'c')).toBe('a b c');
    });

    it.concurrent('filters out falsy values', () => {
      expect(cls('a', false, 'b', null, 'c', undefined)).toBe('a b c');
    });

    it.concurrent('handles a mix of truthy and falsy values', () => {
      const isTrue = true;
      const isFalse = false;
      expect(cls('base', isTrue && 'is-true', isFalse && 'is-false')).toBe('base is-true');
    });

    it.concurrent('returns an empty string if no arguments are provided', () => {
      expect(cls()).toBe('');
    });

            it.concurrent('returns an empty string if only falsy arguments are provided', () => {
              expect(cls(null, undefined, false)).toBe('');
            });
          });
        });