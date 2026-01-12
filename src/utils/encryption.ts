// Simple encryption utility for password storage
// WARNING: This is NOT cryptographically secure. For demonstration only.

const SECRET_KEY = 'TapAndBuy2024SecureKey!@#$%';

export function encryptPassword(password: string): string {
  try {
    // Simple XOR cipher with base64 encoding
    let encrypted = '';
    for (let i = 0; i < password.length; i++) {
      const charCode = password.charCodeAt(i) ^ SECRET_KEY.charCodeAt(i % SECRET_KEY.length);
      encrypted += String.fromCharCode(charCode);
    }
    return btoa(encrypted); // Base64 encode
  } catch (error) {
    console.error('Encryption error:', error);
    return '';
  }
}

export function decryptPassword(encryptedPassword: string): string {
  try {
    // Decode base64 and reverse XOR cipher
    const encrypted = atob(encryptedPassword);
    let decrypted = '';
    for (let i = 0; i < encrypted.length; i++) {
      const charCode = encrypted.charCodeAt(i) ^ SECRET_KEY.charCodeAt(i % SECRET_KEY.length);
      decrypted += String.fromCharCode(charCode);
    }
    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error);
    return '';
  }
}

// Encrypted Gmail credentials
const ENCRYPTED_GMAIL = 'IAAAIAAAIAAAHFlcdDQIAhweSygKFA=='; // tapandbuy.in@gmail.com
const ENCRYPTED_PASSWORD = 'Mw4bNAJWcUBIAwQFAGc='; // gokul235114744

export function getGmailCredentials() {
  return {
    email: decryptPassword(ENCRYPTED_GMAIL),
    password: decryptPassword(ENCRYPTED_PASSWORD)
  };
}

// Admin PIN (encrypted)
const ENCRYPTED_PIN = 'ZVZAeQ=='; // 1708

export function verifyAdminPin(pin: string): boolean {
  return pin === decryptPassword(ENCRYPTED_PIN);
}
