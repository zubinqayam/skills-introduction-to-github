"""
Main Pipeline for Unstructured Data Processing

Orchestrates the flow:
Input: Unstructured Data
  ↓
Content Extraction
  - Text parsing
  - Metadata capture
  - Format detection
  ↓
DeepReview Pre-Mapping
  - Point-by-point validation
  - Word-by-word verification
  - Initial hash generation
"""

from typing import Dict, Any, Optional
from .content_extraction import ContentExtractor
from .deep_review import DeepReviewer


class UnstructuredDataPipeline:
    """
    Main pipeline for processing unstructured data.
    """
    
    def __init__(self):
        self.extractor = ContentExtractor()
        self.reviewer = DeepReviewer()
    
    def process(self, data: str, source_name: str = "unknown") -> Dict[str, Any]:
        """
        Process unstructured data through the complete pipeline.
        
        Args:
            data: Raw unstructured data as string
            source_name: Name or identifier of the data source
            
        Returns:
            Dictionary containing complete processing results
        """
        # Step 1: Content Extraction
        extracted = self.extractor.extract(data, source_name)
        
        # Step 2: DeepReview Pre-Mapping
        reviewed = self.reviewer.review(extracted)
        
        # Combine results
        return {
            'input': {
                'source_name': source_name,
                'data_preview': data[:100] + '...' if len(data) > 100 else data
            },
            'extraction': extracted,
            'review': reviewed,
            'pipeline_status': 'completed'
        }
    
    def process_batch(self, data_items: list) -> list:
        """
        Process multiple data items in batch.
        
        Args:
            data_items: List of tuples (data, source_name)
            
        Returns:
            List of processing results
        """
        results = []
        for item in data_items:
            if isinstance(item, tuple):
                data, source_name = item
            else:
                data = item
                source_name = "unknown"
            
            result = self.process(data, source_name)
            results.append(result)
        
        return results


def create_pipeline() -> UnstructuredDataPipeline:
    """
    Factory function to create a new pipeline instance.
    
    Returns:
        New UnstructuredDataPipeline instance
    """
    return UnstructuredDataPipeline()
