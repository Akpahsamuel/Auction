import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import '@mysten/dapp-kit/dist/index.css';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SuiClientProvider, WalletProvider } from '@mysten/dapp-kit';
import { getFullnodeUrl } from '@mysten/sui.js/client';

const queryClient = new QueryClient();

const networks = {
  testnet: { url: getFullnodeUrl('testnet') },
  mainnet: { url: getFullnodeUrl('mainnet') },
};

createRoot(document.getElementById("root")!).render(
    <QueryClientProvider client={queryClient}>
        <SuiClientProvider networks={networks} defaultNetwork='testnet'>
            <WalletProvider>
                <App />
            </WalletProvider>
        </SuiClientProvider>
    </QueryClientProvider>
    

);