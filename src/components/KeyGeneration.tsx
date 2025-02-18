"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { GCD, modInverse, phiFunction, power } from "../utils/modularInverse"

// Generate a random 16-digit hex key
const generateRandomHexKey = () => {
  return Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join("")
}

// const encrypted = rsaEncrypt(state.symmetricKey, state.personBPublicKey.e, state.personBPublicKey.n)
// Simulated RSA encryption
const rsaEncrypt = (message: string, e: string, n: string) => {
  console.log(message)
  // console.log("pubkey in keygen: " + e)
  const messageSplit = message.split("").map((char) => {
    const ascii = char.charCodeAt(0)
    // console.log("ascii in keygen: " + ascii)
    const encrypted = power(ascii, Number(e), Number(n))
    // console.log("ascii encrypted in keygen: " + encrypted) // why is it different?
    const encryptedAscii = String.fromCharCode(encrypted)
    // encryptionSteps.push(`${char}: ${ascii}`)
    // cipherSteps.push(
    //     `${ascii}^${state.publicKey.e} mod ${state.publicKey.n} = <b>${encrypted}</b> → ${encryptedAscii}`,
    // )
    return encryptedAscii
  })
  console.log(messageSplit)
  // This is a placeholder. In a real scenario, implement actual RSA encryption
  return messageSplit.join("")
}

// Simulated RSA decryption (in a real scenario, use a proper crypto library)
const rsaDecrypt = (ciphertext: string, d: string, n: string) => {
  console.log("d:" + d)
  
  const decryptedMessage = ciphertext.split("").map((char) => {
    const ascii = char.charCodeAt(0)
    console.log("ascii in keygen: " + ascii)
    const decrypted = power(ascii, Number(d), Number(n))
    console.log("ascii decrypted in keygen: " + decrypted)
    const decryptedAscii = String.fromCharCode(decrypted)
    // decryptionSteps.push(`${char}: ${ascii}`)
    // plaintextSteps.push(
    //   `${ascii}^${state.privateKey.d} mod ${state.privateKey.n} = <b>${decrypted}</b> → ${decryptedAscii}`,
    // )

    return decryptedAscii
  })

  return decryptedMessage.join("")
}

export default function KeyGeneration({ state, setState }) {
  const generateKey = () => {
    const key = generateRandomHexKey()
    setState((prevState) => ({
      ...prevState,
      symmetricKey: key,
      steps: [`Step 1: Person A generates random symmetric key: <b>${key}</b>`],
    }))
  }

  const encryptKey = () => {
    if (!state.symmetricKey) {
      alert("Please generate a symmetric key first.")
      return
    }
    const encrypted = rsaEncrypt(state.symmetricKey, state.personBPublicKey.e, state.personBPublicKey.n)
    setState((prevState) => ({
      ...prevState,
      encryptedSymmetricKey: encrypted,
      steps: [
        ...prevState.steps,
        `Step 2: Person A encrypts symmetric key with Person B's public key: <b>${encrypted}</b>`,
      ],
    }))
  }

  const decryptKey = () => {
    console.log(state.encryptedSymmetricKey)
    if (!state.encryptedSymmetricKey) {
      alert("Please encrypt the symmetric key first.")
      return
    }
    const decrypted = rsaDecrypt(state.encryptedSymmetricKey, state.personBPrivateKey.d, state.personBPrivateKey.n)
    setState((prevState) => ({
      ...prevState,
      decryptedSymmetricKey: decrypted,
      steps: [
        ...prevState.steps,
        `Step 3: Person B decrypts the symmetric key: <b>${decrypted}</b>`,
        `Step 4: Verify that the decrypted key matches the original: <b>${decrypted === state.symmetricKey}</b>`,
      ],
    }))
  }

  const clearSteps = () => {
    setState((prevState) => ({
      ...prevState,
      encryptedSymmetricKey: "",
      decryptedSymmetricKey: "",
      steps: [],
    }))
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
                value={state.personBPublicKey.n}
                onChange={(e) =>
                  setState((prevState) => ({
                    ...prevState,
                    personBPublicKey: { ...prevState.personBPublicKey, n: e.target.value },
                  }))
                }
                placeholder="Enter Person B's public key modulus (n)"
              />
              <Label>Person B's Public Key - Public Exponent (e)</Label>
              <Input
                value={state.personBPublicKey.e}
                onChange={(e) =>
                  setState((prevState) => ({
                    ...prevState,
                    personBPublicKey: { ...prevState.personBPublicKey, e: e.target.value },
                  }))
                }
                placeholder="Enter Person B's public exponent (e)"
              />
            </div>
            <div className="space-y-2">
              <Label>Symmetric Key (16 hex digits)</Label>
              <div className="flex space-x-2">
                <Input
                  value={state.symmetricKey}
                  onChange={(e) => setState((prevState) => ({ ...prevState, symmetricKey: e.target.value }))}
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
              <Input value={state.encryptedSymmetricKey} readOnly />
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
                value={state.personBPrivateKey.d}
                onChange={(e) =>
                  setState((prevState) => ({
                    ...prevState,
                    personBPrivateKey: { ...prevState.personBPrivateKey, d: e.target.value },
                  }))
                }
                placeholder="Enter private exponent (d)"
              />
              <Label>Private Key - Modulus (n)</Label>
              <Input
                value={state.personBPrivateKey.n}
                onChange={(e) =>
                  setState((prevState) => ({
                    ...prevState,
                    personBPrivateKey: { ...prevState.personBPrivateKey, n: e.target.value },
                  }))
                }
                placeholder="Enter modulus (n)"
              />
            </div>
            <Button onClick={decryptKey}>Decrypt Received Key</Button>
            <div>
              <Label>Decrypted Symmetric Key</Label>
              <Input value={state.decryptedSymmetricKey} readOnly />
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
          {state.steps.map((step, index) => (
            <p key={`step-${index}`} className="mb-2" dangerouslySetInnerHTML={{ __html: step }} />
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

