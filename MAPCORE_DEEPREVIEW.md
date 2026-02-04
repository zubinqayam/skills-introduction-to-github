# MapCore DeepReview (MCDR) System

## Executive Summary

MapCore DeepReview (MCDR) is a systematic methodology designed to transform unstructured data into a well-governed, hierarchical structure. It achieves this through recursive mapping and a dual-phase verification process, establishing traceable data lineage and enabling efficient offline access.

## Architectural Components

### System Overview

```
┌─────────────────────────────────────────────────────┐
│               MapCore DeepReview System              │
├─────────────┬─────────────┬─────────────────────────┤
│   Mapping   │   Registry  │     DeepReview          │
│  Engine     │   Layer     │     Protocol            │
├─────────────┼─────────────┼─────────────────────────┤
│ • Hierarchical │ • Master   │ • Pre-Mapping          │
│   Classifier  │   Registry │   Validation            │
│ • Recursive   │ • Version  │ • Post-Mapping          │
│   Aggregator  │   Control  │   Verification          │
│ • Map Builder │ • Access   │ • Integrity Hash        │
│               │   Control  │   Generation            │
│               │ • Sync     │ • Audit Trail           │
│               │   Engine   │   Generation            │
└─────────────┴─────────────┴─────────────────────────┘
```

### Core Components

#### 1. Mapping Engine (`mapping-engine.js`)
Responsible for hierarchical classification and recursive aggregation of data.

**Key Features:**
- Hierarchical Classifier: Classifies data into proper hierarchical levels
- Recursive Aggregator: Aggregates data recursively up the hierarchy
- Map Builder: Builds complete hierarchical map structures
- ID Generation: Generates unique identifiers for each hierarchy level
- Content Hashing: Creates SHA-256 hashes for data integrity

#### 2. Registry Layer (`registry-layer.js`)
Manages storage, versioning, and access control of all mapped data.

**Key Features:**
- Master Registry: Central storage for all mapped data
- Version Control: Tracks changes and maintains version history
- Access Control: Manages user permissions for data access
- Sync Engine: Handles data synchronization queuing and processing

#### 3. DeepReview Protocol (`deepreview-protocol.js`)
Enforces integrity checks through pre- and post-mapping validation.

**Key Features:**
- Pre-Mapping Validation: Point-by-point and word-by-word validation
- Post-Mapping Verification: Structure, completeness, and integrity checks
- Integrity Hash Generation: SHA-256 hash generation for verification
- Audit Trail: Complete logging of all validation and verification activities

#### 4. Ingestion Module (`ingestion.js`)
Handles initial data extraction and processing.

**Key Features:**
- Content Extraction: Extracts data from JSON, text, and object formats
- Metadata Capture: Automatically captures relevant metadata
- Format Detection: Auto-detects input data format
- Processing Pipeline: Complete ingestion workflow

## Data Structure Specification

The system uses a strict hierarchical schema with four levels:

```json
{
  "topic": {
    "id": "T-001",
    "name": "Cybersecurity",
    "subtopics": [
      {
        "id": "ST-001",
        "name": "Threat Intelligence",
        "subjects": [
          {
            "id": "S-001",
            "name": "Advanced Persistent Threats",
            "matters": [
              {
                "id": "M-001",
                "name": "APT29 Analysis Report",
                "content_hash": "sha256:abc123...",
                "metadata": {
                  "source": "Internal Analysis",
                  "date_created": "2025-11-15",
                  "review_status": "verified"
                }
              }
            ]
          }
        ]
      }
    ]
  }
}
```

### Hierarchy Levels

1. **Topic** (T-xxxx): Top-level category
2. **Subtopic** (ST-xxxx): Subcategory within a topic
3. **Subject** (S-xxxx): Specific area within a subtopic
4. **Matter** (M-xxxx): Individual data item with content and metadata

## Data Flow Analysis

### Complete Processing Pipeline

```
Input: Unstructured Data
        ↓
┌───────────────────────┐
│  Phase 1: Ingestion   │
│  • Content Extraction │
│  • Metadata Capture   │
│  • Format Detection   │
└───────────────────────┘
        ↓
┌───────────────────────┐
│  Pre-Mapping Review   │
│  • Point-by-point     │
│    validation         │
│  • Word-by-word       │
│    verification       │
│  • Initial hash       │
│    generation         │
└───────────────────────┘
        ↓
┌───────────────────────┐
│  Phase 2: Mapping     │
│  • Hierarchical       │
│    classification     │
│  • Recursive          │
│    aggregation        │
│  • Structure building │
└───────────────────────┘
        ↓
┌───────────────────────┐
│  Post-Mapping Review  │
│  • Structure verify   │
│  • Completeness check │
│  • Hash integrity     │
│    verification       │
└───────────────────────┘
        ↓
┌───────────────────────┐
│  Phase 3: Registry    │
│  • Data storage       │
│  • Version tracking   │
│  • Access control     │
└───────────────────────┘
        ↓
Output: Hierarchical Mapped Data
```

## Installation and Usage

### Installation

```bash
# Navigate to the project directory
cd skills-introduction-to-github

# Install dependencies (if any)
npm install
```

### Basic Usage

```javascript
const MapCoreDeepReview = require('./src/index');

// Create instance
const mcdr = new MapCoreDeepReview();

// Prepare unstructured data
const unstructuredData = {
  name: 'Cybersecurity',
  content: 'Analysis of security threats...',
  source: 'Internal Analysis',
  date_created: '2025-11-15'
};

// Process the data
const result = mcdr.process(unstructuredData, {
  topicName: 'Cybersecurity'
});

// Check result
if (result.status === 'complete') {
  console.log('Processing successful!');
  console.log('Mapped Data:', result.mappedData);
}
```

### Advanced Usage with Hierarchical Data

```javascript
const complexData = {
  name: 'Cybersecurity',
  subtopics: [{
    subtopicName: 'Threat Intelligence',
    subjects: [{
      name: 'Advanced Persistent Threats',
      matters: [{
        name: 'APT29 Analysis Report',
        content: 'Detailed analysis...',
        source: 'Internal Analysis',
        date_created: '2025-11-15',
        review_status: 'verified'
      }]
    }]
  }]
};

const result = mcdr.process(complexData, {
  topicName: 'Cybersecurity'
});
```

### Retrieving Data from Registry

```javascript
// Get registry ID from processing result
const registryId = result.phases.registry.id;

// Retrieve data later
const retrievedData = mcdr.retrieve(registryId);
console.log(retrievedData);
```

### Getting System Statistics

```javascript
const stats = mcdr.getStats();
console.log('Registry entries:', stats.registry.totalEntries);
console.log('Audit trail entries:', stats.auditTrail.entryCount);
```

### Exporting System State

```javascript
const exportedState = mcdr.export();
// Save to file, send over network, etc.
```

## Running the System

### Run the Example

```bash
npm start
```

This will execute the example in `src/index.js` demonstrating the complete workflow.

### Run Tests

```bash
npm test
```

This will run the comprehensive test suite covering all components.

## API Reference

### MapCoreDeepReview Class

#### `process(unstructuredData, config)`
Process unstructured data through the complete pipeline.

**Parameters:**
- `unstructuredData` (Object|String): Input data to process
- `config` (Object): Configuration options
  - `topicName` (String): Name for the top-level topic
  - `topicId` (String): Optional custom topic ID
  - `format` (String): Optional format specification ('json', 'text', 'object')

**Returns:** Object with processing result including status, phases, and mapped data

#### `retrieve(id)`
Retrieve data from registry by ID.

**Parameters:**
- `id` (String): Registry ID

**Returns:** Retrieved data object or null

#### `getStats()`
Get system statistics.

**Returns:** Object with registry and audit trail statistics

#### `export()`
Export complete system state.

**Returns:** Object with registry data, audit trail, and export timestamp

### MappingEngine Class

#### `hierarchicalClassifier(data, level)`
Classify data into hierarchical level.

#### `recursiveAggregator(items, parentLevel)`
Aggregate items recursively.

#### `buildMap(config)`
Build complete hierarchical map.

#### `generateContentHash(content)`
Generate SHA-256 hash for content.

### RegistryLayer Class

#### `register(id, data)`
Register data in master registry.

#### `retrieve(id)`
Retrieve data from registry.

#### `createVersion(id, data, comment)`
Create new version of registered data.

#### `setAccessControl(id, userId, permissions)`
Set access control permissions.

#### `queueSync(item)`
Queue item for synchronization.

### DeepReviewProtocol Class

#### `preMappingValidation(data)`
Validate data before mapping.

#### `postMappingVerification(originalData, mappedData)`
Verify data after mapping.

#### `getAuditTrail()`
Get complete audit trail.

#### `generateIntegrityHash(data)`
Generate integrity hash for data.

### IngestionModule Class

#### `extractContent(input, format)`
Extract content from input data.

#### `process(input, format)`
Process input through complete ingestion pipeline.

#### `detectFormat(input)`
Auto-detect input format.

## Security Features

- **SHA-256 Hashing**: All content is hashed for integrity verification
- **Audit Trails**: Complete logging of all operations
- **Access Control**: Permission-based data access
- **Validation**: Pre- and post-processing validation checks
- **Version Control**: Track all changes with version history

## Performance Characteristics

- **In-Memory Storage**: Fast access using JavaScript Maps
- **Efficient Hashing**: Crypto module for performant hash generation
- **Minimal Dependencies**: Lightweight implementation using Node.js core modules
- **Scalable Architecture**: Modular design for easy extension

## License

MIT License - See LICENSE file for details

## Contributing

This is an educational project demonstrating the MapCore DeepReview methodology.

## Support

For questions or issues, please refer to the GitHub repository documentation.
