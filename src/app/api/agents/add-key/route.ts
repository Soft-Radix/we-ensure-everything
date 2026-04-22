import { NextRequest, NextResponse } from "next/server";
import Agent from "@/models/Agent";
import { encrypt } from "@/lib/crypto";
import { subAccountVersion } from "@/lib/data/static";
import { sendGHLWebhook } from "@/lib/ghl-webhook";

export async function POST(req: NextRequest) {
  try {
    const { email, apiKey } = await req.json();

    if (!email || !apiKey) {
      return NextResponse.json(
        { error: "Email and API Key are required" },
        { status: 400 },
      );
    }

    // Find agent by email
    const agent = await Agent.findOne({ where: { email } });

    if (!agent) {
      return NextResponse.json(
        { error: "Agent not found with this email" },
        { status: 404 },
      );
    }
    const locationURL = `${
      process.env.GHL_LOCATION_WEBHOOK
    }${agent?.ghl_location_id?.trim()}`;
    if (!locationURL) {
      return NextResponse.json(
        { error: "Location URL not found" },
        { status: 500 },
      );
    }
    const res = await fetch(locationURL, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        Version: subAccountVersion,
      },
    });

    if (!res.ok) {
      return NextResponse.json({ error: "Invalid API Key" }, { status: 400 });
    }
    // Encrypt the API key
    const encryptedKey = encrypt(apiKey);

    // TEST: Verify decryption works (Server-side only)
    // try {
    //   const { decrypt } = require("@/lib/crypto");
    //   const decrypted = decrypt(encryptedKey);
    //   console.log(
    //     "DEBUG: Decryption test successful. Decrypted key matches:",
    //     decrypted,
    //   );
    // } catch (e) {
    //   console.error("DEBUG: Decryption test failed:", e);
    // }

    // Update agent's API key
    await agent.update({
      ghl_api_key: encryptedKey,
    });

    // Send GHL Webhook
    await sendGHLWebhook("api_key_added", {
      name: agent.full_name,
      email: agent.email,
      phone: agent.phone,
      state: agent.state,
    });

    return NextResponse.json({
      success: true,
      message: "API Key updated successfully",
    });
  } catch (error: any) {
    console.error("Error adding API key:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
