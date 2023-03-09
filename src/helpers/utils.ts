import { ethers } from 'ethers';

export function ConfigureProvider(network: string): ethers.providers.BaseProvider {

    const provider = ethers.providers.getDefaultProvider(network, {
        // Provide personal keys from environment.
        alchemy: process.env.ALCHEMY_API_KEY,
        etherscan: process.env.ETHERSCAN_API_KEY,
        infura: {
            projectId: process.env.INFURA_API_KEY,
            projectSecret: process.env.INFURA_API_SECRET,
        },
    });

    return provider
}

export function ConfigureWallet(
    network: string,
    privateKey: string,
): ethers.Wallet {
    // Configure provider as goerli

    const provider = ConfigureProvider(network)

    // Connect to our wallet providing our private key.
    const wallet = new ethers.Wallet(privateKey);

    // return wallet connected to goerli.
    return wallet.connect(provider);
}

