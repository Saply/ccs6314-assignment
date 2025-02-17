"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
const { GCD, modInverse, phiFunction, power } = require("../utils/modularInverse")

export default function RSA() {
  const [p, setP] = useState("")
  const [q, setQ] = useState("")
  const [e, setE] = useState("")
  const [message, setMessage] = useState("")
  const [publicKey, setPublicKey] = useState({ n: "", e: "" })
  const [privateKey, setPrivateKey] = useState({ n: "", d: "" })
  const [encryptedMessage, setEncryptedMessage] = useState("")
  const [decryptedMessage, setDecryptedMessage] = useState("")

  const [steps, setSteps] = useState({
    keyGeneration: [],
    encryption: [],
    decryption: [],
  })

  // key generation logic
  const generateKeys = () => {
    var n = p * q
    var newP = p - 1
    var newQ = q - 1
    var phi = newP * newQ
    var d = modInverse(e, phi)

    // "<u>Step 3: Choose e such that 1 < e < φ(n) and gcd(e, φ(n)) = 1></u>",
    setSteps((prevSteps) => ({
      ...prevSteps,
      keyGeneration: [
        "<u>Step 1: Calculate n = p * q</u>",
        `p = ${p}   q = ${q}`,
        `<b>Value of n = ${n}</b>`,
        "<u>Step 2: Calculate φ(n) = (p-1) * (q-1)</u>",
        `φ(${n}) = (${p} - 1) * (${q} - 1)`,
        `φ(${n}) = (${newP}) * (${newQ})`,
        `φ(${n}) = ${newP * newQ}`,
        "<u>Step 3: Verify that gcd(e, φ(n)) = 1 (coprime) AND 1 < e < φ(n)",
        `GCD(${e}, ${phi}) = ${GCD(e, phi)}`,
        `1 < ${e} < ${phi}`,
        "<u>Step 4: Calculate d such that e * d = 1 (mod φ(n))</u>",
        `d = ${e}^(-1) mod ${phi}`,
        `d = ${e}^(φ(${phi}) - 1) mod ${phi}`,
        `d = ${e}^(${phiFunction(phi)-1}) mod ${phi}`,
        `<b>d = ${d}</b>`,
        "<u>Step 5: Verify if e * d (mod φ(n)) = 1</u>",
        `${e} * ${d} mod φ(${n}) = ${e*d % phi}`,
        "<u>Step 6: Obtain Public and Private Keys</u>",
        `Public Key (e, n): (${e}, ${n})`,
        `Private Key (d, n): (${d}, ${n})`,
      ],
    }))
    setPublicKey({ n: n, e: parseInt(e, 10) })
    setPrivateKey({ n: n, d: d })
  }

  // Encryption logic
  const encryptMessage = () => {
    console.log(publicKey)
    console.log(privateKey)
    let encryptionSteps = [`<u>Step 1: Encode plaintext message '${message}' to number m in ASCII representation</u>`]
    let cipherSteps = []
    
    var msgArray = message.split("").map((char) => {
      var ascii = char.charCodeAt(0)
      let encrypted = power(
        ascii, publicKey.e, publicKey.n
      )
      let encryptedAscii = String.fromCharCode(encrypted)
      encryptionSteps.push(`${char}: ${ascii}`)
      cipherSteps.push(`${ascii}^${publicKey.e} mod ${publicKey.n} = <b>${encrypted}</b> → ${encryptedAscii}`)

      return encryptedAscii
    })
    // console.log(cipherSteps)
    encryptionSteps.push("<u>Step 2: Calculate ciphertext: c = m^e mod n then encode back to ASCII</u>")
    encryptionSteps = encryptionSteps.concat(cipherSteps)

    setSteps((prevSteps) => ({
      ...prevSteps,
      encryption: encryptionSteps,
    }))
    setEncryptedMessage(msgArray.join(""))
  }

  const decryptMessage = () => {
    let decryptionSteps = [`<u>Step 1: Encode encrypted message to number m in ASCII representation</u>`]
    let plaintextSteps = []
    let decryptedMessage = encryptedMessage.split("").map((char) => {
      let ascii = char.charCodeAt(0)
      let decrypted = power(
        ascii, privateKey.d, privateKey.n
      )
      let decryptedAscii = String.fromCharCode(decrypted)
      decryptionSteps.push(`${char}: ${ascii}`)
      plaintextSteps.push(`${ascii}^${privateKey.d} mod ${privateKey.n} = <b>${decrypted}</b> → ${decryptedAscii}`)

      return decryptedAscii
    })

    decryptionSteps.push("<u>Step 2: Calculate plaintext: m = c^d mod n then encode back to ASCII")
    decryptionSteps = decryptionSteps.concat(plaintextSteps)

    setSteps((prevSteps) => ({
      ...prevSteps,
      decryption: decryptionSteps,
    }))
    setDecryptedMessage(decryptedMessage.join(""))
  }

  return (
    <div className="border p-4 rounded-lg mb-4">
      <h3 className="text-xl font-semibold mb-4">RSA Encryption</h3>
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label htmlFor="rsa-p">Prime p</Label>
            <Input id="rsa-p" value={p} onChange={(e) => setP(e.target.value)} placeholder="Enter prime p" />
          </div>
          <div>
            <Label htmlFor="rsa-q">Prime q</Label>
            <Input id="rsa-q" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Enter prime q" />
          </div>
          <div>
            <Label htmlFor="rsa-e">Modulus e</Label>
            <Input id="rsa-e" value={e} onChange={(e) => setE(e.target.value)} placeholder="Enter modulus e" />
          </div>
        </div>
        <div>
          <Label htmlFor="rsa-message">Message</Label>
          <Input
            id="rsa-message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter message to encrypt"
          />
        </div>
        <Button onClick={generateKeys}>Generate Keys</Button>
        <Button onClick={encryptMessage}>Encrypt</Button>
        <Button onClick={decryptMessage}>Decrypt</Button>

        <Card>
          <CardHeader>
            <CardTitle>Key Generation Steps</CardTitle>
          </CardHeader>
          <CardContent>
            {steps.keyGeneration.map((step, index) => (
               <p key={`keygen-${index}`} dangerouslySetInnerHTML={{ __html: step }} />
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Encryption Steps</CardTitle>
          </CardHeader>
          <CardContent>
            {steps.encryption.map((step, index) => (
              <p key={`encrypt-${index}`} dangerouslySetInnerHTML={{ __html: step }} />
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Decryption Steps</CardTitle>
          </CardHeader>
          <CardContent>
            {steps.decryption.map((step, index) => (
              <p key={`decrypt-${index}`} dangerouslySetInnerHTML={{ __html: step }} />
            ))}
          </CardContent>
        </Card>

        <div>
          <Label>Public Key</Label>
          <Input value={`(${publicKey.e}, ${publicKey.n})`} readOnly />
        </div>
        <div>
          <Label>Private Key</Label>
          <Input value={`(${privateKey.d}, ${privateKey.n})`} readOnly />
        </div>
        <div>
          <Label>Encrypted Message</Label>
          <Input value={encryptedMessage} readOnly />
        </div>
        <div>
          <Label>Decrypted Message</Label>
          <Input value={decryptedMessage} readOnly />
        </div>
      </div>
    </div>
  )
}

