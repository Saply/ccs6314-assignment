"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { GCD, modInverse, power } from "../utils/modularInverse"
import { Switch } from "@/components/ui/switch"

export default function RSAEncryption({ state, setState }) {
  const [showSteps, setShowSteps] = useState(true)
//   const [localSteps, setLocalSteps] = useState({
//     keyGeneration: [],
//     encryption: [],
//     decryption: [],
//   })

  useEffect(() => {
    setState((prevState) => ({
      ...prevState,
    }))
  }, [setState])

  // key generation logic
  const generateKeys = () => {
    const n = BigInt(state.p) * BigInt(state.q)
    const newP = BigInt(state.p) - BigInt(1)
    const newQ = BigInt(state.q) - BigInt(1)
    const phi = newP * newQ
    const d = modInverse(BigInt(state.e), BigInt(phi))

    const keyGenerationSteps = [
      "<u>Step 1: Calculate n = p * q</u>",
      `p = ${state.p}  \t q = ${state.q}`,
      `<b>Value of n = ${n}</b>`,
      "<u>Step 2: Calculate φ(n) = (p-1) * (q-1)</u>",
      `φ(${n}) = (${state.p} - 1) * (${state.q} - 1)`,
      `φ(${n}) = (${newP}) * (${newQ})`,
      `<b>φ(${n}) = ${phi}</b>`,
      "<u>Step 3: Verify that gcd(e, φ(n)) = 1 (coprime) AND 1 < e < φ(n)</u>",
      `GCD(${state.e}, ${phi}) = <b>${GCD(BigInt(state.e), BigInt(phi))} : ${GCD(BigInt(state.e), BigInt(phi)) === BigInt(1) ? "Coprime" : "Not coprime"}</b>`,
      `1 < ${state.e} < ${phi} <b>${state.e > 1 && state.e < phi}</b>`,
      "<u>Step 4: Calculate d such that e * d = 1 (mod φ(n))</u>",
      `d = ${state.e}^(-1) mod ${phi}`,
      `d = ${state.e}^(φ(${phi}) - 1) mod ${phi}`,
      `<b>d = ${d}</b>`,
      "<u>Step 5: Verify if e * d (mod φ(n)) = 1</u>",
      `${state.e} * ${d} mod φ(${n}) = ${(BigInt(state.e) * BigInt(d)) % BigInt(phi)} : <b>${((BigInt(state.e) * BigInt(d)) % BigInt(phi)) === BigInt(1) ? "Valid!" : "Invalid public-private key pair!"}</b>`,
      "<u>Step 6: Obtain Public and Private Keys</u>",
      `<b>Public Key (e, n): (${state.e}, ${n})</b>`,
      `<b>Private Key (d, n): (${d}, ${n})</b>`
    ]

    setState((prevState) => ({
      ...prevState,
      publicKey: { n: n, e: BigInt(state.e) },
      privateKey: { n: n, d: d },
      steps: {
        ...prevState.steps,
        keyGeneration: keyGenerationSteps
      }
    }))
  }

  // Encryption logic
  const encryptMessage = () => {
    let encryptionSteps = [
      `<u>Step 1: Encode plaintext message '${state.message}' to number m in ASCII representation</u>`,
    ]
    const cipherSteps = []
    const startTime = performance.now()
    const msgArray = state.message.split("").map((char) => {
      const ascii = char.charCodeAt(0)
      const encrypted = power(ascii, state.publicKey.e, state.publicKey.n)
      encryptionSteps.push(`${char}: ${ascii}`)
      cipherSteps.push(
        `${ascii}^${state.publicKey.e} mod ${state.publicKey.n} = <b>${encrypted}</b>`
      )
      return encrypted
    })
    const endTime = performance.now()

    encryptionSteps.push("<u>Step 2: Calculate ciphertext: c = m^e mod n</u>")
    encryptionSteps = encryptionSteps.concat(cipherSteps)

    setState((prevState) => ({
      ...prevState,
      encryptedMessage: msgArray,
      rsaEncryptionTime: endTime - startTime,
      steps: {
        ...prevState.steps,
        encryption: encryptionSteps
      }
    }))
  }

  const decryptMessage = () => {
    let decryptionSteps = [`<u>Step 1: Calculate plaintext: m = c^d mod n</u>`]
    const plaintextSteps = []
    const startTime = performance.now()
    const decryptedMessage = state.encryptedMessage.map((encrypted) => {
      const decrypted = power(encrypted, state.privateKey.d, state.privateKey.n)
      const decryptedAscii = String.fromCharCode(Number(decrypted))
      
      decryptionSteps.push(
        `${encrypted}^${state.privateKey.d} mod ${state.privateKey.n} = <b>${decrypted}</b>`
      )
      plaintextSteps.push(`${decrypted} → ${decryptedAscii}`)
      return decryptedAscii
    })
    const endTime = performance.now()
    //     decryptionSteps.push("<u>Step 1: Calculate plaintext: m = c^d mod n</u>")
    decryptionSteps.push("<u>Step 2: Decode m to plaintext in ASCII representation</u>")
    decryptionSteps = decryptionSteps.concat(plaintextSteps)

    setState((prevState) => ({
      ...prevState,
      decryptedMessage: decryptedMessage.join(""),
      rsaDecryptionTime: endTime - startTime,
      steps: {
        ...prevState.steps,
        decryption: decryptionSteps
      }
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
        <Label htmlFor="rsa-message">Message (in ASCII format). Ensure that the encoded message is smaller than <b>n</b></Label>
        <Input
          id="rsa-message"
          value={state.message}
          onChange={(e) => setState((prev) => ({ ...prev, message: e.target.value }))}
          placeholder="Enter message to encrypt"
        />
      </div>
      <div className="flex space-x-4">
        <Button onClick={generateKeys} className="gap-4">Generate Keys</Button>
        <Button onClick={encryptMessage} className="gap-4">Encrypt</Button>
        <Button onClick={decryptMessage}>Decrypt</Button>
      </div>

      <div className="flex items-center space-x-2">
        <Switch id="show-steps" checked={showSteps} onCheckedChange={setShowSteps} />
        <Label htmlFor="show-steps">Show Encryption/Decryption Steps</Label>
      </div>

      {showSteps && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Key Generation Steps</CardTitle>
            </CardHeader>
            <CardContent>
              {state.steps.keyGeneration.map((step, index) => (
                <p key={`keygen-${index}`} dangerouslySetInnerHTML={{ __html: step }} />
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Encryption Steps</CardTitle>
            </CardHeader>
            <CardContent>
              {state.steps.encryption.map((step, index) => (
                <p key={`encrypt-${index}`} dangerouslySetInnerHTML={{ __html: step }} />
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Decryption Steps</CardTitle>
            </CardHeader>
            <CardContent>
              {state.steps.decryption.map((step, index) => (
                <p key={`decrypt-${index}`} dangerouslySetInnerHTML={{ __html: step }} />
              ))}
            </CardContent>
          </Card>
        </>
      )}

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
        <Input value={`[${state.encryptedMessage}]`} readOnly />
      </div>
      <div>
        <Label>Decrypted Message</Label>
        <Input value={state.decryptedMessage} readOnly />
      </div>
      <div>
        <h4 className="font-semibold">Encryption Time:</h4>
        <p>{state.rsaEncryptionTime ? state.rsaEncryptionTime.toFixed(20) : 0} ms</p>
      </div>
      <div>
        <h4 className="font-semibold">Decryption Time:</h4>
        <p>{state.rsaDecryptionTime ? state.rsaDecryptionTime.toFixed(20) : 0} ms</p>
      </div>
    </div>
  )
}

