"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Generate a random 16-digit hex key
const generateRandomHexKey = () => {
  return Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join("")
}

// Simulated RSA encryption (in a real scenario, use a proper crypto library)
const rsaEncrypt = (message: string, e: string, n: string) => {
  // This is a placeholder. In a real scenario, implement actual RSA encryption
  return `Encrypted(${message})`
}

// Simulated RSA decryption (in a real scenario, use a proper crypto library)
const rsaDecrypt = (ciphertext: string, d: string, n: string) => {
  // This is a placeholder. In a real scenario, implement actual RSA decryption
  return `Decrypted(${ciphertext})`
}

export default function KeyGeneration() {
  const [personBPublicKey, setPersonBPublicKey] = useState({ n: "", e: "" })
  const [personBPrivateKey, setPersonBPrivateKey] = useState({ n: "", d: "" })
  const [symmetricKey, setSymmetricKey] = useState("")
  const [encryptedSymmetricKey, setEncryptedSymmetricKey] = useState("")
  const [decryptedSymmetricKey, setDecryptedSymmetricKey] = useState("")

  const [steps, setSteps] = useState<string[]>([])

  const generateKey = () => {
    const key = generateRandomHexKey()
    setSymmetricKey(key)
    setSteps([`Step 1: Person A generates random symmetric key: <b>${key}</b>`])
  }

  const encryptKey = () => {
    if (!symmetricKey) {
      alert("Please generate a symmetric key first.")
      return
    }
    const encrypted = rsaEncrypt(symmetricKey, personBPublicKey.e, personBPublicKey.n)
    setEncryptedSymmetricKey(encrypted)
    setSteps((prevSteps) => [
      ...prevSteps,
      `Step 2: Person A encrypts symmetric key with Person B's public key: <b>${encrypted}</b>`,
    ])
  }

  const decryptKey = () => {
    if (!encryptedSymmetricKey) {
      alert("Please encrypt the symmetric key first.")
      return
    }
    const decrypted = rsaDecrypt(encryptedSymmetricKey, personBPrivateKey.d, personBPrivateKey.n)
    setDecryptedSymmetricKey(decrypted)
    setSteps((prevSteps) => [
      ...prevSteps,
      `Step 3: Person B decrypts the symmetric key: <b>${decrypted}</b>`,
      `Step 4: Verify that the decrypted key matches the original: <b>${decrypted === symmetricKey}</b>`,
    ])
  }

  const clearSteps = () => {
    setSteps([])
    setEncryptedSymmetricKey("")
    setDecryptedSymmetricKey("")
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Person A (Key Generator)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Person B's Public Key - Modulus (n)</Label>
              <Input
                value={personBPublicKey.n}
                onChange={(e) => setPersonBPublicKey((prev) => ({ ...prev, n: e.target.value }))}
                placeholder="Enter Person B's public key modulus (n)"
              />
              <Label>Person B's Public Key - Public Exponent (e)</Label>
              <Input
                value={personBPublicKey.e}
                onChange={(e) => setPersonBPublicKey((prev) => ({ ...prev, e: e.target.value }))}
                placeholder="Enter Person B's public exponent (e)"
              />
            </div>
            <div className="space-y-2">
              <Label>Symmetric Key (16 hex digits)</Label>
              <div className="flex space-x-2">
                <Input
                  value={symmetricKey}
                  onChange={(e) => setSymmetricKey(e.target.value)}
                  placeholder="16 hex digits"
                  maxLength={16}
                  pattern="[0-9a-fA-F]{16}"
                />
                <Button onClick={generateKey}>Generate</Button>
              </div>
            </div>
            <Button onClick={encryptKey}>Encrypt Key for Person B</Button>
            <div>
              <Label>Encrypted Symmetric Key</Label>
              <Input value={encryptedSymmetricKey} readOnly />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Person B (Key Receiver)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Private Key - Private Exponent (d)</Label>
              <Input
                value={personBPrivateKey.d}
                onChange={(e) => setPersonBPrivateKey((prev) => ({ ...prev, d: e.target.value }))}
                placeholder="Enter private exponent (d)"
              />
              <Label>Private Key - Modulus (n)</Label>
              <Input
                value={personBPrivateKey.n}
                onChange={(e) => setPersonBPrivateKey((prev) => ({ ...prev, n: e.target.value }))}
                placeholder="Enter modulus (n)"
              />
            </div>
            <Button onClick={decryptKey}>Decrypt Received Key</Button>
            <div>
              <Label>Decrypted Symmetric Key</Label>
              <Input value={decryptedSymmetricKey} readOnly />
            </div>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            Key Exchange Process
            <Button variant="outline" onClick={clearSteps}>
              Clear Steps
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {steps.map((step, index) => (
            <p key={`step-${index}`} className="mb-2" dangerouslySetInnerHTML={{ __html: step }} />
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

