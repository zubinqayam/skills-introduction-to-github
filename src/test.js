/**
 * Test Suite for MapCore DeepReview System
 */

const MapCoreDeepReview = require('./index');
const MappingEngine = require('./mapping-engine');
const RegistryLayer = require('./registry-layer');
const DeepReviewProtocol = require('./deepreview-protocol');
const IngestionModule = require('./ingestion');

// Simple test framework
const tests = [];
let passed = 0;
let failed = 0;

function test(name, fn) {
  tests.push({ name, fn });
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
}

function assertEquals(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(message || `Expected ${expected} but got ${actual}`);
  }
}

function runTests() {
  console.log('Running MapCore DeepReview Tests\n');
  console.log('='.repeat(50));

  tests.forEach(({ name, fn }) => {
    try {
      fn();
      console.log(`✓ ${name}`);
      passed++;
    } catch (error) {
      console.log(`✗ ${name}`);
      console.log(`  Error: ${error.message}`);
      failed++;
    }
  });

  console.log('='.repeat(50));
  console.log(`\nResults: ${passed} passed, ${failed} failed, ${tests.length} total\n`);
}

// Test: Mapping Engine
test('MappingEngine: Generate ID', () => {
  const engine = new MappingEngine();
  const topicId = engine.generateId('topic');
  assert(topicId.startsWith('T-'), 'Topic ID should start with T-');
  
  const matterId = engine.generateId('matter');
  assert(matterId.startsWith('M-'), 'Matter ID should start with M-');
});

test('MappingEngine: Generate Content Hash', () => {
  const engine = new MappingEngine();
  const hash = engine.generateContentHash('test content');
  assert(hash.startsWith('sha256:'), 'Hash should start with sha256:');
  assert(hash.length > 7, 'Hash should have content after prefix');
});

test('MappingEngine: Build Map', () => {
  const engine = new MappingEngine();
  const map = engine.buildMap({
    topicName: 'Test Topic',
    topicId: 'T-0001',
    data: []
  });
  
  assert(map.topic, 'Map should have topic');
  assertEquals(map.topic.name, 'Test Topic', 'Topic name should match');
  assertEquals(map.topic.id, 'T-0001', 'Topic ID should match');
  assert(Array.isArray(map.topic.subtopics), 'Subtopics should be an array');
});

test('MappingEngine: Hierarchical Classifier', () => {
  const engine = new MappingEngine();
  const classified = engine.hierarchicalClassifier({ name: 'Test' }, 'subject');
  
  assert(classified.id.startsWith('S-'), 'Subject ID should start with S-');
  assertEquals(classified.name, 'Test', 'Name should match');
  assertEquals(classified.level, 'subject', 'Level should be subject');
});

// Test: Registry Layer
test('RegistryLayer: Register and Retrieve', () => {
  const registry = new RegistryLayer();
  const testData = { name: 'Test Data' };
  
  registry.register('test-001', testData);
  const retrieved = registry.retrieve('test-001');
  
  assert(retrieved, 'Data should be retrieved');
  assertEquals(retrieved.name, 'Test Data', 'Retrieved data should match');
});

test('RegistryLayer: Version Control', () => {
  const registry = new RegistryLayer();
  registry.register('test-002', { version: 1 });
  
  const version = registry.createVersion('test-002', { version: 2 }, 'Updated to v2');
  assertEquals(version.version, 1, 'Version number should be 1');
  assertEquals(version.comment, 'Updated to v2', 'Comment should match');
  
  const history = registry.getVersionHistory('test-002');
  assertEquals(history.length, 1, 'Should have 1 version in history');
});

test('RegistryLayer: Access Control', () => {
  const registry = new RegistryLayer();
  registry.setAccessControl('test-003', 'user-001', ['read', 'write']);
  
  assert(registry.hasPermission('test-003', 'user-001', 'read'), 'User should have read permission');
  assert(registry.hasPermission('test-003', 'user-001', 'write'), 'User should have write permission');
  assert(!registry.hasPermission('test-003', 'user-001', 'delete'), 'User should not have delete permission');
});

test('RegistryLayer: Sync Queue', () => {
  const registry = new RegistryLayer();
  const queuePos = registry.queueSync({ id: 'item-001', data: 'test' });
  
  assertEquals(queuePos, 1, 'Queue position should be 1');
  
  const processed = registry.processSyncQueue();
  assertEquals(processed.length, 1, 'Should process 1 item');
  assertEquals(processed[0].status, 'synced', 'Item should be synced');
});

// Test: DeepReview Protocol
test('DeepReviewProtocol: Pre-Mapping Validation', () => {
  const protocol = new DeepReviewProtocol();
  const result = protocol.preMappingValidation({
    name: 'Test Data',
    content: 'This is test content'
  });
  
  assertEquals(result.status, 'passed', 'Validation should pass');
  assert(result.initialHash, 'Should have initial hash');
  assert(result.checks.length > 0, 'Should have checks');
});

test('DeepReviewProtocol: Generate Integrity Hash', () => {
  const protocol = new DeepReviewProtocol();
  const hash1 = protocol.generateIntegrityHash({ name: 'Test' });
  const hash2 = protocol.generateIntegrityHash({ name: 'Test' });
  
  assertEquals(hash1, hash2, 'Same data should produce same hash');
  assert(hash1.startsWith('sha256:'), 'Hash should start with sha256:');
});

test('DeepReviewProtocol: Audit Trail', () => {
  const protocol = new DeepReviewProtocol();
  protocol.addToAuditTrail('test-action', { detail: 'test' });
  
  const trail = protocol.getAuditTrail();
  assertEquals(trail.length, 1, 'Should have 1 audit entry');
  assertEquals(trail[0].action, 'test-action', 'Action should match');
});

test('DeepReviewProtocol: Structure Verification', () => {
  const protocol = new DeepReviewProtocol();
  const result = protocol.verifyStructure({
    topic: {
      id: 'T-001',
      name: 'Test Topic',
      subtopics: []
    }
  });
  
  assertEquals(result.name, 'Structure Verification', 'Check name should match');
  assert(result.passed, 'Structure verification should pass');
});

// Test: Ingestion Module
test('IngestionModule: Extract from Object', () => {
  const ingestion = new IngestionModule();
  const extracted = ingestion.extractFromObject({ name: 'Test', content: 'Data' });
  
  assertEquals(extracted.name, 'Test', 'Name should match');
  assertEquals(extracted.content, 'Data', 'Content should match');
});

test('IngestionModule: Detect Format', () => {
  const ingestion = new IngestionModule();
  
  assertEquals(ingestion.detectFormat('plain text'), 'text', 'Should detect text');
  assertEquals(ingestion.detectFormat('{"key":"value"}'), 'json', 'Should detect JSON');
  assertEquals(ingestion.detectFormat({ key: 'value' }), 'object', 'Should detect object');
});

test('IngestionModule: Capture Metadata', () => {
  const ingestion = new IngestionModule();
  const metadata = ingestion.captureMetadata({
    name: 'Test',
    content: 'Some content',
    source: 'Test Source'
  });
  
  assert(metadata.capturedAt, 'Should have capture timestamp');
  assertEquals(metadata.dataType, 'object', 'Data type should be object');
  assertEquals(metadata.name, 'Test', 'Name should be captured');
  assertEquals(metadata.source, 'Test Source', 'Source should be captured');
});

test('IngestionModule: Process Pipeline', () => {
  const ingestion = new IngestionModule();
  const result = ingestion.process({ name: 'Test', content: 'Data' });
  
  assertEquals(result.status, 'ingested', 'Status should be ingested');
  assertEquals(result.format, 'object', 'Format should be object');
  assert(result.data, 'Should have data');
  assert(result.metadata, 'Should have metadata');
});

// Test: Complete MapCore DeepReview System
test('MapCoreDeepReview: Complete Process Flow', () => {
  const mcdr = new MapCoreDeepReview();
  
  const testData = {
    name: 'Test Topic',
    content: 'Test content for processing',
    source: 'Test Source'
  };
  
  const result = mcdr.process(testData, { topicName: 'Test Topic' });
  
  assertEquals(result.status, 'complete', 'Processing should complete');
  assert(result.phases.ingestion, 'Should have ingestion phase');
  assert(result.phases.preMappingValidation, 'Should have pre-mapping validation');
  assert(result.phases.mapping, 'Should have mapping phase');
  assert(result.phases.postMappingVerification, 'Should have post-mapping verification');
  assert(result.phases.registry, 'Should have registry phase');
  assert(result.mappedData, 'Should have mapped data');
});

test('MapCoreDeepReview: Retrieve from Registry', () => {
  const mcdr = new MapCoreDeepReview();
  
  const testData = {
    name: 'Retrievable Topic',
    content: 'Test content'
  };
  
  const result = mcdr.process(testData);
  const registryId = result.phases.registry.id;
  
  const retrieved = mcdr.retrieve(registryId);
  assert(retrieved, 'Should retrieve data');
  assert(retrieved.topic, 'Retrieved data should have topic');
});

test('MapCoreDeepReview: System Statistics', () => {
  const mcdr = new MapCoreDeepReview();
  
  mcdr.process({ name: 'Test', content: 'Data' });
  
  const stats = mcdr.getStats();
  assert(stats.registry, 'Should have registry stats');
  assert(stats.auditTrail, 'Should have audit trail stats');
  assert(stats.registry.totalEntries > 0, 'Should have registry entries');
});

test('MapCoreDeepReview: Export System State', () => {
  const mcdr = new MapCoreDeepReview();
  
  mcdr.process({ name: 'Test', content: 'Data' });
  
  const exported = mcdr.export();
  assert(exported.registry, 'Should have registry data');
  assert(exported.auditTrail, 'Should have audit trail');
  assert(exported.exportedAt, 'Should have export timestamp');
});

// Run all tests
runTests();
