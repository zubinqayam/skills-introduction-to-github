/**
 * Ingestion Module
 * Handles content extraction, metadata capture, and format detection
 */

class IngestionModule {
  constructor() {
    this.supportedFormats = ['json', 'text', 'object'];
  }

  /**
   * Content Extraction - Extract data from various formats
   * @param {*} input - Input data in various formats
   * @param {string} format - Input format type
   * @returns {Object} Extracted content
   */
  extractContent(input, format = 'object') {
    const extraction = {
      format: format,
      content: null,
      metadata: {},
      timestamp: new Date().toISOString()
    };

    switch (format) {
      case 'json':
        extraction.content = this.extractFromJSON(input);
        break;
      case 'text':
        extraction.content = this.extractFromText(input);
        break;
      case 'object':
        extraction.content = this.extractFromObject(input);
        break;
      default:
        throw new Error(`Unsupported format: ${format}`);
    }

    // Capture metadata
    extraction.metadata = this.captureMetadata(extraction.content);

    return extraction;
  }

  /**
   * Extract from JSON string
   * @param {string} jsonString - JSON formatted string
   * @returns {Object} Parsed object
   */
  extractFromJSON(jsonString) {
    try {
      return JSON.parse(jsonString);
    } catch (error) {
      throw new Error(`JSON parsing error: ${error.message}`);
    }
  }

  /**
   * Extract from plain text
   * @param {string} text - Plain text input
   * @returns {Object} Structured object from text
   */
  extractFromText(text) {
    return {
      name: 'Extracted from text',
      content: text,
      type: 'text'
    };
  }

  /**
   * Extract from JavaScript object
   * @param {Object} obj - JavaScript object
   * @returns {Object} Validated object
   */
  extractFromObject(obj) {
    if (typeof obj !== 'object' || obj === null) {
      throw new Error('Input must be an object');
    }
    return obj;
  }

  /**
   * Metadata Capture - Extract metadata from content
   * @param {Object} content - Content to analyze
   * @returns {Object} Captured metadata
   */
  captureMetadata(content) {
    const metadata = {
      capturedAt: new Date().toISOString(),
      dataType: typeof content,
      hasContent: !!content
    };

    if (content) {
      if (typeof content === 'object') {
        metadata.keys = Object.keys(content);
        metadata.keyCount = Object.keys(content).length;
      }

      if (content.content) {
        metadata.contentLength = content.content.length;
      }

      if (content.name) {
        metadata.name = content.name;
      }

      if (content.source) {
        metadata.source = content.source;
      }
    }

    return metadata;
  }

  /**
   * Format Detection - Automatically detect input format
   * @param {*} input - Input data
   * @returns {string} Detected format
   */
  detectFormat(input) {
    if (typeof input === 'string') {
      try {
        JSON.parse(input);
        return 'json';
      } catch {
        return 'text';
      }
    } else if (typeof input === 'object' && input !== null) {
      return 'object';
    }

    return 'unknown';
  }

  /**
   * Process unstructured data through complete ingestion pipeline
   * @param {*} input - Unstructured input data
   * @param {string} format - Optional format specification
   * @returns {Object} Processed data ready for mapping
   */
  process(input, format = null) {
    // Auto-detect format if not provided
    const detectedFormat = format || this.detectFormat(input);

    // Extract content
    const extracted = this.extractContent(input, detectedFormat);

    return {
      status: 'ingested',
      format: detectedFormat,
      data: extracted.content,
      metadata: extracted.metadata,
      ingestedAt: extracted.timestamp
    };
  }
}

module.exports = IngestionModule;
