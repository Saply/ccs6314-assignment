"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { generatePlayfairMatrix, encrypt, decrypt } from "@/components/PlayfairCipher"
import {encryptRailFence, decryptRailFence} from "@/components/RailFenceCipher"

const PlayFairRailFenceProduct = () => {
  const [key, setKey] = useState("")
  const [depth, setDepth] = useState("")
  const [plaintext, setPlaintext] = useState("")
  const [ciphertext, setCiphertext] = useState("")
  const [decryptedText, setDecryptedText] = useState("")
  const [matrixSteps, setMatrixSteps] = useState<string[]>([])
  const [encryptionSteps, setEncryptionSteps] = useState<string[]>([])
  const [decryptionSteps, setDecryptionSteps] = useState<string[]>([])
  const [encryptionSteps2, setEncryptionSteps2] = useState<string[]>([])
  const [decryptionSteps2, setDecryptionSteps2] = useState<string[]>([])

  const handleEncrypt = () => {
    if (!key || !plaintext) {
      alert("Key and Plaintext are required")
      return
    }

    const { matrix, steps: matrixSteps } = generatePlayfairMatrix(key)
    const { ciphertext: playfairCipher, steps: playfairEncryptSteps } = encrypt(plaintext, matrix)
    setCiphertext(playfairCipher)
    setMatrixSteps(matrixSteps)
    setEncryptionSteps(playfairEncryptSteps)
    const { ciphertext: railFenceCipher, steps: railFenceEncryptSteps } = encryptRailFence(playfairCipher, parseInt(depth))
    setCiphertext(railFenceCipher)
    setEncryptionSteps2(railFenceEncryptSteps)
  }

  const handleDecrypt = () => {
    if (!key || !ciphertext) {
      alert("Key and Ciphertext are required")
      return
    }
    const { plaintext: decryptedRailFence, steps: railfenceDecryptSteps } = decryptRailFence(ciphertext, parseInt(depth))
    setDecryptedText(decryptedRailFence)
    setDecryptionSteps(railfenceDecryptSteps)
    const { matrix } = generatePlayfairMatrix(key)
    const { plaintext: decryptedPlayfair, steps: playfairDecryptSteps } = decrypt(decryptedRailFence, matrix)
    setDecryptedText(decryptedPlayfair)
    setDecryptionSteps2(playfairDecryptSteps) 

  }

  return (
    <div className="border p-4 rounded-lg mb-4 w-full">
      <h3 className="text-xl font-semibold mb-4">Playfair and Rail Fence Product</h3>
      <div className="space-y-4">
        <div>
          <Label>Enter Key</Label>
          <Input value={key} onChange={(e) => setKey(e.target.value)} />
        </div>
        <div>
          <Label>Enter Depth</Label>
          <Input value={depth} onChange={(e) => setDepth(e.target.value)} />
        </div>
        <div>
          <Label>Enter Plaintext</Label>
          <Input value={plaintext} onChange={(e) => setPlaintext(e.target.value)} />
        </div>
        <Button onClick={handleEncrypt}>Encrypt</Button>
        <div>
          <Label>Ciphertext</Label>
          <Textarea value={ciphertext} readOnly />
        </div>
        <Button onClick={handleDecrypt}>Decrypt Ciphertext</Button>
        <div>
          <Label>Decrypted Ciphertext</Label>
          <Input value={decryptedText} readOnly />
        </div>
        <div>
          <h4 className="font-semibold">Playfair Matrix:</h4>
          {matrixSteps.map((step, index) => (
            <pre key={`matrix-${index}`} className="whitespace-pre-wrap bg-gray-100 p-2 rounded mt-2">
              {step}
            </pre>
          ))}
        </div>
        <div>
          <h4 className="font-semibold">Encryption Steps (Playfair):</h4>
          {encryptionSteps.map((step, index) => (
            <pre key={`encrypt-${index}`} className="whitespace-pre-wrap bg-gray-100 p-2 rounded mt-2">
              {step}
            </pre>
          ))}
        </div>
        <div>
          <h4 className="font-semibold">Encryption Steps (RailFence):</h4>
          {encryptionSteps2.map((step, index) => (
            <pre key={`encrypt-${index}`} className="whitespace-pre-wrap bg-gray-100 p-2 rounded mt-2">
              {step}
            </pre>
          ))}
        </div>
        <div>
          <h4 className="font-semibold">Decryption Steps: (Railfence)</h4>
          {decryptionSteps.map((step, index) => (
            <pre key={`decrypt-${index}`} className="whitespace-pre-wrap bg-gray-100 p-2 rounded mt-2">
              {step}
            </pre>
          ))}
        </div>
        <div>
          <h4 className="font-semibold">Decryption Steps: (PlayFair)</h4>
          {decryptionSteps2.map((step, index) => (
            <pre key={`decrypt-${index}`} className="whitespace-pre-wrap bg-gray-100 p-2 rounded mt-2">
              {step}
            </pre>
          ))}
        </div>
      </div>
    </div>
  )
}

export default PlayFairRailFenceProduct
