"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

// Simulated RSA key generation
const generateRSAKeys = async () => {
  const keyPair = await window.crypto.subtle.generateKey(
    {
      name: "RSA-OAEP",
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: "SHA-256",
    },
    true,
    ["encrypt", "decrypt"],
  )
  return keyPair
}

// Simulated RSA encryption
const rsaEncrypt = async (publicKey: CryptoKey, data: ArrayBuffer) => {
  return await window.crypto.subtle.encrypt({ name: "RSA-OAEP" }, publicKey, data)
}

// Simulated RSA decryption
const rsaDecrypt = async (privateKey: CryptoKey, data: ArrayBuffer) => {
  return await window.crypto.subtle.decrypt({ name: "RSA-OAEP" }, privateKey, data)
}

export default function KeyExchange() {
  const [personAPublicKey, setPersonAPublicKey] = useState<CryptoKey | null>(null)
  const [personAPrivateKey, setPersonAPrivateKey] = useState<CryptoKey | null>(null)
  const [personBPublicKey, setPersonBPublicKey] = useState<CryptoKey | null>(null)
  const [personBPrivateKey, setPersonBPrivateKey] = useState<CryptoKey | null>(null)
  const [sharedSecretKey, setSharedSecretKey] = useState("")
  const [encryptedKey, setEncryptedKey] = useState("")
  const [decryptedKey, setDecryptedKey] = useState("")

  const generateKeys = async () => {
    const personAKeys = await generateRSAKeys()
    const personBKeys = await generateRSAKeys()
    setPersonAPublicKey(personAKeys.publicKey)
    setPersonAPrivateKey(personAKeys.privateKey)
    setPersonBPublicKey(personBKeys.publicKey)
    setPersonBPrivateKey(personBKeys.privateKey)
  }

  const generateSharedSecret = () => {
    const secret = window.crypto.getRandomValues(new Uint8Array(32))
    setSharedSecretKey(
      Array.from(secret)
        .map((b) => b.toString(16).padStart(2, "0"))
        .join(""),
    )
  }

  const encryptSharedSecret = async () => {
    if (personBPublicKey && sharedSecretKey) {
      const encrypted = await rsaEncrypt(personBPublicKey, new TextEncoder().encode(sharedSecretKey))
      setEncryptedKey(btoa(String.fromCharCode(...new Uint8Array(encrypted))))
    }
  }

  const decryptSharedSecret = async () => {
    if (personBPrivateKey && encryptedKey) {
      const decrypted = await rsaDecrypt(
        personBPrivateKey,
        Uint8Array.from(atob(encryptedKey), (c) => c.charCodeAt(0)),
      )
      setDecryptedKey(new TextDecoder().decode(decrypted))
    }
  }

  return (
    <div className="border p-4 rounded-lg mb-4">
      <h3 className="text-xl font-semibold mb-4">Key Exchange Simulation</h3>
      <div className="space-y-4">
        <Button onClick={generateKeys}>Generate RSA Keys</Button>
        <Button onClick={generateSharedSecret}>Generate Shared Secret</Button>
        <div>
          <Label>Shared Secret Key</Label>
          <Input value={sharedSecretKey} readOnly />
        </div>
        <Button onClick={encryptSharedSecret}>Encrypt Shared Secret</Button>
        <div>
          <Label>Encrypted Key</Label>
          <Textarea value={encryptedKey} readOnly />
        </div>
        <Button onClick={decryptSharedSecret}>Decrypt Shared Secret</Button>
        <div>
          <Label>Decrypted Key</Label>
          <Input value={decryptedKey} readOnly />
        </div>
      </div>
    </div>
  )
}

