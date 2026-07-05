/**
 * 使用 sharp 从 djss512.png 生成全套应用图标：
 *  1) Web / public/ 下的 favicon 及 apple-touch-icon
 *  2) Android mipmap 各密度下的 ic_launcher / ic_launcher_round / ic_launcher_foreground
 *  3) 复制 djss512.png 作为 public/favicon-512.png 供 PWA/大尺寸场景使用
 */
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, 'djss512.png');
const ANDROID_RES = path.join(ROOT, 'android', 'app', 'src', 'main', 'res');
const PUBLIC_DIR = path.join(ROOT, 'public');

if (!fs.existsSync(PUBLIC_DIR)) fs.mkdirSync(PUBLIC_DIR, { recursive: true });

const DENSITIES = [
  { name: 'mdpi',    launcher: 48,  fg: 108 },
  { name: 'hdpi',    launcher: 72,  fg: 162 },
  { name: 'xhdpi',   launcher: 96,  fg: 216 },
  { name: 'xxhdpi',  launcher: 144, fg: 324 },
  { name: 'xxxhdpi', launcher: 192, fg: 432 },
];

async function main() {
  // ---------- 1) Web 静态资源 ----------
  const targets = [
    { out: path.join(PUBLIC_DIR, 'favicon-32.png'),        size: 32 },
    { out: path.join(PUBLIC_DIR, 'favicon-192.png'),       size: 192 },
    { out: path.join(PUBLIC_DIR, 'apple-touch-icon.png'),  size: 180 },
    { out: path.join(PUBLIC_DIR, 'favicon-512.png'),       size: 512 },
  ];
  for (const t of targets) {
    await sharp(SRC).resize(t.size, t.size, { fit: 'cover' }).png().toFile(t.out);
    console.log(`✓ web  ${path.relative(ROOT, t.out)}  (${t.size}x${t.size})`);
  }
  // 额外提供 favicon.png 默认 64x64 兜底
  await sharp(SRC).resize(64, 64, { fit: 'cover' }).png()
    .toFile(path.join(PUBLIC_DIR, 'favicon.png'));
  console.log(`✓ web  public/favicon.png  (64x64)`);

  // ---------- 2) Android mipmap 图标 ----------
  for (const d of DENSITIES) {
    const dir = path.join(ANDROID_RES, `mipmap-${d.name}`);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    // ic_launcher.png, ic_launcher_round.png — 相同的完整图标内容（Launcher 根据 XML 选择）
    const fullNames = ['ic_launcher.png', 'ic_launcher_round.png'];
    for (const fname of fullNames) {
      await sharp(SRC).resize(d.launcher, d.launcher, { fit: 'cover' }).png()
        .toFile(path.join(dir, fname));
      console.log(`✓ and  mipmap-${d.name}/${fname}  (${d.launcher}x${d.launcher})`);
    }

    // ic_launcher_foreground.png — 自适应图标前景层，尺寸更大
    await sharp(SRC).resize(d.fg, d.fg, { fit: 'cover' }).png()
      .toFile(path.join(dir, 'ic_launcher_foreground.png'));
    console.log(`✓ and  mipmap-${d.name}/ic_launcher_foreground.png  (${d.fg}x${d.fg})`);
  }

  console.log('\n全部图标生成完成 ✅');
}

main().catch(err => {
  console.error('生成图标失败:', err);
  process.exit(1);
});
