/**
 * Mapping Engine Module
 * Responsible for hierarchical classification and recursive aggregation of data
 */

const crypto = require('crypto');

class MappingEngine {
  constructor() {
    this.hierarchyLevels = ['topic', 'subtopic', 'subject', 'matter'];
  }

  /**
   * Hierarchical Classifier - Classifies data into the proper hierarchical level
   * @param {Object} data - Input data to classify
   * @param {string} level - Target hierarchy level
   * @returns {Object} Classified data
   */
  hierarchicalClassifier(data, level = 'matter') {
    if (!this.hierarchyLevels.includes(level)) {
      throw new Error(`Invalid hierarchy level: ${level}`);
    }

    return {
      id: this.generateId(level),
      name: data.name || 'Unnamed',
      level: level,
      metadata: data.metadata || {},
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Recursive Aggregator - Aggregates data recursively up the hierarchy
   * @param {Array} items - Items to aggregate
   * @param {string} parentLevel - Parent level in hierarchy
   * @returns {Object} Aggregated structure
   */
  recursiveAggregator(items, parentLevel) {
    const levelIndex = this.hierarchyLevels.indexOf(parentLevel);
    if (levelIndex === -1 || levelIndex === this.hierarchyLevels.length - 1) {
      return items;
    }

    const childLevel = this.hierarchyLevels[levelIndex + 1];
    const pluralChild = this.getPluralForm(childLevel);

    return items.map(item => ({
      ...item,
      [pluralChild]: []
    }));
  }

  /**
   * Map Builder - Builds complete hierarchical map structure
   * @param {Object} config - Configuration for map building
   * @returns {Object} Complete map structure
   */
  buildMap(config) {
    const { topicName, topicId, data } = config;
    
    const map = {
      topic: {
        id: topicId || this.generateId('topic'),
        name: topicName || 'Default Topic',
        subtopics: []
      }
    };

    if (data && Array.isArray(data)) {
      map.topic.subtopics = this.processDataHierarchy(data);
    }

    return map;
  }

  /**
   * Process data into hierarchical structure
   * @param {Array} data - Input data array
   * @returns {Array} Processed hierarchy
   */
  processDataHierarchy(data) {
    return data.map(item => {
      const subtopic = {
        id: this.generateId('subtopic'),
        name: item.subtopicName || 'Default Subtopic',
        subjects: []
      };

      if (item.subjects && Array.isArray(item.subjects)) {
        subtopic.subjects = item.subjects.map(subj => {
          const subject = {
            id: this.generateId('subject'),
            name: subj.name || 'Default Subject',
            matters: []
          };

          if (subj.matters && Array.isArray(subj.matters)) {
            subject.matters = subj.matters.map(matter => ({
              id: this.generateId('matter'),
              name: matter.name || 'Default Matter',
              content_hash: matter.content ? this.generateContentHash(matter.content) : null,
              metadata: {
                source: matter.source || 'Unknown',
                date_created: matter.date_created || new Date().toISOString().split('T')[0],
                review_status: matter.review_status || 'pending'
              }
            }));
          }

          return subject;
        });
      }

      return subtopic;
    });
  }

  /**
   * Generate unique ID for hierarchy level
   * @param {string} level - Hierarchy level
   * @returns {string} Generated ID
   */
  generateId(level) {
    const prefix = {
      topic: 'T',
      subtopic: 'ST',
      subject: 'S',
      matter: 'M'
    };

    const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `${prefix[level] || 'X'}-${randomNum}`;
  }

  /**
   * Generate SHA-256 content hash
   * @param {string} content - Content to hash
   * @returns {string} SHA-256 hash
   */
  generateContentHash(content) {
    return 'sha256:' + crypto.createHash('sha256').update(content).digest('hex');
  }

  /**
   * Get plural form of hierarchy level
   * @param {string} level - Hierarchy level
   * @returns {string} Plural form
   */
  getPluralForm(level) {
    const plurals = {
      topic: 'topics',
      subtopic: 'subtopics',
      subject: 'subjects',
      matter: 'matters'
    };
    return plurals[level] || level + 's';
  }
}

module.exports = MappingEngine;
