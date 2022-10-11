import React, { useEffect, useState } from 'react';

type Props = {
  onWalletConnect: (address: string) => void;
  onCreateEntryClicked: () => void;
  onAccountCreateClicked: () => void;
};

export default function Header({
  onWalletConnect,
  onCreateEntryClicked,
  onAccountCreateClicked,
}: Props) {
  const ADMIN_ACCOUNT = '5EutU8SEmb94ZmLG7GKQFpF5Q796ZYyfYxbPriPQusT3';
  const [currentAccount, setCurrentAccount] = useState('');

  const connectWallet = async () => {
    const { solana } = window as any;

    if (solana) {
      const response = await solana.connect();
      let account = response.publicKey.toString();
      setCurrentAccount(account);
      onWalletConnect(account);
    }
  };

  return (
    <div className="bg-slate-300 sticky top-0 z-20 ">
      <header className="p-3 flex items-starts justify-between max-w-7xl mx-auto  xl:items-center ">
        <div className="flex flex-row items-center">
          {currentAccount && (
            <p className="text-xs text-gray-700 ">
              Your address is: {currentAccount}
            </p>
          )}
          {!currentAccount && (
            <p className="text-xs text-gray-700 ">
              Connect your wallet to get started!
            </p>
          )}
        </div>
        <div>
          {!currentAccount && (
            <button
              className="block  bg-blue-400 w-full mx-1 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded focus:text-gray-600 focus:shadow-outline"
              onClick={connectWallet}
            >
              Connect Wallet
            </button>
          )}
          {currentAccount && currentAccount === ADMIN_ACCOUNT && (
            <button
              className="block  bg-blue-400 w-full mx-1 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded focus:text-gray-600 focus:shadow-outline"
              onClick={() => onAccountCreateClicked()}
            >
              Initialize Account
            </button>
          )}
          {currentAccount && currentAccount === ADMIN_ACCOUNT && (
            <button
              className="block  bg-blue-400 w-full mx-1 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded focus:text-gray-600 focus:shadow-outline"
              onClick={() => onCreateEntryClicked()}
            >
              Add Project
            </button>
          )}
        </div>
      </header>
    </div>
  );
}
