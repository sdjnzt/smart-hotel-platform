import React, { useState, useEffect } from 'react';
import { 
  Row, 
  Col, 
  Card, 
  Statistic, 
  Table, 
  Tag, 
  Progress, 
  Badge, 
  Typography, 
  Space, 
  Timeline,
  Alert,
  Tabs,
  Button,
  Tooltip,
  List,
  Modal,
  Switch
} from 'antd';
import { 
  DashboardOutlined,
  MonitorOutlined,
  ThunderboltOutlined,
  TrophyOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  CloseCircleOutlined,
  HomeOutlined,
  ApiOutlined,
  SettingOutlined,
  EyeOutlined,
  BellOutlined
} from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import { hotelDevices, hotelRooms, faultWarnings, deviceLinkages, operationData, HotelDevice, HotelRoom, FaultWarning } from '../data/mockData';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const Dashboard: React.FC = () => {
  const [devices] = useState<HotelDevice[]>(hotelDevices);
  const [rooms] = useState<HotelRoom[]>(hotelRooms);
  const [warnings] = useState<FaultWarning[]>(faultWarnings);
  const [realTimeData, setRealTimeData] = useState({
    temperature: 22.5,
    humidity: 45,
    energyConsumption: 1580,
    onlineDevices: devices.filter(d => d.status === 'online').length
  });

  // 实时数据更新
  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeData(prev => ({
        ...prev,
        temperature: Math.max(20, Math.min(26, prev.temperature + (Math.random() - 0.5) * 0.5)),
        humidity: Math.max(40, Math.min(60, prev.humidity + (Math.random() - 0.5) * 2)),
        energyConsumption: Math.round(Math.max(1400, Math.min(1800, 1580 + (Math.random() - 0.5) * 100))),
        onlineDevices: devices.filter(d => d.status === 'online').length + Math.floor((Math.random() - 0.5) * 2)
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, [devices]);

  // 统计数据
  const totalRooms = rooms.length;
  const occupiedRooms = rooms.filter(r => r.status === 'occupied').length;
  const totalDevices = devices.length;
  const onlineDevices = devices.filter(d => d.status === 'online').length;
  const warningDevices = devices.filter(d => d.status === 'warning' || d.status === 'error').length;
  const activeWarnings = warnings.filter(w => w.status === 'active').length;
  const enabledLinkages = deviceLinkages.filter(l => l.isEnabled).length;
  const todayEnergyConsumption = operationData[operationData.length - 1]?.energyConsumption || 0;
  const occupancyRate = (occupiedRooms / totalRooms) * 100;
  const deviceUptime = (onlineDevices / totalDevices) * 100;
  
  // 房间状态分布图
  const roomStatusData = [
    { type: '已入住', value: rooms.filter(r => r.status === 'occupied').length, color: '#52c41a' },
    { type: '待清洁', value: rooms.filter(r => r.status === 'vacant_dirty').length, color: '#faad14' },
    { type: '可入住', value: rooms.filter(r => r.status === 'vacant_clean').length, color: '#1890ff' },
    { type: '维修中', value: rooms.filter(r => r.status === 'out_of_order').length, color: '#f5222d' }
  ];

  const roomStatusOption = {
    title: {
      text: '房间状态分布',
      left: 'center'
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    series: [{
      name: '房间状态',
      type: 'pie',
      radius: '60%',
      data: roomStatusData,
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }]
  };

  // 能耗趋势图
  const energyTrendOption = {
    title: {
      text: '7日能耗趋势',
      left: 'left'
    },
    tooltip: {
      trigger: 'axis',
      formatter: '{b}<br/>能耗: {c} kWh'
    },
    xAxis: {
      type: 'category',
      data: operationData.map(d => d.date.slice(5))
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: '{value} kWh'
      }
    },
    series: [{
      data: operationData.map(d => d.energyConsumption),
      type: 'line',
      smooth: true,
      areaStyle: {
        opacity: 0.3,
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [{
            offset: 0, color: '#1890ff'
          }, {
            offset: 1, color: 'rgba(24, 144, 255, 0.1)'
          }]
        }
      },
      lineStyle: {
        color: '#1890ff'
      }
    }]
  };

  // 设备分类统计
  const deviceCategoryData = [
    { category: '暖通空调', count: devices.filter(d => d.category === 'hvac').length },
    { category: '照明系统', count: devices.filter(d => d.category === 'lighting').length },
    { category: '安防系统', count: devices.filter(d => d.category === 'security').length },
    { category: '娱乐设备', count: devices.filter(d => d.category === 'entertainment').length },
    { category: '舒适设备', count: devices.filter(d => d.category === 'comfort').length }
  ];

  const deviceCategoryOption = {
    title: {
      text: '设备分类统计',
      left: 'center'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    xAxis: {
      type: 'category',
      data: deviceCategoryData.map(d => d.category),
      axisLabel: {
        rotate: 45
      }
    },
    yAxis: {
      type: 'value'
    },
    series: [{
      data: deviceCategoryData.map(d => d.count),
      type: 'bar',
      itemStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [{
            offset: 0, color: '#40a9ff'
          }, {
            offset: 1, color: '#1890ff'
          }]
        }
      }
    }]
  };

  // 获取状态标签
  const getStatusTag = (status: string) => {
    const statusConfig = {
      online: { color: 'green', text: '在线' },
      offline: { color: 'red', text: '离线' },
      warning: { color: 'orange', text: '警告' },
      error: { color: 'red', text: '故障' }
    };
    const config = statusConfig[status as keyof typeof statusConfig];
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  // 最新警告表格列
  const warningColumns = [
    {
      title: '设备',
      dataIndex: 'deviceName',
      key: 'deviceName',
      width: 150,
      ellipsis: true
    },
    {
      title: '房间',
      dataIndex: 'roomNumber',
      key: 'roomNumber',
      width: 80
    },
    {
      title: '类型',
      dataIndex: 'warningType',
      key: 'warningType',
      width: 100,
      render: (type: string) => {
        const typeNames = {
          temperature_abnormal: '温度异常',
          power_failure: '电源故障',
          sensor_error: '传感器错误',
          maintenance_due: '维护到期',
          energy_overconsumption: '能耗过高'
        };
        return typeNames[type as keyof typeof typeNames] || type;
      }
    },
    {
      title: '严重程度',
      dataIndex: 'severity',
      key: 'severity',
      width: 100,
      render: (severity: string) => {
        const colors = { critical: 'red', high: 'orange', medium: 'yellow', low: 'blue' };
        return <Tag color={colors[severity as keyof typeof colors]}>{severity}</Tag>;
      }
    },
    {
      title: '时间',
      dataIndex: 'timestamp',
      key: 'timestamp',
      width: 120
    }
  ];

  return (
    <div style={{ padding: '0 16px' }}>
      {/* 关键指标卡片 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="房间入住率"
              value={occupancyRate.toFixed(1)}
              precision={1}
              suffix="%"
              prefix={<HomeOutlined />}
              valueStyle={{ color: occupancyRate > 70 ? '#3f8600' : '#cf1322' }}
            />
            <Progress 
              percent={occupancyRate} 
              showInfo={false} 
              strokeColor={occupancyRate > 70 ? '#3f8600' : '#cf1322'}
            />
            </Card>
          </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="设备在线率"
              value={deviceUptime.toFixed(1)}
              precision={1}
              suffix="%"
              prefix={<MonitorOutlined />}
              valueStyle={{ color: deviceUptime > 95 ? '#3f8600' : '#fa8c16' }}
            />
              <Progress
              percent={deviceUptime} 
              showInfo={false} 
              strokeColor={deviceUptime > 95 ? '#3f8600' : '#fa8c16'}
            />
          </Card>
                  </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="当日能耗"
              value={realTimeData.energyConsumption}
              precision={0}
              suffix="kWh"
              prefix={<ThunderboltOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
            <div style={{ fontSize: '12px', color: '#666', marginTop: 8 }}>
              较昨日 -12.5%
                    </div>
          </Card>
                  </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="活跃警告"
              value={activeWarnings}
              prefix={<WarningOutlined />}
              valueStyle={{ color: activeWarnings > 0 ? '#cf1322' : '#3f8600' }}
            />
            <div style={{ fontSize: '12px', color: '#666', marginTop: 8 }}>
              {warningDevices} 台设备异常
            </div>
          </Card>
        </Col>
      </Row>

      {/* 实时监控卡片 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card title="环境监控" size="small">
            <Space direction="vertical" style={{ width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>平均温度</span>
                <Text strong>{realTimeData.temperature.toFixed(1)}°C</Text>
                      </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>平均湿度</span>
                <Text strong>{realTimeData.humidity.toFixed(0)}%</Text>
                      </div>
            </Space>
          </Card>
        </Col>
        <Col span={6}>
          <Card title="设备状态" size="small">
            <Space direction="vertical" style={{ width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>在线设备</span>
                <Badge count={onlineDevices} showZero color="green" />
                    </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>异常设备</span>
                <Badge count={warningDevices} showZero color="red" />
                    </div>
            </Space>
          </Card>
        </Col>
        <Col span={6}>
          <Card title="联动规则" size="small">
            <Space direction="vertical" style={{ width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>启用规则</span>
                <Text strong>{enabledLinkages}</Text>
                  </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>总规则数</span>
                <Text strong>{deviceLinkages.length}</Text>
              </div>
            </Space>
          </Card>
        </Col>
        <Col span={6}>
          <Card title="系统状态" size="small">
            <Space direction="vertical" style={{ width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>系统状态</span>
                <Badge status="processing" text="正常运行" />
                  </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>最后更新</span>
                <Text type="secondary">刚刚</Text>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>

      {/* 图表分析 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={8}>
          <Card title="房间状态分布">
            <ReactECharts option={roomStatusOption} style={{ height: 300 }} />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="能耗趋势">
            <ReactECharts option={energyTrendOption} style={{ height: 300 }} />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="设备分类统计">
            <ReactECharts option={deviceCategoryOption} style={{ height: 300 }} />
          </Card>
        </Col>
      </Row>

      {/* 详细信息 */}
      <Row gutter={16}>
        <Col span={12}>
          <Card title="最新警告" extra={<Button type="link" icon={<EyeOutlined />}>查看全部</Button>}>
            <Table
              columns={warningColumns}
              dataSource={warnings.slice(0, 5)}
              rowKey="id"
              pagination={false}
                   size="small"
                 />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="系统动态">
            <Timeline
              items={[
                {
                  color: 'green',
                  children: (
                      <div>
                      <div style={{ fontWeight: 'bold' }}>设备联动执行</div>
                      <div style={{ color: '#666', fontSize: '12px' }}>
                        房间101客人入住场景已执行 • 2分钟前
                        </div>
                      </div>
                  )
                },
                {
                  color: 'blue',
                  children: (
                    <div>
                      <div style={{ fontWeight: 'bold' }}>设备状态更新</div>
                      <div style={{ color: '#666', fontSize: '12px' }}>
                        房间201空调温度调节至22°C • 5分钟前
                      </div>
                    </div>
                  )
                },
                {
                  color: 'orange',
                  children: (
                      <div>
                      <div style={{ fontWeight: 'bold' }}>预警处理</div>
                      <div style={{ color: '#666', fontSize: '12px' }}>
                        房间102传感器异常预警已确认 • 10分钟前
                      </div>
                    </div>
                  )
                },
                {
                  color: 'red',
                  children: (
                  <div>
                      <div style={{ fontWeight: 'bold' }}>设备故障</div>
                      <div style={{ color: '#666', fontSize: '12px' }}>
                        房间102环境传感器连接断开 • 15分钟前
                  </div>
                    </div>
                  )
                }
              ]}
            />
                </Card>
              </Col>
            </Row>
    </div>
  );
};

export default Dashboard; 