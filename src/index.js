/**
 * MapCore DeepReview System
 * Main entry point integrating all components
 */

const MappingEngine = require('./mapping-engine');
const RegistryLayer = require('./registry-layer');
const DeepReviewProtocol = require('./deepreview-protocol');
const IngestionModule = require('./ingestion');

class MapCoreDeepReview {
  constructor() {
    this.mappingEngine = new MappingEngine();
    this.registryLayer = new RegistryLayer();
    this.deepReview = new DeepReviewProtocol();
    this.ingestion = new IngestionModule();
  }

  /**
   * Complete data flow: Ingest, validate, map, and verify
   * @param {*} unstructuredData - Unstructured input data
   * @param {Object} config - Configuration options
   * @returns {Object} Complete processing result
   */
  process(unstructuredData, config = {}) {
    const result = {
      status: 'processing',
      phases: {},
      timestamp: new Date().toISOString()
    };

    try {
      // Phase 1: Ingestion and Initial Processing
      console.log('Phase 1: Ingestion and Initial Processing');
      result.phases.ingestion = this.ingestion.process(unstructuredData, config.format);
      
      // Pre-Mapping DeepReview
      console.log('Running Pre-Mapping DeepReview...');
      result.phases.preMappingValidation = this.deepReview.preMappingValidation(
        result.phases.ingestion.data
      );

      if (result.phases.preMappingValidation.status === 'failed') {
        result.status = 'failed';
        result.error = 'Pre-mapping validation failed';
        return result;
      }

      // Phase 2: Mapping
      console.log('Phase 2: Hierarchical Mapping');
      const mappingConfig = {
        topicName: config.topicName || result.phases.ingestion.data.name || 'Default Topic',
        topicId: config.topicId,
        data: this.prepareDataForMapping(result.phases.ingestion.data)
      };
      
      result.phases.mapping = this.mappingEngine.buildMap(mappingConfig);

      // Phase 3: Post-Mapping Verification
      console.log('Phase 3: Post-Mapping Verification');
      result.phases.postMappingVerification = this.deepReview.postMappingVerification(
        result.phases.ingestion.data,
        result.phases.mapping
      );

      if (result.phases.postMappingVerification.status === 'failed') {
        result.status = 'verification-failed';
        result.error = 'Post-mapping verification failed';
        return result;
      }

      // Phase 4: Registry
      console.log('Phase 4: Registry Storage');
      const registryId = result.phases.mapping.topic.id;
      this.registryLayer.register(registryId, result.phases.mapping);
      result.phases.registry = {
        id: registryId,
        status: 'registered'
      };

      // Mark as complete
      result.status = 'complete';
      result.mappedData = result.phases.mapping;
      result.auditTrail = this.deepReview.getAuditTrail();

      console.log('Processing complete!');
      return result;

    } catch (error) {
      result.status = 'error';
      result.error = error.message;
      result.stack = error.stack;
      return result;
    }
  }

  /**
   * Prepare ingested data for mapping
   * @param {Object} data - Ingested data
   * @returns {Array} Prepared data array
   */
  prepareDataForMapping(data) {
    // If data already has subtopics array, return it
    if (data.subtopics && Array.isArray(data.subtopics)) {
      return data.subtopics;
    }

    // If data has subjects or matters, wrap in subtopic structure
    if (data.subjects || data.matters) {
      return [data];
    }

    // Convert flat data to hierarchical structure
    return [{
      subtopicName: data.name || 'Default Subtopic',
      subjects: [{
        name: data.name || 'Default Subject',
        matters: [{
          name: data.name || 'Default Matter',
          content: data.content || '',
          source: data.source || 'Unknown',
          date_created: data.date_created || new Date().toISOString().split('T')[0],
          review_status: data.review_status || 'pending'
        }]
      }]
    }];
  }

  /**
   * Retrieve mapped data from registry
   * @param {string} id - Registry ID
   * @returns {Object|null} Retrieved data
   */
  retrieve(id) {
    return this.registryLayer.retrieve(id);
  }

  /**
   * Get system statistics
   * @returns {Object} System statistics
   */
  getStats() {
    return {
      registry: this.registryLayer.getStats(),
      auditTrail: {
        entryCount: this.deepReview.getAuditTrail().length
      }
    };
  }

  /**
   * Export complete system state
   * @returns {Object} Exported state
   */
  export() {
    return {
      registry: this.registryLayer.export(),
      auditTrail: this.deepReview.getAuditTrail(),
      exportedAt: new Date().toISOString()
    };
  }
}

module.exports = MapCoreDeepReview;

// Example usage
if (require.main === module) {
  console.log('MapCore DeepReview System - Example Usage\n');
  console.log('==========================================\n');

  const mcdr = new MapCoreDeepReview();

  // Example unstructured data
  const unstructuredData = {
    name: 'Cybersecurity',
    subtopics: [{
      subtopicName: 'Threat Intelligence',
      subjects: [{
        name: 'Advanced Persistent Threats',
        matters: [{
          name: 'APT29 Analysis Report',
          content: 'This is a detailed analysis of APT29 threat actor activities...',
          source: 'Internal Analysis',
          date_created: '2025-11-15',
          review_status: 'verified'
        }]
      }]
    }]
  };

  // Process the data
  const result = mcdr.process(unstructuredData, {
    topicName: 'Cybersecurity'
  });

  console.log('\nProcessing Result:');
  console.log('Status:', result.status);
  console.log('\nMapped Data Structure:');
  console.log(JSON.stringify(result.mappedData, null, 2));
  console.log('\nSystem Statistics:');
  console.log(JSON.stringify(mcdr.getStats(), null, 2));
}
