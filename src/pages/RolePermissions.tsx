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
  Typography,
  Divider,
  Tooltip,
  Badge,
  Tabs,
  List,
  Descriptions,
  Tree,
  Checkbox,
  message,
  Transfer,
  Drawer,
  Alert,
} from 'antd';
import {
  KeyOutlined,
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
  TeamOutlined,
  SettingOutlined,
  SecurityScanOutlined,
  FileTextOutlined,
  StarOutlined,
  UserOutlined,
  SafetyOutlined,
  DatabaseOutlined,
  HomeOutlined,
  RobotOutlined,
  BarChartOutlined,
  ToolOutlined,
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;
const { TextArea } = Input;

interface Role {
  id: string;
  name: string;
  code: string;
  description: string;
  permissions: string[];
  userCount: number;
  status: 'active' | 'inactive';
  createTime: string;
  updateTime: string;
  level: number;
  parentRole?: string;
  children?: Role[];
}

interface Permission {
  id: string;
  name: string;
  code: string;
  description: string;
  module: string;
  type: 'menu' | 'button' | 'api';
  status: 'active' | 'inactive';
  createTime: string;
}

interface PermissionGroup {
  title: string;
  key: string;
  children: Permission[];
}

const RolePermissions: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [roleList, setRoleList] = useState<Role[]>([]);
  const [permissionList, setPermissionList] = useState<Permission[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [permissionModalVisible, setPermissionModalVisible] = useState(false);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [currentRole, setCurrentRole] = useState<Role | null>(null);
  const [activeTab, setActiveTab] = useState('roles');

  // 模拟数据
  const mockRoles: Role[] = [
    {
      id: '1',
      name: '超级管理员',
      code: 'SUPER_ADMIN',
      description: '拥有系统所有权限，可以管理所有用户和系统设置',
      permissions: ['*'],
      userCount: 1,
      status: 'active',
      createTime: '2023-01-01',
      updateTime: '2025-07-10',
      level: 1,
    },
    {
      id: '2',
      name: '系统管理员',
      code: 'SYSTEM_ADMIN',
      description: '系统管理权限，可以管理用户、角色和系统配置',
      permissions: ['user:*', 'role:*', 'system:*'],
      userCount: 2,
      status: 'active',
      createTime: '2023-02-01',
      updateTime: '2025-07-05',
      level: 2,
      parentRole: '1',
    },
    {
      id: '3',
      name: '部门经理',
      code: 'DEPT_MANAGER',
      description: '部门管理权限，可以管理本部门用户和数据',
      permissions: ['user:read', 'user:write', 'room:*', 'staff:*'],
      userCount: 5,
      status: 'active',
      createTime: '2023-03-01',
      updateTime: '2025-07-01',
      level: 3,
      parentRole: '2',
    },
    {
      id: '4',
      name: '普通员工',
      code: 'STAFF',
      description: '基础操作权限，可以查看和操作分配的功能',
      permissions: ['room:read', 'inventory:read', 'report:read'],
      userCount: 20,
      status: 'active',
      createTime: '2023-04-01',
      updateTime: '2025-07-01',
      level: 4,
      parentRole: '3',
    },
    {
      id: '5',
      name: '财务专员',
      code: 'FINANCE',
      description: '财务相关操作权限',
      permissions: ['finance:*', 'report:read', 'inventory:read'],
      userCount: 3,
      status: 'active',
      createTime: '2023-05-01',
      updateTime: '2025-07-08',
      level: 3,
      parentRole: '2',
    },
    {
      id: '6',
      name: '访客',
      code: 'GUEST',
      description: '仅可查看公开信息',
      permissions: ['public:read'],
      userCount: 10,
      status: 'active',
      createTime: '2025-07-01',
      updateTime: '2025-07-10',
      level: 5,
      parentRole: '4',
    },
  ];

  const mockPermissions: Permission[] = [
    // 用户管理权限
    { id: '1', name: '查看用户', code: 'user:read', description: '查看用户列表和详情', module: '用户管理', type: 'menu', status: 'active', createTime: '2023-01-01' },
    { id: '2', name: '创建用户', code: 'user:create', description: '创建新用户', module: '用户管理', type: 'button', status: 'active', createTime: '2023-01-01' },
    { id: '3', name: '编辑用户', code: 'user:write', description: '编辑用户信息', module: '用户管理', type: 'button', status: 'active', createTime: '2023-01-01' },
    { id: '4', name: '删除用户', code: 'user:delete', description: '删除用户', module: '用户管理', type: 'button', status: 'active', createTime: '2023-01-01' },
    
    // 角色管理权限
    { id: '5', name: '查看角色', code: 'role:read', description: '查看角色列表和详情', module: '角色管理', type: 'menu', status: 'active', createTime: '2023-01-01' },
    { id: '6', name: '创建角色', code: 'role:create', description: '创建新角色', module: '角色管理', type: 'button', status: 'active', createTime: '2023-01-01' },
    { id: '7', name: '编辑角色', code: 'role:write', description: '编辑角色信息', module: '角色管理', type: 'button', status: 'active', createTime: '2023-01-01' },
    { id: '8', name: '删除角色', code: 'role:delete', description: '删除角色', module: '角色管理', type: 'button', status: 'active', createTime: '2023-01-01' },
    
    // 房间管理权限
    { id: '9', name: '查看房间', code: 'room:read', description: '查看房间列表和详情', module: '房间管理', type: 'menu', status: 'active', createTime: '2023-01-01' },
    { id: '10', name: '创建房间', code: 'room:create', description: '创建新房间', module: '房间管理', type: 'button', status: 'active', createTime: '2023-01-01' },
    { id: '11', name: '编辑房间', code: 'room:write', description: '编辑房间信息', module: '房间管理', type: 'button', status: 'active', createTime: '2023-01-01' },
    { id: '12', name: '删除房间', code: 'room:delete', description: '删除房间', module: '房间管理', type: 'button', status: 'active', createTime: '2023-01-01' },
    
    // 库存管理权限
    { id: '13', name: '查看库存', code: 'inventory:read', description: '查看库存列表和详情', module: '库存管理', type: 'menu', status: 'active', createTime: '2023-01-01' },
    { id: '14', name: '入库操作', code: 'inventory:in', description: '执行入库操作', module: '库存管理', type: 'button', status: 'active', createTime: '2023-01-01' },
    { id: '15', name: '出库操作', code: 'inventory:out', description: '执行出库操作', module: '库存管理', type: 'button', status: 'active', createTime: '2023-01-01' },
    { id: '16', name: '库存调整', code: 'inventory:adjust', description: '调整库存数量', module: '库存管理', type: 'button', status: 'active', createTime: '2023-01-01' },
    
    // 财务权限
    { id: '17', name: '查看财务', code: 'finance:read', description: '查看财务数据', module: '财务管理', type: 'menu', status: 'active', createTime: '2023-01-01' },
    { id: '18', name: '财务录入', code: 'finance:write', description: '录入财务数据', module: '财务管理', type: 'button', status: 'active', createTime: '2023-01-01' },
    { id: '19', name: '财务审核', code: 'finance:approve', description: '审核财务数据', module: '财务管理', type: 'button', status: 'active', createTime: '2023-01-01' },
    
    // 系统管理权限
    { id: '20', name: '系统设置', code: 'system:config', description: '系统配置管理', module: '系统管理', type: 'menu', status: 'active', createTime: '2023-01-01' },
    { id: '21', name: '日志查看', code: 'system:log', description: '查看系统日志', module: '系统管理', type: 'menu', status: 'active', createTime: '2023-01-01' },
    { id: '22', name: '备份恢复', code: 'system:backup', description: '系统备份恢复', module: '系统管理', type: 'menu', status: 'active', createTime: '2023-01-01' },
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setLoading(true);
    // 模拟API调用
    setTimeout(() => {
      setRoleList(mockRoles);
      setPermissionList(mockPermissions);
      setLoading(false);
    }, 1000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'green';
      case 'inactive':
        return 'red';
      default:
        return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return '启用';
      case 'inactive':
        return '停用';
      default:
        return '未知';
    }
  };

  const getLevelColor = (level: number) => {
    switch (level) {
      case 1:
        return 'red';
      case 2:
        return 'orange';
      case 3:
        return 'blue';
      case 4:
        return 'green';
      case 5:
        return 'purple';
      default:
        return 'default';
    }
  };

  const roleColumns = [
    {
      title: '角色信息',
      key: 'info',
      render: (_: any, record: Role) => (
        <Space direction="vertical" size="small">
          <div>
            <Text strong>{record.name}</Text>
            <Tag color={getLevelColor(record.level)} style={{ marginLeft: 8 }}>
              级别 {record.level}
            </Tag>
            <Tag color="blue" style={{ marginLeft: 8 }}>
              {record.userCount} 用户
            </Tag>
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            代码: {record.code}
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
      title: '权限数量',
      key: 'permissions',
      render: (_: any, record: Role) => (
        <Space direction="vertical" size="small">
          <div>
            <Text strong>{record.permissions.length}</Text> 个权限
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            {record.permissions.includes('*') ? '所有权限' : '部分权限'}
          </div>
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
            onClick={() => handleViewDetails(record)}
          >
            详情
          </Button>
          <Button
            type="link"
            size="small"
            icon={<KeyOutlined />}
            onClick={() => handleManagePermissions(record)}
          >
            权限
          </Button>
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
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

  const permissionColumns = [
    {
      title: '权限信息',
      key: 'info',
      render: (_: any, record: Permission) => (
        <Space direction="vertical" size="small">
          <div>
            <Text strong>{record.name}</Text>
            <Tag color="blue" style={{ marginLeft: 8 }}>
              {record.module}
            </Tag>
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            代码: {record.code}
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            {record.description}
          </div>
        </Space>
      ),
    },
    {
      title: '类型',
      key: 'type',
      render: (_: any, record: Permission) => (
        <Tag color={record.type === 'menu' ? 'green' : record.type === 'button' ? 'blue' : 'orange'}>
          {record.type === 'menu' ? '菜单' : record.type === 'button' ? '按钮' : 'API'}
        </Tag>
      ),
    },
    {
      title: '状态',
      key: 'status',
      render: (_: any, record: Permission) => (
        <Badge
          status={getStatusColor(record.status) as any}
          text={getStatusText(record.status)}
        />
      ),
    },
    {
      title: '创建时间',
      key: 'createTime',
      render: (_: any, record: Permission) => (
        <Text>{record.createTime}</Text>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Permission) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEditPermission(record)}
          >
            编辑
          </Button>
          <Button
            type="link"
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeletePermission(record)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  const handleViewDetails = (record: Role) => {
    setCurrentRole(record);
    setDetailsModalVisible(true);
  };

  const handleEdit = (record: Role) => {
    setCurrentRole(record);
    setEditModalVisible(true);
  };

  const handleManagePermissions = (record: Role) => {
    setCurrentRole(record);
    setPermissionModalVisible(true);
  };

  const handleDelete = (record: Role) => {
    Modal.confirm({
      title: '确认删除角色',
      content: `确定要删除角色 ${record.name} 吗？此操作不可恢复！`,
      onOk: () => {
        message.success('角色已删除');
      },
    });
  };

  const handleEditPermission = (record: Permission) => {
    message.info('编辑权限信息');
  };

  const handleDeletePermission = (record: Permission) => {
    Modal.confirm({
      title: '确认删除权限',
      content: `确定要删除权限 ${record.name} 吗？`,
      onOk: () => {
        message.success('权限已删除');
      },
    });
  };

  const handleExport = () => {
    message.success('数据导出成功');
  };

  const handleImport = () => {
    message.info('数据导入功能开发中...');
  };

  // 构建权限树数据
  const buildPermissionTree = () => {
    const modules = Array.from(new Set(permissionList.map(p => p.module)));
    return modules.map(module => ({
      title: module,
      key: module,
      children: permissionList
        .filter(p => p.module === module)
        .map(p => ({
          title: p.name,
          key: p.code,
          description: p.description,
        })),
    }));
  };

  // 统计数据
  const totalRoles = roleList.length;
  const activeRoles = roleList.filter(role => role.status === 'active').length;
  const totalPermissions = permissionList.length;
  const activePermissions = permissionList.filter(p => p.status === 'active').length;
  const totalUsers = roleList.reduce((sum, role) => sum + role.userCount, 0);

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>
        <KeyOutlined style={{ marginRight: 8 }} />
        角色权限管理
      </Title>

      {/* 统计卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={4}>
          <Card>
            <Statistic
              title="角色总数"
              value={totalRoles}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={4}>
          <Card>
            <Statistic
              title="活跃角色"
              value={activeRoles}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={4}>
          <Card>
            <Statistic
              title="权限总数"
              value={totalPermissions}
              prefix={<KeyOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={4}>
          <Card>
            <Statistic
              title="活跃权限"
              value={activePermissions}
              prefix={<StarOutlined />}
              valueStyle={{ color: '#13c2c2' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={4}>
          <Card>
            <Statistic
              title="用户总数"
              value={totalUsers}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={4}>
          <Card>
            <Statistic
              title="权限模块"
              value={Array.from(new Set(permissionList.map(p => p.module))).length}
              prefix={<DatabaseOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 主要内容 */}
      <Card>
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="角色管理" key="roles">
            <div style={{ marginBottom: 16 }}>
              <Space>
                <Button type="primary" icon={<UserAddOutlined />}>
                  新增角色
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
          
          <TabPane tab="权限管理" key="permissions">
            <div style={{ marginBottom: 16 }}>
              <Space>
                <Button type="primary" icon={<KeyOutlined />}>
                  新增权限
                </Button>
                <Button icon={<ExportOutlined />}>
                  导出权限
                </Button>
                <Button icon={<SearchOutlined />}>
                  搜索权限
                </Button>
              </Space>
            </div>
            <Table
              columns={permissionColumns}
              dataSource={permissionList}
              rowKey="id"
              loading={loading}
              pagination={{
                total: permissionList.length,
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
              }}
            />
          </TabPane>

          <TabPane tab="权限矩阵" key="matrix">
            <div style={{ marginBottom: 16 }}>
              <Text type="secondary">显示角色与权限的对应关系</Text>
            </div>
            <Table
              columns={[
                {
                  title: '角色',
                  dataIndex: 'name',
                  key: 'name',
                  fixed: 'left',
                  width: 150,
                },
                ...permissionList.map(p => ({
                  title: p.name,
                  dataIndex: p.code,
                  key: p.code,
                  width: 100,
                  render: (value: any, record: Role) => (
                    <Checkbox
                      checked={record.permissions.includes('*') || record.permissions.includes(p.code)}
                      disabled={record.permissions.includes('*')}
                    />
                  ),
                })),
              ]}
              dataSource={roleList}
              rowKey="id"
              scroll={{ x: 'max-content' }}
              pagination={false}
            />
          </TabPane>
        </Tabs>
      </Card>

      {/* 角色详情模态框 */}
      <Modal
        title="角色详情"
        open={detailsModalVisible}
        onCancel={() => setDetailsModalVisible(false)}
        footer={null}
        width={700}
      >
        {currentRole && (
          <div>
            <Descriptions column={2} bordered style={{ marginBottom: 16 }}>
              <Descriptions.Item label="角色名称">{currentRole.name}</Descriptions.Item>
              <Descriptions.Item label="角色代码">{currentRole.code}</Descriptions.Item>
              <Descriptions.Item label="角色级别">
                <Tag color={getLevelColor(currentRole.level)}>级别 {currentRole.level}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="用户数量">{currentRole.userCount}</Descriptions.Item>
              <Descriptions.Item label="状态">
                <Badge
                  status={getStatusColor(currentRole.status) as any}
                  text={getStatusText(currentRole.status)}
                />
              </Descriptions.Item>
              <Descriptions.Item label="创建时间">{currentRole.createTime}</Descriptions.Item>
              <Descriptions.Item label="更新时间">{currentRole.updateTime}</Descriptions.Item>
              <Descriptions.Item label="描述" span={2}>
                {currentRole.description}
              </Descriptions.Item>
            </Descriptions>
            
            <Divider>权限列表</Divider>
            <Space wrap>
              {currentRole.permissions.includes('*') ? (
                <Tag color="red">所有权限</Tag>
              ) : (
                currentRole.permissions.map((permission, index) => (
                  <Tag key={index} color="blue">{permission}</Tag>
                ))
              )}
            </Space>
          </div>
        )}
      </Modal>

      {/* 编辑角色模态框 */}
      <Modal
        title="编辑角色"
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        onOk={() => {
          message.success('角色信息更新成功');
          setEditModalVisible(false);
        }}
        width={600}
      >
        <Form layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="角色名称">
                <Input defaultValue={currentRole?.name} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="角色代码">
                <Input defaultValue={currentRole?.code} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="角色级别">
            <Select defaultValue={currentRole?.level}>
              <Option value={1}>级别 1 - 超级管理员</Option>
              <Option value={2}>级别 2 - 系统管理员</Option>
              <Option value={3}>级别 3 - 部门经理</Option>
              <Option value={4}>级别 4 - 普通员工</Option>
              <Option value={5}>级别 5 - 访客</Option>
            </Select>
          </Form.Item>
          <Form.Item label="状态">
            <Select defaultValue={currentRole?.status}>
              <Option value="active">启用</Option>
              <Option value="inactive">停用</Option>
            </Select>
          </Form.Item>
          <Form.Item label="角色描述">
            <TextArea rows={3} defaultValue={currentRole?.description} />
          </Form.Item>
        </Form>
      </Modal>

      {/* 权限管理模态框 */}
      <Drawer
        title={`管理权限 - ${currentRole?.name}`}
        open={permissionModalVisible}
        onClose={() => setPermissionModalVisible(false)}
        width={600}
        footer={
          <Space>
            <Button onClick={() => setPermissionModalVisible(false)}>取消</Button>
            <Button type="primary" onClick={() => {
              message.success('权限更新成功');
              setPermissionModalVisible(false);
            }}>
              保存
            </Button>
          </Space>
        }
      >
        {currentRole && (
          <div>
            <div style={{ marginBottom: 16 }}>
              <Text strong>当前角色: {currentRole.name}</Text>
              <br />
              <Text type="secondary">选择该角色拥有的权限</Text>
            </div>
            <Tree
              checkable
              defaultExpandAll
              treeData={buildPermissionTree()}
              defaultCheckedKeys={currentRole.permissions.includes('*') ? [] : currentRole.permissions}
              disabled={currentRole.permissions.includes('*')}
            />
            {currentRole.permissions.includes('*') && (
              <Alert
                message="该角色拥有所有权限"
                type="info"
                showIcon
                style={{ marginTop: 16 }}
              />
            )}
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default RolePermissions; 