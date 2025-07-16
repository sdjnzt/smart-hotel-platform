# 📚 GitHub 部署指南

## 🚀 上传项目到GitHub

### 步骤 1: 创建GitHub仓库

1. 登录 [GitHub](https://github.com)
2. 点击右上角的 "+" 按钮，选择 "New repository"
3. 填写仓库信息：
   - **Repository name**: `jinkexing-fusion-platform` (或其他名称)
   - **Description**: `山东金科星机电股份有限公司融合通信管理平台`
   - **Visibility**: Public (公开) 或 Private (私有)
4. 不要勾选 "Add a README file"（因为我们已经有了）
5. 点击 "Create repository"

### 步骤 2: 上传代码到GitHub

如果你还没有初始化Git仓库：

```bash
# 初始化Git仓库
git init

# 添加所有文件
git add .

# 提交代码
git commit -m "Initial commit: 山东金科星融合通信管理平台"

# 添加远程仓库（替换为你的仓库地址）
git remote add origin https://github.com/your-username/your-repo-name.git

# 推送到GitHub
git push -u origin main
```

如果已经有Git仓库：

```bash
# 添加远程仓库
git remote add origin https://github.com/your-username/your-repo-name.git

# 推送代码
git push -u origin main
```

### 步骤 3: 配置GitHub Pages

1. 进入你的GitHub仓库页面
2. 点击 **Settings** 选项卡
3. 在左侧菜单中找到 **Pages**
4. 在 "Source" 部分选择 **GitHub Actions**
5. 保存设置

### 步骤 4: 更新配置

在上传之前，请更新以下文件中的配置：

#### 更新 package.json

```json
{
  "homepage": "https://your-username.github.io/your-repo-name"
}
```

#### 更新 README.md

将所有的 `your-username` 和 `your-repo-name` 替换为你的实际GitHub用户名和仓库名。

## 🌐 自动部署

一旦推送代码到main分支，GitHub Actions会自动：

1. ✅ 安装依赖
2. ✅ 构建项目
3. ✅ 部署到GitHub Pages

部署通常需要1-3分钟，完成后你可以通过以下地址访问：

```
https://your-username.github.io/your-repo-name
```

## 🛠️ 本地部署测试

在推送到GitHub之前，可以先在本地测试：

```bash
# 构建项目
npm run build

# 使用部署脚本（推荐）
chmod +x deploy.sh
./deploy.sh

# 或手动部署
npm install -g gh-pages
gh-pages -d build
```

## 📋 检查清单

在部署之前，请确认：

- [ ] 已更新 `package.json` 中的 `homepage` 字段
- [ ] 已更新 `README.md` 中的仓库地址
- [ ] 项目能在本地正常运行 (`npm start`)
- [ ] 项目能正常构建 (`npm run build`)
- [ ] 已设置GitHub Pages为GitHub Actions模式

## 🔧 常见问题

### Q: 页面显示空白或404错误
A: 检查 `package.json` 中的 `homepage` 字段是否正确设置

### Q: 构建失败
A: 检查代码中是否有TypeScript错误，运行 `npm run build` 查看详细错误信息

### Q: 无法访问部署的网站
A: 确认GitHub Pages已启用且设置为GitHub Actions模式，等待部署完成（通常1-3分钟）

### Q: 样式或路由问题
A: React Router在GitHub Pages上可能需要额外配置，确保使用HashRouter或配置404.html

## 📞 技术支持

如果遇到问题，可以：

1. 检查GitHub Actions的构建日志
2. 确认所有依赖都已正确安装
3. 验证代码在本地能正常运行

## 🎉 完成

部署成功后，你的融合通信管理平台将在以下地址可用：

**🌐 在线地址**: https://your-username.github.io/your-repo-name

祝你部署成功！🚀 