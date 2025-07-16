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
import dayjs from 'dayjs';
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
      roomNumber: '103',
      type: '标准间',
      floor: 1,
      status: 'vacant',
      price: 288,
      amenities: ['WiFi', '空调', '电视', '独立卫浴'],
      cleaningStatus: 'dirty',
      maintenanceStatus: 'normal',
      lastCleaned: '2025-07-14 16:00',
      nextCleaning: '2025-07-15 14:00',
    },
    {
      id: '4',
      roomNumber: '104',
      type: '标准间',
      floor: 1,
      status: 'cleaning',
      price: 288,
      amenities: ['WiFi', '空调', '电视', '独立卫浴'],
      cleaningStatus: 'cleaning',
      maintenanceStatus: 'normal',
      lastCleaned: '2025-07-15 08:00',
      nextCleaning: '2025-07-15 12:00',
    },
    {
      id: '5',
      roomNumber: '105',
      type: '标准间',
      floor: 1,
      status: 'maintenance',
      price: 288,
      amenities: ['WiFi', '空调', '电视', '独立卫浴'],
      cleaningStatus: 'dirty',
      maintenanceStatus: 'minor',
      lastCleaned: '2025-07-14 16:00',
      nextCleaning: '2025-07-16 14:00',
    },
    {
      id: '6',
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
      id: '7',
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
      id: '8',
      roomNumber: '203',
      type: '豪华间',
      floor: 2,
      status: 'occupied',
      guestName: '陈女士',
      checkInDate: '2025-07-15',
      checkOutDate: '2025-07-17',
      price: 388,
      amenities: ['WiFi', '空调', '电视', '独立卫浴', '迷你吧', '景观阳台'],
      cleaningStatus: 'clean',
      maintenanceStatus: 'normal',
      lastCleaned: '2025-07-15 11:00',
      nextCleaning: '2025-07-16 10:00',
    },
    {
      id: '9',
      roomNumber: '204',
      type: '豪华间',
      floor: 2,
      status: 'vacant',
      price: 388,
      amenities: ['WiFi', '空调', '电视', '独立卫浴', '迷你吧', '景观阳台'],
      cleaningStatus: 'clean',
      maintenanceStatus: 'normal',
      lastCleaned: '2025-07-15 09:30',
      nextCleaning: '2025-07-17 10:00',
    },
    {
      id: '10',
      roomNumber: '205',
      type: '豪华间',
      floor: 2,
      status: 'vacant',
      price: 388,
      amenities: ['WiFi', '空调', '电视', '独立卫浴', '迷你吧', '景观阳台'],
      cleaningStatus: 'dirty',
      maintenanceStatus: 'normal',
      lastCleaned: '2025-07-14 17:00',
      nextCleaning: '2025-07-15 15:00',
    },
    {
      id: '11',
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
      id: '12',
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
    {
      id: '13',
      roomNumber: '303',
      type: '套房',
      floor: 3,
      status: 'reserved',
      guestName: '赵女士',
      checkInDate: '2025-07-19',
      checkOutDate: '2025-07-22',
      price: 688,
      amenities: ['WiFi', '空调', '电视', '独立卫浴', '迷你吧', '景观阳台', '客厅', '厨房'],
      cleaningStatus: 'clean',
      maintenanceStatus: 'normal',
      lastCleaned: '2025-07-15 12:30',
      nextCleaning: '2025-07-16 10:00',
    },
    {
      id: '14',
      roomNumber: '401',
      type: '总统套房',
      floor: 4,
      status: 'occupied',
      guestName: '刘先生',
      checkInDate: '2025-07-12',
      checkOutDate: '2025-07-25',
      price: 1288,
      amenities: ['WiFi', '空调', '电视', '独立卫浴', '迷你吧', '景观阳台', '客厅', '厨房', '会议室', '健身房'],
      cleaningStatus: 'clean',
      maintenanceStatus: 'normal',
      lastCleaned: '2025-07-15 13:00',
      nextCleaning: '2025-07-16 10:00',
    },
    {
      id: '15',
      roomNumber: '402',
      type: '总统套房',
      floor: 4,
      status: 'vacant',
      price: 1288,
      amenities: ['WiFi', '空调', '电视', '独立卫浴', '迷你吧', '景观阳台', '客厅', '厨房', '会议室', '健身房'],
      cleaningStatus: 'clean',
      maintenanceStatus: 'normal',
      lastCleaned: '2025-07-15 14:30',
      nextCleaning: '2025-07-17 10:00',
    },
    {
      id: '16',
      roomNumber: '501',
      type: '商务套房',
      floor: 5,
      status: 'occupied',
      guestName: '孙女士',
      checkInDate: '2025-07-14',
      checkOutDate: '2025-07-18',
      price: 888,
      amenities: ['WiFi', '空调', '电视', '独立卫浴', '迷你吧', '景观阳台', '客厅', '办公桌'],
      cleaningStatus: 'clean',
      maintenanceStatus: 'normal',
      lastCleaned: '2025-07-15 10:00',
      nextCleaning: '2025-07-16 10:00',
    },
    {
      id: '17',
      roomNumber: '502',
      type: '商务套房',
      floor: 5,
      status: 'vacant',
      price: 888,
      amenities: ['WiFi', '空调', '电视', '独立卫浴', '迷你吧', '景观阳台', '客厅', '办公桌'],
      cleaningStatus: 'dirty',
      maintenanceStatus: 'normal',
      lastCleaned: '2025-07-14 18:00',
      nextCleaning: '2025-07-15 16:00',
    },
    {
      id: '18',
      roomNumber: '601',
      type: '家庭套房',
      floor: 6,
      status: 'reserved',
      guestName: '周先生',
      checkInDate: '2025-07-20',
      checkOutDate: '2025-07-23',
      price: 988,
      amenities: ['WiFi', '空调', '电视', '独立卫浴', '迷你吧', '景观阳台', '客厅', '儿童房', '游戏区'],
      cleaningStatus: 'clean',
      maintenanceStatus: 'normal',
      lastCleaned: '2025-07-15 11:30',
      nextCleaning: '2025-07-16 10:00',
    },
    {
      id: '19',
      roomNumber: '602',
      type: '家庭套房',
      floor: 6,
      status: 'maintenance',
      price: 988,
      amenities: ['WiFi', '空调', '电视', '独立卫浴', '迷你吧', '景观阳台', '客厅', '儿童房', '游戏区'],
      cleaningStatus: 'dirty',
      maintenanceStatus: 'major',
      lastCleaned: '2025-07-14 15:00',
      nextCleaning: '2025-07-18 14:00',
    },
    {
      id: '20',
      roomNumber: '701',
      type: '蜜月套房',
      floor: 7,
      status: 'occupied',
      guestName: '吴先生',
      checkInDate: '2025-07-15',
      checkOutDate: '2025-07-17',
      price: 1088,
      amenities: ['WiFi', '空调', '电视', '独立卫浴', '迷你吧', '景观阳台', '客厅', '按摩浴缸', '浪漫装饰'],
      cleaningStatus: 'clean',
      maintenanceStatus: 'normal',
      lastCleaned: '2025-07-15 12:00',
      nextCleaning: '2025-07-16 10:00',
    },
    {
      id: '20',
      roomNumber: '701',
      type: '蜜月套房',
      floor: 7,
      status: 'occupied',
      guestName: '吴先生',
      checkInDate: '2025-07-15',
      checkOutDate: '2025-07-17',
      price: 1088,
      amenities: ['WiFi', '空调', '电视', '独立卫浴', '迷你吧', '景观阳台', '客厅', '按摩浴缸', '浪漫装饰'],
      cleaningStatus: 'clean',
      maintenanceStatus: 'normal',
      lastCleaned: '2025-07-15 12:00',
      nextCleaning: '2025-07-16 10:00',
    },
    {
      id: '20',
      roomNumber: '701',
      type: '蜜月套房',
      floor: 7,
      status: 'occupied',
      guestName: '吴先生',
      checkInDate: '2025-07-15',
      checkOutDate: '2025-07-17',
      price: 1088,
      amenities: ['WiFi', '空调', '电视', '独立卫浴', '迷你吧', '景观阳台', '客厅', '按摩浴缸', '浪漫装饰'],
      cleaningStatus: 'clean',
      maintenanceStatus: 'normal',
      lastCleaned: '2025-07-15 12:00',
      nextCleaning: '2025-07-16 10:00',
    },
    {
      id: '20',
      roomNumber: '701',
      type: '蜜月套房',
      floor: 7,
      status: 'occupied',
      guestName: '吴先生',
      checkInDate: '2025-07-15',
      checkOutDate: '2025-07-17',
      price: 1088,
      amenities: ['WiFi', '空调', '电视', '独立卫浴', '迷你吧', '景观阳台', '客厅', '按摩浴缸', '浪漫装饰'],
      cleaningStatus: 'clean',
      maintenanceStatus: 'normal',
      lastCleaned: '2025-07-15 12:00',
      nextCleaning: '2025-07-16 10:00',
    },
    {
      id: '20',
      roomNumber: '701',
      type: '蜜月套房',
      floor: 7,
      status: 'occupied',
      guestName: '吴先生',
      checkInDate: '2025-07-15',
      checkOutDate: '2025-07-17',
      price: 1088,
      amenities: ['WiFi', '空调', '电视', '独立卫浴', '迷你吧', '景观阳台', '客厅', '按摩浴缸', '浪漫装饰'],
      cleaningStatus: 'clean',
      maintenanceStatus: 'normal',
      lastCleaned: '2025-07-15 12:00',
      nextCleaning: '2025-07-16 10:00',
    },
    {
      id: '20',
      roomNumber: '701',
      type: '蜜月套房',
      floor: 7,
      status: 'occupied',
      guestName: '吴先生',
      checkInDate: '2025-07-15',
      checkOutDate: '2025-07-17',
      price: 1088,
      amenities: ['WiFi', '空调', '电视', '独立卫浴', '迷你吧', '景观阳台', '客厅', '按摩浴缸', '浪漫装饰'],
      cleaningStatus: 'clean',
      maintenanceStatus: 'normal',
      lastCleaned: '2025-07-15 12:00',
      nextCleaning: '2025-07-16 10:00',
    },
    {
      id: '20',
      roomNumber: '701',
      type: '蜜月套房',
      floor: 7,
      status: 'occupied',
      guestName: '吴先生',
      checkInDate: '2025-07-15',
      checkOutDate: '2025-07-17',
      price: 1088,
      amenities: ['WiFi', '空调', '电视', '独立卫浴', '迷你吧', '景观阳台', '客厅', '按摩浴缸', '浪漫装饰'],
      cleaningStatus: 'clean',
      maintenanceStatus: 'normal',
      lastCleaned: '2025-07-15 12:00',
      nextCleaning: '2025-07-16 10:00',
    },
    {
      id: '20',
      roomNumber: '701',
      type: '蜜月套房',
      floor: 7,
      status: 'occupied',
      guestName: '吴先生',
      checkInDate: '2025-07-15',
      checkOutDate: '2025-07-17',
      price: 1088,
      amenities: ['WiFi', '空调', '电视', '独立卫浴', '迷你吧', '景观阳台', '客厅', '按摩浴缸', '浪漫装饰'],
      cleaningStatus: 'clean',
      maintenanceStatus: 'normal',
      lastCleaned: '2025-07-15 12:00',
      nextCleaning: '2025-07-16 10:00',
    },
    {
      id: '20',
      roomNumber: '701',
      type: '蜜月套房',
      floor: 7,
      status: 'occupied',
      guestName: '吴先生',
      checkInDate: '2025-07-15',
      checkOutDate: '2025-07-17',
      price: 1088,
      amenities: ['WiFi', '空调', '电视', '独立卫浴', '迷你吧', '景观阳台', '客厅', '按摩浴缸', '浪漫装饰'],
      cleaningStatus: 'clean',
      maintenanceStatus: 'normal',
      lastCleaned: '2025-07-15 12:00',
      nextCleaning: '2025-07-16 10:00',
    },
    {
      id: '20',
      roomNumber: '701',
      type: '蜜月套房',
      floor: 7,
      status: 'occupied',
      guestName: '吴先生',
      checkInDate: '2025-07-15',
      checkOutDate: '2025-07-17',
      price: 1088,
      amenities: ['WiFi', '空调', '电视', '独立卫浴', '迷你吧', '景观阳台', '客厅', '按摩浴缸', '浪漫装饰'],
      cleaningStatus: 'clean',
      maintenanceStatus: 'normal',
      lastCleaned: '2025-07-15 12:00',
      nextCleaning: '2025-07-16 10:00',
    },
    {
      id: '20',
      roomNumber: '701',
      type: '蜜月套房',
      floor: 7,
      status: 'occupied',
      guestName: '吴先生',
      checkInDate: '2025-07-15',
      checkOutDate: '2025-07-17',
      price: 1088,
      amenities: ['WiFi', '空调', '电视', '独立卫浴', '迷你吧', '景观阳台', '客厅', '按摩浴缸', '浪漫装饰'],
      cleaningStatus: 'clean',
      maintenanceStatus: 'normal',
      lastCleaned: '2025-07-15 12:00',
      nextCleaning: '2025-07-16 10:00',
    },
    {
      id: '20',
      roomNumber: '701',
      type: '蜜月套房',
      floor: 7,
      status: 'occupied',
      guestName: '吴先生',
      checkInDate: '2025-07-15',
      checkOutDate: '2025-07-17',
      price: 1088,
      amenities: ['WiFi', '空调', '电视', '独立卫浴', '迷你吧', '景观阳台', '客厅', '按摩浴缸', '浪漫装饰'],
      cleaningStatus: 'clean',
      maintenanceStatus: 'normal',
      lastCleaned: '2025-07-15 12:00',
      nextCleaning: '2025-07-16 10:00',
    },
    {
      id: '20',
      roomNumber: '701',
      type: '蜜月套房',
      floor: 7,
      status: 'occupied',
      guestName: '吴先生',
      checkInDate: '2025-07-15',
      checkOutDate: '2025-07-17',
      price: 1088,
      amenities: ['WiFi', '空调', '电视', '独立卫浴', '迷你吧', '景观阳台', '客厅', '按摩浴缸', '浪漫装饰'],
      cleaningStatus: 'clean',
      maintenanceStatus: 'normal',
      lastCleaned: '2025-07-15 12:00',
      nextCleaning: '2025-07-16 10:00',
    },
    {
      id: '20',
      roomNumber: '701',
      type: '蜜月套房',
      floor: 7,
      status: 'occupied',
      guestName: '吴先生',
      checkInDate: '2025-07-15',
      checkOutDate: '2025-07-17',
      price: 1088,
      amenities: ['WiFi', '空调', '电视', '独立卫浴', '迷你吧', '景观阳台', '客厅', '按摩浴缸', '浪漫装饰'],
      cleaningStatus: 'clean',
      maintenanceStatus: 'normal',
      lastCleaned: '2025-07-15 12:00',
      nextCleaning: '2025-07-16 10:00',
    },
    {
      id: '20',
      roomNumber: '701',
      type: '蜜月套房',
      floor: 7,
      status: 'occupied',
      guestName: '吴先生',
      checkInDate: '2025-07-15',
      checkOutDate: '2025-07-17',
      price: 1088,
      amenities: ['WiFi', '空调', '电视', '独立卫浴', '迷你吧', '景观阳台', '客厅', '按摩浴缸', '浪漫装饰'],
      cleaningStatus: 'clean',
      maintenanceStatus: 'normal',
      lastCleaned: '2025-07-15 12:00',
      nextCleaning: '2025-07-16 10:00',
    },
    {
      id: '20',
      roomNumber: '701',
      type: '蜜月套房',
      floor: 7,
      status: 'occupied',
      guestName: '吴先生',
      checkInDate: '2025-07-15',
      checkOutDate: '2025-07-17',
      price: 1088,
      amenities: ['WiFi', '空调', '电视', '独立卫浴', '迷你吧', '景观阳台', '客厅', '按摩浴缸', '浪漫装饰'],
      cleaningStatus: 'clean',
      maintenanceStatus: 'normal',
      lastCleaned: '2025-07-15 12:00',
      nextCleaning: '2025-07-16 10:00',
    },
    {
      id: '20',
      roomNumber: '701',
      type: '蜜月套房',
      floor: 7,
      status: 'occupied',
      guestName: '吴先生',
      checkInDate: '2025-07-15',
      checkOutDate: '2025-07-17',
      price: 1088,
      amenities: ['WiFi', '空调', '电视', '独立卫浴', '迷你吧', '景观阳台', '客厅', '按摩浴缸', '浪漫装饰'],
      cleaningStatus: 'clean',
      maintenanceStatus: 'normal',
      lastCleaned: '2025-07-15 12:00',
      nextCleaning: '2025-07-16 10:00',
    },
    {
      id: '20',
      roomNumber: '701',
      type: '蜜月套房',
      floor: 7,
      status: 'occupied',
      guestName: '吴先生',
      checkInDate: '2025-07-15',
      checkOutDate: '2025-07-17',
      price: 1088,
      amenities: ['WiFi', '空调', '电视', '独立卫浴', '迷你吧', '景观阳台', '客厅', '按摩浴缸', '浪漫装饰'],
      cleaningStatus: 'clean',
      maintenanceStatus: 'normal',
      lastCleaned: '2025-07-15 12:00',
      nextCleaning: '2025-07-16 10:00',
    },
    {
      id: '20',
      roomNumber: '701',
      type: '蜜月套房',
      floor: 7,
      status: 'occupied',
      guestName: '吴先生',
      checkInDate: '2025-07-15',
      checkOutDate: '2025-07-17',
      price: 1088,
      amenities: ['WiFi', '空调', '电视', '独立卫浴', '迷你吧', '景观阳台', '客厅', '按摩浴缸', '浪漫装饰'],
      cleaningStatus: 'clean',
      maintenanceStatus: 'normal',
      lastCleaned: '2025-07-15 12:00',
      nextCleaning: '2025-07-16 10:00',
    },
    {
      id: '20',
      roomNumber: '701',
      type: '蜜月套房',
      floor: 7,
      status: 'occupied',
      guestName: '吴先生',
      checkInDate: '2025-07-15',
      checkOutDate: '2025-07-17',
      price: 1088,
      amenities: ['WiFi', '空调', '电视', '独立卫浴', '迷你吧', '景观阳台', '客厅', '按摩浴缸', '浪漫装饰'],
      cleaningStatus: 'clean',
      maintenanceStatus: 'normal',
      lastCleaned: '2025-07-15 12:00',
      nextCleaning: '2025-07-16 10:00',
    },
    {
      id: '20',
      roomNumber: '701',
      type: '蜜月套房',
      floor: 7,
      status: 'occupied',
      guestName: '吴先生',
      checkInDate: '2025-07-15',
      checkOutDate: '2025-07-17',
      price: 1088,
      amenities: ['WiFi', '空调', '电视', '独立卫浴', '迷你吧', '景观阳台', '客厅', '按摩浴缸', '浪漫装饰'],
      cleaningStatus: 'clean',
      maintenanceStatus: 'normal',
      lastCleaned: '2025-07-15 12:00',
      nextCleaning: '2025-07-16 10:00',
    },
    {
      id: '20',
      roomNumber: '701',
      type: '蜜月套房',
      floor: 7,
      status: 'occupied',
      guestName: '吴先生',
      checkInDate: '2025-07-15',
      checkOutDate: '2025-07-17',
      price: 1088,
      amenities: ['WiFi', '空调', '电视', '独立卫浴', '迷你吧', '景观阳台', '客厅', '按摩浴缸', '浪漫装饰'],
      cleaningStatus: 'clean',
      maintenanceStatus: 'normal',
      lastCleaned: '2025-07-15 12:00',
      nextCleaning: '2025-07-16 10:00',
    },
    {
      id: '20',
      roomNumber: '701',
      type: '蜜月套房',
      floor: 7,
      status: 'occupied',
      guestName: '吴先生',
      checkInDate: '2025-07-15',
      checkOutDate: '2025-07-17',
      price: 1088,
      amenities: ['WiFi', '空调', '电视', '独立卫浴', '迷你吧', '景观阳台', '客厅', '按摩浴缸', '浪漫装饰'],
      cleaningStatus: 'clean',
      maintenanceStatus: 'normal',
      lastCleaned: '2025-07-15 12:00',
      nextCleaning: '2025-07-16 10:00',
    },
    {
      id: '20',
      roomNumber: '701',
      type: '蜜月套房',
      floor: 7,
      status: 'occupied',
      guestName: '吴先生',
      checkInDate: '2025-07-15',
      checkOutDate: '2025-07-17',
      price: 1088,
      amenities: ['WiFi', '空调', '电视', '独立卫浴', '迷你吧', '景观阳台', '客厅', '按摩浴缸', '浪漫装饰'],
      cleaningStatus: 'clean',
      maintenanceStatus: 'normal',
      lastCleaned: '2025-07-15 12:00',
      nextCleaning: '2025-07-16 10:00',
    },
    {
      id: '20',
      roomNumber: '701',
      type: '蜜月套房',
      floor: 7,
      status: 'occupied',
      guestName: '吴先生',
      checkInDate: '2025-07-15',
      checkOutDate: '2025-07-17',
      price: 1088,
      amenities: ['WiFi', '空调', '电视', '独立卫浴', '迷你吧', '景观阳台', '客厅', '按摩浴缸', '浪漫装饰'],
      cleaningStatus: 'clean',
      maintenanceStatus: 'normal',
      lastCleaned: '2025-07-15 12:00',
      nextCleaning: '2025-07-16 10:00',
    },
    {
      id: '20',
      roomNumber: '701',
      type: '蜜月套房',
      floor: 7,
      status: 'occupied',
      guestName: '吴先生',
      checkInDate: '2025-07-15',
      checkOutDate: '2025-07-17',
      price: 1088,
      amenities: ['WiFi', '空调', '电视', '独立卫浴', '迷你吧', '景观阳台', '客厅', '按摩浴缸', '浪漫装饰'],
      cleaningStatus: 'clean',
      maintenanceStatus: 'normal',
      lastCleaned: '2025-07-15 12:00',
      nextCleaning: '2025-07-16 10:00',
    },
    {
      id: '20',
      roomNumber: '701',
      type: '蜜月套房',
      floor: 7,
      status: 'occupied',
      guestName: '吴先生',
      checkInDate: '2025-07-15',
      checkOutDate: '2025-07-17',
      price: 1088,
      amenities: ['WiFi', '空调', '电视', '独立卫浴', '迷你吧', '景观阳台', '客厅', '按摩浴缸', '浪漫装饰'],
      cleaningStatus: 'clean',
      maintenanceStatus: 'normal',
      lastCleaned: '2025-07-15 12:00',
      nextCleaning: '2025-07-16 10:00',
    },
    {
      id: '20',
      roomNumber: '701',
      type: '蜜月套房',
      floor: 7,
      status: 'occupied',
      guestName: '吴先生',
      checkInDate: '2025-07-15',
      checkOutDate: '2025-07-17',
      price: 1088,
      amenities: ['WiFi', '空调', '电视', '独立卫浴', '迷你吧', '景观阳台', '客厅', '按摩浴缸', '浪漫装饰'],
      cleaningStatus: 'clean',
      maintenanceStatus: 'normal',
      lastCleaned: '2025-07-15 12:00',
      nextCleaning: '2025-07-16 10:00',
    },
    {
      id: '20',
      roomNumber: '701',
      type: '蜜月套房',
      floor: 7,
      status: 'occupied',
      guestName: '吴先生',
      checkInDate: '2025-07-15',
      checkOutDate: '2025-07-17',
      price: 1088,
      amenities: ['WiFi', '空调', '电视', '独立卫浴', '迷你吧', '景观阳台', '客厅', '按摩浴缸', '浪漫装饰'],
      cleaningStatus: 'clean',
      maintenanceStatus: 'normal',
      lastCleaned: '2025-07-15 12:00',
      nextCleaning: '2025-07-16 10:00',
    },
    {
      id: '20',
      roomNumber: '701',
      type: '蜜月套房',
      floor: 7,
      status: 'occupied',
      guestName: '吴先生',
      checkInDate: '2025-07-15',
      checkOutDate: '2025-07-17',
      price: 1088,
      amenities: ['WiFi', '空调', '电视', '独立卫浴', '迷你吧', '景观阳台', '客厅', '按摩浴缸', '浪漫装饰'],
      cleaningStatus: 'clean',
      maintenanceStatus: 'normal',
      lastCleaned: '2025-07-15 12:00',
      nextCleaning: '2025-07-16 10:00',
    },
    {
      id: '20',
      roomNumber: '701',
      type: '蜜月套房',
      floor: 7,
      status: 'occupied',
      guestName: '吴先生',
      checkInDate: '2025-07-15',
      checkOutDate: '2025-07-17',
      price: 1088,
      amenities: ['WiFi', '空调', '电视', '独立卫浴', '迷你吧', '景观阳台', '客厅', '按摩浴缸', '浪漫装饰'],
      cleaningStatus: 'clean',
      maintenanceStatus: 'normal',
      lastCleaned: '2025-07-15 12:00',
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
    {
      id: '4',
      roomNumber: '205',
      guestName: '郑先生',
      phone: '13900139004',
      checkInDate: '2025-07-18',
      checkOutDate: '2025-07-21',
      status: 'confirmed',
      totalAmount: 1164,
      deposit: 250,
      specialRequests: '需要加床',
    },
    {
      id: '5',
      roomNumber: '502',
      guestName: '马女士',
      phone: '13900139005',
      checkInDate: '2025-07-20',
      checkOutDate: '2025-07-25',
      status: 'pending',
      totalAmount: 4440,
      deposit: 0,
      specialRequests: '商务出差，需要安静环境',
    },
    {
      id: '6',
      roomNumber: '701',
      guestName: '黄先生',
      phone: '13900139006',
      checkInDate: '2025-07-22',
      checkOutDate: '2025-07-24',
      status: 'confirmed',
      totalAmount: 2176,
      deposit: 500,
      specialRequests: '蜜月旅行，需要浪漫装饰',
    },
    {
      id: '7',
      roomNumber: '104',
      guestName: '林女士',
      phone: '13900139007',
      checkInDate: '2025-07-19',
      checkOutDate: '2025-07-21',
      status: 'cancelled',
      totalAmount: 576,
      deposit: 0,
    },
    {
      id: '8',
      roomNumber: '601',
      guestName: '周先生',
      phone: '13900139008',
      checkInDate: '2025-07-20',
      checkOutDate: '2025-07-23',
      status: 'confirmed',
      totalAmount: 2964,
      deposit: 400,
      specialRequests: '家庭旅行，需要儿童设施',
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
        <Space size="small" wrap>
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
            onClick={() => handleDeleteRoom(record.id)}
          >
            删除
          </Button>
          {record.status === 'vacant' && (
            <Button
              type="link"
              size="small"
              icon={<CalendarOutlined />}
              onClick={() => handleBooking(record)}
            >
              预订
            </Button>
          )}
          {record.status === 'reserved' && (
            <Button
              type="link"
              size="small"
              icon={<KeyOutlined />}
              onClick={() => handleCheckIn(record)}
            >
              入住
            </Button>
          )}
          {record.status === 'occupied' && (
            <Button
              type="link"
              size="small"
              icon={<KeyOutlined />}
              onClick={() => handleCheckOut(record)}
            >
              退房
            </Button>
          )}
          {record.cleaningStatus === 'dirty' && (
            <Button
              type="link"
              size="small"
              icon={<ClearOutlined />}
              onClick={() => handleStartCleaning(record)}
            >
              开始清洁
            </Button>
          )}
          {record.cleaningStatus === 'cleaning' && (
            <Button
              type="link"
              size="small"
              icon={<CheckCircleOutlined />}
              onClick={() => handleFinishCleaning(record)}
            >
              完成清洁
            </Button>
          )}
          {record.maintenanceStatus !== 'normal' && record.status !== 'maintenance' && (
            <Button
              type="link"
              size="small"
              icon={<ToolOutlined />}
              onClick={() => handleStartMaintenance(record)}
            >
              开始维护
            </Button>
          )}
          {record.status === 'maintenance' && (
            <Button
              type="link"
              size="small"
              icon={<CheckCircleOutlined />}
              onClick={() => handleFinishMaintenance(record)}
            >
              完成维护
            </Button>
          )}
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
    // 实现编辑预订功能
    message.info('编辑预订功能开发中...');
  };

  const handleCancelBooking = (record: Booking) => {
    Modal.confirm({
      title: '确认取消预订',
      content: `确定要取消 ${record.guestName} 的预订吗？`,
      onOk: () => {
        setBookingList(bookingList.filter(b => b.id !== record.id));
        message.success('预订已取消');
      },
    });
  };

  const handleExport = () => {
    message.success('房间数据导出成功');
  };

  const handleImport = () => {
    message.info('房间数据导入功能开发中...');
  };

  const handleAddRoom = () => {
    setCurrentRoom(null);
    setAddModalVisible(true);
  };

  const handleSaveRoom = (values: any) => {
    if (currentRoom) {
      // 编辑房间
      setRoomList(roomList.map(room => 
        room.id === currentRoom.id ? { ...room, ...values } : room
      ));
      message.success('房间信息更新成功');
    } else {
      // 添加房间
      const newRoom: Room = {
        id: `room${Date.now()}`,
        ...values,
        status: 'vacant',
        cleaningStatus: 'clean',
        maintenanceStatus: 'normal',
        lastCleaned: new Date().toLocaleString(),
        nextCleaning: new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleString(),
      };
      setRoomList([...roomList, newRoom]);
      message.success('房间添加成功');
    }
    setAddModalVisible(false);
    setEditModalVisible(false);
  };

  const handleSaveBooking = (values: any) => {
    const newBooking: Booking = {
      id: `booking${Date.now()}`,
      ...values,
      status: 'confirmed',
      totalAmount: values.totalAmount || 0,
      deposit: values.deposit || 0,
    };
    setBookingList([...bookingList, newBooking]);
    
    // 更新房间状态为已预订
    if (currentRoom) {
      setRoomList(roomList.map(room => 
        room.roomNumber === currentRoom.roomNumber 
          ? { ...room, status: 'reserved', guestName: values.guestName }
          : room
      ));
    }
    
    message.success('预订创建成功');
    setBookingModalVisible(false);
  };

  const handleDeleteRoom = (roomId: string) => {
    Modal.confirm({
      title: '确认删除房间',
      content: '确定要删除该房间吗？此操作不可恢复。',
      onOk: () => {
        setRoomList(roomList.filter(room => room.id !== roomId));
        message.success('房间删除成功');
      },
    });
  };

  const handleCheckIn = (record: Room) => {
    Modal.confirm({
      title: '确认入住',
      content: `确定要为房间 ${record.roomNumber} 办理入住吗？`,
      onOk: () => {
        setRoomList(roomList.map(room => 
          room.id === record.id 
            ? { ...room, status: 'occupied' }
            : room
        ));
        message.success('入住办理成功');
      },
    });
  };

  const handleCheckOut = (record: Room) => {
    Modal.confirm({
      title: '确认退房',
      content: `确定要为房间 ${record.roomNumber} 办理退房吗？`,
      onOk: () => {
        setRoomList(roomList.map(room => 
          room.id === record.id 
            ? { 
                ...room, 
                status: 'cleaning', 
                guestName: undefined,
                checkInDate: undefined,
                checkOutDate: undefined,
                cleaningStatus: 'dirty'
              }
            : room
        ));
        message.success('退房办理成功');
      },
    });
  };

  const handleStartCleaning = (record: Room) => {
    setRoomList(roomList.map(room => 
      room.id === record.id 
        ? { ...room, cleaningStatus: 'cleaning' }
        : room
    ));
    message.success('开始清洁房间');
  };

  const handleFinishCleaning = (record: Room) => {
    setRoomList(roomList.map(room => 
      room.id === record.id 
        ? { 
            ...room, 
            cleaningStatus: 'clean',
            status: room.status === 'cleaning' ? 'vacant' : room.status,
            lastCleaned: new Date().toLocaleString(),
            nextCleaning: new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleString()
          }
        : room
    ));
    message.success('房间清洁完成');
  };

  const handleStartMaintenance = (record: Room) => {
    setRoomList(roomList.map(room => 
      room.id === record.id 
        ? { ...room, status: 'maintenance' }
        : room
    ));
    message.success('开始维护房间');
  };

  const handleFinishMaintenance = (record: Room) => {
    setRoomList(roomList.map(room => 
      room.id === record.id 
        ? { 
            ...room, 
            status: 'vacant',
            maintenanceStatus: 'normal'
          }
        : room
    ));
    message.success('房间维护完成');
  };

  // 统计数据
  const statistics = {
    totalRooms: roomList.length,
    occupiedRooms: roomList.filter(room => room.status === 'occupied').length,
    vacantRooms: roomList.filter(room => room.status === 'vacant').length,
    cleaningRooms: roomList.filter(room => room.status === 'cleaning').length,
    maintenanceRooms: roomList.filter(room => room.status === 'maintenance').length,
    reservedRooms: roomList.filter(room => room.status === 'reserved').length,
    dirtyRooms: roomList.filter(room => room.cleaningStatus === 'dirty').length,
    cleaningInProgress: roomList.filter(room => room.cleaningStatus === 'cleaning').length,
    cleanRooms: roomList.filter(room => room.cleaningStatus === 'clean').length,
    totalBookings: bookingList.length,
    confirmedBookings: bookingList.filter(booking => booking.status === 'confirmed').length,
    pendingBookings: bookingList.filter(booking => booking.status === 'pending').length,
    cancelledBookings: bookingList.filter(booking => booking.status === 'cancelled').length,
    occupancyRate: roomList.length > 0 ? Math.round((roomList.filter(room => room.status === 'occupied').length / roomList.length) * 100) : 0,
    revenue: roomList.filter(room => room.status === 'occupied').reduce((sum, room) => sum + room.price, 0),
  };

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
              value={statistics.totalRooms}
              prefix={<HomeOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={4}>
          <Card>
            <Statistic
              title="已入住"
              value={statistics.occupiedRooms}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={4}>
          <Card>
            <Statistic
              title="空闲房间"
              value={statistics.vacantRooms}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={4}>
          <Card>
            <Statistic
              title="清洁中"
              value={statistics.cleaningInProgress}
              prefix={<ClearOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={4}>
          <Card>
            <Statistic
              title="维护中"
              value={statistics.maintenanceRooms}
              prefix={<ToolOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={4}>
          <Card>
            <Statistic
              title="入住率"
              value={statistics.occupancyRate}
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
                <Button type="primary" icon={<CalendarOutlined />} onClick={handleAddRoom}>
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
        footer={[
          <Button key="close" onClick={() => setDetailsModalVisible(false)}>
            关闭
          </Button>,
        ]}
        width={800}
      >
        {currentRoom && (
          <div>
            <Row gutter={24}>
              <Col span={12}>
                <Card title="基本信息" size="small">
                  <Descriptions column={1} size="small">
                    <Descriptions.Item label="房间号">
                      <Text strong>{currentRoom.roomNumber}</Text>
                    </Descriptions.Item>
                    <Descriptions.Item label="房间类型">
                      <Tag color="blue">{currentRoom.type}</Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="楼层">
                      {currentRoom.floor}层
                    </Descriptions.Item>
                    <Descriptions.Item label="价格">
                      ¥{currentRoom.price}/晚
                    </Descriptions.Item>
                    <Descriptions.Item label="房间状态">
                      <Badge
                        status={getStatusColor(currentRoom.status) as any}
                        text={getStatusText(currentRoom.status)}
                      />
                    </Descriptions.Item>
                  </Descriptions>
                </Card>
              </Col>
              <Col span={12}>
                <Card title="清洁维护" size="small">
                  <Descriptions column={1} size="small">
                    <Descriptions.Item label="清洁状态">
                      <Badge
                        status={getStatusColor(currentRoom.cleaningStatus) as any}
                        text={getStatusText(currentRoom.cleaningStatus)}
                      />
                    </Descriptions.Item>
                    <Descriptions.Item label="维护状态">
                      <Badge
                        status={getStatusColor(currentRoom.maintenanceStatus) as any}
                        text={getStatusText(currentRoom.maintenanceStatus)}
                      />
                    </Descriptions.Item>
                    <Descriptions.Item label="最后清洁">
                      {currentRoom.lastCleaned}
                    </Descriptions.Item>
                    <Descriptions.Item label="下次清洁">
                      {currentRoom.nextCleaning}
                    </Descriptions.Item>
                  </Descriptions>
                </Card>
              </Col>
            </Row>
            
            {currentRoom.guestName && (
              <Card title="客人信息" size="small" style={{ marginTop: 16 }}>
                <Descriptions column={2} size="small">
                  <Descriptions.Item label="客人姓名">
                    <Text strong>{currentRoom.guestName}</Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="入住日期">
                    {currentRoom.checkInDate}
                  </Descriptions.Item>
                  <Descriptions.Item label="退房日期">
                    {currentRoom.checkOutDate}
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            )}
            
            <Card title="房间设施" size="small" style={{ marginTop: 16 }}>
              <div>
                {currentRoom.amenities.map((amenity, index) => (
                  <Tag key={index} color="green" style={{ marginBottom: 8 }}>
                    {amenity}
                  </Tag>
                ))}
              </div>
            </Card>
            
            <Card title="操作历史" size="small" style={{ marginTop: 16 }}>
              <List
                size="small"
                dataSource={[
                  { time: currentRoom.lastCleaned, action: '房间清洁完成' },
                  { time: '2025-07-14 10:00', action: '客人入住' },
                  { time: '2025-07-13 15:30', action: '房间预订确认' },
                  { time: '2025-07-13 09:00', action: '房间检查完成' },
                ]}
                renderItem={(item) => (
                  <List.Item>
                    <Space>
                      <ClockCircleOutlined style={{ color: '#999' }} />
                      <Text type="secondary">{item.time}</Text>
                      <Text>{item.action}</Text>
                    </Space>
                  </List.Item>
                )}
              />
            </Card>
          </div>
        )}
      </Modal>

      {/* 编辑房间模态框 */}
      <Modal
        title={currentRoom ? "编辑房间" : "新增房间"}
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        onOk={() => handleSaveRoom(currentRoom ? currentRoom : {})}
        width={600}
      >
        <Form layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="房间号" rules={[{ required: true, message: '请输入房间号' }]}>
                <Input 
                  defaultValue={currentRoom?.roomNumber} 
                  onChange={(e) => setCurrentRoom(prev => prev ? { ...prev, roomNumber: e.target.value } : null)}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="房间类型" rules={[{ required: true, message: '请选择房间类型' }]}>
                <Select 
                  defaultValue={currentRoom?.type} 
                  onChange={(value) => setCurrentRoom(prev => prev ? { ...prev, type: value } : null)}
                >
                  <Option value="标准间">标准间</Option>
                  <Option value="豪华间">豪华间</Option>
                  <Option value="套房">套房</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="楼层" rules={[{ required: true, message: '请输入楼层' }]}>
                <Input 
                  type="number" 
                  defaultValue={currentRoom?.floor} 
                  onChange={(e) => setCurrentRoom(prev => prev ? { ...prev, floor: parseInt(e.target.value, 10) } : null)}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="价格" rules={[{ required: true, message: '请输入价格' }]}>
                <Input 
                  type="number" 
                  defaultValue={currentRoom?.price} 
                  onChange={(e) => setCurrentRoom(prev => prev ? { ...prev, price: parseFloat(e.target.value) } : null)}
                />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="状态" rules={[{ required: true, message: '请选择房间状态' }]}>
            <Select 
              defaultValue={currentRoom?.status} 
              onChange={(value) => setCurrentRoom(prev => prev ? { ...prev, status: value } : null)}
            >
              <Option value="vacant">空闲</Option>
              <Option value="occupied">已入住</Option>
              <Option value="cleaning">清洁中</Option>
              <Option value="maintenance">维护中</Option>
              <Option value="reserved">已预订</Option>
            </Select>
          </Form.Item>
          <Form.Item label="清洁状态" rules={[{ required: true, message: '请选择清洁状态' }]}>
            <Select 
              defaultValue={currentRoom?.cleaningStatus} 
              onChange={(value) => setCurrentRoom(prev => prev ? { ...prev, cleaningStatus: value } : null)}
            >
              <Option value="clean">清洁</Option>
              <Option value="dirty">待清洁</Option>
              <Option value="cleaning">清洁中</Option>
            </Select>
          </Form.Item>
          <Form.Item label="维护状态" rules={[{ required: true, message: '请选择维护状态' }]}>
            <Select 
              defaultValue={currentRoom?.maintenanceStatus} 
              onChange={(value) => setCurrentRoom(prev => prev ? { ...prev, maintenanceStatus: value } : null)}
            >
              <Option value="normal">正常</Option>
              <Option value="minor">轻微</Option>
              <Option value="major">严重</Option>
            </Select>
          </Form.Item>
                     <Form.Item label="最后清洁时间" rules={[{ required: true, message: '请选择最后清洁时间' }]}>
             <DatePicker 
               style={{ width: '100%' }} 
               defaultValue={currentRoom?.lastCleaned ? dayjs(currentRoom.lastCleaned) : null}
               onChange={(date) => setCurrentRoom(prev => prev ? { ...prev, lastCleaned: date?.toISOString() } : null)}
             />
           </Form.Item>
           <Form.Item label="下次清洁时间" rules={[{ required: true, message: '请选择下次清洁时间' }]}>
             <DatePicker 
               style={{ width: '100%' }} 
               defaultValue={currentRoom?.nextCleaning ? dayjs(currentRoom.nextCleaning) : null}
               onChange={(date) => setCurrentRoom(prev => prev ? { ...prev, nextCleaning: date?.toISOString() } : null)}
             />
           </Form.Item>
          <Form.Item label="设施" rules={[{ required: true, message: '请至少选择一个设施' }]}>
            <Select
              mode="multiple"
              placeholder="请选择设施"
              defaultValue={currentRoom?.amenities}
              onChange={(values) => setCurrentRoom(prev => prev ? { ...prev, amenities: values } : null)}
            >
              <Option value="WiFi">WiFi</Option>
              <Option value="空调">空调</Option>
              <Option value="电视">电视</Option>
              <Option value="独立卫浴">独立卫浴</Option>
              <Option value="迷你吧">迷你吧</Option>
              <Option value="景观阳台">景观阳台</Option>
              <Option value="客厅">客厅</Option>
              <Option value="厨房">厨房</Option>
              <Option value="会议室">会议室</Option>
              <Option value="健身房">健身房</Option>
              <Option value="儿童房">儿童房</Option>
              <Option value="游戏区">游戏区</Option>
              <Option value="按摩浴缸">按摩浴缸</Option>
              <Option value="浪漫装饰">浪漫装饰</Option>
              <Option value="办公桌">办公桌</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* 预订房间模态框 */}
      <Modal
        title="预订房间"
        open={bookingModalVisible}
        onCancel={() => setBookingModalVisible(false)}
        onOk={() => handleSaveBooking(currentRoom ? currentRoom : {})}
        width={600}
      >
        <Form layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="房间号" rules={[{ required: true, message: '请选择房间' }]}>
                <Input 
                  value={currentRoom?.roomNumber} 
                  disabled 
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="房间类型" rules={[{ required: true, message: '请选择房间类型' }]}>
                <Input 
                  value={currentRoom?.type} 
                  disabled 
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="客人姓名" rules={[{ required: true, message: '请输入客人姓名' }]}>
                <Input 
                  placeholder="请输入客人姓名" 
                  onChange={(e) => setCurrentRoom(prev => prev ? { ...prev, guestName: e.target.value } : null)}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="联系电话" rules={[{ required: true, message: '请输入联系电话' }]}>
                <Input 
                  placeholder="请输入联系电话" 
                  onChange={(e) => setCurrentRoom(prev => prev ? { ...prev, phone: e.target.value } : null)}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="入住日期" rules={[{ required: true, message: '请选择入住日期' }]}>
                <DatePicker 
                  style={{ width: '100%' }} 
                  onChange={(date) => setCurrentRoom(prev => prev ? { ...prev, checkInDate: date?.toISOString() } : null)}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="退房日期" rules={[{ required: true, message: '请选择退房日期' }]}>
                <DatePicker 
                  style={{ width: '100%' }} 
                  onChange={(date) => setCurrentRoom(prev => prev ? { ...prev, checkOutDate: date?.toISOString() } : null)}
                />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="特殊要求">
            <Input.TextArea 
              rows={3} 
              placeholder="请输入特殊要求" 
              onChange={(e) => setCurrentRoom(prev => prev ? { ...prev, specialRequests: e.target.value } : null)}
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* 新增房间模态框 */}
      <Modal
        title="新增房间"
        open={addModalVisible}
        onCancel={() => setAddModalVisible(false)}
        onOk={() => handleSaveRoom({})}
        width={600}
      >
        <Form layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="房间号" rules={[{ required: true, message: '请输入房间号' }]}>
                <Input placeholder="请输入房间号" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="房间类型" rules={[{ required: true, message: '请选择房间类型' }]}>
                <Select placeholder="请选择房间类型">
                  <Option value="标准间">标准间</Option>
                  <Option value="豪华间">豪华间</Option>
                  <Option value="套房">套房</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="楼层" rules={[{ required: true, message: '请输入楼层' }]}>
                <Input type="number" placeholder="请输入楼层" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="价格" rules={[{ required: true, message: '请输入价格' }]}>
                <Input type="number" placeholder="请输入价格" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="状态" rules={[{ required: true, message: '请选择房间状态' }]}>
            <Select placeholder="请选择房间状态">
              <Option value="vacant">空闲</Option>
              <Option value="occupied">已入住</Option>
              <Option value="cleaning">清洁中</Option>
              <Option value="maintenance">维护中</Option>
              <Option value="reserved">已预订</Option>
            </Select>
          </Form.Item>
          <Form.Item label="清洁状态" rules={[{ required: true, message: '请选择清洁状态' }]}>
            <Select placeholder="请选择清洁状态">
              <Option value="clean">清洁</Option>
              <Option value="dirty">待清洁</Option>
              <Option value="cleaning">清洁中</Option>
            </Select>
          </Form.Item>
          <Form.Item label="维护状态" rules={[{ required: true, message: '请选择维护状态' }]}>
            <Select placeholder="请选择维护状态">
              <Option value="normal">正常</Option>
              <Option value="minor">轻微</Option>
              <Option value="major">严重</Option>
            </Select>
          </Form.Item>
          <Form.Item label="最后清洁时间" rules={[{ required: true, message: '请选择最后清洁时间' }]}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label="下次清洁时间" rules={[{ required: true, message: '请选择下次清洁时间' }]}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label="设施" rules={[{ required: true, message: '请至少选择一个设施' }]}>
            <Select
              mode="multiple"
              placeholder="请选择设施"
            >
              <Option value="WiFi">WiFi</Option>
              <Option value="空调">空调</Option>
              <Option value="电视">电视</Option>
              <Option value="独立卫浴">独立卫浴</Option>
              <Option value="迷你吧">迷你吧</Option>
              <Option value="景观阳台">景观阳台</Option>
              <Option value="客厅">客厅</Option>
              <Option value="厨房">厨房</Option>
              <Option value="会议室">会议室</Option>
              <Option value="健身房">健身房</Option>
              <Option value="儿童房">儿童房</Option>
              <Option value="游戏区">游戏区</Option>
              <Option value="按摩浴缸">按摩浴缸</Option>
              <Option value="浪漫装饰">浪漫装饰</Option>
              <Option value="办公桌">办公桌</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default RoomManagement; 