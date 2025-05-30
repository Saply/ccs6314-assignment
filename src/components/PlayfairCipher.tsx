"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"

export const generatePlayfairMatrix = (key: string): { matrix: string[][]; steps: string[]} => {
  const alphabet = "ABCDEFGHIKLMNOPQRSTUVWXYZ"
  const uniqueChars = Array.from(new Set(key.toUpperCase().replace(/J/g, "I") + alphabet))
  console.log(uniqueChars)
  const matrix = Array.from({ length: 5 }, (_, i) => uniqueChars.slice(i * 5, (i + 1) * 5))

  const steps = [
    `Key: ${key.toUpperCase()}`,
    `Unique characters: ${uniqueChars.join("")}`,
    "Playfair Matrix:",
    matrix.map((row) => row.join(" ")).join("\n"),
  ]

  return { matrix, steps}
}

export const encrypt = (plaintext: string, matrix: string[][]): { ciphertext: string; steps: string[]} => {

  const steps: string[] = []
  let ciphertext = ""
  const pairs =
    plaintext
      .toUpperCase()
      .replace(/J/g, "I")
      .match(/[A-Z]{1,2}/g) || []

  if (pairs[pairs.length - 1].length === 1) {
    pairs[pairs.length - 1] += "X"
  }

  steps.push(`Plaintext pairs: ${pairs.join(" ")}`)

  //If both letters in a pair are the same, the second letter is replaced with 'X
  for (const pair of pairs) {
    // eslint-disable-next-line prefer-const
    let [a, b] = pair.split("")
    if (a === b) b = "X"
  
    //Finds the row and column of both letters (a and b) in the Playfair matrix.
    let rowA, colA, rowB, colB
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 5; j++) {
        if (matrix[i][j] === a) {
          rowA = i
          colA = j
        }
        if (matrix[i][j] === b) {
          rowB = i
          colB = j
        }
      }
    }
    //If both letters are in the same row, replace them with the next column values.
    //If both letters are in the same column, replace them with the next row values.
    //Otherwise, swap the columns
    let encryptedPair = ""
    if (rowA === rowB) {
      encryptedPair = matrix[rowA][(colA + 1) % 5] + matrix[rowB][(colB + 1) % 5]
    } else if (colA === colB) {
      encryptedPair = matrix[(rowA + 1) % 5][colA] + matrix[(rowB + 1) % 5][colB]
    } else {
      encryptedPair = matrix[rowA][colB] + matrix[rowB][colA]
    }

    steps.push(`${pair} -> ${encryptedPair}`)
    ciphertext += encryptedPair
  }
  return { ciphertext, steps}
}

export const decrypt = (ciphertext: string, matrix: string[][]): { plaintext: string; steps: string[]} => {

  const steps: string[] = []
  let plaintext = ""
  const pairs = ciphertext.match(/[A-Z]{2}/g) || []

  steps.push(`Ciphertext pairs: ${pairs.join(" ")}`)

  for (const pair of pairs) {
    const [a, b] = pair.split("")

    let rowA, colA, rowB, colB
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 5; j++) {
        if (matrix[i][j] === a) {
          rowA = i
          colA = j
        }
        if (matrix[i][j] === b) {
          rowB = i
          colB = j
        }
      }
    }

    let decryptedPair = ""
    if (rowA === rowB) {
      decryptedPair = matrix[rowA][(colA - 1 + 5) % 5] + matrix[rowB][(colB - 1 + 5) % 5]
    } else if (colA === colB) {
      decryptedPair = matrix[(rowA - 1 + 5) % 5][colA] + matrix[(rowB - 1 + 5) % 5][colB]
    } else {
      decryptedPair = matrix[rowA][colB] + matrix[rowB][colA]
    }

    steps.push(`${pair} -> ${decryptedPair}`)
    plaintext += decryptedPair
  }

  return { plaintext, steps}
}

export default function PlayfairCipher() {
  const [key, setKey] = useState("")
  const [plaintext, setPlaintext] = useState("")
  const [ciphertext, setCiphertext] = useState("")
  const [decryptedText, setDecryptedText] = useState("")
  const [matrixSteps, setMatrixSteps] = useState<string[]>([])
  const [encryptionSteps, setEncryptionSteps] = useState<string[]>([])
  const [decryptionSteps, setDecryptionSteps] = useState<string[]>([])
  const [encryptionTime, setEncryptionTime] = useState(0)
  const [decryptionTime, setDecryptionTime] = useState(0)
  const [showSteps, setShowSteps] = useState(true)


  const handleEncrypt = () => {
    const startTime = performance.now()
    const { matrix, steps: matrixSteps} = generatePlayfairMatrix(key)
    const { ciphertext, steps: encryptSteps} = encrypt(plaintext, matrix)
    const endTime = performance.now()
    const time = endTime - startTime
    console.log(time) 
    setCiphertext(ciphertext)
    setMatrixSteps(matrixSteps)
    setEncryptionSteps(encryptSteps)
    setEncryptionTime(time)
  }

  const handleDecrypt = () => {
    const startTime = performance.now()
    const { matrix, steps: matrixSteps} = generatePlayfairMatrix(key)
    const { plaintext, steps: decryptSteps} = decrypt(ciphertext, matrix)
    const endTime = performance.now()
    const time = endTime - startTime
    console.log(time)
    setDecryptedText(plaintext)
    setMatrixSteps(matrixSteps)
    setDecryptionSteps(decryptSteps)
    setDecryptionTime(time)
  }

  return (
    <div className="border p-4 rounded-lg">
      <h3 className="text-xl font-semibold mb-4">Playfair Cipher</h3>
      <div className="space-y-4">
        <div>
          <Label htmlFor="playfair-key">Key</Label>
          <Input id="playfair-key" value={key} onChange={(e) => setKey(e.target.value)} placeholder="Enter key" />
        </div>
        <div>
          <Label htmlFor="playfair-plaintext">Plaintext</Label>
          <Textarea
            id="playfair-plaintext"
            value={plaintext}
            onChange={(e) => setPlaintext(e.target.value)}
            placeholder="Enter plaintext"
          />
        </div>
        <Button onClick={handleEncrypt}>Encrypt</Button>
        <div>
          <Label htmlFor="playfair-ciphertext">Ciphertext</Label>
          <Textarea
            id="playfair-ciphertext"
            value={ciphertext}
            onChange={(e) => setCiphertext(e.target.value)}
            placeholder="Ciphertext"
          />
        </div>
        <Button onClick={handleDecrypt}>Decrypt</Button>
        <div>
          <Label htmlFor="playfair-decrypted">Decrypted Text</Label>
          <Textarea id="playfair-decrypted" value={decryptedText} readOnly placeholder="Decrypted text" />
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
          <h4 className="font-semibold">Playfair Matrix:</h4>
          {matrixSteps.map((step, index) => (
            <pre key={`matrix-${index}`} className="whitespace-pre-wrap bg-gray-100 p-2 rounded mt-2">
              {step}
            </pre>
          ))}
        </div>
        <div>
          <h4 className="font-semibold">Encryption Steps:</h4>
          {encryptionSteps.map((step, index) => (
            <pre key={`encrypt-${index}`} className="whitespace-pre-wrap bg-gray-100 p-2 rounded mt-2">
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

