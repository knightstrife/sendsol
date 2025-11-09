// Importa i moduli necessari da @solana/web3.js
import {
    Connection,
    PublicKey,
    Keypair,
    LAMPORTS_PER_SOL,
    Transaction,
    SystemProgram
} from "@solana/web3.js";

import 'dotenv/config';

// --- CONFIGURAZIONE ---
// Sostituisci con il tuo endpoint RPC (es. 'mainnet-beta', 'testnet', 'devnet')
const RPC_ENDPOINT = process.env.RPC_SERVICE;
console.log(RPC_ENDPOINT);
const connection = new Connection(RPC_ENDPOINT, 'confirmed');

// CHIAVE PRIVATA DEL MITTENTE (WALLET DI ESEMPIO)
// *************************************************************************
// !!! ATTENZIONE: SOSTITUISCI QUESTO CON IL TUO KEYPAIR REALE E SICURO !!!
// Questo è solo un keypair casuale e non deve essere usato in produzione.
// Per un uso reale, devi caricare in modo sicuro la tua chiave privata.
// *************************************************************************
const SENDER_SECRET_KEY = JSON.parse(process.env.SENDER_SECRET_KEY);
const senderKeypair = Keypair.fromSecretKey(Uint8Array.from(SENDER_SECRET_KEY));
const senderPublicKey = senderKeypair.publicKey.toBase58();


/**
 * Recupera il saldo in SOL per una data Public Key.
 * @param {string} publicKeyString La Public Key (base58) da controllare.
 * @returns {Promise<number>} Il saldo in SOL.
 */
async function getSolBalance(publicKeyString) {
    try {
        const publicKey = new PublicKey(publicKeyString);
        console.log(`\n--- Verifica Saldo per ${publicKeyString} ---`);

        // Ottiene il saldo in Lamports
        const lamports = await connection.getBalance(publicKey, 'confirmed');

        // Converte i Lamports in SOL
        const solBalance = lamports / LAMPORTS_PER_SOL;

        console.log(`Saldo Lamports: ${lamports}`);
        console.log(`Saldo SOL: ${solBalance}`);

        return solBalance;

    } catch (error) {
        console.error("Errore nel recupero del saldo:", error.message);
        return 0; // Ritorna 0 in caso di errore
    }
}

/**
 * Invia SOL da un Keypair mittente a una Public Key destinataria.
 * @param {Keypair} fromKeypair Il Keypair completo del mittente (necessario per firmare).
 * @param {string} toPublicKeyString La Public Key (base58) del destinatario.
 * @param {number} amountSol La quantità di SOL da inviare.
 * @returns {Promise<string | null>} La transaction signature in caso di successo, altrimenti null.
 */
async function sendSol(fromKeypair, toPublicKeyString, amountSol) {
    try {
        const fromPubkey = fromKeypair.publicKey;
        const toPubkey = new PublicKey(toPublicKeyString);

        console.log(`\n--- Tentativo di invio di ${amountSol} SOL ---`);
        console.log(`Mittente: ${fromPubkey.toBase58()}`);
        console.log(`Destinatario: ${toPubkey.toBase58()}`);

        // Calcola l'importo in Lamports
        const lamportsToSend = Math.round(amountSol * LAMPORTS_PER_SOL);

        // 1. Crea l'istruzione di trasferimento
        const instruction = SystemProgram.transfer({
            fromPubkey: fromPubkey,
            toPubkey: toPubkey,
            lamports: lamportsToSend,
        });

        // 2. Ottiene il blockhash per la transazione
        const { blockhash } = await connection.getLatestBlockhash('confirmed');

        // 3. Crea la transazione
        const transaction = new Transaction({
            recentBlockhash: blockhash,
            feePayer: fromPubkey,
        }).add(instruction);

        // 4. Firma e invia la transazione
        console.log("Invio della transazione in corso...");
        const signature = await connection.sendTransaction(transaction, [fromKeypair]);

        // 5. Attendi la conferma
        await connection.confirmTransaction({
            blockhash: blockhash,
            lastValidBlockHeight: (await connection.getLatestBlockhash()).lastValidBlockHeight,
            signature: signature
        });

        console.log(`\nTransazione completata con successo!`);
        console.log(`Signature: ${signature}`);
        console.log(`Visualizza su Solana Explorer: ${RPC_ENDPOINT.includes('devnet') ? 'https://explorer.solana.com/tx/' : 'https://explorer.solana.com/tx/'}${signature}?cluster=devnet`);

        return signature;

    } catch (error) {
        console.error("Errore durante l'invio di SOL:", error.message);
        return null;
    }
}

/**
 * Funzione principale per dimostrare l'utilizzo delle utility.
 */
async function main() {
    console.log(`Connessione a Solana RPC: ${RPC_ENDPOINT}`);

    // --- Esempio 1: Controllare il Saldo ---
    // Sostituisci con una Public Key destinataria
    const recipientKey = process.env.RECEIVER_PUBLIC_KEY;

    // 1. Verifica il saldo del mittente prima dell'invio
    await getSolBalance(senderPublicKey);

    // 2. Invia una piccola quantità di SOL (es. 0.001 SOL)
    // Nota: Per eseguire questo, il wallet del mittente DEVE avere SOL (Lamports) su devnet.
    // Puoi inviare SOL al mittente Keypair (mostrato sopra) tramite un faucet devnet.
    const amountToSend = Number(process.env.SOL_TO_SEND);
    await sendSol(senderKeypair, recipientKey, amountToSend);

    // 3. Verifica il saldo del mittente dopo l'invio
    await getSolBalance(senderPublicKey);

    // 4. Verifica il saldo del destinatario
    await getSolBalance(recipientKey);
}

// Avvia la funzione principale
main();