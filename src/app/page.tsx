import PlayfairCipher from "@/components/PlayfairCipher"
import RailFenceCipher from "@/components/RailFenceCipher"
import RSAEncryption from "@/components/RSAEncryption"
import KeyGeneration from "@/components/KeyGeneration"
import AESEncryption from "@/components/AESEncryption"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Cryptography Assignment</h1>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">1. Classical Symmetric Ciphers</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <PlayfairCipher />
          <RailFenceCipher />
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">2. Hybrid Modern Asymmetric and Symmetric Cipher</h2>
        <div className="border border-gray-200 rounded-lg p-4 mb-8">
          <Tabs defaultValue="rsa">
            <TabsList>
              <TabsTrigger value="rsa">RSA Encryption</TabsTrigger>
              <TabsTrigger value="keyexchange">Key Generation</TabsTrigger>
            </TabsList>
            <TabsContent value="rsa">
              <RSAEncryption />
            </TabsContent>
            <TabsContent value="keyexchange">
              <KeyGeneration />
            </TabsContent>
          </Tabs>
        </div>
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">AES Encryption</h3>
          <AESEncryption />
        </div>
      </section>
    </main>
  )
}