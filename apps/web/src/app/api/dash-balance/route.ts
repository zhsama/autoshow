import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { walletAddress } = body
    
    // In a real application, you would validate the wallet and fetch the balance
    // For now, we'll return a mock balance
    const mockBalance = Math.random() * 100 // Random balance between 0-100
    
    return NextResponse.json({ 
      balance: mockBalance,
      walletAddress 
    })
  } catch (error) {
    console.error('[API] Error fetching dash balance:', error)
    return NextResponse.json(
      { error: 'Failed to fetch balance' },
      { status: 500 }
    )
  }
}