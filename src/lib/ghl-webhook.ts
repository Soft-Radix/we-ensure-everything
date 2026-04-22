export type GHLEvent =
  | "agent_created"
  | "api_key_added"
  | "paid"
  | "onboarded"
  | "scheduled";

interface GHLData {
  name: string;
  email: string | null;
  phone: string | null;
  state?: string | null;
  county?: any;
  category?: string | null;
}

export const sendGHLWebhook = async (event: GHLEvent, data: GHLData) => {
  const ghlWebhookUrl = process.env.GHL_AGENT_RESIGTER_WEBHOOK;
  if (!ghlWebhookUrl) {
    console.warn("GHL_AGENT_RESIGTER_WEBHOOK is not defined");
    return;
  }

  const payload = {
    event,
    ...data,
  };

  try {
    const res = await fetch(ghlWebhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error(`GHL Webhook failed with status: ${res.status}`);
    }

    console.log(`✅ GHL Webhook (${event}) triggered successfully!`, payload);
    return true;
  } catch (err) {
    console.error(`❌ GHL Webhook (${event}) failed:`, err);
    return false;
  }
};
