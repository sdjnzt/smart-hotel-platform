import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Slider, Switch, Button, Select, InputNumber, Space, Alert, Modal, Table, Tag, Statistic, Progress } from 'antd';
import { SettingOutlined, ThunderboltOutlined, BulbOutlined, SnippetsOutlined, SaveOutlined, HistoryOutlined } from '@ant-design/icons';
import { hotelDevices, deviceAdjustments, HotelDevice, DeviceAdjustment } from '../data/mockData';

const { Option } = Select;

const DeviceAdjustmentPage: React.FC = () => {
  const [devices, setDevices] = useState<HotelDevice[]>(hotelDevices);
  const [selectedRoom, setSelectedRoom] = useState<string>('101');
  const [historyVisible, setHistoryVisible] = useState(false);
  const [adjustmentHistory, setAdjustmentHistory] = useState<DeviceAdjustment[]>(deviceAdjustments);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // 获取当前房间的设备
  const roomDevices = devices.filter(device => device.roomNumber === selectedRoom);
  
  // 获取房间列表
  const roomNumbers = Array.from(new Set(devices.map(device => device.roomNumber))).sort();

  // 设备控制组件
  const DeviceControl: React.FC<{ device: HotelDevice; onUpdate: (updates: Partial<HotelDevice>) => void }> = 
    ({ device, onUpdate }) => {
    
    const getDeviceIcon = (type: string) => {
      const iconMap = {
        air_conditioner: <SnippetsOutlined style={{ color: '#1890ff' }} />,
        lighting: <BulbOutlined style={{ color: '#fadb14' }} />,
        tv: <SnippetsOutlined style={{ color: '#eb2f96' }} />,
        curtain: <SnippetsOutlined style={{ color: '#722ed1' }} />
      };
      return iconMap[type as keyof typeof iconMap] || <SettingOutlined />;
    };

    const renderControls = () => {
      switch (device.type) {
        case 'air_conditioner':
          return (
            <Space direction="vertical" style={{ width: '100%' }}>
              <div>
                <label>温度设置: {device.temperature}°C</label>
                <Slider
                  min={16}
                  max={30}
                  value={device.temperature}
                  onChange={(value) => {
                    onUpdate({ temperature: value });
                    setHasUnsavedChanges(true);
                  }}
                  marks={{
                    16: '16°C',
                    22: '22°C',
                    26: '26°C',
                    30: '30°C'
                  }}
                />
              </div>
              <div>
                <label>湿度设置: {device.humidity}%</label>
                <Slider
                  min={30}
                  max={70}
                  value={device.humidity}
                  onChange={(value) => {
                    onUpdate({ humidity: value });
                    setHasUnsavedChanges(true);
                  }}
                />
              </div>
            </Space>
          );
        
        case 'lighting':
          return (
            <Space direction="vertical" style={{ width: '100%' }}>
              <div>
                <label>亮度: {device.brightness}%</label>
                <Slider
                  min={0}
                  max={100}
                  value={device.brightness}
                  onChange={(value) => {
                    onUpdate({ brightness: value });
                    setHasUnsavedChanges(true);
                  }}
                  marks={{
                    0: '关闭',
                    25: '25%',
                    50: '50%',
                    75: '75%',
                    100: '100%'
                  }}
                />
              </div>
            </Space>
          );
        
        case 'tv':
          return (
            <Space direction="vertical" style={{ width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>电源状态</span>
                <Switch 
                  checked={device.power! > 0} 
                  onChange={(checked) => {
                    onUpdate({ power: checked ? 150 : 0 });
                    setHasUnsavedChanges(true);
                  }}
                />
              </div>
              <div>
                <label>音量: 50%</label>
                <Slider
                  min={0}
                  max={100}
                  defaultValue={50}
                  onChange={() => setHasUnsavedChanges(true)}
                />
              </div>
            </Space>
          );
        
        case 'curtain':
          return (
            <Space direction="vertical" style={{ width: '100%' }}>
              <div>
                <label>开启程度: 50%</label>
                <Slider
                  min={0}
                  max={100}
                  defaultValue={50}
                  onChange={() => setHasUnsavedChanges(true)}
                  marks={{
                    0: '关闭',
                    50: '半开',
                    100: '全开'
                  }}
                />
              </div>
            </Space>
          );
        
        default:
          return (
            <div style={{ textAlign: 'center', color: '#999' }}>
              该设备暂不支持远程调节
            </div>
          );
      }
    };

    return (
      <Card 
        title={
          <Space>
            {getDeviceIcon(device.type)}
            {device.name}
            <Tag color={device.status === 'online' ? 'green' : 'red'}>
              {device.status === 'online' ? '在线' : '离线'}
            </Tag>
          </Space>
        }
        extra={
          <Space>
            <span style={{ fontSize: '12px', color: '#666' }}>
              功率: {device.power}W
            </span>
          </Space>
        }
        size="small"
      >
        {device.status === 'online' ? renderControls() : (
          <div style={{ textAlign: 'center', color: '#999', padding: '20px' }}>
            设备离线，无法调节
          </div>
        )}
      </Card>
    );
  };

  // 更新设备参数
  const updateDevice = (deviceId: string, updates: Partial<HotelDevice>) => {
    setDevices(prevDevices => 
      prevDevices.map(device => 
        device.id === deviceId 
          ? { ...device, ...updates, lastUpdate: new Date().toLocaleString() }
          : device
      )
    );
  };

  // 保存设置
  const saveSettings = () => {
    // 模拟保存到后端
    setHasUnsavedChanges(false);
    
    // 添加到历史记录
    const newAdjustment: DeviceAdjustment = {
      id: `adj_${Date.now()}`,
      deviceId: roomDevices[0]?.id || '',
      deviceName: `房间${selectedRoom}设备组`,
      roomNumber: selectedRoom,
      adjustmentType: 'temperature',
      oldValue: 24,
      newValue: roomDevices.find(d => d.type === 'air_conditioner')?.temperature || 22,
      adjustedBy: 'staff',
      timestamp: new Date().toLocaleString(),
      reason: '用户手动调节',
      energyImpact: Math.random() * 5 - 2.5
    };
    
    setAdjustmentHistory(prev => [newAdjustment, ...prev]);
    
    Modal.success({
      title: '设置已保存',
      content: '设备参数已成功更新'
    });
  };

  // 重置设置
  const resetSettings = () => {
    Modal.confirm({
      title: '确认重置',
      content: '确定要重置当前房间所有设备到默认设置吗？',
      onOk: () => {
        setDevices(prevDevices => 
          prevDevices.map(device => {
            if (device.roomNumber === selectedRoom) {
              return {
                ...device,
                temperature: device.type === 'air_conditioner' ? 22 : device.temperature,
                brightness: device.type === 'lighting' ? 70 : device.brightness,
                humidity: device.type === 'air_conditioner' ? 45 : device.humidity,
                lastUpdate: new Date().toLocaleString()
              };
            }
            return device;
          })
        );
        setHasUnsavedChanges(false);
      }
    });
  };

  // 历史记录表格列
  const historyColumns = [
    {
      title: '设备名称',
      dataIndex: 'deviceName',
      key: 'deviceName',
    },
    {
      title: '调节类型',
      dataIndex: 'adjustmentType',
      key: 'adjustmentType',
      render: (type: string) => {
        const typeNames = {
          temperature: '温度',
          brightness: '亮度',
          volume: '音量',
          power: '电源',
          schedule: '定时'
        };
        return typeNames[type as keyof typeof typeNames] || type;
      }
    },
    {
      title: '调节值',
      key: 'values',
      render: (record: DeviceAdjustment) => (
        <span>{record.oldValue} → {record.newValue}</span>
      )
    },
    {
      title: '调节时间',
      dataIndex: 'timestamp',
      key: 'timestamp',
    },
    {
      title: '能耗影响',
      dataIndex: 'energyImpact',
      key: 'energyImpact',
      render: (impact: number) => (
        <Tag color={impact > 0 ? 'red' : 'green'}>
          {impact > 0 ? '+' : ''}{impact?.toFixed(1)}kWh
        </Tag>
      )
    }
  ];

  // 计算房间能耗统计
  const roomEnergyConsumption = roomDevices.reduce((sum, device) => sum + (device.energyConsumption || 0), 0);
  const roomPowerConsumption = roomDevices.reduce((sum, device) => sum + (device.power || 0), 0);
  const onlineDeviceCount = roomDevices.filter(d => d.status === 'online').length;

  return (
    <div style={{ padding: '0 16px' }}>
      {/* 未保存更改提示 */}
      {hasUnsavedChanges && (
        <Alert
          message="有未保存的更改"
          description="您对设备参数进行了修改，请记得保存设置"
          type="warning"
          showIcon
          style={{ marginBottom: 16 }}
          action={
            <Button size="small" type="primary" onClick={saveSettings}>
              立即保存
            </Button>
          }
        />
      )}

      {/* 房间选择和统计 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card>
            <div style={{ marginBottom: 16 }}>
              <label>选择房间：</label>
              <Select
                style={{ width: '100%', marginTop: 8 }}
                value={selectedRoom}
                onChange={setSelectedRoom}
              >
                {roomNumbers.map(room => (
                  <Option key={room} value={room}>房间 {room}</Option>
                ))}
              </Select>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="在线设备"
              value={onlineDeviceCount}
              suffix={`/ ${roomDevices.length}`}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="当前功率"
              value={roomPowerConsumption}
              suffix="W"
              prefix={<ThunderboltOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="日能耗"
              value={roomEnergyConsumption.toFixed(1)}
              suffix="kWh"
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 设备控制面板 */}
      <Row gutter={16}>
        <Col span={18}>
          <Card 
            title={`房间 ${selectedRoom} 设备控制`}
            extra={
              <Space>
                <Button onClick={() => setHistoryVisible(true)} icon={<HistoryOutlined />}>
                  调节历史
                </Button>
                <Button onClick={resetSettings}>
                  重置设置
                </Button>
                <Button 
                  type="primary" 
                  icon={<SaveOutlined />}
                  onClick={saveSettings}
                  disabled={!hasUnsavedChanges}
                >
                  保存设置
                </Button>
              </Space>
            }
          >
            <Row gutter={16}>
              {roomDevices.map(device => (
                <Col span={12} key={device.id} style={{ marginBottom: 16 }}>
                  <DeviceControl 
                    device={device} 
                    onUpdate={(updates) => updateDevice(device.id, updates)}
                  />
                </Col>
              ))}
            </Row>
            {roomDevices.length === 0 && (
              <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
                该房间暂无设备
              </div>
            )}
          </Card>
        </Col>
        
        <Col span={6}>
          <Card title="节能建议" style={{ marginBottom: 16 }}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Alert
                message="温度建议"
                description="建议空调温度设置在22-24°C之间，可节省15%的能耗"
                type="info"
                showIcon
                style={{ marginBottom: 8 }}
              />
              <Alert
                message="照明建议"
                description="根据时间自动调节亮度，夜间建议30%亮度"
                type="info"
                showIcon
              />
            </Space>
          </Card>
          
          <Card title="能耗监控">
            <div style={{ textAlign: 'center' }}>
              <Progress
                type="dashboard"
                percent={Math.round((roomEnergyConsumption / 25) * 100)}
                format={() => `${roomEnergyConsumption.toFixed(1)}kWh`}
              />
              <div style={{ marginTop: 16, color: '#666' }}>今日能耗</div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* 调节历史弹窗 */}
      <Modal
        title="设备调节历史"
        open={historyVisible}
        onCancel={() => setHistoryVisible(false)}
        footer={null}
        width={800}
      >
        <Table
          columns={historyColumns}
          dataSource={adjustmentHistory.filter(adj => adj.roomNumber === selectedRoom)}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Modal>
    </div>
  );
};

export default DeviceAdjustmentPage; 