#In order to update the project:

Run anchor build and then:

anchor idl upgrade -f target/idl/solanaportfolio.json --provider.cluster devnet `solana address -k target/deploy/solanaportfolio-keypair.json`

IDL account: qoMASYyNaX5ywwrxJnRC4ytXKtPmsTv6Nt7tbHUwRWN
