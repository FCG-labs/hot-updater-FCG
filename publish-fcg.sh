#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
VERSION="0.21.15-fcg.1"

# 패키지 목록 (의존성 순서)
PACKAGES=(
  "packages/core"
  "plugins/plugin-core"
  "packages/cli-tools"
  "packages/server"
  "plugins/js"
  "packages/console"
  "packages/hot-updater"
)

# package.json 변환 함수
update_package_json() {
  local pkg_path="$1"
  local pkg_json="$pkg_path/package.json"
  
  # Node.js로 package.json 수정
  node -e "
    const fs = require('fs');
    const pkg = JSON.parse(fs.readFileSync('$pkg_json', 'utf8'));
    
    // 이름 변환: @hot-updater/xxx -> @fcg-labs/hot-updater-xxx
    // hot-updater -> @fcg-labs/hot-updater
    if (pkg.name === 'hot-updater') {
      pkg.name = '@fcg-labs/hot-updater';
    } else if (pkg.name.startsWith('@hot-updater/')) {
      pkg.name = pkg.name.replace('@hot-updater/', '@fcg-labs/hot-updater-');
    }
    
    // 버전
    pkg.version = '$VERSION';
    
    // publishConfig
    pkg.publishConfig = { registry: 'https://npm.pkg.github.com' };
    
    // dependencies 변환
    if (pkg.dependencies) {
      for (const [key, value] of Object.entries(pkg.dependencies)) {
        if (key.startsWith('@hot-updater/') && value === 'workspace:*') {
          const newKey = key.replace('@hot-updater/', '@fcg-labs/hot-updater-');
          delete pkg.dependencies[key];
          pkg.dependencies[newKey] = '$VERSION';
        }
      }
    }
    
    // devDependencies에서 workspace:* 제거 (빌드 시에만 필요)
    if (pkg.devDependencies) {
      for (const [key, value] of Object.entries(pkg.devDependencies)) {
        if (value === 'workspace:*' || value === 'catalog:') {
          delete pkg.devDependencies[key];
        }
      }
    }
    
    fs.writeFileSync('$pkg_json', JSON.stringify(pkg, null, 2) + '\n');
    console.log('  Updated: ' + pkg.name + '@' + pkg.version);
  "
}

echo "🚀 Publishing @fcg-labs packages to GitHub Packages..."
echo ""

for pkg in "${PACKAGES[@]}"; do
  pkg_path="$SCRIPT_DIR/$pkg"
  
  echo "📦 [$pkg]"
  
  # .npmrc 복사
  cp "$SCRIPT_DIR/.npmrc" "$pkg_path/.npmrc"
  
  # package.json 업데이트
  update_package_json "$pkg_path"
  
  # 빌드
  echo "  Building..."
  (cd "$pkg_path" && pnpm build 2>&1 | head -5) || echo "  ⚠️ Build warning (may be OK)"
  
  # 배포
  echo "  Publishing..."
  (cd "$pkg_path" && npm publish 2>&1 | tail -3) || echo "  ⚠️ Publish failed"
  
  echo ""
done

echo "✅ Done!"
