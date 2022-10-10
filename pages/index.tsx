import type { NextPage } from 'next';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import ContentCard from '../components/ContentCard';
import Header from '../components/Header';
import Modal from '../components/Modal';
import { Project } from '../types/Project';

const PLACEHOLDER_IMAGE =
  'https://res.cloudinary.com/silverstag/image/upload/v1664966534/ternoa/placeholder_eukgmf.png';

const Home: NextPage = () => {
  const [displayModal, setDisplayModal] = useState(false);
  const [currentAccount, setCurrentAccount] = useState('');
  const [selectedProject, setSelectedProject] = useState<Project>({});

  const emptyProject = {
    title: '',
    description: '',
    imageUrl: '',
    technologies: [],
  };

  const projects: Project[] = [
    {
      id: 1,
      imageUrl: PLACEHOLDER_IMAGE,
      title: 'A project',
      description: 'Placeholder project',
      technologies: ['some tech', 'some more tech'],
    },
    {
      id: 2,
      imageUrl: PLACEHOLDER_IMAGE,
      title: 'A project',
      description: 'Placeholder project',
      technologies: ['some tech', 'some more tech'],
    },
    {
      id: 3,
      imageUrl: PLACEHOLDER_IMAGE,
      title: 'A project',
      description: 'Placeholder project',
      technologies: ['some tech', 'some more tech'],
    },
    {
      id: 4,
      imageUrl: PLACEHOLDER_IMAGE,
      title: 'A project',
      description: 'Placeholder project',
      technologies: ['some tech', 'some more tech'],
    },
  ];

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

      <Modal
        address={currentAccount}
        project={selectedProject}
        isVisible={displayModal}
        onClose={() => setDisplayModal(false)}
        onProjectUpdated={() => console.log('todo')}
        onProjectAdded={() => console.log('todo')}
        onProjectDeleted={() => console.log('todo')}
      />
    </div>
  );
};

export default Home;
