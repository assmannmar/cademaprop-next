import { NextResponse } from "next/server";

export async function GET(req: Request) {
  // Verificación de seguridad para que no lo llame cualquiera
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const currentToken = process.env.INSTAGRAM_ACCESS_TOKEN;
  
  const res = await fetch(
    `https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${currentToken}`
  );
  
  const data = await res.json();
  
  // Loguea el nuevo token para que lo copies en Vercel
  console.log("Nuevo token:", data.access_token);
  console.log("Expira en (segundos):", data.expires_in);
  
  return NextResponse.json({ 
    ok: true,
    expires_in: data.expires_in 
  });
}