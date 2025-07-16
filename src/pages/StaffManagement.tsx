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
  Upload,
  Avatar,
  Typography,
  Divider,
  Tooltip,
  Badge,
  Tabs,
  Calendar,
  List,
  Descriptions,
} from 'antd';
import {
  TeamOutlined,
  UserAddOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  ExportOutlined,
  ImportOutlined,
  SearchOutlined,
  FilterOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  PhoneOutlined,
  MailOutlined,
  IdcardOutlined,
  BankOutlined,
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

interface Staff {
  id: string;
  name: string;
  employeeId: string;
  department: string;
  position: string;
  phone: string;
  email: string;
  status: 'active' | 'inactive' | 'leave';
  joinDate: string;
  avatar?: string;
  salary: number;
  workSchedule: string;
  lastAttendance: string;
}

interface Attendance {
  id: string;
  staffId: string;
  staffName: string;
  date: string;
  checkIn: string;
  checkOut: string;
  status: 'present' | 'absent' | 'late' | 'leave';
  workHours: number;
}

const StaffManagement: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [attendanceList, setAttendanceList] = useState<Attendance[]>([]);
  const [selectedStaff, setSelectedStaff] = useState<string[]>([]);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [currentStaff, setCurrentStaff] = useState<Staff | null>(null);
  const [activeTab, setActiveTab] = useState('staff');

  // 模拟数据
  const mockStaff: Staff[] = [
    {
      id: '1',
      name: '陈雅琪',
      employeeId: 'EMP001',
      department: '前厅部',
      position: '前台接待',
      phone: '13800138001',
      email: 'chenyaqi@hotel.com',
      status: 'active',
      joinDate: '2023-01-15',
      salary: 4500,
      workSchedule: '早班 8:00-16:00',
      lastAttendance: '2025-07-15 08:05',
    },
    {
      id: '2',
      name: '刘志强',
      employeeId: 'EMP002',
      department: '客房部',
      position: '客房服务员',
      phone: '13800138002',
      email: 'liuzhiqiang@hotel.com',
      status: 'active',
      joinDate: '2023-03-20',
      salary: 4200,
      workSchedule: '中班 16:00-24:00',
      lastAttendance: '2025-07-15 16:02',
    },
    {
      id: '3',
      name: '王美玲',
      employeeId: 'EMP003',
      department: '餐饮部',
      position: '餐厅经理',
      phone: '13800138003',
      email: 'wangmeiling@hotel.com',
      status: 'active',
      joinDate: '2022-08-10',
      salary: 6500,
      workSchedule: '早班 7:00-15:00',
      lastAttendance: '2025-07-15 07:15',
    },
    {
      id: '4',
      name: '张建国',
      employeeId: 'EMP004',
      department: '工程部',
      position: '维修工程师',
      phone: '13800138004',
      email: 'zhangjianguo@hotel.com',
      status: 'leave',
      joinDate: '2023-06-12',
      salary: 5500,
      workSchedule: '夜班 0:00-8:00',
      lastAttendance: '2025-07-14 23:58',
    },
    {
      id: '5',
      name: '李明华',
      employeeId: 'EMP005',
      department: '保安部',
      position: '保安队长',
      phone: '13800138005',
      email: 'liminghua@hotel.com',
      status: 'active',
      joinDate: '2022-12-01',
      salary: 4800,
      workSchedule: '中班 16:00-24:00',
      lastAttendance: '2025-07-15 15:55',
    },
    {
      id: '6',
      name: '赵晓雯',
      employeeId: 'EMP006',
      department: '前厅部',
      position: '礼宾员',
      phone: '13800138006',
      email: 'zhaoxiaowen@hotel.com',
      status: 'active',
      joinDate: '2023-04-10',
      salary: 3800,
      workSchedule: '早班 8:00-16:00',
      lastAttendance: '2025-07-15 08:00',
    },
    {
      id: '7',
      name: '孙伟东',
      employeeId: 'EMP007',
      department: '客房部',
      position: '客房主管',
      phone: '13800138007',
      email: 'sunweidong@hotel.com',
      status: 'active',
      joinDate: '2022-05-15',
      salary: 5200,
      workSchedule: '早班 7:00-15:00',
      lastAttendance: '2025-07-15 07:05',
    },
    {
      id: '8',
      name: '周丽娜',
      employeeId: 'EMP008',
      department: '餐饮部',
      position: '服务员',
      phone: '13800138008',
      email: 'zhoulina@hotel.com',
      status: 'active',
      joinDate: '2023-07-20',
      salary: 3500,
      workSchedule: '中班 16:00-24:00',
      lastAttendance: '2025-07-15 16:00',
    },
    {
      id: '9',
      name: '吴建华',
      employeeId: 'EMP009',
      department: '工程部',
      position: '电工',
      phone: '13800138009',
      email: 'wujianhua@hotel.com',
      status: 'active',
      joinDate: '2023-02-28',
      salary: 4800,
      workSchedule: '夜班 0:00-8:00',
      lastAttendance: '2025-07-15 00:05',
    },
    {
      id: '10',
      name: '郑雅琴',
      employeeId: 'EMP010',
      department: '财务部',
      position: '会计',
      phone: '13800138010',
      email: 'zhengyaqin@hotel.com',
      status: 'active',
      joinDate: '2022-11-08',
      salary: 5800,
      workSchedule: '早班 9:00-17:00',
      lastAttendance: '2025-07-15 09:02',
    },
  ];

  const mockAttendance: Attendance[] = [
    {
      id: '1',
      staffId: '1',
      staffName: '陈雅琪',
      date: '2025-07-15',
      checkIn: '08:05',
      checkOut: '16:10',
      status: 'late',
      workHours: 8.1,
    },
    {
      id: '2',
      staffId: '2',
      staffName: '刘志强',
      date: '2025-07-15',
      checkIn: '16:02',
      checkOut: '24:05',
      status: 'present',
      workHours: 8.0,
    },
    {
      id: '3',
      staffId: '3',
      staffName: '王美玲',
      date: '2025-07-15',
      checkIn: '07:15',
      checkOut: '15:20',
      status: 'present',
      workHours: 8.1,
    },
    {
      id: '4',
      staffId: '4',
      staffName: '张建国',
      date: '2025-07-15',
      checkIn: '00:00',
      checkOut: '00:00',
      status: 'leave',
      workHours: 0,
    },
    {
      id: '5',
      staffId: '5',
      staffName: '李明华',
      date: '2025-07-15',
      checkIn: '15:55',
      checkOut: '24:00',
      status: 'present',
      workHours: 8.1,
    },
    {
      id: '6',
      staffId: '6',
      staffName: '赵晓雯',
      date: '2025-07-15',
      checkIn: '08:00',
      checkOut: '16:05',
      status: 'present',
      workHours: 8.1,
    },
    {
      id: '7',
      staffId: '7',
      staffName: '孙伟东',
      date: '2025-07-15',
      checkIn: '07:05',
      checkOut: '15:10',
      status: 'present',
      workHours: 8.1,
    },
    {
      id: '8',
      staffId: '8',
      staffName: '周丽娜',
      date: '2025-07-15',
      checkIn: '16:00',
      checkOut: '24:05',
      status: 'present',
      workHours: 8.1,
    },
    {
      id: '9',
      staffId: '9',
      staffName: '吴建华',
      date: '2025-07-15',
      checkIn: '00:05',
      checkOut: '08:10',
      status: 'present',
      workHours: 8.1,
    },
    {
      id: '10',
      staffId: '10',
      staffName: '郑雅琴',
      date: '2025-07-15',
      checkIn: '09:02',
      checkOut: '17:05',
      status: 'present',
      workHours: 8.1,
    },
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setLoading(true);
    // 模拟API调用
    setTimeout(() => {
      setStaffList(mockStaff);
      setAttendanceList(mockAttendance);
      setLoading(false);
    }, 1000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'present':
        return 'green';
      case 'inactive':
      case 'absent':
        return 'red';
      case 'leave':
        return 'orange';
      case 'late':
        return 'gold';
      default:
        return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return '在职';
      case 'inactive':
        return '离职';
      case 'leave':
        return '请假';
      case 'present':
        return '正常';
      case 'absent':
        return '缺勤';
      case 'late':
        return '迟到';
      default:
        return '未知';
    }
  };

  const staffColumns = [
    {
      title: '员工信息',
      key: 'info',
      render: (_: any, record: Staff) => (
        <Space>
          <Avatar size="large" icon={<UserAddOutlined />} />
          <div>
            <div>
              <Text strong>{record.name}</Text>
              <Text code style={{ marginLeft: 8 }}>{record.employeeId}</Text>
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              {record.department} - {record.position}
            </div>
          </div>
        </Space>
      ),
    },
    {
      title: '联系方式',
      key: 'contact',
      render: (_: any, record: Staff) => (
        <Space direction="vertical" size="small">
          <Space>
            <PhoneOutlined />
            <Text>{record.phone}</Text>
          </Space>
          <Space>
            <MailOutlined />
            <Text>{record.email}</Text>
          </Space>
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
      title: '薪资',
      dataIndex: 'salary',
      key: 'salary',
      render: (value: number) => (
        <Text strong style={{ color: '#1890ff' }}>
          ¥{value.toLocaleString()}
        </Text>
      ),
    },
    {
      title: '工作班次',
      dataIndex: 'workSchedule',
      key: 'workSchedule',
    },
    {
      title: '最后考勤',
      dataIndex: 'lastAttendance',
      key: 'lastAttendance',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Staff) => (
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

  const attendanceColumns = [
    {
      title: '员工姓名',
      dataIndex: 'staffName',
      key: 'staffName',
    },
    {
      title: '日期',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: '签到时间',
      dataIndex: 'checkIn',
      key: 'checkIn',
    },
    {
      title: '签退时间',
      dataIndex: 'checkOut',
      key: 'checkOut',
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
      title: '工作时长',
      dataIndex: 'workHours',
      key: 'workHours',
      render: (value: number) => (
        <Text strong>{value} 小时</Text>
      ),
    },
  ];

  const handleViewDetails = (record: Staff) => {
    setCurrentStaff(record);
    setDetailsModalVisible(true);
  };

  const handleEdit = (record: Staff) => {
    setCurrentStaff(record);
    setEditModalVisible(true);
  };

  const handleDelete = (record: Staff) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除员工 ${record.name} 吗？`,
      onOk: () => {
        setStaffList(staffList.filter(item => item.id !== record.id));
        Modal.success({
          title: '删除成功',
          content: '员工信息已成功删除',
        });
      },
    });
  };

  const handleAdd = () => {
    setAddModalVisible(true);
  };

  const handleExport = () => {
    Modal.success({
      title: '导出成功',
      content: '员工数据已成功导出到Excel文件',
    });
  };

  const handleImport = () => {
    Modal.info({
      title: '导入功能',
      content: '员工数据导入功能将在这里实现',
    });
  };

  const staffRowSelection = {
    selectedRowKeys: selectedStaff,
    onChange: (selectedRowKeys: React.Key[]) => {
      setSelectedStaff(selectedRowKeys as string[]);
    },
  };

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <Title level={2}>
          <TeamOutlined style={{ marginRight: 8 }} />
          员工管理
        </Title>
        <Text type="secondary">
          管理酒店员工信息、排班安排和考勤记录
        </Text>
      </div>

      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="员工总数"
              value={staffList.length}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="在职员工"
              value={staffList.filter(item => item.status === 'active').length}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="请假员工"
              value={staffList.filter(item => item.status === 'leave').length}
              prefix={<ExclamationCircleOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="今日出勤率"
              value={Math.round((attendanceList.filter(item => item.status === 'present').length / attendanceList.length) * 100)}
              suffix="%"
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 操作工具栏 */}
      <Card style={{ marginBottom: '24px' }}>
        <Space wrap>
          <Button
            type="primary"
            icon={<UserAddOutlined />}
            onClick={handleAdd}
          >
            添加员工
          </Button>
          <Button
            icon={<ImportOutlined />}
            onClick={handleImport}
          >
            导入数据
          </Button>
          <Button
            icon={<ExportOutlined />}
            onClick={handleExport}
          >
            导出数据
          </Button>
          {selectedStaff.length > 0 && (
            <Button
              type="default"
            >
              批量操作 ({selectedStaff.length})
            </Button>
          )}
        </Space>
      </Card>

      {/* 主要内容区域 */}
      <Card>
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="员工信息" key="staff">
            <Table
              columns={staffColumns}
              dataSource={staffList}
              rowKey="id"
              loading={loading}
              rowSelection={staffRowSelection}
              pagination={{
                total: staffList.length,
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
              }}
            />
          </TabPane>
          <TabPane tab="考勤记录" key="attendance">
            <Table
              columns={attendanceColumns}
              dataSource={attendanceList}
              rowKey="id"
              loading={loading}
              pagination={{
                total: attendanceList.length,
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
              }}
            />
          </TabPane>
          <TabPane tab="排班管理" key="schedule">
            <div style={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Text type="secondary">排班管理功能将在这里实现</Text>
            </div>
          </TabPane>
        </Tabs>
      </Card>

      {/* 员工详情模态框 */}
      <Modal
        title="员工详情"
        open={detailsModalVisible}
        onCancel={() => setDetailsModalVisible(false)}
        footer={null}
        width={600}
      >
        {currentStaff && (
          <Descriptions bordered column={2}>
            <Descriptions.Item label="姓名" span={2}>
              {currentStaff.name}
            </Descriptions.Item>
            <Descriptions.Item label="员工编号">
              {currentStaff.employeeId}
            </Descriptions.Item>
            <Descriptions.Item label="部门">
              {currentStaff.department}
            </Descriptions.Item>
            <Descriptions.Item label="职位">
              {currentStaff.position}
            </Descriptions.Item>
            <Descriptions.Item label="状态">
              <Badge
                status={getStatusColor(currentStaff.status) as any}
                text={getStatusText(currentStaff.status)}
              />
            </Descriptions.Item>
            <Descriptions.Item label="联系电话">
              {currentStaff.phone}
            </Descriptions.Item>
            <Descriptions.Item label="邮箱">
              {currentStaff.email}
            </Descriptions.Item>
            <Descriptions.Item label="入职日期">
              {currentStaff.joinDate}
            </Descriptions.Item>
            <Descriptions.Item label="薪资">
              ¥{currentStaff.salary.toLocaleString()}
            </Descriptions.Item>
            <Descriptions.Item label="工作班次">
              {currentStaff.workSchedule}
            </Descriptions.Item>
            <Descriptions.Item label="最后考勤" span={2}>
              {currentStaff.lastAttendance}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>

      {/* 添加员工模态框 */}
      <Modal
        title="添加员工"
        open={addModalVisible}
        onCancel={() => setAddModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setAddModalVisible(false)}>
            取消
          </Button>,
          <Button key="submit" type="primary">
            添加
          </Button>,
        ]}
        width={600}
      >
        <Form layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="姓名" required>
                <Input placeholder="请输入员工姓名" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="员工编号" required>
                <Input placeholder="请输入员工编号" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="部门" required>
                <Select placeholder="请选择部门">
                  <Select.Option value="前厅部">前厅部</Select.Option>
                  <Select.Option value="客房部">客房部</Select.Option>
                  <Select.Option value="餐饮部">餐饮部</Select.Option>
                  <Select.Option value="工程部">工程部</Select.Option>
                  <Select.Option value="保安部">保安部</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="职位" required>
                <Input placeholder="请输入职位" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="联系电话" required>
                <Input placeholder="请输入联系电话" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="邮箱" required>
                <Input placeholder="请输入邮箱" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="入职日期" required>
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="薪资" required>
                <Input placeholder="请输入薪资" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="工作班次">
            <Select placeholder="请选择工作班次">
              <Select.Option value="早班 8:00-16:00">早班 8:00-16:00</Select.Option>
              <Select.Option value="中班 16:00-24:00">中班 16:00-24:00</Select.Option>
              <Select.Option value="夜班 0:00-8:00">夜班 0:00-8:00</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* 编辑员工模态框 */}
      <Modal
        title="编辑员工"
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setEditModalVisible(false)}>
            取消
          </Button>,
          <Button key="submit" type="primary">
            保存
          </Button>,
        ]}
        width={600}
      >
        <Form layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="姓名" required>
                <Input placeholder="请输入员工姓名" defaultValue={currentStaff?.name} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="员工编号" required>
                <Input placeholder="请输入员工编号" defaultValue={currentStaff?.employeeId} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="部门" required>
                <Select placeholder="请选择部门" defaultValue={currentStaff?.department}>
                  <Select.Option value="前厅部">前厅部</Select.Option>
                  <Select.Option value="客房部">客房部</Select.Option>
                  <Select.Option value="餐饮部">餐饮部</Select.Option>
                  <Select.Option value="工程部">工程部</Select.Option>
                  <Select.Option value="保安部">保安部</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="职位" required>
                <Input placeholder="请输入职位" defaultValue={currentStaff?.position} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="联系电话" required>
                <Input placeholder="请输入联系电话" defaultValue={currentStaff?.phone} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="邮箱" required>
                <Input placeholder="请输入邮箱" defaultValue={currentStaff?.email} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="状态">
                <Select defaultValue={currentStaff?.status}>
                  <Select.Option value="active">在职</Select.Option>
                  <Select.Option value="inactive">离职</Select.Option>
                  <Select.Option value="leave">请假</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="薪资" required>
                <Input placeholder="请输入薪资" defaultValue={currentStaff?.salary.toString()} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="工作班次">
            <Select placeholder="请选择工作班次" defaultValue={currentStaff?.workSchedule}>
              <Select.Option value="早班 8:00-16:00">早班 8:00-16:00</Select.Option>
              <Select.Option value="中班 16:00-24:00">中班 16:00-24:00</Select.Option>
              <Select.Option value="夜班 0:00-8:00">夜班 0:00-8:00</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default StaffManagement; 