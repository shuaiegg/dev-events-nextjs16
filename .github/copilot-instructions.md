## 快速背景（对 AI 代理说明）

这是一个基于 Next.js (app 路由) 的 TypeScript 前端项目（见 `app/` + `components/`）。主要目标是展示和浏览活动（Events）。关键事实：

- 使用 Next 16 的 app 目录结构（`app/layout.tsx`, `app/page.tsx`, 以及子路由例如 `app/(dashboard)/...`）。
- 严格 TypeScript（`tsconfig.json` 中 `strict: true`）和路径别名 `@/* -> ./*`。
- 样式基于 TailwindCSS（`tailwindcss`、`@tailwindcss/postcss`）和一些自定义 CSS（`app/globals.css`、`components/LightRays.css`）。
- 静态资源放在 `public/`（例如 `public/images/*.png`, `public/icons/*.png`），代码中通过 `/images/...` 或 `Image` 组件引用。

## 要点 / 架构概览

- 路由与页面：主要在 `app/` 下组织。示例：主页 `app/page.tsx`，仪表盘在 `app/(dashboard)/dashboard/...`。
- 组件：放在 `components/`（例如 `EventCard.tsx`, `Navbar.tsx`, `LightRays.tsx`）。注意组件倾向使用 Tailwind className 和 `next/image`。
- 全局布局与字体：`app/layout.tsx` 加载 Google 字体（`next/font`）、`Navbar` 和 `LightRays` 背景效果（WebGL，依赖 `ogl`）。
- 数据流：目前页面通常在文件中声明静态数组（例如 `app/page.tsx` 的 `events`），动态路由可见于 `app/(dashboard)/users/[id]/page.tsx`。

## 开发/运行/检查命令（必知）

- 安装依赖：在仓库根目录运行 `npm install`。
- 本地开发服务器：`npm run dev`（会调用 `next dev`）。
- 构建：`npm run build`（`next build`），启动生产：`npm run start`（`next start`）。
- Lint：`npm run lint`（`eslint`）。

注意：package.json 声明了 Next 16 / React 19 / TypeScript 5 等版本；在做重大版本升级前请确认兼容性。

## 项目约定与常见模式（供生成代码参考）

- 路由位置：把页面放在 `app/` 下，并使用 `page.tsx` 文件作为入口；子路由用目录嵌套（例如 `app/about/page.tsx`）。
- 静态图片：放 `public/images` 并用 `next/image` 引用，例如 `<Image src="/images/event1.png" width={410} height={300} />`。
- 组件 props：项目用明确的 TypeScript 接口声明（例如 `components/EventCard.tsx` 的 `interface props { title: string; image: string; ... }`），生成代码时请导出/使用清晰的 props 类型。
- CSS/Tailwind：偏好 Tailwind 类名内联；大型样式可以放到 `app/globals.css` 或组件级 CSS 文件（如 `components/LightRays.css`）。
- 路径别名：使用 `@/` 或相对路径，符合 `tsconfig.json` 的 `paths`。

## 集成点与外部依赖（已安装）

- Web / 视效：`ogl` 用于 `LightRays`（WebGL）；不要移除或更改其工作方式，修改时测试页面渲染与性能。
- 图标与 UI：`lucide-react`、`clsx`、`class-variance-authority`、`tailwind-merge` 被使用来构建可组合的类名和图标。
- Babel 插件：`babel-plugin-react-compiler` 在依赖中（注意可能是实验性）。

## 小示例（如何添加一个事件卡片）

1. 在 `components/` 新建或修改 `EventCard.tsx`，保持 props 类型签名。参考现有实现：

   - `components/EventCard.tsx` 使用 `next/image` 和 `Link` 到 `/events`。

2. 将图片放到 `public/images`，在页面中像 `app/page.tsx` 那样传入 `image: '/images/event1.png'`。

3. 启动 dev 服务器并检查页面：`npm run dev` -> 打开 `http://localhost:3000`。

## 编辑器/提交注意事项

- 保持小的、可运行的改动：APIs/组件改动后请在本地运行 `npm run dev` 验证无报错。
- TypeScript 严格模式：生成代码必须通过类型检查；导出/引入时使用显式类型。

## 不要做的事（针对自动修改）

- 不要随意升级 Next/React/TypeScript 版本或移除已有依赖（会引起破坏性变更）。
- 不要将 runtime 静态资源移出 `public/`（`next/image` 引用依赖此约定）。

---

如果这个文件还有你希望补充的项目细节（例如自定义 lint 规则、CI 命令或环境变量），请告诉我，我会把它合并进来并更新本文件。 
