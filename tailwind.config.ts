// tailwind.config.ts
import type { Config } from "tailwindcss";
import daisyui from "daisyui";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: { extend: {} },
  plugins: [daisyui],          // ✅ 플러그인만 등록
  // ❌ daisyui: { themes: ["corporate"] }  // 타입 오류 유발 → 제거
};

export default config;