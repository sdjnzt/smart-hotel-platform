import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Statistic,
  Progress,
  Table,
  Tag,
  Button,
  Space,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  Alert,
  Typography,
  Divider,
  Tooltip,
  Badge,
} from 'antd';
import {
  CloudOutlined,
  SunOutlined,
  EyeOutlined,
  SettingOutlined,
  ReloadOutlined,
  ExportOutlined,
  BellOutlined,
  LineChartOutlined,
  EnvironmentOutlined,
  AlertOutlined,
  FireOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

interface EnvironmentData {
  id: string;
  location: string;
  temperature: number;
  humidity: number;
  airQuality: number;
  lightIntensity: number;
  noiseLevel: number;
  status: 'normal' | 'warning' | 'danger';
  lastUpdate: string;
}

const EnvironmentMonitor: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<EnvironmentData[]>([]);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);
  const [alertModalVisible, setAlertModalVisible] = useState(false);
  const [chartModalVisible, setChartModalVisible] = useState(false);

  // 模拟数据
  const mockData: EnvironmentData[] = [
    {
      id: '1',
      location: '大堂',
      temperature: 24.5,
      humidity: 65,
      airQuality: 85,
      lightIntensity: 1200,
      noiseLevel: 45,
      status: 'normal',
      lastUpdate: '2024-01-15 14:30:00',
    },
    {
      id: '2',
      location: '餐厅',
      temperature: 26.2,
      humidity: 58,
      airQuality: 92,
      lightIntensity: 800,
      noiseLevel: 52,
      status: 'normal',
      lastUpdate: '2024-01-15 14:30:00',
    },
    {
      id: '3',
      location: '客房楼层',
      temperature: 23.8,
      humidity: 62,
      airQuality: 78,
      lightIntensity: 600,
      noiseLevel: 38,
      status: 'warning',
      lastUpdate: '2024-01-15 14:30:00',
    },
    {
      id: '4',
      location: '会议室',
      temperature: 25.1,
      humidity: 55,
      airQuality: 88,
      lightIntensity: 1000,
      noiseLevel: 42,
      status: 'normal',
      lastUpdate: '2024-01-15 14:30:00',
    },
    {
      id: '5',
      location: '健身房',
      temperature: 22.5,
      humidity: 70,
      airQuality: 75,
      lightIntensity: 900,
      noiseLevel: 48,
      status: 'normal',
      lastUpdate: '2024-01-15 14:30:00',
    },
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setLoading(true);
    // 模拟API调用
    setTimeout(() => {
      setData(mockData);
      setLoading(false);
    }, 1000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal':
        return 'green';
      case 'warning':
        return 'orange';
      case 'danger':
        return 'red';
      default:
        return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'normal':
        return '正常';
      case 'warning':
        return '警告';
      case 'danger':
        return '危险';
      default:
        return '未知';
    }
  };

  const getAirQualityLevel = (value: number) => {
    if (value >= 90) return { level: '优', color: 'green' };
    if (value >= 80) return { level: '良', color: 'blue' };
    if (value >= 70) return { level: '一般', color: 'orange' };
    return { level: '差', color: 'red' };
  };

  const columns = [
    {
      title: '监测点',
      dataIndex: 'location',
      key: 'location',
      render: (text: string) => (
        <Space>
          <EnvironmentOutlined />
          {text}
        </Space>
      ),
    },
    {
      title: '温度 (°C)',
      dataIndex: 'temperature',
      key: 'temperature',
      render: (value: number) => (
        <Space>
          <FireOutlined style={{ color: '#ff4d4f' }} />
          <Text strong>{value}</Text>
        </Space>
      ),
    },
    {
      title: '湿度 (%)',
      dataIndex: 'humidity',
      key: 'humidity',
      render: (value: number) => (
        <Space>
          <CloudOutlined style={{ color: '#1890ff' }} />
          <Text strong>{value}</Text>
        </Space>
      ),
    },
    {
      title: '空气质量',
      dataIndex: 'airQuality',
      key: 'airQuality',
      render: (value: number) => {
        const { level, color } = getAirQualityLevel(value);
        return (
          <Space>
            <Tag color={color}>{level}</Tag>
            <Text strong>{value}</Text>
          </Space>
        );
      },
    },
    {
      title: '光照 (lux)',
      dataIndex: 'lightIntensity',
      key: 'lightIntensity',
      render: (value: number) => (
        <Space>
          <SunOutlined style={{ color: '#faad14' }} />
          <Text strong>{value}</Text>
        </Space>
      ),
    },
    {
      title: '噪音 (dB)',
      dataIndex: 'noiseLevel',
      key: 'noiseLevel',
      render: (value: number) => (
        <Space>
          <ThunderboltOutlined style={{ color: '#52c41a' }} />
          <Text strong>{value}</Text>
        </Space>
      ),
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
    {
      title: '最后更新',
      dataIndex: 'lastUpdate',
      key: 'lastUpdate',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: EnvironmentData) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetails(record)}
          >
            详情
          </Button>
          <Button
            type="link"
            size="small"
            icon={<SettingOutlined />}
            onClick={() => handleSettings(record)}
          >
            设置
          </Button>
        </Space>
      ),
    },
  ];

  const handleViewDetails = (record: EnvironmentData) => {
    Modal.info({
      title: `${record.location}环境详情`,
      width: 600,
      content: (
        <div>
          <Row gutter={16}>
            <Col span={12}>
              <Card size="small" title="温度监测">
                <Statistic
                  title="当前温度"
                  value={record.temperature}
                  suffix="°C"
                  valueStyle={{ color: '#ff4d4f' }}
                />
                <Progress
                  percent={Math.min((record.temperature / 30) * 100, 100)}
                  strokeColor="#ff4d4f"
                  showInfo={false}
                />
              </Card>
            </Col>
            <Col span={12}>
              <Card size="small" title="湿度监测">
                <Statistic
                  title="当前湿度"
                  value={record.humidity}
                  suffix="%"
                  valueStyle={{ color: '#1890ff' }}
                />
                <Progress
                  percent={record.humidity}
                  strokeColor="#1890ff"
                  showInfo={false}
                />
              </Card>
            </Col>
          </Row>
          <Row gutter={16} style={{ marginTop: 16 }}>
            <Col span={12}>
              <Card size="small" title="空气质量">
                <Statistic
                  title="AQI指数"
                  value={record.airQuality}
                  valueStyle={{ color: '#52c41a' }}
                />
                <Tag color={getAirQualityLevel(record.airQuality).color}>
                  {getAirQualityLevel(record.airQuality).level}
                </Tag>
              </Card>
            </Col>
            <Col span={12}>
              <Card size="small" title="光照强度">
                <Statistic
                  title="当前光照"
                  value={record.lightIntensity}
                  suffix="lux"
                  valueStyle={{ color: '#faad14' }}
                />
              </Card>
            </Col>
          </Row>
        </div>
      ),
    });
  };

  const handleSettings = (record: EnvironmentData) => {
    setSettingsModalVisible(true);
  };

  const handleAlertSettings = () => {
    setAlertModalVisible(true);
  };

  const handleDataAnalysis = () => {
    setChartModalVisible(true);
  };

  const handleExport = () => {
    Modal.success({
      title: '导出成功',
      content: '环境监测数据已成功导出到Excel文件',
    });
  };

  const handleBatchOperation = () => {
    if (selectedRows.length === 0) {
      Modal.warning({
        title: '提示',
        content: '请先选择要操作的监测点',
      });
      return;
    }
    Modal.info({
      title: '批量操作',
      content: `已选择 ${selectedRows.length} 个监测点进行批量操作`,
    });
  };

  const rowSelection = {
    selectedRowKeys: selectedRows,
    onChange: (selectedRowKeys: React.Key[]) => {
      setSelectedRows(selectedRowKeys as string[]);
    },
  };

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <Title level={2}>
          <EnvironmentOutlined style={{ marginRight: 8 }} />
          环境监测
        </Title>
        <Text type="secondary">
          实时监测酒店各区域的环境参数，确保舒适的住宿环境
        </Text>
      </div>

      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="监测点总数"
              value={data.length}
              prefix={<EnvironmentOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="正常状态"
              value={data.filter(item => item.status === 'normal').length}
              prefix={<Badge status="success" />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="警告状态"
              value={data.filter(item => item.status === 'warning').length}
              prefix={<Badge status="warning" />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="危险状态"
              value={data.filter(item => item.status === 'danger').length}
              prefix={<Badge status="error" />}
              valueStyle={{ color: '#ff4d4f' }}
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
            icon={<AlertOutlined />}
            onClick={handleAlertSettings}
          >
            告警设置
          </Button>
          <Button
            icon={<LineChartOutlined />}
            onClick={handleDataAnalysis}
          >
            数据分析
          </Button>
          <Button
            icon={<ExportOutlined />}
            onClick={handleExport}
          >
            导出数据
          </Button>
          {selectedRows.length > 0 && (
            <Button
              type="default"
              onClick={handleBatchOperation}
            >
              批量操作 ({selectedRows.length})
            </Button>
          )}
        </Space>
      </Card>

      {/* 数据表格 */}
      <Card>
        <Table
          columns={columns}
          dataSource={data}
          rowKey="id"
          loading={loading}
          rowSelection={rowSelection}
          pagination={{
            total: data.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
          }}
        />
      </Card>

      {/* 告警设置模态框 */}
      <Modal
        title="告警设置"
        open={alertModalVisible}
        onCancel={() => setAlertModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setAlertModalVisible(false)}>
            取消
          </Button>,
          <Button key="submit" type="primary">
            保存设置
          </Button>,
        ]}
        width={600}
      >
        <Form layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="温度告警范围">
                <Input.Group compact>
                  <Input placeholder="最小值" style={{ width: '50%' }} />
                  <Input placeholder="最大值" style={{ width: '50%' }} />
                </Input.Group>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="湿度告警范围">
                <Input.Group compact>
                  <Input placeholder="最小值" style={{ width: '50%' }} />
                  <Input placeholder="最大值" style={{ width: '50%' }} />
                </Input.Group>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="空气质量告警阈值">
                <Input placeholder="低于此值告警" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="噪音告警阈值">
                <Input placeholder="高于此值告警" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="告警通知方式">
            <Select mode="multiple" placeholder="选择通知方式">
              <Select.Option value="email">邮件</Select.Option>
              <Select.Option value="sms">短信</Select.Option>
              <Select.Option value="app">APP推送</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* 数据分析模态框 */}
      <Modal
        title="环境数据分析"
        open={chartModalVisible}
        onCancel={() => setChartModalVisible(false)}
        footer={null}
        width={800}
      >
        <div style={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Text type="secondary">环境数据趋势图表将在这里显示</Text>
        </div>
      </Modal>

      {/* 设置模态框 */}
      <Modal
        title="监测点设置"
        open={settingsModalVisible}
        onCancel={() => setSettingsModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setSettingsModalVisible(false)}>
            取消
          </Button>,
          <Button key="submit" type="primary">
            保存设置
          </Button>,
        ]}
      >
        <Form layout="vertical">
          <Form.Item label="监测频率">
            <Select defaultValue="5min">
              <Select.Option value="1min">1分钟</Select.Option>
              <Select.Option value="5min">5分钟</Select.Option>
              <Select.Option value="10min">10分钟</Select.Option>
              <Select.Option value="30min">30分钟</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="数据保留时间">
            <Select defaultValue="30days">
              <Select.Option value="7days">7天</Select.Option>
              <Select.Option value="30days">30天</Select.Option>
              <Select.Option value="90days">90天</Select.Option>
              <Select.Option value="1year">1年</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default EnvironmentMonitor; 