
// app/api/admin/route.ts – sets admin cookie when password is correct
import { NextResponse } from "next/server";
export async function POST(req: Request){
  const { password } = await req.json();
  if(password === "33940"){
    const res = NextResponse.json({ ok: true });
    res.cookies.set("admin", "true", { httpOnly: true, path: "/", maxAge: 60*60*12 });
    return res;
  }
  return NextResponse.json({ ok: false }, { status: 401 });
}
