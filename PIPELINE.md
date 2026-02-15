# Unstructured Data Processing Pipeline

A Python-based pipeline for extracting, validating, and processing unstructured data.

## Architecture

```
Input: Unstructured Data
        ↓
+-----------------------+
|   Content Extraction  |
|   - Text parsing      |
|   - Metadata capture  |
|   - Format detection  |
+-----------------------+
        ↓
+-----------------------+
|   DeepReview          |
|   Pre-Mapping         |
|   - Point-by-point    |
|     validation        |
|   - Word-by-word      |
|     verification      |
|   - Initial hash      |
|     generation        |
+-----------------------+
        ↓
     Output
```

## Features

### Content Extraction Module
The `ContentExtractor` class handles the extraction phase:

- **Text Parsing**: Extracts and cleans text, identifies sentences and words
- **Metadata Capture**: Captures source information, timestamps, data size, and language hints
- **Format Detection**: Automatically detects data format (txt, json, csv, xml, html, md)

### DeepReview Pre-Mapping Module
The `DeepReviewer` class handles validation and verification:

- **Point-by-Point Validation**: Validates word count, character count, sentence structure, and data size
- **Word-by-Word Verification**: Analyzes each word for type, length, and characteristics
- **Hash Generation**: Generates MD5, SHA1, SHA256, and SHA512 hashes for data integrity

## Installation

No external dependencies required! Uses only Python standard library.

```bash
# Clone the repository
git clone https://github.com/zubinqayam/skills-introduction-to-github.git
cd skills-introduction-to-github
```

## Usage

### Basic Usage

```python
from src.pipeline import create_pipeline

# Create pipeline instance
pipeline = create_pipeline()

# Process data
result = pipeline.process("Your unstructured text here", "source.txt")

# Access results
print(result['extraction'])  # Extraction results
print(result['review'])      # Review and validation results
```

### Batch Processing

```python
from src.pipeline import create_pipeline

pipeline = create_pipeline()

# Process multiple documents
batch_data = [
    ("First document", "doc1.txt"),
    ("Second document", "doc2.txt"),
    ("Third document", "doc3.txt")
]

results = pipeline.process_batch(batch_data)
```

### Running the Demo

```bash
cd examples
python demo.py
```

## API Reference

### UnstructuredDataPipeline

Main pipeline class that orchestrates the data processing flow.

#### Methods

- `process(data: str, source_name: str = "unknown") -> Dict[str, Any]`
  - Processes a single data item through the complete pipeline
  - Returns a dictionary with extraction and review results

- `process_batch(data_items: list) -> list`
  - Processes multiple data items in batch
  - Returns a list of processing results

### ContentExtractor

Handles content extraction from unstructured data.

#### Methods

- `extract(data: str, source_name: str = "unknown") -> Dict[str, Any]`
  - Main extraction method
  - Returns dict with 'text', 'metadata', and 'format' keys

- `parse_text(data: str) -> Dict[str, Any]`
  - Parses text content
  - Returns cleaned text, sentences, words, and counts

- `capture_metadata(data: str, source_name: str) -> Dict[str, Any]`
  - Captures metadata about the data source
  - Returns source info, timestamp, size, and language hints

- `detect_format(data: str, source_name: str) -> Dict[str, Any]`
  - Detects the format of the data
  - Returns detected type, confidence, and support status

### DeepReviewer

Handles validation and verification of extracted content.

#### Methods

- `review(extracted_content: Dict[str, Any]) -> Dict[str, Any]`
  - Main review method
  - Returns validation, verification, and hash results

- `validate_points(text_data: Dict[str, Any], metadata: Dict[str, Any]) -> Dict[str, Any]`
  - Performs point-by-point validation
  - Returns detailed validation results for each check

- `verify_words(text_data: Dict[str, Any]) -> Dict[str, Any]`
  - Performs word-by-word verification
  - Returns word analysis and statistics

- `generate_hash(extracted_content: Dict[str, Any]) -> Dict[str, str]`
  - Generates cryptographic hashes
  - Returns MD5, SHA1, SHA256, and SHA512 hashes

## Output Format

The pipeline returns a dictionary with the following structure:

```python
{
    'input': {
        'source_name': 'example.txt',
        'data_preview': '...'
    },
    'extraction': {
        'text': {
            'raw': '...',
            'cleaned': '...',
            'sentences': [...],
            'words': [...],
            'sentence_count': 10,
            'word_count': 50,
            'char_count': 250
        },
        'metadata': {
            'source_name': 'example.txt',
            'extraction_timestamp': '2026-02-04T20:12:00',
            'data_size_bytes': 250,
            'line_count': 5,
            'has_special_chars': True,
            'language_hint': 'likely_english'
        },
        'format': {
            'detected_type': 'txt',
            'confidence': 0.8,
            'supported': True
        }
    },
    'review': {
        'point_by_point_validation': {
            'word_count': {'value': 50, 'valid': True, 'rule': '...'},
            'char_count': {'value': 250, 'valid': True, 'rule': '...'},
            'sentence_structure': {'value': 10, 'valid': True, 'rule': '...'},
            'data_size': {'value': 250, 'valid': True, 'rule': '...'},
            'summary': {'total_checks': 4, 'passed': 4, 'score': 1.0}
        },
        'word_by_word_verification': {
            'total_words': 50,
            'alpha_words': 45,
            'numeric_words': 2,
            'alphanumeric_words': 3,
            'average_word_length': 4.5,
            'unique_words': 35,
            'word_details': [...]
        },
        'hash': {
            'md5': '...',
            'sha1': '...',
            'sha256': '...',
            'sha512': '...',
            'cleaned_sha256': '...'
        },
        'overall_status': 'VALID'
    },
    'pipeline_status': 'completed'
}
```

## Supported Formats

- **txt**: Plain text files
- **json**: JSON data
- **csv**: Comma-separated values
- **xml**: XML documents
- **html**: HTML documents
- **md**: Markdown files

## Validation Rules

The pipeline validates data against the following rules:

- Minimum 1 word
- Minimum 1 character
- At least one sentence
- Non-empty data

## Status Codes

- **VALID**: Data passes all validation checks with adequate content
- **WARNING**: Data passes basic checks but has minimal content (< 5 words)
- **INVALID**: Data fails basic validation checks

## Examples

See the `examples/demo.py` file for comprehensive usage examples including:

1. Simple text processing
2. JSON data processing
3. Batch processing
4. Detailed validation reports

## License

MIT License - See LICENSE file for details

## Contributing

This is a GitHub Skills learning repository. Feel free to fork and experiment!
