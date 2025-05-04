import { NextResponse } from 'next/server'
import { StacksTestnet } from '@stacks/network'
import { makeContractCall } from '@stacks/transactions'
import { createPrivateKey } from '@stacks/transactions'
import { Buffer } from 'buffer'

// Initialize Stacks testnet
const network = new StacksTestnet()

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      tokenName,
      tokenSymbol,
      totalSupply,
      devTokens,
      description,
      website,
      twitter,
      telegram,
      tokenImage,
      walletAddress,
      privateKey,
    } = body

    // Validate required fields
    if (!tokenName || !tokenSymbol || !totalSupply || !devTokens || !walletAddress || !privateKey) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate token symbol length
    if (tokenSymbol.length > 5) {
      return NextResponse.json(
        { error: 'Token symbol must be 5 characters or less' },
        { status: 400 }
      )
    }

    // Validate total supply
    const totalSupplyNum = parseInt(totalSupply)
    if (isNaN(totalSupplyNum) || totalSupplyNum <= 0) {
      return NextResponse.json(
        { error: 'Invalid total supply' },
        { status: 400 }
      )
    }

    // Validate dev tokens
    const devTokensNum = parseInt(devTokens)
    if (isNaN(devTokensNum) || devTokensNum <= 0 || devTokensNum > totalSupplyNum) {
      return NextResponse.json(
        { error: 'Invalid dev tokens amount' },
        { status: 400 }
      )
    }

    // Create token contract
    const contract = `
(define-fungible-token ${tokenSymbol})
(define-constant CONTRACT_OWNER '${walletAddress})
(define-constant TOTAL_SUPPLY u${totalSupply})
(define-constant DEV_TOKENS u${devTokens})

(define-public (mint)
  (begin
    (asserts! (is-eq tx-sender CONTRACT_OWNER) (err u1))
    (ft-mint? ${tokenSymbol} DEV_TOKENS tx-sender)
  )
)

(define-public (transfer (amount uint) (sender principal) (recipient principal))
  (begin
    (asserts! (is-eq tx-sender sender) (err u2))
    (ft-transfer? ${tokenSymbol} amount sender recipient)
  )
)

(define-public (get-balance (who principal))
  (ft-get-balance ${tokenSymbol} who)
)

(define-public (get-total-supply)
  (ft-get-supply ${tokenSymbol})
)
`

    // Deploy contract
    const privateKeyBuffer = Buffer.from(privateKey, 'hex')
    const txOptions = {
      contractName: `${tokenSymbol.toLowerCase()}-token`,
      codeBody: contract,
      senderKey: createPrivateKey(privateKeyBuffer),
      network,
    }

    const transaction = await makeContractCall(txOptions)
    
    return NextResponse.json({
      success: true,
      transactionId: transaction.txid(),
      contractAddress: `${walletAddress}.${tokenSymbol.toLowerCase()}-token`,
    })
  } catch (error) {
    console.error('Token launch error:', error)
    return NextResponse.json(
      { error: 'Failed to launch token' },
      { status: 500 }
    )
  }
} 