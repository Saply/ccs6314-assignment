"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"

// S-box
const sBox = [
  0x63, 0x7c, 0x77, 0x7b, 0xf2, 0x6b, 0x6f, 0xc5, 0x30, 0x01, 0x67, 0x2b, 0xfe, 0xd7, 0xab, 0x76, 0xca, 0x82, 0xc9,
  0x7d, 0xfa, 0x59, 0x47, 0xf0, 0xad, 0xd4, 0xa2, 0xaf, 0x9c, 0xa4, 0x72, 0xc0, 0xb7, 0xfd, 0x93, 0x26, 0x36, 0x3f,
  0xf7, 0xcc, 0x34, 0xa5, 0xe5, 0xf1, 0x71, 0xd8, 0x31, 0x15, 0x04, 0xc7, 0x23, 0xc3, 0x18, 0x96, 0x05, 0x9a, 0x07,
  0x12, 0x80, 0xe2, 0xeb, 0x27, 0xb2, 0x75, 0x09, 0x83, 0x2c, 0x1a, 0x1b, 0x6e, 0x5a, 0xa0, 0x52, 0x3b, 0xd6, 0xb3,
  0x29, 0xe3, 0x2f, 0x84, 0x53, 0xd1, 0x00, 0xed, 0x20, 0xfc, 0xb1, 0x5b, 0x6a, 0xcb, 0xbe, 0x39, 0x4a, 0x4c, 0x58,
  0xcf, 0xd0, 0xef, 0xaa, 0xfb, 0x43, 0x4d, 0x33, 0x85, 0x45, 0xf9, 0x02, 0x7f, 0x50, 0x3c, 0x9f, 0xa8, 0x51, 0xa3,
  0x40, 0x8f, 0x92, 0x9d, 0x38, 0xf5, 0xbc, 0xb6, 0xda, 0x21, 0x10, 0xff, 0xf3, 0xd2, 0xcd, 0x0c, 0x13, 0xec, 0x5f,
  0x97, 0x44, 0x17, 0xc4, 0xa7, 0x7e, 0x3d, 0x64, 0x5d, 0x19, 0x73, 0x60, 0x81, 0x4f, 0xdc, 0x22, 0x2a, 0x90, 0x88,
  0x46, 0xee, 0xb8, 0x14, 0xde, 0x5e, 0x0b, 0xdb, 0xe0, 0x32, 0x3a, 0x0a, 0x49, 0x06, 0x24, 0x5c, 0xc2, 0xd3, 0xac,
  0x62, 0x91, 0x95, 0xe4, 0x79, 0xe7, 0xc8, 0x37, 0x6d, 0x8d, 0xd5, 0x4e, 0xa9, 0x6c, 0x56, 0xf4, 0xea, 0x65, 0x7a,
  0xae, 0x08, 0xba, 0x78, 0x25, 0x2e, 0x1c, 0xa6, 0xb4, 0xc6, 0xe8, 0xdd, 0x74, 0x1f, 0x4b, 0xbd, 0x8b, 0x8a, 0x70,
  0x3e, 0xb5, 0x66, 0x48, 0x03, 0xf6, 0x0e, 0x61, 0x35, 0x57, 0xb9, 0x86, 0xc1, 0x1d, 0x9e, 0xe1, 0xf8, 0x98, 0x11,
  0x69, 0xd9, 0x8e, 0x94, 0x9b, 0x1e, 0x87, 0xe9, 0xce, 0x55, 0x28, 0xdf, 0x8c, 0xa1, 0x89, 0x0d, 0xbf, 0xe6, 0x42,
  0x68, 0x41, 0x99, 0x2d, 0x0f, 0xb0, 0x54, 0xbb, 0x16,
]

// Inverse S-box
const invSBox = [
  0x52, 0x09, 0x6a, 0xd5, 0x30, 0x36, 0xa5, 0x38, 0xbf, 0x40, 0xa3, 0x9e, 0x81, 0xf3, 0xd7, 0xfb, 0x7c, 0xe3, 0x39,
  0x82, 0x9b, 0x2f, 0xff, 0x87, 0x34, 0x8e, 0x43, 0x44, 0xc4, 0xde, 0xe9, 0xcb, 0x54, 0x7b, 0x94, 0x32, 0xa6, 0xc2,
  0x23, 0x3d, 0xee, 0x4c, 0x95, 0x0b, 0x42, 0xfa, 0xc3, 0x4e, 0x08, 0x2e, 0xa1, 0x66, 0x28, 0xd9, 0x24, 0xb2, 0x76,
  0x5b, 0xa2, 0x49, 0x6d, 0x8b, 0xd1, 0x25, 0x72, 0xf8, 0xf6, 0x64, 0x86, 0x68, 0x98, 0x16, 0xd4, 0xa4, 0x5c, 0xcc,
  0x5d, 0x65, 0xb6, 0x92, 0x6c, 0x70, 0x48, 0x50, 0xfd, 0xed, 0xb9, 0xda, 0x5e, 0x15, 0x46, 0x57, 0xa7, 0x8d, 0x9d,
  0x84, 0x90, 0xd8, 0xab, 0x00, 0x8c, 0xbc, 0xd3, 0x0a, 0xf7, 0xe4, 0x58, 0x05, 0xb8, 0xb3, 0x45, 0x06, 0xd0, 0x2c,
  0x1e, 0x8f, 0xca, 0x3f, 0x0f, 0x02, 0xc1, 0xaf, 0xbd, 0x03, 0x01, 0x13, 0x8a, 0x6b, 0x3a, 0x91, 0x11, 0x41, 0x4f,
  0x67, 0xdc, 0xea, 0x97, 0xf2, 0xcf, 0xce, 0xf0, 0xb4, 0xe6, 0x73, 0x96, 0xac, 0x74, 0x22, 0xe7, 0xad, 0x35, 0x85,
  0xe2, 0xf9, 0x37, 0xe8, 0x1c, 0x75, 0xdf, 0x6e, 0x47, 0xf1, 0x1a, 0x71, 0x1d, 0x29, 0xc5, 0x89, 0x6f, 0xb7, 0x62,
  0x0e, 0xaa, 0x18, 0xbe, 0x1b, 0xfc, 0x56, 0x3e, 0x4b, 0xc6, 0xd2, 0x79, 0x20, 0x9a, 0xdb, 0xc0, 0xfe, 0x78, 0xcd,
  0x5a, 0xf4, 0x1f, 0xdd, 0xa8, 0x33, 0x88, 0x07, 0xc7, 0x31, 0xb1, 0x12, 0x10, 0x59, 0x27, 0x80, 0xec, 0x5f, 0x60,
  0x51, 0x7f, 0xa9, 0x19, 0xb5, 0x4a, 0x0d, 0x2d, 0xe5, 0x7a, 0x9f, 0x93, 0xc9, 0x9c, 0xef, 0xa0, 0xe0, 0x3b, 0x4d,
  0xae, 0x2a, 0xf5, 0xb0, 0xc8, 0xeb, 0xbb, 0x3c, 0x83, 0x53, 0x99, 0x61, 0x17, 0x2b, 0x04, 0x7e, 0xba, 0x77, 0xd6,
  0x26, 0xe1, 0x69, 0x14, 0x63, 0x55, 0x21, 0x0c, 0x7d,
]

// Round constant words
const rCon = [
  [0x01, 0x00, 0x00, 0x00],
  [0x02, 0x00, 0x00, 0x00],
  [0x04, 0x00, 0x00, 0x00],
  [0x08, 0x00, 0x00, 0x00],
  [0x10, 0x00, 0x00, 0x00],
  [0x20, 0x00, 0x00, 0x00],
  [0x40, 0x00, 0x00, 0x00],
  [0x80, 0x00, 0x00, 0x00],
  [0x1b, 0x00, 0x00, 0x00],
  [0x36, 0x00, 0x00, 0x00],
]

// Key expansion
const keyExpansion = (key: number[]): number[][] => {
  const expandedKey = []
  for (let i = 0; i < 4; i++) {
    expandedKey.push(key.slice(i * 4, (i + 1) * 4))
  }

  for (let i = 4; i < 44; i++) {
    let temp = expandedKey[i - 1].slice()
    if (i % 4 === 0) {
      temp = [sBox[temp[1]], sBox[temp[2]], sBox[temp[3]], sBox[temp[0]]]
      for (let j = 0; j < 4; j++) {
        temp[j] ^= rCon[i / 4 - 1][j]
      }
    }
    expandedKey[i] = []
    for (let j = 0; j < 4; j++) {
      expandedKey[i][j] = expandedKey[i - 4][j] ^ temp[j]
    }
  }

  return expandedKey
}

// Add round key
const addRoundKey = (state: number[][], roundKey: number[][]) => {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      state[i][j] ^= roundKey[j][i]
    }
  }
}

// Substitute bytes
const subBytes = (state: number[][]) => {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      state[i][j] = sBox[state[i][j]]
    }
  }
}

// Inverse substitute bytes
const invSubBytes = (state: number[][]) => {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      state[i][j] = invSBox[state[i][j]]
    }
  }
}

// Shift rows
const shiftRows = (state: number[][]) => {
  const temp = state[1][0]
  state[1][0] = state[1][1]
  state[1][1] = state[1][2]
  state[1][2] = state[1][3]
  state[1][3] = temp

  const temp1 = state[2][0]
  const temp2 = state[2][1]
  state[2][0] = state[2][2]
  state[2][1] = state[2][3]
  state[2][2] = temp1
  state[2][3] = temp2

  const temp3 = state[3][3]
  state[3][3] = state[3][2]
  state[3][2] = state[3][1]
  state[3][1] = state[3][0]
  state[3][0] = temp3
}

// Inverse shift rows
const invShiftRows = (state: number[][]) => {
  const temp = state[1][3]
  state[1][3] = state[1][2]
  state[1][2] = state[1][1]
  state[1][1] = state[1][0]
  state[1][0] = temp

  const temp1 = state[2][0]
  const temp2 = state[2][1]
  state[2][0] = state[2][2]
  state[2][1] = state[2][3]
  state[2][2] = temp1
  state[2][3] = temp2

  const temp3 = state[3][0]
  state[3][0] = state[3][1]
  state[3][1] = state[3][2]
  state[3][2] = state[3][3]
  state[3][3] = temp3
}

// Mix columns
const mixColumns = (state: number[][]) => {
  for (let i = 0; i < 4; i++) {
    const a = state[0][i]
    const b = state[1][i]
    const c = state[2][i]
    const d = state[3][i]

    state[0][i] = gmul(a, 2) ^ gmul(b, 3) ^ c ^ d
    state[1][i] = a ^ gmul(b, 2) ^ gmul(c, 3) ^ d
    state[2][i] = a ^ b ^ gmul(c, 2) ^ gmul(d, 3)
    state[3][i] = gmul(a, 3) ^ b ^ c ^ gmul(d, 2)
  }
}

// Inverse mix columns
const invMixColumns = (state: number[][]) => {
  for (let i = 0; i < 4; i++) {
    const a = state[0][i]
    const b = state[1][i]
    const c = state[2][i]
    const d = state[3][i]

    state[0][i] = gmul(a, 14) ^ gmul(b, 11) ^ gmul(c, 13) ^ gmul(d, 9)
    state[1][i] = gmul(a, 9) ^ gmul(b, 14) ^ gmul(c, 11) ^ gmul(d, 13)
    state[2][i] = gmul(a, 13) ^ gmul(b, 9) ^ gmul(c, 14) ^ gmul(d, 11)
    state[3][i] = gmul(a, 11) ^ gmul(b, 13) ^ gmul(c, 9) ^ gmul(d, 14)
  }
}

// Galois Field multiplication
const gmul = (a: number, b: number): number => {
  let p = 0
  for (let i = 0; i < 8; i++) {
    if ((b & 1) !== 0) {
      p ^= a
    }
    const hiBitSet = (a & 0x80) !== 0
    a <<= 1
    if (hiBitSet) {
      a ^= 0x1b
    }
    b >>= 1
  }
  return p & 0xff
}

const stateToString = (state: number[][]): string => {
  return state.map((row) => row.map((val) => val.toString(16).padStart(2, "0")).join(" ")).join("\n")
}

// AES encryption
const aesEncrypt = (input: number[], key: number[]): { output: number[]; logs: string[] } => {
  const logs: string[] = []
  const state = [
    [input[0], input[4], input[8], input[12]],
    [input[1], input[5], input[9], input[13]],
    [input[2], input[6], input[10], input[14]],
    [input[3], input[7], input[11], input[15]],
  ]

  logs.push(`Initial state:\n${stateToString(state)}`)

  const expandedKey = keyExpansion(key)

  addRoundKey(state, expandedKey.slice(0, 4))
  logs.push(`After initial AddRoundKey:\n${stateToString(state)}`)

  for (let round = 1; round < 10; round++) {
    subBytes(state)
    logs.push(`Round ${round}, after SubBytes:\n${stateToString(state)}`)

    shiftRows(state)
    logs.push(`Round ${round}, after ShiftRows:\n${stateToString(state)}`)

    mixColumns(state)
    logs.push(`Round ${round}, after MixColumns:\n${stateToString(state)}`)

    addRoundKey(state, expandedKey.slice(round * 4, (round + 1) * 4))
    logs.push(`Round ${round}, after AddRoundKey:\n${stateToString(state)}`)
  }

  subBytes(state)
  logs.push(`Final round, after SubBytes:\n${stateToString(state)}`)

  shiftRows(state)
  logs.push(`Final round, after ShiftRows:\n${stateToString(state)}`)

  addRoundKey(state, expandedKey.slice(40, 44))
  logs.push(`Final round, after AddRoundKey:\n${stateToString(state)}`)

  const output = new Array(16)
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      output[i + j * 4] = state[i][j]
    }
  }
  return { output, logs }
}

// AES decryption
const aesDecrypt = (input: number[], key: number[]): { output: number[]; logs: string[] } => {
  const logs: string[] = []
  const state = [
    [input[0], input[4], input[8], input[12]],
    [input[1], input[5], input[9], input[13]],
    [input[2], input[6], input[10], input[14]],
    [input[3], input[7], input[11], input[15]],
  ]

  logs.push(`Initial state:\n${stateToString(state)}`)

  const expandedKey = keyExpansion(key)

  addRoundKey(state, expandedKey.slice(40, 44))
  logs.push(`After initial AddRoundKey:\n${stateToString(state)}`)
  for (let round = 9; round > 0; round--) {
    invShiftRows(state)
    logs.push(`Round ${10 - round}, after InvShiftRows:\n${stateToString(state)}`)

    invSubBytes(state)
    logs.push(`Round ${10 - round}, after InvSubBytes:\n${stateToString(state)}`)

    addRoundKey(state, expandedKey.slice(round * 4, (round + 1) * 4))
    logs.push(`Round ${10 - round}, after AddRoundKey:\n${stateToString(state)}`)

    invMixColumns(state)
    logs.push(`Round ${10 - round}, after InvMixColumns:\n${stateToString(state)}`)
  }

  invShiftRows(state)
  logs.push(`Final round, after InvShiftRows:\n${stateToString(state)}`)

  invSubBytes(state)
  logs.push(`Final round, after InvSubBytes:\n${stateToString(state)}`)

  addRoundKey(state, expandedKey.slice(0, 4))
  logs.push(`Final round, after AddRoundKey:\n${stateToString(state)}`)

  const output = new Array(16)
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      output[i + j * 4] = state[i][j]
    }
  }

  return { output, logs }
}

// Hex string to bytes converter
const hexToBytes = (hex: string): number[] => {
  const bytes = []
  for (let i = 0; i < hex.length; i += 2) {
    bytes.push(Number.parseInt(hex.substr(i, 2), 16))
  }
  return bytes
}

export default function AESEncryption() {
  const [key, setKey] = useState("")
  const [plaintext, setPlaintext] = useState("")
  const [ciphertext, setCiphertext] = useState("")
  const [decryptedText, setDecryptedText] = useState("")
  const [convertedKey, setConvertedKey] = useState<number[] | null>(null)
  const [encryptionLogs, setEncryptionLogs] = useState<string[]>([])
  const [decryptionLogs, setDecryptionLogs] = useState<string[]>([])
  const [aesEncryptionTime, setAesEncryptionTime] = useState(0.0)
  const [aesDecryptionTime, setAesDecryptionTime] = useState(0.0)
  const [showSteps, setShowSteps] = useState(true)


  const handleConvertKey = () => {
    if (key.length !== 32) {
      alert("Please enter a 32-character hex string for the key (128-bit)")
      return
    }
    const bytes = hexToBytes(key)
    setConvertedKey(bytes)
  }

  const handleEncrypt = () => {
    const startTime = performance.now()
    if (key.length !== 32 && !convertedKey) {
      alert("Please enter a 32-character hex string for the key (128-bit) or convert the key")
      return
    }
    const keyBytes = convertedKey || hexToBytes(key)
    const textBytes = new TextEncoder().encode(plaintext)

    // PKCS7 padding
    const blockSize = 16
    const padLength = blockSize - (textBytes.length % blockSize)
    const paddedText = new Uint8Array(textBytes.length + padLength)
    paddedText.set(textBytes)
    paddedText.fill(padLength, textBytes.length)

    let encryptedBytes: number[] = []
    let allLogs: string[] = []
    for (let i = 0; i < paddedText.length; i += 16) {
      const block = Array.from(paddedText.slice(i, i + 16))
      //encryptedBytes = encryptedBytes.concat(aesEncrypt(block, keyBytes))
      const { output, logs } = aesEncrypt(block, keyBytes)
      encryptedBytes = encryptedBytes.concat(output)
      allLogs = allLogs.concat(logs)
    }

    const endTime = performance.now()
    setAesEncryptionTime(endTime - startTime)
    setCiphertext(btoa(String.fromCharCode.apply(null, encryptedBytes)))
    setEncryptionLogs(allLogs)
  }

  const handleDecrypt = () => {
    const startTime = performance.now()
    if (key.length !== 32 && !convertedKey) {
      alert("Please enter a 32-character hex string for the key (128-bit) or convert the key")
      return
    }
    const keyBytes = convertedKey || hexToBytes(key)
    const encryptedBytes = Uint8Array.from(atob(ciphertext), (c) => c.charCodeAt(0))

    let decryptedBytes: number[] = []
    let allLogs: string[] = []
    for (let i = 0; i < encryptedBytes.length; i += 16) {
      const block = Array.from(encryptedBytes.slice(i, i + 16))
      const { output, logs } = aesDecrypt(block, keyBytes)
      decryptedBytes = decryptedBytes.concat(output)
      allLogs = allLogs.concat(logs)
    }

    // Remove PKCS7 padding
    const paddingLength = decryptedBytes[decryptedBytes.length - 1]
    decryptedBytes = decryptedBytes.slice(0, decryptedBytes.length - paddingLength)

    const endTime = performance.now()
    setAesDecryptionTime(endTime - startTime)
    setDecryptedText(new TextDecoder().decode(new Uint8Array(decryptedBytes)))
    setDecryptionLogs(allLogs)
  }

  return (
    <div className="border p-4 rounded-lg">
      <h3 className="text-xl font-semibold mb-4">AES-ECB Encryption (128-bit key)</h3>
      <div className="space-y-4">
        <div className="flex items-end space-x-2">
          <div className="flex-grow">
            <Label htmlFor="key-input">Key (32-character hex string)</Label>
            <Input
              id="key-input"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              maxLength={32}
              placeholder="Enter 32-character hex string"
            />
          </div>
          <Button onClick={handleConvertKey}>Convert Key</Button>
        </div>
        {convertedKey && (
          <div className="mt-2">
            <Label>Converted Key (16 bytes)</Label>
            <div className="p-2 bg-muted rounded-md font-mono text-sm">
              {convertedKey.map((byte, index) => (
                <span key={index} className="inline-block w-8">
                  {byte.toString(16).padStart(2, "0")}
                </span>
              ))}
            </div>
          </div>
        )}
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
      <div>
        <h4 className="font-semibold">Encryption Time:</h4>
        <p>{aesEncryptionTime ? aesEncryptionTime.toFixed(20) : 0} ms</p>
      </div>
      <div>
        <h4 className="font-semibold">Decryption Time:</h4>
        <p>{aesDecryptionTime ? aesDecryptionTime.toFixed(20) : 0} ms</p>
      </div>

      <div className="flex items-center space-x-2">
        <Switch id="show-steps" checked={showSteps} onCheckedChange={setShowSteps} />
        <Label htmlFor="show-steps">Show Encryption/Decryption Steps</Label>
      </div>

      <div className="mt-8 space-y-4">
        {showSteps && (
          <>
            <h4 className="text-lg font-semibold">Encryption Steps:</h4>
            <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">{encryptionLogs.join("\n\n")}</pre>
            <h4 className="text-lg font-semibold">Decryption Steps:</h4>
            <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">{decryptionLogs.join("\n\n")}</pre>
          </>
        )}

      
        <ol className="list-decimal list-inside space-y-2">
          <li>Input a 128-bit key as a 32-character hex string</li>
          <li>Convert the key from hex to bytes</li>
          <li>Convert the plaintext to bytes</li>
          <li>Pad the plaintext to a multiple of 16 bytes using PKCS7 padding</li>
          <li>
            For each 16-byte block of plaintext:
            <ol className="list-decimal list-inside ml-4">
              <li>Perform key expansion</li>
              <li>Add round key (initial round)</li>
              <li>
                Perform 9 main rounds:
                <ul className="list-disc list-inside ml-4">
                  <li>Substitute bytes</li>
                  <li>Shift rows</li>
                  <li>Mix columns</li>
                  <li>Add round key</li>
                </ul>
              </li>
              <li>
                Perform final round:
                <ul className="list-disc list-inside ml-4">
                  <li>Substitute bytes</li>
                  <li>Shift rows</li>
                  <li>Add round key</li>
                </ul>
              </li>
            </ol>
          </li>
          <li>Concatenate all encrypted blocks</li>
          <li>Convert the result to base64 for display</li>
        </ol>
        <h4 className="text-lg font-semibold">Decryption Steps:</h4>
        <ol className="list-decimal list-inside space-y-2">
          <li>Convert the base64 ciphertext to bytes</li>
          <li>Convert the key from hex to bytes</li>
          <li>
            For each 16-byte block of ciphertext:
            <ol className="list-decimal list-inside ml-4">
              <li>Perform key expansion</li>
              <li>Add round key (final round key)</li>
              <li>
                Perform 9 main rounds:
                <ul className="list-disc list-inside ml-4">
                  <li>Inverse shift rows</li>
                  <li>Inverse substitute bytes</li>
                  <li>Add round key</li>
                  <li>Inverse mix columns</li>
                </ul>
              </li>
              <li>
                Perform final round:
                <ul className="list-disc list-inside ml-4">
                  <li>Inverse shift rows</li>
                  <li>Inverse substitute bytes</li>
                  <li>Add round key (initial round key)</li>
                </ul>
              </li>
            </ol>
          </li>
          <li>Concatenate all decrypted blocks</li>
          <li>Remove PKCS7 padding</li>
          <li>Convert the result to text for display</li>
        </ol>
      </div>
    </div>
  )
}

