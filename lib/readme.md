This folder contains the bim repository library code. Its subdivided as follows:

* `client` Various helper modules to support client applications written in c# and typescript. The point of these modules is to simplify working with the ledger by providing common tooling.
* `codegen` Schema files built for the repository can be converted into typescript/c# code to simplify development.
* `schema` The communication with the ledger is itself a binary protocol that is encoded by flatbuffers, with the type definitions listed in this folder. This folder is not important for users of the library.
* `server` An example ledger server implementation in typescript, clients can connect to this server over http/ws.
* `util` Currently only used for testing purposes. 
