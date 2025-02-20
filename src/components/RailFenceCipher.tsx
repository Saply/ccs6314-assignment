"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"

export const encryptRailFence = (plaintext: string, depth: number): { ciphertext: string; steps: string[] } => {
  if (depth <= 1) return { ciphertext: plaintext, steps: ["Depth is 1, no encryption needed."] }

  const rail = Array.from({ length: depth }, () => "")
  let row = 0
  let direction = 1
  const steps: string[] = []

  for (let i = 0; i < plaintext.length; i++) {
    rail[row] += plaintext[i]
    const currentState = rail.map((r) => r).join("\n")
    steps.push(`Step ${i + 1}:\n${currentState}`)

    // Change row traversal direction
    if (row === 0) direction = 1
    else if (row === depth - 1) direction = -1
    row += direction
  }

  steps.push(`Final rail fence:\n${rail.join("\n")}`)
  return { ciphertext: rail.join(""), steps }
}

export const decryptRailFence = (ciphertext: string, depth: number): { plaintext: string; steps: string[] } => {
  if (depth <= 1) return { plaintext: ciphertext, steps: ["Depth is 1, no decryption needed."] }

  const rail = Array.from({ length: depth }, () => Array(ciphertext.length).fill(""))
  let row = 0,
    direction = 1
  const steps: string[] = []

  // Mark the rail fence pattern
  for (let i = 0; i < ciphertext.length; i++) {
    rail[row][i] = "*"
    if (row === 0) direction = 1
    else if (row === depth - 1) direction = -1
    row += direction
  }
  steps.push(`Rail fence pattern:\n${rail.map((r) => r.join("")).join("\n")}`)

  // Fill in the rail fence
  let index = 0
  for (let r = 0; r < depth; r++) {
    for (let c = 0; c < ciphertext.length; c++) {
      if (rail[r][c] === "*" && index < ciphertext.length) {
        rail[r][c] = ciphertext[index++]
      }
    }
    steps.push(`After filling row ${r + 1}:\n${rail.map((r) => r.join("")).join("\n")}`)
  }

  // Read off the rail fence
  let result = ""
  row = 0
  direction = 1
  for (let i = 0; i < ciphertext.length; i++) {
    result += rail[row][i]
    if (row === 0) direction = 1
    else if (row === depth - 1) direction = -1
    row += direction
  }

  steps.push(`Final decrypted text: ${result}`)
  return { plaintext: result, steps }
}

export default function RailFenceCipher() {
  const [depth, setDepth] = useState(3)
  const [plaintext, setPlaintext] = useState("")
  const [ciphertext, setCiphertext] = useState("")
  const [decryptedText, setDecryptedText] = useState("")
  const [encryptionSteps, setEncryptionSteps] = useState<string[]>([])
  const [decryptionSteps, setDecryptionSteps] = useState<string[]>([])
  const [encryptionTime, setEncryptionTime] = useState(0)
  const [decryptionTime, setDecryptionTime] = useState(0)
  const [showSteps, setShowSteps] = useState(true)

  const handleEncrypt = () => {
    const startTime = performance.now()
    const { ciphertext, steps } = encryptRailFence(plaintext, depth)
    const endTime = performance.now()
    setCiphertext(ciphertext)
    setEncryptionSteps(steps)
    setEncryptionTime(endTime - startTime)
  }

  const handleDecrypt = () => {
    const startTime = performance.now()
    const { plaintext, steps } = decryptRailFence(ciphertext, depth)
    const endTime = performance.now()
    setDecryptedText(plaintext)
    setDecryptionSteps(steps)
    setDecryptionTime(endTime - startTime)
  }

  return (
    <div className="border p-4 rounded-lg">
      <h3 className="text-xl font-semibold mb-4">Rail Fence Cipher</h3>
      <div className="space-y-4">
        <div>
          <Label htmlFor="rail-fence-depth">Depth</Label>
          <Input
            id="rail-fence-depth"
            type="number"
            min="2"
            value={depth}
            onChange={(e) => setDepth(Number.parseInt(e.target.value))}
          />
        </div>
        <div>
          <Label htmlFor="rail-fence-plaintext">Plaintext</Label>
          <Textarea
            id="rail-fence-plaintext"
            value={plaintext}
            onChange={(e) => setPlaintext(e.target.value)}
            placeholder="Enter plaintext"
          />
        </div>
        <Button onClick={handleEncrypt}>Encrypt</Button>
        <div>
          <Label htmlFor="rail-fence-ciphertext">Ciphertext</Label>
          <Textarea
            id="rail-fence-ciphertext"
            value={ciphertext}
            onChange={(e) => setCiphertext(e.target.value)}
            placeholder="Ciphertext"
          />
        </div>
        <Button onClick={handleDecrypt}>Decrypt</Button>
        <div>
          <Label htmlFor="rail-fence-decrypted">Decrypted Text</Label>
          <Textarea id="rail-fence-decrypted" value={decryptedText} readOnly placeholder="Decrypted text" />
        </div>
        {/* Display Encryption and Decryption Times */}
        <div>
          <h4 className="font-semibold">Encryption Time:</h4>
          <p>{encryptionTime.toFixed(3)} ms</p>
        </div>
        <div>
          <h4 className="font-semibold">Decryption Time:</h4>
          <p>{decryptionTime.toFixed(3)} ms</p>
        </div>
        <div className="flex items-center space-x-2">
          <Switch id="show-steps" checked={showSteps} onCheckedChange={setShowSteps} />
          <Label htmlFor="show-steps">Show Encryption/Decryption Steps</Label>
        </div>
        {showSteps && (
          <>
          <div>
          <h4 className="font-semibold">Encryption Steps:</h4>
          {encryptionSteps.map((step, index) => (
            <pre key={`encrypt-${index}`} className="whitespace-pre-wrap bg-gray-100 p-2 rounded mt-2 ">
              {step}
            </pre>
          ))}
        </div>
        <div>
          <h4 className="font-semibold">Decryption Steps:</h4>
          {decryptionSteps.map((step, index) => (
            <pre key={`decrypt-${index}`} className="whitespace-pre-wrap bg-gray-100 p-2 rounded mt-2">
              {step}
            </pre>
          ))}
        </div>
          </>
        )}
      </div>
    </div>
  )
}

