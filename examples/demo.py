#!/usr/bin/env python3
"""
Example usage of the Unstructured Data Processing Pipeline
"""

import sys
import os
import json

# Add src to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from src.pipeline import create_pipeline


def main():
    """
    Demonstrate the pipeline with sample data.
    """
    # Create pipeline instance
    pipeline = create_pipeline()
    
    # Example 1: Simple text data
    print("=" * 60)
    print("Example 1: Simple Text Processing")
    print("=" * 60)
    
    sample_text = """
    This is a sample unstructured text document.
    It contains multiple sentences. Some sentences have punctuation!
    And some have questions? The pipeline will extract and analyze this content.
    """
    
    result = pipeline.process(sample_text, "example1.txt")
    
    print("\n--- Extraction Results ---")
    print(f"Word Count: {result['extraction']['text']['word_count']}")
    print(f"Sentence Count: {result['extraction']['text']['sentence_count']}")
    print(f"Detected Format: {result['extraction']['format']['detected_type']}")
    print(f"Language Hint: {result['extraction']['metadata']['language_hint']}")
    
    print("\n--- Review Results ---")
    print(f"Overall Status: {result['review']['overall_status']}")
    print(f"Validation Score: {result['review']['point_by_point_validation']['summary']['score']:.2f}")
    print(f"Unique Words: {result['review']['word_by_word_verification']['unique_words']}")
    print(f"SHA256 Hash: {result['review']['hash']['sha256'][:16]}...")
    
    # Example 2: JSON-like data
    print("\n\n" + "=" * 60)
    print("Example 2: JSON Data Processing")
    print("=" * 60)
    
    json_data = '{"name": "test", "value": 123}'
    result2 = pipeline.process(json_data, "data.json")
    
    print("\n--- Extraction Results ---")
    print(f"Detected Format: {result2['extraction']['format']['detected_type']}")
    print(f"Confidence: {result2['extraction']['format']['confidence']}")
    print(f"Data Size: {result2['extraction']['metadata']['data_size_bytes']} bytes")
    
    # Example 3: Batch processing
    print("\n\n" + "=" * 60)
    print("Example 3: Batch Processing")
    print("=" * 60)
    
    batch_data = [
        ("First document text", "doc1.txt"),
        ("Second document with more content", "doc2.txt"),
        ("# Markdown Header\nThis looks like markdown!", "doc3.md")
    ]
    
    batch_results = pipeline.process_batch(batch_data)
    
    print(f"\nProcessed {len(batch_results)} documents:")
    for i, res in enumerate(batch_results, 1):
        fmt = res['extraction']['format']['detected_type']
        status = res['review']['overall_status']
        print(f"  Document {i}: Format={fmt}, Status={status}")
    
    # Example 4: Detailed validation output
    print("\n\n" + "=" * 60)
    print("Example 4: Detailed Validation Report")
    print("=" * 60)
    
    test_text = "The quick brown fox jumps over the lazy dog."
    result4 = pipeline.process(test_text, "pangram.txt")
    
    print("\n--- Point-by-Point Validation ---")
    validation = result4['review']['point_by_point_validation']
    for check_name, check_result in validation.items():
        if check_name != 'summary':
            status = "✓" if check_result['valid'] else "✗"
            print(f"{status} {check_name}: {check_result['value']} ({check_result['rule']})")
    
    print("\n--- Word-by-Word Verification ---")
    verification = result4['review']['word_by_word_verification']
    print(f"Total Words: {verification['total_words']}")
    print(f"Alpha Words: {verification['alpha_words']}")
    print(f"Average Word Length: {verification['average_word_length']:.2f}")
    
    print("\n--- Generated Hashes ---")
    hashes = result4['review']['hash']
    print(f"MD5:    {hashes['md5']}")
    print(f"SHA256: {hashes['sha256']}")
    
    print("\n" + "=" * 60)
    print("Pipeline demonstration completed successfully!")
    print("=" * 60)


if __name__ == "__main__":
    main()
