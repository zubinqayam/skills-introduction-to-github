/**
 * Example demonstrating the complete MapCore DeepReview workflow
 * with the Cybersecurity use case from the problem statement
 */

const MapCoreDeepReview = require('./index');

console.log('='.repeat(70));
console.log('MapCore DeepReview - Cybersecurity Example');
console.log('='.repeat(70));
console.log();

// Initialize the system
const mcdr = new MapCoreDeepReview();

// Example unstructured data matching the problem statement
const cybersecurityData = {
  name: 'Cybersecurity',
  subtopics: [{
    subtopicName: 'Threat Intelligence',
    subjects: [{
      name: 'Advanced Persistent Threats',
      matters: [{
        name: 'APT29 Analysis Report',
        content: 'APT29 (also known as Cozy Bear) is a sophisticated threat actor attributed to Russian intelligence. Their tactics include spear-phishing, watering hole attacks, and zero-day exploits. Recent analysis shows increased targeting of cloud infrastructure and supply chain vulnerabilities.',
        source: 'Internal Analysis',
        date_created: '2025-11-15',
        review_status: 'verified'
      }, {
        name: 'APT28 Infrastructure Analysis',
        content: 'APT28 (Fancy Bear) infrastructure analysis reveals a complex network of C2 servers utilizing multiple layers of obfuscation and fast-flux DNS techniques.',
        source: 'External Intelligence',
        date_created: '2025-11-10',
        review_status: 'verified'
      }]
    }, {
      name: 'Malware Analysis',
      matters: [{
        name: 'Ransomware Trends Q4 2025',
        content: 'Q4 2025 has seen a 45% increase in ransomware attacks targeting healthcare and critical infrastructure sectors. New variants demonstrate advanced evasion techniques.',
        source: 'Security Operations Center',
        date_created: '2025-11-20',
        review_status: 'verified'
      }]
    }]
  }, {
    subtopicName: 'Vulnerability Management',
    subjects: [{
      name: 'Critical CVEs',
      matters: [{
        name: 'CVE-2025-XXXX Analysis',
        content: 'Critical remote code execution vulnerability in widely-used web framework. CVSS score 9.8. Proof-of-concept exploit available. Immediate patching recommended.',
        source: 'Vulnerability Research Team',
        date_created: '2025-11-18',
        review_status: 'pending'
      }]
    }]
  }]
};

console.log('Step 1: Processing Unstructured Data');
console.log('-'.repeat(70));

// Process the data through the complete MCDR pipeline
const result = mcdr.process(cybersecurityData, {
  topicName: 'Cybersecurity',
  topicId: 'T-001'
});

console.log(`Status: ${result.status}`);
console.log(`Processing Time: ${result.timestamp}`);
console.log();

// Display processing phases
console.log('Step 2: Processing Phases');
console.log('-'.repeat(70));

console.log('\n📥 Phase 1: Ingestion');
console.log(`   Format: ${result.phases.ingestion.format}`);
console.log(`   Status: ${result.phases.ingestion.status}`);
console.log(`   Keys in data: ${result.phases.ingestion.metadata.keys.join(', ')}`);

console.log('\n🔍 Pre-Mapping Validation');
console.log(`   Status: ${result.phases.preMappingValidation.status}`);
console.log(`   Initial Hash: ${result.phases.preMappingValidation.initialHash.substring(0, 20)}...`);
console.log(`   Checks Performed: ${result.phases.preMappingValidation.checks.length}`);
result.phases.preMappingValidation.checks.forEach(check => {
  console.log(`   - ${check.name}: ${check.passed ? '✓' : '✗'}`);
});

console.log('\n🗺️  Phase 2: Hierarchical Mapping');
console.log(`   Topic ID: ${result.phases.mapping.topic.id}`);
console.log(`   Topic Name: ${result.phases.mapping.topic.name}`);
console.log(`   Subtopics: ${result.phases.mapping.topic.subtopics.length}`);

let totalSubjects = 0;
let totalMatters = 0;
result.phases.mapping.topic.subtopics.forEach(st => {
  totalSubjects += st.subjects.length;
  st.subjects.forEach(subj => {
    totalMatters += subj.matters.length;
  });
});
console.log(`   Total Subjects: ${totalSubjects}`);
console.log(`   Total Matters: ${totalMatters}`);

console.log('\n✅ Post-Mapping Verification');
console.log(`   Status: ${result.phases.postMappingVerification.status}`);
console.log(`   Integrity Matches: ${result.phases.postMappingVerification.integrityMatches}`);
console.log(`   Checks Performed: ${result.phases.postMappingVerification.checks.length}`);
result.phases.postMappingVerification.checks.forEach(check => {
  console.log(`   - ${check.name}: ${check.passed ? '✓' : '✗'}`);
});

console.log('\n💾 Phase 3: Registry Storage');
console.log(`   Registry ID: ${result.phases.registry.id}`);
console.log(`   Status: ${result.phases.registry.status}`);

// Display the hierarchical structure
console.log();
console.log('Step 3: Hierarchical Structure');
console.log('-'.repeat(70));
console.log();

result.mappedData.topic.subtopics.forEach(subtopic => {
  console.log(`📁 Subtopic: ${subtopic.name} [${subtopic.id}]`);
  
  subtopic.subjects.forEach(subject => {
    console.log(`   📂 Subject: ${subject.name} [${subject.id}]`);
    
    subject.matters.forEach(matter => {
      console.log(`      📄 Matter: ${matter.name} [${matter.id}]`);
      console.log(`         Hash: ${matter.content_hash.substring(0, 25)}...`);
      console.log(`         Source: ${matter.metadata.source}`);
      console.log(`         Status: ${matter.metadata.review_status}`);
      console.log();
    });
  });
});

// Display audit trail
console.log('Step 4: Audit Trail');
console.log('-'.repeat(70));
console.log();

const auditTrail = result.auditTrail;
console.log(`Total Audit Entries: ${auditTrail.length}`);
console.log();

auditTrail.forEach((entry, index) => {
  console.log(`${index + 1}. ${entry.action}`);
  console.log(`   Timestamp: ${entry.details.timestamp}`);
  console.log(`   Status: ${entry.details.status}`);
  if (entry.details.checks) {
    console.log(`   Checks: ${entry.details.checks.length}`);
  }
  console.log();
});

// Display system statistics
console.log('Step 5: System Statistics');
console.log('-'.repeat(70));
console.log();

const stats = mcdr.getStats();
console.log('Registry Statistics:');
console.log(`   Total Entries: ${stats.registry.totalEntries}`);
console.log(`   Total Versions: ${stats.registry.totalVersions}`);
console.log(`   Queued Items: ${stats.registry.queuedItems}`);
console.log(`   Access Control Entries: ${stats.registry.accessControlEntries}`);
console.log();
console.log('Audit Trail Statistics:');
console.log(`   Total Entries: ${stats.auditTrail.entryCount}`);
console.log();

// Test retrieval
console.log('Step 6: Data Retrieval Test');
console.log('-'.repeat(70));
console.log();

const registryId = result.phases.registry.id;
const retrieved = mcdr.retrieve(registryId);

if (retrieved) {
  console.log('✓ Successfully retrieved data from registry');
  console.log(`  Topic: ${retrieved.topic.name}`);
  console.log(`  ID: ${retrieved.topic.id}`);
  console.log(`  Subtopics: ${retrieved.topic.subtopics.length}`);
} else {
  console.log('✗ Failed to retrieve data');
}
console.log();

// Export system state
console.log('Step 7: System Export');
console.log('-'.repeat(70));
console.log();

const exported = mcdr.export();
console.log('✓ System state exported successfully');
console.log(`  Registry Entries: ${exported.registry.registry.length}`);
console.log(`  Audit Trail Entries: ${exported.auditTrail.length}`);
console.log(`  Export Time: ${exported.exportedAt}`);
console.log();

// Display sample of mapped data in JSON format
console.log('Step 8: Sample Mapped Data (JSON)');
console.log('-'.repeat(70));
console.log();
console.log(JSON.stringify({
  topic: {
    id: result.mappedData.topic.id,
    name: result.mappedData.topic.name,
    subtopics: result.mappedData.topic.subtopics.slice(0, 1).map(st => ({
      id: st.id,
      name: st.name,
      subjects: st.subjects.slice(0, 1).map(subj => ({
        id: subj.id,
        name: subj.name,
        matters: subj.matters.slice(0, 1).map(m => ({
          id: m.id,
          name: m.name,
          content_hash: m.content_hash,
          metadata: m.metadata
        }))
      }))
    }))
  }
}, null, 2));

console.log();
console.log('='.repeat(70));
console.log('MapCore DeepReview Processing Complete!');
console.log('='.repeat(70));
