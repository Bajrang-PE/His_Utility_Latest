import CryptoJS from 'crypto-js';
import JSEncrypt from 'jsencrypt';
import jsSHA from 'jssha';

const privateKey = import.meta.env.VITE_PRIVATE_KEY.replace(/\\n/g, '\n');
const public_key = import.meta.env.VITE_PUBLIC_KEY.replace(/\\n/g, '\n');


export const decryptAesOrRsa = (encryptionData) => {
  try {
    const { alg, iv, k, data } = encryptionData;

    if (alg === 1) {
      // RSA Decryption
      return decryptRsa(data);
    } else if (alg === 2) {
      // AES Decryption
      const decryptedKey = decryptRsa(k);
      return decryptAes(data, iv, decryptedKey);
    } else {
      throw new Error('Unsupported encryption algorithm.');
    }
  } catch (err) {
    console.error('Decryption error:', err);
    throw err;
  }
};

const decryptRsa = (encryptedData) => {
  const jsEncrypt = new JSEncrypt();
  jsEncrypt.setPrivateKey(privateKey);
  const decrypted = jsEncrypt.decrypt(encryptedData);
  if (!decrypted) {
    throw new Error('RSA Decryption failed');
  }
  return decrypted;
};

const decryptAes = (encryptedData, iv, key) => {
  const decrypted = CryptoJS.AES.decrypt(encryptedData, CryptoJS.enc.Base64.parse(key), {
    iv: CryptoJS.enc.Base64.parse(iv),
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  return decrypted.toString(CryptoJS.enc.Utf8);
};



export function encryptAesData(data) {
  // Generate a random 32-byte AES key
  const aesKey = CryptoJS.lib.WordArray.random(32);

  // Generate a random IV (16 bytes)
  const iv = CryptoJS.lib.WordArray.random(16);

  // Encrypt data with AES
  const encryptedData = CryptoJS.AES.encrypt(data, aesKey, { iv: iv }).toString();

  // Encrypt AES key using RSA
  const encryptedAesKey = encryptRsaWithPublicKey(aesKey.toString(CryptoJS.enc.Base64), public_key);

  // Prepare the object to send
  const encryptedPayload = {
    alg: 2,  // 2 means AES encryption
    data: encryptedData,
    iv: iv.toString(CryptoJS.enc.Base64),
    k: encryptedAesKey,  // Encrypted AES key
  };

  return JSON.stringify(encryptedPayload);
}

function encryptRsaWithPublicKey(data, publicKey) {
  const encrypt = new JSEncrypt();
  encrypt.setPublicKey(publicKey);
  const encrypted = encrypt.encrypt(data);
  return encrypted;
}


const key = "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAzLk5HsjFlCxD+wXM8fzcLUEXCSocev+Iw2hzmgM0bBdwChOggws0Zn/crlXBEJMK6nvhapN3mgM/+ZURzw95zVPyBkDV8N1uQ2TvtIZPjV/T97P39AES3pqXQ9g8aRcKPGjxias4Vzqn9EVPlyRJuPTr9wkvMX0VRfz6z/iJxcpMDqjEjp6nFQMWkB6ZUH/6PlfatLN6AZ65BeydAS7RUAT/WSYbL6jd8+EbMa2P23nHraysuYTmz6XUs2kB2Hd+ogsv6rLNzkA8wzwJ+VNbd14IlvPv1MgYdkMX6Z2qYnEyYYQqxnlDBPDthFz2eQCTIeS2SQRsffxQj0shaVxjDQIDAQAB"
// for frontend only
// Encryption function
export function encryptData(data) {
  if (data === null || data === undefined) return '';
  const stringData = String(data);
  const ciphertext = CryptoJS.AES.encrypt(stringData, key).toString();
  // const ciphertext = CryptoJS.AES.encrypt(data, key).toString();
  return ciphertext;
}

// Decryption function
export function decryptData(data) {
  if (!data || typeof data !== 'string') return null;
  const bytes = CryptoJS.AES.decrypt(data, key);
  const plaintext = bytes.toString(CryptoJS.enc.Utf8);
  // const parseddt = JSON.parse(plaintext);
  try {
    return JSON.parse(plaintext);
  } catch (e) {
    return plaintext;
  }
  // return parseddt;
}

export const handleHash = (userName, userPwd) => {
  try {
    // Combine username and password
    const saltedPass = userPwd + userName;

    const hashObj = new jsSHA("SHA-1", "TEXT");  // Specify SHA variant correctly here

    // Update hash with the salted password
    hashObj.update(saltedPass);

    // Get the hashed password
    const hashedPass = hashObj.getHash("HEX");

    return hashedPass;
  } catch (error) {
    console.error("Error during hashing:", error);
    return null; // Return null in case of an error
  }
};