1. installa nodejs se non lo hai
2. clona il progetto su di una cartella
3. apri una console in quella cartella e lancia il comando  "npm i" per installare le dipendenze
4. crea sempre in quella cartella un file .env
 
il contenuto del file .env dev'essere questo: 
* SENDER_SECRET_KEY=
* RECEIVER_PUBLIC_KEY=
* RPC_SERVICE=
* SOL_TO_SEND=

  
la SENDER_SECRET_KEY bisogna metterci la chiave privata del profilo holosim dal quale prelevare i sol, è quella serie di numeri tra parentesi quadre 

il RECEIVER_PUBLIC_KEY è la public key di chi poi li riceve

l'RPC_SERVICE è il servizio rpc nel caso di solana usare un rpc per la devnet o mainnet, per holosim dato che è una rete diverse bisogna usare lo stesso che usa il bot sly per holosim 

SOL_TO_SEND è il numero di quanti sol spedire

