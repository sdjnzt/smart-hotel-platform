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
} from 'antd';
import {
  HomeOutlined,
  UserOutlined,
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
  StarOutlined,
  WifiOutlined,
  BulbOutlined,
  ToolOutlined,
  ClearOutlined,
  KeyOutlined,
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;
const { Option } = Select;

interface Room {
  id: string;
  roomNumber: string;
  type: string;
  floor: number;
  status: 'occupied' | 'vacant' | 'cleaning' | 'maintenance' | 'reserved';
  guestName?: string;
  checkInDate?: string;
  checkOutDate?: string;
  price: number;
  amenities: string[];
  cleaningStatus: 'clean' | 'dirty' | 'cleaning';
  maintenanceStatus: 'normal' | 'minor' | 'major';
  lastCleaned: string;
  nextCleaning: string;
}

interface Booking {
  id: string;
  roomNumber: string;
  guestName: string;
  phone: string;
  checkInDate: string;
  checkOutDate: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  totalAmount: number;
  deposit: number;
  specialRequests?: string;
}

const RoomManagement: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [roomList, setRoomList] = useState<Room[]>([]);
  const [bookingList, setBookingList] = useState<Booking[]>([]);
  const [selectedRooms, setSelectedRooms] = useState<string[]>([]);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [bookingModalVisible, setBookingModalVisible] = useState(false);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [currentRoom, setCurrentRoom] = useState<Room | null>(null);
  const [activeTab, setActiveTab] = useState('rooms');

  // 模拟数据
  const mockRooms: Room[] = [
    {
      id: '1',
      roomNumber: '101',
      type: '标准间',
      floor: 1,
      status: 'occupied',
      guestName: '张先生',
      checkInDate: '2025-07-14',
      checkOutDate: '2025-07-16',
      price: 288,
      amenities: ['WiFi', '空调', '电视', '独立卫浴'],
      cleaningStatus: 'clean',
      maintenanceStatus: 'normal',
      lastCleaned: '2025-07-14 14:30',
      nextCleaning: '2025-07-16 10:00',
    },
    {
      id: '2',
      roomNumber: '102',
      type: '标准间',
      floor: 1,
      status: 'vacant',
      price: 288,
      amenities: ['WiFi', '空调', '电视', '独立卫浴'],
      cleaningStatus: 'clean',
      maintenanceStatus: 'normal',
      lastCleaned: '2025-07-15 09:15',
      nextCleaning: '2025-07-17 10:00',
    },
    {
      id: '3',
      roomNumber: '201',
      type: '豪华间',
      floor: 2,
      status: 'cleaning',
      price: 388,
      amenities: ['WiFi', '空调', '电视', '独立卫浴', '迷你吧', '景观阳台'],
      cleaningStatus: 'cleaning',
      maintenanceStatus: 'normal',
      lastCleaned: '2025-07-15 08:00',
      nextCleaning: '2025-07-15 12:00',
    },
    {
      id: '4',
      roomNumber: '202',
      type: '豪华间',
      floor: 2,
      status: 'reserved',
      guestName: '李女士',
      checkInDate: '2025-07-16',
      checkOutDate: '2025-07-18',
      price: 388,
      amenities: ['WiFi', '空调', '电视', '独立卫浴', '迷你吧', '景观阳台'],
      cleaningStatus: 'clean',
      maintenanceStatus: 'normal',
      lastCleaned: '2025-07-15 10:30',
      nextCleaning: '2025-07-16 10:00',
    },
    {
      id: '5',
      roomNumber: '301',
      type: '套房',
      floor: 3,
      status: 'maintenance',
      price: 688,
      amenities: ['WiFi', '空调', '电视', '独立卫浴', '迷你吧', '景观阳台', '客厅', '厨房'],
      cleaningStatus: 'dirty',
      maintenanceStatus: 'minor',
      lastCleaned: '2025-07-14 16:00',
      nextCleaning: '2025-07-16 14:00',
    },
    {
      id: '6',
      roomNumber: '302',
      type: '套房',
      floor: 3,
      status: 'occupied',
      guestName: '王先生',
      checkInDate: '2025-07-13',
      checkOutDate: '2025-07-20',
      price: 688,
      amenities: ['WiFi', '空调', '电视', '独立卫浴', '迷你吧', '景观阳台', '客厅', '厨房'],
      cleaningStatus: 'clean',
      maintenanceStatus: 'normal',
      lastCleaned: '2025-07-15 11:00',
      nextCleaning: '2025-07-16 10:00',
    },
  ];

  const mockBookings: Booking[] = [
    {
      id: '1',
      roomNumber: '203',
      guestName: '陈女士',
      phone: '13900139001',
      checkInDate: '2025-07-17',
      checkOutDate: '2025-07-19',
      status: 'confirmed',
      totalAmount: 776,
      deposit: 200,
      specialRequests: '需要婴儿床',
    },
    {
      id: '2',
      roomNumber: '103',
      guestName: '刘先生',
      phone: '13900139002',
      checkInDate: '2025-07-18',
      checkOutDate: '2025-07-20',
      status: 'pending',
      totalAmount: 576,
      deposit: 0,
    },
    {
      id: '3',
      roomNumber: '401',
      guestName: '赵女士',
      phone: '13900139003',
      checkInDate: '2025-07-19',
      checkOutDate: '2025-07-22',
      status: 'confirmed',
      totalAmount: 1164,
      deposit: 300,
      specialRequests: '高层房间，安静环境',
    },
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setLoading(true);
    // 模拟API调用
    setTimeout(() => {
      setRoomList(mockRooms);
      setBookingList(mockBookings);
      setLoading(false);
    }, 1000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'occupied':
      case 'confirmed':
        return 'green';
      case 'vacant':
      case 'clean':
        return 'blue';
      case 'cleaning':
      case 'pending':
        return 'orange';
      case 'maintenance':
      case 'dirty':
        return 'red';
      case 'reserved':
        return 'purple';
      case 'cancelled':
        return 'default';
      default:
        return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'occupied':
        return '已入住';
      case 'vacant':
        return '空闲';
      case 'cleaning':
        return '清洁中';
      case 'maintenance':
        return '维护中';
      case 'reserved':
        return '已预订';
      case 'confirmed':
        return '已确认';
      case 'pending':
        return '待确认';
      case 'cancelled':
        return '已取消';
      case 'clean':
        return '清洁';
      case 'dirty':
        return '待清洁';
      case 'normal':
        return '正常';
      case 'minor':
        return '轻微';
      case 'major':
        return '严重';
      default:
        return '未知';
    }
  };

  const roomColumns = [
    {
      title: '房间信息',
      key: 'info',
      render: (_: any, record: Room) => (
        <Space>
          <div style={{ textAlign: 'center' }}>
            <HomeOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
            <div style={{ fontSize: '12px', color: '#666' }}>{record.floor}层</div>
          </div>
          <div>
            <div>
              <Text strong style={{ fontSize: '16px' }}>{record.roomNumber}</Text>
              <Tag color="blue" style={{ marginLeft: 8 }}>{record.type}</Tag>
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              ¥{record.price}/晚
            </div>
          </div>
        </Space>
      ),
    },
    {
      title: '状态',
      key: 'status',
      render: (_: any, record: Room) => (
        <Space direction="vertical" size="small">
          <Badge
            status={getStatusColor(record.status) as any}
            text={getStatusText(record.status)}
          />
          {record.guestName && (
            <div style={{ fontSize: '12px', color: '#666' }}>
              客人: {record.guestName}
            </div>
          )}
        </Space>
      ),
    },
    {
      title: '清洁状态',
      key: 'cleaning',
      render: (_: any, record: Room) => (
        <Space direction="vertical" size="small">
          <Badge
            status={getStatusColor(record.cleaningStatus) as any}
            text={getStatusText(record.cleaningStatus)}
          />
          <div style={{ fontSize: '12px', color: '#666' }}>
            下次清洁: {record.nextCleaning}
          </div>
        </Space>
      ),
    },
    {
      title: '设施',
      key: 'amenities',
      render: (_: any, record: Room) => (
        <Space wrap>
          {record.amenities.map((amenity, index) => (
            <Tag key={index} color="blue">
              {amenity}
            </Tag>
          ))}
        </Space>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Room) => (
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
            icon={<CalendarOutlined />}
            onClick={() => handleBooking(record)}
          >
            预订
          </Button>
        </Space>
      ),
    },
  ];

  const bookingColumns = [
    {
      title: '预订信息',
      key: 'info',
      render: (_: any, record: Booking) => (
        <Space>
          <div>
            <div>
              <Text strong>{record.guestName}</Text>
              <Text code style={{ marginLeft: 8 }}>{record.roomNumber}</Text>
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              {record.phone}
            </div>
          </div>
        </Space>
      ),
    },
    {
      title: '入住时间',
      key: 'dates',
      render: (_: any, record: Booking) => (
        <Space direction="vertical" size="small">
          <div>入住: {record.checkInDate}</div>
          <div>退房: {record.checkOutDate}</div>
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
      title: '金额',
      key: 'amount',
      render: (_: any, record: Booking) => (
        <Space direction="vertical" size="small">
          <div>总金额: ¥{record.totalAmount}</div>
          <div>押金: ¥{record.deposit}</div>
        </Space>
      ),
    },
    {
      title: '特殊要求',
      dataIndex: 'specialRequests',
      key: 'specialRequests',
      render: (requests: string) => (
        requests ? (
          <Tooltip title={requests}>
            <Text type="secondary">有特殊要求</Text>
          </Tooltip>
        ) : (
          <Text type="secondary">无</Text>
        )
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Booking) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEditBooking(record)}
          >
            编辑
          </Button>
          <Button
            type="link"
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleCancelBooking(record)}
          >
            取消
          </Button>
        </Space>
      ),
    },
  ];

  const handleViewDetails = (record: Room) => {
    setCurrentRoom(record);
    setDetailsModalVisible(true);
  };

  const handleEdit = (record: Room) => {
    setCurrentRoom(record);
    setEditModalVisible(true);
  };

  const handleBooking = (record: Room) => {
    setCurrentRoom(record);
    setBookingModalVisible(true);
  };

  const handleEditBooking = (record: Booking) => {
    message.info('编辑预订功能开发中...');
  };

  const handleCancelBooking = (record: Booking) => {
    Modal.confirm({
      title: '确认取消预订',
      content: `确定要取消 ${record.guestName} 的预订吗？`,
      onOk: () => {
        message.success('预订已取消');
      },
    });
  };

  const handleExport = () => {
    message.success('数据导出成功');
  };

  const handleImport = () => {
    message.info('数据导入功能开发中...');
  };

  // 统计数据
  const totalRooms = roomList.length;
  const occupiedRooms = roomList.filter(room => room.status === 'occupied').length;
  const vacantRooms = roomList.filter(room => room.status === 'vacant').length;
  const cleaningRooms = roomList.filter(room => room.status === 'cleaning').length;
  const maintenanceRooms = roomList.filter(room => room.status === 'maintenance').length;
  const reservedRooms = roomList.filter(room => room.status === 'reserved').length;

  const occupancyRate = ((occupiedRooms / totalRooms) * 100).toFixed(1);

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>
        <HomeOutlined style={{ marginRight: 8 }} />
        房间管理
      </Title>

      {/* 统计卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={4}>
          <Card>
            <Statistic
              title="总房间数"
              value={totalRooms}
              prefix={<HomeOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={4}>
          <Card>
            <Statistic
              title="已入住"
              value={occupiedRooms}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={4}>
          <Card>
            <Statistic
              title="空闲房间"
              value={vacantRooms}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={4}>
          <Card>
            <Statistic
              title="清洁中"
              value={cleaningRooms}
              prefix={<ClearOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={4}>
          <Card>
            <Statistic
              title="维护中"
              value={maintenanceRooms}
              prefix={<ToolOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={4}>
          <Card>
            <Statistic
              title="入住率"
              value={occupancyRate}
              suffix="%"
              prefix={<StarOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 主要内容 */}
      <Card>
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="房间状态" key="rooms">
            <div style={{ marginBottom: 16 }}>
              <Space>
                <Button type="primary" icon={<CalendarOutlined />}>
                  新增房间
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
              columns={roomColumns}
              dataSource={roomList}
              rowKey="id"
              loading={loading}
              pagination={{
                total: roomList.length,
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
              }}
            />
          </TabPane>
          
          <TabPane tab="预订管理" key="bookings">
            <div style={{ marginBottom: 16 }}>
              <Space>
                <Button type="primary" icon={<CalendarOutlined />}>
                  新增预订
                </Button>
                <Button icon={<ExportOutlined />}>
                  导出预订
                </Button>
                <Button icon={<SearchOutlined />}>
                  搜索预订
                </Button>
              </Space>
            </div>
            <Table
              columns={bookingColumns}
              dataSource={bookingList}
              rowKey="id"
              loading={loading}
              pagination={{
                total: bookingList.length,
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
              }}
            />
          </TabPane>

          <TabPane tab="房间日历" key="calendar">
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

      {/* 房间详情模态框 */}
      <Modal
        title="房间详情"
        open={detailsModalVisible}
        onCancel={() => setDetailsModalVisible(false)}
        footer={null}
        width={600}
      >
        {currentRoom && (
          <Descriptions column={2} bordered>
            <Descriptions.Item label="房间号">{currentRoom.roomNumber}</Descriptions.Item>
            <Descriptions.Item label="房间类型">{currentRoom.type}</Descriptions.Item>
            <Descriptions.Item label="楼层">{currentRoom.floor}层</Descriptions.Item>
            <Descriptions.Item label="价格">¥{currentRoom.price}/晚</Descriptions.Item>
            <Descriptions.Item label="状态">
              <Badge
                status={getStatusColor(currentRoom.status) as any}
                text={getStatusText(currentRoom.status)}
              />
            </Descriptions.Item>
            <Descriptions.Item label="清洁状态">
              <Badge
                status={getStatusColor(currentRoom.cleaningStatus) as any}
                text={getStatusText(currentRoom.cleaningStatus)}
              />
            </Descriptions.Item>
            {currentRoom.guestName && (
              <>
                <Descriptions.Item label="客人姓名">{currentRoom.guestName}</Descriptions.Item>
                <Descriptions.Item label="入住时间">{currentRoom.checkInDate}</Descriptions.Item>
                <Descriptions.Item label="退房时间">{currentRoom.checkOutDate}</Descriptions.Item>
              </>
            )}
            <Descriptions.Item label="最后清洁时间">{currentRoom.lastCleaned}</Descriptions.Item>
            <Descriptions.Item label="下次清洁时间">{currentRoom.nextCleaning}</Descriptions.Item>
            <Descriptions.Item label="设施" span={2}>
              <Space wrap>
                {currentRoom.amenities.map((amenity, index) => (
                  <Tag key={index} color="blue">{amenity}</Tag>
                ))}
              </Space>
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>

      {/* 编辑房间模态框 */}
      <Modal
        title="编辑房间"
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        onOk={() => {
          message.success('房间信息更新成功');
          setEditModalVisible(false);
        }}
        width={600}
      >
        <Form layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="房间号">
                <Input defaultValue={currentRoom?.roomNumber} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="房间类型">
                <Select defaultValue={currentRoom?.type}>
                  <Option value="标准间">标准间</Option>
                  <Option value="豪华间">豪华间</Option>
                  <Option value="套房">套房</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="楼层">
                <Input type="number" defaultValue={currentRoom?.floor} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="价格">
                <Input type="number" defaultValue={currentRoom?.price} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="状态">
            <Select defaultValue={currentRoom?.status}>
              <Option value="vacant">空闲</Option>
              <Option value="occupied">已入住</Option>
              <Option value="cleaning">清洁中</Option>
              <Option value="maintenance">维护中</Option>
              <Option value="reserved">已预订</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* 预订房间模态框 */}
      <Modal
        title="预订房间"
        open={bookingModalVisible}
        onCancel={() => setBookingModalVisible(false)}
        onOk={() => {
          message.success('预订成功');
          setBookingModalVisible(false);
        }}
        width={600}
      >
        <Form layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="房间号">
                <Input value={currentRoom?.roomNumber} disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="房间类型">
                <Input value={currentRoom?.type} disabled />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="客人姓名" required>
                <Input placeholder="请输入客人姓名" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="联系电话" required>
                <Input placeholder="请输入联系电话" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="入住日期" required>
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="退房日期" required>
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="特殊要求">
            <Input.TextArea rows={3} placeholder="请输入特殊要求" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default RoomManagement; 