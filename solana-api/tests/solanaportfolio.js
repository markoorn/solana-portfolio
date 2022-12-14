const anchor = require('@project-serum/anchor');
const { SystemProgram } = anchor.web3;

const main = async () => {
  console.log('🚀 Starting test...');

  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Solanaportfolio;
  const baseAccount = anchor.web3.Keypair.generate();

  let tx = await program.rpc.startStuffOff({
    accounts: {
      baseAccount: baseAccount.publicKey,
      user: provider.wallet.publicKey,
      systemProgram: SystemProgram.programId,
    },
    signers: [baseAccount],
  });
  console.log('📝 Your transaction signature', tx);

  let account = await program.account.baseAccount.fetch(baseAccount.publicKey);
  console.log('Visit Count', account.totalVisits.toString());
  console.log('Project Count', account.totalProjects.toString());

  await program.rpc.addVisit({
    accounts: {
      baseAccount: baseAccount.publicKey,
    },
  });

  await program.rpc.addProject('a title', 'a description', 'an image url', {
    accounts: {
      baseAccount: baseAccount.publicKey,
      user: provider.wallet.publicKey,
    },
  });

  account = await program.account.baseAccount.fetch(baseAccount.publicKey);
  console.log('Visit Count', account.totalVisits.toString());
  console.log('Project Count', account.totalProjects.toString());
  console.log('Project List', JSON.stringify(account.projects));
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

runMain();
