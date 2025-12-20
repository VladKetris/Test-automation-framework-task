/**
 * Fixtures Module
 * 
 * Single import for all tests.
 */

import { expect } from '@playwright/test';
import { matchers } from '@utils/matchers';

expect.extend(matchers);

export { test } from './steps.fixture';
export { expect } from '@playwright/test';