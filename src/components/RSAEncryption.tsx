"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { GCD, modInverse, phiFunction, power } from "../utils/modularInverse"

export default function RSAEncryption({ state, setState }) {
  const [localSteps, setLocalSteps] = useState({
    keyGeneration: [],
    encryption: [],
    decryption: [],
  })

  useEffect(() => {
    setState((prevState) => ({
      ...prevState,
      steps: localSteps,
    }))
  }, [localSteps, setState])

  // key generation logic
  const generateKeys = () => {
    const n = Number(state.p) * Number(state.q)
    const newP = Number(state.p) - 1
    const newQ = Number(state.q) - 1
    const phi = newP * newQ
    const d = modInverse(Number(state.e), phi)

    const keyGenerationSteps = [
      "<u>Step 1: Calculate n = p * q</u>",
      `p = ${state.p}  \t q = ${state.q}`,
      `<b>Value of n = ${n}</b>`,
      "<u>Step 2: Calculate φ(n) = (p-1) * (q-1)</u>",
      `φ(${n}) = (${state.p} - 1) * (${state.q} - 1)`,
      `φ(${n}) = (${newP}) * (${newQ})`,
      `φ(${n}) = ${newP * newQ}`,
      "<u>Step 3: Verify that gcd(e, φ(n)) = 1 (coprime) AND 1 < e < φ(n)</u>",
      `GCD(${state.e}, ${phi}) = ${GCD(Number(state.e), phi)}`,
      `1 < ${state.e} < ${phi}`,
      "<u>Step 4: Calculate d such that e * d = 1 (mod φ(n))</u>",
      `d = ${state.e}^(-1) mod ${phi}`,
      `d = ${state.e}^(φ(${phi}) - 1) mod ${phi}`,
      `d = ${state.e}^(${phiFunction(phi) - 1}) mod ${phi}`,
      `<b>d = ${d}</b>`,
      "<u>Step 5: Verify if e * d (mod φ(n)) = 1</u>",
      `${state.e} * ${d} mod φ(${n}) = ${(Number(state.e) * d) % phi}`,
      "<u>Step 6: Obtain Public and Private Keys</u>",
      `Public Key (e, n): (${state.e}, ${n})`,
      `Private Key (d, n): (${d}, ${n})`,
    ]

    setState((prevState) => ({
      ...prevState,
      publicKey: { n: n, e: Number.parseInt(state.e, 10) },
      privateKey: { n: n, d: d },
    }))

    setLocalSteps((prevSteps) => ({
      ...prevSteps,
      keyGeneration: keyGenerationSteps,
    }))
  }

  // Encryption logic
  const encryptMessage = () => {
    let encryptionSteps = [
      `<u>Step 1: Encode plaintext message '${state.message}' to number m in ASCII representation</u>`,
    ]
    const cipherSteps = []

    const msgArray = state.message.split("").map((char) => {
      const ascii = char.charCodeAt(0)
      // console.log("pubkey in rsa: " + state.publicKey.e)
      const encrypted = power(ascii, state.publicKey.e, state.publicKey.n)
      const encryptedAscii = String.fromCharCode(encrypted)
      encryptionSteps.push(`${char}: ${ascii}`)
      cipherSteps.push(
        `${ascii}^${state.publicKey.e} mod ${state.publicKey.n} = <b>${encrypted}</b> → ${encryptedAscii}`,
      )

      return encryptedAscii
    })

    encryptionSteps.push("<u>Step 2: Calculate ciphertext: c = m^e mod n then encode back to ASCII</u>")
    encryptionSteps = encryptionSteps.concat(cipherSteps)

    setState((prevState) => ({
      ...prevState,
      encryptedMessage: msgArray.join(""),
    }))

    setLocalSteps((prevSteps) => ({
      ...prevSteps,
      encryption: encryptionSteps,
    }))
  }

  const decryptMessage = () => {
    let decryptionSteps = [`<u>Step 1: Encode encrypted message to number m in ASCII representation</u>`]
    const plaintextSteps = []
    const decryptedMessage = state.encryptedMessage.split("").map((char) => {
      const ascii = char.charCodeAt(0)
      console.log("ascii in rsa: " + ascii)
      const decrypted = power(ascii, state.privateKey.d, state.privateKey.n)
      const decryptedAscii = String.fromCharCode(decrypted)
      decryptionSteps.push(`${char}: ${ascii}`)
      plaintextSteps.push(
        `${ascii}^${state.privateKey.d} mod ${state.privateKey.n} = <b>${decrypted}</b> → ${decryptedAscii}`,
      )

      return decryptedAscii
    })

    decryptionSteps.push("<u>Step 2: Calculate plaintext: m = c^d mod n then encode back to ASCII</u>")
    decryptionSteps = decryptionSteps.concat(plaintextSteps)

    setState((prevState) => ({
      ...prevState,
      decryptedMessage: decryptedMessage.join(""),
    }))

    setLocalSteps((prevSteps) => ({
      ...prevSteps,
      decryption: decryptionSteps,
    }))
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="rsa-p">Prime p</Label>
          <Input
            id="rsa-p"
            value={state.p}
            onChange={(e) => setState((prev) => ({ ...prev, p: e.target.value }))}
            placeholder="Enter prime p"
          />
        </div>
        <div>
          <Label htmlFor="rsa-q">Prime q</Label>
          <Input
            id="rsa-q"
            value={state.q}
            onChange={(e) => setState((prev) => ({ ...prev, q: e.target.value }))}
            placeholder="Enter prime q"
          />
        </div>
        <div>
          <Label htmlFor="rsa-e">Public exponent e</Label>
          <Input
            id="rsa-e"
            value={state.e}
            onChange={(e) => setState((prev) => ({ ...prev, e: e.target.value }))}
            placeholder="Enter public exponent e"
          />
        </div>
      </div>
      <div>
        <Label htmlFor="rsa-message">Message</Label>
        <Input
          id="rsa-message"
          value={state.message}
          onChange={(e) => setState((prev) => ({ ...prev, message: e.target.value }))}
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
          {localSteps.keyGeneration.map((step, index) => (
            <p key={`keygen-${index}`} dangerouslySetInnerHTML={{ __html: step }} />
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Encryption Steps</CardTitle>
        </CardHeader>
        <CardContent>
          {localSteps.encryption.map((step, index) => (
            <p key={`encrypt-${index}`} dangerouslySetInnerHTML={{ __html: step }} />
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Decryption Steps</CardTitle>
        </CardHeader>
        <CardContent>
          {localSteps.decryption.map((step, index) => (
            <p key={`decrypt-${index}`} dangerouslySetInnerHTML={{ __html: step }} />
          ))}
        </CardContent>
      </Card>

      <div>
        <Label>Public Key (e, n)</Label>
        <Input value={`(${state.publicKey.e}, ${state.publicKey.n})`} readOnly />
      </div>
      <div>
        <Label>Private Key (d, n)</Label>
        <Input value={`(${state.privateKey.d}, ${state.privateKey.n})`} readOnly />
      </div>
      <div>
        <Label>Encrypted Message</Label>
        <Input value={state.encryptedMessage} readOnly />
      </div>
      <div>
        <Label>Decrypted Message</Label>
        <Input value={state.decryptedMessage} readOnly />
      </div>
    </div>
  )
}

