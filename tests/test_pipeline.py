"""
Integration tests for the complete Pipeline
"""

import unittest
import sys
import os

# Add src to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from src.pipeline import UnstructuredDataPipeline, create_pipeline


class TestPipeline(unittest.TestCase):
    """Test cases for the complete pipeline"""
    
    def setUp(self):
        """Set up test fixtures"""
        self.pipeline = create_pipeline()
    
    def test_pipeline_creation(self):
        """Test pipeline can be created"""
        pipeline = create_pipeline()
        self.assertIsInstance(pipeline, UnstructuredDataPipeline)
    
    def test_process_simple_text(self):
        """Test processing simple text"""
        data = "This is a test document with multiple sentences. It should process correctly."
        result = self.pipeline.process(data, "test.txt")
        
        self.assertIn('input', result)
        self.assertIn('extraction', result)
        self.assertIn('review', result)
        self.assertEqual(result['pipeline_status'], 'completed')
    
    def test_process_json_data(self):
        """Test processing JSON data"""
        data = '{"name": "test", "value": 123}'
        result = self.pipeline.process(data, "data.json")
        
        self.assertEqual(result['extraction']['format']['detected_type'], 'json')
        self.assertEqual(result['pipeline_status'], 'completed')
    
    def test_process_markdown(self):
        """Test processing Markdown data"""
        data = "# Header\nThis is markdown content."
        result = self.pipeline.process(data, "file.md")
        
        self.assertEqual(result['extraction']['format']['detected_type'], 'md')
        self.assertIn('review', result)
    
    def test_batch_processing(self):
        """Test batch processing"""
        batch_data = [
            ("First document", "doc1.txt"),
            ("Second document", "doc2.txt"),
            ("Third document", "doc3.txt")
        ]
        
        results = self.pipeline.process_batch(batch_data)
        
        self.assertEqual(len(results), 3)
        for result in results:
            self.assertEqual(result['pipeline_status'], 'completed')
    
    def test_batch_processing_mixed_formats(self):
        """Test batch processing with different formats"""
        batch_data = [
            ("Plain text", "file.txt"),
            ('{"key": "value"}', "data.json"),
            ("# Markdown", "doc.md")
        ]
        
        results = self.pipeline.process_batch(batch_data)
        
        self.assertEqual(len(results), 3)
        self.assertEqual(results[0]['extraction']['format']['detected_type'], 'txt')
        self.assertEqual(results[1]['extraction']['format']['detected_type'], 'json')
        self.assertEqual(results[2]['extraction']['format']['detected_type'], 'md')
    
    def test_end_to_end_validation(self):
        """Test complete end-to-end pipeline"""
        data = "The quick brown fox jumps over the lazy dog. This is a pangram."
        result = self.pipeline.process(data, "pangram.txt")
        
        # Check extraction
        self.assertGreater(result['extraction']['text']['word_count'], 0)
        self.assertGreater(result['extraction']['text']['sentence_count'], 0)
        
        # Check validation
        validation = result['review']['point_by_point_validation']
        self.assertTrue(validation['word_count']['valid'])
        self.assertTrue(validation['char_count']['valid'])
        
        # Check hash generation
        self.assertIn('sha256', result['review']['hash'])
        
        # Check overall status
        self.assertEqual(result['review']['overall_status'], 'VALID')
    
    def test_empty_string_handling(self):
        """Test handling of empty string"""
        data = ""
        result = self.pipeline.process(data, "empty.txt")
        
        self.assertEqual(result['extraction']['text']['word_count'], 0)
        self.assertEqual(result['review']['overall_status'], 'INVALID')
    
    def test_input_preview_truncation(self):
        """Test that long input is truncated in preview"""
        data = "x" * 200
        result = self.pipeline.process(data, "long.txt")
        
        preview = result['input']['data_preview']
        self.assertTrue(preview.endswith('...'))
        self.assertLess(len(preview), 110)


if __name__ == '__main__':
    unittest.main()
