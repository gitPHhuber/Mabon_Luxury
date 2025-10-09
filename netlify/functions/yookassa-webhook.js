export const handler = async (event) => {
  try {
    const shopId = process.env.YK_SHOP_ID;
    const secret = process.env.YK_SECRET;
    if (!shopId || !secret) {
      return { statusCode: 500, body: "Missing YooKassa configuration" };
    }

    const payload = JSON.parse(event.body || "{}");
    const paymentId = payload?.object?.id;
    if (!paymentId) return { statusCode: 400, body: "no id" };

    const r = await fetch(`https://api.yookassa.ru/v3/payments/${paymentId}`, {
      headers: {
        Authorization:
          "Basic " + Buffer.from(`${shopId}:${secret}`).toString("base64"),
      },
    });
    const p = await r.json();

    console.log("YK webhook:", p.status, p?.metadata?.orderId);

    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  } catch (e) {
    return { statusCode: 500, body: String(e) };
  }
};
