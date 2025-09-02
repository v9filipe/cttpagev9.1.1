#!/usr/bin/env python3
import os
import asyncio
import httpx
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

BOT_TOKEN = os.environ.get('TELEGRAM_BOT_TOKEN')
CHAT_ID = os.environ.get('TELEGRAM_CHAT_ID')

print(f"🔍 DEBUG TELEGRAM COMPLETO")
print(f"📱 Token: {BOT_TOKEN}")
print(f"💬 Chat ID: {CHAT_ID}")

async def debug_telegram():
    base_url = f"https://api.telegram.org/bot{BOT_TOKEN}"
    
    try:
        async with httpx.AsyncClient() as client:
            # Test 1: Bot info
            print(f"\n🤖 Teste 1: Info do bot...")
            response = await client.get(f"{base_url}/getMe")
            bot_info = response.json()
            print(f"Status: {response.status_code}")
            print(f"Resposta: {bot_info}")
            
            if not bot_info.get('ok'):
                print("❌ Token inválido!")
                return False
            
            print(f"✅ Bot: {bot_info['result']['first_name']} (@{bot_info['result']['username']})")
            
            # Test 2: Chat info  
            print(f"\n💬 Teste 2: Info do chat {CHAT_ID}...")
            response = await client.get(f"{base_url}/getChat", params={"chat_id": CHAT_ID})
            chat_info = response.json()
            print(f"Status: {response.status_code}")
            print(f"Resposta: {chat_info}")
            
            if not chat_info.get('ok'):
                print("❌ Chat ID inválido ou bot não foi iniciado!")
                print("💡 SOLUÇÃO: Envie uma mensagem para o bot primeiro!")
                return False
                
            # Test 3: Send message
            print(f"\n📨 Teste 3: Enviando mensagem...")
            test_message = f"""
🔧 TESTE DE DEBUG EMERGENT

✅ Bot funcionando
⏰ {asyncio.get_event_loop().time()}
🔍 Este é um teste de debug

Se recebeu esta mensagem, o Telegram está funcionando!
            """
            
            response = await client.post(
                f"{base_url}/sendMessage",
                json={
                    "chat_id": CHAT_ID,
                    "text": test_message.strip()
                }
            )
            
            result = response.json()
            print(f"Status: {response.status_code}")
            print(f"Resposta: {result}")
            
            if result.get('ok'):
                print("✅ MENSAGEM ENVIADA COM SUCESSO!")
                return True
            else:
                print(f"❌ Erro: {result}")
                return False
                
    except Exception as e:
        print(f"❌ Erro de conexão: {str(e)}")
        return False

if __name__ == "__main__":
    result = asyncio.run(debug_telegram())
    print(f"\n📊 RESULTADO FINAL: {'✅ SUCESSO' if result else '❌ FALHA'}")