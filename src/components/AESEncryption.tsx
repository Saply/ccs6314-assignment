"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

// AES encryption function
const encryptAES = async (key: CryptoKey, iv: Uint8Array, data: ArrayBuffer) => {
  return await window.crypto.subtle.encrypt({ name: "AES-CBC", iv: iv }, key, data)
}

// AES decryption function
const decryptAES = async (key: CryptoKey, iv: Uint8Array, data: ArrayBuffer) => {
  return await window.crypto.subtle.decrypt({ name: "AES-CBC", iv: iv }, key, data)
}

export default function AESEncryption() {
  const [key, setKey] = useState("")
  const [iv, setIv] = useState("")
  const [plaintext, setPlaintext] = useState("")
  const [ciphertext, setCiphertext] = useState("")
  const [decryptedText, setDecryptedText] = useState("")

  const generateKey = async () => {
    const key = await window.crypto.subtle.generateKey({ name: "AES-CBC", length: 256 }, true, ["encrypt", "decrypt"])
    const exportedKey = await window.crypto.subtle.exportKey("raw", key)
    setKey(
      Array.from(new Uint8Array(exportedKey))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join(""),
    )
  }

  const generateIV = () => {
    const iv = window.crypto.getRandomValues(new Uint8Array(16))
    setIv(
      Array.from(iv)
        .map((b) => b.toString(16).padStart(2, "0"))
        .join(""),
    )
  }

  const handleEncrypt = async () => {
    const keyData = new Uint8Array(key.match(/.{1,2}/g)!.map((byte) => Number.parseInt(byte, 16)))
    const ivData = new Uint8Array(iv.match(/.{1,2}/g)!.map((byte) => Number.parseInt(byte, 16)))
    const importedKey = await window.crypto.subtle.importKey("raw", keyData, "AES-CBC", false, ["encrypt"])
    const encrypted = await encryptAES(importedKey, ivData, new TextEncoder().encode(plaintext))
    setCiphertext(btoa(String.fromCharCode(...new Uint8Array(encrypted))))
  }

  const handleDecrypt = async () => {
    const keyData = new Uint8Array(key.match(/.{1,2}/g)!.map((byte) => Number.parseInt(byte, 16)))
    const ivData = new Uint8Array(iv.match(/.{1,2}/g)!.map((byte) => Number.parseInt(byte, 16)))
    const importedKey = await window.crypto.subtle.importKey("raw", keyData, "AES-CBC", false, ["decrypt"])
    const decrypted = await decryptAES(
      importedKey,
      ivData,
      Uint8Array.from(atob(ciphertext), (c) => c.charCodeAt(0)),
    )
    setDecryptedText(new TextDecoder().decode(decrypted))
  }

  return (
    <div className="border p-4 rounded-lg">
      <h3 className="text-xl font-semibold mb-4">AES Encryption</h3>
      <div className="space-y-4">
        <Button onClick={generateKey}>Generate Key</Button>
        <div>
          <Label>Key (Hex)</Label>
          <Input value={key} onChange={(e) => setKey(e.target.value)} />
        </div>
        <Button onClick={generateIV}>Generate IV</Button>
        <div>
          <Label>IV (Hex)</Label>
          <Input value={iv} onChange={(e) => setIv(e.target.value)} />
        </div>
        <div>
          <Label>Plaintext</Label>
          <Textarea value={plaintext} onChange={(e) => setPlaintext(e.target.value)} placeholder="Enter plaintext" />
        </div>
        <Button onClick={handleEncrypt}>Encrypt</Button>
        <div>
          <Label>Ciphertext</Label>
          <Textarea value={ciphertext} readOnly />
        </div>
        <Button onClick={handleDecrypt}>Decrypt</Button>
        <div>
          <Label>Decrypted Text</Label>
          <Textarea value={decryptedText} readOnly />
        </div>
      </div>
    </div>
  )
}

