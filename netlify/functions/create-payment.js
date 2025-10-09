export const handler = async (event) => {
  try {
    const shopId = process.env.YK_SHOP_ID;
    const secret = process.env.YK_SECRET;
    const publicUrl = process.env.PUBLIC_URL;
    if (!shopId || !secret || !publicUrl) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Missing YooKassa configuration" }),
      };
    }

    const body = JSON.parse(event.body || "{}");
    const items = Array.isArray(body.items) ? body.items : [];
    const email = body.email || "";

    const totalRub = items.reduce(
      (sum, item) => sum + Number(item.price || 0) * Number(item.qty ?? item.quantity ?? 1),
      0
    );
    if (!Number.isFinite(totalRub) || totalRub <= 0) {
      return { statusCode: 400, body: JSON.stringify({ error: "Invalid cart total" }) };
    }

    const orderId = "ord_" + Date.now();

    const resp = await fetch("https://api.yookassa.ru/v3/payments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Idempotence-Key": orderId,
        Authorization:
          "Basic " + Buffer.from(`${shopId}:${secret}`).toString("base64"),
      },
      body: JSON.stringify({
        amount: { value: Number(totalRub).toFixed(2), currency: "RUB" },
        capture: true,
        payment_method_data: { type: "sbp" },
        confirmation: {
          type: "redirect",
          return_url: `${publicUrl}/checkout/success?o=${orderId}`,
        },
        description: `Order ${orderId}`,
        metadata: { orderId, email },
      }),
    });

    const data = await resp.json();
    const url = data?.confirmation?.confirmation_url;
    if (!resp.ok || !url) {
      return { statusCode: 502, body: JSON.stringify({ error: data }) };
    }
    return { statusCode: 200, body: JSON.stringify({ redirectUrl: url }) };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ error: String(e) }) };
  }
};
