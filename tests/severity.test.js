
const { test } = require('node:test');
const assert = require('node:assert');
const { shouldSendToDiscord, shouldPing, validateSeverity } = require('../src/utils/severity');

test('severity 0 should not send', () => {
    assert.strictEqual(shouldSendToDiscord(0), false);
    assert.strictEqual(shouldPing(0), false);
});

test('severity 255 should send with ping', () => {
    assert.strictEqual(shouldSendToDiscord(255), true);
    assert.strictEqual(shouldPing(255), true);
});

test('severity 128 should send without ping', () => {
    assert.strictEqual(shouldSendToDiscord(128), true);
    assert.strictEqual(shouldPing(128), false);
});

test('severity 1 should send with ping', () => {
    assert.strictEqual(shouldSendToDiscord(1), true);
    assert.strictEqual(shouldPing(1), true);
});

test('severity 129 should send with ping', () => {
    assert.strictEqual(shouldSendToDiscord(129), true);
    assert.strictEqual(shouldPing(129), true);
});

test('validateSeverity rejects invalid values', () => {
    assert.throws(() => validateSeverity(-1));
    assert.throws(() => validateSeverity(256));
    assert.throws(() => validateSeverity('lol'));
    assert.throws(() => validateSeverity(null));
});

test('validateSeverity accepts valid values', () => {
    assert.strictEqual(validateSeverity(0), true);
    assert.strictEqual(validateSeverity(128), true);
    assert.strictEqual(validateSeverity(255), true);
});