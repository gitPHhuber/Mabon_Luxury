const normalizePrice = (value) => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === "string") {
    const cleaned = value.replace(/[^0-9.,-]/g, "").replace(/,/g, ".");
    const parsed = Number.parseFloat(cleaned);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }
  return 0;
};

const normalizeQty = (value) => {
  const num = Number(value);
  if (!Number.isFinite(num) || num <= 0) return 0;
  return num;
};

const buildErrorResponse = (statusCode, message) => ({
  statusCode,
  body: JSON.stringify({ error: message }),
});


const resolvePublicUrl = (event, explicitUrl) => {
  if (explicitUrl) return explicitUrl;

  const headers = event?.headers || {};
  const protocol =
    headers["x-forwarded-proto"] || headers["X-Forwarded-Proto"] || "https";
  const host = headers.host || headers.Host;

  if (host) {
    return `${protocol}://${host}`;
  }

  return "";
};


export const handler = async (event) => {
  try {
    const shopId = process.env.YK_SHOP_ID;
    const secret = process.env.YK_SECRET;

    const publicUrl = resolvePublicUrl(event, process.env.PUBLIC_URL);

    if (!shopId || !secret) {
      console.error("Missing YooKassa configuration", {
        hasShopId: Boolean(shopId),
        hasSecret: Boolean(secret),
        derivedPublicUrl: publicUrl,

      });
      return buildErrorResponse(
        500,
        "Платёжный сервис временно недоступен. Попробуйте позже."
      );

    }

    if (!publicUrl) {
      console.error("Unable to resolve public URL for return link", {
        headers: event.headers,
      });
      return buildErrorResponse(
        500,
        "Не удалось определить адрес возврата после оплаты. Попробуйте ещё раз позже."
      );

    }

    const body = JSON.parse(event.body || "{}");
    const items = Array.isArray(body.items) ? body.items : [];
    const email = body.email || "";

    const totalRubRaw = items.reduce((sum, item) => {
      const price = normalizePrice(item?.price);
      const qty = normalizeQty(item?.qty ?? item?.quantity ?? 1);
      return sum + price * qty;
    }, 0);

    const totalRub = Math.round(totalRubRaw * 100) / 100;
    if (!Number.isFinite(totalRub) || totalRub <= 0) {
      console.warn("Invalid cart total", { totalRubRaw, items });
      return buildErrorResponse(
        400,
        "Сумма заказа должна быть больше 0 ₽. Обновите корзину и попробуйте ещё раз."
      );
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
        amount: { value: totalRub.toFixed(2), currency: "RUB" },
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

    const data = await resp.json().catch(() => ({}));
    const url = data?.confirmation?.confirmation_url;
    if (!resp.ok) {
      console.error("YooKassa payment error", resp.status, data);
      const message =
        data?.description ||
        data?.message ||
        data?.error_description ||
        data?.error ||
        "Не удалось создать платёж. Попробуйте позже.";
      return buildErrorResponse(resp.status || 502, message);

    }

    if (!url) {
      console.error("YooKassa response missing confirmation URL", data);
      return buildErrorResponse(
        502,
        "Не удалось получить ссылку на оплату. Попробуйте позже."
      );
    }

    return { statusCode: 200, body: JSON.stringify({ redirectUrl: url }) };
  } catch (e) {
    console.error("Unexpected error while creating payment", e);
    return buildErrorResponse(
      500,
      "Произошла непредвиденная ошибка. Попробуйте оформить заказ ещё раз."
    );
  }
};
