export async function createAbacatePayBilling(data: {
  amount: number;
  description: string;
}) {
  const baseUrl = process.env.ABACATEPAY_API_URL || "https://api.abacatepay.com/v1";
  const response = await fetch(`${baseUrl}/pixQrCode/create`, {
    method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.ABACATEPAY_API_KEY}`,
      },
      body: JSON.stringify({
        amount: data.amount,
        expiresIn: 3600,
        description: data.description,
      }),
    },
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "Failed to create AbacatePay billing");
  }

  return result.data;
}
