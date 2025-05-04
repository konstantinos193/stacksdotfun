// app/api/balance/[address]/route.ts
export async function GET(
  req: Request,
  { params }: { params: { address: string } }
) {
  const address = params.address;
  try {
    // Use Hiro mainnet endpoint
    const res = await fetch(`https://api.hiro.so/v2/accounts/${address}`);
    if (!res.ok) {
      return Response.json({ balance: 0 }, { status: 400 });
    }
    const data = await res.json();
    // The balance is a hex string, e.g. "0x0000000000000000000000000007a120"
    // Convert hex to decimal, then to STX (divide by 1_000_000)
    const microstx = parseInt(data.balance, 16);
    const stx = (microstx / 1_000_000).toFixed(6);
    return Response.json({ balance: stx });
  } catch (e) {
    return Response.json({ balance: 0 }, { status: 500 });
  }
}