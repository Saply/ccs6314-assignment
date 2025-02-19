function GCD( a,  b)
{
    if (a == 0)
        return b;
    return GCD(b % a, a);
}

function phiFunction(n)
{
    let result = 1;
    for (let i = 2; i < n; i++)
        if (GCD(i, n) == 1)
            result++;
    return result;
}

function extendedGCD(a, b) {
    if (a === 0) return [b, 0, 1];
    let [gcd, x1, y1] = extendedGCD(b % a, a);
    let x = y1 - Math.floor(b / a) * x1;
    let y = x1;
    return [gcd, x, y];
}

function modInverse(e, phi) {
    let [gcd, x] = extendedGCD(e, phi);
    if (gcd !== 1) throw new Error("No modular inverse exists (e and phi are not coprime)");
    return (x % phi + phi) % phi;  // Ensure positive result
}

// Function to compute base^expo mod m using BigInt
function power(base, expo, m) {
    let res = BigInt(1); 
    base = BigInt(base) % BigInt(m); 
    expo = BigInt(expo); // Ensure expo is a BigInt

    while (expo > 0) {
        if (expo & BigInt(1)) {
            res = (res * base) % BigInt(m);
        }
        base = (base * base) % BigInt(m); 
        expo = expo / BigInt(2); // Use BigInt division
    }
    return Number(res);
}

module.exports = { GCD, modInverse, phiFunction, extendedGCD, power }

// const char = "e"
// console.log("Encoded value: " + char.charCodeAt(0))
// console.log()
// const powerres = power(
//     char.charCodeAt(0), 65537, 3504409
// )
// console.log(powerres)

// const encrypted = String.fromCharCode(powerres) // cant handle above 65535
// console.log(encrypted)
// console.log(encrypted.charCodeAt(0))

// const decryptionprocess = power(
    
// )

// // Example usage:
// let e = 7; // Public exponent
// let phi = 120; // Example φ(N), replace with actual computation

// try {
//     let d = modInverse(e, phi);
//     console.log("Private Key (d):", d);
// } catch (err) {
//     console.error(err.message);
// }

// export {extendedGCD, modInverse}