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
  Calendar,
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
  Steps,
  Avatar,
} from 'antd';
import {
  ToolOutlined,
  CalendarOutlined,
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
  UserOutlined,
  SettingOutlined,
  SafetyOutlined,
  AlertOutlined,
  FileTextOutlined,
  TeamOutlined,
  StarOutlined,
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;
const { Option } = Select;
const { Step } = Steps;

interface MaintenancePlan {
  id: string;
  title: string;
  deviceType: string;
  deviceId: string;
  deviceName: string;
  maintenanceType: 'preventive' | 'corrective' | 'emergency';
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  scheduledDate: string;
  estimatedDuration: number;
  assignedTechnician: string;
  description: string;
  parts: string[];
  cost: number;
  location: string;
}

interface MaintenanceRecord {
  id: string;
  planId: string;
  title: string;
  deviceName: string;
  technician: string;
  startTime: string;
  endTime: string;
  status: 'completed' | 'in_progress' | 'cancelled';
  actualDuration: number;
  description: string;
  findings: string;
  actions: string[];
  partsUsed: string[];
  cost: number;
  quality: 'excellent' | 'good' | 'fair' | 'poor';
}

interface Technician {
  id: string;
  name: string;
  specialty: string;
  phone: string;
  email: string;
  status: 'available' | 'busy' | 'off_duty';
  currentTask?: string;
  completedTasks: number;
  rating: number;
}

const MaintenanceSchedule: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [maintenancePlans, setMaintenancePlans] = useState<MaintenancePlan[]>([]);
  const [maintenanceRecords, setMaintenanceRecords] = useState<MaintenanceRecord[]>([]);
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [selectedPlans, setSelectedPlans] = useState<string[]>([]);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [recordModalVisible, setRecordModalVisible] = useState(false);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<MaintenancePlan | null>(null);
  const [activeTab, setActiveTab] = useState('plans');

  // 模拟数据
  const mockMaintenancePlans: MaintenancePlan[] = [
    {
      id: '1',
      title: '空调系统定期维护',
      deviceType: 'HVAC',
      deviceId: 'HVAC-001',
      deviceName: '中央空调主机',
      maintenanceType: 'preventive',
      priority: 'medium',
      status: 'pending',
      scheduledDate: '2024-01-20',
      estimatedDuration: 4,
      assignedTechnician: '张工程师',
      description: '定期清洁滤网，检查制冷剂，校准温控系统',
      parts: ['空气滤网', '制冷剂', '温控传感器'],
      cost: 1200,
      location: '设备间A',
    },
    {
      id: '2',
      title: '电梯紧急维修',
      deviceType: 'Elevator',
      deviceId: 'ELV-002',
      deviceName: '客梯2号',
      maintenanceType: 'emergency',
      priority: 'critical',
      status: 'in_progress',
      scheduledDate: '2024-01-15',
      estimatedDuration: 6,
      assignedTechnician: '李技师',
      description: '电梯门感应器故障，需要更换传感器',
      parts: ['门感应器', '控制板'],
      cost: 2500,
      location: '2楼电梯间',
    },
    {
      id: '3',
      title: '消防系统检查',
      deviceType: 'Fire Safety',
      deviceId: 'FIRE-003',
      deviceName: '消防报警系统',
      maintenanceType: 'preventive',
      priority: 'high',
      status: 'completed',
      scheduledDate: '2024-01-10',
      estimatedDuration: 3,
      assignedTechnician: '王安全员',
      description: '检查所有消防设备，测试报警系统',
      parts: ['烟雾探测器', '报警器'],
      cost: 800,
      location: '全楼',
    },
    {
      id: '4',
      title: '网络设备维护',
      deviceType: 'Network',
      deviceId: 'NET-004',
      deviceName: '核心交换机',
      maintenanceType: 'preventive',
      priority: 'medium',
      status: 'pending',
      scheduledDate: '2024-01-25',
      estimatedDuration: 2,
      assignedTechnician: '陈网络师',
      description: '更新固件，检查网络连接，优化性能',
      parts: ['网络线缆', '备用电源'],
      cost: 600,
      location: '机房',
    },
    {
      id: '5',
      title: '厨房设备维修',
      deviceType: 'Kitchen',
      deviceId: 'KIT-005',
      deviceName: '商用冰箱',
      maintenanceType: 'corrective',
      priority: 'high',
      status: 'pending',
      scheduledDate: '2024-01-18',
      estimatedDuration: 5,
      assignedTechnician: '赵维修师',
      description: '冰箱制冷效果差，需要检查压缩机',
      parts: ['压缩机', '制冷剂', '温控器'],
      cost: 1800,
      location: '厨房',
    },
  ];

  const mockMaintenanceRecords: MaintenanceRecord[] = [
    {
      id: '1',
      planId: '3',
      title: '消防系统检查',
      deviceName: '消防报警系统',
      technician: '王安全员',
      startTime: '2024-01-10 09:00',
      endTime: '2024-01-10 12:30',
      status: 'completed',
      actualDuration: 3.5,
      description: '检查所有消防设备，测试报警系统',
      findings: '发现3个烟雾探测器需要更换',
      actions: ['更换烟雾探测器', '校准报警器', '更新维护记录'],
      partsUsed: ['烟雾探测器 x3', '报警器 x1'],
      cost: 800,
      quality: 'excellent',
    },
    {
      id: '2',
      planId: '2',
      title: '电梯紧急维修',
      deviceName: '客梯2号',
      technician: '李技师',
      startTime: '2024-01-15 14:00',
      endTime: '2024-01-15 20:30',
      status: 'completed',
      actualDuration: 6.5,
      description: '电梯门感应器故障，需要更换传感器',
      findings: '门感应器老化，控制板有轻微损坏',
      actions: ['更换门感应器', '修复控制板', '测试运行'],
      partsUsed: ['门感应器 x1', '控制板 x1'],
      cost: 2500,
      quality: 'good',
    },
  ];

  const mockTechnicians: Technician[] = [
    {
      id: '1',
      name: '张工程师',
      specialty: 'HVAC系统',
      phone: '13800138001',
      email: 'zhang@hotel.com',
      status: 'available',
      completedTasks: 45,
      rating: 4.8,
    },
    {
      id: '2',
      name: '李技师',
      specialty: '电梯维修',
      phone: '13800138002',
      email: 'li@hotel.com',
      status: 'busy',
      currentTask: '电梯紧急维修',
      completedTasks: 38,
      rating: 4.6,
    },
    {
      id: '3',
      name: '王安全员',
      specialty: '消防系统',
      phone: '13800138003',
      email: 'wang@hotel.com',
      status: 'available',
      completedTasks: 52,
      rating: 4.9,
    },
    {
      id: '4',
      name: '陈网络师',
      specialty: '网络设备',
      phone: '13800138004',
      email: 'chen@hotel.com',
      status: 'available',
      completedTasks: 29,
      rating: 4.7,
    },
    {
      id: '5',
      name: '赵维修师',
      specialty: '厨房设备',
      phone: '13800138005',
      email: 'zhao@hotel.com',
      status: 'off_duty',
      completedTasks: 41,
      rating: 4.5,
    },
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setLoading(true);
    // 模拟API调用
    setTimeout(() => {
      setMaintenancePlans(mockMaintenancePlans);
      setMaintenanceRecords(mockMaintenanceRecords);
      setTechnicians(mockTechnicians);
      setLoading(false);
    }, 1000);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low':
        return 'blue';
      case 'medium':
        return 'orange';
      case 'high':
        return 'red';
      case 'critical':
        return 'purple';
      default:
        return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'orange';
      case 'in_progress':
        return 'blue';
      case 'completed':
        return 'green';
      case 'cancelled':
        return 'red';
      case 'available':
        return 'green';
      case 'busy':
        return 'orange';
      case 'off_duty':
        return 'default';
      default:
        return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return '待执行';
      case 'in_progress':
        return '进行中';
      case 'completed':
        return '已完成';
      case 'cancelled':
        return '已取消';
      case 'preventive':
        return '预防性';
      case 'corrective':
        return '纠正性';
      case 'emergency':
        return '紧急';
      case 'available':
        return '可用';
      case 'busy':
        return '忙碌';
      case 'off_duty':
        return '休息';
      default:
        return '未知';
    }
  };

  const planColumns = [
    {
      title: '维护计划',
      key: 'plan',
      render: (_: any, record: MaintenancePlan) => (
        <Space direction="vertical" size="small">
          <div>
            <Text strong>{record.title}</Text>
            <Tag color="blue" style={{ marginLeft: 8 }}>{record.deviceType}</Tag>
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            设备: {record.deviceName} ({record.deviceId})
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            位置: {record.location}
          </div>
        </Space>
      ),
    },
    {
      title: '类型/优先级',
      key: 'type_priority',
      render: (_: any, record: MaintenancePlan) => (
        <Space direction="vertical" size="small">
          <Tag color="blue">{getStatusText(record.maintenanceType)}</Tag>
          <Tag color={getPriorityColor(record.priority)}>
            {record.priority.toUpperCase()}
          </Tag>
        </Space>
      ),
    },
    {
      title: '状态',
      key: 'status',
      render: (_: any, record: MaintenancePlan) => (
        <Space direction="vertical" size="small">
          <Badge
            status={getStatusColor(record.status) as any}
            text={getStatusText(record.status)}
          />
          <div style={{ fontSize: '12px', color: '#666' }}>
            预计时长: {record.estimatedDuration}小时
          </div>
        </Space>
      ),
    },
    {
      title: '时间安排',
      key: 'schedule',
      render: (_: any, record: MaintenancePlan) => (
        <Space direction="vertical" size="small">
          <div>计划日期: {record.scheduledDate}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            负责人: {record.assignedTechnician}
          </div>
        </Space>
      ),
    },
    {
      title: '成本',
      key: 'cost',
      render: (_: any, record: MaintenancePlan) => (
        <Text strong style={{ color: '#1890ff' }}>
          ¥{record.cost.toLocaleString()}
        </Text>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: MaintenancePlan) => (
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
          <Button
            type="link"
            size="small"
            icon={<FileTextOutlined />}
            onClick={() => handleStartMaintenance(record)}
          >
            开始维护
          </Button>
        </Space>
      ),
    },
  ];

  const recordColumns = [
    {
      title: '维护记录',
      key: 'record',
      render: (_: any, record: MaintenanceRecord) => (
        <Space direction="vertical" size="small">
          <div>
            <Text strong>{record.title}</Text>
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            设备: {record.deviceName}
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            技师: {record.technician}
          </div>
        </Space>
      ),
    },
    {
      title: '执行时间',
      key: 'time',
      render: (_: any, record: MaintenanceRecord) => (
        <Space direction="vertical" size="small">
          <div>开始: {record.startTime}</div>
          <div>结束: {record.endTime}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            实际时长: {record.actualDuration}小时
          </div>
        </Space>
      ),
    },
    {
      title: '状态/质量',
      key: 'status_quality',
      render: (_: any, record: MaintenanceRecord) => (
        <Space direction="vertical" size="small">
          <Badge
            status={getStatusColor(record.status) as any}
            text={getStatusText(record.status)}
          />
          <div style={{ fontSize: '12px', color: '#666' }}>
            质量: {record.quality}
          </div>
        </Space>
      ),
    },
    {
      title: '成本',
      key: 'cost',
      render: (_: any, record: MaintenanceRecord) => (
        <Text strong style={{ color: '#1890ff' }}>
          ¥{record.cost.toLocaleString()}
        </Text>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: MaintenanceRecord) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleViewRecord(record)}
          >
            详情
          </Button>
          <Button
            type="link"
            size="small"
            icon={<FileTextOutlined />}
            onClick={() => handleGenerateReport(record)}
          >
            生成报告
          </Button>
        </Space>
      ),
    },
  ];

  const technicianColumns = [
    {
      title: '技师信息',
      key: 'info',
      render: (_: any, record: Technician) => (
        <Space>
          <Avatar icon={<UserOutlined />} />
          <div>
            <div>
              <Text strong>{record.name}</Text>
              <Tag color="blue" style={{ marginLeft: 8 }}>{record.specialty}</Tag>
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              {record.phone} | {record.email}
            </div>
          </div>
        </Space>
      ),
    },
    {
      title: '状态',
      key: 'status',
      render: (_: any, record: Technician) => (
        <Space direction="vertical" size="small">
          <Badge
            status={getStatusColor(record.status) as any}
            text={getStatusText(record.status)}
          />
          {record.currentTask && (
            <div style={{ fontSize: '12px', color: '#666' }}>
              当前任务: {record.currentTask}
            </div>
          )}
        </Space>
      ),
    },
    {
      title: '绩效',
      key: 'performance',
      render: (_: any, record: Technician) => (
        <Space direction="vertical" size="small">
          <div>完成任务: {record.completedTasks}</div>
          <div>评分: <StarOutlined style={{ color: '#faad14' }} /> {record.rating}</div>
        </Space>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Technician) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleViewTechnician(record)}
          >
            详情
          </Button>
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEditTechnician(record)}
          >
            编辑
          </Button>
        </Space>
      ),
    },
  ];

  const handleViewDetails = (record: MaintenancePlan) => {
    setCurrentPlan(record);
    setDetailsModalVisible(true);
  };

  const handleEdit = (record: MaintenancePlan) => {
    setCurrentPlan(record);
    setEditModalVisible(true);
  };

  const handleStartMaintenance = (record: MaintenancePlan) => {
    message.success(`开始执行维护计划: ${record.title}`);
  };

  const handleViewRecord = (record: MaintenanceRecord) => {
    message.info('查看维护记录详情');
  };

  const handleGenerateReport = (record: MaintenanceRecord) => {
    message.success('维护报告生成成功');
  };

  const handleViewTechnician = (record: Technician) => {
    message.info('查看技师详情');
  };

  const handleEditTechnician = (record: Technician) => {
    message.info('编辑技师信息');
  };

  const handleExport = () => {
    message.success('数据导出成功');
  };

  const handleImport = () => {
    message.info('数据导入功能开发中...');
  };

  // 统计数据
  const totalPlans = maintenancePlans.length;
  const pendingPlans = maintenancePlans.filter(plan => plan.status === 'pending').length;
  const inProgressPlans = maintenancePlans.filter(plan => plan.status === 'in_progress').length;
  const completedPlans = maintenancePlans.filter(plan => plan.status === 'completed').length;
  const totalCost = maintenancePlans.reduce((sum, plan) => sum + plan.cost, 0);
  const availableTechnicians = technicians.filter(tech => tech.status === 'available').length;

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>
        <ToolOutlined style={{ marginRight: 8 }} />
        维护计划管理
      </Title>

      {/* 统计卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={4}>
          <Card>
            <Statistic
              title="总维护计划"
              value={totalPlans}
              prefix={<CalendarOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={4}>
          <Card>
            <Statistic
              title="待执行"
              value={pendingPlans}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={4}>
          <Card>
            <Statistic
              title="进行中"
              value={inProgressPlans}
              prefix={<ExclamationCircleOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={4}>
          <Card>
            <Statistic
              title="已完成"
              value={completedPlans}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={4}>
          <Card>
            <Statistic
              title="预计总成本"
              value={totalCost}
              prefix="¥"
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={4}>
          <Card>
            <Statistic
              title="可用技师"
              value={availableTechnicians}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 主要内容 */}
      <Card>
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="维护计划" key="plans">
            <div style={{ marginBottom: 16 }}>
              <Space>
                <Button type="primary" icon={<CalendarOutlined />}>
                  新增计划
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
              columns={planColumns}
              dataSource={maintenancePlans}
              rowKey="id"
              loading={loading}
              pagination={{
                total: maintenancePlans.length,
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
              }}
            />
          </TabPane>
          
          <TabPane tab="维护记录" key="records">
            <div style={{ marginBottom: 16 }}>
              <Space>
                <Button type="primary" icon={<FileTextOutlined />}>
                  新增记录
                </Button>
                <Button icon={<ExportOutlined />}>
                  导出记录
                </Button>
                <Button icon={<SearchOutlined />}>
                  搜索记录
                </Button>
              </Space>
            </div>
            <Table
              columns={recordColumns}
              dataSource={maintenanceRecords}
              rowKey="id"
              loading={loading}
              pagination={{
                total: maintenanceRecords.length,
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
              }}
            />
          </TabPane>

          <TabPane tab="技师管理" key="technicians">
            <div style={{ marginBottom: 16 }}>
              <Space>
                <Button type="primary" icon={<UserOutlined />}>
                  新增技师
                </Button>
                <Button icon={<ExportOutlined />}>
                  导出技师信息
                </Button>
                <Button icon={<SearchOutlined />}>
                  搜索技师
                </Button>
              </Space>
            </div>
            <Table
              columns={technicianColumns}
              dataSource={technicians}
              rowKey="id"
              loading={loading}
              pagination={{
                total: technicians.length,
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
              }}
            />
          </TabPane>

          <TabPane tab="维护日历" key="calendar">
            <Calendar
              fullscreen={false}
              headerRender={({ value, onChange }) => {
                const start = 0;
                const current = value.month();
                const months = [...Array(12)].map((_, i) => {
                  const month = (i + start) % 12;
                  return {
                    label: `${month + 1}月`,
                    value: month,
                  };
                });

                return (
                  <div style={{ padding: '8px 0' }}>
                    <Select
                      size="small"
                      dropdownMatchSelectWidth={false}
                      value={current}
                      style={{ width: 80 }}
                      onChange={(newMonth) => {
                        const now = value.clone().month(newMonth);
                        onChange(now);
                      }}
                    >
                      {months.map((month) => (
                        <Option key={month.value} value={month.value}>
                          {month.label}
                        </Option>
                      ))}
                    </Select>
                  </div>
                );
              }}
            />
          </TabPane>
        </Tabs>
      </Card>

      {/* 维护计划详情模态框 */}
      <Modal
        title="维护计划详情"
        open={detailsModalVisible}
        onCancel={() => setDetailsModalVisible(false)}
        footer={null}
        width={700}
      >
        {currentPlan && (
          <div>
            <Descriptions column={2} bordered style={{ marginBottom: 16 }}>
              <Descriptions.Item label="计划标题">{currentPlan.title}</Descriptions.Item>
              <Descriptions.Item label="设备类型">{currentPlan.deviceType}</Descriptions.Item>
              <Descriptions.Item label="设备名称">{currentPlan.deviceName}</Descriptions.Item>
              <Descriptions.Item label="设备ID">{currentPlan.deviceId}</Descriptions.Item>
              <Descriptions.Item label="维护类型">
                <Tag color="blue">{getStatusText(currentPlan.maintenanceType)}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="优先级">
                <Tag color={getPriorityColor(currentPlan.priority)}>
                  {currentPlan.priority.toUpperCase()}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="状态">
                <Badge
                  status={getStatusColor(currentPlan.status) as any}
                  text={getStatusText(currentPlan.status)}
                />
              </Descriptions.Item>
              <Descriptions.Item label="计划日期">{currentPlan.scheduledDate}</Descriptions.Item>
              <Descriptions.Item label="预计时长">{currentPlan.estimatedDuration}小时</Descriptions.Item>
              <Descriptions.Item label="负责人">{currentPlan.assignedTechnician}</Descriptions.Item>
              <Descriptions.Item label="位置">{currentPlan.location}</Descriptions.Item>
              <Descriptions.Item label="预计成本">¥{currentPlan.cost.toLocaleString()}</Descriptions.Item>
            </Descriptions>
            
            <Divider>维护描述</Divider>
            <Text>{currentPlan.description}</Text>
            
            <Divider>所需配件</Divider>
            <Space wrap>
              {currentPlan.parts.map((part, index) => (
                <Tag key={index} color="blue">{part}</Tag>
              ))}
            </Space>
          </div>
        )}
      </Modal>

      {/* 编辑维护计划模态框 */}
      <Modal
        title="编辑维护计划"
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        onOk={() => {
          message.success('维护计划更新成功');
          setEditModalVisible(false);
        }}
        width={600}
      >
        <Form layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="计划标题">
                <Input defaultValue={currentPlan?.title} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="设备类型">
                <Select defaultValue={currentPlan?.deviceType}>
                  <Option value="HVAC">HVAC系统</Option>
                  <Option value="Elevator">电梯</Option>
                  <Option value="Fire Safety">消防系统</Option>
                  <Option value="Network">网络设备</Option>
                  <Option value="Kitchen">厨房设备</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="维护类型">
                <Select defaultValue={currentPlan?.maintenanceType}>
                  <Option value="preventive">预防性</Option>
                  <Option value="corrective">纠正性</Option>
                  <Option value="emergency">紧急</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="优先级">
                <Select defaultValue={currentPlan?.priority}>
                  <Option value="low">低</Option>
                  <Option value="medium">中</Option>
                  <Option value="high">高</Option>
                  <Option value="critical">紧急</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="计划日期">
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="预计时长(小时)">
                <Input type="number" defaultValue={currentPlan?.estimatedDuration} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="维护描述">
            <Input.TextArea rows={3} defaultValue={currentPlan?.description} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default MaintenanceSchedule; 