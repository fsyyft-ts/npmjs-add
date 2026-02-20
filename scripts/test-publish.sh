#!/bin/bash
# 测试发布脚本的功能（不实际发布）

echo "=== 测试发布脚本 ==="
echo ""

# 1. 检查 .env 文件
echo "1. 检查 .env 文件..."
if [ -f ".env" ]; then
  echo "✅ .env 文件存在"
  grep "NPM_TOKEN" .env | sed 's/=.*$/=***HIDDEN***/'
else
  echo "❌ .env 文件不存在"
  exit 1
fi
echo ""

# 2. 测试读取 Token
echo "2. 测试读取 Token..."
export $(grep -v '^#' .env | xargs)
if [ -n "$NPM_TOKEN" ]; then
  echo "✅ Token 已读取: ${NPM_TOKEN:0:15}..."
else
  echo "❌ Token 读取失败"
  exit 1
fi
echo ""

# 3. 测试写入 .npmrc
echo "3. 测试写入 .npmrc..."
TOKEN_LINE="//registry.npmjs.org/:_authToken=${NPM_TOKEN}"
echo "$TOKEN_LINE" >> .npmrc
if grep -q "_authToken" .npmrc; then
  echo "✅ Token 已写入 .npmrc"
  echo "内容: $(grep _authToken .npmrc | sed 's/=.*/=***/')"
else
  echo "❌ Token 写入失败"
  exit 1
fi
echo ""

# 4. 测试清理
echo "4. 测试清理 .npmrc..."
sed -i.bak '/_authToken/d' .npmrc
rm -f .npmrc.bak
if grep -q "_authToken" .npmrc; then
  echo "❌ Token 未清理"
  exit 1
else
  echo "✅ Token 已清理"
fi
echo ""

echo "=== 所有测试通过 ==="
