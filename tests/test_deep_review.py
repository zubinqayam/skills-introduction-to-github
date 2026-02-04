"""
Unit tests for DeepReview Module
"""

import unittest
import sys
import os

# Add src to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from src.content_extraction import ContentExtractor
from src.deep_review import DeepReviewer


class TestDeepReviewer(unittest.TestCase):
    """Test cases for DeepReviewer class"""
    
    def setUp(self):
        """Set up test fixtures"""
        self.reviewer = DeepReviewer()
        self.extractor = ContentExtractor()
    
    def test_review_valid_data(self):
        """Test review of valid data"""
        data = "This is a valid test document with multiple words."
        extracted = self.extractor.extract(data, "test.txt")
        result = self.reviewer.review(extracted)
        
        self.assertIn('point_by_point_validation', result)
        self.assertIn('word_by_word_verification', result)
        self.assertIn('hash', result)
        self.assertIn('overall_status', result)
    
    def test_validate_points_valid(self):
        """Test point-by-point validation for valid data"""
        data = "Valid text with enough content."
        extracted = self.extractor.extract(data, "test.txt")
        result = self.reviewer.validate_points(extracted['text'], extracted['metadata'])
        
        self.assertTrue(result['word_count']['valid'])
        self.assertTrue(result['char_count']['valid'])
        self.assertEqual(result['summary']['score'], 1.0)
    
    def test_validate_points_invalid(self):
        """Test validation for empty data"""
        extracted = {
            'text': {'word_count': 0, 'char_count': 0, 'sentence_count': 0},
            'metadata': {'data_size_bytes': 0}
        }
        result = self.reviewer.validate_points(extracted['text'], extracted['metadata'])
        
        self.assertFalse(result['word_count']['valid'])
        self.assertEqual(result['summary']['score'], 0.0)
    
    def test_verify_words(self):
        """Test word-by-word verification"""
        data = "Test word123 and 456 numbers"
        extracted = self.extractor.extract(data, "test.txt")
        result = self.reviewer.verify_words(extracted['text'])
        
        self.assertEqual(result['total_words'], 5)
        self.assertGreater(result['alpha_words'], 0)
        self.assertGreater(result['numeric_words'], 0)
        self.assertGreater(result['unique_words'], 0)
    
    def test_verify_words_statistics(self):
        """Test word verification statistics"""
        data = "The quick brown fox"
        extracted = self.extractor.extract(data, "test.txt")
        result = self.reviewer.verify_words(extracted['text'])
        
        self.assertEqual(result['total_words'], 4)
        self.assertEqual(result['alpha_words'], 4)
        self.assertEqual(result['numeric_words'], 0)
        self.assertGreater(result['average_word_length'], 0)
    
    def test_generate_hash(self):
        """Test hash generation"""
        data = "Test data for hashing"
        extracted = self.extractor.extract(data, "test.txt")
        result = self.reviewer.generate_hash(extracted)
        
        self.assertIn('md5', result)
        self.assertIn('sha1', result)
        self.assertIn('sha256', result)
        self.assertIn('sha512', result)
        self.assertEqual(len(result['md5']), 32)
        self.assertEqual(len(result['sha256']), 64)
    
    def test_hash_consistency(self):
        """Test that same data produces same hash"""
        data = "Consistent data"
        extracted1 = self.extractor.extract(data, "test.txt")
        extracted2 = self.extractor.extract(data, "test.txt")
        
        hash1 = self.reviewer.generate_hash(extracted1)
        hash2 = self.reviewer.generate_hash(extracted2)
        
        self.assertEqual(hash1['sha256'], hash2['sha256'])
    
    def test_overall_status_valid(self):
        """Test overall status for valid data"""
        data = "This is valid test data with sufficient content."
        extracted = self.extractor.extract(data, "test.txt")
        result = self.reviewer.review(extracted)
        
        self.assertEqual(result['overall_status'], 'VALID')
    
    def test_overall_status_warning(self):
        """Test overall status for minimal data"""
        data = "Short text"
        extracted = self.extractor.extract(data, "test.txt")
        result = self.reviewer.review(extracted)
        
        self.assertEqual(result['overall_status'], 'WARNING')
    
    def test_overall_status_invalid(self):
        """Test overall status for invalid data"""
        extracted = {
            'text': {'word_count': 0, 'char_count': 0, 'raw': '', 'cleaned': ''},
            'metadata': {'data_size_bytes': 0},
            'format': {}
        }
        result = self.reviewer.review(extracted)
        
        self.assertEqual(result['overall_status'], 'INVALID')


if __name__ == '__main__':
    unittest.main()
