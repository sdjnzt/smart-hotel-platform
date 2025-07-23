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
  KeyOutlined,
  UserOutlined,
  LockOutlined,
  UnlockOutlined,
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
  SafetyOutlined,
  TeamOutlined,
  CalendarOutlined,
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

interface AccessDevice {
  id: string;
  name: string;
  location: string;
  type: 'card' | 'fingerprint' | 'face' | 'password' | 'mobile';
  status: 'normal' | 'locked' | 'maintenance' | 'offline';
  lastAccess: string;
  authorizedUsers: number;
  deniedAttempts: number;
  battery: number;
  signal: number;
}

interface AccessUser {
  id: string;
  name: string;
  cardNumber: string;
  department: string;
  role: 'guest' | 'staff' | 'manager' | 'admin';
  status: 'active' | 'inactive' | 'expired';
  accessLevel: 'public' | 'staff' | 'restricted' | 'admin';
  validFrom: string;
  validTo: string;
  lastAccess: string;
  accessCount: number;
}

interface AccessRecord {
  id: string;
  userId: string;
  userName: string;
  deviceId: string;
  deviceName: string;
  accessType: 'granted' | 'denied' | 'timeout';
  timestamp: string;
  location: string;
  reason?: string;
}

const AccessControl: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [devices, setDevices] = useState<AccessDevice[]>([]);
  const [users, setUsers] = useState<AccessUser[]>([]);
  const [records, setRecords] = useState<AccessRecord[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [deviceModalVisible, setDeviceModalVisible] = useState(false);
  const [userModalVisible, setUserModalVisible] = useState(false);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('devices');

  // 模拟数据
  const mockDevices: AccessDevice[] = [
    {
      id: '1',
      name: '大堂门禁-01',
      location: '大堂入口',
      type: 'card',
      status: 'normal',
      lastAccess: '2025-07-23 14:30:00',
      authorizedUsers: 45,
      deniedAttempts: 2,
      battery: 85,
      signal: 95,
    },
    {
      id: '2',
      name: '员工通道门禁-01',
      location: '员工通道',
      type: 'fingerprint',
      status: 'normal',
      lastAccess: '2025-07-23 14:25:00',
      authorizedUsers: 28,
      deniedAttempts: 0,
      battery: 92,
      signal: 88,
    },
    {
      id: '3',
      name: '机房门禁-01',
      location: '设备机房',
      type: 'face',
      status: 'locked',
      lastAccess: '2025-07-23 12:30:00',
      authorizedUsers: 5,
      deniedAttempts: 1,
      battery: 78,
      signal: 75,
    },
    {
      id: '4',
      name: '财务室门禁-01',
      location: '财务室',
      type: 'password',
      status: 'normal',
      lastAccess: '2025-07-23 14:15:00',
      authorizedUsers: 8,
      deniedAttempts: 0,
      battery: 95,
      signal: 90,
    },
    {
      id: '5',
      name: '停车场门禁-01',
      location: '地下停车场',
      type: 'mobile',
      status: 'maintenance',
      lastAccess: '2025-07-23 10:00:00',
      authorizedUsers: 120,
      deniedAttempts: 5,
      battery: 45,
      signal: 60,
    },
  ];

  const mockUsers: AccessUser[] = [
    {
      id: '1',
      name: '张三',
      cardNumber: 'EMP001',
      department: '客房部',
      role: 'staff',
      status: 'active',
      accessLevel: 'staff',
      validFrom: '2025-07-01',
      validTo: '2024-12-31',
      lastAccess: '2025-07-23 14:30:00',
      accessCount: 156,
    },
    {
      id: '2',
      name: '李四',
      cardNumber: 'EMP002',
      department: '餐饮部',
      role: 'manager',
      status: 'active',
      accessLevel: 'restricted',
      validFrom: '2025-07-01',
      validTo: '2024-12-31',
      lastAccess: '2025-07-23 14:25:00',
      accessCount: 89,
    },
    {
      id: '3',
      name: '王五',
      cardNumber: 'GUEST001',
      department: '客人',
      role: 'guest',
      status: 'active',
      accessLevel: 'public',
      validFrom: '2025-07-23',
      validTo: '2025-07-17',
      lastAccess: '2025-07-23 14:20:00',
      accessCount: 12,
    },
    {
      id: '4',
      name: '赵六',
      cardNumber: 'ADMIN001',
      department: '管理部',
      role: 'admin',
      status: 'active',
      accessLevel: 'admin',
      validFrom: '2025-07-01',
      validTo: '2024-12-31',
      lastAccess: '2025-07-23 14:15:00',
      accessCount: 234,
    },
  ];

  const mockRecords: AccessRecord[] = [
    {
      id: '1',
      userId: '1',
      userName: '张三',
      deviceId: '1',
      deviceName: '大堂门禁-01',
      accessType: 'granted',
      timestamp: '2025-07-23 14:30:00',
      location: '大堂入口',
    },
    {
      id: '2',
      userId: '2',
      userName: '李四',
      deviceId: '2',
      deviceName: '员工通道门禁-01',
      accessType: 'granted',
      timestamp: '2025-07-23 14:25:00',
      location: '员工通道',
    },
    {
      id: '3',
      userId: '3',
      userName: '王五',
      deviceId: '1',
      deviceName: '大堂门禁-01',
      accessType: 'denied',
      timestamp: '2025-07-23 14:20:00',
      location: '大堂入口',
      reason: '权限不足',
    },
    {
      id: '4',
      userId: '4',
      userName: '赵六',
      deviceId: '3',
      deviceName: '机房门禁-01',
      accessType: 'granted',
      timestamp: '2025-07-23 14:15:00',
      location: '设备机房',
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
      setUsers(mockUsers);
      setRecords(mockRecords);
      setLoading(false);
    }, 1000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal':
      case 'active':
      case 'granted':
        return 'green';
      case 'locked':
      case 'denied':
        return 'red';
      case 'maintenance':
      case 'timeout':
        return 'orange';
      case 'offline':
      case 'inactive':
      case 'expired':
        return 'default';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'normal':
      case 'active':
        return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
      case 'locked':
      case 'denied':
        return <CloseCircleOutlined style={{ color: '#ff4d4f' }} />;
      case 'maintenance':
      case 'timeout':
        return <ExclamationCircleOutlined style={{ color: '#faad14' }} />;
      case 'offline':
      case 'inactive':
      case 'expired':
        return <ClockCircleOutlined style={{ color: '#d9d9d9' }} />;
      default:
        return <ClockCircleOutlined />;
    }
  };

  const getStatusText = (status: string) => {
    const statusMap: { [key: string]: string } = {
      normal: '正常',
      locked: '锁定',
      maintenance: '维护中',
      offline: '离线',
      active: '激活',
      inactive: '未激活',
      expired: '已过期',
      granted: '允许',
      denied: '拒绝',
      timeout: '超时',
    };
    return statusMap[status] || status;
  };

  const getTypeText = (type: string) => {
    const typeMap: { [key: string]: string } = {
      card: '刷卡',
      fingerprint: '指纹',
      face: '人脸识别',
      password: '密码',
      mobile: '手机',
    };
    return typeMap[type] || type;
  };

  const getRoleText = (role: string) => {
    const roleMap: { [key: string]: string } = {
      guest: '客人',
      staff: '员工',
      manager: '经理',
      admin: '管理员',
    };
    return roleMap[role] || role;
  };

  const getAccessLevelText = (level: string) => {
    const levelMap: { [key: string]: string } = {
      public: '公共区域',
      staff: '员工区域',
      restricted: '受限区域',
      admin: '管理区域',
    };
    return levelMap[level] || level;
  };

  const deviceColumns = [
    {
      title: '设备信息',
      key: 'info',
      render: (_: any, record: AccessDevice) => (
        <Space>
          <Avatar size="large" icon={<KeyOutlined />} />
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
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => <Tag color="blue">{getTypeText(type)}</Tag>,
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
      title: '授权用户',
      dataIndex: 'authorizedUsers',
      key: 'authorizedUsers',
    },
    {
      title: '拒绝次数',
      dataIndex: 'deniedAttempts',
      key: 'deniedAttempts',
      render: (value: number) => (
        <Text style={{ color: value > 0 ? '#ff4d4f' : '#52c41a' }}>
          {value}
        </Text>
      ),
    },
    {
      title: '电池电量',
      dataIndex: 'battery',
      key: 'battery',
      render: (value: number) => (
        <Space direction="vertical" size="small" style={{ width: '100%' }}>
          <Text strong>{value}%</Text>
          <Progress
            percent={value}
            size="small"
            strokeColor={value > 80 ? '#52c41a' : value > 60 ? '#faad14' : '#ff4d4f'}
            showInfo={false}
          />
        </Space>
      ),
    },
    {
      title: '信号强度',
      dataIndex: 'signal',
      key: 'signal',
      render: (value: number) => (
        <Space direction="vertical" size="small" style={{ width: '100%' }}>
          <Text strong>{value}%</Text>
          <Progress
            percent={value}
            size="small"
            strokeColor={value > 80 ? '#52c41a' : value > 60 ? '#faad14' : '#ff4d4f'}
            showInfo={false}
          />
        </Space>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: AccessDevice) => (
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

  const userColumns = [
    {
      title: '用户信息',
      key: 'info',
      render: (_: any, record: AccessUser) => (
        <Space>
          <Avatar size="large" icon={<UserOutlined />} />
          <div>
            <div>
              <Text strong>{record.name}</Text>
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              {record.cardNumber} | {record.department}
            </div>
          </div>
        </Space>
      ),
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => <Tag color="purple">{getRoleText(role)}</Tag>,
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
      title: '访问级别',
      dataIndex: 'accessLevel',
      key: 'accessLevel',
      render: (level: string) => <Tag color="cyan">{getAccessLevelText(level)}</Tag>,
    },
    {
      title: '有效期',
      key: 'validity',
      render: (_: any, record: AccessUser) => (
        <div>
          <div>{record.validFrom}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>至 {record.validTo}</div>
        </div>
      ),
    },
    {
      title: '访问次数',
      dataIndex: 'accessCount',
      key: 'accessCount',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: AccessUser) => (
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
            icon={<EditOutlined />}
            onClick={() => handleEditUser(record)}
          >
            编辑
          </Button>
        </Space>
      ),
    },
  ];

  const recordColumns = [
    {
      title: '用户',
      dataIndex: 'userName',
      key: 'userName',
    },
    {
      title: '设备',
      dataIndex: 'deviceName',
      key: 'deviceName',
    },
    {
      title: '访问类型',
      dataIndex: 'accessType',
      key: 'accessType',
      render: (type: string) => (
        <Space>
          {getStatusIcon(type)}
          <Badge
            status={getStatusColor(type) as any}
            text={getStatusText(type)}
          />
        </Space>
      ),
    },
    {
      title: '位置',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: '时间',
      dataIndex: 'timestamp',
      key: 'timestamp',
    },
    {
      title: '原因',
      dataIndex: 'reason',
      key: 'reason',
      render: (reason: string) => reason || '-',
    },
  ];

  const handleViewDetails = (record: any) => {
    setSelectedItem(record);
    setDetailsModalVisible(true);
  };

  const handleSettings = (record: any) => {
    setDeviceModalVisible(true);
  };

  const handleEditUser = (record: any) => {
    setUserModalVisible(true);
  };

  const handleExport = () => {
    Modal.success({
      title: '导出成功',
      content: '门禁系统数据已成功导出到Excel文件',
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
          <KeyOutlined style={{ marginRight: 8 }} />
          门禁管理
        </Title>
        <Text type="secondary">
          管理酒店门禁设备、用户权限和访问记录
        </Text>
      </div>

      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="门禁设备"
              value={devices.length}
              prefix={<KeyOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="在线设备"
              value={devices.filter(d => d.status === 'normal').length}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="授权用户"
              value={users.filter(u => u.status === 'active').length}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="今日访问"
              value={records.filter(r => r.timestamp.includes('2025-07-23')).length}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#fa8c16' }}
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
            icon={<PlusOutlined />}
            onClick={() => setDeviceModalVisible(true)}
          >
            添加设备
          </Button>
          <Button
            icon={<TeamOutlined />}
            onClick={() => setUserModalVisible(true)}
          >
            添加用户
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
          <TabPane tab="设备管理" key="devices">
            <Table
              columns={deviceColumns}
              dataSource={devices}
              rowKey="id"
              loading={loading}
              rowSelection={rowSelection}
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
          <TabPane tab="用户管理" key="users">
            <Table
              columns={userColumns}
              dataSource={users}
              rowKey="id"
              loading={loading}
              pagination={{
                total: users.length,
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
              }}
            />
          </TabPane>
          <TabPane tab="访问记录" key="records">
            <Table
              columns={recordColumns}
              dataSource={records}
              rowKey="id"
              loading={loading}
              pagination={{
                total: records.length,
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
            {selectedItem.type && (
              <Descriptions.Item label="类型">
                {getTypeText(selectedItem.type)}
              </Descriptions.Item>
            )}
            {selectedItem.authorizedUsers && (
              <Descriptions.Item label="授权用户">
                {selectedItem.authorizedUsers}
              </Descriptions.Item>
            )}
            {selectedItem.deniedAttempts && (
              <Descriptions.Item label="拒绝次数">
                {selectedItem.deniedAttempts}
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

      {/* 设备设置模态框 */}
      <Modal
        title="设备设置"
        open={deviceModalVisible}
        onCancel={() => setDeviceModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setDeviceModalVisible(false)}>
            取消
          </Button>,
          <Button key="submit" type="primary" onClick={() => {
            message.success('设置已保存');
            setDeviceModalVisible(false);
          }}>
            保存
          </Button>,
        ]}
        width={600}
      >
        <Form layout="vertical">
          <Form.Item label="设备名称" name="name">
            <Input placeholder="请输入设备名称" />
          </Form.Item>
          <Form.Item label="位置" name="location">
            <Input placeholder="请输入设备位置" />
          </Form.Item>
          <Form.Item label="设备类型" name="type">
            <Select placeholder="请选择设备类型">
              <Select.Option value="card">刷卡</Select.Option>
              <Select.Option value="fingerprint">指纹</Select.Option>
              <Select.Option value="face">人脸识别</Select.Option>
              <Select.Option value="password">密码</Select.Option>
              <Select.Option value="mobile">手机</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="设备状态" name="status">
            <Select placeholder="请选择设备状态">
              <Select.Option value="normal">正常</Select.Option>
              <Select.Option value="locked">锁定</Select.Option>
              <Select.Option value="maintenance">维护中</Select.Option>
              <Select.Option value="offline">离线</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* 用户管理模态框 */}
      <Modal
        title="用户管理"
        open={userModalVisible}
        onCancel={() => setUserModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setUserModalVisible(false)}>
            取消
          </Button>,
          <Button key="submit" type="primary" onClick={() => {
            message.success('用户信息已保存');
            setUserModalVisible(false);
          }}>
            保存
          </Button>,
        ]}
        width={600}
      >
        <Form layout="vertical">
          <Form.Item label="姓名" name="name">
            <Input placeholder="请输入用户姓名" />
          </Form.Item>
          <Form.Item label="卡号" name="cardNumber">
            <Input placeholder="请输入卡号" />
          </Form.Item>
          <Form.Item label="部门" name="department">
            <Input placeholder="请输入部门" />
          </Form.Item>
          <Form.Item label="角色" name="role">
            <Select placeholder="请选择角色">
              <Select.Option value="guest">客人</Select.Option>
              <Select.Option value="staff">员工</Select.Option>
              <Select.Option value="manager">经理</Select.Option>
              <Select.Option value="admin">管理员</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="访问级别" name="accessLevel">
            <Select placeholder="请选择访问级别">
              <Select.Option value="public">公共区域</Select.Option>
              <Select.Option value="staff">员工区域</Select.Option>
              <Select.Option value="restricted">受限区域</Select.Option>
              <Select.Option value="admin">管理区域</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="有效期" name="validity">
            <RangePicker style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AccessControl; 