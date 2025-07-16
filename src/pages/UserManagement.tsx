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
  Avatar,
  Upload,
  Drawer,
} from 'antd';
import {
  UserOutlined,
  UserAddOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  ExportOutlined,
  ImportOutlined,
  SearchOutlined,
  FilterOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  ClockCircleOutlined,
  LockOutlined,
  UnlockOutlined,
  KeyOutlined,
  TeamOutlined,
  SettingOutlined,
  SecurityScanOutlined,
  FileTextOutlined,
  StarOutlined,
  MailOutlined,
  PhoneOutlined,
  IdcardOutlined,
  GlobalOutlined,
  CalendarOutlined,
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;
const { Option } = Select;
const { TextArea } = Input;

interface User {
  id: string;
  username: string;
  realName: string;
  email: string;
  phone: string;
  avatar?: string;
  role: string;
  department: string;
  status: 'active' | 'inactive' | 'locked' | 'pending';
  lastLogin: string;
  loginCount: number;
  createTime: string;
  lastPasswordChange: string;
  permissions: string[];
  ipWhitelist?: string[];
  twoFactorEnabled: boolean;
  loginHistory: LoginRecord[];
}

interface LoginRecord {
  id: string;
  userId: string;
  loginTime: string;
  logoutTime?: string;
  ipAddress: string;
  userAgent: string;
  status: 'success' | 'failed';
  location?: string;
}

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  userCount: number;
  status: 'active' | 'inactive';
  createTime: string;
  updateTime: string;
}

const UserManagement: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [userList, setUserList] = useState<User[]>([]);
  const [roleList, setRoleList] = useState<Role[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [roleModalVisible, setRoleModalVisible] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('users');

  // 模拟数据
  const mockUsers: User[] = [
    {
      id: '1',
      username: 'admin',
      realName: '系统管理员',
      email: 'admin@hotel.com',
      phone: '13800138001',
      role: '超级管理员',
      department: '信息技术部',
      status: 'active',
      lastLogin: '2024-01-15 14:30',
      loginCount: 1250,
      createTime: '2023-01-01',
      lastPasswordChange: '2024-01-10',
      permissions: ['user:read', 'user:write', 'user:delete', 'system:admin'],
      twoFactorEnabled: true,
      loginHistory: [
        {
          id: '1',
          userId: '1',
          loginTime: '2024-01-15 14:30',
          logoutTime: '2024-01-15 18:00',
          ipAddress: '192.168.1.100',
          userAgent: 'Chrome/120.0.0.0',
          status: 'success',
          location: '山东省济宁市',
        },
      ],
    },
    {
      id: '2',
      username: 'manager',
      realName: '张经理',
      email: 'zhang@hotel.com',
      phone: '13800138002',
      role: '部门经理',
      department: '前厅部',
      status: 'active',
      lastLogin: '2024-01-15 09:15',
      loginCount: 856,
      createTime: '2023-03-15',
      lastPasswordChange: '2024-01-05',
      permissions: ['user:read', 'room:read', 'room:write'],
      twoFactorEnabled: false,
      loginHistory: [],
    },
    {
      id: '3',
      username: 'staff001',
      realName: '李员工',
      email: 'li@hotel.com',
      phone: '13800138003',
      role: '普通员工',
      department: '客房部',
      status: 'active',
      lastLogin: '2024-01-15 08:00',
      loginCount: 342,
      createTime: '2023-06-20',
      lastPasswordChange: '2024-01-01',
      permissions: ['room:read'],
      twoFactorEnabled: false,
      loginHistory: [],
    },
    {
      id: '4',
      username: 'finance',
      realName: '王财务',
      email: 'wang@hotel.com',
      phone: '13800138004',
      role: '财务专员',
      department: '财务部',
      status: 'locked',
      lastLogin: '2024-01-14 16:45',
      loginCount: 567,
      createTime: '2023-04-10',
      lastPasswordChange: '2024-01-08',
      permissions: ['finance:read', 'finance:write'],
      twoFactorEnabled: true,
      loginHistory: [],
    },
    {
      id: '5',
      username: 'guest',
      realName: '陈访客',
      email: 'chen@hotel.com',
      phone: '13800138005',
      role: '访客',
      department: '外部用户',
      status: 'pending',
      lastLogin: '2024-01-15 10:20',
      loginCount: 23,
      createTime: '2024-01-10',
      lastPasswordChange: '2024-01-10',
      permissions: ['public:read'],
      twoFactorEnabled: false,
      loginHistory: [],
    },
  ];

  const mockRoles: Role[] = [
    {
      id: '1',
      name: '超级管理员',
      description: '拥有系统所有权限，可以管理所有用户和系统设置',
      permissions: ['user:read', 'user:write', 'user:delete', 'system:admin', 'role:admin'],
      userCount: 1,
      status: 'active',
      createTime: '2023-01-01',
      updateTime: '2024-01-10',
    },
    {
      id: '2',
      name: '部门经理',
      description: '可以管理本部门用户，查看部门相关数据',
      permissions: ['user:read', 'room:read', 'room:write', 'staff:read'],
      userCount: 3,
      status: 'active',
      createTime: '2023-02-01',
      updateTime: '2024-01-05',
    },
    {
      id: '3',
      name: '普通员工',
      description: '基础操作权限，可以查看和操作分配的功能',
      permissions: ['room:read', 'inventory:read'],
      userCount: 15,
      status: 'active',
      createTime: '2023-03-01',
      updateTime: '2024-01-01',
    },
    {
      id: '4',
      name: '财务专员',
      description: '财务相关操作权限',
      permissions: ['finance:read', 'finance:write', 'report:read'],
      userCount: 2,
      status: 'active',
      createTime: '2023-04-01',
      updateTime: '2024-01-08',
    },
    {
      id: '5',
      name: '访客',
      description: '仅可查看公开信息',
      permissions: ['public:read'],
      userCount: 5,
      status: 'active',
      createTime: '2024-01-01',
      updateTime: '2024-01-10',
    },
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setLoading(true);
    // 模拟API调用
    setTimeout(() => {
      setUserList(mockUsers);
      setRoleList(mockRoles);
      setLoading(false);
    }, 1000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'green';
      case 'inactive':
        return 'default';
      case 'locked':
        return 'red';
      case 'pending':
        return 'orange';
      default:
        return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return '正常';
      case 'inactive':
        return '停用';
      case 'locked':
        return '锁定';
      case 'pending':
        return '待审核';
      default:
        return '未知';
    }
  };

  const userColumns = [
    {
      title: '用户信息',
      key: 'info',
      render: (_: any, record: User) => (
        <Space>
          <Avatar size="large" src={record.avatar} icon={<UserOutlined />} />
          <div>
            <div>
              <Text strong>{record.realName}</Text>
              <Text code style={{ marginLeft: 8 }}>{record.username}</Text>
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              {record.department} - {record.role}
            </div>
          </div>
        </Space>
      ),
    },
    {
      title: '联系方式',
      key: 'contact',
      render: (_: any, record: User) => (
        <Space direction="vertical" size="small">
          <Space>
            <MailOutlined />
            <Text>{record.email}</Text>
          </Space>
          <Space>
            <PhoneOutlined />
            <Text>{record.phone}</Text>
          </Space>
        </Space>
      ),
    },
    {
      title: '状态',
      key: 'status',
      render: (_: any, record: User) => (
        <Space direction="vertical" size="small">
          <Badge
            status={getStatusColor(record.status) as any}
            text={getStatusText(record.status)}
          />
          {record.twoFactorEnabled && (
            <Tag color="blue" icon={<SecurityScanOutlined />}>
              2FA
            </Tag>
          )}
        </Space>
      ),
    },
    {
      title: '登录信息',
      key: 'login',
      render: (_: any, record: User) => (
        <Space direction="vertical" size="small">
          <div>最后登录: {record.lastLogin}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            登录次数: {record.loginCount}
          </div>
        </Space>
      ),
    },
    {
      title: '权限',
      key: 'permissions',
      render: (_: any, record: User) => (
        <Space wrap>
          {record.permissions.slice(0, 3).map((permission, index) => (
            <Tag key={index} color="blue">
              {permission}
            </Tag>
          ))}
          {record.permissions.length > 3 && (
            <Tag color="blue">
              +{record.permissions.length - 3}
            </Tag>
          )}
        </Space>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: User) => (
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
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          {record.status === 'locked' ? (
            <Button
              type="link"
              size="small"
              icon={<UnlockOutlined />}
              onClick={() => handleUnlock(record)}
            >
              解锁
            </Button>
          ) : (
            <Button
              type="link"
              size="small"
              icon={<LockOutlined />}
              onClick={() => handleLock(record)}
            >
              锁定
            </Button>
          )}
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

  const roleColumns = [
    {
      title: '角色信息',
      key: 'info',
      render: (_: any, record: Role) => (
        <Space direction="vertical" size="small">
          <div>
            <Text strong>{record.name}</Text>
            <Tag color="blue" style={{ marginLeft: 8 }}>
              {record.userCount} 用户
            </Tag>
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            {record.description}
          </div>
        </Space>
      ),
    },
    {
      title: '状态',
      key: 'status',
      render: (_: any, record: Role) => (
        <Badge
          status={getStatusColor(record.status) as any}
          text={getStatusText(record.status)}
        />
      ),
    },
    {
      title: '权限',
      key: 'permissions',
      render: (_: any, record: Role) => (
        <Space wrap>
          {record.permissions.slice(0, 3).map((permission, index) => (
            <Tag key={index} color="green">
              {permission}
            </Tag>
          ))}
          {record.permissions.length > 3 && (
            <Tag color="green">
              +{record.permissions.length - 3}
            </Tag>
          )}
        </Space>
      ),
    },
    {
      title: '更新时间',
      key: 'updateTime',
      render: (_: any, record: Role) => (
        <Text>{record.updateTime}</Text>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Role) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleViewRole(record)}
          >
            详情
          </Button>
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEditRole(record)}
          >
            编辑
          </Button>
          <Button
            type="link"
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteRole(record)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  const handleViewDetails = (record: User) => {
    setCurrentUser(record);
    setDetailsModalVisible(true);
  };

  const handleEdit = (record: User) => {
    setCurrentUser(record);
    setEditModalVisible(true);
  };

  const handleLock = (record: User) => {
    Modal.confirm({
      title: '确认锁定用户',
      content: `确定要锁定用户 ${record.realName} 吗？`,
      onOk: () => {
        message.success('用户已锁定');
      },
    });
  };

  const handleUnlock = (record: User) => {
    Modal.confirm({
      title: '确认解锁用户',
      content: `确定要解锁用户 ${record.realName} 吗？`,
      onOk: () => {
        message.success('用户已解锁');
      },
    });
  };

  const handleDelete = (record: User) => {
    Modal.confirm({
      title: '确认删除用户',
      content: `确定要删除用户 ${record.realName} 吗？此操作不可恢复！`,
      onOk: () => {
        message.success('用户已删除');
      },
    });
  };

  const handleViewRole = (record: Role) => {
    message.info('查看角色详情');
  };

  const handleEditRole = (record: Role) => {
    message.info('编辑角色信息');
  };

  const handleDeleteRole = (record: Role) => {
    Modal.confirm({
      title: '确认删除角色',
      content: `确定要删除角色 ${record.name} 吗？此操作不可恢复！`,
      onOk: () => {
        message.success('角色已删除');
      },
    });
  };

  const handleExport = () => {
    message.success('数据导出成功');
  };

  const handleImport = () => {
    message.info('数据导入功能开发中...');
  };

  // 统计数据
  const totalUsers = userList.length;
  const activeUsers = userList.filter(user => user.status === 'active').length;
  const lockedUsers = userList.filter(user => user.status === 'locked').length;
  const pendingUsers = userList.filter(user => user.status === 'pending').length;
  const totalRoles = roleList.length;
  const activeRoles = roleList.filter(role => role.status === 'active').length;

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>
        <UserOutlined style={{ marginRight: 8 }} />
        用户管理
      </Title>

      {/* 统计卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={4}>
          <Card>
            <Statistic
              title="总用户数"
              value={totalUsers}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={4}>
          <Card>
            <Statistic
              title="活跃用户"
              value={activeUsers}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={4}>
          <Card>
            <Statistic
              title="锁定用户"
              value={lockedUsers}
              prefix={<LockOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={4}>
          <Card>
            <Statistic
              title="待审核用户"
              value={pendingUsers}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={4}>
          <Card>
            <Statistic
              title="角色总数"
              value={totalRoles}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={4}>
          <Card>
            <Statistic
              title="活跃角色"
              value={activeRoles}
              prefix={<StarOutlined />}
              valueStyle={{ color: '#13c2c2' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 主要内容 */}
      <Card>
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="用户管理" key="users">
            <div style={{ marginBottom: 16 }}>
              <Space>
                <Button type="primary" icon={<UserAddOutlined />}>
                  新增用户
                </Button>
                <Button icon={<ExportOutlined />} onClick={handleExport}>
                  导出数据
                </Button>
                <Button icon={<ImportOutlined />} onClick={handleImport}>
                  导入数据
                </Button>
                <Button icon={<SearchOutlined />}>
                  高级搜索
                </Button>
              </Space>
            </div>
            <Table
              columns={userColumns}
              dataSource={userList}
              rowKey="id"
              loading={loading}
              pagination={{
                total: userList.length,
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
              }}
            />
          </TabPane>
          
          <TabPane tab="角色管理" key="roles">
            <div style={{ marginBottom: 16 }}>
              <Space>
                <Button type="primary" icon={<UserAddOutlined />}>
                  新增角色
                </Button>
                <Button icon={<ExportOutlined />}>
                  导出角色
                </Button>
                <Button icon={<SearchOutlined />}>
                  搜索角色
                </Button>
              </Space>
            </div>
            <Table
              columns={roleColumns}
              dataSource={roleList}
              rowKey="id"
              loading={loading}
              pagination={{
                total: roleList.length,
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

      {/* 用户详情模态框 */}
      <Modal
        title="用户详情"
        open={detailsModalVisible}
        onCancel={() => setDetailsModalVisible(false)}
        footer={null}
        width={700}
      >
        {currentUser && (
          <div>
            <Descriptions column={2} bordered style={{ marginBottom: 16 }}>
              <Descriptions.Item label="用户名">{currentUser.username}</Descriptions.Item>
              <Descriptions.Item label="真实姓名">{currentUser.realName}</Descriptions.Item>
              <Descriptions.Item label="邮箱">{currentUser.email}</Descriptions.Item>
              <Descriptions.Item label="电话">{currentUser.phone}</Descriptions.Item>
              <Descriptions.Item label="角色">{currentUser.role}</Descriptions.Item>
              <Descriptions.Item label="部门">{currentUser.department}</Descriptions.Item>
              <Descriptions.Item label="状态">
                <Badge
                  status={getStatusColor(currentUser.status) as any}
                  text={getStatusText(currentUser.status)}
                />
              </Descriptions.Item>
              <Descriptions.Item label="创建时间">{currentUser.createTime}</Descriptions.Item>
              <Descriptions.Item label="最后登录">{currentUser.lastLogin}</Descriptions.Item>
              <Descriptions.Item label="登录次数">{currentUser.loginCount}</Descriptions.Item>
              <Descriptions.Item label="最后密码修改">{currentUser.lastPasswordChange}</Descriptions.Item>
              <Descriptions.Item label="双因素认证">
                {currentUser.twoFactorEnabled ? '已启用' : '未启用'}
              </Descriptions.Item>
            </Descriptions>
            
            <Divider>权限列表</Divider>
            <Space wrap>
              {currentUser.permissions.map((permission, index) => (
                <Tag key={index} color="blue">{permission}</Tag>
              ))}
            </Space>

            {currentUser.loginHistory.length > 0 && (
              <>
                <Divider>最近登录记录</Divider>
                <List
                  size="small"
                  dataSource={currentUser.loginHistory}
                  renderItem={(item) => (
                    <List.Item>
                      <Space direction="vertical" size="small" style={{ width: '100%' }}>
                        <div>
                          <Text strong>{item.loginTime}</Text>
                          <Tag color={item.status === 'success' ? 'green' : 'red'} style={{ marginLeft: 8 }}>
                            {item.status === 'success' ? '成功' : '失败'}
                          </Tag>
                        </div>
                        <div style={{ fontSize: '12px', color: '#666' }}>
                          IP: {item.ipAddress} | 位置: {item.location || '未知'}
                        </div>
                      </Space>
                    </List.Item>
                  )}
                />
              </>
            )}
          </div>
        )}
      </Modal>

      {/* 编辑用户模态框 */}
      <Modal
        title="编辑用户"
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        onOk={() => {
          message.success('用户信息更新成功');
          setEditModalVisible(false);
        }}
        width={600}
      >
        <Form layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="用户名">
                <Input defaultValue={currentUser?.username} disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="真实姓名">
                <Input defaultValue={currentUser?.realName} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="邮箱">
                <Input defaultValue={currentUser?.email} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="电话">
                <Input defaultValue={currentUser?.phone} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="角色">
                <Select defaultValue={currentUser?.role}>
                  <Option value="超级管理员">超级管理员</Option>
                  <Option value="部门经理">部门经理</Option>
                  <Option value="普通员工">普通员工</Option>
                  <Option value="财务专员">财务专员</Option>
                  <Option value="访客">访客</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="部门">
                <Select defaultValue={currentUser?.department}>
                  <Option value="信息技术部">信息技术部</Option>
                  <Option value="前厅部">前厅部</Option>
                  <Option value="客房部">客房部</Option>
                  <Option value="财务部">财务部</Option>
                  <Option value="外部用户">外部用户</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="状态">
            <Select defaultValue={currentUser?.status}>
              <Option value="active">正常</Option>
              <Option value="inactive">停用</Option>
              <Option value="locked">锁定</Option>
              <Option value="pending">待审核</Option>
            </Select>
          </Form.Item>
          <Form.Item label="双因素认证">
            <Switch defaultChecked={currentUser?.twoFactorEnabled} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserManagement; 