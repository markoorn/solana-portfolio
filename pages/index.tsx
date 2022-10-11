import type { NextPage } from 'next';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import ContentCard from '../components/ContentCard';
import Header from '../components/Header';
import Modal from '../components/Modal';
import { Project } from '../types/Project';
import {
  Connection,
  PublicKey,
  clusterApiUrl,
  ConfirmOptions,
} from '@solana/web3.js';
import { Program, AnchorProvider, web3, Idl } from '@project-serum/anchor';
import keypair from '../keypair.json';

const PLACEHOLDER_IMAGE =
  'https://res.cloudinary.com/silverstag/image/upload/v1664966534/ternoa/placeholder_eukgmf.png';

const { SystemProgram, Keypair } = web3;
const programID = new PublicKey('2qGei6swdiMgyXXvNFBuHUypkftbJ5Wy6118B6Y3KmL1');
const network = clusterApiUrl('devnet');

const opts: ConfirmOptions = {
  preflightCommitment: 'processed',
};

const arr = Object.values(keypair._keypair.secretKey);
const secret = new Uint8Array(arr);
const baseAccount = web3.Keypair.fromSecretKey(secret);

const Home: NextPage = () => {
  const [displayModal, setDisplayModal] = useState(false);
  const [currentAccount, setCurrentAccount] = useState('');
  const [selectedProject, setSelectedProject] = useState<Project>({});
  const [projects, setProjects] = useState<Project[]>([]);
  const [program, setProgram] = useState<Program<Idl>>();
  const [provider, setProvider] = useState<AnchorProvider>();

  const emptyProject = {
    title: '',
    description: '',
    imageUrl: '',
    technologies: [],
  };

  const initialize = async () => {
    const provider = getProvider();
    const program = await getProgram();

    if (program) {
      setProgram(program);
    }
    setProvider(provider);
  };

  useEffect(() => {
    initialize();
  }, []);

  useEffect(() => {
    if (currentAccount) {
      console.log('Fetching project list...');
      getProjects();
    }
  }, [currentAccount]);

  const createProjectAccount = async () => {
    try {
      if (program && provider) {
        await program.rpc.startStuffOff({
          accounts: {
            baseAccount: baseAccount.publicKey,
            user: provider.wallet.publicKey,
            systemProgram: SystemProgram.programId,
          },
          signers: [baseAccount],
        });
        console.log(
          'Created a new BaseAccount w/ address:',
          baseAccount.publicKey.toString(),
        );
        await getProjects();
      }
    } catch (error) {
      console.log('Error creating BaseAccount account:', error);
    }
  };

  const getProgram = async () => {
    const idl = await Program.fetchIdl(programID, getProvider());
    if (idl) {
      return new Program(idl, programID, getProvider());
    }
    return null;
  };

  const getProjects = async () => {
    try {
      const program = await getProgram();
      if (program) {
        console.log('Fetching account with:', baseAccount.publicKey.toString());
        console.log('Fetching', program.account.baseAccount);
        const account = await program.account.baseAccount.fetch(
          baseAccount.publicKey,
        );

        console.log('Got the account', account);
        setProjects(account.projects);
      }
    } catch (error) {
      console.log('Error in getProjects: ', error);
      setProjects([]);
    }
  };

  const getProvider = () => {
    const connection = new Connection(network, opts.preflightCommitment);
    const provider = new AnchorProvider(
      connection,
      (window as any).solana,
      opts,
    );
    return provider;
  };

  const onProjectAdded = (project: Project) => {
    const projectsCopy = [...projects];
    projectsCopy.push(project);
    setProjects(projectsCopy);
  };

  const onWalletConnect = (account: string) => {
    setCurrentAccount(account);
    // TODO Call Solana program here.

    console.log('Connected account: ', account);
  };

  const onCreateEntryClicked = () => {
    if (currentAccount) {
      setSelectedProject(emptyProject);
      setDisplayModal(true);
    }
  };

  const checkIfWalletIsConnected = async () => {
    let solana = (window as any)?.solana;
    if (solana?.isPhantom) {
      console.log('Phantom wallet found!');
      const response = await solana.connect({ onlyIfTrusted: true });
      let account = response.publicKey.toString();

      console.log('Connected with Public Key:', account);
      setCurrentAccount(account);
      onWalletConnect(account);
    } else {
      alert('Solana object not found! Get a Phantom Wallet 👻');
    }
  };

  useEffect(() => {
    const onLoad = async () => {
      await checkIfWalletIsConnected();
    };
    window.addEventListener('load', onLoad);
    return () => window.removeEventListener('load', onLoad);
  }, []);

  return (
    <div>
      <Head>
        <title>Project Portfolio</title>
      </Head>

      <Header
        onWalletConnect={onWalletConnect}
        onCreateEntryClicked={onCreateEntryClicked}
        onAccountCreateClicked={createProjectAccount}
      />

      <div className="antialiased bg-gray-200 text-gray-900 font-sans p-5">
        <div className="container mx-auto max-w-7xl min-h-screen">
          <div className="flex flex-wrap -mx-4">
            {projects.map((project) => (
              <ContentCard
                key={project.id}
                project={project}
                onClick={() => console.log('Selected: ', project.id)}
              />
            ))}
          </div>
        </div>
      </div>

      {program && provider && (
        <Modal
          program={program}
          provider={provider}
          baseAccount={baseAccount}
          address={currentAccount}
          project={selectedProject}
          isVisible={displayModal}
          onClose={() => setDisplayModal(false)}
          onProjectUpdated={() => console.log('todo')}
          onProjectAdded={onProjectAdded}
          onProjectDeleted={() => console.log('todo')}
        />
      )}
    </div>
  );
};

export default Home;
