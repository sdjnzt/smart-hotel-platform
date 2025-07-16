import React, { useState, useEffect } from 'react';
import { 
  Row, 
  Col, 
  Card, 
  Select, 
  DatePicker, 
  Button, 
  Statistic, 
  Tag, 
  Progress, 
  Table,
  Input,
  Space,
  Tabs,
  Timeline,
  Alert,
  Badge,
  Tooltip,
  Switch,
  Radio,
  Divider,
  message,
  Modal,
  Form,
  InputNumber,
  Dropdown,
  Menu
} from 'antd';
import { 
  BarChartOutlined, 
  LineChartOutlined,
  RiseOutlined,
  FallOutlined,
  SyncOutlined,
  ExportOutlined,
  FilterOutlined,
  SearchOutlined,
  ReloadOutlined,
  SettingOutlined,
  EyeOutlined,
  FireOutlined,
  ThunderboltOutlined,
  CloudOutlined,
  EnvironmentOutlined,
  BellOutlined,
  DownloadOutlined,
  FileTextOutlined,
  CalendarOutlined,
  DashboardOutlined,
  PieChartOutlined,
  AreaChartOutlined,
  AlertOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  WarningOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';
import { chartData, dataRecords, devices } from '../data/mockData';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { Search } = Input;
const { TabPane } = Tabs;

interface DataPoint {
  time: string;
  temperature: number;
  humidity: number;
  voltage: number;
  deviceId: string;
  status: string;
}

interface AnalysisMetrics {
  totalRecords: number;
  avgTemperature: number;
  avgHumidity: number;
  avgVoltage: number;
  dataGrowth: number;
  anomalyCount: number;
  qualityScore: number;
  realtimeConnections: number;
}

const DataAnalysis: React.FC = () => {
  const [selectedMetric, setSelectedMetric] = useState('temperature');
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState<any>(null);
  const [searchText, setSearchText] = useState('');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(5);
  const [filterType, setFilterType] = useState('all');
  const [isExportModalVisible, setIsExportModalVisible] = useState(false);
  
  const [metrics, setMetrics] = useState<AnalysisMetrics>({
    totalRecords: 0,
    avgTemperature: 0,
    avgHumidity: 0,
    avgVoltage: 0,
    dataGrowth: 0,
    anomalyCount: 0,
    qualityScore: 0,
    realtimeConnections: 0
  });

  const [realtimeData, setRealtimeData] = useState<DataPoint[]>([]);
  const [trendData, setTrendData] = useState<any[]>([]);

  // 模拟实时数据更新
  useEffect(() => {
    const updateMetrics = () => {
      const newMetrics = {
        totalRecords: dataRecords.length + Math.floor(Math.random() * 10),
        avgTemperature: 25.6 + Math.random() * 2 - 1,
        avgHumidity: 65.2 + Math.random() * 5 - 2.5,
        avgVoltage: 220.5 + Math.random() * 4 - 2,
        dataGrowth: 12.8 + Math.random() * 2 - 1,
        anomalyCount: Math.floor(Math.random() * 5),
        qualityScore: 96 + Math.random() * 3,
        realtimeConnections: devices.filter(d => d.status === 'online').length
      };
      setMetrics(newMetrics);

      // 生成趋势数据
      const hours = Array.from({ length: 24 }, (_, i) => i);
      const newTrendData = hours.map(hour => ({
        hour: `${hour.toString().padStart(2, '0')}:00`,
        temperature: 25 + Math.sin(hour * Math.PI / 12) * 3 + Math.random() * 2,
        humidity: 60 + Math.cos(hour * Math.PI / 12) * 10 + Math.random() * 5,
        voltage: 220 + Math.random() * 5 - 2.5,
        power: 1000 + Math.random() * 200 - 100
      }));
      setTrendData(newTrendData);

      // 生成实时数据流
      const newRealtimeData = Array.from({ length: 20 }, (_, i) => ({
        time: new Date(Date.now() - i * 30000).toLocaleTimeString(),
        temperature: 25 + Math.random() * 5,
        humidity: 65 + Math.random() * 10,
        voltage: 220 + Math.random() * 10,
        deviceId: `device-${Math.floor(Math.random() * 5) + 1}`,
        status: Math.random() > 0.1 ? 'normal' : 'anomaly'
      }));
      setRealtimeData(newRealtimeData);
    };

    updateMetrics();
    
    if (autoRefresh) {
      const interval = setInterval(updateMetrics, refreshInterval * 1000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshInterval]);

  // 自定义图表组件 - 使用Progress条形图
  const BarChart = ({ data, title, color = '#1890ff' }: any) => (
    <div style={{ padding: '16px 0' }}>
      <div style={{ marginBottom: 16, fontSize: 14, fontWeight: 'bold' }}>{title}</div>
      {data.map((item: any, index: number) => (
        <div key={index} style={{ marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontSize: 12 }}>{item.name}</span>
            <span style={{ fontSize: 12, fontWeight: 'bold' }}>{item.value}</span>
          </div>
          <Progress 
            percent={Math.min((item.value / Math.max(...data.map((d: any) => d.value))) * 100, 100)} 
            size="small"
            strokeColor={color}
            showInfo={false}
          />
        </div>
      ))}
    </div>
  );

  // 自定义趋势图组件
  const TrendChart = ({ data, field, color = '#1890ff' }: any) => (
    <div style={{ padding: '16px 0' }}>
      <div style={{ height: 200, position: 'relative', background: '#fafafa', borderRadius: 8 }}>
        <svg width="100%" height="100%" style={{ position: 'absolute' }}>
          {data.map((item: any, index: number) => {
            if (index === 0) return null;
            const prevItem = data[index - 1];
            const x1 = ((index - 1) / (data.length - 1)) * 100;
            const x2 = (index / (data.length - 1)) * 100;
            const y1 = 100 - ((prevItem[field] - Math.min(...data.map((d: any) => d[field]))) / 
                             (Math.max(...data.map((d: any) => d[field])) - Math.min(...data.map((d: any) => d[field])))) * 80;
            const y2 = 100 - ((item[field] - Math.min(...data.map((d: any) => d[field]))) / 
                             (Math.max(...data.map((d: any) => d[field])) - Math.min(...data.map((d: any) => d[field])))) * 80;
            
            return (
              <line
                key={index}
                x1={`${x1}%`}
                y1={`${y1}%`}
                x2={`${x2}%`}
                y2={`${y2}%`}
                stroke={color}
                strokeWidth="2"
              />
            );
          })}
          {data.map((item: any, index: number) => {
            const x = (index / (data.length - 1)) * 100;
            const y = 100 - ((item[field] - Math.min(...data.map((d: any) => d[field]))) / 
                           (Math.max(...data.map((d: any) => d[field])) - Math.min(...data.map((d: any) => d[field])))) * 80;
            
            return (
              <circle
                key={index}
                cx={`${x}%`}
                cy={`${y}%`}
                r="3"
                fill={color}
              />
            );
          })}
        </svg>
      </div>
    </div>
  );

  // 数据导出功能
  const handleExport = (format: string) => {
    message.success(`正在导出${format}格式数据...`);
    setIsExportModalVisible(false);
  };

  // 数据质量分析
  const qualityMetrics = [
    { name: '数据完整性', value: 98.5, status: 'good' },
    { name: '数据准确性', value: 96.2, status: 'good' },
    { name: '数据及时性', value: 99.1, status: 'excellent' },
    { name: '数据一致性', value: 94.8, status: 'good' },
    { name: '异常检测', value: 1.3, status: 'warning' }
  ];

  // 异常检测数据
  const anomalyData = [
    { time: '14:30:15', type: 'temperature', value: 45.2, threshold: 40, severity: 'high' },
    { time: '14:25:10', type: 'humidity', value: 95.8, threshold: 90, severity: 'medium' },
    { time: '14:20:05', type: 'voltage', value: 195.3, threshold: 200, severity: 'low' }
  ];

  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ margin: 0 }}>数据分析中心</h2>
        <Space>
          <span>自动刷新:</span>
          <Switch checked={autoRefresh} onChange={setAutoRefresh} />
          <Select 
            value={refreshInterval} 
            onChange={setRefreshInterval}
            style={{ width: 80 }}
            size="small"
          >
            <Option value={5}>5s</Option>
            <Option value={10}>10s</Option>
            <Option value={30}>30s</Option>
          </Select>
          <Button 
            type="primary" 
            icon={<ReloadOutlined />}
            onClick={() => message.success('数据已刷新')}
          >
            刷新
          </Button>
        </Space>
      </div>

      {/* 核心指标概览 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="数据总量"
              value={metrics.totalRecords}
              suffix="条"
              valueStyle={{ color: '#3f8600' }}
              prefix={<BarChartOutlined />}
            />
            <div style={{ marginTop: 8 }}>
                             <Tag color="green">
                 <RiseOutlined /> +{metrics.dataGrowth.toFixed(1)}%
               </Tag>
              <span style={{ fontSize: 12, color: '#666' }}>较昨日</span>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="平均温度"
              value={metrics.avgTemperature}
              suffix="°C"
              precision={1}
              valueStyle={{ color: '#cf1322' }}
              prefix={<ThunderboltOutlined />}
            />
            <div style={{ marginTop: 8 }}>
              <Progress 
                percent={Math.min((metrics.avgTemperature / 50) * 100, 100)} 
                size="small"
                strokeColor="#cf1322"
                showInfo={false}
              />
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="平均湿度"
              value={metrics.avgHumidity}
              suffix="%"
              precision={1}
              valueStyle={{ color: '#1890ff' }}
              prefix={<CloudOutlined />}
            />
            <div style={{ marginTop: 8 }}>
              <Progress 
                percent={metrics.avgHumidity} 
                size="small"
                strokeColor="#1890ff"
                showInfo={false}
              />
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="数据质量"
              value={metrics.qualityScore}
              suffix="%"
              precision={1}
              valueStyle={{ color: '#722ed1' }}
              prefix={<CheckCircleOutlined />}
            />
            <div style={{ marginTop: 8 }}>
              <Badge 
                status={metrics.qualityScore > 95 ? 'success' : 'warning'} 
                text={metrics.qualityScore > 95 ? '优秀' : '良好'}
              />
            </div>
          </Card>
        </Col>
      </Row>

      {/* 异常告警 */}
      {metrics.anomalyCount > 0 && (
        <Alert
          message={`检测到 ${metrics.anomalyCount} 个数据异常`}
          description="建议立即检查相关设备状态和数据采集系统"
          type="warning"
          showIcon
          closable
          style={{ marginBottom: 24 }}
          action={
            <Button size="small" type="primary" onClick={() => setActiveTab('anomaly')}>
              查看详情
            </Button>
          }
        />
      )}

      {/* 主要分析面板 */}
      <Card>
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab={<span><DashboardOutlined />数据概览</span>} key="overview">
      <Row gutter={16}>
              <Col span={16}>
                <Card title="实时数据趋势" size="small">
                  <div style={{ marginBottom: 16 }}>
                    <Space>
                      <Radio.Group 
                        value={selectedMetric} 
                        onChange={(e) => setSelectedMetric(e.target.value)}
                        size="small"
                      >
                        <Radio.Button value="temperature">温度</Radio.Button>
                        <Radio.Button value="humidity">湿度</Radio.Button>
                        <Radio.Button value="voltage">电压</Radio.Button>
                        <Radio.Button value="power">功率</Radio.Button>
                      </Radio.Group>
                      <RangePicker 
                        size="small"
                        onChange={setDateRange}
                      />
                    </Space>
              </div>
                  <TrendChart 
                    data={trendData} 
                    field={selectedMetric}
                    color={
                      selectedMetric === 'temperature' ? '#ff4d4f' :
                      selectedMetric === 'humidity' ? '#1890ff' :
                      selectedMetric === 'voltage' ? '#52c41a' : '#faad14'
                    }
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card title="数据分布" size="small">
                  <BarChart 
                    data={[
                      { name: '温度数据', value: Math.floor(metrics.totalRecords * 0.35) },
                      { name: '湿度数据', value: Math.floor(metrics.totalRecords * 0.30) },
                      { name: '电压数据', value: Math.floor(metrics.totalRecords * 0.25) },
                      { name: '其他数据', value: Math.floor(metrics.totalRecords * 0.10) }
                    ]}
                    title="数据类型分布"
                    color="#1890ff"
                  />
          </Card>
        </Col>
            </Row>

            <Row gutter={16} style={{ marginTop: 16 }}>
              <Col span={12}>
                <Card title="设备状态分析" size="small">
                  <div style={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center' }}>
                    <div>
                      <div style={{ fontSize: 24, fontWeight: 'bold', color: '#52c41a' }}>
                        {devices.filter(d => d.status === 'online').length}
                      </div>
                      <div style={{ fontSize: 12, color: '#666' }}>在线设备</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 24, fontWeight: 'bold', color: '#faad14' }}>
                        {devices.filter(d => d.status === 'warning').length}
                      </div>
                      <div style={{ fontSize: 12, color: '#666' }}>告警设备</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 24, fontWeight: 'bold', color: '#ff4d4f' }}>
                        {devices.filter(d => d.status === 'offline').length}
                      </div>
                      <div style={{ fontSize: 12, color: '#666' }}>离线设备</div>
                    </div>
                  </div>
                </Card>
              </Col>
              <Col span={12}>
                <Card title="数据采集统计" size="small">
                  <div style={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center' }}>
                    <div>
                      <div style={{ fontSize: 24, fontWeight: 'bold', color: '#1890ff' }}>
                        {Math.floor(metrics.totalRecords / 24)}
                      </div>
                      <div style={{ fontSize: 12, color: '#666' }}>每小时平均</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 24, fontWeight: 'bold', color: '#722ed1' }}>
                        {Math.floor(metrics.totalRecords / 24 / 60)}
                      </div>
                      <div style={{ fontSize: 12, color: '#666' }}>每分钟平均</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 24, fontWeight: 'bold', color: '#eb2f96' }}>
                        {metrics.realtimeConnections}
                      </div>
                      <div style={{ fontSize: 12, color: '#666' }}>实时连接</div>
              </div>
            </div>
                </Card>
              </Col>
            </Row>
          </TabPane>
            
          <TabPane tab={<span><AreaChartOutlined />实时监控</span>} key="realtime">
            <Row gutter={16}>
              <Col span={16}>
                <Card title="实时数据流" size="small">
            <div style={{ marginBottom: 16 }}>
                    <Space>
                      <Search
                        placeholder="搜索设备或数据类型"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        style={{ width: 200 }}
                        size="small"
                      />
                      <Select
                        value={filterType}
                        onChange={setFilterType}
                        style={{ width: 120 }}
                        size="small"
                      >
                        <Option value="all">全部</Option>
                        <Option value="normal">正常</Option>
                        <Option value="anomaly">异常</Option>
                      </Select>
                    </Space>
                  </div>
                  <div style={{ height: 400, overflowY: 'auto' }}>
                    <Timeline>
                      {realtimeData
                        .filter(item => filterType === 'all' || item.status === filterType)
                        .filter(item => 
                          searchText === '' || 
                          item.deviceId.includes(searchText) ||
                          item.time.includes(searchText)
                        )
                        .map((item, index) => (
                          <Timeline.Item
                            key={index}
                            color={item.status === 'normal' ? 'green' : 'red'}
                            dot={item.status === 'anomaly' ? <WarningOutlined /> : undefined}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <div>
                                <span style={{ fontWeight: 'bold' }}>{item.time}</span>
                                <span style={{ marginLeft: 8, color: '#666' }}>{item.deviceId}</span>
                              </div>
                              <div>
                                <Tag>T: {item.temperature.toFixed(1)}°C</Tag>
                                <Tag color="blue">H: {item.humidity.toFixed(1)}%</Tag>
                                <Tag color="green">V: {item.voltage.toFixed(1)}V</Tag>
              </div>
            </div>
                          </Timeline.Item>
                        ))}
                    </Timeline>
                  </div>
                </Card>
              </Col>
              <Col span={8}>
                <Card title="系统监控" size="small">
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span>CPU使用率</span>
                      <span>65%</span>
                    </div>
                    <Progress percent={65} size="small" status="active" />
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span>内存使用率</span>
                      <span>72%</span>
                    </div>
                    <Progress percent={72} size="small" />
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span>磁盘使用率</span>
                      <span>45%</span>
                    </div>
                    <Progress percent={45} size="small" />
                  </div>
            <div style={{ marginBottom: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span>网络延迟</span>
                      <span>12ms</span>
              </div>
                    <Progress percent={12} size="small" strokeColor="#52c41a" />
            </div>
                  
                  <Divider />

            <div style={{ marginBottom: 16 }}>
                    <div style={{ fontWeight: 'bold', marginBottom: 8 }}>连接状态</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span>活跃连接</span>
                      <Badge status="success" text={metrics.realtimeConnections.toString()} />
              </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span>数据流量</span>
                      <span>1.2 MB/s</span>
            </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span>处理队列</span>
                      <span>28 条</span>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
          </TabPane>

          <TabPane tab={<span><PieChartOutlined />数据质量</span>} key="quality">
            <Row gutter={16}>
        <Col span={12}>
                <Card title="质量指标" size="small">
                  {qualityMetrics.map((metric, index) => (
                    <div key={index} style={{ marginBottom: 16 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                        <span>{metric.name}</span>
                        <span style={{ fontWeight: 'bold' }}>
                          {metric.value.toFixed(1)}%
                        </span>
                      </div>
                      <Progress 
                        percent={metric.value} 
                        size="small"
                        strokeColor={
                          metric.status === 'excellent' ? '#52c41a' :
                          metric.status === 'good' ? '#1890ff' :
                          metric.status === 'warning' ? '#faad14' : '#ff4d4f'
                        }
                        showInfo={false}
            />
                    </div>
                  ))}
          </Card>
        </Col>
        <Col span={12}>
                <Card title="质量评估" size="small">
                  <div style={{ textAlign: 'center', marginBottom: 24 }}>
                    <div style={{ fontSize: 48, fontWeight: 'bold', color: '#52c41a' }}>
                      {metrics.qualityScore.toFixed(1)}
                    </div>
                    <div style={{ fontSize: 16, color: '#666' }}>综合质量评分</div>
                    <div style={{ marginTop: 8 }}>
                      <Tag color="green" style={{ fontSize: 14 }}>优秀</Tag>
                    </div>
                  </div>
                  
                  <div style={{ background: '#fafafa', padding: 16, borderRadius: 8 }}>
                    <div style={{ marginBottom: 8, fontSize: 14, fontWeight: 'bold' }}>
                      质量建议
                    </div>
                    <ul style={{ margin: 0, paddingLeft: 16, fontSize: 12 }}>
                      <li>数据采集频率可适当提高</li>
                      <li>建议增加数据校验机制</li>
                      <li>定期清理异常数据</li>
                      <li>优化存储和查询性能</li>
                    </ul>
                  </div>
                </Card>
              </Col>
            </Row>
          </TabPane>

          <TabPane tab={<span><AlertOutlined />异常检测</span>} key="anomaly">
            <Row gutter={16}>
              <Col span={24}>
                <Card title="异常事件" size="small">
                  <Table
                    dataSource={anomalyData}
                    columns={[
                      {
                        title: '时间',
                        dataIndex: 'time',
                        key: 'time',
                        width: 120
                      },
                      {
                        title: '数据类型',
                        dataIndex: 'type',
                        key: 'type',
                        width: 120,
                        render: (type) => {
                          const config = {
                            temperature: { color: 'red', text: '温度' },
                            humidity: { color: 'blue', text: '湿度' },
                            voltage: { color: 'green', text: '电压' }
                          };
                          return <Tag color={config[type as keyof typeof config].color}>
                            {config[type as keyof typeof config].text}
                          </Tag>;
                        }
                      },
                      {
                        title: '异常值',
                        dataIndex: 'value',
                        key: 'value',
                        width: 100,
                        render: (value) => (
                          <span style={{ fontWeight: 'bold', color: '#ff4d4f' }}>
                            {value}
                          </span>
                        )
                      },
                      {
                        title: '阈值',
                        dataIndex: 'threshold',
                        key: 'threshold',
                        width: 100
                      },
                      {
                        title: '严重程度',
                        dataIndex: 'severity',
                        key: 'severity',
                        width: 120,
                        render: (severity) => {
                          const config = {
                            high: { color: 'red', text: '高' },
                            medium: { color: 'orange', text: '中' },
                            low: { color: 'yellow', text: '低' }
                          };
                          return <Tag color={config[severity as keyof typeof config].color}>
                            {config[severity as keyof typeof config].text}
                          </Tag>;
                        }
                      },
                      {
                        title: '操作',
                        key: 'action',
                        render: () => (
                          <Space>
                            <Button size="small" type="primary">处理</Button>
                            <Button size="small">忽略</Button>
                          </Space>
                        )
                      }
                    ]}
                    pagination={false}
                    size="small"
            />
          </Card>
        </Col>
      </Row>
          </TabPane>

          <TabPane tab={<span><FileTextOutlined />数据导出</span>} key="export">
            <Row gutter={16}>
              <Col span={24}>
                <Card title="导出设置" size="small">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Space size="large">
                      <div>
                        <span style={{ marginRight: 8 }}>数据类型:</span>
                        <Select defaultValue="all" style={{ width: 120 }}>
                          <Option value="all">全部数据</Option>
                          <Option value="temperature">温度数据</Option>
                          <Option value="humidity">湿度数据</Option>
                          <Option value="voltage">电压数据</Option>
                        </Select>
                      </div>
                      <div>
                        <span style={{ marginRight: 8 }}>时间范围:</span>
                        <RangePicker />
                      </div>
                      <div>
                        <span style={{ marginRight: 8 }}>导出格式:</span>
                        <Select defaultValue="excel" style={{ width: 120 }}>
                          <Option value="excel">Excel</Option>
                          <Option value="csv">CSV</Option>
                          <Option value="json">JSON</Option>
                          <Option value="pdf">PDF报告</Option>
                        </Select>
                      </div>
                    </Space>
                    <Button 
                      type="primary" 
                      icon={<ExportOutlined />}
                      onClick={() => setIsExportModalVisible(true)}
                    >
                      导出数据
                    </Button>
                  </div>
                </Card>
              </Col>
            </Row>
          </TabPane>
        </Tabs>
      </Card>

      {/* 导出确认模态框 */}
      <Modal
        title="数据导出"
        visible={isExportModalVisible}
        onCancel={() => setIsExportModalVisible(false)}
        footer={null}
      >
        <div style={{ textAlign: 'center' }}>
          <div style={{ marginBottom: 24 }}>
            <FileTextOutlined style={{ fontSize: 48, color: '#1890ff' }} />
          </div>
          <div style={{ marginBottom: 16 }}>
            <p>确认导出数据？</p>
            <p style={{ color: '#666', fontSize: 12 }}>
              预计导出 {metrics.totalRecords} 条记录
            </p>
          </div>
          <Space>
            <Button onClick={() => setIsExportModalVisible(false)}>
              取消
            </Button>
            <Button 
              type="primary" 
              onClick={() => handleExport('excel')}
            >
              确认导出
            </Button>
          </Space>
        </div>
      </Modal>
    </div>
  );
};

export default DataAnalysis; 