"""
DeepReview Pre-Mapping Module

Handles validation and verification of extracted content:
- Point-by-point validation
- Word-by-word verification
- Initial hash generation
"""

import hashlib
from typing import Dict, Any, List, Tuple


class DeepReviewer:
    """
    Performs deep review and validation of extracted content.
    """
    
    def __init__(self):
        self.validation_rules = {
            'min_words': 1,
            'min_chars': 1,
            'max_empty_lines': 10
        }
    
    def review(self, extracted_content: Dict[str, Any]) -> Dict[str, Any]:
        """
        Main review method that orchestrates all validation tasks.
        
        Args:
            extracted_content: Output from ContentExtractor
            
        Returns:
            Dictionary containing validation results and hash
        """
        text_data = extracted_content.get('text', {})
        metadata = extracted_content.get('metadata', {})
        format_info = extracted_content.get('format', {})
        
        return {
            'point_by_point_validation': self.validate_points(text_data, metadata),
            'word_by_word_verification': self.verify_words(text_data),
            'hash': self.generate_hash(extracted_content),
            'overall_status': self._determine_overall_status(text_data, metadata)
        }
    
    def validate_points(self, text_data: Dict[str, Any], metadata: Dict[str, Any]) -> Dict[str, Any]:
        """
        Perform point-by-point validation of the extracted data.
        
        Args:
            text_data: Parsed text data
            metadata: Captured metadata
            
        Returns:
            Dictionary with validation results for each point
        """
        validations = {}
        
        # Validate word count
        word_count = text_data.get('word_count', 0)
        validations['word_count'] = {
            'value': word_count,
            'valid': word_count >= self.validation_rules['min_words'],
            'rule': f"minimum {self.validation_rules['min_words']} words"
        }
        
        # Validate character count
        char_count = text_data.get('char_count', 0)
        validations['char_count'] = {
            'value': char_count,
            'valid': char_count >= self.validation_rules['min_chars'],
            'rule': f"minimum {self.validation_rules['min_chars']} characters"
        }
        
        # Validate sentence structure
        sentence_count = text_data.get('sentence_count', 0)
        validations['sentence_structure'] = {
            'value': sentence_count,
            'valid': sentence_count > 0,
            'rule': "at least one sentence"
        }
        
        # Validate data size
        data_size = metadata.get('data_size_bytes', 0)
        validations['data_size'] = {
            'value': data_size,
            'valid': data_size > 0,
            'rule': "non-empty data"
        }
        
        # Calculate overall validation score
        valid_count = sum(1 for v in validations.values() if v.get('valid', False))
        total_checks = len(validations)
        validations['summary'] = {
            'total_checks': total_checks,
            'passed': valid_count,
            'score': valid_count / total_checks if total_checks > 0 else 0
        }
        
        return validations
    
    def verify_words(self, text_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Perform word-by-word verification of the text.
        
        Args:
            text_data: Parsed text data
            
        Returns:
            Dictionary with word verification results
        """
        words = text_data.get('words', [])
        
        # Analyze each word
        word_analysis = []
        for idx, word in enumerate(words):
            analysis = {
                'position': idx,
                'word': word,
                'length': len(word),
                'is_alphanumeric': word.isalnum(),
                'is_numeric': word.isdigit(),
                'is_alpha': word.isalpha()
            }
            word_analysis.append(analysis)
        
        # Calculate statistics
        total_words = len(words)
        alpha_words = sum(1 for w in words if w.isalpha())
        numeric_words = sum(1 for w in words if w.isdigit())
        
        return {
            'total_words': total_words,
            'alpha_words': alpha_words,
            'numeric_words': numeric_words,
            'alphanumeric_words': total_words - alpha_words - numeric_words,
            'average_word_length': sum(len(w) for w in words) / total_words if total_words > 0 else 0,
            'unique_words': len(set(words)),
            'word_details': word_analysis[:100]  # Limit to first 100 words for brevity
        }
    
    def generate_hash(self, extracted_content: Dict[str, Any]) -> Dict[str, str]:
        """
        Generate cryptographic hashes for the extracted content.
        
        Args:
            extracted_content: Full extracted content dictionary
            
        Returns:
            Dictionary containing various hash values
        """
        # Get the raw text
        raw_text = extracted_content.get('text', {}).get('raw', '')
        raw_bytes = raw_text.encode('utf-8')
        
        # Generate multiple hash types
        hashes = {
            'md5': hashlib.md5(raw_bytes).hexdigest(),
            'sha1': hashlib.sha1(raw_bytes).hexdigest(),
            'sha256': hashlib.sha256(raw_bytes).hexdigest(),
            'sha512': hashlib.sha512(raw_bytes).hexdigest()
        }
        
        # Also hash the cleaned text
        cleaned_text = extracted_content.get('text', {}).get('cleaned', '')
        hashes['cleaned_sha256'] = hashlib.sha256(cleaned_text.encode('utf-8')).hexdigest()
        
        return hashes
    
    def _determine_overall_status(self, text_data: Dict[str, Any], metadata: Dict[str, Any]) -> str:
        """
        Determine overall validation status.
        
        Args:
            text_data: Parsed text data
            metadata: Captured metadata
            
        Returns:
            Overall status string
        """
        word_count = text_data.get('word_count', 0)
        char_count = text_data.get('char_count', 0)
        
        if word_count == 0 or char_count == 0:
            return 'INVALID'
        elif word_count < 5:
            return 'WARNING'
        else:
            return 'VALID'
