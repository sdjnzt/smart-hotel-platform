import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Statistic,
  Table,
  Tag,
  Button,
  Space,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  Progress,
  Typography,
  Divider,
  Tooltip,
  Badge,
  Alert,
  Descriptions,
  List,
  Avatar,
  Tabs,
  Switch,
  message,
} from 'antd';
import {
  ThunderboltOutlined,
  DropboxOutlined,
  FireOutlined,
  BarChartOutlined,
  EyeOutlined,
  SettingOutlined,
  ReloadOutlined,
  ExportOutlined,
  LineChartOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ClockCircleOutlined,
  RiseOutlined,
  FallOutlined,
  DollarOutlined,
  CalendarOutlined,
  FileTextOutlined,
  CloudOutlined,
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

interface EnergyConsumption {
  id: string;
  type: 'electricity' | 'water' | 'gas' | 'heating' | 'cooling';
  location: string;
  currentUsage: number;
  lastMonthUsage: number;
  changeRate: number;
  cost: number;
  unit: string;
  status: 'normal' | 'high' | 'warning' | 'critical';
  efficiency: number;
  lastUpdate: string;
}

interface EnergyDevice {
  id: string;
  name: string;
  type: 'lighting' | 'hvac' | 'kitchen' | 'laundry' | 'other';
  location: string;
  power: number;
  currentStatus: 'on' | 'off' | 'standby';
  dailyUsage: number;
  monthlyUsage: number;
  efficiency: number;
  lastMaintenance: string;
  nextMaintenance: string;
}

interface EnergyAlert {
  id: string;
  type: 'high_consumption' | 'device_fault' | 'efficiency_low' | 'cost_overrun';
  severity: 'low' | 'medium' | 'high' | 'critical';
  location: string;
  description: string;
  timestamp: string;
  status: 'active' | 'acknowledged' | 'resolved';
}

const EnergyAnalysis: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [consumption, setConsumption] = useState<EnergyConsumption[]>([]);
  const [devices, setDevices] = useState<EnergyDevice[]>([]);
  const [alerts, setAlerts] = useState<EnergyAlert[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('overview');

  // 模拟数据
  const mockConsumption: EnergyConsumption[] = [
    {
      id: '1',
      type: 'electricity',
      location: '主楼',
      currentUsage: 1250,
      lastMonthUsage: 1180,
      changeRate: 5.9,
      cost: 875,
      unit: 'kWh',
      status: 'normal',
      efficiency: 85,
      lastUpdate: '2025-07-15 14:30:00',
    },
    {
      id: '2',
      type: 'water',
      location: '全酒店',
      currentUsage: 180,
      lastMonthUsage: 175,
      changeRate: 2.9,
      cost: 360,
      unit: 'm³',
      status: 'normal',
      efficiency: 90,
      lastUpdate: '2025-07-15 14:30:00',
    },
    {
      id: '3',
      type: 'gas',
      location: '厨房',
      currentUsage: 85,
      lastMonthUsage: 78,
      changeRate: 9.0,
      cost: 425,
      unit: 'm³',
      status: 'high',
      efficiency: 75,
      lastUpdate: '2025-07-15 14:30:00',
    },
    {
      id: '4',
      type: 'heating',
      location: '客房区',
      currentUsage: 320,
      lastMonthUsage: 350,
      changeRate: -8.6,
      cost: 640,
      unit: 'kWh',
      status: 'normal',
      efficiency: 88,
      lastUpdate: '2025-07-15 14:30:00',
    },
    {
      id: '5',
      type: 'cooling',
      location: '公共区域',
      currentUsage: 450,
      lastMonthUsage: 420,
      changeRate: 7.1,
      cost: 675,
      unit: 'kWh',
      status: 'warning',
      efficiency: 82,
      lastUpdate: '2025-07-15 14:30:00',
    },
  ];

  const mockDevices: EnergyDevice[] = [
    {
      id: '1',
      name: '中央空调-01',
      type: 'hvac',
      location: '1楼大厅',
      power: 15.5,
      currentStatus: 'on',
      dailyUsage: 186,
      monthlyUsage: 5580,
      efficiency: 88,
      lastMaintenance: '2025-07-10',
      nextMaintenance: '2024-02-10',
    },
    {
      id: '2',
      name: '照明系统-01',
      type: 'lighting',
      location: '客房走廊',
      power: 8.2,
      currentStatus: 'on',
      dailyUsage: 98.4,
      monthlyUsage: 2952,
      efficiency: 95,
      lastMaintenance: '2025-07-05',
      nextMaintenance: '2024-02-05',
    },
    {
      id: '3',
      name: '厨房设备-01',
      type: 'kitchen',
      location: '主厨房',
      power: 12.8,
      currentStatus: 'on',
      dailyUsage: 153.6,
      monthlyUsage: 4608,
      efficiency: 78,
      lastMaintenance: '2025-07-08',
      nextMaintenance: '2024-02-08',
    },
    {
      id: '4',
      name: '洗衣设备-01',
      type: 'laundry',
      location: '洗衣房',
      power: 10.5,
      currentStatus: 'standby',
      dailyUsage: 84,
      monthlyUsage: 2520,
      efficiency: 85,
      lastMaintenance: '2025-07-12',
      nextMaintenance: '2024-02-12',
    },
    {
      id: '5',
      name: '电梯系统-01',
      type: 'other',
      location: '主楼',
      power: 6.8,
      currentStatus: 'on',
      dailyUsage: 81.6,
      monthlyUsage: 2448,
      efficiency: 92,
      lastMaintenance: '2025-07-15',
      nextMaintenance: '2024-02-15',
    },
  ];

  const mockAlerts: EnergyAlert[] = [
    {
      id: '1',
      type: 'high_consumption',
      severity: 'medium',
      location: '厨房',
      description: '燃气消耗异常增加，较上月增长9%',
      timestamp: '2025-07-15 14:30:00',
      status: 'active',
    },
    {
      id: '2',
      type: 'efficiency_low',
      severity: 'low',
      location: '公共区域',
      description: '制冷系统效率偏低，建议检查维护',
      timestamp: '2025-07-15 14:25:00',
      status: 'acknowledged',
    },
    {
      id: '3',
      type: 'device_fault',
      severity: 'high',
      location: '中央空调-01',
      description: '设备运行异常，需要立即检查',
      timestamp: '2025-07-15 14:20:00',
      status: 'active',
    },
    {
      id: '4',
      type: 'cost_overrun',
      severity: 'medium',
      location: '全酒店',
      description: '本月能耗成本超出预算5%',
      timestamp: '2025-07-15 14:15:00',
      status: 'resolved',
    },
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setLoading(true);
    // 模拟API调用
    setTimeout(() => {
      setConsumption(mockConsumption);
      setDevices(mockDevices);
      setAlerts(mockAlerts);
      setLoading(false);
    }, 1000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal':
      case 'on':
      case 'resolved':
        return 'green';
      case 'high':
      case 'warning':
      case 'medium':
      case 'acknowledged':
        return 'orange';
      case 'critical':
      case 'high':
      case 'active':
        return 'red';
      case 'off':
      case 'standby':
        return 'default';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'normal':
      case 'on':
        return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
      case 'high':
      case 'warning':
      case 'medium':
        return <ExclamationCircleOutlined style={{ color: '#faad14' }} />;
      case 'critical':
      case 'active':
        return <CloseCircleOutlined style={{ color: '#ff4d4f' }} />;
      case 'off':
      case 'standby':
        return <ClockCircleOutlined style={{ color: '#d9d9d9' }} />;
      default:
        return <ClockCircleOutlined />;
    }
  };

  const getStatusText = (status: string) => {
    const statusMap: { [key: string]: string } = {
      normal: '正常',
      high: '偏高',
      warning: '警告',
      critical: '严重',
      on: '运行中',
      off: '已关闭',
      standby: '待机',
      active: '活跃',
      acknowledged: '已确认',
      resolved: '已解决',
    };
    return statusMap[status] || status;
  };

  const getTypeText = (type: string) => {
    const typeMap: { [key: string]: string } = {
      electricity: '电力',
      water: '用水',
      gas: '燃气',
      heating: '供暖',
      cooling: '制冷',
      lighting: '照明',
      hvac: '空调',
      kitchen: '厨房',
      laundry: '洗衣',
      other: '其他',
    };
    return typeMap[type] || type;
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'electricity':
        return <ThunderboltOutlined />;
      case 'water':
        return <DropboxOutlined />;
      case 'gas':
      case 'heating':
        return <FireOutlined />;
      case 'cooling':
        return <CloudOutlined />;
      default:
        return <BarChartOutlined />;
    }
  };

  const getAlertTypeText = (type: string) => {
    const typeMap: { [key: string]: string } = {
      high_consumption: '高能耗',
      device_fault: '设备故障',
      efficiency_low: '效率低下',
      cost_overrun: '成本超支',
    };
    return typeMap[type] || type;
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low':
        return 'green';
      case 'medium':
        return 'orange';
      case 'high':
        return 'red';
      case 'critical':
        return 'red';
      default:
        return 'default';
    }
  };

  const consumptionColumns = [
    {
      title: '能耗类型',
      key: 'type',
      render: (_: any, record: EnergyConsumption) => (
        <Space>
          <Avatar icon={getTypeIcon(record.type)} />
          <div>
            <div>
              <Text strong>{getTypeText(record.type)}</Text>
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              {record.location}
            </div>
          </div>
        </Space>
      ),
    },
    {
      title: '当前用量',
      dataIndex: 'currentUsage',
      key: 'currentUsage',
      render: (value: number, record: EnergyConsumption) => (
        <Text strong>{value} {record.unit}</Text>
      ),
    },
    {
      title: '变化率',
      dataIndex: 'changeRate',
      key: 'changeRate',
      render: (rate: number) => (
        <Space>
          {rate > 0 ? <RiseOutlined style={{ color: '#ff4d4f' }} /> : <FallOutlined style={{ color: '#52c41a' }} />}
          <Text style={{ color: rate > 0 ? '#ff4d4f' : '#52c41a' }}>
            {rate > 0 ? '+' : ''}{rate}%
          </Text>
        </Space>
      ),
    },
    {
      title: '成本',
      dataIndex: 'cost',
      key: 'cost',
      render: (cost: number) => (
        <Space>
          <DollarOutlined />
          <Text strong>{cost}</Text>
        </Space>
      ),
    },
    {
      title: '效率',
      dataIndex: 'efficiency',
      key: 'efficiency',
      render: (value: number) => (
        <Space direction="vertical" size="small" style={{ width: '100%' }}>
          <Text strong>{value}%</Text>
          <Progress
            percent={value}
            size="small"
            strokeColor={value > 85 ? '#52c41a' : value > 70 ? '#faad14' : '#ff4d4f'}
            showInfo={false}
          />
        </Space>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Space>
          {getStatusIcon(status)}
          <Badge
            status={getStatusColor(status) as any}
            text={getStatusText(status)}
          />
        </Space>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: EnergyConsumption) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetails(record)}
          >
            查看详情
          </Button>
        </Space>
      ),
    },
  ];

  const deviceColumns = [
    {
      title: '设备信息',
      key: 'info',
      render: (_: any, record: EnergyDevice) => (
        <Space>
          <Avatar icon={getTypeIcon(record.type)} />
          <div>
            <div>
              <Text strong>{record.name}</Text>
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              {record.location}
            </div>
          </div>
        </Space>
      ),
    },
    {
      title: '设备类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => <Tag color="blue">{getTypeText(type)}</Tag>,
    },
    {
      title: '功率',
      dataIndex: 'power',
      key: 'power',
      render: (power: number) => <Text>{power} kW</Text>,
    },
    {
      title: '运行状态',
      dataIndex: 'currentStatus',
      key: 'currentStatus',
      render: (status: string) => (
        <Space>
          {getStatusIcon(status)}
          <Badge
            status={getStatusColor(status) as any}
            text={getStatusText(status)}
          />
        </Space>
      ),
    },
    {
      title: '日用量',
      dataIndex: 'dailyUsage',
      key: 'dailyUsage',
      render: (usage: number) => <Text>{usage} kWh</Text>,
    },
    {
      title: '月用量',
      dataIndex: 'monthlyUsage',
      key: 'monthlyUsage',
      render: (usage: number) => <Text>{usage} kWh</Text>,
    },
    {
      title: '效率',
      dataIndex: 'efficiency',
      key: 'efficiency',
      render: (value: number) => (
        <Space direction="vertical" size="small" style={{ width: '100%' }}>
          <Text strong>{value}%</Text>
          <Progress
            percent={value}
            size="small"
            strokeColor={value > 85 ? '#52c41a' : value > 70 ? '#faad14' : '#ff4d4f'}
            showInfo={false}
          />
        </Space>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: EnergyDevice) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetails(record)}
          >
            查看详情
          </Button>
        </Space>
      ),
    },
  ];

  const alertColumns = [
    {
      title: '告警类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => (
        <Space>
          <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />
          <Text>{getAlertTypeText(type)}</Text>
        </Space>
      ),
    },
    {
      title: '位置',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: '严重程度',
      dataIndex: 'severity',
      key: 'severity',
      render: (severity: string) => (
        <Tag color={getSeverityColor(severity)}>
          {severity === 'low' ? '低' : severity === 'medium' ? '中' : severity === 'high' ? '高' : '严重'}
        </Tag>
      ),
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '时间',
      dataIndex: 'timestamp',
      key: 'timestamp',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Badge
          status={getStatusColor(status) as any}
          text={getStatusText(status)}
        />
      ),
    },
  ];

  const handleViewDetails = (record: any) => {
    setSelectedItem(record);
    setDetailsModalVisible(true);
  };

  const handleExport = () => {
    Modal.success({
      title: '导出成功',
      content: '能耗分析数据已成功导出到Excel文件',
    });
  };

  const rowSelection = {
    selectedRowKeys: selectedItems,
    onChange: (selectedRowKeys: React.Key[]) => {
      setSelectedItems(selectedRowKeys as string[]);
    },
  };

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <Title level={2}>
          <ThunderboltOutlined style={{ marginRight: 8 }} />
          能耗分析
        </Title>
        <Text type="secondary">
          监控和分析酒店各项能耗数据，优化能源使用效率
        </Text>
      </div>

      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="总用电量"
              value={consumption.find(c => c.type === 'electricity')?.currentUsage || 0}
              prefix={<ThunderboltOutlined />}
              valueStyle={{ color: '#1890ff' }}
              suffix="kWh"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="总用水量"
              value={consumption.find(c => c.type === 'water')?.currentUsage || 0}
              prefix={<DropboxOutlined />}
              valueStyle={{ color: '#52c41a' }}
              suffix="m³"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="总能耗成本"
              value={consumption.reduce((sum, c) => sum + c.cost, 0)}
              prefix={<DollarOutlined />}
              valueStyle={{ color: '#722ed1' }}
              suffix="元"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="平均效率"
              value={Math.round(consumption.reduce((sum, c) => sum + c.efficiency, 0) / consumption.length)}
              prefix={<BarChartOutlined />}
              valueStyle={{ color: '#fa8c16' }}
              suffix="%"
            />
          </Card>
        </Col>
      </Row>

      {/* 操作工具栏 */}
      <Card style={{ marginBottom: '24px' }}>
        <Space wrap>
          <Button
            type="primary"
            icon={<ReloadOutlined />}
            onClick={loadData}
            loading={loading}
          >
            刷新数据
          </Button>
          <Button
            icon={<CalendarOutlined />}
          >
            选择时间范围
          </Button>
          <Button
            icon={<LineChartOutlined />}
          >
            趋势分析
          </Button>
          <Button
            icon={<ExportOutlined />}
            onClick={handleExport}
          >
            导出报告
          </Button>
        </Space>
      </Card>

      {/* 主要内容区域 */}
      <Card>
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="综合概览" key="overview">
            <Row gutter={16}>
              <Col span={12}>
                <Card title="能耗分布" size="small">
                  <List
                    dataSource={consumption}
                    renderItem={(item) => (
                      <List.Item>
                        <List.Item.Meta
                          avatar={<Avatar icon={getTypeIcon(item.type)} />}
                          title={getTypeText(item.type)}
                          description={item.location}
                        />
                        <div>
                          <Text strong>{item.currentUsage} {item.unit}</Text>
                          <br />
                          <Text type="secondary">¥{item.cost}</Text>
                        </div>
                      </List.Item>
                    )}
                  />
                </Card>
              </Col>
              <Col span={12}>
                <Card title="设备状态" size="small">
                  <List
                    dataSource={devices.slice(0, 5)}
                    renderItem={(item) => (
                      <List.Item>
                        <List.Item.Meta
                          avatar={<Avatar icon={getTypeIcon(item.type)} />}
                          title={item.name}
                          description={item.location}
                        />
                        <div>
                          <Badge
                            status={getStatusColor(item.currentStatus) as any}
                            text={getStatusText(item.currentStatus)}
                          />
                          <br />
                          <Text type="secondary">{item.power} kW</Text>
                        </div>
                      </List.Item>
                    )}
                  />
                </Card>
              </Col>
            </Row>
          </TabPane>
          <TabPane tab="能耗监控" key="consumption">
            <Table
              columns={consumptionColumns}
              dataSource={consumption}
              rowKey="id"
              loading={loading}
              rowSelection={rowSelection}
              pagination={{
                total: consumption.length,
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
              }}
            />
          </TabPane>
          <TabPane tab="设备管理" key="devices">
            <Table
              columns={deviceColumns}
              dataSource={devices}
              rowKey="id"
              loading={loading}
              pagination={{
                total: devices.length,
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
              }}
            />
          </TabPane>
          <TabPane tab="告警信息" key="alerts">
            <Table
              columns={alertColumns}
              dataSource={alerts}
              rowKey="id"
              loading={loading}
              pagination={{
                total: alerts.length,
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
              }}
            />
          </TabPane>
        </Tabs>
      </Card>

      {/* 详情模态框 */}
      <Modal
        title="能耗详情"
        open={detailsModalVisible}
        onCancel={() => setDetailsModalVisible(false)}
        footer={null}
        width={600}
      >
        {selectedItem && (
          <Descriptions bordered column={2}>
            <Descriptions.Item label="名称" span={2}>
              {selectedItem.name || getTypeText(selectedItem.type)}
            </Descriptions.Item>
            <Descriptions.Item label="位置">
              {selectedItem.location}
            </Descriptions.Item>
            <Descriptions.Item label="类型">
              {getTypeText(selectedItem.type)}
            </Descriptions.Item>
            {selectedItem.currentUsage && (
              <Descriptions.Item label="当前用量">
                {selectedItem.currentUsage} {selectedItem.unit}
              </Descriptions.Item>
            )}
            {selectedItem.power && (
              <Descriptions.Item label="功率">
                {selectedItem.power} kW
              </Descriptions.Item>
            )}
            {selectedItem.cost && (
              <Descriptions.Item label="成本">
                ¥{selectedItem.cost}
              </Descriptions.Item>
            )}
            {selectedItem.efficiency && (
              <Descriptions.Item label="效率">
                <Progress percent={selectedItem.efficiency} size="small" />
              </Descriptions.Item>
            )}
            {selectedItem.currentStatus && (
              <Descriptions.Item label="状态">
                <Badge
                  status={getStatusColor(selectedItem.currentStatus) as any}
                  text={getStatusText(selectedItem.currentStatus)}
                />
              </Descriptions.Item>
            )}
            {selectedItem.lastUpdate && (
              <Descriptions.Item label="最后更新">
                {selectedItem.lastUpdate}
              </Descriptions.Item>
            )}
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default EnergyAnalysis; 