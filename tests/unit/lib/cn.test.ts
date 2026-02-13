/**
 * Unit tests for the cn utility function
 *
 * Tests the Tailwind CSS class name merging utility that combines
 * clsx for conditional classes and tailwind-merge for conflict resolution.
 */

import { describe, it, expect } from 'vitest';
import { cn } from '@/shared/lib/utils/cn';

describe('cn utility function', () => {
  describe('basic functionality', () => {
    it('merges multiple class names', () => {
      const result = cn('text-red-500', 'bg-blue-500');
      expect(result).toBe('text-red-500 bg-blue-500');
    });

    it('handles single class name', () => {
      const result = cn('text-red-500');
      expect(result).toBe('text-red-500');
    });

    it('handles empty input', () => {
      const result = cn();
      expect(result).toBe('');
    });

    it('handles undefined and null values', () => {
      const result = cn('text-red-500', undefined, null, 'bg-blue-500');
      expect(result).toBe('text-red-500 bg-blue-500');
    });
  });

  describe('conditional classes', () => {
    it('handles boolean conditions', () => {
      const isActive = true;
      const isDisabled = false;

      const result = cn(
        'base-class',
        isActive && 'active',
        isDisabled && 'disabled',
      );

      expect(result).toBe('base-class active');
    });

    it('handles object syntax for conditional classes', () => {
      const result = cn({
        'text-red-500': true,
        'bg-blue-500': false,
        'font-bold': true,
      });

      expect(result).toBe('text-red-500 font-bold');
    });

    it('handles array of classes', () => {
      const result = cn(['text-red-500', 'bg-blue-500'], 'font-bold');
      expect(result).toBe('text-red-500 bg-blue-500 font-bold');
    });
  });

  describe('Tailwind class conflict resolution', () => {
    it('resolves conflicting padding classes', () => {
      const result = cn('px-2 py-1', 'px-4');
      expect(result).toBe('py-1 px-4');
    });

    it('resolves conflicting text color classes', () => {
      const result = cn('text-red-500', 'text-blue-500');
      expect(result).toBe('text-blue-500');
    });

    it('resolves conflicting background classes', () => {
      const result = cn('bg-red-500', 'bg-blue-500');
      expect(result).toBe('bg-blue-500');
    });

    it('keeps non-conflicting classes', () => {
      const result = cn('text-red-500 p-4', 'bg-blue-500 m-2');
      expect(result).toBe('text-red-500 p-4 bg-blue-500 m-2');
    });

    it('handles responsive class conflicts', () => {
      const result = cn('px-2 md:px-4', 'px-6');
      expect(result).toBe('md:px-4 px-6');
    });
  });

  describe('real-world scenarios', () => {
    it('handles button variant classes', () => {
      const variant = 'primary';
      const size = 'large';

      const result = cn(
        'rounded-md font-semibold transition-colors',
        variant === 'primary' && 'bg-blue-500 text-white hover:bg-blue-600',
        variant === 'secondary' && 'bg-gray-200 text-gray-900 hover:bg-gray-300',
        size === 'large' && 'px-6 py-3 text-lg',
        size === 'small' && 'px-3 py-1 text-sm',
      );

      expect(result).toContain('bg-blue-500');
      expect(result).toContain('px-6 py-3');
      expect(result).not.toContain('bg-gray-200');
    });

    it('handles conditional state classes', () => {
      const isDisabled = false;
      const isLoading = true;
      const hasError = false;

      const result = cn(
        'btn',
        isDisabled && 'opacity-50 cursor-not-allowed',
        isLoading && 'cursor-wait',
        hasError && 'border-red-500',
      );

      expect(result).toBe('btn cursor-wait');
    });

    it('handles complex component classes with overrides', () => {
      // Base component classes
      const baseClasses = 'px-4 py-2 rounded bg-blue-500 text-white';

      // User-provided override classes
      const overrideClasses = 'bg-red-500 px-6';

      const result = cn(baseClasses, overrideClasses);

      // Should use override values
      expect(result).toContain('bg-red-500');
      expect(result).toContain('px-6');

      // Should keep non-conflicting base classes
      expect(result).toContain('py-2');
      expect(result).toContain('rounded');
      expect(result).toContain('text-white');

      // Should not include overridden classes
      expect(result).not.toContain('bg-blue-500');
      expect(result).not.toContain('px-4');
    });
  });
});
