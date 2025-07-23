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
  Alert,
  Typography,
  Divider,
  Tooltip,
  Badge,
  Descriptions,
} from 'antd';
import {
  WifiOutlined,
  CloudOutlined,
  EyeOutlined,
  SettingOutlined,
  ReloadOutlined,
  ExportOutlined,
  LineChartOutlined,
  AlertOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  ThunderboltOutlined,
  GlobalOutlined,
  ApiOutlined,
} from '@ant-design/icons';

const { Title, Text } = Typography;

interface NetworkDevice {
  id: string;
  name: string;
  type: 'router' | 'switch' | 'ap' | 'server';
  ip: string;
  status: 'online' | 'offline' | 'warning';
  bandwidth: number;
  latency: number;
  packetLoss: number;
  uptime: string;
  lastUpdate: string;
}

interface NetworkConnection {
  id: string;
  source: string;
  destination: string;
  bandwidth: number;
  latency: number;
  status: 'active' | 'inactive' | 'error';
  protocol: string;
  lastUpdate: string;
}

const NetworkStatus: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [devices, setDevices] = useState<NetworkDevice[]>([]);
  const [connections, setConnections] = useState<NetworkConnection[]>([]);
  const [selectedDevices, setSelectedDevices] = useState<string[]>([]);
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<NetworkDevice | null>(null);

  // 模拟数据
  const mockDevices: NetworkDevice[] = [
    {
      id: '1',
      name: '主路由器',
      type: 'router',
      ip: '192.168.1.1',
      status: 'online',
      bandwidth: 85,
      latency: 12,
      packetLoss: 0.1,
      uptime: '15天 8小时 32分钟',
      lastUpdate: '2025-07-23 14:30:00',
    },
    {
      id: '2',
      name: '核心交换机',
      type: 'switch',
      ip: '192.168.1.10',
      status: 'online',
      bandwidth: 92,
      latency: 8,
      packetLoss: 0.05,
      uptime: '12天 16小时 45分钟',
      lastUpdate: '2025-07-23 14:30:00',
    },
    {
      id: '3',
      name: '大堂WiFi AP',
      type: 'ap',
      ip: '192.168.1.20',
      status: 'warning',
      bandwidth: 65,
      latency: 25,
      packetLoss: 2.1,
      uptime: '8天 12小时 18分钟',
      lastUpdate: '2025-07-23 14:30:00',
    },
    {
      id: '4',
      name: '客房WiFi AP',
      type: 'ap',
      ip: '192.168.1.21',
      status: 'online',
      bandwidth: 78,
      latency: 15,
      packetLoss: 0.8,
      uptime: '10天 6小时 52分钟',
      lastUpdate: '2025-07-23 14:30:00',
    },
    {
      id: '5',
      name: '应用服务器',
      type: 'server',
      ip: '192.168.1.100',
      status: 'online',
      bandwidth: 45,
      latency: 5,
      packetLoss: 0.02,
      uptime: '20天 4小时 15分钟',
      lastUpdate: '2025-07-23 14:30:00',
    },
  ];

  const mockConnections: NetworkConnection[] = [
    {
      id: '1',
      source: '主路由器',
      destination: '核心交换机',
      bandwidth: 85,
      latency: 12,
      status: 'active',
      protocol: 'Ethernet',
      lastUpdate: '2025-07-23 14:30:00',
    },
    {
      id: '2',
      source: '核心交换机',
      destination: '大堂WiFi AP',
      bandwidth: 65,
      latency: 25,
      status: 'active',
      protocol: 'WiFi 6',
      lastUpdate: '2025-07-23 14:30:00',
    },
    {
      id: '3',
      source: '核心交换机',
      destination: '客房WiFi AP',
      bandwidth: 78,
      latency: 15,
      status: 'active',
      protocol: 'WiFi 6',
      lastUpdate: '2025-07-23 14:30:00',
    },
    {
      id: '4',
      source: '核心交换机',
      destination: '应用服务器',
      bandwidth: 45,
      latency: 5,
      status: 'active',
      protocol: 'Ethernet',
      lastUpdate: '2025-07-23 14:30:00',
    },
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setLoading(true);
    // 模拟API调用
    setTimeout(() => {
      setDevices(mockDevices);
      setConnections(mockConnections);
      setLoading(false);
    }, 1000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
      case 'active':
        return 'green';
      case 'warning':
        return 'orange';
      case 'offline':
      case 'inactive':
      case 'error':
        return 'red';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
      case 'active':
        return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
      case 'warning':
        return <ExclamationCircleOutlined style={{ color: '#faad14' }} />;
      case 'offline':
      case 'inactive':
      case 'error':
        return <CloseCircleOutlined style={{ color: '#ff4d4f' }} />;
      default:
        return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'online':
        return '在线';
      case 'offline':
        return '离线';
      case 'warning':
        return '警告';
      case 'active':
        return '活跃';
      case 'inactive':
        return '非活跃';
      case 'error':
        return '错误';
      default:
        return '未知';
    }
  };

  const getDeviceTypeText = (type: string) => {
    switch (type) {
      case 'router':
        return '路由器';
      case 'switch':
        return '交换机';
      case 'ap':
        return '无线AP';
      case 'server':
        return '服务器';
      default:
        return '未知';
    }
  };

  const deviceColumns = [
    {
      title: '设备名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: NetworkDevice) => (
        <Space>
          {getStatusIcon(record.status)}
          <Text strong>{text}</Text>
        </Space>
      ),
    },
    {
      title: '设备类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => (
        <Tag color="blue">{getDeviceTypeText(type)}</Tag>
      ),
    },
    {
      title: 'IP地址',
      dataIndex: 'ip',
      key: 'ip',
      render: (text: string) => (
        <Text code>{text}</Text>
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
      title: '带宽使用率',
      dataIndex: 'bandwidth',
      key: 'bandwidth',
      render: (value: number) => (
        <Space direction="vertical" size="small" style={{ width: '100%' }}>
          <Text strong>{value}%</Text>
          <Progress
            percent={value}
            size="small"
            strokeColor={value > 80 ? '#ff4d4f' : value > 60 ? '#faad14' : '#52c41a'}
            showInfo={false}
          />
        </Space>
      ),
    },
    {
      title: '延迟 (ms)',
      dataIndex: 'latency',
      key: 'latency',
      render: (value: number) => (
        <Text strong style={{ color: value > 20 ? '#ff4d4f' : value > 10 ? '#faad14' : '#52c41a' }}>
          {value}
        </Text>
      ),
    },
    {
      title: '丢包率 (%)',
      dataIndex: 'packetLoss',
      key: 'packetLoss',
      render: (value: number) => (
        <Text strong style={{ color: value > 1 ? '#ff4d4f' : value > 0.5 ? '#faad14' : '#52c41a' }}>
          {value}
        </Text>
      ),
    },
    {
      title: '运行时间',
      dataIndex: 'uptime',
      key: 'uptime',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: NetworkDevice) => (
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

  const connectionColumns = [
    {
      title: '源设备',
      dataIndex: 'source',
      key: 'source',
    },
    {
      title: '目标设备',
      dataIndex: 'destination',
      key: 'destination',
    },
    {
      title: '协议',
      dataIndex: 'protocol',
      key: 'protocol',
      render: (text: string) => (
        <Tag color="purple">{text}</Tag>
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
      title: '带宽使用率',
      dataIndex: 'bandwidth',
      key: 'bandwidth',
      render: (value: number) => (
        <Space direction="vertical" size="small" style={{ width: '100%' }}>
          <Text strong>{value}%</Text>
          <Progress
            percent={value}
            size="small"
            strokeColor={value > 80 ? '#ff4d4f' : value > 60 ? '#faad14' : '#52c41a'}
            showInfo={false}
          />
        </Space>
      ),
    },
    {
      title: '延迟 (ms)',
      dataIndex: 'latency',
      key: 'latency',
      render: (value: number) => (
        <Text strong style={{ color: value > 20 ? '#ff4d4f' : value > 10 ? '#faad14' : '#52c41a' }}>
          {value}
        </Text>
      ),
    },
  ];

  const handleViewDetails = (record: NetworkDevice) => {
    setSelectedDevice(record);
    setDetailsModalVisible(true);
  };

  const handleSettings = (record: NetworkDevice) => {
    setSettingsModalVisible(true);
  };

  const handleDataAnalysis = () => {
    Modal.info({
      title: '网络数据分析',
      content: '网络性能趋势图表将在这里显示',
      width: 600,
    });
  };

  const handleExport = () => {
    Modal.success({
      title: '导出成功',
      content: '网络状态数据已成功导出到Excel文件',
    });
  };

  const handleBatchOperation = () => {
    if (selectedDevices.length === 0) {
      Modal.warning({
        title: '提示',
        content: '请先选择要操作的设备',
      });
      return;
    }
    Modal.info({
      title: '批量操作',
      content: `已选择 ${selectedDevices.length} 个设备进行批量操作`,
    });
  };

  const deviceRowSelection = {
    selectedRowKeys: selectedDevices,
    onChange: (selectedRowKeys: React.Key[]) => {
      setSelectedDevices(selectedRowKeys as string[]);
    },
  };

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <Title level={2}>
          <WifiOutlined style={{ marginRight: 8 }} />
          网络状态监测
        </Title>
        <Text type="secondary">
          实时监测网络设备状态和连接质量，确保网络稳定运行
        </Text>
      </div>

      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="网络设备总数"
              value={devices.length}
              prefix={<WifiOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="在线设备"
              value={devices.filter(item => item.status === 'online').length}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="警告设备"
              value={devices.filter(item => item.status === 'warning').length}
              prefix={<ExclamationCircleOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="离线设备"
              value={devices.filter(item => item.status === 'offline').length}
              prefix={<CloseCircleOutlined />}
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
          {selectedDevices.length > 0 && (
            <Button
              type="default"
              onClick={handleBatchOperation}
            >
              批量操作 ({selectedDevices.length})
            </Button>
          )}
        </Space>
      </Card>

      {/* 网络设备表格 */}
      <Card title="网络设备状态" style={{ marginBottom: '24px' }}>
        <Table
          columns={deviceColumns}
          dataSource={devices}
          rowKey="id"
          loading={loading}
          rowSelection={deviceRowSelection}
          pagination={{
            total: devices.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
          }}
        />
      </Card>

      {/* 网络连接表格 */}
      <Card title="网络连接状态">
        <Table
          columns={connectionColumns}
          dataSource={connections}
          rowKey="id"
          loading={loading}
          pagination={{
            total: connections.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
          }}
        />
      </Card>

      {/* 设备详情模态框 */}
      <Modal
        title="设备详情"
        open={detailsModalVisible}
        onCancel={() => setDetailsModalVisible(false)}
        footer={null}
        width={600}
      >
        {selectedDevice && (
          <Descriptions bordered column={2}>
            <Descriptions.Item label="设备名称" span={2}>
              {selectedDevice.name}
            </Descriptions.Item>
            <Descriptions.Item label="设备类型">
              {getDeviceTypeText(selectedDevice.type)}
            </Descriptions.Item>
            <Descriptions.Item label="IP地址">
              <Text code>{selectedDevice.ip}</Text>
            </Descriptions.Item>
            <Descriptions.Item label="状态">
              <Badge
                status={getStatusColor(selectedDevice.status) as any}
                text={getStatusText(selectedDevice.status)}
              />
            </Descriptions.Item>
            <Descriptions.Item label="运行时间">
              {selectedDevice.uptime}
            </Descriptions.Item>
            <Descriptions.Item label="带宽使用率">
              <Progress
                percent={selectedDevice.bandwidth}
                strokeColor={selectedDevice.bandwidth > 80 ? '#ff4d4f' : selectedDevice.bandwidth > 60 ? '#faad14' : '#52c41a'}
              />
            </Descriptions.Item>
            <Descriptions.Item label="网络延迟">
              <Text style={{ color: selectedDevice.latency > 20 ? '#ff4d4f' : selectedDevice.latency > 10 ? '#faad14' : '#52c41a' }}>
                {selectedDevice.latency} ms
              </Text>
            </Descriptions.Item>
            <Descriptions.Item label="丢包率">
              <Text style={{ color: selectedDevice.packetLoss > 1 ? '#ff4d4f' : selectedDevice.packetLoss > 0.5 ? '#faad14' : '#52c41a' }}>
                {selectedDevice.packetLoss}%
              </Text>
            </Descriptions.Item>
            <Descriptions.Item label="最后更新" span={2}>
              {selectedDevice.lastUpdate}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>

      {/* 设置模态框 */}
      <Modal
        title="网络设备设置"
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
          <Form.Item label="监控频率">
            <Select defaultValue="30s">
              <Select.Option value="10s">10秒</Select.Option>
              <Select.Option value="30s">30秒</Select.Option>
              <Select.Option value="1min">1分钟</Select.Option>
              <Select.Option value="5min">5分钟</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="告警阈值">
            <Input.Group compact>
              <Input placeholder="延迟阈值(ms)" style={{ width: '50%' }} />
              <Input placeholder="丢包率阈值(%)" style={{ width: '50%' }} />
            </Input.Group>
          </Form.Item>
          <Form.Item label="通知方式">
            <Select mode="multiple" placeholder="选择通知方式">
              <Select.Option value="email">邮件</Select.Option>
              <Select.Option value="sms">短信</Select.Option>
              <Select.Option value="app">APP推送</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default NetworkStatus; 