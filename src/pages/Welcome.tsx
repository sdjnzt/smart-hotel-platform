import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  Row,
  Col,
  Button,
  Typography,
  Space,
  Divider,
  Statistic,
  Progress,
  Avatar,
  List,
  Tag,
  Carousel,
  Alert,
  Badge,
  Tooltip
} from 'antd';
import {
  HomeOutlined,
  DashboardOutlined,
  MonitorOutlined,
  ControlOutlined,
  WarningOutlined,
  SettingOutlined,
  ApiOutlined,
  BarChartOutlined,
  RocketOutlined,
  StarOutlined,
  TrophyOutlined,
  SafetyOutlined,
  ThunderboltOutlined,
  CloudOutlined,
  HeartOutlined,
  TeamOutlined,
  GlobalOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  FireOutlined,
  WifiOutlined,
  CameraOutlined,
  LockOutlined,
  RobotOutlined,
  CoffeeOutlined,
  BellOutlined,
  EnvironmentOutlined,
  DollarOutlined
} from '@ant-design/icons';
import { hotelDevices, hotelRooms, faultWarnings, deviceLinkages } from '../data/mockData';
import '../styles/welcome.css';

const { Title, Paragraph, Text } = Typography;

const Welcome: React.FC = () => {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [greeting, setGreeting] = useState('');

  // 实时更新时间
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // 根据时间设置问候语
  useEffect(() => {
    const hour = currentTime.getHours();
    if (hour < 6) {
      setGreeting('夜深了，请注意休息');
    } else if (hour < 12) {
      setGreeting('早上好，祝您工作愉快');
    } else if (hour < 18) {
      setGreeting('下午好，继续加油');
    } else {
      setGreeting('晚上好，辛苦了');
    }
  }, [currentTime]);

  // 统计数据
  const totalRooms = hotelRooms.length;
  const occupiedRooms = hotelRooms.filter(r => r.status === 'occupied').length;
  const totalDevices = hotelDevices.length;
  const onlineDevices = hotelDevices.filter(d => d.status === 'online').length;
  const activeWarnings = faultWarnings.filter(w => w.status === 'active').length;
  const enabledLinkages = deviceLinkages.filter(l => l.isEnabled).length;
  const occupancyRate = (occupiedRooms / totalRooms) * 100;
  const deviceUptime = (onlineDevices / totalDevices) * 100;

  // 快速入口
  const quickActions = [
    {
      title: '总览仪表板',
      icon: <DashboardOutlined style={{ fontSize: '24px', color: '#1890ff' }} />,
      description: '查看系统整体运行状态',
      path: '/dashboard',
      color: '#1890ff'
    },
    {
      title: '设备监测',
      icon: <MonitorOutlined style={{ fontSize: '24px', color: '#52c41a' }} />,
      description: '实时监控设备状态',
      path: '/device-monitor',
      color: '#52c41a'
    },
    {
      title: '远程控制',
      icon: <ControlOutlined style={{ fontSize: '24px', color: '#fa8c16' }} />,
      description: '远程控制酒店设备',
      path: '/remote-control',
      color: '#fa8c16'
    },
    {
      title: '故障预警',
      icon: <WarningOutlined style={{ fontSize: '24px', color: '#ff4d4f' }} />,
      description: '查看和处理故障预警',
      path: '/fault-warning',
      color: '#ff4d4f'
    },
    {
      title: '设备联动',
      icon: <ApiOutlined style={{ fontSize: '24px', color: '#722ed1' }} />,
      description: '管理设备联动规则',
      path: '/device-linkage',
      color: '#722ed1'
    },
    {
      title: '运营分析',
      icon: <BarChartOutlined style={{ fontSize: '24px', color: '#13c2c2' }} />,
      description: '查看运营数据分析',
      path: '/operation-analysis',
      color: '#13c2c2'
    },
    {
      title: '送餐机器人',
      icon: <RobotOutlined style={{ fontSize: '24px', color: '#eb2f96' }} />,
      description: '管理送餐机器人状态和任务',
      path: '/delivery-robot',
      color: '#eb2f96'
    }
  ];

  // 系统特色
  const features = [
    {
      icon: <SafetyOutlined />,
      title: '智能安全',
      description: '全方位安全监控，保障客人安全'
    },
    {
      icon: <ThunderboltOutlined />,
      title: '节能环保',
      description: '智能节能系统，降低运营成本'
    },
    {
      icon: <HeartOutlined />,
      title: '贴心服务',
      description: '个性化服务体验，提升客人满意度'
    },
    {
      icon: <TeamOutlined />,
      title: '高效管理',
      description: '智能化管理流程，提高工作效率'
    }
  ];

  // 最新动态
  const recentActivities = [
    {
      time: '2分钟前',
      action: '房间101客人入住场景已执行',
      icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />
    },
    {
      time: '5分钟前',
      action: '房间201空调温度调节至22°C',
      icon: <ThunderboltOutlined style={{ color: '#1890ff' }} />
    },
    {
      time: '10分钟前',
      action: '房间102传感器异常预警已确认',
      icon: <WarningOutlined style={{ color: '#fa8c16' }} />
    },
    {
      time: '15分钟前',
      action: '送餐机器人完成配送任务',
      icon: <RobotOutlined style={{ color: '#722ed1' }} />
    }
  ];

  return (
    <div className="welcome-container">
      {/* 欢迎横幅 */}
      <Card 
        className="welcome-card"
        style={{ marginBottom: 24 }}
      >
        <Row align="middle" justify="space-between">
          <Col>
            <Title level={2} className="gradient-text" style={{ margin: 0 }}>
              {greeting}，欢迎使用智慧酒店管理平台
            </Title>
            <Paragraph style={{ margin: '8px 0 0 0', fontSize: '16px', color: '#666' }}>
              邹城市择邻山庄有限公司 · {currentTime.toLocaleDateString('zh-CN', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                weekday: 'long'
              })} · {currentTime.toLocaleTimeString('zh-CN')}
            </Paragraph>
          </Col>
          <Col>
            <Space size="large">
              <Statistic 
                title="在线设备" 
                value={onlineDevices} 
                suffix={`/ ${totalDevices}`}
                valueStyle={{ color: '#52c41a' }}
                prefix={<WifiOutlined />}
              />
              <Statistic 
                title="入住率" 
                value={occupancyRate.toFixed(1)} 
                suffix="%" 
                valueStyle={{ color: '#1890ff' }}
                prefix={<HomeOutlined />}
              />
              <Statistic 
                title="活跃预警" 
                value={activeWarnings} 
                valueStyle={{ color: activeWarnings > 0 ? '#ff4d4f' : '#52c41a' }}
                prefix={<BellOutlined />}
              />
            </Space>
          </Col>
        </Row>
      </Card>

      {/* 快速入口 */}
      <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
        <Col span={24}>
          <Card 
            title={
              <Space>
                <RocketOutlined style={{ color: '#1890ff' }} />
                <span>快速入口</span>
              </Space>
            }
            className="welcome-card"
          >
            <Row gutter={[16, 16]}>
              {quickActions.map((action, index) => (
                <Col xs={24} sm={12} md={8} lg={6} key={index}>
                  <Card
                    hoverable
                    className="quick-action-card hover-lift"
                    style={{ 
                      textAlign: 'center', 
                      border: `2px solid ${action.color}20`,
                      borderRadius: 12,
                      '--index': index
                    } as React.CSSProperties}
                    onClick={() => navigate(action.path)}
                  >
                    <div style={{ marginBottom: 12 }}>
                      {action.icon}
                    </div>
                    <Title level={5} style={{ margin: '8px 0', color: action.color }}>
                      {action.title}
                    </Title>
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      {action.description}
                    </Text>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>
        </Col>
      </Row>

      {/* 系统状态和特色 */}
      <Row gutter={[24, 24]}>
        {/* 系统状态 */}
        <Col xs={24} lg={12}>
          <Card 
            title={
              <Space>
                <MonitorOutlined style={{ color: '#52c41a' }} />
                <span>系统状态</span>
              </Space>
            }
            className="welcome-card"
            style={{ height: '100%' }}
          >
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <Text>设备在线率</Text>
                  <Text strong>{deviceUptime.toFixed(1)}%</Text>
                </div>
                <Progress 
                  percent={deviceUptime} 
                  strokeColor="#52c41a" 
                  showInfo={false}
                  size="small"
                />
              </div>
              
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <Text>房间入住率</Text>
                  <Text strong>{occupancyRate.toFixed(1)}%</Text>
                </div>
                <Progress 
                  percent={occupancyRate} 
                  strokeColor="#1890ff" 
                  showInfo={false}
                  size="small"
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <Text>联动规则启用</Text>
                  <Text strong>{enabledLinkages}</Text>
                </div>
                <Progress 
                  percent={(enabledLinkages / deviceLinkages.length) * 100} 
                  strokeColor="#722ed1" 
                  showInfo={false}
                  size="small"
                />
              </div>

              <Alert
                message={`当前有 ${activeWarnings} 个活跃预警需要处理`}
                type={activeWarnings > 0 ? 'warning' : 'success'}
                showIcon
                style={{ marginTop: 16 }}
              />
            </Space>
          </Card>
        </Col>

        {/* 系统特色 */}
        <Col xs={24} lg={12}>
          <Card 
            title={
              <Space>
                <StarOutlined style={{ color: '#fa8c16' }} />
                <span>系统特色</span>
              </Space>
            }
            className="welcome-card"
            style={{ height: '100%' }}
          >
            <List
              dataSource={features}
              renderItem={(feature) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Avatar 
                        size="large" 
                        icon={feature.icon}
                        style={{ backgroundColor: '#f0f0f0', color: '#666' }}
                      />
                    }
                    title={<Text strong>{feature.title}</Text>}
                    description={<Text type="secondary">{feature.description}</Text>}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>

      {/* 最新动态 */}
      <Row style={{ marginTop: 24 }}>
        <Col span={24}>
          <Card 
            title={
              <Space>
                <ClockCircleOutlined style={{ color: '#13c2c2' }} />
                <span>最新动态</span>
              </Space>
            }
            className="welcome-card"
          >
            <List
              dataSource={recentActivities}
              renderItem={(activity) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Badge dot color="green">
                        <Avatar size="small" icon={activity.icon} />
                      </Badge>
                    }
                    title={<Text>{activity.action}</Text>}
                    description={<Text type="secondary">{activity.time}</Text>}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>

      {/* 底部信息 */}
      {/*<Row style={{ marginTop: 24 }}>*/}
      {/*  <Col span={24}>*/}
      {/*    <Card */}
      {/*      className="welcome-card"*/}
      {/*      style={{ textAlign: 'center' }}*/}
      {/*    >*/}
      {/*      <Space direction="vertical" size="small">*/}
      {/*        <Text type="secondary">*/}
      {/*          © 2025 邹城市择邻山庄有限公司智慧酒店管理平台*/}
      {/*        </Text>*/}
      {/*        <Space size="large">*/}
      {/*          <Text type="secondary">技术支持：山东金科星机电股份有限公司</Text>*/}
      {/*          <Text type="secondary">版本：v1.0.0</Text>*/}
      {/*        </Space>*/}
      {/*      </Space>*/}
      {/*    </Card>*/}
      {/*  </Col>*/}
      {/*</Row>*/}
    </div>
  );
};

export default Welcome; 