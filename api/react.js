// WHATSAPP CHANNEL REACTOR API
// Developer: WASIF ALI | Telegram: @FREEHACKS95

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');

  const { link, emojis } = req.query;

  if (!link || !emojis) {
    return res.status(200).send(JSON.stringify({
      success: false,
      message: "Missing parameters",
      usage: "/api/react?link=CHANNEL_POST_LINK&emojis=😭,🔥",
      example: "/api/react?link=https://whatsapp.com/channel/0029Vb785rSBlHpWSitPY61i/585&emojis=😭,🔥",
      developer: "WASIF ALI",
      telegram: "@FREEHACKS95"
    }, null, 2));
  }

  try {
    // Validate WhatsApp channel link
    if (!link.includes('whatsapp.com/channel/')) {
      return res.status(200).send(JSON.stringify({
        success: false,
        message: "Invalid WhatsApp channel link",
        developer: "WASIF ALI",
        telegram: "@FREEHACKS95"
      }, null, 2));
    }

    // Split emojis
    const emojiList = emojis.split(',').map(e => e.trim()).filter(Boolean);
    if (emojiList.length === 0 || emojiList.length > 4) {
      return res.status(200).send(JSON.stringify({
        success: false,
        message: "1-4 emojis required",
        developer: "WASIF ALI",
        telegram: "@FREEHACKS95"
      }, null, 2));
    }

    // ========== STEP 1: Get reCAPTCHA Token ==========
    const captchaRes = await fetch(
      `https://omegatech-api.dixonomega.tech/api/tools/recaptcha-v3?sitekey=6LemKk8sAAAAAH5PB3f1EspbMlXjtwv5C8tiMHSm&url=https://back.asitha.top/api&use_enterprise=false`
    );
    const captchaData = await captchaRes.json();

    if (!captchaData?.success || !captchaData?.token) {
      throw new Error("reCAPTCHA bypass failed");
    }

    // ========== STEP 2: Get Temporary API Key ==========
    const userJwt = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5OGE2ZGI5MjVjMzUyOTcxZTIyYTdkNSIsImlhdCI6MTc3NTg1NzUyMCwiZXhwIjoxNzc2NDYyMzIwfQ.q7D6potY6cl3n-ZY8nQbetNFqPSl79aF5IIZ_QbtABc";
    
    const tempKeyRes = await fetch("https://back.asitha.top/api/user/get-temp-token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${userJwt}`
      },
      body: JSON.stringify({ recaptcha_token: captchaData.token })
    });
    
    const tempKeyData = await tempKeyRes.json();

    if (!tempKeyData?.token) {
      throw new Error("Temporary API key failed");
    }

    // ========== STEP 3: Send Reactions ==========
    const reactRes = await fetch(
      `https://back.asitha.top/api/channel/react-to-post?apiKey=${tempKeyData.token}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${userJwt}`
        },
        body: JSON.stringify({
          post_link: link,
          reacts: emojiList.join(',')
        })
      }
    );

    const reactData = await reactRes.json();

    if (!reactRes.ok) {
      throw new Error(reactData.message || "Reaction failed");
    }

    // ========== SUCCESS RESPONSE ==========
    return res.status(200).send(JSON.stringify({
      success: true,
      message: "Reactions sent successfully",
      link: link,
      emojis: emojiList,
      developer: "WASIF ALI",
      telegram: "@FREEHACKS95"
    }, null, 2));

  } catch (error) {
    return res.status(200).send(JSON.stringify({
      success: false,
      message: error.message,
      developer: "WASIF ALI",
      telegram: "@FREEHACKS95"
    }, null, 2));
  }
}
