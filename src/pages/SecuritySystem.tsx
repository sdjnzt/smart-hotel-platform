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
} from 'antd';
import {
  SafetyOutlined,
  VideoCameraOutlined,
  AlertOutlined,
  EyeOutlined,
  SettingOutlined,
  ReloadOutlined,
  ExportOutlined,
  LineChartOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,

  BellOutlined,
  CameraOutlined,
  UserOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

interface SecurityCamera {
  id: string;
  name: string;
  location: string;
  status: 'online' | 'offline' | 'maintenance';
  resolution: string;
  recording: boolean;
  motionDetection: boolean;
  lastRecording: string;
  storageUsage: number;
}



interface AlarmEvent {
  id: string;
  type: 'motion' | 'fire' | 'intrusion';
  location: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'active' | 'acknowledged' | 'resolved';
  timestamp: string;
  description: string;
  handledBy?: string;
}

const SecuritySystem: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [cameras, setCameras] = useState<SecurityCamera[]>([]);
  const [alarmEvents, setAlarmEvents] = useState<AlarmEvent[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('overview');

  // 模拟数据
  const mockCameras: SecurityCamera[] = [
    {
      id: '1',
      name: '大堂摄像头-01',
      location: '大堂入口',
      status: 'online',
      resolution: '4K',
      recording: true,
      motionDetection: true,
      lastRecording: '2024-01-15 14:30:00',
      storageUsage: 65,
    },
    {
      id: '2',
      name: '电梯摄像头-01',
      location: '1楼电梯',
      status: 'online',
      resolution: '1080P',
      recording: true,
      motionDetection: true,
      lastRecording: '2024-01-15 14:29:00',
      storageUsage: 78,
    },
    {
      id: '3',
      name: '停车场摄像头-01',
      location: '地下停车场',
      status: 'maintenance',
      resolution: '4K',
      recording: false,
      motionDetection: false,
      lastRecording: '2024-01-15 10:15:00',
      storageUsage: 45,
    },
    {
      id: '4',
      name: '客房走廊摄像头-01',
      location: '3楼走廊',
      status: 'online',
      resolution: '1080P',
      recording: true,
      motionDetection: true,
      lastRecording: '2024-01-15 14:28:00',
      storageUsage: 82,
    },
  ];



  const mockAlarmEvents: AlarmEvent[] = [
    {
      id: '1',
      type: 'motion',
      location: '大堂摄像头-01',
      severity: 'medium',
      status: 'acknowledged',
      timestamp: '2024-01-15 14:30:00',
      description: '检测到异常移动',
      handledBy: '保安张三',
    },
    {
      id: '2',
      type: 'intrusion',
      location: '停车场摄像头-01',
      severity: 'high',
      status: 'active',
      timestamp: '2024-01-15 14:20:00',
      description: '检测到可疑人员',
    },
    {
      id: '3',
      type: 'fire',
      location: '厨房区域',
      severity: 'critical',
      status: 'active',
      timestamp: '2024-01-15 14:15:00',
      description: '烟雾报警器触发',
    },
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setLoading(true);
    // 模拟API调用
    setTimeout(() => {
      setCameras(mockCameras);
      setAlarmEvents(mockAlarmEvents);
      setLoading(false);
    }, 1000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
      case 'normal':
      case 'resolved':
        return 'green';
      case 'offline':
      case 'locked':
      case 'acknowledged':
        return 'orange';
      case 'maintenance':
        return 'purple';
      case 'active':
        return 'red';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
      case 'normal':
      case 'resolved':
        return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
      case 'offline':
      case 'locked':
      case 'acknowledged':
        return <ExclamationCircleOutlined style={{ color: '#faad14' }} />;
      case 'maintenance':
        return <SettingOutlined style={{ color: '#722ed1' }} />;
      case 'active':
        return <AlertOutlined style={{ color: '#ff4d4f' }} />;
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
      case 'maintenance':
        return '维护中';
      case 'normal':
        return '正常';
      case 'locked':
        return '锁定';
      case 'active':
        return '活跃';
      case 'acknowledged':
        return '已确认';
      case 'resolved':
        return '已解决';
      default:
        return '未知';
    }
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

  const getSeverityText = (severity: string) => {
    switch (severity) {
      case 'low':
        return '低';
      case 'medium':
        return '中';
      case 'high':
        return '高';
      case 'critical':
        return '紧急';
      default:
        return '未知';
    }
  };

  const getAlarmTypeText = (type: string) => {
    switch (type) {
      case 'motion':
        return '移动检测';
      case 'fire':
        return '火灾报警';
      case 'intrusion':
        return '入侵检测';
      default:
        return '未知';
    }
  };

  const cameraColumns = [
    {
      title: '摄像头信息',
      key: 'info',
      render: (_: any, record: SecurityCamera) => (
        <Space>
          <Avatar size="large" icon={<CameraOutlined />} />
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
      title: '分辨率',
      dataIndex: 'resolution',
      key: 'resolution',
    },
    {
      title: '录制状态',
      dataIndex: 'recording',
      key: 'recording',
      render: (recording: boolean) => (
        <Tag color={recording ? 'green' : 'red'}>
          {recording ? '录制中' : '未录制'}
        </Tag>
      ),
    },
    {
      title: '移动检测',
      dataIndex: 'motionDetection',
      key: 'motionDetection',
      render: (detection: boolean) => (
        <Tag color={detection ? 'green' : 'red'}>
          {detection ? '已启用' : '已禁用'}
        </Tag>
      ),
    },
    {
      title: '存储使用',
      dataIndex: 'storageUsage',
      key: 'storageUsage',
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
      title: '操作',
      key: 'action',
      render: (_: any, record: SecurityCamera) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetails(record)}
          >
            查看
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



  const alarmColumns = [
    {
      title: '报警类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => (
        <Space>
          <AlertOutlined style={{ color: '#ff4d4f' }} />
          <Text>{getAlarmTypeText(type)}</Text>
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
          {getSeverityText(severity)}
        </Tag>
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
      title: '时间',
      dataIndex: 'timestamp',
      key: 'timestamp',
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '处理人',
      dataIndex: 'handledBy',
      key: 'handledBy',
      render: (handler: string) => handler || '-',
    },
  ];

  const handleViewDetails = (record: any) => {
    setSelectedItem(record);
    setDetailsModalVisible(true);
  };

  const handleSettings = (record: any) => {
    setSettingsModalVisible(true);
  };

  const handleExport = () => {
    Modal.success({
      title: '导出成功',
      content: '安防系统数据已成功导出到Excel文件',
    });
  };

  const handleBatchOperation = () => {
    if (selectedItems.length === 0) {
      Modal.warning({
        title: '提示',
        content: '请先选择要操作的设备',
      });
      return;
    }
    Modal.info({
      title: '批量操作',
      content: `已选择 ${selectedItems.length} 个设备进行批量操作`,
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
          <SafetyOutlined style={{ marginRight: 8 }} />
          安防系统
        </Title>
        <Text type="secondary">
          监控酒店安防设备状态，管理摄像头系统和报警事件
        </Text>
      </div>

      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="摄像头总数"
              value={cameras.length}
              prefix={<CameraOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="在线设备"
              value={cameras.filter(c => c.status === 'online').length}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="活跃报警"
              value={alarmEvents.filter(a => a.status === 'active').length}
              prefix={<AlertOutlined />}
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
            刷新状态
          </Button>
          <Button
            icon={<LineChartOutlined />}
          >
            数据分析
          </Button>
          <Button
            icon={<ExportOutlined />}
            onClick={handleExport}
          >
            导出数据
          </Button>
          {selectedItems.length > 0 && (
            <Button
              type="default"
              onClick={handleBatchOperation}
            >
              批量操作 ({selectedItems.length})
            </Button>
          )}
        </Space>
      </Card>

      {/* 主要内容区域 */}
      <Card>
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="系统概览" key="overview">
            <Row gutter={16}>
              <Col span={24}>
                <Card title="摄像头状态" size="small">
                  <Table
                    columns={cameraColumns}
                    dataSource={cameras}
                    rowKey="id"
                    loading={loading}
                    pagination={false}
                    size="small"
                  />
                </Card>
              </Col>
            </Row>
          </TabPane>
          <TabPane tab="摄像头管理" key="cameras">
            <Table
              columns={cameraColumns}
              dataSource={cameras}
              rowKey="id"
              loading={loading}
              rowSelection={rowSelection}
              pagination={{
                total: cameras.length,
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
              }}
            />
          </TabPane>

          <TabPane tab="报警事件" key="alarms">
            <Table
              columns={alarmColumns}
              dataSource={alarmEvents}
              rowKey="id"
              loading={loading}
              pagination={{
                total: alarmEvents.length,
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
        title="设备详情"
        open={detailsModalVisible}
        onCancel={() => setDetailsModalVisible(false)}
        footer={null}
        width={600}
      >
        {selectedItem && (
          <Descriptions bordered column={2}>
            <Descriptions.Item label="设备名称" span={2}>
              {selectedItem.name}
            </Descriptions.Item>
            <Descriptions.Item label="位置">
              {selectedItem.location}
            </Descriptions.Item>
            <Descriptions.Item label="状态">
              <Badge
                status={getStatusColor(selectedItem.status) as any}
                text={getStatusText(selectedItem.status)}
              />
            </Descriptions.Item>
            {selectedItem.resolution && (
              <Descriptions.Item label="分辨率">
                {selectedItem.resolution}
              </Descriptions.Item>
            )}
            {selectedItem.accessType && (
              <Descriptions.Item label="访问方式">
                {selectedItem.accessType}
              </Descriptions.Item>
            )}
            {selectedItem.lastRecording && (
              <Descriptions.Item label="最后录制">
                {selectedItem.lastRecording}
              </Descriptions.Item>
            )}
            {selectedItem.lastAccess && (
              <Descriptions.Item label="最后访问">
                {selectedItem.lastAccess}
              </Descriptions.Item>
            )}
          </Descriptions>
        )}
      </Modal>

      {/* 设置模态框 */}
      <Modal
        title="设备设置"
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
          <Form.Item label="设备名称">
            <Input placeholder="请输入设备名称" />
          </Form.Item>
          <Form.Item label="录制设置">
            <Select placeholder="请选择录制模式">
              <Select.Option value="continuous">连续录制</Select.Option>
              <Select.Option value="motion">移动检测录制</Select.Option>
              <Select.Option value="scheduled">定时录制</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="移动检测">
            <Select placeholder="请选择检测灵敏度">
              <Select.Option value="low">低</Select.Option>
              <Select.Option value="medium">中</Select.Option>
              <Select.Option value="high">高</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SecuritySystem; 