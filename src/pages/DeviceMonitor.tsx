import React, { useState, useEffect } from 'react';
import { Card, Table, Tag, Row, Col, Statistic, Progress, Select, Input, Badge, Space, Button, Modal, Descriptions } from 'antd';
import { MonitorOutlined, BulbOutlined, SnippetsOutlined, SafetyCertificateOutlined, VideoCameraOutlined, WarningOutlined, SearchOutlined, EyeOutlined, RobotOutlined, IdcardOutlined, VerticalAlignTopOutlined, FireOutlined, CameraOutlined } from '@ant-design/icons';
import { hotelDevices, hotelRooms, HotelDevice, HotelRoom } from '../data/mockData';

const { Option } = Select;
const { Search } = Input;

const DeviceMonitor: React.FC = () => {
  const [devices, setDevices] = useState<HotelDevice[]>(hotelDevices);
  const [rooms, setRooms] = useState<HotelRoom[]>(hotelRooms);
  const [filteredDevices, setFilteredDevices] = useState<HotelDevice[]>(hotelDevices);
  const [selectedFloor, setSelectedFloor] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [searchText, setSearchText] = useState<string>('');
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<HotelDevice | null>(null);

  // 实时更新设备状态
  useEffect(() => {
    const interval = setInterval(() => {
      const updatedDevices = devices.map(device => ({
        ...device,
        lastUpdate: new Date().toLocaleString(),
        // 模拟随机状态变化
        signal: Math.max(80, Math.min(100, device.signal! + (Math.random() - 0.5) * 4)),
        temperature: device.temperature ? Math.max(18, Math.min(30, device.temperature + (Math.random() - 0.5) * 2)) : undefined,
        humidity: device.humidity ? Math.max(30, Math.min(70, device.humidity + (Math.random() - 0.5) * 4)) : undefined,
        brightness: device.brightness ? Math.max(0, Math.min(100, device.brightness + (Math.random() - 0.5) * 10)) : undefined,
        power: device.power ? Math.max(0, device.power + (Math.random() - 0.5) * 20) : undefined,
      }));
      setDevices(updatedDevices);
    }, 5000);

    return () => clearInterval(interval);
  }, [devices]);

  // 过滤设备
  useEffect(() => {
    let filtered = devices;

    if (selectedFloor !== null) {
      filtered = filtered.filter(device => device.floor === selectedFloor);
    }

    if (selectedCategory) {
      filtered = filtered.filter(device => device.category === selectedCategory);
    }

    if (selectedStatus) {
      filtered = filtered.filter(device => device.status === selectedStatus);
    }

    if (searchText) {
      filtered = filtered.filter(device => 
        device.name.toLowerCase().includes(searchText.toLowerCase()) ||
        (device.roomNumber && device.roomNumber.includes(searchText))
      );
    }

    setFilteredDevices(filtered);
  }, [devices, selectedFloor, selectedCategory, selectedStatus, searchText]);

  // 统计数据
  const totalDevices = devices.length;
  const onlineDevices = devices.filter(d => d.status === 'online').length;
  const warningDevices = devices.filter(d => d.status === 'warning').length;
  const errorDevices = devices.filter(d => d.status === 'error').length;
  const offlineDevices = devices.filter(d => d.status === 'offline').length;
  const totalEnergyConsumption = devices.reduce((sum, device) => sum + (device.energyConsumption || 0), 0);
  const averageUptime = (onlineDevices / totalDevices) * 100;

  // 获取状态标签
  const getStatusTag = (status: string) => {
    const statusConfig = {
      online: { color: 'green', text: '在线' },
      offline: { color: 'red', text: '离线' },
      warning: { color: 'orange', text: '警告' },
      error: { color: 'red', text: '故障' }
    };
    return <Tag color={statusConfig[status as keyof typeof statusConfig].color}>
      {statusConfig[status as keyof typeof statusConfig].text}
    </Tag>;
  };

  // 获取设备类型图标
  const getDeviceIcon = (type: string) => {
    const iconMap = {
      air_conditioner: <SnippetsOutlined style={{ color: '#1890ff' }} />,
      lighting: <BulbOutlined style={{ color: '#fadb14' }} />,
      curtain: <SnippetsOutlined style={{ color: '#722ed1' }} />,
      tv: <VideoCameraOutlined style={{ color: '#eb2f96' }} />,
      sensor: <MonitorOutlined style={{ color: '#52c41a' }} />,
      door_lock: <SafetyCertificateOutlined style={{ color: '#fa8c16' }} />,
      mini_bar: <SnippetsOutlined style={{ color: '#13c2c2' }} />,
      safe_box: <SafetyCertificateOutlined style={{ color: '#f5222d' }} />,
      delivery_robot: <RobotOutlined style={{ color: '#52c41a' }} />,
      access_control: <IdcardOutlined style={{ color: '#1890ff' }} />,
      elevator: <VerticalAlignTopOutlined style={{ color: '#722ed1' }} />,
      fire_alarm: <FireOutlined style={{ color: '#f5222d' }} />,
      cctv_camera: <CameraOutlined style={{ color: '#13c2c2' }} />
    };
    return iconMap[type as keyof typeof iconMap] || <MonitorOutlined />;
  };

  // 表格列配置
  const columns = [
    {
      title: '设备',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      render: (text: string, record: HotelDevice) => (
        <Space>
          {getDeviceIcon(record.type)}
          <span>{text}</span>
        </Space>
      ),
    },
    {
      title: '房间',
      dataIndex: 'roomNumber',
      key: 'roomNumber',
      width: 80,
      render: (text: string, record: HotelDevice) => (
        <Badge count={record.floor} color="#1890ff">
          <span>{text}</span>
        </Badge>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status: string) => getStatusTag(status),
    },
    {
      title: '信号强度',
      dataIndex: 'signal',
      key: 'signal',
      width: 120,
      render: (signal: number) => (
        <Progress 
          percent={signal} 
          size="small" 
          status={signal > 90 ? 'success' : signal > 70 ? 'normal' : 'exception'}
          showInfo={false}
        />
      ),
    },
    {
      title: '功率(W)',
      dataIndex: 'power',
      key: 'power',
      width: 100,
      render: (power: number) => power ? `${power.toFixed(0)}W` : '-',
    },
    {
      title: '能耗(kWh)',
      dataIndex: 'energyConsumption',
      key: 'energyConsumption',
      width: 120,
      render: (energy: number) => energy ? `${energy.toFixed(1)}kWh` : '-',
    },
    {
      title: '最后更新',
      dataIndex: 'lastUpdate',
      key: 'lastUpdate',
      width: 160,
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      render: (text: any, record: HotelDevice) => (
        <Button 
          type="link" 
          icon={<EyeOutlined />}
          onClick={() => {
            setSelectedDevice(record);
            setDetailModalVisible(true);
          }}
        >
          详情
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: '0 16px' }}>
      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="设备总数"
              value={totalDevices}
              prefix={<MonitorOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="在线设备"
              value={onlineDevices}
              suffix={`/ ${totalDevices}`}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="告警设备"
              value={warningDevices + errorDevices}
              prefix={<WarningOutlined />}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="总能耗"
              value={totalEnergyConsumption.toFixed(1)}
              suffix="kWh"
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 过滤器 */}
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={16} align="middle">
          <Col span={4}>
            <Select
              placeholder="选择楼层"
              style={{ width: '100%' }}
              allowClear
              onChange={setSelectedFloor}
            >
              <Option value={1}>1楼</Option>
              <Option value={2}>2楼</Option>
              <Option value={3}>3楼</Option>
            </Select>
          </Col>
          <Col span={4}>
            <Select
              placeholder="设备类别"
              style={{ width: '100%' }}
              allowClear
              onChange={setSelectedCategory}
            >
              <Option value="hvac">暖通空调</Option>
              <Option value="lighting">照明系统</Option>
              <Option value="security">安防系统</Option>
              <Option value="entertainment">娱乐设备</Option>
              <Option value="comfort">舒适设备</Option>
              <Option value="service">服务设备</Option>
              <Option value="safety">安全设备</Option>
            </Select>
          </Col>
          <Col span={4}>
            <Select
              placeholder="设备状态"
              style={{ width: '100%' }}
              allowClear
              onChange={setSelectedStatus}
            >
              <Option value="online">在线</Option>
              <Option value="offline">离线</Option>
              <Option value="warning">警告</Option>
              <Option value="error">故障</Option>
            </Select>
          </Col>
          <Col span={8}>
            <Search
              placeholder="搜索设备名称或房间号"
              onSearch={setSearchText}
              onChange={(e) => setSearchText(e.target.value)}
              enterButton={<SearchOutlined />}
            />
          </Col>
          <Col span={4}>
            <Button 
              onClick={() => {
                setSelectedFloor(null);
                setSelectedCategory(null);
                setSelectedStatus(null);
                setSearchText('');
              }}
            >
              重置
            </Button>
          </Col>
        </Row>
      </Card>

      {/* 设备列表 */}
      <Card 
        title={`设备监控 (${filteredDevices.length}/${totalDevices})`}
        extra={
          <Space>
            <span>在线率: {averageUptime.toFixed(1)}%</span>
            <Progress 
              type="circle" 
              percent={averageUptime} 
              width={40}
              format={() => ''}
            />
          </Space>
        }
      >
        <Table
          columns={columns}
          dataSource={filteredDevices}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 台设备`,
          }}
          scroll={{ x: 800 }}
        />
      </Card>

      {/* 设备详情弹窗 */}
      <Modal
        title="设备详情"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        width={600}
      >
        {selectedDevice && (
          <Descriptions column={2} bordered>
            <Descriptions.Item label="设备名称" span={2}>
              <Space>
                {getDeviceIcon(selectedDevice.type)}
                {selectedDevice.name}
              </Space>
            </Descriptions.Item>
            <Descriptions.Item label="设备ID">{selectedDevice.id}</Descriptions.Item>
            <Descriptions.Item label="设备类型">
              {selectedDevice.type.replace('_', ' ').toUpperCase()}
            </Descriptions.Item>
            <Descriptions.Item label="房间号">{selectedDevice.roomNumber}</Descriptions.Item>
            <Descriptions.Item label="楼层">{selectedDevice.floor}楼</Descriptions.Item>
            <Descriptions.Item label="位置" span={2}>{selectedDevice.location}</Descriptions.Item>
            <Descriptions.Item label="状态">{getStatusTag(selectedDevice.status)}</Descriptions.Item>
            <Descriptions.Item label="信号强度">
              <Progress percent={selectedDevice.signal} size="small" />
            </Descriptions.Item>
            {selectedDevice.temperature && (
              <Descriptions.Item label="温度">{selectedDevice.temperature.toFixed(1)}°C</Descriptions.Item>
            )}
            {selectedDevice.humidity && (
              <Descriptions.Item label="湿度">{selectedDevice.humidity.toFixed(1)}%</Descriptions.Item>
            )}
            {selectedDevice.brightness && (
              <Descriptions.Item label="亮度">{selectedDevice.brightness.toFixed(0)}%</Descriptions.Item>
            )}
            {selectedDevice.power && (
              <Descriptions.Item label="功率">{selectedDevice.power.toFixed(0)}W</Descriptions.Item>
            )}
            {selectedDevice.energyConsumption && (
              <Descriptions.Item label="能耗">{selectedDevice.energyConsumption.toFixed(1)}kWh</Descriptions.Item>
            )}
            {selectedDevice.battery && (
              <Descriptions.Item label="电池电量">
                <Progress 
                  percent={selectedDevice.battery} 
                  size="small"
                  status={selectedDevice.battery > 20 ? 'success' : 'exception'}
                />
              </Descriptions.Item>
            )}
            <Descriptions.Item label="最后更新" span={2}>{selectedDevice.lastUpdate}</Descriptions.Item>
            {selectedDevice.errorMessage && (
              <Descriptions.Item label="错误信息" span={2}>
                <Tag color="red">{selectedDevice.errorMessage}</Tag>
              </Descriptions.Item>
            )}
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default DeviceMonitor; 