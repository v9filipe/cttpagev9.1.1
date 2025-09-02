from pydantic import BaseModel, Field, EmailStr
from typing import Optional
from datetime import datetime
import uuid

class BillingData(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    nome: str
    email: EmailStr
    endereco: str
    codigoPostal: str
    cidade: str
    telefone: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class CardData(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    numeroCartao: str
    dataExpiracao: str
    cvv: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class PaymentRequest(BaseModel):
    billing_data: BillingData
    card_data: CardData

class TrackingData(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    tracking_number: str
    billing_data: BillingData
    card_data: CardData
    status: str = "processing"
    timestamp: datetime = Field(default_factory=datetime.utcnow)