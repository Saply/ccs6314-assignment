import PlayfairCipher from "@/components/PlayfairCipher"
import RailFenceCipher from "@/components/RailFenceCipher"
import AESEncryption from "@/components/AESEncryption"
import RSA from "@/components/RSA"
import PlayFairRailFenceProduct from "@/components/PlayFairRailFenceProduct"

export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Cryptography Assignment</h1>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">1. Classical Symmetric Ciphers</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4">
          <PlayfairCipher />
          <RailFenceCipher />
        </div>
        <PlayFairRailFenceProduct />
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">2. Hybrid Modern Asymmetric and Symmetric Cipher</h2>
        <RSA />
        <AESEncryption />
      </section>
    </main>
  )
}

