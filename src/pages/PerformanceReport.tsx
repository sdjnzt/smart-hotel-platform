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
  Rate,
} from 'antd';
import {
  TrophyOutlined,
  UserOutlined,
  TeamOutlined,
  BarChartOutlined,
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
  StarOutlined,
  RiseOutlined,
  FallOutlined,
  DollarOutlined,
  CalendarOutlined,
  FileTextOutlined,
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

interface EmployeePerformance {
  id: string;
  name: string;
  department: string;
  position: string;
  avatar: string;
  overallScore: number;
  attendance: number;
  efficiency: number;
  quality: number;
  teamwork: number;
  customerSatisfaction: number;
  monthlyTarget: number;
  actualAchievement: number;
  completionRate: number;
  lastMonthScore: number;
  trend: 'up' | 'down' | 'stable';
  status: 'excellent' | 'good' | 'average' | 'poor';
}

interface DepartmentPerformance {
  id: string;
  name: string;
  manager: string;
  employeeCount: number;
  overallScore: number;
  attendance: number;
  efficiency: number;
  quality: number;
  customerSatisfaction: number;
  monthlyTarget: number;
  actualAchievement: number;
  completionRate: number;
  lastMonthScore: number;
  trend: 'up' | 'down' | 'stable';
  status: 'excellent' | 'good' | 'average' | 'poor';
}

interface KPIIndicator {
  id: string;
  name: string;
  category: 'financial' | 'operational' | 'customer' | 'employee';
  target: number;
  actual: number;
  unit: string;
  completionRate: number;
  lastMonth: number;
  trend: 'up' | 'down' | 'stable';
  status: 'excellent' | 'good' | 'average' | 'poor';
}

const PerformanceReport: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState<EmployeePerformance[]>([]);
  const [departments, setDepartments] = useState<DepartmentPerformance[]>([]);
  const [kpiIndicators, setKpiIndicators] = useState<KPIIndicator[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('overview');

  // 模拟数据
  const mockEmployees: EmployeePerformance[] = [
    {
      id: '1',
      name: '陈美玲',
      department: '客房部',
      position: '客房服务员',
      avatar: '',
      overallScore: 92,
      attendance: 98,
      efficiency: 95,
      quality: 90,
      teamwork: 88,
      customerSatisfaction: 96,
      monthlyTarget: 100,
      actualAchievement: 95,
      completionRate: 95,
      lastMonthScore: 88,
      trend: 'up',
      status: 'excellent',
    },
    {
      id: '2',
      name: '刘志强',
      department: '餐饮部',
      position: '服务员',
      avatar: '',
      overallScore: 85,
      attendance: 95,
      efficiency: 88,
      quality: 85,
      teamwork: 90,
      customerSatisfaction: 88,
      monthlyTarget: 100,
      actualAchievement: 88,
      completionRate: 88,
      lastMonthScore: 87,
      trend: 'down',
      status: 'good',
    },
    {
      id: '3',
      name: '王雅婷',
      department: '前厅部',
      position: '前台接待',
      avatar: '',
      overallScore: 78,
      attendance: 92,
      efficiency: 80,
      quality: 75,
      teamwork: 85,
      customerSatisfaction: 82,
      monthlyTarget: 100,
      actualAchievement: 78,
      completionRate: 78,
      lastMonthScore: 76,
      trend: 'up',
      status: 'average',
    },
    {
      id: '4',
      name: '张建国',
      department: '工程部',
      position: '维修工程师',
      avatar: '',
      overallScore: 88,
      attendance: 96,
      efficiency: 90,
      quality: 85,
      teamwork: 92,
      customerSatisfaction: 90,
      monthlyTarget: 100,
      actualAchievement: 88,
      completionRate: 88,
      lastMonthScore: 85,
      trend: 'up',
      status: 'good',
    },
  ];

  const mockDepartments: DepartmentPerformance[] = [
    {
      id: '1',
      name: '客房部',
      manager: '陈经理',
      employeeCount: 25,
      overallScore: 89,
      attendance: 95,
      efficiency: 88,
      quality: 85,
      customerSatisfaction: 92,
      monthlyTarget: 100,
      actualAchievement: 89,
      completionRate: 89,
      lastMonthScore: 86,
      trend: 'up',
      status: 'good',
    },
    {
      id: '2',
      name: '餐饮部',
      manager: '刘经理',
      employeeCount: 30,
      overallScore: 85,
      attendance: 92,
      efficiency: 85,
      quality: 88,
      customerSatisfaction: 90,
      monthlyTarget: 100,
      actualAchievement: 85,
      completionRate: 85,
      lastMonthScore: 87,
      trend: 'down',
      status: 'good',
    },
    {
      id: '3',
      name: '前厅部',
      manager: '王经理',
      employeeCount: 15,
      overallScore: 82,
      attendance: 90,
      efficiency: 80,
      quality: 85,
      customerSatisfaction: 88,
      monthlyTarget: 100,
      actualAchievement: 82,
      completionRate: 82,
      lastMonthScore: 80,
      trend: 'up',
      status: 'average',
    },
    {
      id: '4',
      name: '工程部',
      manager: '张经理',
      employeeCount: 12,
      overallScore: 88,
      attendance: 94,
      efficiency: 90,
      quality: 85,
      customerSatisfaction: 92,
      monthlyTarget: 100,
      actualAchievement: 88,
      completionRate: 88,
      lastMonthScore: 85,
      trend: 'up',
      status: 'good',
    },
  ];

  const mockKPIIndicators: KPIIndicator[] = [
    {
      id: '1',
      name: '客房入住率',
      category: 'operational',
      target: 85,
      actual: 82,
      unit: '%',
      completionRate: 96,
      lastMonth: 80,
      trend: 'up',
      status: 'good',
    },
    {
      id: '2',
      name: '客户满意度',
      category: 'customer',
      target: 90,
      actual: 88,
      unit: '分',
      completionRate: 98,
      lastMonth: 87,
      trend: 'up',
      status: 'good',
    },
    {
      id: '3',
      name: '员工满意度',
      category: 'employee',
      target: 85,
      actual: 82,
      unit: '分',
      completionRate: 96,
      lastMonth: 80,
      trend: 'up',
      status: 'good',
    },
    {
      id: '4',
      name: '月度收入',
      category: 'financial',
      target: 1000000,
      actual: 950000,
      unit: '元',
      completionRate: 95,
      lastMonth: 920000,
      trend: 'up',
      status: 'good',
    },
    {
      id: '5',
      name: '成本控制率',
      category: 'financial',
      target: 75,
      actual: 78,
      unit: '%',
      completionRate: 96,
      lastMonth: 80,
      trend: 'up',
      status: 'excellent',
    },
    {
      id: '6',
      name: '设备完好率',
      category: 'operational',
      target: 95,
      actual: 92,
      unit: '%',
      completionRate: 97,
      lastMonth: 90,
      trend: 'up',
      status: 'good',
    },
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setLoading(true);
    // 模拟API调用
    setTimeout(() => {
      setEmployees(mockEmployees);
      setDepartments(mockDepartments);
      setKpiIndicators(mockKPIIndicators);
      setLoading(false);
    }, 1000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent':
        return 'green';
      case 'good':
        return 'blue';
      case 'average':
        return 'orange';
      case 'poor':
        return 'red';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'excellent':
        return <StarOutlined style={{ color: '#52c41a' }} />;
      case 'good':
        return <CheckCircleOutlined style={{ color: '#1890ff' }} />;
      case 'average':
        return <ExclamationCircleOutlined style={{ color: '#faad14' }} />;
      case 'poor':
        return <CloseCircleOutlined style={{ color: '#ff4d4f' }} />;
      default:
        return <ClockCircleOutlined />;
    }
  };

  const getStatusText = (status: string) => {
    const statusMap: { [key: string]: string } = {
      excellent: '优秀',
      good: '良好',
      average: '一般',
      poor: '较差',
    };
    return statusMap[status] || status;
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <RiseOutlined style={{ color: '#52c41a' }} />;
      case 'down':
        return <FallOutlined style={{ color: '#ff4d4f' }} />;
      case 'stable':
        return <BarChartOutlined style={{ color: '#faad14' }} />;
      default:
        return <BarChartOutlined />;
    }
  };

  const getTrendText = (trend: string) => {
    const trendMap: { [key: string]: string } = {
      up: '上升',
      down: '下降',
      stable: '稳定',
    };
    return trendMap[trend] || trend;
  };

  const getCategoryText = (category: string) => {
    const categoryMap: { [key: string]: string } = {
      financial: '财务指标',
      operational: '运营指标',
      customer: '客户指标',
      employee: '员工指标',
    };
    return categoryMap[category] || category;
  };

  const employeeColumns = [
    {
      title: '员工信息',
      key: 'info',
      render: (_: any, record: EmployeePerformance) => (
        <Space>
          <Avatar size="large" icon={<UserOutlined />} />
          <div>
            <div>
              <Text strong>{record.name}</Text>
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              {record.department} | {record.position}
            </div>
          </div>
        </Space>
      ),
    },
    {
      title: '综合评分',
      dataIndex: 'overallScore',
      key: 'overallScore',
      render: (score: number) => (
        <Space>
          <Text strong style={{ fontSize: '16px' }}>{score}</Text>
          <Rate disabled defaultValue={Math.floor(score / 20)} />
        </Space>
      ),
    },
    {
      title: '出勤率',
      dataIndex: 'attendance',
      key: 'attendance',
      render: (value: number) => (
        <Space direction="vertical" size="small" style={{ width: '100%' }}>
          <Text strong>{value}%</Text>
          <Progress
            percent={value}
            size="small"
            strokeColor={value > 95 ? '#52c41a' : value > 90 ? '#faad14' : '#ff4d4f'}
            showInfo={false}
          />
        </Space>
      ),
    },
    {
      title: '工作效率',
      dataIndex: 'efficiency',
      key: 'efficiency',
      render: (value: number) => (
        <Space direction="vertical" size="small" style={{ width: '100%' }}>
          <Text strong>{value}%</Text>
          <Progress
            percent={value}
            size="small"
            strokeColor={value > 90 ? '#52c41a' : value > 80 ? '#faad14' : '#ff4d4f'}
            showInfo={false}
          />
        </Space>
      ),
    },
    {
      title: '客户满意度',
      dataIndex: 'customerSatisfaction',
      key: 'customerSatisfaction',
      render: (value: number) => (
        <Space direction="vertical" size="small" style={{ width: '100%' }}>
          <Text strong>{value}%</Text>
          <Progress
            percent={value}
            size="small"
            strokeColor={value > 90 ? '#52c41a' : value > 80 ? '#faad14' : '#ff4d4f'}
            showInfo={false}
          />
        </Space>
      ),
    },
    {
      title: '目标完成率',
      dataIndex: 'completionRate',
      key: 'completionRate',
      render: (value: number) => (
        <Space direction="vertical" size="small" style={{ width: '100%' }}>
          <Text strong>{value}%</Text>
          <Progress
            percent={value}
            size="small"
            strokeColor={value > 95 ? '#52c41a' : value > 85 ? '#faad14' : '#ff4d4f'}
            showInfo={false}
          />
        </Space>
      ),
    },
    {
      title: '趋势',
      dataIndex: 'trend',
      key: 'trend',
      render: (trend: string) => (
        <Space>
          {getTrendIcon(trend)}
          <Text>{getTrendText(trend)}</Text>
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
      title: '操作',
      key: 'action',
      render: (_: any, record: EmployeePerformance) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetails(record)}
          >
            查看详情
          </Button>
        </Space>
      ),
    },
  ];

  const departmentColumns = [
    {
      title: '部门信息',
      key: 'info',
      render: (_: any, record: DepartmentPerformance) => (
        <Space>
          <Avatar size="large" icon={<TeamOutlined />} />
          <div>
            <div>
              <Text strong>{record.name}</Text>
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              {record.manager} | {record.employeeCount}人
            </div>
          </div>
        </Space>
      ),
    },
    {
      title: '综合评分',
      dataIndex: 'overallScore',
      key: 'overallScore',
      render: (score: number) => (
        <Space>
          <Text strong style={{ fontSize: '16px' }}>{score}</Text>
          <Rate disabled defaultValue={Math.floor(score / 20)} />
        </Space>
      ),
    },
    {
      title: '出勤率',
      dataIndex: 'attendance',
      key: 'attendance',
      render: (value: number) => (
        <Space direction="vertical" size="small" style={{ width: '100%' }}>
          <Text strong>{value}%</Text>
          <Progress
            percent={value}
            size="small"
            strokeColor={value > 95 ? '#52c41a' : value > 90 ? '#faad14' : '#ff4d4f'}
            showInfo={false}
          />
        </Space>
      ),
    },
    {
      title: '工作效率',
      dataIndex: 'efficiency',
      key: 'efficiency',
      render: (value: number) => (
        <Space direction="vertical" size="small" style={{ width: '100%' }}>
          <Text strong>{value}%</Text>
          <Progress
            percent={value}
            size="small"
            strokeColor={value > 90 ? '#52c41a' : value > 80 ? '#faad14' : '#ff4d4f'}
            showInfo={false}
          />
        </Space>
      ),
    },
    {
      title: '客户满意度',
      dataIndex: 'customerSatisfaction',
      key: 'customerSatisfaction',
      render: (value: number) => (
        <Space direction="vertical" size="small" style={{ width: '100%' }}>
          <Text strong>{value}%</Text>
          <Progress
            percent={value}
            size="small"
            strokeColor={value > 90 ? '#52c41a' : value > 80 ? '#faad14' : '#ff4d4f'}
            showInfo={false}
          />
        </Space>
      ),
    },
    {
      title: '目标完成率',
      dataIndex: 'completionRate',
      key: 'completionRate',
      render: (value: number) => (
        <Space direction="vertical" size="small" style={{ width: '100%' }}>
          <Text strong>{value}%</Text>
          <Progress
            percent={value}
            size="small"
            strokeColor={value > 95 ? '#52c41a' : value > 85 ? '#faad14' : '#ff4d4f'}
            showInfo={false}
          />
        </Space>
      ),
    },
    {
      title: '趋势',
      dataIndex: 'trend',
      key: 'trend',
      render: (trend: string) => (
        <Space>
          {getTrendIcon(trend)}
          <Text>{getTrendText(trend)}</Text>
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
      title: '操作',
      key: 'action',
      render: (_: any, record: DepartmentPerformance) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetails(record)}
          >
            查看详情
          </Button>
        </Space>
      ),
    },
  ];

  const kpiColumns = [
    {
      title: '指标名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '指标类别',
      dataIndex: 'category',
      key: 'category',
      render: (category: string) => <Tag color="blue">{getCategoryText(category)}</Tag>,
    },
    {
      title: '目标值',
      dataIndex: 'target',
      key: 'target',
      render: (target: number, record: KPIIndicator) => (
        <Text>{target}{record.unit}</Text>
      ),
    },
    {
      title: '实际值',
      dataIndex: 'actual',
      key: 'actual',
      render: (actual: number, record: KPIIndicator) => (
        <Text>{actual}{record.unit}</Text>
      ),
    },
    {
      title: '完成率',
      dataIndex: 'completionRate',
      key: 'completionRate',
      render: (value: number) => (
        <Space direction="vertical" size="small" style={{ width: '100%' }}>
          <Text strong>{value}%</Text>
          <Progress
            percent={value}
            size="small"
            strokeColor={value > 95 ? '#52c41a' : value > 85 ? '#faad14' : '#ff4d4f'}
            showInfo={false}
          />
        </Space>
      ),
    },
    {
      title: '上月对比',
      key: 'comparison',
      render: (_: any, record: KPIIndicator) => {
        const diff = record.actual - record.lastMonth;
        const diffPercent = ((diff / record.lastMonth) * 100).toFixed(1);
        return (
          <Space>
            <Text>{record.lastMonth}{record.unit}</Text>
            <Text style={{ color: diff >= 0 ? '#52c41a' : '#ff4d4f' }}>
              {diff >= 0 ? '+' : ''}{diffPercent}%
            </Text>
          </Space>
        );
      },
    },
    {
      title: '趋势',
      dataIndex: 'trend',
      key: 'trend',
      render: (trend: string) => (
        <Space>
          {getTrendIcon(trend)}
          <Text>{getTrendText(trend)}</Text>
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
  ];

  const handleViewDetails = (record: any) => {
    setSelectedItem(record);
    setDetailsModalVisible(true);
  };

  const handleExport = () => {
    Modal.success({
      title: '导出成功',
      content: '绩效报告数据已成功导出到Excel文件',
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
          <TrophyOutlined style={{ marginRight: 8 }} />
          绩效报告
        </Title>
        <Text type="secondary">
          分析员工和部门绩效表现，监控KPI指标完成情况
        </Text>
      </div>

      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="员工总数"
              value={employees.length}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="优秀员工"
              value={employees.filter(e => e.status === 'excellent').length}
              prefix={<StarOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="部门数量"
              value={departments.length}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="平均绩效分"
              value={Math.round(employees.reduce((sum, e) => sum + e.overallScore, 0) / employees.length)}
              prefix={<BarChartOutlined />}
              valueStyle={{ color: '#fa8c16' }}
              suffix="分"
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
            icon={<CalendarOutlined />}
          >
            选择时间范围
          </Button>
          <Button
            icon={<LineChartOutlined />}
          >
            趋势分析
          </Button>
          <Button
            icon={<ExportOutlined />}
            onClick={handleExport}
          >
            导出报告
          </Button>
        </Space>
      </Card>

      {/* 主要内容区域 */}
      <Card>
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="综合概览" key="overview">
            <Row gutter={16}>
              <Col span={12}>
                <Card title="员工绩效排行" size="small">
                  <List
                    dataSource={employees.slice(0, 5)}
                    renderItem={(item, index) => (
                      <List.Item>
                        <List.Item.Meta
                          avatar={
                            <Badge count={index + 1} style={{ backgroundColor: index < 3 ? '#52c41a' : '#d9d9d9' }}>
                              <Avatar icon={<UserOutlined />} />
                            </Badge>
                          }
                          title={item.name}
                          description={`${item.department} | ${item.position}`}
                        />
                        <div>
                          <Text strong style={{ fontSize: '16px' }}>{item.overallScore}分</Text>
                          <Rate disabled defaultValue={Math.floor(item.overallScore / 20)} />
                        </div>
                      </List.Item>
                    )}
                  />
                </Card>
              </Col>
              <Col span={12}>
                <Card title="部门绩效排行" size="small">
                  <List
                    dataSource={departments.slice(0, 5)}
                    renderItem={(item, index) => (
                      <List.Item>
                        <List.Item.Meta
                          avatar={
                            <Badge count={index + 1} style={{ backgroundColor: index < 3 ? '#52c41a' : '#d9d9d9' }}>
                              <Avatar icon={<TeamOutlined />} />
                            </Badge>
                          }
                          title={item.name}
                          description={`${item.manager} | ${item.employeeCount}人`}
                        />
                        <div>
                          <Text strong style={{ fontSize: '16px' }}>{item.overallScore}分</Text>
                          <Rate disabled defaultValue={Math.floor(item.overallScore / 20)} />
                        </div>
                      </List.Item>
                    )}
                  />
                </Card>
              </Col>
            </Row>
          </TabPane>
          <TabPane tab="员工绩效" key="employees">
            <Table
              columns={employeeColumns}
              dataSource={employees}
              rowKey="id"
              loading={loading}
              rowSelection={rowSelection}
              pagination={{
                total: employees.length,
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
              }}
            />
          </TabPane>
          <TabPane tab="部门绩效" key="departments">
            <Table
              columns={departmentColumns}
              dataSource={departments}
              rowKey="id"
              loading={loading}
              pagination={{
                total: departments.length,
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
              }}
            />
          </TabPane>
          <TabPane tab="KPI指标" key="kpi">
            <Table
              columns={kpiColumns}
              dataSource={kpiIndicators}
              rowKey="id"
              loading={loading}
              pagination={{
                total: kpiIndicators.length,
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
        title="绩效详情"
        open={detailsModalVisible}
        onCancel={() => setDetailsModalVisible(false)}
        footer={null}
        width={600}
      >
        {selectedItem && (
          <Descriptions bordered column={2}>
            <Descriptions.Item label="姓名/部门" span={2}>
              {selectedItem.name}
            </Descriptions.Item>
            <Descriptions.Item label="综合评分">
              <Space>
                <Text strong style={{ fontSize: '18px' }}>{selectedItem.overallScore}</Text>
                <Rate disabled defaultValue={Math.floor(selectedItem.overallScore / 20)} />
              </Space>
            </Descriptions.Item>
            <Descriptions.Item label="状态">
              <Badge
                status={getStatusColor(selectedItem.status) as any}
                text={getStatusText(selectedItem.status)}
              />
            </Descriptions.Item>
            <Descriptions.Item label="出勤率">
              <Progress percent={selectedItem.attendance} size="small" />
            </Descriptions.Item>
            <Descriptions.Item label="工作效率">
              <Progress percent={selectedItem.efficiency} size="small" />
            </Descriptions.Item>
            <Descriptions.Item label="工作质量">
              <Progress percent={selectedItem.quality} size="small" />
            </Descriptions.Item>
            <Descriptions.Item label="团队合作">
              <Progress percent={selectedItem.teamwork} size="small" />
            </Descriptions.Item>
            <Descriptions.Item label="客户满意度">
              <Progress percent={selectedItem.customerSatisfaction} size="small" />
            </Descriptions.Item>
            <Descriptions.Item label="目标完成率">
              <Progress percent={selectedItem.completionRate} size="small" />
            </Descriptions.Item>
            <Descriptions.Item label="上月评分">
              {selectedItem.lastMonthScore}
            </Descriptions.Item>
            <Descriptions.Item label="趋势">
              <Space>
                {getTrendIcon(selectedItem.trend)}
                <Text>{getTrendText(selectedItem.trend)}</Text>
              </Space>
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default PerformanceReport; 