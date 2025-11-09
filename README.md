1. installa nodejs se non lo hai
2. clona il progetto su di una cartella
3. apri una console in quella cartella e lancia il comando  "npm i" per installare le dipendenze
4. crea sempre in quella cartella un file .env
 
il contenuto del file .env dev'essere questo: 
* SENDER_SECRET_KEY=
* RECEIVER_PUBLIC_KEY=
* RPC_SERVICE=

  
la sender_secret_key bisogna metterci la chiave privata del profilo holosim dal quale prelevare i sol, è quella serie di numeri tra parentesi quadre 
il receiver è la public key di chi poi li riceve
l'rpc_service è il servizio rpc nel caso di holosim basta usare lo stesso che usa il bot sly per holo 
ne spedisce direttamente 9 
se si vuole cambiare importo è nel file index.js
const amountToSend = 9;
