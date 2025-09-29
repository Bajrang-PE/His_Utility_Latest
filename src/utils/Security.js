import CryptoJS from 'crypto-js';
import JSEncrypt from 'jsencrypt';
import jsSHA from 'jssha';

const privateKey = import.meta.env.VITE_PRIVATE_KEY_IFRAME_URL.replace(/\\n/g, '\n');
const public_key = import.meta.env.VITE_PUBLIC_KEY_IFRAME_URL.replace(/\\n/g, '\n');


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


const decryptAes = (encryptedData, ivHex, keyHex) => {
    try {
        const key = CryptoJS.enc.Hex.parse(keyHex);
        const iv = CryptoJS.enc.Hex.parse(ivHex);

        const decrypted = CryptoJS.AES.decrypt(encryptedData, key, {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });

        const decryptedText = decrypted.toString(CryptoJS.enc.Utf8);

        if (!decryptedText) throw new Error("Failed decryption: empty result");
        return decryptedText;

    } catch (e) {
        console.error("Decryption Error:", e.message);
        return null;
    }
};


export const getEncryptedParamValue = (encString, key) => {

    if (!encString) return null;

    const parsedValue = JSON.parse(decodeURIComponent(encString));
    const newDt = {
        "alg": 2,
        "iv": parsedValue?.iv?.toString(),
        "k": parsedValue?.key?.toString(),
        "data": parsedValue?.encryptedData?.toString()
    }
    const decData = decryptAesOrRsa(newDt);
    const decDtArr = JSON.parse(decData);

    
    if (decDtArr?.length > 0) {
        const found = decDtArr.find(param => param.name === key);
        return found ? decodeURIComponent(found.value) : null;
    } else {
        return null;
    }
};

