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
  RobotOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  StopOutlined,
  ReloadOutlined,
  SettingOutlined,
  EyeOutlined,
  PlusOutlined,
  ExportOutlined,
  LineChartOutlined,
  AlertOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  ThunderboltOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  TrophyOutlined,
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

interface CleaningRobot {
  id: string;
  name: string;
  model: string;
  status: 'idle' | 'working' | 'charging' | 'maintenance' | 'error';
  battery: number;
  currentTask: string;
  location: string;
  efficiency: number;
  totalDistance: number;
  totalTime: number;
  lastMaintenance: string;
  nextMaintenance: string;
  lastUpdate: string;
}

interface CleaningTask {
  id: string;
  robotId: string;
  robotName: string;
  area: string;
  taskType: 'daily' | 'deep' | 'spot';
  status: 'pending' | 'running' | 'completed' | 'cancelled';
  startTime: string;
  endTime?: string;
  duration?: number;
  progress: number;
  priority: 'low' | 'medium' | 'high';
}

const CleaningRobot: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [robots, setRobots] = useState<CleaningRobot[]>([]);
  const [tasks, setTasks] = useState<CleaningTask[]>([]);
  const [selectedRobots, setSelectedRobots] = useState<string[]>([]);
  const [taskModalVisible, setTaskModalVisible] = useState(false);
  const [controlModalVisible, setControlModalVisible] = useState(false);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [selectedRobot, setSelectedRobot] = useState<CleaningRobot | null>(null);
  const [activeTab, setActiveTab] = useState('robots');

  // 模拟数据
  const mockRobots: CleaningRobot[] = [
    {
      id: '1',
      name: '清洁机器人-01',
      model: 'CR-2000',
      status: 'working',
      battery: 85,
      currentTask: '客房楼层清洁',
      location: '3楼走廊',
      efficiency: 92,
      totalDistance: 125.6,
      totalTime: 45.2,
      lastMaintenance: '2025-07-10',
      nextMaintenance: '2025-07-25',
      lastUpdate: '2025-07-23 14:30:00',
    },
    {
      id: '2',
      name: '清洁机器人-02',
      model: 'CR-2000',
      status: 'charging',
      battery: 35,
      currentTask: '充电中',
      location: '充电站A',
      efficiency: 88,
      totalDistance: 98.3,
      totalTime: 32.1,
      lastMaintenance: '2025-07-08',
      nextMaintenance: '2025-07-23',
      lastUpdate: '2025-07-23 14:30:00',
    },
    {
      id: '3',
      name: '清洁机器人-03',
      model: 'CR-2000',
      status: 'idle',
      battery: 95,
      currentTask: '待机中',
      location: '大堂',
      efficiency: 95,
      totalDistance: 156.7,
      totalTime: 52.8,
      lastMaintenance: '2025-07-12',
      nextMaintenance: '2025-07-27',
      lastUpdate: '2025-07-23 14:30:00',
    },
    {
      id: '4',
      name: '清洁机器人-04',
      model: 'CR-2000',
      status: 'maintenance',
      battery: 60,
      currentTask: '维护中',
      location: '维修间',
      efficiency: 78,
      totalDistance: 89.4,
      totalTime: 28.9,
      lastMaintenance: '2025-07-23',
      nextMaintenance: '2025-07-30',
      lastUpdate: '2025-07-23 14:30:00',
    },
    {
      id: '5',
      name: '清洁机器人-05',
      model: 'CR-2000',
      status: 'error',
      battery: 20,
      currentTask: '故障待处理',
      location: '2楼走廊',
      efficiency: 65,
      totalDistance: 67.2,
      totalTime: 18.5,
      lastMaintenance: '2025-07-05',
      nextMaintenance: '2025-07-20',
      lastUpdate: '2025-07-23 14:30:00',
    },
  ];

  const mockTasks: CleaningTask[] = [
    {
      id: '1',
      robotId: '1',
      robotName: '清洁机器人-01',
      area: '客房楼层',
      taskType: 'daily',
      status: 'running',
      startTime: '2025-07-23 08:00',
      progress: 75,
      priority: 'high',
    },
    {
      id: '2',
      robotId: '2',
      robotName: '清洁机器人-02',
      area: '大堂区域',
      taskType: 'deep',
      status: 'pending',
      startTime: '2025-07-23 16:00',
      progress: 0,
      priority: 'medium',
    },
    {
      id: '3',
      robotId: '3',
      robotName: '清洁机器人-03',
      area: '餐厅区域',
      taskType: 'daily',
      status: 'completed',
      startTime: '2025-07-23 06:00',
      endTime: '2025-07-23 08:30',
      duration: 2.5,
      progress: 100,
      priority: 'high',
    },
    {
      id: '4',
      robotId: '4',
      robotName: '清洁机器人-04',
      area: '会议室',
      taskType: 'spot',
      status: 'cancelled',
      startTime: '2025-07-23 10:00',
      progress: 30,
      priority: 'low',
    },
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setLoading(true);
    // 模拟API调用
    setTimeout(() => {
      setRobots(mockRobots);
      setTasks(mockTasks);
      setLoading(false);
    }, 1000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'idle':
      case 'completed':
        return 'green';
      case 'working':
      case 'running':
        return 'blue';
      case 'charging':
        return 'orange';
      case 'maintenance':
        return 'purple';
      case 'error':
      case 'cancelled':
        return 'red';
      case 'pending':
        return 'gold';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'idle':
      case 'completed':
        return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
      case 'working':
      case 'running':
        return <PlayCircleOutlined style={{ color: '#1890ff' }} />;
      case 'charging':
        return <ThunderboltOutlined style={{ color: '#faad14' }} />;
      case 'maintenance':
        return <SettingOutlined style={{ color: '#722ed1' }} />;
      case 'error':
      case 'cancelled':
        return <CloseCircleOutlined style={{ color: '#ff4d4f' }} />;
      case 'pending':
        return <ClockCircleOutlined style={{ color: '#faad14' }} />;
      default:
        return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'idle':
        return '待机';
      case 'working':
        return '工作中';
      case 'charging':
        return '充电中';
      case 'maintenance':
        return '维护中';
      case 'error':
        return '故障';
      case 'pending':
        return '等待中';
      case 'running':
        return '执行中';
      case 'completed':
        return '已完成';
      case 'cancelled':
        return '已取消';
      default:
        return '未知';
    }
  };

  const getTaskTypeText = (type: string) => {
    switch (type) {
      case 'daily':
        return '日常清洁';
      case 'deep':
        return '深度清洁';
      case 'spot':
        return '定点清洁';
      default:
        return '未知';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'red';
      case 'medium':
        return 'orange';
      case 'low':
        return 'green';
      default:
        return 'default';
    }
  };

  const robotColumns = [
    {
      title: '机器人信息',
      key: 'info',
      render: (_: any, record: CleaningRobot) => (
        <Space>
          <Avatar size="large" icon={<RobotOutlined />} />
          <div>
            <div>
              <Text strong>{record.name}</Text>
              <Text code style={{ marginLeft: 8 }}>{record.model}</Text>
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
      title: '电池电量',
      dataIndex: 'battery',
      key: 'battery',
      render: (value: number) => (
        <Space direction="vertical" size="small" style={{ width: '100%' }}>
          <Text strong>{value}%</Text>
          <Progress
            percent={value}
            size="small"
            strokeColor={value < 20 ? '#ff4d4f' : value < 50 ? '#faad14' : '#52c41a'}
            showInfo={false}
          />
        </Space>
      ),
    },
    {
      title: '当前任务',
      dataIndex: 'currentTask',
      key: 'currentTask',
    },
    {
      title: '清洁效率',
      dataIndex: 'efficiency',
      key: 'efficiency',
      render: (value: number) => (
        <Text strong style={{ color: value > 90 ? '#52c41a' : value > 70 ? '#faad14' : '#ff4d4f' }}>
          {value}%
        </Text>
      ),
    },
    {
      title: '累计数据',
      key: 'stats',
      render: (_: any, record: CleaningRobot) => (
        <Space direction="vertical" size="small">
          <Text>距离: {record.totalDistance.toFixed(1)} km</Text>
          <Text>时间: {record.totalTime.toFixed(1)} h</Text>
        </Space>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: CleaningRobot) => (
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
            icon={<SettingOutlined />}
            onClick={() => handleControl(record)}
          >
            控制
          </Button>
        </Space>
      ),
    },
  ];

  const taskColumns = [
    {
      title: '任务信息',
      key: 'info',
      render: (_: any, record: CleaningTask) => (
        <Space>
          <div>
            <div>
              <Text strong>{record.robotName}</Text>
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              {record.area} - {getTaskTypeText(record.taskType)}
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
        <Badge
          status={getStatusColor(status) as any}
          text={getStatusText(status)}
        />
      ),
    },
    {
      title: '优先级',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority: string) => (
        <Tag color={getPriorityColor(priority)}>
          {priority === 'high' ? '高' : priority === 'medium' ? '中' : '低'}
        </Tag>
      ),
    },
    {
      title: '进度',
      dataIndex: 'progress',
      key: 'progress',
      render: (value: number) => (
        <Progress
          percent={value}
          size="small"
          strokeColor={value === 100 ? '#52c41a' : '#1890ff'}
        />
      ),
    },
    {
      title: '开始时间',
      dataIndex: 'startTime',
      key: 'startTime',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: CleaningTask) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleViewTaskDetails(record)}
          >
            详情
          </Button>
          {record.status === 'pending' && (
            <Button
              type="link"
              size="small"
              danger
              onClick={() => handleCancelTask(record)}
            >
              取消
            </Button>
          )}
        </Space>
      ),
    },
  ];

  const handleViewDetails = (record: CleaningRobot) => {
    setSelectedRobot(record);
    setDetailsModalVisible(true);
  };

  const handleControl = (record: CleaningRobot) => {
    setSelectedRobot(record);
    setControlModalVisible(true);
  };

  const handleViewTaskDetails = (record: CleaningTask) => {
    Modal.info({
      title: '任务详情',
      content: (
        <Descriptions bordered column={1}>
          <Descriptions.Item label="机器人">{record.robotName}</Descriptions.Item>
          <Descriptions.Item label="清洁区域">{record.area}</Descriptions.Item>
          <Descriptions.Item label="任务类型">{getTaskTypeText(record.taskType)}</Descriptions.Item>
          <Descriptions.Item label="状态">{getStatusText(record.status)}</Descriptions.Item>
          <Descriptions.Item label="优先级">{record.priority}</Descriptions.Item>
          <Descriptions.Item label="开始时间">{record.startTime}</Descriptions.Item>
          {record.endTime && <Descriptions.Item label="结束时间">{record.endTime}</Descriptions.Item>}
          {record.duration && <Descriptions.Item label="耗时">{record.duration} 小时</Descriptions.Item>}
        </Descriptions>
      ),
      width: 600,
    });
  };

  const handleCancelTask = (record: CleaningTask) => {
    Modal.confirm({
      title: '确认取消',
      content: `确定要取消任务 "${record.area}" 吗？`,
      onOk: () => {
        setTasks(tasks.map(task => 
          task.id === record.id ? { ...task, status: 'cancelled' } : task
        ));
        Modal.success({
          title: '取消成功',
          content: '任务已成功取消',
        });
      },
    });
  };

  const handleAddTask = () => {
    setTaskModalVisible(true);
  };

  const handleExport = () => {
    Modal.success({
      title: '导出成功',
      content: '清洁机器人数据已成功导出到Excel文件',
    });
  };

  const handleBatchOperation = () => {
    if (selectedRobots.length === 0) {
      Modal.warning({
        title: '提示',
        content: '请先选择要操作的机器人',
      });
      return;
    }
    Modal.info({
      title: '批量操作',
      content: `已选择 ${selectedRobots.length} 个机器人进行批量操作`,
    });
  };

  const robotRowSelection = {
    selectedRowKeys: selectedRobots,
    onChange: (selectedRowKeys: React.Key[]) => {
      setSelectedRobots(selectedRowKeys as string[]);
    },
  };

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <Title level={2}>
          <RobotOutlined style={{ marginRight: 8 }} />
          清洁机器人管理
        </Title>
        <Text type="secondary">
          管理酒店清洁机器人，监控运行状态和任务执行情况
        </Text>
      </div>

      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="机器人总数"
              value={robots.length}
              prefix={<RobotOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="工作中"
              value={robots.filter(item => item.status === 'working').length}
              prefix={<PlayCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="充电中"
              value={robots.filter(item => item.status === 'charging').length}
              prefix={<ThunderboltOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="故障数量"
              value={robots.filter(item => item.status === 'error').length}
              prefix={<ExclamationCircleOutlined />}
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
            icon={<PlusOutlined />}
            onClick={handleAddTask}
          >
            添加任务
          </Button>
          <Button
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
          {selectedRobots.length > 0 && (
            <Button
              type="default"
              onClick={handleBatchOperation}
            >
              批量操作 ({selectedRobots.length})
            </Button>
          )}
        </Space>
      </Card>

      {/* 主要内容区域 */}
      <Card>
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="机器人状态" key="robots">
            <Table
              columns={robotColumns}
              dataSource={robots}
              rowKey="id"
              loading={loading}
              rowSelection={robotRowSelection}
              pagination={{
                total: robots.length,
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
              }}
            />
          </TabPane>
          <TabPane tab="任务管理" key="tasks">
            <Table
              columns={taskColumns}
              dataSource={tasks}
              rowKey="id"
              loading={loading}
              pagination={{
                total: tasks.length,
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

      {/* 机器人详情模态框 */}
      <Modal
        title="机器人详情"
        open={detailsModalVisible}
        onCancel={() => setDetailsModalVisible(false)}
        footer={null}
        width={600}
      >
        {selectedRobot && (
          <Descriptions bordered column={2}>
            <Descriptions.Item label="机器人名称" span={2}>
              {selectedRobot.name}
            </Descriptions.Item>
            <Descriptions.Item label="型号">
              {selectedRobot.model}
            </Descriptions.Item>
            <Descriptions.Item label="状态">
              <Badge
                status={getStatusColor(selectedRobot.status) as any}
                text={getStatusText(selectedRobot.status)}
              />
            </Descriptions.Item>
            <Descriptions.Item label="当前位置">
              {selectedRobot.location}
            </Descriptions.Item>
            <Descriptions.Item label="当前任务">
              {selectedRobot.currentTask}
            </Descriptions.Item>
            <Descriptions.Item label="电池电量">
              <Progress
                percent={selectedRobot.battery}
                strokeColor={selectedRobot.battery < 20 ? '#ff4d4f' : selectedRobot.battery < 50 ? '#faad14' : '#52c41a'}
              />
            </Descriptions.Item>
            <Descriptions.Item label="清洁效率">
              {selectedRobot.efficiency}%
            </Descriptions.Item>
            <Descriptions.Item label="累计清洁距离">
              {selectedRobot.totalDistance.toFixed(1)} km
            </Descriptions.Item>
            <Descriptions.Item label="累计工作时间">
              {selectedRobot.totalTime.toFixed(1)} 小时
            </Descriptions.Item>
            <Descriptions.Item label="上次维护">
              {selectedRobot.lastMaintenance}
            </Descriptions.Item>
            <Descriptions.Item label="下次维护">
              {selectedRobot.nextMaintenance}
            </Descriptions.Item>
            <Descriptions.Item label="最后更新" span={2}>
              {selectedRobot.lastUpdate}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>

      {/* 机器人控制模态框 */}
      <Modal
        title="机器人控制"
        open={controlModalVisible}
        onCancel={() => setControlModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setControlModalVisible(false)}>
            取消
          </Button>,
        ]}
        width={500}
      >
        {selectedRobot && (
          <div>
            <Alert
              message={`当前控制: ${selectedRobot.name}`}
              description={`状态: ${getStatusText(selectedRobot.status)} | 位置: ${selectedRobot.location}`}
              type="info"
              showIcon
              style={{ marginBottom: '16px' }}
            />
            <Space direction="vertical" style={{ width: '100%' }}>
              <Button type="primary" icon={<PlayCircleOutlined />} block>
                开始工作
              </Button>
              <Button icon={<PauseCircleOutlined />} block>
                暂停工作
              </Button>
              <Button icon={<StopOutlined />} block>
                停止工作
              </Button>
              <Button icon={<ThunderboltOutlined />} block>
                开始充电
              </Button>
              <Button icon={<SettingOutlined />} block>
                进入维护模式
              </Button>
            </Space>
          </div>
        )}
      </Modal>

      {/* 添加任务模态框 */}
      <Modal
        title="添加清洁任务"
        open={taskModalVisible}
        onCancel={() => setTaskModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setTaskModalVisible(false)}>
            取消
          </Button>,
          <Button key="submit" type="primary">
            创建任务
          </Button>,
        ]}
        width={600}
      >
        <Form layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="选择机器人" required>
                <Select placeholder="请选择清洁机器人">
                  {robots.map(robot => (
                    <Select.Option key={robot.id} value={robot.id}>
                      {robot.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="清洁区域" required>
                <Select placeholder="请选择清洁区域">
                  <Select.Option value="大堂">大堂</Select.Option>
                  <Select.Option value="客房楼层">客房楼层</Select.Option>
                  <Select.Option value="餐厅">餐厅</Select.Option>
                  <Select.Option value="会议室">会议室</Select.Option>
                  <Select.Option value="健身房">健身房</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="任务类型" required>
                <Select placeholder="请选择任务类型">
                  <Select.Option value="daily">日常清洁</Select.Option>
                  <Select.Option value="deep">深度清洁</Select.Option>
                  <Select.Option value="spot">定点清洁</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="优先级" required>
                <Select placeholder="请选择优先级">
                  <Select.Option value="high">高</Select.Option>
                  <Select.Option value="medium">中</Select.Option>
                  <Select.Option value="low">低</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="计划时间">
            <RangePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label="备注">
            <Input.TextArea rows={3} placeholder="请输入任务备注信息" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CleaningRobot; 