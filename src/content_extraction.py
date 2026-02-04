"""
Content Extraction Module

Handles extraction of unstructured data including:
- Text parsing
- Metadata capture
- Format detection
"""

import re
from typing import Dict, Any, List
from datetime import datetime
import mimetypes


class ContentExtractor:
    """
    Extracts content from unstructured data sources.
    """
    
    def __init__(self):
        self.supported_formats = ['txt', 'json', 'csv', 'xml', 'html', 'md']
    
    def extract(self, data: str, source_name: str = "unknown") -> Dict[str, Any]:
        """
        Main extraction method that orchestrates all extraction tasks.
        
        Args:
            data: Raw unstructured data as string
            source_name: Name or identifier of the data source
            
        Returns:
            Dictionary containing extracted content and metadata
        """
        return {
            'text': self.parse_text(data),
            'metadata': self.capture_metadata(data, source_name),
            'format': self.detect_format(data, source_name)
        }
    
    def parse_text(self, data: str) -> Dict[str, Any]:
        """
        Parse text from unstructured data.
        
        Args:
            data: Raw data string
            
        Returns:
            Dictionary with parsed text information
        """
        # Remove extra whitespace
        cleaned = re.sub(r'\s+', ' ', data).strip()
        
        # Extract sentences (simple sentence boundary detection)
        sentences = re.split(r'[.!?]+', cleaned)
        sentences = [s.strip() for s in sentences if s.strip()]
        
        # Extract words
        words = re.findall(r'\b\w+\b', cleaned)
        
        return {
            'raw': data,
            'cleaned': cleaned,
            'sentences': sentences,
            'words': words,
            'sentence_count': len(sentences),
            'word_count': len(words),
            'char_count': len(data)
        }
    
    def capture_metadata(self, data: str, source_name: str) -> Dict[str, Any]:
        """
        Capture metadata about the data source.
        
        Args:
            data: Raw data string
            source_name: Name of the source
            
        Returns:
            Dictionary containing metadata
        """
        return {
            'source_name': source_name,
            'extraction_timestamp': datetime.utcnow().isoformat(),
            'data_size_bytes': len(data.encode('utf-8')),
            'line_count': data.count('\n') + 1,
            'has_special_chars': bool(re.search(r'[^a-zA-Z0-9\s]', data)),
            'language_hint': self._detect_language_hint(data)
        }
    
    def detect_format(self, data: str, source_name: str) -> Dict[str, Any]:
        """
        Detect the format of the unstructured data.
        
        Args:
            data: Raw data string
            source_name: Name of the source
            
        Returns:
            Dictionary with format detection results
        """
        detected_type = 'unknown'
        confidence = 0.0
        
        # Try to detect from source name extension
        if '.' in source_name:
            ext = source_name.rsplit('.', 1)[1].lower()
            mime_type, _ = mimetypes.guess_type(source_name)
            if ext in self.supported_formats:
                detected_type = ext
                confidence = 0.8
        
        # Content-based detection
        if detected_type == 'unknown':
            if data.strip().startswith('{') and data.strip().endswith('}'):
                detected_type = 'json'
                confidence = 0.7
            elif data.strip().startswith('<') and data.strip().endswith('>'):
                detected_type = 'xml'
                confidence = 0.7
            elif re.match(r'^#+\s+', data, re.MULTILINE):
                detected_type = 'md'
                confidence = 0.6
            elif ',' in data and '\n' in data:
                detected_type = 'csv'
                confidence = 0.5
            else:
                detected_type = 'txt'
                confidence = 0.5
        
        return {
            'detected_type': detected_type,
            'confidence': confidence,
            'supported': detected_type in self.supported_formats
        }
    
    def _detect_language_hint(self, data: str) -> str:
        """
        Provide a hint about the language of the content.
        
        Args:
            data: Raw data string
            
        Returns:
            Language hint string
        """
        # Simple heuristic - check for common English words
        common_english_words = ['the', 'is', 'at', 'which', 'on', 'a', 'an']
        data_lower = data.lower()
        # Check for word boundaries - count all occurrences
        english_count = sum(data_lower.count(' ' + word + ' ') + 
                           data_lower.count(' ' + word) + 
                           data_lower.count(word + ' ') 
                           for word in common_english_words)
        # Also check if data starts with these words
        english_count += sum(1 for word in common_english_words if data_lower.startswith(word + ' '))
        
        if english_count >= 2:
            return 'likely_english'
        return 'unknown'
