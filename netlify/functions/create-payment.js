const sanitizeMoney = (value) => {
  if (typeof value === "number") {
    return value;
  }

  if (typeof value === "string") {
    const cleaned = value.replace(/[^0-9.,-]/g, "").replace(/,/g, ".");
    const parsed = Number.parseFloat(cleaned);
    return Number.isFinite(parsed) ? parsed : NaN;
  }

  return NaN;
};

const sanitizeQuantity = (value) => {
  if (typeof value === "number") {
    return value;
  }
  if (typeof value === "string") {
    const parsed = Number.parseInt(value, 10);
    return Number.isFinite(parsed) ? parsed : NaN;
  }
  return NaN;
};

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
    const email = typeof body.email === "string" ? body.email : "";

    if (!items.length) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Cart is empty" }),
      };
    }

    let totalRub = 0;
    for (const item of items) {
      const price = sanitizeMoney(item.price);
      const qty = sanitizeQuantity(item.qty ?? item.quantity ?? 1);
      if (!Number.isFinite(price) || !Number.isFinite(qty)) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: "Invalid cart item data" }),
        };
      }
      totalRub += price * qty;
    }

    if (!Number.isFinite(totalRub) || totalRub <= 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Cart total must be greater than zero" }),
      };
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

    const data = await resp.json().catch(() => null);
    const url = data?.confirmation?.confirmation_url;
    if (!resp.ok || !url) {
      console.error("[create-payment] YooKassa error", resp.status, data);
      return {
        statusCode: resp.status || 502,
        body: JSON.stringify({
          error: data?.description || data?.message || "Не удалось создать платёж",
        }),
      };
    }

    return { statusCode: 200, body: JSON.stringify({ redirectUrl: url }) };
  } catch (e) {
    console.error("[create-payment] Unexpected error", e);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Внутренняя ошибка сервера" }),
    };
  }
};
