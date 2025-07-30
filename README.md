# 邹城市择邻山庄有限公司智慧酒店管理平台

## 项目简介

本项目是邹城市择邻山庄有限公司的智慧酒店管理平台前端应用，基于React + TypeScript + Ant Design构建。该平台提供设备状态实时监测、远程控制与调节、客房运营分析等功能，保障酒店有序运行，降低运营成本。

## 核心功能

### 🎯 主要功能模块

1. **总览仪表板** - 酒店整体运营状态监控和关键指标展示
2. **设备状态监测** - 客房设备实时状态监控、故障检测
3. **远程控制** - 设备远程开关、参数调节
4. **故障预警** - 智能故障预测、预警通知
5. **设备调节** - 温度、湿度、照明等环境参数调节
6. **设备联动** - 多设备协同控制、场景模式
7. **运营分析** - 客房运营数据分析、成本优化

### 🚀 技术特性

- **实时监控** - 设备状态实时监测和预警
- **智能控制** - 远程设备控制和自动化调节
- **数据分析** - 运营数据可视化分析
- **故障预测** - AI智能故障预警系统
- **节能优化** - 智能节能控制，降低运营成本
- **模块化设计** - 功能模块独立，易于维护和扩展

## 🚀 快速开始

### 本地开发

```bash
# 克隆项目
git clone https://github.com/sdjnzt/smart-hotel-platform.git
cd your-repo-name

# 安装依赖
npm install

# 启动开发服务器
npm start

# 访问 http://localhost:3000
```

### 部署到GitHub Pages

1. **Fork或克隆本项目到你的GitHub账户**

2. **启用GitHub Pages**：
   - 进入你的GitHub仓库
   - 点击 Settings → Pages
   - Source 选择 "GitHub Actions"

3. **自动部署**：
   - 推送代码到main/master分支会自动触发部署
   - 部署完成后可通过 `https://sdjnzt.github.io/smart-hotel-platform` 访问

### 手动部署

```bash
# 构建项目
npm run build

# 部署到GitHub Pages（需要安装gh-pages）
npm install -g gh-pages
gh-pages -d build
```

## 🌐 在线演示

- **GitHub Pages**: [https://sdjnzt.github.io/smart-hotel-platform](https://sdjnzt.github.io/smart-hotel-platform)
- **本地开发**: http://localhost:3000

## 技术栈

- **前端框架**: React 18
- **开发语言**: TypeScript
- **UI组件库**: Ant Design 5
- **图表库**: @ant-design/plots
- **路由管理**: React Router DOM 6
- **构建工具**: Create React App
- **样式方案**: CSS + Ant Design主题

## 快速开始

### 环境要求

- Node.js 16+
- npm 或 yarn

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm start
```

应用将在 http://localhost:3000 启动

### 构建生产版本

```bash
npm run build
```

### 运行测试

```bash
npm test
```

## 项目结构

```
src/
├── components/          # 公共组件
├── pages/              # 页面组件
│   ├── Dashboard.tsx          # 总览仪表板
│   ├── CommandDispatch.tsx    # 指挥调度
│   ├── StatusMonitor.tsx      # 状态检测
│   ├── SafetyManagement.tsx   # 安全管理
│   ├── RemoteControl.tsx      # 远程控制
│   ├── DataReport.tsx         # 数据上报
│   ├── DataAnalysis.tsx       # 数据分析
│   └── OrganizationManagement.tsx # 组织架构
├── data/               # 模拟数据
│   └── mockData.ts           # 所有模拟数据
├── App.tsx             # 主应用组件
├── index.tsx           # 应用入口
└── index.css           # 全局样式
```

## 功能说明

### 指挥调度中心
- 地图可视化调度界面
- 实时人员位置显示
- 语音对讲功能
- 视频通话支持
- 指令发送与管理

### 设备状态监控
- 实时设备状态监控
- 高清视频查看
- 设备参数监控
- 异常告警处理

### 安全管理
- 安全事件实时监控
- 应急响应处理
- 事件处理时间线
- 安全统计分析

### 远程控制
- 设备远程控制
- 参数实时调节
- 紧急停止功能
- 设备状态反馈

### 数据分析
- 多维度数据可视化
- 趋势分析图表
- 数据质量监控
- 实时数据流

### 组织架构管理
- 树形组织架构展示
- 人员信息管理
- 部门统计信息
- 灵活的架构调整

## 数据模拟

项目使用完整的模拟数据，包括：

- 设备信息（摄像头、对讲机、传感器、控制器）
- 用户信息（姓名、部门、职位、状态）
- 指令记录（调度指令、执行状态）
- 安全事件（类型、位置、严重程度）
- 数据记录（温度、湿度、电压等）
- 组织架构（部门、团队、人员）

## 浏览器支持

- Chrome 70+
- Firefox 70+
- Safari 12+
- Edge 79+

## 开发说明

### 添加新功能模块

1. 在 `src/pages/` 目录下创建新的页面组件
2. 在 `src/App.tsx` 中添加路由配置
3. 在 `src/data/mockData.ts` 中添加相应的模拟数据

### 自定义样式

项目使用 Ant Design 主题系统，可以通过修改 `src/index.css` 进行样式自定义。

### 数据接口

当前使用模拟数据，生产环境中需要替换为真实的API接口。接口规范请参考模拟数据的数据结构。

## 许可证

本项目为山东金科星机电股份有限公司内部使用，版权所有。

---

*山东金科星机电股份有限公司融合通信项目 - 让通信更简单，让管理更高效* 