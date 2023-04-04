import NodeRSA  from 'node-rsa'

/**
 * generate keypair
 */
export const getKeyPair = ():{ privateKey:string, publicKey:string } => {
    const key = new NodeRSA({b: 1024});
    const _publicKey = key.exportKey('public');
    const _privateKey = key.exportKey('private');
    return { privateKey: _privateKey, publicKey:_publicKey }
}

/**
 * public key encrypt
 * @param publicKey
 * @param plaintext
 */
export const publicKeyEncrypt = ( publicKey:string, plaintext:string ) => {
    const pubKey = new NodeRSA(publicKey);
    return pubKey.encrypt(Buffer.from(plaintext), 'base64')
}

/**
 * public key decrypt
 * @param publicKey
 * @param plaintext
 */
export const privateKeyDecrypt = (privateKey:string, ciphertext:string) => {
    const _privateKey = new NodeRSA(privateKey);
    return _privateKey.decrypt(Buffer.from(ciphertext), 'utf8')
}


