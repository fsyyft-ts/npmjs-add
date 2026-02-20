#!/bin/bash
#
# npm 发布脚本
#
# 功能：从 .env 读取 Token 并发布到 npm
# 使用：npm run publish:npm
#

# 遇到错误立即退出
set -e

# ============================================
# 颜色定义
# ============================================
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# ============================================
# 配置项
# ============================================
NPMRC_FILE=".npmrc"
NPM_REGISTRY="https://registry.npmjs.org/"
TOKEN_LINE="//registry.npmjs.org/:_authToken="

# ============================================
# 清理函数
# ============================================
#
# 功能：清理 .npmrc 文件中的 Token
# 说明：无论发布成功或失败都会执行此函数
#
cleanup() {
  echo -e "${YELLOW}清理 Token...${NC}"
  if [ -f "$NPMRC_FILE" ]; then
    # 删除包含 _authToken 的行
    sed -i.bak '/_authToken/d' "$NPMRC_FILE" 2>/dev/null || true
    rm -f "${NPMRC_FILE}.bak"
  fi
  echo -e "${GREEN}✅ Token 已清理${NC}"
}

# ============================================
# 错误处理
# ============================================
#
# 功能：无论脚本如何结束，都执行清理函数
# 说明：确保 Token 不会残留在 .npmrc 文件中
#
trap cleanup EXIT

# ============================================
# 检查 .env 文件
# ============================================
if [ ! -f ".env" ]; then
  echo -e "${RED}错误: .env 文件不存在${NC}"
  echo -e "${YELLOW}请复制 .env.example 为 .env 并填入你的 NPM_TOKEN${NC}"
  exit 1
fi

# ============================================
# 读取 Token
# ============================================
echo -e "${YELLOW}加载 .env 文件...${NC}"
export $(grep -v '^#' .env | xargs)

if [ -z "$NPM_TOKEN" ]; then
  echo -e "${RED}错误: .env 中未找到 NPM_TOKEN${NC}"
  exit 1
fi

echo -e "${GREEN}✅ Token 已加载${NC}"

# ============================================
# 写入 .npmrc
# ============================================
echo -e "${YELLOW}配置 npm 认证...${NC}"
echo "${TOKEN_LINE}${NPM_TOKEN}" >> "$NPMRC_FILE"
echo -e "${GREEN}✅ Token 已写入 .npmrc${NC}"

# ============================================
# 验证登录状态
# ============================================
echo -e "${YELLOW}验证 npm 登录状态...${NC}"
CURRENT_USER=$(npm whoami --registry "$NPM_REGISTRY" 2>/dev/null || echo "")
if [ -n "$CURRENT_USER" ]; then
  echo -e "${GREEN}✅ 当前登录用户: ${CURRENT_USER}${NC}"
else
  echo -e "${YELLOW}⚠️  无法验证登录状态，继续尝试发布...${NC}"
fi

# ============================================
# 构建项目
# ============================================
echo -e "${YELLOW}构建项目...${NC}"
npm run build

# ============================================
# 运行测试
# ============================================
echo -e "${YELLOW}运行测试...${NC}"
npm run test:run

# ============================================
# 发布到 npm
# ============================================
echo -e "${YELLOW}发布到 npm...${NC}"
npm publish --registry "$NPM_REGISTRY" --access public

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}🎉 发布成功！${NC}"
echo -e "${GREEN}========================================${NC}"

# 清理会由 trap 自动执行
