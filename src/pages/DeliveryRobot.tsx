import React, { useState, useEffect, useMemo } from 'react';
import {
  Card,
  Row,
  Col,
  Table,
  Tag,
  Button,
  Space,
  Statistic,
  Progress,
  Modal,
  Form,
  Input,
  Select,
  InputNumber,
  Timeline,
  Alert,
  Badge,
  Tooltip,
  Avatar,
  List,
  Typography,
  Divider,
  Switch,
  message,
  Descriptions,
  Steps,
  Tabs
} from 'antd';
import {
  RobotOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  ReloadOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  SettingOutlined,
  ThunderboltOutlined,
  BarsOutlined,
  WifiOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  LoadingOutlined,
  HomeOutlined,
  CoffeeOutlined,
  GiftOutlined,
  SafetyOutlined,
  CompassOutlined,
  HistoryOutlined,
  StarOutlined,
  BarChartOutlined,
  PieChartOutlined,
  LineChartOutlined,
  BellOutlined,
  NotificationOutlined,
  FilterOutlined,
  SearchOutlined,
  DownloadOutlined,
  UploadOutlined,
  CalendarOutlined,
  TeamOutlined,
  ToolOutlined,
  InfoCircleOutlined,
  WarningOutlined,
  SyncOutlined,
  CloudOutlined,
  DatabaseOutlined,
  FileTextOutlined,
  ScheduleOutlined,
  BulbOutlined,
  TrophyOutlined,
  RiseOutlined,
  FallOutlined
} from '@ant-design/icons';
import { hotelDevices } from '../data/mockData';
import { Line, Column, Pie } from '@ant-design/plots';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TextArea } = Input;

interface RobotTask {
  id: string;
  robotId: string;
  robotName: string;
  taskType: 'delivery' | 'pickup' | 'maintenance' | 'patrol';
  status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  startLocation: string;
  destination: string;
  guestName?: string;
  roomNumber?: string;
  items: string[];
  estimatedTime: number; // 分钟
  actualTime?: number;
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
  operator: string;
  notes?: string;
}

interface RobotStatus {
  id: string;
  name: string;
  status: 'online' | 'offline' | 'charging' | 'maintenance' | 'error';
  battery: number;
  signal: number;
  currentLocation: string;
  currentTask?: string;
  speed: number; // km/h
  temperature: number;
  lastUpdate: string;
  totalDeliveries: number;
  totalDistance: number; // km
  uptime: number; // 小时
  errorCode?: string;
  errorMessage?: string;
}

const DeliveryRobot: React.FC = () => {
  const [robots, setRobots] = useState<RobotStatus[]>([]);
  const [tasks, setTasks] = useState<RobotTask[]>([]);
  const [selectedRobot, setSelectedRobot] = useState<RobotStatus | null>(null);
  const [selectedTask, setSelectedTask] = useState<RobotTask | null>(null);
  const [taskModalVisible, setTaskModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [taskDetailModalVisible, setTaskDetailModalVisible] = useState(false);
  const [controlModalVisible, setControlModalVisible] = useState(false);
  const [taskForm] = Form.useForm();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [taskTypeFilter, setTaskTypeFilter] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<[string, string] | null>(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // 模拟机器人数据
  const loadRobotData = () => {
    const robotData: RobotStatus[] = [
      {
        id: 'robot_001',
        name: '送餐机器人-01',
        status: 'online',
        battery: 85,
        signal: 95,
        currentLocation: '厨房',
        currentTask: '配送房间201的午餐',
        speed: 2.5,
        temperature: 25,
        lastUpdate: '2025-01-15 14:30:00',
        totalDeliveries: 156,
        totalDistance: 45.2,
        uptime: 120
      },
      {
        id: 'robot_002',
        name: '送餐机器人-02',
        status: 'charging',
        battery: 35,
        signal: 88,
        currentLocation: '充电站A',
        speed: 0,
        temperature: 24,
        lastUpdate: '2025-01-15 14:25:00',
        totalDeliveries: 142,
        totalDistance: 38.7,
        uptime: 98
      },
      {
        id: 'robot_003',
        name: '送餐机器人-03',
        status: 'online',
        battery: 92,
        signal: 97,
        currentLocation: '大堂',
        currentTask: '配送房间105的下午茶',
        speed: 2.8,
        temperature: 26,
        lastUpdate: '2025-01-15 14:32:00',
        totalDeliveries: 203,
        totalDistance: 67.3,
        uptime: 156
      },
      {
        id: 'robot_004',
        name: '送餐机器人-04',
        status: 'maintenance',
        battery: 78,
        signal: 0,
        currentLocation: '维修间',
        speed: 0,
        temperature: 22,
        lastUpdate: '2025-01-15 14:20:00',
        totalDeliveries: 89,
        totalDistance: 23.1,
        uptime: 67,
        errorCode: 'MOTOR_FAULT',
        errorMessage: '左轮电机异常'
      }
    ];

    const taskData: RobotTask[] = [
      {
        id: 'task_001',
        robotId: 'robot_001',
        robotName: '送餐机器人-01',
        taskType: 'delivery',
        status: 'in_progress',
        priority: 'high',
        startLocation: '厨房',
        destination: '房间201',
        guestName: '张先生',
        roomNumber: '201',
        items: ['宫保鸡丁', '米饭', '汤'],
        estimatedTime: 8,
        actualTime: 6,
        createdAt: '2025-01-15 14:25:00',
        startedAt: '2025-01-15 14:26:00',
        operator: '李厨师',
        notes: '客人要求15分钟内送达'
      },
      {
        id: 'task_002',
        robotId: 'robot_003',
        robotName: '送餐机器人-03',
        taskType: 'delivery',
        status: 'in_progress',
        priority: 'medium',
        startLocation: '大堂',
        destination: '房间105',
        guestName: '王女士',
        roomNumber: '105',
        items: ['咖啡', '蛋糕', '水果'],
        estimatedTime: 5,
        createdAt: '2025-01-15 14:30:00',
        startedAt: '2025-01-15 14:31:00',
        operator: '前台小王'
      },
      {
        id: 'task_003',
        robotId: 'robot_002',
        robotName: '送餐机器人-02',
        taskType: 'maintenance',
        status: 'completed',
        priority: 'low',
        startLocation: '充电站A',
        destination: '维修间',
        items: ['电池检查', '系统更新'],
        estimatedTime: 30,
        actualTime: 25,
        createdAt: '2025-01-15 13:00:00',
        startedAt: '2025-01-15 13:05:00',
        completedAt: '2025-01-15 13:30:00',
        operator: '技术员老张'
      }
    ];

    setRobots(robotData);
    setTasks(taskData);

    // 模拟告警数据
    const alertData = [
      {
        id: 'alert_001',
        type: 'warning',
        title: '机器人电量低',
        message: '送餐机器人-02电量低于20%，建议及时充电',
        robotId: 'robot_002',
        timestamp: '2025-01-15 14:25:00',
        read: false
      },
      {
        id: 'alert_002',
        type: 'error',
        title: '机器人故障',
        message: '送餐机器人-04左轮电机异常，需要维修',
        robotId: 'robot_004',
        timestamp: '2025-01-15 14:20:00',
        read: false
      },
      {
        id: 'alert_003',
        type: 'info',
        title: '任务完成',
        message: '房间201的午餐配送任务已完成',
        robotId: 'robot_001',
        timestamp: '2025-01-15 14:15:00',
        read: true
      }
    ];
    setAlerts(alertData);
  };

  // 模拟性能趋势数据
  const performanceTrendData = useMemo(() => {
    const now = new Date();
    const data = [];
    
    // 生成过去7天的数据
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = `${date.getMonth() + 1}/${date.getDate()}`;
      
      data.push({
        date: dateStr,
        type: '配送次数',
        value: Math.floor(Math.random() * 50) + 20
      });
      
      data.push({
        date: dateStr,
        type: '运行时间',
        value: Math.floor(Math.random() * 8) + 4
      });
      
      data.push({
        date: dateStr,
        type: '平均效率',
        value: Math.floor(Math.random() * 3) + 1.5
      });
    }
    
    return data;
  }, []);

  // 图表配置
  const chartConfig = {
    theme: {
      colors10: ['#1890ff', '#52c41a', '#fa8c16', '#722ed1', '#f5222d', '#13c2c2', '#eb2f96', '#faad14', '#a0d911', '#2f54eb']
    }
  };

  // 机器人性能对比数据
  const robotComparisonData = useMemo(() => {
    return robots.map(robot => ({
      robot: robot.name,
      deliveries: robot.totalDeliveries,
      distance: robot.totalDistance,
      efficiency: Math.round((robot.totalDeliveries / robot.uptime) * 100) / 100
    }));
  }, [robots]);

  // 任务类型分布数据
  const taskTypeDistributionData = useMemo(() => {
    const taskTypeStats = tasks.reduce((acc, task) => {
      acc[task.taskType] = (acc[task.taskType] || 0) + 1;
      return acc;
    }, {} as any);

    return Object.entries(taskTypeStats).map(([type, count]) => ({
      type: type === 'delivery' ? '配送' :
            type === 'pickup' ? '取餐' :
            type === 'maintenance' ? '维护' : '巡逻',
      value: count as number
    }));
  }, [tasks]);

  // 初始化数据
  useEffect(() => {
    loadRobotData();
  }, []);

  // 刷新状态
  const handleRefreshStatus = async () => {
    setLoading(true);
    try {
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 1000));
      loadRobotData();
      message.success('状态刷新成功');
    } catch (error) {
      message.error('状态刷新失败');
    } finally {
      setLoading(false);
    }
  };

  // 创建新任务
  const handleCreateTask = () => {
    setTaskModalVisible(true);
    taskForm.resetFields();
  };

  // 提交任务表单
  const handleTaskSubmit = async (values: any) => {
    try {
      const newTask: RobotTask = {
        id: `task_${Date.now()}`,
        robotId: values.robotId,
        robotName: robots.find(r => r.id === values.robotId)?.name || '',
        taskType: values.taskType,
        status: 'pending',
        priority: values.priority,
        startLocation: values.startLocation,
        destination: values.destination,
        guestName: values.guestName,
        roomNumber: values.roomNumber,
        items: values.items ? values.items.split(',').map((item: string) => item.trim()) : [],
        estimatedTime: values.estimatedTime,
        createdAt: new Date().toLocaleString('zh-CN'),
        operator: values.operator || '系统管理员'
      };

      setTasks(prev => [newTask, ...prev]);
      setTaskModalVisible(false);
      taskForm.resetFields();
      message.success('任务创建成功');
    } catch (error) {
      message.error('任务创建失败');
    }
  };

  // 取消任务
  const handleCancelTask = (taskId: string) => {
    Modal.confirm({
      title: '确认取消任务',
      content: '确定要取消这个任务吗？',
      onOk: () => {
        setTasks(prev => prev.map(task => 
          task.id === taskId ? { ...task, status: 'cancelled' } : task
        ));
        message.success('任务已取消');
      }
    });
  };

  // 机器人控制
  const handleRobotControl = (robot: RobotStatus) => {
    setSelectedRobot(robot);
    setControlModalVisible(true);
  };

  // 执行机器人控制操作
  const handleRobotAction = (action: string) => {
    if (!selectedRobot) return;
    
    const robotId = selectedRobot.id;
    setRobots(prev => prev.map(robot => {
      if (robot.id === robotId) {
        switch (action) {
          case 'start':
            return { ...robot, status: 'online', speed: 2.5 };
          case 'stop':
            return { ...robot, status: 'offline', speed: 0, currentTask: undefined };
          case 'charge':
            return { ...robot, status: 'charging', speed: 0, currentTask: undefined };
          case 'maintenance':
            return { ...robot, status: 'maintenance', speed: 0, currentTask: undefined };
          default:
            return robot;
        }
      }
      return robot;
    }));
    
    message.success(`机器人${action === 'start' ? '启动' : action === 'stop' ? '停止' : action === 'charge' ? '充电' : '维护'}成功`);
    setControlModalVisible(false);
  };

  // 批量操作
  const handleBatchOperation = (operation: string) => {
    if (selectedRowKeys.length === 0) {
      message.warning('请先选择要操作的机器人');
      return;
    }

    Modal.confirm({
      title: `确认${operation === 'start' ? '启动' : operation === 'stop' ? '停止' : '充电'}选中的机器人`,
      content: `确定要${operation === 'start' ? '启动' : operation === 'stop' ? '停止' : '充电'} ${selectedRowKeys.length} 个机器人吗？`,
      onOk: () => {
        setRobots(prev => prev.map(robot => {
          if (selectedRowKeys.includes(robot.id)) {
            switch (operation) {
              case 'start':
                return { ...robot, status: 'online', speed: 2.5 };
              case 'stop':
                return { ...robot, status: 'offline', speed: 0, currentTask: undefined };
              case 'charge':
                return { ...robot, status: 'charging', speed: 0, currentTask: undefined };
              default:
                return robot;
            }
          }
          return robot;
        }));
        setSelectedRowKeys([]);
        message.success(`批量${operation === 'start' ? '启动' : operation === 'stop' ? '停止' : '充电'}成功`);
      }
    });
  };

  // 导出数据
  const handleExportData = () => {
    const data = {
      robots: robots,
      tasks: tasks,
      exportTime: new Date().toLocaleString('zh-CN')
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `delivery_robot_data_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    message.success('数据导出成功');
  };

  // 标记告警为已读
  const handleMarkAlertRead = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, read: true } : alert
    ));
  };

  // 获取统计数据
  const getAnalyticsData = () => {
    const today = new Date().toDateString();
    const todayTasks = tasks.filter(task => 
      new Date(task.createdAt).toDateString() === today
    );
    
    const taskTypeStats = tasks.reduce((acc, task) => {
      acc[task.taskType] = (acc[task.taskType] || 0) + 1;
      return acc;
    }, {} as any);

    const robotPerformance = robots.map(robot => ({
      name: robot.name,
      deliveries: robot.totalDeliveries,
      distance: robot.totalDistance,
      uptime: robot.uptime,
      efficiency: robot.totalDeliveries / robot.uptime
    }));

    return {
      todayTasks: todayTasks.length,
      taskTypeStats,
      robotPerformance,
      totalAlerts: alerts.filter(alert => !alert.read).length
    };
  };

  // 过滤数据
  const filteredRobots = robots.filter(robot => {
    const matchesSearch = robot.name.toLowerCase().includes(searchText.toLowerCase()) ||
                         robot.currentLocation.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = statusFilter.length === 0 || statusFilter.includes(robot.status);
    return matchesSearch && matchesStatus;
  });

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.robotName.toLowerCase().includes(searchText.toLowerCase()) ||
                         task.destination.toLowerCase().includes(searchText.toLowerCase());
    const matchesType = taskTypeFilter.length === 0 || taskTypeFilter.includes(task.taskType);
    const matchesStatus = statusFilter.length === 0 || statusFilter.includes(task.status);
    return matchesSearch && matchesType && matchesStatus;
  });

  // 获取状态颜色
  const getStatusColor = (status: string) => {
    const colors = {
      online: 'green',
      offline: 'red',
      charging: 'blue',
      maintenance: 'orange',
      error: 'red'
    };
    return colors[status as keyof typeof colors] || 'default';
  };

  // 获取状态图标
  const getStatusIcon = (status: string) => {
    const icons = {
      online: <CheckCircleOutlined />,
      offline: <ExclamationCircleOutlined />,
      charging: <BarsOutlined />,
      maintenance: <SettingOutlined />,
      error: <ExclamationCircleOutlined />
    };
    return icons[status as keyof typeof icons] || <LoadingOutlined />;
  };

  // 获取任务类型图标
  const getTaskTypeIcon = (type: string) => {
    const icons = {
      delivery: <CoffeeOutlined />,
      pickup: <GiftOutlined />,
      maintenance: <SettingOutlined />,
      patrol: <CompassOutlined />
    };
    return icons[type as keyof typeof icons] || <RobotOutlined />;
  };

  // 机器人状态表格列
  const robotColumns = [
    {
      title: '机器人',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: RobotStatus) => (
        <Space>
          <Avatar icon={<RobotOutlined />} style={{ backgroundColor: '#1890ff' }} />
          <div>
            <div style={{ fontWeight: 'bold' }}>{name}</div>
            <div style={{ fontSize: '12px', color: '#666' }}>ID: {record.id}</div>
          </div>
        </Space>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string, record: RobotStatus) => (
        <div>
          <Tag color={getStatusColor(status)} icon={getStatusIcon(status)}>
            {status === 'online' ? '在线' :
             status === 'offline' ? '离线' :
             status === 'charging' ? '充电中' :
             status === 'maintenance' ? '维护中' : '故障'}
          </Tag>
          {record.currentTask && (
            <div style={{ fontSize: '12px', color: '#666', marginTop: 4 }}>
              {record.currentTask}
            </div>
          )}
        </div>
      ),
    },
    {
      title: '电量',
      dataIndex: 'battery',
      key: 'battery',
      render: (battery: number) => (
        <div>
          <Progress 
            percent={battery} 
            size="small" 
            strokeColor={battery > 20 ? '#52c41a' : '#ff4d4f'}
            showInfo={false}
          />
          <div style={{ fontSize: '12px', textAlign: 'center' }}>{battery}%</div>
        </div>
      ),
    },
    {
      title: '位置',
      dataIndex: 'currentLocation',
      key: 'currentLocation',
      render: (location: string) => (
        <Space>
          <EnvironmentOutlined style={{ color: '#1890ff' }} />
          {location}
        </Space>
      ),
    },
    {
      title: '速度',
      dataIndex: 'speed',
      key: 'speed',
      render: (speed: number) => (
        <Space>
          <ThunderboltOutlined style={{ color: '#fa8c16' }} />
          {speed} km/h
        </Space>
      ),
    },
    {
      title: '统计',
      key: 'statistics',
      render: (record: RobotStatus) => (
        <div style={{ fontSize: '12px' }}>
          <div>配送: {record.totalDeliveries}次</div>
          <div>里程: {record.totalDistance}km</div>
          <div>运行: {record.uptime}h</div>
        </div>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (record: RobotStatus) => (
        <Space>
          <Tooltip title="查看详情">
            <Button
              type="link"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => {
                setSelectedRobot(record);
                setDetailModalVisible(true);
              }}
            />
          </Tooltip>
          <Tooltip title="控制">
            <Button
              type="link"
              size="small"
              icon={<SettingOutlined />}
              onClick={() => handleRobotControl(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  // 任务表格列
  const taskColumns = [
    {
      title: '任务ID',
      dataIndex: 'id',
      key: 'id',
      width: 100,
    },
    {
      title: '机器人',
      dataIndex: 'robotName',
      key: 'robotName',
      render: (name: string) => (
        <Space>
          <RobotOutlined />
          {name}
        </Space>
      ),
    },
    {
      title: '任务类型',
      dataIndex: 'taskType',
      key: 'taskType',
      render: (type: string, record: RobotTask) => (
        <Space>
          {getTaskTypeIcon(type)}
          {type === 'delivery' ? '配送' :
           type === 'pickup' ? '取餐' :
           type === 'maintenance' ? '维护' : '巡逻'}
        </Space>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusConfig = {
          pending: { color: 'default', text: '待执行' },
          in_progress: { color: 'processing', text: '执行中' },
          completed: { color: 'success', text: '已完成' },
          failed: { color: 'error', text: '失败' },
          cancelled: { color: 'default', text: '已取消' }
        };
        const config = statusConfig[status as keyof typeof statusConfig];
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: '路径',
      key: 'route',
      render: (record: RobotTask) => (
        <div style={{ fontSize: '12px' }}>
          <div>{record.startLocation} → {record.destination}</div>
          {record.roomNumber && (
            <div style={{ color: '#666' }}>房间: {record.roomNumber}</div>
          )}
        </div>
      ),
    },
    {
      title: '时间',
      key: 'time',
      render: (record: RobotTask) => (
        <div style={{ fontSize: '12px' }}>
          <div>预计: {record.estimatedTime}分钟</div>
          {record.actualTime && (
            <div style={{ color: '#52c41a' }}>实际: {record.actualTime}分钟</div>
          )}
        </div>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (record: RobotTask) => (
        <Space>
          <Tooltip title="查看详情">
            <Button
              type="link"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => {
                setSelectedTask(record);
                setTaskDetailModalVisible(true);
              }}
            />
          </Tooltip>
          {record.status === 'pending' && (
            <Tooltip title="取消任务">
              <Button
                type="link"
                size="small"
                danger
                icon={<DeleteOutlined />}
                onClick={() => handleCancelTask(record.id)}
              />
            </Tooltip>
          )}
        </Space>
      ),
    },
  ];

  // 统计数据
  const totalRobots = robots.length;
  const onlineRobots = robots.filter(r => r.status === 'online').length;
  const totalTasks = tasks.length;
  const activeTasks = tasks.filter(t => t.status === 'in_progress').length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const totalDeliveries = robots.reduce((sum, r) => sum + r.totalDeliveries, 0);
  const totalDistance = Math.round(robots.reduce((sum, r) => sum + r.totalDistance, 0) * 10) / 10;

  return (
    <div style={{ padding: '0 16px' }}>
      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="机器人总数"
              value={totalRobots}
              prefix={<RobotOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
            <div style={{ marginTop: 8 }}>
              <Tag color="green">在线: {onlineRobots}</Tag>
              <Tag color="red">离线: {totalRobots - onlineRobots}</Tag>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="活跃任务"
              value={activeTasks}
              prefix={<LoadingOutlined />}
              valueStyle={{ color: '#fa8c16' }}
            />
            <div style={{ marginTop: 8 }}>
              <Text type="secondary">总任务: {totalTasks}</Text>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="总配送次数"
              value={totalDeliveries}
              prefix={<CoffeeOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
            <div style={{ marginTop: 8 }}>
              <Text type="secondary">今日: {Math.floor(totalDeliveries * 0.15)}</Text>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="总行驶里程"
              value={totalDistance}
              suffix="km"
              prefix={<CompassOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
            <div style={{ marginTop: 8 }}>
              <Text type="secondary">平均: {Math.round((totalDistance / totalRobots) * 10) / 10}km</Text>
            </div>
          </Card>
        </Col>
      </Row>

      {/* 功能工具栏 */}
      <Card style={{ marginBottom: 24 }}>
        <Row gutter={16} align="middle">
          <Col span={8}>
            <Space>
              <Input
                placeholder="搜索机器人或任务..."
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                style={{ width: 250 }}
              />
              <Select
                mode="multiple"
                placeholder="状态筛选"
                value={statusFilter}
                onChange={setStatusFilter}
                style={{ width: 150 }}
                allowClear
              >
                <Option value="online">在线</Option>
                <Option value="offline">离线</Option>
                <Option value="charging">充电中</Option>
                <Option value="maintenance">维护中</Option>
                <Option value="error">故障</Option>
              </Select>
              <Select
                mode="multiple"
                placeholder="任务类型"
                value={taskTypeFilter}
                onChange={setTaskTypeFilter}
                style={{ width: 150 }}
                allowClear
              >
                <Option value="delivery">配送</Option>
                <Option value="pickup">取餐</Option>
                <Option value="maintenance">维护</Option>
                <Option value="patrol">巡逻</Option>
              </Select>
            </Space>
          </Col>
          <Col span={8}>
            <Space>
              <Button 
                type="primary" 
                icon={<BarChartOutlined />}
                onClick={() => setShowAnalytics(true)}
              >
                数据分析
              </Button>
              <Badge count={alerts.filter(alert => !alert.read).length}>
                <Button 
                  icon={<BellOutlined />}
                  onClick={() => setShowNotifications(true)}
                >
                  告警通知
                </Button>
              </Badge>
              <Button 
                icon={<SettingOutlined />}
                onClick={() => setShowSettings(true)}
              >
                系统设置
              </Button>
            </Space>
          </Col>
          <Col span={8} style={{ textAlign: 'right' }}>
            <Space>
              <Button 
                icon={<DownloadOutlined />}
                onClick={handleExportData}
              >
                导出数据
              </Button>
              <Button 
                icon={<SyncOutlined />}
                onClick={handleRefreshStatus}
                loading={loading}
              >
                刷新
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* 快速性能概览 */}
      <Card title="性能概览" style={{ marginBottom: 24 }}>
        <Row gutter={16}>
          <Col span={16}>
            <Line
              data={performanceTrendData.filter(item => item.type === '配送次数')}
              xField="date"
              yField="value"
              smooth
              height={200}
            />
          </Col>
          <Col span={8}>
            <div style={{ padding: '20px 0' }}>
              <div style={{ marginBottom: 16 }}>
                <Text type="secondary">今日配送趋势</Text>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1890ff' }}>
                  {performanceTrendData[performanceTrendData.length - 1]?.value || 0} 次
                </div>
              </div>
              <div style={{ marginBottom: 16 }}>
                <Text type="secondary">平均效率</Text>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#52c41a' }}>
                  {Math.round(robotComparisonData.reduce((sum, robot) => sum + robot.efficiency, 0) / robotComparisonData.length * 100) / 100} 次/小时
                </div>
              </div>
              <div>
                <Text type="secondary">系统状态</Text>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#722ed1' }}>
                  {Math.round((onlineRobots / totalRobots) * 100)}% 在线
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Card>

      {/* 机器人状态表格 */}
      <Card 
        title={
          <Space>
            <RobotOutlined />
            <span>机器人状态监控</span>
          </Space>
        }
        extra={
          <Space>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleCreateTask}>
              添加任务
            </Button>
            {selectedRowKeys.length > 0 && (
              <>
                <Button 
                  icon={<PlayCircleOutlined />}
                  onClick={() => handleBatchOperation('start')}
                >
                  批量启动 ({selectedRowKeys.length})
                </Button>
                <Button 
                  icon={<PauseCircleOutlined />}
                  onClick={() => handleBatchOperation('stop')}
                >
                  批量停止 ({selectedRowKeys.length})
                </Button>
                <Button 
                  icon={<BarsOutlined />}
                  onClick={() => handleBatchOperation('charge')}
                >
                  批量充电 ({selectedRowKeys.length})
                </Button>
              </>
            )}
            <Button icon={<ReloadOutlined />} onClick={handleRefreshStatus} loading={loading}>
              刷新状态
            </Button>
          </Space>
        }
        style={{ marginBottom: 24 }}
      >
        <Table
          columns={robotColumns}
          dataSource={filteredRobots}
          rowKey="id"
          pagination={false}
          size="small"
          rowSelection={{
            selectedRowKeys,
            onChange: (selectedRowKeys) => setSelectedRowKeys(selectedRowKeys as string[]),
          }}
        />
      </Card>

      {/* 任务管理 */}
      <Card 
        title={
          <Space>
            <HistoryOutlined />
            <span>任务管理</span>
          </Space>
        }
        extra={
          <Space>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleCreateTask}>
              新建任务
            </Button>
          </Space>
        }
      >
        <Table
          columns={taskColumns}
          dataSource={filteredTasks}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          size="small"
        />
      </Card>

      {/* 任务创建模态框 */}
      <Modal
        title="创建新任务"
        open={taskModalVisible}
        onCancel={() => setTaskModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form
          form={taskForm}
          layout="vertical"
          onFinish={handleTaskSubmit}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="robotId"
                label="选择机器人"
                rules={[{ required: true, message: '请选择机器人' }]}
              >
                <Select placeholder="选择机器人">
                  {robots.map(robot => (
                    <Option key={robot.id} value={robot.id}>
                      {robot.name} ({robot.status === 'online' ? '在线' : '离线'})
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="taskType"
                label="任务类型"
                rules={[{ required: true, message: '请选择任务类型' }]}
              >
                <Select placeholder="选择任务类型">
                  <Option value="delivery">配送</Option>
                  <Option value="pickup">取餐</Option>
                  <Option value="maintenance">维护</Option>
                  <Option value="patrol">巡逻</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="priority"
                label="优先级"
                rules={[{ required: true, message: '请选择优先级' }]}
              >
                <Select placeholder="选择优先级">
                  <Option value="low">低</Option>
                  <Option value="medium">中</Option>
                  <Option value="high">高</Option>
                  <Option value="urgent">紧急</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="estimatedTime"
                label="预计时间(分钟)"
                rules={[{ required: true, message: '请输入预计时间' }]}
              >
                <InputNumber min={1} max={120} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="startLocation"
                label="起始位置"
                rules={[{ required: true, message: '请输入起始位置' }]}
              >
                <Input placeholder="如：厨房、大堂" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="destination"
                label="目标位置"
                rules={[{ required: true, message: '请输入目标位置' }]}
              >
                <Input placeholder="如：房间201、维修间" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="guestName"
                label="客人姓名"
              >
                <Input placeholder="客人姓名（可选）" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="roomNumber"
                label="房间号"
              >
                <Input placeholder="房间号（可选）" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="items"
            label="配送物品"
          >
            <TextArea 
              placeholder="请输入配送物品，多个物品用逗号分隔（可选）"
              rows={3}
            />
          </Form.Item>

          <Form.Item
            name="operator"
            label="操作员"
          >
            <Input placeholder="操作员姓名（可选）" />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                创建任务
              </Button>
              <Button onClick={() => setTaskModalVisible(false)}>
                取消
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* 机器人详情模态框 */}
      <Modal
        title="机器人详情"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        width={800}
      >
        {selectedRobot && (
          <div>
            <Row gutter={16}>
              <Col span={12}>
                <Card size="small" title="基本信息">
                  <Descriptions column={1} size="small">
                    <Descriptions.Item label="机器人名称">{selectedRobot.name}</Descriptions.Item>
                    <Descriptions.Item label="机器人ID">{selectedRobot.id}</Descriptions.Item>
                    <Descriptions.Item label="当前状态">
                      <Tag color={getStatusColor(selectedRobot.status)}>
                        {selectedRobot.status === 'online' ? '在线' :
                         selectedRobot.status === 'offline' ? '离线' :
                         selectedRobot.status === 'charging' ? '充电中' :
                         selectedRobot.status === 'maintenance' ? '维护中' : '故障'}
                      </Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="当前位置">{selectedRobot.currentLocation}</Descriptions.Item>
                    <Descriptions.Item label="当前任务">{selectedRobot.currentTask || '无'}</Descriptions.Item>
                  </Descriptions>
                </Card>
              </Col>
              <Col span={12}>
                <Card size="small" title="运行状态">
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <div>
                      <Text>电池电量</Text>
                      <Progress 
                        percent={selectedRobot.battery} 
                        strokeColor={selectedRobot.battery > 20 ? '#52c41a' : '#ff4d4f'}
                        size="small"
                      />
                    </div>
                    <div>
                      <Text>信号强度</Text>
                      <Progress 
                        percent={selectedRobot.signal} 
                        strokeColor="#1890ff"
                        size="small"
                      />
                    </div>
                    <div>
                      <Text>运行温度</Text>
                      <Text strong style={{ color: selectedRobot.temperature > 30 ? '#ff4d4f' : '#52c41a' }}>
                        {selectedRobot.temperature}°C
                      </Text>
                    </div>
                    <div>
                      <Text>当前速度</Text>
                      <Text strong>{selectedRobot.speed} km/h</Text>
                    </div>
                  </Space>
                </Card>
              </Col>
            </Row>
            
            <Card size="small" title="运行统计" style={{ marginTop: 16 }}>
              <Row gutter={16}>
                <Col span={8}>
                  <Statistic title="总配送次数" value={selectedRobot.totalDeliveries} />
                </Col>
                <Col span={8}>
                  <Statistic title="总行驶里程" value={selectedRobot.totalDistance} suffix="km" />
                </Col>
                <Col span={8}>
                  <Statistic title="运行时间" value={selectedRobot.uptime} suffix="小时" />
                </Col>
              </Row>
            </Card>

            {selectedRobot.errorCode && (
              <Alert
                message="故障信息"
                description={`错误代码: ${selectedRobot.errorCode} - ${selectedRobot.errorMessage}`}
                type="error"
                showIcon
                style={{ marginTop: 16 }}
              />
            )}
          </div>
        )}
      </Modal>

      {/* 机器人控制模态框 */}
      <Modal
        title={`机器人控制 - ${selectedRobot?.name}`}
        open={controlModalVisible}
        onCancel={() => setControlModalVisible(false)}
        footer={null}
        width={500}
      >
        {selectedRobot && (
          <div>
            <Card size="small" title="当前状态" style={{ marginBottom: 16 }}>
              <Descriptions column={1} size="small">
                <Descriptions.Item label="状态">
                  <Tag color={getStatusColor(selectedRobot.status)}>
                    {selectedRobot.status === 'online' ? '在线' :
                     selectedRobot.status === 'offline' ? '离线' :
                     selectedRobot.status === 'charging' ? '充电中' :
                     selectedRobot.status === 'maintenance' ? '维护中' : '故障'}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="电量">{selectedRobot.battery}%</Descriptions.Item>
                <Descriptions.Item label="位置">{selectedRobot.currentLocation}</Descriptions.Item>
                <Descriptions.Item label="当前任务">{selectedRobot.currentTask || '无'}</Descriptions.Item>
              </Descriptions>
            </Card>

            <Card size="small" title="控制操作">
              <Space direction="vertical" style={{ width: '100%' }}>
                {selectedRobot.status !== 'online' && (
                  <Button 
                    type="primary" 
                    icon={<PlayCircleOutlined />}
                    onClick={() => handleRobotAction('start')}
                    style={{ width: '100%' }}
                  >
                    启动机器人
                  </Button>
                )}
                
                {selectedRobot.status === 'online' && (
                  <Button 
                    danger 
                    icon={<PauseCircleOutlined />}
                    onClick={() => handleRobotAction('stop')}
                    style={{ width: '100%' }}
                  >
                    停止机器人
                  </Button>
                )}

                {selectedRobot.status !== 'charging' && (
                  <Button 
                    icon={<BarsOutlined />}
                    onClick={() => handleRobotAction('charge')}
                    style={{ width: '100%' }}
                  >
                    开始充电
                  </Button>
                )}

                {selectedRobot.status !== 'maintenance' && (
                  <Button 
                    icon={<SettingOutlined />}
                    onClick={() => handleRobotAction('maintenance')}
                    style={{ width: '100%' }}
                  >
                    进入维护模式
                  </Button>
                )}

                {selectedRobot.errorCode && (
                  <Alert
                    message="故障信息"
                    description={`${selectedRobot.errorCode}: ${selectedRobot.errorMessage}`}
                    type="error"
                    showIcon
                    style={{ marginTop: 16 }}
                  />
                )}
              </Space>
            </Card>
          </div>
        )}
      </Modal>

      {/* 数据分析模态框 */}
      <Modal
        title="数据分析"
        open={showAnalytics}
        onCancel={() => setShowAnalytics(false)}
        footer={null}
        width={1000}
      >
        {(() => {
          const analyticsData = getAnalyticsData();
          return (
            <div>
              <Row gutter={16} style={{ marginBottom: 24 }}>
                <Col span={6}>
                  <Card>
                    <Statistic
                      title="今日任务"
                      value={analyticsData.todayTasks}
                      prefix={<CalendarOutlined />}
                      valueStyle={{ color: '#1890ff' }}
                    />
                  </Card>
                </Col>
                <Col span={6}>
                  <Card>
                    <Statistic
                      title="未读告警"
                      value={analyticsData.totalAlerts}
                      prefix={<BellOutlined />}
                      valueStyle={{ color: '#ff4d4f' }}
                    />
                  </Card>
                </Col>
                <Col span={6}>
                  <Card>
                    <Statistic
                      title="平均效率"
                      value={Math.round(analyticsData.robotPerformance.reduce((sum, robot) => sum + robot.efficiency, 0) / analyticsData.robotPerformance.length * 100) / 100}
                      suffix="次/小时"
                      prefix={<TrophyOutlined />}
                      valueStyle={{ color: '#52c41a' }}
                    />
                  </Card>
                </Col>
                <Col span={6}>
                  <Card>
                    <Statistic
                      title="在线率"
                      value={Math.round((onlineRobots / totalRobots) * 100)}
                      suffix="%"
                      prefix={<RiseOutlined />}
                      valueStyle={{ color: '#722ed1' }}
                    />
                  </Card>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Card title="任务类型分布" size="small">
                    <Pie
                      data={taskTypeDistributionData}
                      angleField="value"
                      colorField="type"
                      radius={0.8}
                      height={200}
                    />
                  </Card>
                </Col>
                <Col span={12}>
                  <Card title="机器人性能对比" size="small">
                    <Column
                      data={robotComparisonData}
                      xField="robot"
                      yField="efficiency"
                      height={200}
                    />
                  </Card>
                </Col>
              </Row>

              <Row gutter={16} style={{ marginTop: 16 }}>
                <Col span={24}>
                  <Card title="性能趋势分析" size="small">
                    <Line
                      data={performanceTrendData}
                      xField="date"
                      yField="value"
                      seriesField="type"
                      smooth
                      height={300}
                    />
                  </Card>
                </Col>
              </Row>

              <Row gutter={16} style={{ marginTop: 16 }}>
                <Col span={12}>
                  <Card title="机器人性能排行" size="small">
                    <List
                      size="small"
                      dataSource={analyticsData.robotPerformance.sort((a, b) => b.efficiency - a.efficiency)}
                      renderItem={(robot, index) => (
                        <List.Item>
                          <Space>
                            <Badge count={index + 1} style={{ backgroundColor: index < 3 ? '#f5222d' : '#d9d9d9' }} />
                            <span>{robot.name}</span>
                            <span style={{ color: '#666' }}>
                              效率: {Math.round(robot.efficiency * 100) / 100} 次/小时
                            </span>
                          </Space>
                        </List.Item>
                      )}
                    />
                  </Card>
                </Col>
                <Col span={12}>
                  <Card title="关键指标" size="small">
                    <List
                      size="small"
                      dataSource={[
                        { label: '总配送次数', value: totalDeliveries, unit: '次' },
                        { label: '总行驶里程', value: totalDistance, unit: 'km' },
                        { label: '平均在线率', value: Math.round((onlineRobots / totalRobots) * 100), unit: '%' },
                        { label: '任务完成率', value: Math.round((completedTasks / totalTasks) * 100), unit: '%' },
                        { label: '平均响应时间', value: '3.2', unit: '分钟' },
                        { label: '系统可用性', value: '99.8', unit: '%' }
                      ]}
                      renderItem={(item) => (
                        <List.Item>
                          <Space>
                            <span>{item.label}:</span>
                            <Text strong style={{ color: '#1890ff' }}>
                              {item.value} {item.unit}
                            </Text>
                          </Space>
                        </List.Item>
                      )}
                    />
                  </Card>
                </Col>
              </Row>
            </div>
          );
        })()}
      </Modal>

      {/* 告警通知模态框 */}
      <Modal
        title="告警通知"
        open={showNotifications}
        onCancel={() => setShowNotifications(false)}
        footer={null}
        width={600}
      >
        <List
          dataSource={alerts}
          renderItem={(alert) => (
            <List.Item
              actions={[
                !alert.read && (
                  <Button 
                    type="link" 
                    size="small"
                    onClick={() => handleMarkAlertRead(alert.id)}
                  >
                    标记已读
                  </Button>
                )
              ]}
            >
              <List.Item.Meta
                avatar={
                  <Badge dot={!alert.read}>
                    <Avatar 
                      icon={
                        alert.type === 'error' ? <ExclamationCircleOutlined /> :
                        alert.type === 'warning' ? <WarningOutlined /> :
                        <InfoCircleOutlined />
                      }
                      style={{ 
                        backgroundColor: alert.type === 'error' ? '#ff4d4f' :
                                       alert.type === 'warning' ? '#fa8c16' : '#1890ff'
                      }}
                    />
                  </Badge>
                }
                title={
                  <Space>
                    <span>{alert.title}</span>
                    {!alert.read && <Tag color="red">新</Tag>}
                  </Space>
                }
                description={
                  <div>
                    <div>{alert.message}</div>
                    <div style={{ fontSize: '12px', color: '#666', marginTop: 4 }}>
                      {alert.timestamp}
                    </div>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      </Modal>

      {/* 系统设置模态框 */}
      <Modal
        title="系统设置"
        open={showSettings}
        onCancel={() => setShowSettings(false)}
        footer={null}
        width={600}
      >
        <Tabs
          items={[
            {
              key: 'general',
              label: '常规设置',
              children: (
                <div>
                  <Form layout="vertical">
                    <Form.Item label="自动刷新间隔">
                      <Select defaultValue="30" style={{ width: 200 }}>
                        <Option value="10">10秒</Option>
                        <Option value="30">30秒</Option>
                        <Option value="60">1分钟</Option>
                        <Option value="300">5分钟</Option>
                      </Select>
                    </Form.Item>
                    <Form.Item label="告警通知">
                      <Switch defaultChecked />
                    </Form.Item>
                    <Form.Item label="声音提醒">
                      <Switch defaultChecked />
                    </Form.Item>
                    <Form.Item label="邮件通知">
                      <Switch />
                    </Form.Item>
                  </Form>
                </div>
              )
            },
            {
              key: 'robot',
              label: '机器人设置',
              children: (
                <div>
                  <Form layout="vertical">
                    <Form.Item label="低电量阈值">
                      <InputNumber min={10} max={50} defaultValue={20} suffix="%" />
                    </Form.Item>
                    <Form.Item label="自动充电">
                      <Switch defaultChecked />
                    </Form.Item>
                    <Form.Item label="维护提醒">
                      <Switch defaultChecked />
                    </Form.Item>
                    <Form.Item label="最大速度">
                      <InputNumber min={1} max={10} defaultValue={3} suffix="km/h" />
                    </Form.Item>
                  </Form>
                </div>
              )
            },
            {
              key: 'task',
              label: '任务设置',
              children: (
                <div>
                  <Form layout="vertical">
                    <Form.Item label="任务超时时间">
                      <InputNumber min={5} max={60} defaultValue={15} suffix="分钟" />
                    </Form.Item>
                    <Form.Item label="自动重试">
                      <Switch defaultChecked />
                    </Form.Item>
                    <Form.Item label="重试次数">
                      <InputNumber min={1} max={5} defaultValue={3} />
                    </Form.Item>
                    <Form.Item label="优先级策略">
                      <Select defaultValue="fifo">
                        <Option value="fifo">先进先出</Option>
                        <Option value="priority">优先级优先</Option>
                        <Option value="distance">距离优先</Option>
                      </Select>
                    </Form.Item>
                  </Form>
                </div>
              )
            }
          ]}
        />
      </Modal>

      {/* 任务详情模态框 */}
      <Modal
        title="任务详情"
        open={taskDetailModalVisible}
        onCancel={() => setTaskDetailModalVisible(false)}
        footer={null}
        width={600}
      >
        {selectedTask && (
          <div>
            <Card size="small" title="基本信息">
              <Descriptions column={2} size="small">
                <Descriptions.Item label="任务ID">{selectedTask.id}</Descriptions.Item>
                <Descriptions.Item label="机器人">{selectedTask.robotName}</Descriptions.Item>
                <Descriptions.Item label="任务类型">
                  <Tag color={selectedTask.taskType === 'delivery' ? 'green' : 
                              selectedTask.taskType === 'pickup' ? 'blue' : 
                              selectedTask.taskType === 'maintenance' ? 'orange' : 'purple'}>
                    {selectedTask.taskType === 'delivery' ? '配送' :
                     selectedTask.taskType === 'pickup' ? '取餐' :
                     selectedTask.taskType === 'maintenance' ? '维护' : '巡逻'}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="状态">
                  <Tag color={selectedTask.status === 'pending' ? 'default' :
                              selectedTask.status === 'in_progress' ? 'processing' :
                              selectedTask.status === 'completed' ? 'success' :
                              selectedTask.status === 'failed' ? 'error' : 'default'}>
                    {selectedTask.status === 'pending' ? '待执行' :
                     selectedTask.status === 'in_progress' ? '执行中' :
                     selectedTask.status === 'completed' ? '已完成' :
                     selectedTask.status === 'failed' ? '失败' : '已取消'}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="优先级">
                  <Tag color={selectedTask.priority === 'urgent' ? 'red' :
                              selectedTask.priority === 'high' ? 'orange' :
                              selectedTask.priority === 'medium' ? 'blue' : 'green'}>
                    {selectedTask.priority === 'urgent' ? '紧急' :
                     selectedTask.priority === 'high' ? '高' :
                     selectedTask.priority === 'medium' ? '中' : '低'}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="预计时间">{selectedTask.estimatedTime}分钟</Descriptions.Item>
              </Descriptions>
            </Card>

            <Card size="small" title="路径信息" style={{ marginTop: 16 }}>
              <Descriptions column={1} size="small">
                <Descriptions.Item label="起始位置">{selectedTask.startLocation}</Descriptions.Item>
                <Descriptions.Item label="目标位置">{selectedTask.destination}</Descriptions.Item>
                {selectedTask.guestName && (
                  <Descriptions.Item label="客人姓名">{selectedTask.guestName}</Descriptions.Item>
                )}
                {selectedTask.roomNumber && (
                  <Descriptions.Item label="房间号">{selectedTask.roomNumber}</Descriptions.Item>
                )}
              </Descriptions>
            </Card>

            {selectedTask.items.length > 0 && (
              <Card size="small" title="配送物品" style={{ marginTop: 16 }}>
                <List
                  size="small"
                  dataSource={selectedTask.items}
                  renderItem={(item, index) => (
                    <List.Item>
                      <Space>
                        <span>{index + 1}.</span>
                        <span>{item}</span>
                      </Space>
                    </List.Item>
                  )}
                />
              </Card>
            )}

            <Card size="small" title="时间信息" style={{ marginTop: 16 }}>
              <Descriptions column={1} size="small">
                <Descriptions.Item label="创建时间">{selectedTask.createdAt}</Descriptions.Item>
                {selectedTask.startedAt && (
                  <Descriptions.Item label="开始时间">{selectedTask.startedAt}</Descriptions.Item>
                )}
                {selectedTask.completedAt && (
                  <Descriptions.Item label="完成时间">{selectedTask.completedAt}</Descriptions.Item>
                )}
                {selectedTask.actualTime && (
                  <Descriptions.Item label="实际用时">{selectedTask.actualTime}分钟</Descriptions.Item>
                )}
                <Descriptions.Item label="操作员">{selectedTask.operator}</Descriptions.Item>
              </Descriptions>
            </Card>

            {selectedTask.notes && (
              <Card size="small" title="备注" style={{ marginTop: 16 }}>
                <Text>{selectedTask.notes}</Text>
              </Card>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default DeliveryRobot; 