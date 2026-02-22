#!/usr/bin/env node

/**
 * Security Setup Verification Script
 * 
 * This script verifies that the security policy and related files are properly configured.
 * Run with: node scripts/verify-security-setup.js
 */

import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

console.log('🔒 FlowFi Security Setup Verification\n');

const checks = [
  {
    name: 'SECURITY.md exists',
    check: () => existsSync(join(rootDir, 'SECURITY.md')),
    fix: 'Create SECURITY.md file in the root directory'
  },
  {
    name: 'README.md references security policy',
    check: () => {
      const readme = readFileSync(join(rootDir, 'README.md'), 'utf8');
      return readme.includes('SECURITY.md') || readme.includes('Security Policy');
    },
    fix: 'Add a security section to README.md that links to SECURITY.md'
  },
  {
    name: 'CONTRIBUTING.md references security policy',
    check: () => {
      if (!existsSync(join(rootDir, 'CONTRIBUTING.md'))) return true; // Optional file
      const contributing = readFileSync(join(rootDir, 'CONTRIBUTING.md'), 'utf8');
      return contributing.includes('SECURITY.md') || contributing.includes('security');
    },
    fix: 'Add a security section to CONTRIBUTING.md'
  },
  {
    name: 'GitHub issue template for security exists',
    check: () => existsSync(join(rootDir, '.github/ISSUE_TEMPLATE/security.md')),
    fix: 'Create .github/ISSUE_TEMPLATE/security.md'
  },
  {
    name: 'Security workflow exists',
    check: () => existsSync(join(rootDir, '.github/workflows/security.yml')),
    fix: 'Create .github/workflows/security.yml for automated security checks'
  },
  {
    name: 'SECURITY.md contains required sections',
    check: () => {
      if (!existsSync(join(rootDir, 'SECURITY.md'))) return false;
      const security = readFileSync(join(rootDir, 'SECURITY.md'), 'utf8');
      const requiredSections = [
        'Supported Versions',
        'Reporting a Vulnerability',
        'Response Timeline',
        'Disclosure Policy'
      ];
      return requiredSections.every(section => 
        security.toLowerCase().includes(section.toLowerCase())
      );
    },
    fix: 'Ensure SECURITY.md contains all required sections'
  }
];

let passed = 0;
let failed = 0;

checks.forEach((check, index) => {
  try {
    const result = check.check();
    if (result) {
      console.log(`✅ ${check.name}`);
      passed++;
    } else {
      console.log(`❌ ${check.name}`);
      console.log(`   Fix: ${check.fix}\n`);
      failed++;
    }
  } catch (error) {
    console.log(`❌ ${check.name} (Error: ${error.message})`);
    console.log(`   Fix: ${check.fix}\n`);
    failed++;
  }
});

console.log(`\n📊 Results: ${passed} passed, ${failed} failed`);

if (failed === 0) {
  console.log('\n🎉 All security setup checks passed!');
  console.log('\nNext steps:');
  console.log('1. Commit and push these changes');
  console.log('2. Configure GitHub repository security settings (see .github/SECURITY_SETUP_CHECKLIST.md)');
  console.log('3. Test the private vulnerability reporting feature');
} else {
  console.log('\n⚠️  Some security setup checks failed. Please address the issues above.');
  process.exit(1);
}