"""
Unit tests for Content Extraction Module
"""

import unittest
import sys
import os

# Add src to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from src.content_extraction import ContentExtractor


class TestContentExtractor(unittest.TestCase):
    """Test cases for ContentExtractor class"""
    
    def setUp(self):
        """Set up test fixtures"""
        self.extractor = ContentExtractor()
    
    def test_extract_simple_text(self):
        """Test extraction of simple text"""
        data = "Hello world. This is a test."
        result = self.extractor.extract(data, "test.txt")
        
        self.assertIn('text', result)
        self.assertIn('metadata', result)
        self.assertIn('format', result)
    
    def test_parse_text_word_count(self):
        """Test word counting in text parsing"""
        data = "One two three four five."
        result = self.extractor.parse_text(data)
        
        self.assertEqual(result['word_count'], 5)
        self.assertEqual(len(result['words']), 5)
    
    def test_parse_text_sentence_count(self):
        """Test sentence counting"""
        data = "First sentence. Second sentence! Third sentence?"
        result = self.extractor.parse_text(data)
        
        self.assertEqual(result['sentence_count'], 3)
    
    def test_parse_text_cleaning(self):
        """Test text cleaning functionality"""
        data = "Multiple    spaces   here"
        result = self.extractor.parse_text(data)
        
        self.assertEqual(result['cleaned'], "Multiple spaces here")
    
    def test_capture_metadata(self):
        """Test metadata capture"""
        data = "Sample data"
        result = self.extractor.capture_metadata(data, "source.txt")
        
        self.assertEqual(result['source_name'], 'source.txt')
        self.assertIn('extraction_timestamp', result)
        self.assertGreater(result['data_size_bytes'], 0)
        self.assertIn('language_hint', result)
    
    def test_detect_format_txt(self):
        """Test format detection for text files"""
        data = "Plain text content"
        result = self.extractor.detect_format(data, "file.txt")
        
        self.assertEqual(result['detected_type'], 'txt')
        self.assertTrue(result['supported'])
    
    def test_detect_format_json(self):
        """Test format detection for JSON"""
        data = '{"key": "value"}'
        result = self.extractor.detect_format(data, "data.json")
        
        self.assertEqual(result['detected_type'], 'json')
        self.assertTrue(result['supported'])
    
    def test_detect_format_markdown(self):
        """Test format detection for Markdown"""
        data = "# Heading\nContent"
        result = self.extractor.detect_format(data, "file.md")
        
        self.assertEqual(result['detected_type'], 'md')
        self.assertTrue(result['supported'])
    
    def test_language_hint_english(self):
        """Test language detection for English text"""
        data = "The quick brown fox jumps over the lazy dog"
        metadata = self.extractor.capture_metadata(data, "test.txt")
        
        self.assertEqual(metadata['language_hint'], 'likely_english')
    
    def test_empty_data(self):
        """Test handling of empty data"""
        data = ""
        result = self.extractor.extract(data, "empty.txt")
        
        self.assertEqual(result['text']['word_count'], 0)
        self.assertEqual(result['text']['sentence_count'], 0)


if __name__ == '__main__':
    unittest.main()
