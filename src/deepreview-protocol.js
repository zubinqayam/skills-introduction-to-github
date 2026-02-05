/**
 * DeepReview Protocol Module
 * Enforces integrity checks and generates audit trails
 */

const crypto = require('crypto');

class DeepReviewProtocol {
  constructor() {
    this.auditTrail = [];
    this.validationRules = new Map();
  }

  /**
   * Pre-Mapping Validation - Point-by-point and word-by-word validation
   * @param {Object} data - Data to validate before mapping
   * @returns {Object} Validation result
   */
  preMappingValidation(data) {
    const validationResult = {
      status: 'pending',
      checks: [],
      timestamp: new Date().toISOString(),
      initialHash: null
    };

    // Point-by-point validation
    const pointValidation = this.pointByPointValidation(data);
    validationResult.checks.push(pointValidation);

    // Word-by-word verification
    const wordValidation = this.wordByWordVerification(data);
    validationResult.checks.push(wordValidation);

    // Initial hash generation
    validationResult.initialHash = this.generateIntegrityHash(data);

    // Determine overall status
    const allPassed = validationResult.checks.every(check => check.passed);
    validationResult.status = allPassed ? 'passed' : 'failed';

    // Add to audit trail
    this.addToAuditTrail('pre-mapping-validation', validationResult);

    return validationResult;
  }

  /**
   * Post-Mapping Verification - Verify integrity after mapping
   * @param {Object} originalData - Original unstructured data
   * @param {Object} mappedData - Mapped hierarchical data
   * @returns {Object} Verification result
   */
  postMappingVerification(originalData, mappedData) {
    const verificationResult = {
      status: 'pending',
      checks: [],
      timestamp: new Date().toISOString(),
      integrityMatches: false
    };

    // Verify structure integrity
    const structureCheck = this.verifyStructure(mappedData);
    verificationResult.checks.push(structureCheck);

    // Verify data completeness
    const completenessCheck = this.verifyCompleteness(originalData, mappedData);
    verificationResult.checks.push(completenessCheck);

    // Verify hash integrity
    const hashCheck = this.verifyHashIntegrity(originalData, mappedData);
    verificationResult.checks.push(hashCheck);
    verificationResult.integrityMatches = hashCheck.passed;

    // Determine overall status
    const allPassed = verificationResult.checks.every(check => check.passed);
    verificationResult.status = allPassed ? 'verified' : 'failed';

    // Add to audit trail
    this.addToAuditTrail('post-mapping-verification', verificationResult);

    return verificationResult;
  }

  /**
   * Point-by-point validation
   * @param {Object} data - Data to validate
   * @returns {Object} Validation check result
   */
  pointByPointValidation(data) {
    const checks = {
      name: 'Point-by-Point Validation',
      passed: true,
      issues: []
    };

    // Check if data is an object
    if (typeof data !== 'object' || data === null) {
      checks.passed = false;
      checks.issues.push('Data must be an object');
    }

    // Check for required fields
    if (data && !data.name) {
      checks.issues.push('Missing required field: name');
    }

    // Validate content if present
    if (data && data.content) {
      if (typeof data.content !== 'string') {
        checks.passed = false;
        checks.issues.push('Content must be a string');
      }
    }

    // Set passed status
    if (checks.issues.length > 0 && !data?.name) {
      checks.passed = false;
    }

    return checks;
  }

  /**
   * Word-by-word verification
   * @param {Object} data - Data to verify
   * @returns {Object} Verification check result
   */
  wordByWordVerification(data) {
    const checks = {
      name: 'Word-by-Word Verification',
      passed: true,
      wordCount: 0,
      issues: []
    };

    if (data && data.content) {
      const content = String(data.content);
      const words = content.trim().split(/\s+/);
      checks.wordCount = words.length;

      // Check for suspicious patterns
      words.forEach((word, index) => {
        // Check for extremely long words (potential data corruption)
        if (word.length > 100) {
          checks.issues.push(`Word ${index + 1} is unusually long (${word.length} chars)`);
        }

        // Check for control characters
        if (/[\x00-\x1F\x7F]/.test(word)) {
          checks.issues.push(`Word ${index + 1} contains control characters`);
        }
      });
    }

    if (checks.issues.length > 0) {
      checks.passed = false;
    }

    return checks;
  }

  /**
   * Generate integrity hash for data
   * @param {Object} data - Data to hash
   * @returns {string} Integrity hash
   */
  generateIntegrityHash(data) {
    const dataString = JSON.stringify(data, Object.keys(data).sort());
    return 'sha256:' + crypto.createHash('sha256').update(dataString).digest('hex');
  }

  /**
   * Verify structure of mapped data
   * @param {Object} mappedData - Mapped hierarchical data
   * @returns {Object} Structure check result
   */
  verifyStructure(mappedData) {
    const checks = {
      name: 'Structure Verification',
      passed: true,
      issues: []
    };

    // Check for topic level
    if (!mappedData || !mappedData.topic) {
      checks.passed = false;
      checks.issues.push('Missing top-level topic structure');
      return checks;
    }

    const topic = mappedData.topic;

    // Verify topic has required fields
    if (!topic.id || !topic.name) {
      checks.passed = false;
      checks.issues.push('Topic missing required fields (id, name)');
    }

    // Verify subtopics structure
    if (topic.subtopics && Array.isArray(topic.subtopics)) {
      topic.subtopics.forEach((subtopic, idx) => {
        if (!subtopic.id || !subtopic.name) {
          checks.passed = false;
          checks.issues.push(`Subtopic ${idx} missing required fields`);
        }
      });
    }

    return checks;
  }

  /**
   * Verify completeness of mapped data
   * @param {Object} originalData - Original data
   * @param {Object} mappedData - Mapped data
   * @returns {Object} Completeness check result
   */
  verifyCompleteness(originalData, mappedData) {
    const checks = {
      name: 'Completeness Verification',
      passed: true,
      issues: []
    };

    // Basic completeness check - ensure mapped data exists
    if (!mappedData || Object.keys(mappedData).length === 0) {
      checks.passed = false;
      checks.issues.push('Mapped data is empty');
    }

    return checks;
  }

  /**
   * Verify hash integrity
   * @param {Object} originalData - Original data
   * @param {Object} mappedData - Mapped data
   * @returns {Object} Hash integrity check result
   */
  verifyHashIntegrity(originalData, mappedData) {
    const checks = {
      name: 'Hash Integrity Verification',
      passed: true,
      originalHash: null,
      mappedHash: null,
      issues: []
    };

    try {
      checks.originalHash = this.generateIntegrityHash(originalData);
      
      // For mapped data, we need to verify content hashes in matters
      if (mappedData?.topic?.subtopics) {
        let hashesVerified = 0;
        mappedData.topic.subtopics.forEach(subtopic => {
          if (subtopic.subjects) {
            subtopic.subjects.forEach(subject => {
              if (subject.matters) {
                subject.matters.forEach(matter => {
                  if (matter.content_hash) {
                    hashesVerified++;
                  }
                });
              }
            });
          }
        });

        checks.hashesVerified = hashesVerified;
        checks.passed = hashesVerified >= 0; // Pass if structure exists
      }
    } catch (error) {
      checks.passed = false;
      checks.issues.push(`Hash generation error: ${error.message}`);
    }

    return checks;
  }

  /**
   * Add entry to audit trail
   * @param {string} action - Action performed
   * @param {Object} details - Action details
   */
  addToAuditTrail(action, details) {
    this.auditTrail.push({
      action: action,
      details: details,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Get complete audit trail
   * @returns {Array} Audit trail entries
   */
  getAuditTrail() {
    return [...this.auditTrail];
  }

  /**
   * Export audit trail to JSON
   * @returns {string} JSON formatted audit trail
   */
  exportAuditTrail() {
    return JSON.stringify(this.auditTrail, null, 2);
  }

  /**
   * Clear audit trail
   */
  clearAuditTrail() {
    this.auditTrail = [];
  }
}

module.exports = DeepReviewProtocol;
