#!/usr/bin/env python3
import os
import httpx
import asyncio
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Direct token for testing
BOT_TOKEN = "7954588396:AAEJPXsi9dh1oPcK9ACOo-19nR67y65gTGM"
CHAT_ID = "6951228393"

print(f"🔍 Testando configuração do Telegram...")
print(f"📱 Bot Token: {BOT_TOKEN[:20]}...{BOT_TOKEN[-10:] if BOT_TOKEN else 'VAZIO'}")
print(f"💬 Chat ID: {CHAT_ID}")

async def test_telegram():
    if not BOT_TOKEN or not CHAT_ID:
        print("❌ Token ou Chat ID não configurados!")
        return False
    
    base_url = f"https://api.telegram.org/bot{BOT_TOKEN}"
    
    try:
        async with httpx.AsyncClient() as client:
            # Test 1: Get bot info
            print("\n🤖 Teste 1: Verificando informações do bot...")
            response = await client.get(f"{base_url}/getMe")
            if response.status_code == 200:
                bot_info = response.json()
                if bot_info.get('ok'):
                    print(f"✅ Bot encontrado: {bot_info['result']['first_name']} (@{bot_info['result']['username']})")
                else:
                    print(f"❌ Erro na resposta: {bot_info}")
                    return False
            else:
                print(f"❌ Token inválido! Status: {response.status_code}")
                print(f"Resposta: {response.text}")
                return False
            
            # Test 2: Send test message
            print(f"\n📨 Teste 2: Enviando mensagem de teste para Chat ID {CHAT_ID}...")
            test_message = """
🧪 *Teste de Integração CTT*

✅ Backend conectado com sucesso
⏰ Data: {datetime}
🔧 Sistema: Funcionando

Este é um teste automático da integração Telegram\\.
            """.replace('{datetime}', '02/09/2025 às 04:00')
            
            response = await client.post(
                f"{base_url}/sendMessage",
                json={
                    "chat_id": CHAT_ID,
                    "text": test_message,
                    "parse_mode": "MarkdownV2"
                }
            )
            
            if response.status_code == 200:
                result = response.json()
                if result.get('ok'):
                    print("✅ Mensagem enviada com sucesso!")
                    return True
                else:
                    print(f"❌ Erro ao enviar mensagem: {result}")
                    return False
            else:
                print(f"❌ Erro HTTP: {response.status_code}")
                print(f"Resposta: {response.text}")
                return False
                
    except Exception as e:
        print(f"❌ Erro na conexão: {str(e)}")
        return False

if __name__ == "__main__":
    result = asyncio.run(test_telegram())
    if result:
        print("\n🎉 TELEGRAM CONFIGURADO CORRETAMENTE!")
    else:
        print("\n❌ PROBLEMA NA CONFIGURAÇÃO DO TELEGRAM!")
        print("\n🔧 Passos para corrigir:")
        print("1. Verificar se o token está correto")
        print("2. Verificar se o Chat ID está correto") 
        print("3. Enviar uma mensagem para o bot primeiro")
        print("4. Obter o Chat ID visitando: https://api.telegram.org/bot<TOKEN>/getUpdates")