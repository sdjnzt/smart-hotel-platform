import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { Layout, Menu, theme, Button, Avatar, Dropdown, Space, Typography } from 'antd';
import {
  HomeOutlined,
  DashboardOutlined,
  MonitorOutlined,
  ControlOutlined,
  WarningOutlined,
  SettingOutlined,
  ApiOutlined,
  BarChartOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  LogoutOutlined,
  BellOutlined,
  KeyOutlined,
  RobotOutlined,
  TeamOutlined,
  CalendarOutlined,
  FileTextOutlined,
  CloudOutlined,
  SafetyOutlined,
  EnvironmentOutlined,
  WifiOutlined,
  DatabaseOutlined,
  ToolOutlined,
  QuestionCircleOutlined,
  InfoCircleOutlined,
  GlobalOutlined,
  ClockCircleOutlined,
  TrophyOutlined,
  StarOutlined,
} from '@ant-design/icons';
import Welcome from './pages/Welcome';
import Dashboard from './pages/Dashboard';
import DeviceMonitor from './pages/DeviceMonitor';
import RemoteControl from './pages/RemoteControl';
import FaultWarning from './pages/FaultWarning';
import DeviceAdjustment from './pages/DeviceAdjustment';
import DeviceLinkage from './pages/DeviceLinkage';
import OperationAnalysis from './pages/OperationAnalysis';
import DeliveryRobot from './pages/DeliveryRobot';
import EnvironmentMonitor from './pages/EnvironmentMonitor';
import NetworkStatus from './pages/NetworkStatus';
import StaffManagement from './pages/StaffManagement';
import UserGuide from './pages/UserGuide';
import CleaningRobot from './pages/CleaningRobot';
import SecuritySystem from './pages/SecuritySystem';
import AccessControl from './pages/AccessControl';
import PerformanceReport from './pages/PerformanceReport';
import EnergyAnalysis from './pages/EnergyAnalysis';
import GuestSatisfaction from './pages/GuestSatisfaction';
import RoomManagement from './pages/RoomManagement';
import MaintenanceSchedule from './pages/MaintenanceSchedule';
import InventoryManagement from './pages/InventoryManagement';
import UserManagement from './pages/UserManagement';
import RolePermissions from './pages/RolePermissions';
import SystemLogs from './pages/SystemLogs';
import BackupRestore from './pages/BackupRestore';
import Login from './pages/Login';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

const menuItems = [
  {
    key: '/',
    icon: <HomeOutlined />,
    label: '欢迎页面',
  },
  {
    key: '/dashboard',
    icon: <DashboardOutlined />,
    label: '总览仪表板',
  },
  {
    type: 'divider' as const,
  },
  {
    key: 'device-management',
    icon: <MonitorOutlined />,
    label: '设备管理',
    children: [
      {
        key: '/device-monitor',
        icon: <MonitorOutlined />,
        label: '设备状态监测',
      },
      {
        key: '/remote-control',
        icon: <ControlOutlined />,
        label: '远程控制',
      },
      {
        key: '/device-adjustment',
        icon: <SettingOutlined />,
        label: '设备调节',
      },
      {
        key: '/device-linkage',
        icon: <ApiOutlined />,
        label: '设备联动',
      },
      {
        key: '/environment-monitor',
        icon: <EnvironmentOutlined />,
        label: '环境监测',
      },
      {
        key: '/network-status',
        icon: <WifiOutlined />,
        label: '网络状态',
      },
    ],
  },
  {
    key: 'smart-services',
    icon: <RobotOutlined />,
    label: '智能服务',
    children: [
      {
        key: '/delivery-robot',
        icon: <RobotOutlined />,
        label: '送餐机器人',
      },
      {
        key: '/cleaning-robot',
        icon: <RobotOutlined />,
        label: '清洁机器人',
      },
      {
        key: '/security-system',
        icon: <SafetyOutlined />,
        label: '安防系统',
      },
      {
        key: '/access-control',
        icon: <KeyOutlined />,
        label: '门禁管理',
      },
    ],
  },
  {
    key: 'data-analysis',
    icon: <BarChartOutlined />,
    label: '数据分析',
    children: [
      {
        key: '/operation-analysis',
        icon: <BarChartOutlined />,
        label: '运营分析',
      },
      {
        key: '/performance-report',
        icon: <TrophyOutlined />,
        label: '绩效报告',
      },
      {
        key: '/energy-analysis',
        icon: <CloudOutlined />,
        label: '能耗分析',
      },
      {
        key: '/guest-satisfaction',
        icon: <StarOutlined />,
        label: '满意度分析',
      },
    ],
  },
  {
    key: 'management',
    icon: <TeamOutlined />,
    label: '管理功能',
    children: [
      {
        key: '/staff-management',
        icon: <TeamOutlined />,
        label: '员工管理',
      },
      {
        key: '/room-management',
        icon: <HomeOutlined />,
        label: '房间管理',
      },
      {
        key: '/maintenance-schedule',
        icon: <CalendarOutlined />,
        label: '维护计划',
      },
      {
        key: '/inventory-management',
        icon: <DatabaseOutlined />,
        label: '库存管理',
      },
    ],
  },
  {
    key: 'system',
    icon: <ToolOutlined />,
    label: '系统管理',
    children: [
      // {
      //   key: '/system-settings',
      //   icon: <SettingOutlined />,
      //   label: '系统设置',
      // },
      {
        key: '/user-management',
        icon: <UserOutlined />,
        label: '用户管理',
      },
      {
        key: '/role-permissions',
        icon: <KeyOutlined />,
        label: '角色权限',
      },
      {
        key: '/system-logs',
        icon: <FileTextOutlined />,
        label: '系统日志',
      },
      {
        key: '/backup-restore',
        icon: <DatabaseOutlined />,
        label: '备份恢复',
      },
    ],
  },
  {
    type: 'divider' as const,
  },
  // {
  //   key: 'help',
  //   icon: <QuestionCircleOutlined />,
  //   label: '帮助支持',
  //   children: [
  //     {
  //       key: '/user-guide',
  //       icon: <FileTextOutlined />,
  //       label: '用户指南',
  //     },
  //     {
  //       key: '/faq',
  //       icon: <QuestionCircleOutlined />,
  //       label: '常见问题',
  //     },
  //     {
  //       key: '/contact-support',
  //       icon: <InfoCircleOutlined />,
  //       label: '联系支持',
  //     },
  //     {
  //       key: '/about-system',
  //       icon: <InfoCircleOutlined />,
  //       label: '关于系统',
  //     },
  //   ],
  // },
];

// 添加路由保护组件
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('userToken');
    setIsAuthenticated(!!token);
    
    if (!token && location.pathname !== '/login') {
      navigate('/login', { replace: true });
    }
  }, [navigate, location]);

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};

const AppLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  // 管理员下拉菜单项
  const adminMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人资料',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '系统设置',
    },
    // {
    //   key: 'notifications',
    //   icon: <BellOutlined />,
    //   label: '消息通知',
    // },
    // {
    //   key: 'language',
    //   icon: <GlobalOutlined />,
    //   label: '语言设置',
    // },
    // {
    //   key: 'theme',
    //   icon: <StarOutlined />,
    //   label: '主题切换',
    // },
    // {
    //   type: 'divider' as const,
    // },
    // {
    //   key: 'help',
    //   icon: <QuestionCircleOutlined />,
    //   label: '帮助文档',
    // },
    // {
    //   key: 'about',
    //   icon: <InfoCircleOutlined />,
    //   label: '关于系统',
    // },
    {
      type: 'divider' as const,
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
    },
  ];

  // 处理管理员菜单点击
  const handleAdminMenuClick = ({ key }: { key: string }) => {
    switch (key) {
      case 'profile':
        // 跳转到个人资料页面
        navigate('/user-profile');
        break;
      case 'settings':
        // 跳转到系统设置页面
        navigate('/system-settings');
        break;
      case 'notifications':
        // 跳转到消息通知页面
        navigate('/notifications');
        break;
      case 'language':
        // 处理语言设置
        console.log('打开语言设置');
        break;
      case 'theme':
        // 处理主题切换
        console.log('切换主题');
        break;
      case 'help':
        // 跳转到帮助文档
        navigate('/user-guide');
        break;
      case 'about':
        // 跳转到关于系统
        navigate('/about-system');
        break;
      case 'logout':
        // 处理退出登录
        localStorage.removeItem('userToken');
        localStorage.removeItem('userName');
        navigate('/login');
        break;
      default:
        break;
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed}
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          height: '100vh',
          zIndex: 1000,
          overflow: 'auto'
        }}
      >
        <div className="logo">
          {collapsed ? '择邻山庄' : '酒店管理平台'}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          defaultSelectedKeys={['/']}
          items={menuItems}
          onClick={({ key }) => {
            navigate(key);
          }}
        />
      </Sider>
      <Layout style={{ marginLeft: collapsed ? 80 : 200, transition: 'margin-left 0.2s' }}>
        <Header style={{ 
          padding: 0, 
          background: colorBgContainer,
          position: 'fixed',
          top: 0,
          right: 0,
          left: collapsed ? 80 : 200,
          zIndex: 999,
          transition: 'left 0.2s',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: '16px',
                width: 64,
                height: 64,
              }}
            />
            <div style={{ fontSize: '18px', fontWeight: 'bold' }}>
              邹城市择邻山庄有限公司智慧酒店管理平台
            </div>
          </div>
          
          {/* 管理员区域 */}
          <div style={{ display: 'flex', alignItems: 'center', marginRight: 24 }}>
            <Space size="middle">
              {/* 实时时间 */}
              <div style={{ 
                fontSize: '14px', 
                color: '#666',
                padding: '8px 12px',
                borderRadius: '6px',
                backgroundColor: '#f5f5f5'
              }}>
                <ClockCircleOutlined style={{ marginRight: 8 }} />
                {new Date().toLocaleString('zh-CN')}
              </div>
              
              {/* 系统状态 */}
              <Button
                type="text"
                icon={<CloudOutlined />}
                style={{
                  fontSize: '16px',
                  width: 40,
                  height: 40,
                }}
                title="系统状态"
              />
              
              {/* 通知图标 */}
              <Button
                type="text"
                icon={<BellOutlined />}
                style={{
                  fontSize: '16px',
                  width: 40,
                  height: 40,
                }}
                title="消息通知"
              />
              
              {/* 帮助按钮 */}
              <Button
                type="text"
                icon={<QuestionCircleOutlined />}
                style={{
                  fontSize: '16px',
                  width: 40,
                  height: 40,
                }}
                title="帮助"
                onClick={() => navigate('/user-guide')}
              />
              
              {/* 管理员头像和下拉菜单 */}
              <Dropdown
                menu={{
                  items: adminMenuItems,
                  onClick: handleAdminMenuClick,
                }}
                placement="bottomRight"
                arrow
              >
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  cursor: 'pointer',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  transition: 'background-color 0.3s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f5f5f5';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
                >
                  <Avatar 
                    size="small" 
                    icon={<UserOutlined />}
                    style={{ marginRight: 8 }}
                  />
                  <Space direction="vertical" size={0} style={{ lineHeight: 1 }}>
                    <Text strong style={{ fontSize: '14px' }}>管理员</Text>
                    <Text type="secondary" style={{ fontSize: '12px' }}>系统管理员</Text>
                  </Space>
                </div>
              </Dropdown>
            </Space>
          </div>
        </Header>
        <Content
          style={{
            margin: '88px 16px 24px',
            padding: 0,
            minHeight: 'calc(100vh - 112px)',
            background: 'transparent',
          }}
        >
          <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/device-monitor" element={<DeviceMonitor />} />
            <Route path="/remote-control" element={<RemoteControl />} />
            <Route path="/fault-warning" element={<FaultWarning />} />
            <Route path="/device-adjustment" element={<DeviceAdjustment />} />
            <Route path="/device-linkage" element={<DeviceLinkage />} />
            <Route path="/operation-analysis" element={<OperationAnalysis />} />
            <Route path="/delivery-robot" element={<DeliveryRobot />} />
            <Route path="/environment-monitor" element={<EnvironmentMonitor />} />
            <Route path="/network-status" element={<NetworkStatus />} />
            <Route path="/staff-management" element={<StaffManagement />} />
            <Route path="/user-guide" element={<UserGuide />} />
            <Route path="/cleaning-robot" element={<CleaningRobot />} />
            <Route path="/security-system" element={<SecuritySystem />} />
            <Route path="/access-control" element={<AccessControl />} />
            <Route path="/performance-report" element={<PerformanceReport />} />
            <Route path="/energy-analysis" element={<EnergyAnalysis />} />
            <Route path="/guest-satisfaction" element={<GuestSatisfaction />} />
            <Route path="/room-management" element={<RoomManagement />} />
            <Route path="/maintenance-schedule" element={<MaintenanceSchedule />} />
            <Route path="/inventory-management" element={<InventoryManagement />} />
            <Route path="/user-management" element={<UserManagement />} />
            <Route path="/role-permissions" element={<RolePermissions />} />
            <Route path="/system-logs" element={<SystemLogs />} />
            <Route path="/backup-restore" element={<BackupRestore />} />
            <Route path="*" element={<Welcome />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <Router basename="/smart-hotel-platform">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/*" element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
};

export default App; 