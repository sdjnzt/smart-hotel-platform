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
  Upload,
  Steps,
} from 'antd';
import {
  DatabaseOutlined,
  CloudUploadOutlined,
  CloudDownloadOutlined,
  DownloadOutlined,
  UploadOutlined,
  DeleteOutlined,
  EyeOutlined,
  EditOutlined,
  SettingOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
  SecurityScanOutlined,
  ReloadOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  StopOutlined,
  HistoryOutlined,
  ScheduleOutlined,
  FolderOutlined,
  HddOutlined,
  SafetyOutlined,
  ExportOutlined,
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;
const { Option } = Select;
const { TextArea } = Input;
const { Step } = Steps;

interface BackupRecord {
  id: string;
  name: string;
  type: 'full' | 'incremental' | 'differential';
  category: 'database' | 'system' | 'files';
  size: number;
  status: 'completed' | 'in_progress' | 'failed' | 'scheduled';
  createTime: string;
  completeTime?: string;
  duration?: number;
  location: string;
  checksum: string;
  description?: string;
  retention: number;
  compression: boolean;
  encryption: boolean;
}

interface BackupStrategy {
  id: string;
  name: string;
  type: 'database' | 'system' | 'files';
  schedule: 'daily' | 'weekly' | 'monthly';
  time: string;
  retention: number;
  compression: boolean;
  encryption: boolean;
  status: 'active' | 'inactive';
  lastRun?: string;
  nextRun?: string;
}

interface RestoreRecord {
  id: string;
  backupId: string;
  backupName: string;
  type: 'database' | 'system' | 'files';
  status: 'completed' | 'in_progress' | 'failed';
  startTime: string;
  completeTime?: string;
  duration?: number;
  operator: string;
  description?: string;
}

const BackupRestore: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [backupList, setBackupList] = useState<BackupRecord[]>([]);
  const [strategyList, setStrategyList] = useState<BackupStrategy[]>([]);
  const [restoreList, setRestoreList] = useState<RestoreRecord[]>([]);
  const [selectedBackups, setSelectedBackups] = useState<string[]>([]);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [restoreModalVisible, setRestoreModalVisible] = useState(false);
  const [strategyModalVisible, setStrategyModalVisible] = useState(false);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [currentBackup, setCurrentBackup] = useState<BackupRecord | null>(null);
  const [activeTab, setActiveTab] = useState('backups');
  const [currentStep, setCurrentStep] = useState(0);

  // 模拟数据
  const mockBackups: BackupRecord[] = [
    {
      id: '1',
      name: '完整备份_20240115',
      type: 'full',
      category: 'database',
      size: 2048576, // 2GB
      status: 'completed',
      createTime: '2024-01-15 02:00:00',
      completeTime: '2024-01-15 02:15:30',
      duration: 930,
      location: '/backup/database/full_20240115.sql',
      checksum: 'a1b2c3d4e5f6g7h8i9j0',
      description: '每日完整数据库备份',
      retention: 30,
      compression: true,
      encryption: true,
    },
    {
      id: '2',
      name: '增量备份_20240115',
      type: 'incremental',
      category: 'database',
      size: 512000, // 500MB
      status: 'completed',
      createTime: '2024-01-15 14:00:00',
      completeTime: '2024-01-15 14:05:20',
      duration: 320,
      location: '/backup/database/incremental_20240115.sql',
      checksum: 'b2c3d4e5f6g7h8i9j0k1',
      description: '下午增量备份',
      retention: 7,
      compression: true,
      encryption: false,
    },
    {
      id: '3',
      name: '系统备份_20240115',
      type: 'full',
      category: 'system',
      size: 1048576, // 1GB
      status: 'in_progress',
      createTime: '2024-01-15 16:00:00',
      location: '/backup/system/system_20240115.tar.gz',
      checksum: 'c3d4e5f6g7h8i9j0k1l2',
      description: '系统配置文件备份',
      retention: 90,
      compression: true,
      encryption: true,
    },
    {
      id: '4',
      name: '文件备份_20240114',
      type: 'differential',
      category: 'files',
      size: 1536000, // 1.5GB
      status: 'failed',
      createTime: '2024-01-14 20:00:00',
      location: '/backup/files/differential_20240114.tar.gz',
      checksum: 'd4e5f6g7h8i9j0k1l2m3',
      description: '文件差异备份',
      retention: 14,
      compression: true,
      encryption: false,
    },
    {
      id: '5',
      name: '配置备份_20240113',
      type: 'full',
      category: 'system',
      size: 256000, // 250MB
      status: 'completed',
      createTime: '2024-01-13 12:00:00',
      completeTime: '2024-01-13 12:02:15',
      duration: 135,
      location: '/backup/config/config_20240113.json',
      checksum: 'e5f6g7h8i9j0k1l2m3n4',
      description: '应用配置文件备份',
      retention: 60,
      compression: false,
      encryption: true,
    },
  ];

  const mockStrategies: BackupStrategy[] = [
    {
      id: '1',
      name: '数据库每日备份',
      type: 'database',
      schedule: 'daily',
      time: '02:00',
      retention: 30,
      compression: true,
      encryption: true,
      status: 'active',
      lastRun: '2024-01-15 02:00:00',
      nextRun: '2024-01-16 02:00:00',
    },
    {
      id: '2',
      name: '数据库增量备份',
      type: 'database',
      schedule: 'daily',
      time: '14:00',
      retention: 7,
      compression: true,
      encryption: false,
      status: 'active',
      lastRun: '2024-01-15 14:00:00',
      nextRun: '2024-01-16 14:00:00',
    },
    {
      id: '3',
      name: '系统每周备份',
      type: 'system',
      schedule: 'weekly',
      time: '03:00',
      retention: 90,
      compression: true,
      encryption: true,
      status: 'active',
      lastRun: '2024-01-14 03:00:00',
      nextRun: '2024-01-21 03:00:00',
    },
    {
      id: '4',
      name: '文件每月备份',
      type: 'files',
      schedule: 'monthly',
      time: '04:00',
      retention: 365,
      compression: true,
      encryption: false,
      status: 'inactive',
      lastRun: '2023-12-15 04:00:00',
      nextRun: '2024-01-15 04:00:00',
    },
  ];

  const mockRestores: RestoreRecord[] = [
    {
      id: '1',
      backupId: '1',
      backupName: '完整备份_20240115',
      type: 'database',
      status: 'completed',
      startTime: '2024-01-15 10:00:00',
      completeTime: '2024-01-15 10:05:30',
      duration: 330,
      operator: 'admin',
      description: '测试恢复',
    },
    {
      id: '2',
      backupId: '3',
      backupName: '系统备份_20240115',
      type: 'system',
      status: 'in_progress',
      startTime: '2024-01-15 16:30:00',
      operator: 'admin',
      description: '系统配置恢复',
    },
    {
      id: '3',
      backupId: '5',
      backupName: '配置备份_20240113',
      type: 'system',
      status: 'failed',
      startTime: '2024-01-14 15:00:00',
      operator: 'manager',
      description: '配置文件恢复失败',
    },
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setLoading(true);
    // 模拟API调用
    setTimeout(() => {
      setBackupList(mockBackups);
      setStrategyList(mockStrategies);
      setRestoreList(mockRestores);
      setLoading(false);
    }, 1000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
      case 'active':
        return 'green';
      case 'in_progress':
        return 'blue';
      case 'failed':
      case 'inactive':
        return 'red';
      case 'scheduled':
        return 'orange';
      default:
        return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return '已完成';
      case 'in_progress':
        return '进行中';
      case 'failed':
        return '失败';
      case 'scheduled':
        return '已计划';
      case 'active':
        return '启用';
      case 'inactive':
        return '停用';
      default:
        return '未知';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'full':
        return 'blue';
      case 'incremental':
        return 'green';
      case 'differential':
        return 'orange';
      case 'database':
        return 'purple';
      case 'system':
        return 'cyan';
      case 'files':
        return 'magenta';
      case 'config':
        return 'gold';
      default:
        return 'default';
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'full':
        return '完整';
      case 'incremental':
        return '增量';
      case 'differential':
        return '差异';
      case 'database':
        return '数据库';
      case 'system':
        return '系统';
      case 'files':
        return '文件';
      case 'config':
        return '配置';
      default:
        return '未知';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const backupColumns = [
    {
      title: '备份信息',
      key: 'info',
      render: (_: any, record: BackupRecord) => (
        <Space direction="vertical" size="small">
          <div>
            <Text strong>{record.name}</Text>
            <Tag color={getTypeColor(record.type)} style={{ marginLeft: 8 }}>
              {getTypeText(record.type)}
            </Tag>
            <Tag color={getTypeColor(record.category)} style={{ marginLeft: 8 }}>
              {getTypeText(record.category)}
            </Tag>
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            {record.description}
          </div>
        </Space>
      ),
    },
    {
      title: '大小',
      key: 'size',
      render: (_: any, record: BackupRecord) => (
        <Text>{formatFileSize(record.size)}</Text>
      ),
    },
    {
      title: '状态',
      key: 'status',
      render: (_: any, record: BackupRecord) => (
        <Space direction="vertical" size="small">
          <Badge
            status={getStatusColor(record.status) as any}
            text={getStatusText(record.status)}
          />
          {record.status === 'in_progress' && (
            <Progress percent={75} size="small" />
          )}
        </Space>
      ),
    },
    {
      title: '时间信息',
      key: 'time',
      render: (_: any, record: BackupRecord) => (
        <Space direction="vertical" size="small">
          <div>创建: {record.createTime}</div>
          {record.completeTime && (
            <div style={{ fontSize: '12px', color: '#666' }}>
              完成: {record.completeTime}
            </div>
          )}
          {record.duration && (
            <div style={{ fontSize: '12px', color: '#666' }}>
              耗时: {record.duration}秒
            </div>
          )}
        </Space>
      ),
    },
    {
      title: '保留策略',
      key: 'retention',
      render: (_: any, record: BackupRecord) => (
        <Space direction="vertical" size="small">
          <div>保留 {record.retention} 天</div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            {record.compression && <Tag color="blue">压缩</Tag>}
            {record.encryption && <Tag color="green">加密</Tag>}
          </div>
        </Space>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: BackupRecord) => (
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
            icon={<CloudDownloadOutlined />}
            onClick={() => handleRestore(record)}
          >
            恢复
          </Button>
          <Button
            type="link"
            size="small"
            icon={<DownloadOutlined />}
            onClick={() => handleDownload(record)}
          >
            下载
          </Button>
          <Button
            type="link"
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  const strategyColumns = [
    {
      title: '策略信息',
      key: 'info',
      render: (_: any, record: BackupStrategy) => (
        <Space direction="vertical" size="small">
          <div>
            <Text strong>{record.name}</Text>
            <Tag color={getTypeColor(record.type)} style={{ marginLeft: 8 }}>
              {getTypeText(record.type)}
            </Tag>
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            {record.schedule === 'daily' ? '每日' : record.schedule === 'weekly' ? '每周' : '每月'} {record.time}
          </div>
        </Space>
      ),
    },
    {
      title: '状态',
      key: 'status',
      render: (_: any, record: BackupStrategy) => (
        <Badge
          status={getStatusColor(record.status) as any}
          text={getStatusText(record.status)}
        />
      ),
    },
    {
      title: '保留策略',
      key: 'retention',
      render: (_: any, record: BackupStrategy) => (
        <Space direction="vertical" size="small">
          <div>保留 {record.retention} 天</div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            {record.compression && <Tag color="blue">压缩</Tag>}
            {record.encryption && <Tag color="green">加密</Tag>}
          </div>
        </Space>
      ),
    },
    {
      title: '执行时间',
      key: 'schedule',
      render: (_: any, record: BackupStrategy) => (
        <Space direction="vertical" size="small">
          {record.lastRun && (
            <div>上次: {record.lastRun}</div>
          )}
          {record.nextRun && (
            <div style={{ fontSize: '12px', color: '#666' }}>
              下次: {record.nextRun}
            </div>
          )}
        </Space>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: BackupStrategy) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEditStrategy(record)}
          >
            编辑
          </Button>
          <Button
            type="link"
            size="small"
            icon={<PlayCircleOutlined />}
            onClick={() => handleRunStrategy(record)}
          >
            立即执行
          </Button>
          <Button
            type="link"
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteStrategy(record)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  const restoreColumns = [
    {
      title: '恢复信息',
      key: 'info',
      render: (_: any, record: RestoreRecord) => (
        <Space direction="vertical" size="small">
          <div>
            <Text strong>{record.backupName}</Text>
            <Tag color={getTypeColor(record.type)} style={{ marginLeft: 8 }}>
              {getTypeText(record.type)}
            </Tag>
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            操作员: {record.operator}
          </div>
          {record.description && (
            <div style={{ fontSize: '12px', color: '#666' }}>
              {record.description}
            </div>
          )}
        </Space>
      ),
    },
    {
      title: '状态',
      key: 'status',
      render: (_: any, record: RestoreRecord) => (
        <Space direction="vertical" size="small">
          <Badge
            status={getStatusColor(record.status) as any}
            text={getStatusText(record.status)}
          />
          {record.status === 'in_progress' && (
            <Progress percent={60} size="small" />
          )}
        </Space>
      ),
    },
    {
      title: '时间信息',
      key: 'time',
      render: (_: any, record: RestoreRecord) => (
        <Space direction="vertical" size="small">
          <div>开始: {record.startTime}</div>
          {record.completeTime && (
            <div style={{ fontSize: '12px', color: '#666' }}>
              完成: {record.completeTime}
            </div>
          )}
          {record.duration && (
            <div style={{ fontSize: '12px', color: '#666' }}>
              耗时: {record.duration}秒
            </div>
          )}
        </Space>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: RestoreRecord) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleViewRestore(record)}
          >
            详情
          </Button>
          {record.status === 'in_progress' && (
            <Button
              type="link"
              size="small"
              icon={<StopOutlined />}
              onClick={() => handleStopRestore(record)}
            >
              停止
            </Button>
          )}
        </Space>
      ),
    },
  ];

  const handleViewDetails = (record: BackupRecord) => {
    setCurrentBackup(record);
    setDetailsModalVisible(true);
  };

  const handleRestore = (record: BackupRecord) => {
    setCurrentBackup(record);
    setRestoreModalVisible(true);
  };

  const handleDownload = (record: BackupRecord) => {
    message.success(`开始下载备份文件: ${record.name}`);
  };

  const handleDelete = (record: BackupRecord) => {
    Modal.confirm({
      title: '确认删除备份',
      content: `确定要删除备份 ${record.name} 吗？此操作不可恢复！`,
      onOk: () => {
        message.success('备份已删除');
      },
    });
  };

  const handleEditStrategy = (record: BackupStrategy) => {
    message.info('编辑备份策略');
  };

  const handleRunStrategy = (record: BackupStrategy) => {
    message.success(`开始执行备份策略: ${record.name}`);
  };

  const handleDeleteStrategy = (record: BackupStrategy) => {
    Modal.confirm({
      title: '确认删除策略',
      content: `确定要删除备份策略 ${record.name} 吗？`,
      onOk: () => {
        message.success('备份策略已删除');
      },
    });
  };

  const handleViewRestore = (record: RestoreRecord) => {
    message.info('查看恢复详情');
  };

  const handleStopRestore = (record: RestoreRecord) => {
    Modal.confirm({
      title: '确认停止恢复',
      content: '确定要停止当前的恢复操作吗？',
      onOk: () => {
        message.success('恢复操作已停止');
      },
    });
  };

  const handleExport = () => {
    message.success('备份记录导出成功');
  };

  // 统计数据
  const totalBackups = backupList.length;
  const completedBackups = backupList.filter(backup => backup.status === 'completed').length;
  const failedBackups = backupList.filter(backup => backup.status === 'failed').length;
  const totalSize = backupList.reduce((sum, backup) => sum + backup.size, 0);
  const activeStrategies = strategyList.filter(strategy => strategy.status === 'active').length;
  const totalRestores = restoreList.length;
  const completedRestores = restoreList.filter(restore => restore.status === 'completed').length;

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>
        <DatabaseOutlined style={{ marginRight: 8 }} />
        备份恢复管理
      </Title>

      {/* 统计卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={4}>
          <Card>
            <Statistic
              title="备份总数"
              value={totalBackups}
              prefix={<DatabaseOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={4}>
          <Card>
            <Statistic
              title="成功备份"
              value={completedBackups}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={4}>
          <Card>
            <Statistic
              title="失败备份"
              value={failedBackups}
              prefix={<CloseCircleOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={4}>
          <Card>
            <Statistic
              title="总备份大小"
              value={formatFileSize(totalSize)}
              prefix={<HddOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={4}>
          <Card>
            <Statistic
              title="活跃策略"
              value={activeStrategies}
              prefix={<ScheduleOutlined />}
              valueStyle={{ color: '#13c2c2' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={4}>
          <Card>
            <Statistic
              title="恢复操作"
              value={totalRestores}
              prefix={<CloudDownloadOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 主要内容 */}
      <Card>
        <div style={{ marginBottom: 16 }}>
          <Space>
            <Button type="primary" icon={<CloudUploadOutlined />}>
              立即备份
            </Button>
            <Button icon={<SettingOutlined />} onClick={() => setStrategyModalVisible(true)}>
              备份策略
            </Button>
            <Button icon={<ExportOutlined />} onClick={handleExport}>
              导出记录
            </Button>
            <Button icon={<ReloadOutlined />} onClick={loadData}>
              刷新
            </Button>
          </Space>
        </div>

        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="备份记录" key="backups">
            <Table
              columns={backupColumns}
              dataSource={backupList}
              rowKey="id"
              loading={loading}
              pagination={{
                total: backupList.length,
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
              }}
            />
          </TabPane>
          
          <TabPane tab="备份策略" key="strategies">
            <Table
              columns={strategyColumns}
              dataSource={strategyList}
              rowKey="id"
              loading={loading}
              pagination={{
                total: strategyList.length,
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
              }}
            />
          </TabPane>

          <TabPane tab="恢复记录" key="restores">
            <Table
              columns={restoreColumns}
              dataSource={restoreList}
              rowKey="id"
              loading={loading}
              pagination={{
                total: restoreList.length,
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
              }}
            />
          </TabPane>

          <TabPane tab="存储管理" key="storage">
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <Text type="secondary">存储管理功能开发中...</Text>
            </div>
          </TabPane>
        </Tabs>
      </Card>

      {/* 备份详情模态框 */}
      <Modal
        title="备份详情"
        open={detailsModalVisible}
        onCancel={() => setDetailsModalVisible(false)}
        footer={null}
        width={700}
      >
        {currentBackup && (
          <Descriptions column={2} bordered>
            <Descriptions.Item label="备份名称">{currentBackup.name}</Descriptions.Item>
            <Descriptions.Item label="备份类型">
              <Tag color={getTypeColor(currentBackup.type)}>
                {getTypeText(currentBackup.type)}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="备份分类">
              <Tag color={getTypeColor(currentBackup.category)}>
                {getTypeText(currentBackup.category)}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="文件大小">{formatFileSize(currentBackup.size)}</Descriptions.Item>
            <Descriptions.Item label="状态">
              <Badge
                status={getStatusColor(currentBackup.status) as any}
                text={getStatusText(currentBackup.status)}
              />
            </Descriptions.Item>
            <Descriptions.Item label="创建时间">{currentBackup.createTime}</Descriptions.Item>
            {currentBackup.completeTime && (
              <Descriptions.Item label="完成时间">{currentBackup.completeTime}</Descriptions.Item>
            )}
            {currentBackup.duration && (
              <Descriptions.Item label="执行时间">{currentBackup.duration}秒</Descriptions.Item>
            )}
            <Descriptions.Item label="存储位置">{currentBackup.location}</Descriptions.Item>
            <Descriptions.Item label="校验和">{currentBackup.checksum}</Descriptions.Item>
            <Descriptions.Item label="保留天数">{currentBackup.retention}天</Descriptions.Item>
            <Descriptions.Item label="压缩">{currentBackup.compression ? '是' : '否'}</Descriptions.Item>
            <Descriptions.Item label="加密">{currentBackup.encryption ? '是' : '否'}</Descriptions.Item>
            {currentBackup.description && (
              <Descriptions.Item label="描述" span={2}>
                {currentBackup.description}
              </Descriptions.Item>
            )}
          </Descriptions>
        )}
      </Modal>

      {/* 恢复备份模态框 */}
      <Modal
        title="恢复备份"
        open={restoreModalVisible}
        onCancel={() => setRestoreModalVisible(false)}
        onOk={() => {
          message.success('开始恢复备份');
          setRestoreModalVisible(false);
        }}
        width={600}
      >
        {currentBackup && (
          <div>
            <Alert
              message="恢复警告"
              description="恢复操作将覆盖当前数据，请确保已备份重要数据。"
              type="warning"
              showIcon
              style={{ marginBottom: 16 }}
            />
            
            <Steps current={currentStep} style={{ marginBottom: 24 }}>
              <Step title="选择备份" description="确认要恢复的备份" />
              <Step title="配置选项" description="设置恢复参数" />
              <Step title="执行恢复" description="开始恢复操作" />
            </Steps>

            <Descriptions column={1} bordered>
              <Descriptions.Item label="备份名称">{currentBackup.name}</Descriptions.Item>
              <Descriptions.Item label="备份类型">
                <Tag color={getTypeColor(currentBackup.type)}>
                  {getTypeText(currentBackup.type)}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="文件大小">{formatFileSize(currentBackup.size)}</Descriptions.Item>
              <Descriptions.Item label="创建时间">{currentBackup.createTime}</Descriptions.Item>
            </Descriptions>

            <Divider>恢复选项</Divider>
            <Form layout="vertical">
              <Form.Item label="恢复位置">
                <Select defaultValue="original">
                  <Option value="original">原始位置</Option>
                  <Option value="custom">自定义位置</Option>
                </Select>
              </Form.Item>
              <Form.Item label="覆盖现有数据">
                <Switch defaultChecked />
              </Form.Item>
              <Form.Item label="恢复说明">
                <TextArea rows={3} placeholder="请输入恢复说明" />
              </Form.Item>
            </Form>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default BackupRestore; 