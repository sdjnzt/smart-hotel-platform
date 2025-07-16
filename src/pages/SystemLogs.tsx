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
  Typography,
  Divider,
  Tooltip,
  Badge,
  Tabs,
  List,
  Descriptions,
  Progress,
  Switch,
  message,
  Timeline,
  Alert,
  Drawer,
} from 'antd';
import {
  FileTextOutlined,
  SearchOutlined,
  FilterOutlined,
  ExportOutlined,
  DeleteOutlined,
  EyeOutlined,
  ReloadOutlined,
  DownloadOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  UserOutlined,
  KeyOutlined,
  WarningOutlined,
  InfoCircleOutlined,
  BugOutlined,
  SecurityScanOutlined,
  DatabaseOutlined,
  BarChartOutlined,
  LineChartOutlined,
  PieChartOutlined,
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;
const { Option } = Select;
const { TextArea } = Input;

interface LogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'warning' | 'error' | 'debug';
  category: 'operation' | 'login' | 'system' | 'security' | 'database';
  user: string;
  action: string;
  description: string;
  ipAddress: string;
  userAgent: string;
  details?: any;
  duration?: number;
  status: 'success' | 'failed' | 'pending';
}

interface LoginLog {
  id: string;
  timestamp: string;
  username: string;
  ipAddress: string;
  userAgent: string;
  status: 'success' | 'failed';
  location?: string;
  reason?: string;
  sessionId: string;
}

interface ErrorLog {
  id: string;
  timestamp: string;
  level: 'error' | 'critical' | 'warning';
  module: string;
  message: string;
  stackTrace?: string;
  user?: string;
  ipAddress?: string;
  resolved: boolean;
}

interface SystemMetrics {
  cpu: number;
  memory: number;
  disk: number;
  network: number;
  activeUsers: number;
  requestsPerMinute: number;
  errorRate: number;
  responseTime: number;
}

const SystemLogs: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [logList, setLogList] = useState<LogEntry[]>([]);
  const [loginLogs, setLoginLogs] = useState<LoginLog[]>([]);
  const [errorLogs, setErrorLogs] = useState<ErrorLog[]>([]);
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics>({
    cpu: 0,
    memory: 0,
    disk: 0,
    network: 0,
    activeUsers: 0,
    requestsPerMinute: 0,
    errorRate: 0,
    responseTime: 0,
  });
  const [selectedLogs, setSelectedLogs] = useState<string[]>([]);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [currentLog, setCurrentLog] = useState<LogEntry | null>(null);
  const [activeTab, setActiveTab] = useState('operation');
  const [autoRefresh, setAutoRefresh] = useState(true);

  // 模拟数据
  const mockLogs: LogEntry[] = [
    {
      id: '1',
      timestamp: '2025-07-15 14:30:25',
      level: 'info',
      category: 'operation',
      user: 'admin',
      action: '用户登录',
      description: '用户 admin 成功登录系统',
      ipAddress: '192.168.1.100',
      userAgent: 'Chrome/120.0.0.0',
      status: 'success',
      duration: 150,
    },
    {
      id: '2',
      timestamp: '2025-07-15 14:25:10',
      level: 'warning',
      category: 'security',
      user: 'unknown',
      action: '登录失败',
      description: '用户 guest 登录失败，密码错误',
      ipAddress: '192.168.1.101',
      userAgent: 'Firefox/121.0.0.0',
      status: 'failed',
    },
    {
      id: '3',
      timestamp: '2025-07-15 14:20:15',
      level: 'info',
      category: 'operation',
      user: 'manager',
      action: '创建房间',
      description: '用户 manager 创建了新房间 301',
      ipAddress: '192.168.1.102',
      userAgent: 'Chrome/120.0.0.0',
      status: 'success',
      duration: 2300,
    },
    {
      id: '4',
      timestamp: '2025-07-15 14:15:30',
      level: 'error',
      category: 'database',
      user: 'system',
      action: '数据库连接',
      description: '数据库连接超时',
      ipAddress: '127.0.0.1',
      userAgent: 'System',
      status: 'failed',
      duration: 5000,
    },
    {
      id: '5',
      timestamp: '2025-07-15 14:10:45',
      level: 'info',
      category: 'system',
      user: 'system',
      action: '系统备份',
      description: '系统自动备份完成',
      ipAddress: '127.0.0.1',
      userAgent: 'System',
      status: 'success',
      duration: 45000,
    },
  ];

  const mockLoginLogs: LoginLog[] = [
    {
      id: '1',
      timestamp: '2025-07-15 14:30:25',
      username: 'admin',
      ipAddress: '192.168.1.100',
      userAgent: 'Chrome/120.0.0.0',
      status: 'success',
      location: '山东省济宁市',
      sessionId: 'sess_001',
    },
    {
      id: '2',
      timestamp: '2025-07-15 14:25:10',
      username: 'guest',
      ipAddress: '192.168.1.101',
      userAgent: 'Firefox/121.0.0.0',
      status: 'failed',
      reason: '密码错误',
      sessionId: 'sess_002',
    },
    {
      id: '3',
      timestamp: '2025-07-15 14:20:15',
      username: 'manager',
      ipAddress: '192.168.1.102',
      userAgent: 'Chrome/120.0.0.0',
      status: 'success',
      location: '山东省济宁市',
      sessionId: 'sess_003',
    },
    {
      id: '4',
      timestamp: '2025-07-15 14:15:30',
      username: 'staff001',
      ipAddress: '192.168.1.103',
      userAgent: 'Safari/17.0.0.0',
      status: 'success',
      location: '山东省济宁市',
      sessionId: 'sess_004',
    },
    {
      id: '5',
      timestamp: '2025-07-15 14:10:45',
      username: 'unknown',
      ipAddress: '192.168.1.104',
      userAgent: 'PostmanRuntime/7.32.0',
      status: 'failed',
      reason: '用户不存在',
      sessionId: 'sess_005',
    },
  ];

  const mockErrorLogs: ErrorLog[] = [
    {
      id: '1',
      timestamp: '2025-07-15 14:15:30',
      level: 'error',
      module: '数据库连接',
      message: '数据库连接超时，连接池耗尽',
      stackTrace: 'Error: Connection timeout\n    at Database.connect()\n    at ConnectionPool.getConnection()',
      user: 'system',
      ipAddress: '127.0.0.1',
      resolved: false,
    },
    {
      id: '2',
      timestamp: '2025-07-15 14:10:15',
      level: 'warning',
      module: '内存监控',
      message: '内存使用率超过80%',
      user: 'system',
      ipAddress: '127.0.0.1',
      resolved: true,
    },
    {
      id: '3',
      timestamp: '2025-07-15 14:05:20',
      level: 'critical',
      module: '文件系统',
      message: '磁盘空间不足，剩余空间小于10%',
      user: 'system',
      ipAddress: '127.0.0.1',
      resolved: false,
    },
    {
      id: '4',
      timestamp: '2025-07-15 14:00:10',
      level: 'error',
      module: 'API接口',
      message: '用户认证失败，Token已过期',
      stackTrace: 'Error: Token expired\n    at AuthMiddleware.verify()\n    at Router.handle()',
      user: 'guest',
      ipAddress: '192.168.1.101',
      resolved: true,
    },
  ];

  useEffect(() => {
    loadData();
    
    // 自动刷新
    if (autoRefresh) {
      const interval = setInterval(() => {
        loadData();
      }, 30000); // 30秒刷新一次
      
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const loadData = () => {
    setLoading(true);
    // 模拟API调用
    setTimeout(() => {
      setLogList(mockLogs);
      setLoginLogs(mockLoginLogs);
      setErrorLogs(mockErrorLogs);
      setSystemMetrics({
        cpu: Math.random() * 100,
        memory: Math.random() * 100,
        disk: Math.random() * 100,
        network: Math.random() * 100,
        activeUsers: Math.floor(Math.random() * 50) + 10,
        requestsPerMinute: Math.floor(Math.random() * 100) + 50,
        errorRate: Math.random() * 5,
        responseTime: Math.random() * 1000 + 100,
      });
      setLoading(false);
    }, 1000);
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'info':
      case 'success':
        return 'green';
      case 'warning':
        return 'orange';
      case 'error':
      case 'critical':
      case 'failed':
        return 'red';
      case 'debug':
        return 'blue';
      default:
        return 'default';
    }
  };

  const getLevelText = (level: string) => {
    switch (level) {
      case 'info':
        return '信息';
      case 'warning':
        return '警告';
      case 'error':
        return '错误';
      case 'critical':
        return '严重';
      case 'debug':
        return '调试';
      default:
        return '未知';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'operation':
        return 'blue';
      case 'login':
        return 'green';
      case 'system':
        return 'purple';
      case 'security':
        return 'red';
      case 'database':
        return 'orange';
      default:
        return 'default';
    }
  };

  const getCategoryText = (category: string) => {
    switch (category) {
      case 'operation':
        return '操作';
      case 'login':
        return '登录';
      case 'system':
        return '系统';
      case 'security':
        return '安全';
      case 'database':
        return '数据库';
      default:
        return '未知';
    }
  };

  const logColumns = [
    {
      title: '时间',
      dataIndex: 'timestamp',
      key: 'timestamp',
      width: 150,
      render: (text: string) => <Text>{text}</Text>,
    },
    {
      title: '级别',
      dataIndex: 'level',
      key: 'level',
      width: 80,
      render: (level: string) => (
        <Tag color={getLevelColor(level)}>
          {getLevelText(level)}
        </Tag>
      ),
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
      width: 100,
      render: (category: string) => (
        <Tag color={getCategoryColor(category)}>
          {getCategoryText(category)}
        </Tag>
      ),
    },
    {
      title: '用户',
      dataIndex: 'user',
      key: 'user',
      width: 100,
      render: (user: string) => <Text>{user}</Text>,
    },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      width: 120,
      render: (action: string) => <Text strong>{action}</Text>,
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      render: (description: string) => <Text>{description}</Text>,
    },
    {
      title: 'IP地址',
      dataIndex: 'ipAddress',
      key: 'ipAddress',
      width: 120,
      render: (ip: string) => <Text code>{ip}</Text>,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status: string) => (
        <Badge
          status={getLevelColor(status) as any}
          text={status === 'success' ? '成功' : status === 'failed' ? '失败' : '进行中'}
        />
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 80,
      render: (_: any, record: LogEntry) => (
        <Button
          type="link"
          size="small"
          icon={<EyeOutlined />}
          onClick={() => handleViewDetails(record)}
        >
          详情
        </Button>
      ),
    },
  ];

  const loginColumns = [
    {
      title: '时间',
      dataIndex: 'timestamp',
      key: 'timestamp',
      width: 150,
    },
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
      width: 120,
    },
    {
      title: 'IP地址',
      dataIndex: 'ipAddress',
      key: 'ipAddress',
      width: 120,
      render: (ip: string) => <Text code>{ip}</Text>,
    },
    {
      title: '位置',
      dataIndex: 'location',
      key: 'location',
      width: 120,
      render: (location: string) => location || '-',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status: string) => (
        <Badge
          status={getLevelColor(status) as any}
          text={status === 'success' ? '成功' : '失败'}
        />
      ),
    },
    {
      title: '原因',
      dataIndex: 'reason',
      key: 'reason',
      render: (reason: string) => reason || '-',
    },
    {
      title: '会话ID',
      dataIndex: 'sessionId',
      key: 'sessionId',
      width: 120,
      render: (sessionId: string) => <Text code>{sessionId}</Text>,
    },
  ];

  const errorColumns = [
    {
      title: '时间',
      dataIndex: 'timestamp',
      key: 'timestamp',
      width: 150,
    },
    {
      title: '级别',
      dataIndex: 'level',
      key: 'level',
      width: 80,
      render: (level: string) => (
        <Tag color={getLevelColor(level)}>
          {getLevelText(level)}
        </Tag>
      ),
    },
    {
      title: '模块',
      dataIndex: 'module',
      key: 'module',
      width: 120,
    },
    {
      title: '消息',
      dataIndex: 'message',
      key: 'message',
      render: (message: string) => <Text>{message}</Text>,
    },
    {
      title: '用户',
      dataIndex: 'user',
      key: 'user',
      width: 100,
      render: (user: string) => user || '-',
    },
    {
      title: '状态',
      dataIndex: 'resolved',
      key: 'resolved',
      width: 80,
      render: (resolved: boolean) => (
        <Badge
          status={resolved ? 'success' : 'error'}
          text={resolved ? '已解决' : '未解决'}
        />
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_: any, record: ErrorLog) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleViewError(record)}
          >
            详情
          </Button>
          {!record.resolved && (
            <Button
              type="link"
              size="small"
              onClick={() => handleResolveError(record)}
            >
              标记解决
            </Button>
          )}
        </Space>
      ),
    },
  ];

  const handleViewDetails = (record: LogEntry) => {
    setCurrentLog(record);
    setDetailsModalVisible(true);
  };

  const handleViewError = (record: ErrorLog) => {
    Modal.info({
      title: '错误详情',
      width: 600,
      content: (
        <div>
          <Descriptions column={1} bordered>
            <Descriptions.Item label="时间">{record.timestamp}</Descriptions.Item>
            <Descriptions.Item label="级别">
              <Tag color={getLevelColor(record.level)}>{getLevelText(record.level)}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="模块">{record.module}</Descriptions.Item>
            <Descriptions.Item label="消息">{record.message}</Descriptions.Item>
            <Descriptions.Item label="用户">{record.user || '-'}</Descriptions.Item>
            <Descriptions.Item label="IP地址">{record.ipAddress || '-'}</Descriptions.Item>
          </Descriptions>
          {record.stackTrace && (
            <>
              <Divider>堆栈跟踪</Divider>
              <TextArea
                value={record.stackTrace}
                rows={10}
                readOnly
                style={{ fontFamily: 'monospace' }}
              />
            </>
          )}
        </div>
      ),
    });
  };

  const handleResolveError = (record: ErrorLog) => {
    Modal.confirm({
      title: '确认解决',
      content: `确定要将错误 "${record.message}" 标记为已解决吗？`,
      onOk: () => {
        message.success('错误已标记为已解决');
      },
    });
  };

  const handleExport = () => {
    message.success('日志导出成功');
  };

  const handleClearLogs = () => {
    Modal.confirm({
      title: '确认清空日志',
      content: '确定要清空所有日志吗？此操作不可恢复！',
      onOk: () => {
        message.success('日志已清空');
      },
    });
  };

  // 统计数据
  const totalLogs = logList.length;
  const errorLogsCount = logList.filter(log => log.level === 'error').length;
  const warningLogs = logList.filter(log => log.level === 'warning').length;
  const infoLogs = logList.filter(log => log.level === 'info').length;
  const failedLogs = logList.filter(log => log.status === 'failed').length;
  const totalLoginLogs = loginLogs.length;
  const failedLoginLogs = loginLogs.filter(log => log.status === 'failed').length;

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>
        <FileTextOutlined style={{ marginRight: 8 }} />
        系统日志
      </Title>

      {/* 系统监控 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={3}>
          <Card>
            <Statistic
              title="CPU使用率"
              value={systemMetrics.cpu.toFixed(1)}
              suffix="%"
              prefix={<BarChartOutlined />}
              valueStyle={{ color: systemMetrics.cpu > 80 ? '#ff4d4f' : '#52c41a' }}
            />
            <Progress percent={systemMetrics.cpu} showInfo={false} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={3}>
          <Card>
            <Statistic
              title="内存使用率"
              value={systemMetrics.memory.toFixed(1)}
              suffix="%"
              prefix={<LineChartOutlined />}
              valueStyle={{ color: systemMetrics.memory > 80 ? '#ff4d4f' : '#52c41a' }}
            />
            <Progress percent={systemMetrics.memory} showInfo={false} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={3}>
          <Card>
            <Statistic
              title="磁盘使用率"
              value={systemMetrics.disk.toFixed(1)}
              suffix="%"
              prefix={<PieChartOutlined />}
              valueStyle={{ color: systemMetrics.disk > 80 ? '#ff4d4f' : '#52c41a' }}
            />
            <Progress percent={systemMetrics.disk} showInfo={false} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={3}>
          <Card>
            <Statistic
              title="活跃用户"
              value={systemMetrics.activeUsers}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={3}>
          <Card>
            <Statistic
              title="请求/分钟"
              value={systemMetrics.requestsPerMinute}
              prefix={<DatabaseOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={3}>
          <Card>
            <Statistic
              title="错误率"
              value={systemMetrics.errorRate.toFixed(2)}
              suffix="%"
              prefix={<BugOutlined />}
              valueStyle={{ color: systemMetrics.errorRate > 2 ? '#ff4d4f' : '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={3}>
          <Card>
            <Statistic
              title="响应时间"
              value={systemMetrics.responseTime.toFixed(0)}
              suffix="ms"
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: systemMetrics.responseTime > 500 ? '#ff4d4f' : '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={3}>
          <Card>
            <Statistic
              title="网络使用率"
              value={systemMetrics.network.toFixed(1)}
              suffix="%"
              prefix={<SecurityScanOutlined />}
              valueStyle={{ color: '#13c2c2' }}
            />
            <Progress percent={systemMetrics.network} showInfo={false} />
          </Card>
        </Col>
      </Row>

      {/* 统计卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={4}>
          <Card>
            <Statistic
              title="总日志数"
              value={totalLogs}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={4}>
          <Card>
            <Statistic
              title="错误日志"
              value={errorLogsCount}
              prefix={<ExclamationCircleOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={4}>
          <Card>
            <Statistic
              title="警告日志"
              value={warningLogs}
              prefix={<WarningOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={4}>
          <Card>
            <Statistic
              title="失败操作"
              value={failedLogs}
              prefix={<CloseCircleOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={4}>
          <Card>
            <Statistic
              title="登录日志"
              value={totalLoginLogs}
              prefix={<KeyOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={4}>
          <Card>
            <Statistic
              title="登录失败"
              value={failedLoginLogs}
              prefix={<CloseCircleOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 主要内容 */}
      <Card>
        <div style={{ marginBottom: 16 }}>
          <Space>
            <Button icon={<ReloadOutlined />} onClick={loadData}>
              刷新
            </Button>
            <Button icon={<ExportOutlined />} onClick={handleExport}>
              导出日志
            </Button>
            <Button icon={<DeleteOutlined />} onClick={handleClearLogs}>
              清空日志
            </Button>
            <Button icon={<SearchOutlined />}>
              高级搜索
            </Button>
            <Switch
              checked={autoRefresh}
              onChange={setAutoRefresh}
              checkedChildren="自动刷新"
              unCheckedChildren="手动刷新"
            />
          </Space>
        </div>

        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="操作日志" key="operation">
            <Table
              columns={logColumns}
              dataSource={logList}
              rowKey="id"
              loading={loading}
              pagination={{
                total: logList.length,
                pageSize: 20,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
              }}
            />
          </TabPane>
          
          <TabPane tab="登录日志" key="login">
            <Table
              columns={loginColumns}
              dataSource={loginLogs}
              rowKey="id"
              loading={loading}
              pagination={{
                total: loginLogs.length,
                pageSize: 20,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
              }}
            />
          </TabPane>

          <TabPane tab="错误日志" key="error">
            <Table
              columns={errorColumns}
              dataSource={errorLogs}
              rowKey="id"
              loading={loading}
              pagination={{
                total: errorLogs.length,
                pageSize: 20,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
              }}
            />
          </TabPane>

          <TabPane tab="实时监控" key="monitor">
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <Text type="secondary">实时监控图表开发中...</Text>
            </div>
          </TabPane>
        </Tabs>
      </Card>

      {/* 日志详情模态框 */}
      <Modal
        title="日志详情"
        open={detailsModalVisible}
        onCancel={() => setDetailsModalVisible(false)}
        footer={null}
        width={700}
      >
        {currentLog && (
          <Descriptions column={2} bordered>
            <Descriptions.Item label="时间">{currentLog.timestamp}</Descriptions.Item>
            <Descriptions.Item label="级别">
              <Tag color={getLevelColor(currentLog.level)}>
                {getLevelText(currentLog.level)}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="分类">
              <Tag color={getCategoryColor(currentLog.category)}>
                {getCategoryText(currentLog.category)}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="用户">{currentLog.user}</Descriptions.Item>
            <Descriptions.Item label="操作">{currentLog.action}</Descriptions.Item>
            <Descriptions.Item label="状态">
              <Badge
                status={getLevelColor(currentLog.status) as any}
                text={currentLog.status === 'success' ? '成功' : currentLog.status === 'failed' ? '失败' : '进行中'}
              />
            </Descriptions.Item>
            <Descriptions.Item label="IP地址">{currentLog.ipAddress}</Descriptions.Item>
            <Descriptions.Item label="用户代理">{currentLog.userAgent}</Descriptions.Item>
            {currentLog.duration && (
              <Descriptions.Item label="执行时间">{currentLog.duration}ms</Descriptions.Item>
            )}
            <Descriptions.Item label="描述" span={2}>
              {currentLog.description}
            </Descriptions.Item>
            {currentLog.details && (
              <Descriptions.Item label="详细信息" span={2}>
                <pre style={{ fontSize: '12px' }}>
                  {JSON.stringify(currentLog.details, null, 2)}
                </pre>
              </Descriptions.Item>
            )}
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default SystemLogs; 