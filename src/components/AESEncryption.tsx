"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

// AES-ECB encryption function
const encryptAES_ECB = async (key: CryptoKey, data: ArrayBuffer) => {
  return await window.crypto.subtle.encrypt({ name: "AES-ECB" }, key, data)
}

// AES-ECB decryption function
const decryptAES_ECB = async (key: CryptoKey, data: ArrayBuffer) => {
  return await window.crypto.subtle.decrypt({ name: "AES-ECB" }, key, data)
}

export default function AESEncryption() {
  const [key, setKey] = useState("")
  const [plaintext, setPlaintext] = useState("")
  const [ciphertext, setCiphertext] = useState("")
  const [decryptedText, setDecryptedText] = useState("")

  const handleEncrypt = async () => {
    try {
      const keyData = new Uint8Array(key.match(/.{1,2}/g)!.map((byte) => Number.parseInt(byte, 16)))
      const importedKey = await window.crypto.subtle.importKey("raw", keyData.buffer, { name: "AES-ECB" }, false, [
        "encrypt",
      ])
      const encrypted = await encryptAES_ECB(importedKey, new TextEncoder().encode(plaintext))
      setCiphertext(btoa(String.fromCharCode(...new Uint8Array(encrypted))))
    } catch (error) {
      console.error("Error encrypting:", error)
    }
  }

  const handleDecrypt = async () => {
    try {
      const keyData = new Uint8Array(key.match(/.{1,2}/g)!.map((byte) => Number.parseInt(byte, 16)))
      const importedKey = await window.crypto.subtle.importKey("raw", keyData.buffer, { name: "AES-ECB" }, false, [
        "decrypt",
      ])
      const ciphertextData = Uint8Array.from(atob(ciphertext), (c) => c.charCodeAt(0))
      const decrypted = await decryptAES_ECB(importedKey, ciphertextData.buffer)
      setDecryptedText(new TextDecoder().decode(decrypted))
    } catch (error) {
      console.error("Error decrypting:", error)
    }
  }

  return (
    <div className="border p-4 rounded-lg">
      <h3 className="text-xl font-semibold mb-4">AES-ECB Encryption</h3>
      <div className="space-y-4">
        <div>
          <Label htmlFor="key-input">Key (Hex)</Label>
          <Input id="key-input" value={key} onChange={(e) => setKey(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="plaintext-input">Plaintext</Label>
          <Textarea
            id="plaintext-input"
            value={plaintext}
            onChange={(e) => setPlaintext(e.target.value)}
            placeholder="Enter plaintext"
          />
        </div>
        <Button onClick={handleEncrypt}>Encrypt</Button>
        <div>
          <Label htmlFor="ciphertext-output">Ciphertext</Label>
          <Textarea id="ciphertext-output" value={ciphertext} readOnly />
        </div>
        <Button onClick={handleDecrypt}>Decrypt</Button>
        <div>
          <Label htmlFor="decrypted-output">Decrypted Text</Label>
          <Textarea id="decrypted-output" value={decryptedText} readOnly />
        </div>
      </div>
      <div className="mt-8 space-y-4">
        <h4 className="text-lg font-semibold">Encryption Steps:</h4>
        <ol className="list-decimal list-inside space-y-2">
          <li>Convert the hexadecimal key string to a Uint8Array.</li>
          <li>Import the key using window.crypto.subtle.importKey() for encryption.</li>
          <li>Convert the plaintext to an ArrayBuffer using TextEncoder.</li>
          <li>Encrypt the data using the encryptAES_ECB() function with AES-ECB mode.</li>
          <li>Convert the encrypted ArrayBuffer to a base64 string for display.</li>
        </ol>
        <h4 className="text-lg font-semibold">Decryption Steps:</h4>
        <ol className="list-decimal list-inside space-y-2">
          <li>Convert the hexadecimal key string to a Uint8Array.</li>
          <li>Import the key using window.crypto.subtle.importKey() for decryption.</li>
          <li>Convert the base64 ciphertext to a Uint8Array.</li>
          <li>Decrypt the data using the decryptAES_ECB() function with AES-ECB mode.</li>
          <li>Convert the decrypted ArrayBuffer to a string using TextDecoder.</li>
        </ol>
      </div>
    </div>
  )
}

