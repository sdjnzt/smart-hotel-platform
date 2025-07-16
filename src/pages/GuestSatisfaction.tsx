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
  StarOutlined,
  UserOutlined,
  MessageOutlined,
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
  RiseOutlined,
  FallOutlined,
  DollarOutlined,
  CalendarOutlined,
  FileTextOutlined,
  SmileOutlined,
  FrownOutlined,
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

interface SatisfactionSurvey {
  id: string;
  guestName: string;
  roomNumber: string;
  checkInDate: string;
  checkOutDate: string;
  overallRating: number;
  cleanliness: number;
  service: number;
  facilities: number;
  food: number;
  value: number;
  comment: string;
  status: 'submitted' | 'processed' | 'resolved';
  timestamp: string;
}

interface ComplaintRecord {
  id: string;
  guestName: string;
  roomNumber: string;
  category: 'service' | 'facility' | 'cleanliness' | 'noise' | 'food' | 'other';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  status: 'pending' | 'processing' | 'resolved' | 'closed';
  assignedTo: string;
  createdAt: string;
  resolvedAt?: string;
  resolution?: string;
}

interface SatisfactionMetric {
  id: string;
  category: string;
  currentScore: number;
  lastMonthScore: number;
  changeRate: number;
  totalResponses: number;
  excellentCount: number;
  goodCount: number;
  averageCount: number;
  poorCount: number;
  trend: 'up' | 'down' | 'stable';
}

const GuestSatisfaction: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [surveys, setSurveys] = useState<SatisfactionSurvey[]>([]);
  const [complaints, setComplaints] = useState<ComplaintRecord[]>([]);
  const [metrics, setMetrics] = useState<SatisfactionMetric[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('overview');

  // 模拟数据
  const mockSurveys: SatisfactionSurvey[] = [
    {
      id: '1',
      guestName: '陈美玲',
      roomNumber: '301',
      checkInDate: '2025-07-12',
      checkOutDate: '2025-07-15',
      overallRating: 5,
      cleanliness: 5,
      service: 4,
      facilities: 5,
      food: 4,
      value: 5,
      comment: '酒店环境很好，服务态度也不错，房间很干净，下次还会选择这里。',
      status: 'submitted',
      timestamp: '2025-07-15 10:30:00',
    },
    {
      id: '2',
      guestName: '刘志强',
      roomNumber: '205',
      checkInDate: '2025-07-13',
      checkOutDate: '2025-07-14',
      overallRating: 3,
      cleanliness: 4,
      service: 2,
      facilities: 3,
      food: 3,
      value: 3,
      comment: '服务响应较慢，房间设施有些老旧，但位置便利。',
      status: 'processed',
      timestamp: '2025-07-14 16:45:00',
    },
    {
      id: '3',
      guestName: '王雅婷',
      roomNumber: '408',
      checkInDate: '2025-07-10',
      checkOutDate: '2025-07-12',
      overallRating: 4,
      cleanliness: 5,
      service: 4,
      facilities: 4,
      food: 4,
      value: 4,
      comment: '整体满意，早餐种类丰富，房间隔音效果不错。',
      status: 'resolved',
      timestamp: '2025-07-12 09:15:00',
    },
    {
      id: '4',
      guestName: '张建国',
      roomNumber: '102',
      checkInDate: '2025-07-11',
      checkOutDate: '2025-07-13',
      overallRating: 5,
      cleanliness: 5,
      service: 5,
      facilities: 5,
      food: 5,
      value: 5,
      comment: '非常满意！服务周到，环境优雅，设施完善，强烈推荐！',
      status: 'submitted',
      timestamp: '2025-07-13 14:20:00',
    },
  ];

  const mockComplaints: ComplaintRecord[] = [
    {
      id: '1',
      guestName: '李小明',
      roomNumber: '306',
      category: 'service',
      severity: 'medium',
      description: '客房服务响应太慢，等了30分钟才送来毛巾。',
      status: 'resolved',
      assignedTo: '陈美玲',
      createdAt: '2025-07-15 08:30:00',
      resolvedAt: '2025-07-15 09:15:00',
      resolution: '已向客人道歉并免费提供客房服务，客人表示满意。',
    },
    {
      id: '2',
      guestName: '赵小红',
      roomNumber: '209',
      category: 'facility',
      severity: 'high',
      description: '空调不制冷，房间温度很高，影响休息。',
      status: 'processing',
      assignedTo: '张建国',
      createdAt: '2025-07-15 14:20:00',
    },
    {
      id: '3',
      guestName: '孙小华',
      roomNumber: '401',
      category: 'noise',
      severity: 'low',
      description: '隔壁房间声音较大，影响睡眠质量。',
      status: 'resolved',
      assignedTo: '刘志强',
      createdAt: '2025-07-14 22:15:00',
      resolvedAt: '2025-07-14 22:45:00',
      resolution: '已与隔壁客人沟通，问题得到解决。',
    },
    {
      id: '4',
      guestName: '周小丽',
      roomNumber: '105',
      category: 'cleanliness',
      severity: 'medium',
      description: '房间地毯有污渍，床单不够干净。',
      status: 'pending',
      assignedTo: '王雅婷',
      createdAt: '2025-07-15 11:00:00',
    },
  ];

  const mockMetrics: SatisfactionMetric[] = [
    {
      id: '1',
      category: '整体满意度',
      currentScore: 4.2,
      lastMonthScore: 4.0,
      changeRate: 5.0,
      totalResponses: 156,
      excellentCount: 89,
      goodCount: 45,
      averageCount: 18,
      poorCount: 4,
      trend: 'up',
    },
    {
      id: '2',
      category: '清洁卫生',
      currentScore: 4.5,
      lastMonthScore: 4.3,
      changeRate: 4.7,
      totalResponses: 156,
      excellentCount: 95,
      goodCount: 42,
      averageCount: 15,
      poorCount: 4,
      trend: 'up',
    },
    {
      id: '3',
      category: '服务质量',
      currentScore: 4.0,
      lastMonthScore: 4.2,
      changeRate: -4.8,
      totalResponses: 156,
      excellentCount: 78,
      goodCount: 52,
      averageCount: 20,
      poorCount: 6,
      trend: 'down',
    },
    {
      id: '4',
      category: '设施设备',
      currentScore: 4.1,
      lastMonthScore: 4.0,
      changeRate: 2.5,
      totalResponses: 156,
      excellentCount: 82,
      goodCount: 48,
      averageCount: 22,
      poorCount: 4,
      trend: 'up',
    },
    {
      id: '5',
      category: '餐饮服务',
      currentScore: 4.3,
      lastMonthScore: 4.1,
      changeRate: 4.9,
      totalResponses: 156,
      excellentCount: 88,
      goodCount: 46,
      averageCount: 18,
      poorCount: 4,
      trend: 'up',
    },
    {
      id: '6',
      category: '性价比',
      currentScore: 4.0,
      lastMonthScore: 4.0,
      changeRate: 0.0,
      totalResponses: 156,
      excellentCount: 75,
      goodCount: 55,
      averageCount: 20,
      poorCount: 6,
      trend: 'stable',
    },
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setLoading(true);
    // 模拟API调用
    setTimeout(() => {
      setSurveys(mockSurveys);
      setComplaints(mockComplaints);
      setMetrics(mockMetrics);
      setLoading(false);
    }, 1000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted':
      case 'pending':
        return 'orange';
      case 'processed':
      case 'processing':
        return 'blue';
      case 'resolved':
      case 'closed':
        return 'green';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'submitted':
      case 'pending':
        return <ClockCircleOutlined style={{ color: '#faad14' }} />;
      case 'processed':
      case 'processing':
        return <ExclamationCircleOutlined style={{ color: '#1890ff' }} />;
      case 'resolved':
      case 'closed':
        return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
      default:
        return <ClockCircleOutlined />;
    }
  };

  const getStatusText = (status: string) => {
    const statusMap: { [key: string]: string } = {
      submitted: '已提交',
      processed: '已处理',
      resolved: '已解决',
      pending: '待处理',
      processing: '处理中',
      closed: '已关闭',
    };
    return statusMap[status] || status;
  };

  const getCategoryText = (category: string) => {
    const categoryMap: { [key: string]: string } = {
      service: '服务',
      facility: '设施',
      cleanliness: '清洁',
      noise: '噪音',
      food: '餐饮',
      other: '其他',
    };
    return categoryMap[category] || category;
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
    const severityMap: { [key: string]: string } = {
      low: '低',
      medium: '中',
      high: '高',
      critical: '严重',
    };
    return severityMap[severity] || severity;
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

  const surveyColumns = [
    {
      title: '客人信息',
      key: 'info',
      render: (_: any, record: SatisfactionSurvey) => (
        <Space>
          <Avatar icon={<UserOutlined />} />
          <div>
            <div>
              <Text strong>{record.guestName}</Text>
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              房间 {record.roomNumber} | {record.checkInDate} - {record.checkOutDate}
            </div>
          </div>
        </Space>
      ),
    },
    {
      title: '整体评分',
      dataIndex: 'overallRating',
      key: 'overallRating',
      render: (rating: number) => (
        <Space>
          <Text strong style={{ fontSize: '16px' }}>{rating}</Text>
          <Rate disabled defaultValue={rating} />
        </Space>
      ),
    },
    {
      title: '清洁卫生',
      dataIndex: 'cleanliness',
      key: 'cleanliness',
      render: (rating: number) => <Rate disabled defaultValue={rating} />,
    },
    {
      title: '服务质量',
      dataIndex: 'service',
      key: 'service',
      render: (rating: number) => <Rate disabled defaultValue={rating} />,
    },
    {
      title: '设施设备',
      dataIndex: 'facilities',
      key: 'facilities',
      render: (rating: number) => <Rate disabled defaultValue={rating} />,
    },
    {
      title: '餐饮服务',
      dataIndex: 'food',
      key: 'food',
      render: (rating: number) => <Rate disabled defaultValue={rating} />,
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
      render: (_: any, record: SatisfactionSurvey) => (
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

  const complaintColumns = [
    {
      title: '客人信息',
      key: 'info',
      render: (_: any, record: ComplaintRecord) => (
        <Space>
          <Avatar icon={<UserOutlined />} />
          <div>
            <div>
              <Text strong>{record.guestName}</Text>
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              房间 {record.roomNumber}
            </div>
          </div>
        </Space>
      ),
    },
    {
      title: '投诉类别',
      dataIndex: 'category',
      key: 'category',
      render: (category: string) => <Tag color="blue">{getCategoryText(category)}</Tag>,
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
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      render: (description: string) => (
        <Tooltip title={description}>
          <Text style={{ maxWidth: 200, display: 'block' }} ellipsis>
            {description}
          </Text>
        </Tooltip>
      ),
    },
    {
      title: '处理人',
      dataIndex: 'assignedTo',
      key: 'assignedTo',
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
      render: (_: any, record: ComplaintRecord) => (
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

  const metricColumns = [
    {
      title: '评价类别',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: '当前评分',
      dataIndex: 'currentScore',
      key: 'currentScore',
      render: (score: number) => (
        <Space>
          <Text strong style={{ fontSize: '16px' }}>{score}</Text>
          <Rate disabled defaultValue={Math.round(score)} />
        </Space>
      ),
    },
    {
      title: '变化率',
      key: 'change',
      render: (_: any, record: SatisfactionMetric) => (
        <Space>
          {getTrendIcon(record.trend)}
          <Text style={{ color: record.changeRate >= 0 ? '#52c41a' : '#ff4d4f' }}>
            {record.changeRate >= 0 ? '+' : ''}{record.changeRate}%
          </Text>
        </Space>
      ),
    },
    {
      title: '评价分布',
      key: 'distribution',
      render: (_: any, record: SatisfactionMetric) => (
        <Space direction="vertical" size="small">
          <Text type="secondary">优秀: {record.excellentCount}</Text>
          <Text type="secondary">良好: {record.goodCount}</Text>
          <Text type="secondary">一般: {record.averageCount}</Text>
          <Text type="secondary">较差: {record.poorCount}</Text>
        </Space>
      ),
    },
    {
      title: '总评价数',
      dataIndex: 'totalResponses',
      key: 'totalResponses',
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
  ];

  const handleViewDetails = (record: any) => {
    setSelectedItem(record);
    setDetailsModalVisible(true);
  };

  const handleExport = () => {
    Modal.success({
      title: '导出成功',
      content: '客户满意度数据已成功导出到Excel文件',
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
          <StarOutlined style={{ marginRight: 8 }} />
          客户满意度分析
        </Title>
        <Text type="secondary">
          分析客户满意度调查结果，处理客户投诉，提升服务质量
        </Text>
      </div>

      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="平均满意度"
              value={metrics.find(m => m.category === '整体满意度')?.currentScore || 0}
              prefix={<SmileOutlined />}
              valueStyle={{ color: '#52c41a' }}
              suffix="分"
              precision={1}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="调查总数"
              value={surveys.length}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="投诉数量"
              value={complaints.length}
              prefix={<MessageOutlined />}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="解决率"
              value={Math.round((complaints.filter(c => c.status === 'resolved' || c.status === 'closed').length / complaints.length) * 100)}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#722ed1' }}
              suffix="%"
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
                <Card title="满意度分布" size="small">
                  <List
                    dataSource={metrics}
                    renderItem={(item) => (
                      <List.Item>
                        <List.Item.Meta
                          title={item.category}
                          description={`${item.totalResponses} 条评价`}
                        />
                        <div>
                          <Text strong>{item.currentScore}分</Text>
                          <br />
                          <Text type="secondary">
                            {item.changeRate >= 0 ? '+' : ''}{item.changeRate}%
                          </Text>
                        </div>
                      </List.Item>
                    )}
                  />
                </Card>
              </Col>
              <Col span={12}>
                <Card title="最新评价" size="small">
                  <List
                    dataSource={surveys.slice(0, 5)}
                    renderItem={(item) => (
                      <List.Item>
                        <List.Item.Meta
                          avatar={<Avatar icon={<UserOutlined />} />}
                          title={item.guestName}
                          description={`房间 ${item.roomNumber}`}
                        />
                        <div>
                          <Rate disabled defaultValue={item.overallRating} />
                          <br />
                          <Text type="secondary">{item.timestamp}</Text>
                        </div>
                      </List.Item>
                    )}
                  />
                </Card>
              </Col>
            </Row>
          </TabPane>
          <TabPane tab="满意度调查" key="surveys">
            <Table
              columns={surveyColumns}
              dataSource={surveys}
              rowKey="id"
              loading={loading}
              rowSelection={rowSelection}
              pagination={{
                total: surveys.length,
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
              }}
            />
          </TabPane>
          <TabPane tab="投诉处理" key="complaints">
            <Table
              columns={complaintColumns}
              dataSource={complaints}
              rowKey="id"
              loading={loading}
              pagination={{
                total: complaints.length,
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
              }}
            />
          </TabPane>
          <TabPane tab="满意度指标" key="metrics">
            <Table
              columns={metricColumns}
              dataSource={metrics}
              rowKey="id"
              loading={loading}
              pagination={{
                total: metrics.length,
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
        title="详情信息"
        open={detailsModalVisible}
        onCancel={() => setDetailsModalVisible(false)}
        footer={null}
        width={600}
      >
        {selectedItem && (
          <Descriptions bordered column={2}>
            <Descriptions.Item label="客人姓名" span={2}>
              {selectedItem.guestName}
            </Descriptions.Item>
            <Descriptions.Item label="房间号">
              {selectedItem.roomNumber}
            </Descriptions.Item>
            {selectedItem.overallRating && (
              <Descriptions.Item label="整体评分">
                <Rate disabled defaultValue={selectedItem.overallRating} />
              </Descriptions.Item>
            )}
            {selectedItem.category && (
              <Descriptions.Item label="投诉类别">
                {getCategoryText(selectedItem.category)}
              </Descriptions.Item>
            )}
            {selectedItem.severity && (
              <Descriptions.Item label="严重程度">
                <Tag color={getSeverityColor(selectedItem.severity)}>
                  {getSeverityText(selectedItem.severity)}
                </Tag>
              </Descriptions.Item>
            )}
            {selectedItem.status && (
              <Descriptions.Item label="状态">
                <Badge
                  status={getStatusColor(selectedItem.status) as any}
                  text={getStatusText(selectedItem.status)}
                />
              </Descriptions.Item>
            )}
            {selectedItem.comment && (
              <Descriptions.Item label="评价内容" span={2}>
                {selectedItem.comment}
              </Descriptions.Item>
            )}
            {selectedItem.description && (
              <Descriptions.Item label="投诉描述" span={2}>
                {selectedItem.description}
              </Descriptions.Item>
            )}
            {selectedItem.resolution && (
              <Descriptions.Item label="处理结果" span={2}>
                {selectedItem.resolution}
              </Descriptions.Item>
            )}
            <Descriptions.Item label="创建时间">
              {selectedItem.timestamp || selectedItem.createdAt}
            </Descriptions.Item>
            {selectedItem.resolvedAt && (
              <Descriptions.Item label="解决时间">
                {selectedItem.resolvedAt}
              </Descriptions.Item>
            )}
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default GuestSatisfaction; 