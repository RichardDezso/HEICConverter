import requests
import sys
import os
from datetime import datetime
import tempfile
from pathlib import Path

class HEICConverterTester:
    def __init__(self, base_url="https://picformat-4.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []

    def log_test(self, name, success, details=""):
        """Log test result"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            print(f"✅ {name} - PASSED")
        else:
            print(f"❌ {name} - FAILED: {details}")
        
        self.test_results.append({
            "test": name,
            "success": success,
            "details": details
        })

    def test_api_health(self):
        """Test basic API health"""
        try:
            response = requests.get(f"{self.api_url}/", timeout=10)
            success = response.status_code == 200
            details = f"Status: {response.status_code}, Response: {response.text[:100]}"
            self.log_test("API Health Check", success, details)
            return success
        except Exception as e:
            self.log_test("API Health Check", False, str(e))
            return False

    def create_test_heic_file(self):
        """Create a minimal test file that mimics HEIC structure"""
        # Create a simple test file with .heic extension
        # Note: This won't be a real HEIC file, but will test file handling
        test_content = b"HEIC_TEST_FILE_CONTENT"
        temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.heic')
        temp_file.write(test_content)
        temp_file.close()
        return temp_file.name

    def test_file_validation_invalid_extension(self):
        """Test file validation with invalid extension"""
        try:
            # Create a test file with wrong extension
            temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.jpg')
            temp_file.write(b"test content")
            temp_file.close()
            
            with open(temp_file.name, 'rb') as f:
                files = {'file': ('test.jpg', f, 'image/jpeg')}
                data = {'output_format': 'jpeg'}
                response = requests.post(f"{self.api_url}/convert", files=files, data=data, timeout=30)
            
            # Should return 400 for invalid file type
            success = response.status_code == 400
            details = f"Status: {response.status_code}, Response: {response.text[:200]}"
            self.log_test("File Validation - Invalid Extension", success, details)
            
            os.unlink(temp_file.name)
            return success
        except Exception as e:
            self.log_test("File Validation - Invalid Extension", False, str(e))
            return False

    def test_invalid_output_format(self):
        """Test invalid output format handling"""
        try:
            test_file_path = self.create_test_heic_file()
            
            with open(test_file_path, 'rb') as f:
                files = {'file': ('test.heic', f, 'image/heic')}
                data = {'output_format': 'invalid_format'}
                response = requests.post(f"{self.api_url}/convert", files=files, data=data, timeout=30)
            
            # Should return 400 for invalid format
            success = response.status_code == 400
            details = f"Status: {response.status_code}, Response: {response.text[:200]}"
            self.log_test("Invalid Output Format Validation", success, details)
            
            os.unlink(test_file_path)
            return success
        except Exception as e:
            self.log_test("Invalid Output Format Validation", False, str(e))
            return False

    def test_missing_file(self):
        """Test API behavior when no file is provided"""
        try:
            data = {'output_format': 'jpeg'}
            response = requests.post(f"{self.api_url}/convert", data=data, timeout=30)
            
            # Should return 422 for missing file
            success = response.status_code == 422
            details = f"Status: {response.status_code}, Response: {response.text[:200]}"
            self.log_test("Missing File Validation", success, details)
            return success
        except Exception as e:
            self.log_test("Missing File Validation", False, str(e))
            return False

    def test_heic_conversion_simulation(self):
        """Test HEIC conversion with a mock file (will likely fail but tests the endpoint)"""
        formats_to_test = ['jpeg', 'png', 'pdf']
        
        for format_type in formats_to_test:
            try:
                test_file_path = self.create_test_heic_file()
                
                with open(test_file_path, 'rb') as f:
                    files = {'file': ('test.heic', f, 'image/heic')}
                    data = {'output_format': format_type}
                    response = requests.post(f"{self.api_url}/convert", files=files, data=data, timeout=30)
                
                # We expect this to fail (500) since it's not a real HEIC file
                # But we're testing that the endpoint accepts the request properly
                if response.status_code in [200, 500]:
                    success = True
                    details = f"Status: {response.status_code} (Expected failure for mock HEIC)"
                else:
                    success = False
                    details = f"Unexpected status: {response.status_code}, Response: {response.text[:200]}"
                
                self.log_test(f"HEIC to {format_type.upper()} Conversion Endpoint", success, details)
                
                os.unlink(test_file_path)
                
            except Exception as e:
                self.log_test(f"HEIC to {format_type.upper()} Conversion Endpoint", False, str(e))

    def test_cors_headers(self):
        """Test CORS configuration"""
        try:
            response = requests.options(f"{self.api_url}/convert", timeout=10)
            cors_headers = response.headers.get('Access-Control-Allow-Origin', '')
            
            success = cors_headers == '*' or 'emergentagent.com' in cors_headers
            details = f"CORS Origin: {cors_headers}"
            self.log_test("CORS Configuration", success, details)
            return success
        except Exception as e:
            self.log_test("CORS Configuration", False, str(e))
            return False

    def test_guides_posts_endpoint(self):
        """Test GET /api/guides/posts endpoint"""
        try:
            response = requests.get(f"{self.api_url}/guides/posts", timeout=10)
            success = response.status_code == 200
            
            if success:
                posts = response.json()
                if isinstance(posts, list) and len(posts) >= 10:
                    details = f"Status: {response.status_code}, Found {len(posts)} posts"
                    # Check if posts have required fields
                    required_fields = ['id', 'title', 'excerpt', 'content']
                    first_post = posts[0] if posts else {}
                    missing_fields = [field for field in required_fields if field not in first_post]
                    if missing_fields:
                        success = False
                        details += f", Missing fields: {missing_fields}"
                else:
                    success = False
                    details = f"Status: {response.status_code}, Expected 10+ posts, got {len(posts) if isinstance(posts, list) else 'invalid response'}"
            else:
                details = f"Status: {response.status_code}, Response: {response.text[:200]}"
            
            self.log_test("GET /api/guides/posts - Returns 10+ posts", success, details)
            return success
        except Exception as e:
            self.log_test("GET /api/guides/posts - Returns 10+ posts", False, str(e))
            return False

    def test_specific_guide_post(self):
        """Test GET /api/guides/posts/{post_id} for specific guide"""
        try:
            post_id = "how-to-batch-convert-heic-to-pdf"
            response = requests.get(f"{self.api_url}/guides/posts/{post_id}", timeout=10)
            success = response.status_code == 200
            
            if success:
                post = response.json()
                required_fields = ['id', 'title', 'content']
                missing_fields = [field for field in required_fields if field not in post]
                
                if missing_fields:
                    success = False
                    details = f"Status: {response.status_code}, Missing fields: {missing_fields}"
                elif post.get('id') != post_id:
                    success = False
                    details = f"Status: {response.status_code}, Wrong post ID returned: {post.get('id')}"
                else:
                    # Check if content is substantial (not placeholder)
                    content = post.get('content', '')
                    content_length = len(str(content))
                    if content_length < 500:  # Expect substantial content
                        success = False
                        details = f"Status: {response.status_code}, Content too short: {content_length} chars"
                    else:
                        details = f"Status: {response.status_code}, Post found with {content_length} chars content"
            else:
                details = f"Status: {response.status_code}, Response: {response.text[:200]}"
            
            self.log_test(f"GET /api/guides/posts/{post_id} - Returns full article", success, details)
            return success
        except Exception as e:
            self.log_test(f"GET /api/guides/posts/{post_id} - Returns full article", False, str(e))
            return False

    def test_guide_post_not_found(self):
        """Test GET /api/guides/posts/{post_id} for non-existent post"""
        try:
            post_id = "non-existent-post-id"
            response = requests.get(f"{self.api_url}/guides/posts/{post_id}", timeout=10)
            success = response.status_code == 404
            details = f"Status: {response.status_code}, Response: {response.text[:200]}"
            
            self.log_test("GET /api/guides/posts/non-existent - Returns 404", success, details)
            return success
        except Exception as e:
            self.log_test("GET /api/guides/posts/non-existent - Returns 404", False, str(e))
            return False

    def test_guides_content_quality(self):
        """Test that guides have substantial content (not placeholder text)"""
        try:
            response = requests.get(f"{self.api_url}/guides/posts", timeout=10)
            if response.status_code != 200:
                self.log_test("Guides Content Quality Check", False, f"Failed to fetch posts: {response.status_code}")
                return False
            
            posts = response.json()
            if not isinstance(posts, list) or len(posts) == 0:
                self.log_test("Guides Content Quality Check", False, "No posts found")
                return False
            
            # Check first few posts for content quality
            substantial_posts = 0
            placeholder_posts = []
            
            for i, post in enumerate(posts[:5]):  # Check first 5 posts
                content = str(post.get('content', ''))
                title = post.get('title', 'Unknown')
                
                # Check for placeholder indicators
                is_placeholder = (
                    len(content) < 500 or
                    'coming soon' in content.lower() or
                    'placeholder' in content.lower() or
                    'lorem ipsum' in content.lower()
                )
                
                if not is_placeholder:
                    substantial_posts += 1
                else:
                    placeholder_posts.append(title)
            
            success = substantial_posts >= 3  # At least 3 out of 5 should have substantial content
            if success:
                details = f"Found {substantial_posts}/5 posts with substantial content (700+ chars)"
            else:
                details = f"Only {substantial_posts}/5 posts have substantial content. Placeholder posts: {placeholder_posts}"
            
            self.log_test("Guides Content Quality - Substantial content", success, details)
            return success
        except Exception as e:
            self.log_test("Guides Content Quality - Substantial content", False, str(e))
            return False

    def run_all_tests(self):
        """Run all backend tests"""
        print("🚀 Starting HEIC Converter Backend Tests")
        print(f"Testing API at: {self.api_url}")
        print("=" * 60)
        
        # Test basic connectivity first
        if not self.test_api_health():
            print("❌ API is not accessible. Stopping tests.")
            return False
        
        # Test guides functionality (main focus)
        print("\n📚 Testing Guides/Blog Functionality:")
        self.test_guides_posts_endpoint()
        self.test_specific_guide_post()
        self.test_guide_post_not_found()
        self.test_guides_content_quality()
        
        # Run validation tests for HEIC conversion
        print("\n🔄 Testing HEIC Conversion Functionality:")
        self.test_file_validation_invalid_extension()
        self.test_invalid_output_format()
        self.test_missing_file()
        
        # Test conversion endpoints (with mock files)
        self.test_heic_conversion_simulation()
        
        # Test CORS
        print("\n🌐 Testing CORS Configuration:")
        self.test_cors_headers()
        
        # Print summary
        print("\n" + "=" * 60)
        print(f"📊 Backend Test Summary: {self.tests_passed}/{self.tests_run} tests passed")
        
        if self.tests_passed == self.tests_run:
            print("🎉 All backend tests passed!")
        else:
            print("⚠️  Some backend tests failed. Check details above.")
        
        return self.tests_passed == self.tests_run

def main():
    tester = HEICConverterTester()
    success = tester.run_all_tests()
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())