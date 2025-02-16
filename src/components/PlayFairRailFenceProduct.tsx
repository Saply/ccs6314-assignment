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

  const handleEncrypt = () => {
    if (!key || !plaintext) {
      alert("Key and Plaintext are required")
      return
    }

    const { matrix } = generatePlayfairMatrix(key)
    const { ciphertext: playfairCipher } = encrypt(plaintext, matrix)

    setCiphertext(playfairCipher)

    const { ciphertext: railFenceCipher } = encryptRailFence(playfairCipher, parseInt(depth))
    setCiphertext(railFenceCipher)
  }

  const handleDecrypt = () => {
    if (!key || !ciphertext) {
      alert("Key and Ciphertext are required")
      return
    }
    const { plaintext: decryptedRailFence } = decryptRailFence(ciphertext, parseInt(depth))
    setDecryptedText(decryptedRailFence)

    const { matrix } = generatePlayfairMatrix(key)
    const { plaintext: decryptedPlayfair } = decrypt(decryptedRailFence, matrix)

    setDecryptedText(decryptedPlayfair) 

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
      </div>
    </div>
  )
}

export default PlayFairRailFenceProduct
