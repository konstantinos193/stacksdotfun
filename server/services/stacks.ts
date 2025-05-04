import { 
    makeContractCall, 
    broadcastTransaction,
    getAddressFromPrivateKey,
    uintCV,
    stringAsciiCV,
    FungibleConditionCode,
    fetchCallReadOnlyFunction
} from '@stacks/transactions';
import { STACKS_TESTNET, STACKS_MAINNET } from '@stacks/network';
import { Buffer } from 'buffer';

interface LaunchTokenParams {
    name: string;
    symbol: string;
    imageUri: string;
    initialSupply: number;
    senderAddress: string;
    isTestnet: boolean;
}

interface ContractCallParams {
    contractAddress: string;
    contractName: string;
    functionName: string;
    functionArgs: any[];
    network: any;
    fee: number;
    nonce: number;
    version: number;
    postConditions: any[];
    anchorMode: number;
    sponsored: boolean;
}

export class StacksService {
    private network: any;
    private contractAddress: string;

    constructor() {
        this.network = process.env.NODE_ENV === 'production' ? STACKS_MAINNET : STACKS_TESTNET;
        this.contractAddress = process.env.CONTRACT_ADDRESS!;
    }

    getContractCallParams(params: LaunchTokenParams): ContractCallParams {
        const {
            name,
            symbol,
            imageUri,
            initialSupply,
            senderAddress,
            isTestnet
        } = params;

        // Set network based on isTestnet flag
        this.network = isTestnet ? STACKS_TESTNET : STACKS_MAINNET;

        return {
            contractAddress: this.contractAddress,
            contractName: 'token-launch',
            functionName: 'launch-token',
            functionArgs: [
                stringAsciiCV(name),
                stringAsciiCV(symbol),
                stringAsciiCV(imageUri),
                uintCV(initialSupply),
                stringAsciiCV(senderAddress)
            ],
            network: this.network,
            fee: 10000,
            nonce: 0,
            version: 0x00,
            postConditions: [],
            anchorMode: 3,
            sponsored: false
        };
    }

    async getTokenInfo(tokenAddress: string, isTestnet: boolean = false) {
        this.network = isTestnet ? STACKS_TESTNET : STACKS_MAINNET;

        try {
            const result = await fetchCallReadOnlyFunction({
                contractAddress: this.contractAddress,
                contractName: 'token-launch',
                functionName: 'get-token-info',
                functionArgs: [stringAsciiCV(tokenAddress)],
                network: this.network,
                senderAddress: this.contractAddress
            });

            return result;
        } catch (error) {
            console.error('Error fetching token info:', error);
            throw error;
        }
    }

    async collectDevFee(amount: number, isTestnet: boolean = false) {
        this.network = isTestnet ? STACKS_TESTNET : STACKS_MAINNET;

        const txOptions = {
            contractAddress: this.contractAddress,
            contractName: 'token-launch',
            functionName: 'collect-dev-fee',
            functionArgs: [uintCV(amount)],
            senderKey: process.env.PRIVATE_KEY!,
            network: this.network,
        };

        try {
            const transaction = await makeContractCall(txOptions);
            const result = await broadcastTransaction({ transaction, network: this.network });
            return result;
        } catch (error) {
            console.error('Error collecting dev fee:', error);
            throw error;
        }
    }

    async callReadOnly({
        contractAddress,
        contractName,
        functionName,
        functionArgs
    }: {
        contractAddress: string
        contractName: string
        functionName: string
        functionArgs: any[]
    }) {
        try {
            const coreApiUrl = (this.network as any).coreApiUrl || (this.network as any).getCoreApiUrl();
            const response = await fetch(`${coreApiUrl}/v2/contracts/call-read/${contractAddress}/${contractName}/${functionName}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    arguments: functionArgs
                })
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const result = await response.json()
            return result
        } catch (error) {
            console.error('Read-only call error:', error)
            throw error
        }
    }
} 