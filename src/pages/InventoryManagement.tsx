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
  Alert,
  InputNumber,
  Upload,
} from 'antd';
import {
  DatabaseOutlined,
  PlusOutlined,
  MinusOutlined,
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
  ShoppingCartOutlined,
  TruckOutlined,
  WarningOutlined,
  FileTextOutlined,
  BarChartOutlined,
  ReloadOutlined,
  UploadOutlined,
  StarOutlined,
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;
const { Option } = Select;
const { TextArea } = Input;

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  sku: string;
  barcode: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  unit: string;
  price: number;
  supplier: string;
  location: string;
  status: 'normal' | 'low' | 'out' | 'overstock';
  lastUpdated: string;
  expiryDate?: string;
  description: string;
}

interface Transaction {
  id: string;
  type: 'in' | 'out' | 'adjustment';
  itemId: string;
  itemName: string;
  quantity: number;
  unit: string;
  price: number;
  totalAmount: number;
  operator: string;
  date: string;
  reference: string;
  notes?: string;
}

interface Supplier {
  id: string;
  name: string;
  contact: string;
  phone: string;
  email: string;
  address: string;
  category: string;
  status: 'active' | 'inactive';
  rating: number;
  lastOrder: string;
  totalOrders: number;
}

const InventoryManagement: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [inModalVisible, setInModalVisible] = useState(false);
  const [outModalVisible, setOutModalVisible] = useState(false);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [currentItem, setCurrentItem] = useState<InventoryItem | null>(null);
  const [activeTab, setActiveTab] = useState('inventory');

  // 模拟数据
  const mockInventoryItems: InventoryItem[] = [
    {
      id: '1',
      name: '毛巾',
      category: '客房用品',
      sku: 'TOWEL-001',
      barcode: '1234567890123',
      currentStock: 150,
      minStock: 50,
      maxStock: 300,
      unit: '条',
      price: 15.5,
      supplier: '优质纺织品有限公司',
      location: 'A区-01-01',
      status: 'normal',
      lastUpdated: '2025-07-15 10:30',
      description: '白色纯棉毛巾，尺寸70x140cm',
    },
    {
      id: '2',
      name: '洗发水',
      category: '洗护用品',
      sku: 'SHAMPOO-001',
      barcode: '1234567890124',
      currentStock: 25,
      minStock: 30,
      maxStock: 100,
      unit: '瓶',
      price: 8.5,
      supplier: '清洁用品供应商',
      location: 'B区-02-03',
      status: 'low',
      lastUpdated: '2025-07-15 09:15',
      expiryDate: '2025-06-30',
      description: '500ml洗发水，适合所有发质',
    },
    {
      id: '3',
      name: '床单',
      category: '客房用品',
      sku: 'SHEET-001',
      barcode: '1234567890125',
      currentStock: 0,
      minStock: 20,
      maxStock: 80,
      unit: '套',
      price: 45.0,
      supplier: '优质纺织品有限公司',
      location: 'A区-01-02',
      status: 'out',
      lastUpdated: '2025-07-14 16:45',
      description: '纯棉床单，尺寸1.8x2.0m',
    },
    {
      id: '4',
      name: '咖啡豆',
      category: '餐饮用品',
      sku: 'COFFEE-001',
      barcode: '1234567890126',
      currentStock: 120,
      minStock: 50,
      maxStock: 100,
      unit: 'kg',
      price: 35.0,
      supplier: '咖啡供应商',
      location: 'C区-03-01',
      status: 'overstock',
      lastUpdated: '2025-07-15 11:20',
      expiryDate: '2024-12-31',
      description: '阿拉比卡咖啡豆，中度烘焙',
    },
    {
      id: '5',
      name: '清洁剂',
      category: '清洁用品',
      sku: 'CLEANER-001',
      barcode: '1234567890127',
      currentStock: 45,
      minStock: 40,
      maxStock: 120,
      unit: '瓶',
      price: 12.5,
      supplier: '清洁用品供应商',
      location: 'B区-02-01',
      status: 'normal',
      lastUpdated: '2025-07-15 08:30',
      description: '多功能清洁剂，1L装',
    },
    {
      id: '6',
      name: '一次性牙刷',
      category: '客房用品',
      sku: 'TOOTHBRUSH-001',
      barcode: '1234567890128',
      currentStock: 200,
      minStock: 100,
      maxStock: 500,
      unit: '支',
      price: 2.5,
      supplier: '日用品供应商',
      location: 'A区-01-03',
      status: 'normal',
      lastUpdated: '2025-07-15 14:15',
      description: '软毛牙刷，独立包装',
    },
  ];

  const mockTransactions: Transaction[] = [
    {
      id: '1',
      type: 'in',
      itemId: '1',
      itemName: '毛巾',
      quantity: 50,
      unit: '条',
      price: 15.5,
      totalAmount: 775,
      operator: '张库管',
      date: '2025-07-15 10:30',
      reference: 'PO-2024-001',
      notes: '正常补货',
    },
    {
      id: '2',
      type: 'out',
      itemId: '2',
      itemName: '洗发水',
      quantity: 10,
      unit: '瓶',
      price: 8.5,
      totalAmount: 85,
      operator: '李服务员',
      date: '2025-07-15 09:15',
      reference: 'REQ-2024-001',
      notes: '客房补充',
    },
    {
      id: '3',
      type: 'out',
      itemId: '3',
      itemName: '床单',
      quantity: 15,
      unit: '套',
      price: 45.0,
      totalAmount: 675,
      operator: '王客房',
      date: '2025-07-14 16:45',
      reference: 'REQ-2024-002',
      notes: '客房更换',
    },
    {
      id: '4',
      type: 'in',
      itemId: '4',
      itemName: '咖啡豆',
      quantity: 80,
      unit: 'kg',
      price: 35.0,
      totalAmount: 2800,
      operator: '张库管',
      date: '2025-07-15 11:20',
      reference: 'PO-2024-002',
      notes: '大批量采购',
    },
  ];

  const mockSuppliers: Supplier[] = [
    {
      id: '1',
      name: '优质纺织品有限公司',
      contact: '陈经理',
      phone: '0537-12345678',
      email: 'chen@textile.com',
      address: '山东省济宁市邹城市纺织工业园',
      category: '纺织品',
      status: 'active',
      rating: 4.8,
      lastOrder: '2025-07-15',
      totalOrders: 45,
    },
    {
      id: '2',
      name: '清洁用品供应商',
      contact: '李总',
      phone: '0537-87654321',
      email: 'li@clean.com',
      address: '山东省济宁市邹城市化工园区',
      category: '清洁用品',
      status: 'active',
      rating: 4.5,
      lastOrder: '2025-07-14',
      totalOrders: 32,
    },
    {
      id: '3',
      name: '咖啡供应商',
      contact: '王经理',
      phone: '0537-11223344',
      email: 'wang@coffee.com',
      address: '山东省济宁市邹城市食品工业园',
      category: '食品',
      status: 'active',
      rating: 4.7,
      lastOrder: '2025-07-15',
      totalOrders: 28,
    },
    {
      id: '4',
      name: '日用品供应商',
      contact: '赵总',
      phone: '0537-55667788',
      email: 'zhao@daily.com',
      address: '山东省济宁市邹城市轻工业园',
      category: '日用品',
      status: 'inactive',
      rating: 4.2,
      lastOrder: '2025-07-10',
      totalOrders: 15,
    },
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setLoading(true);
    // 模拟API调用
    setTimeout(() => {
      setInventoryItems(mockInventoryItems);
      setTransactions(mockTransactions);
      setSuppliers(mockSuppliers);
      setLoading(false);
    }, 1000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal':
      case 'active':
        return 'green';
      case 'low':
        return 'orange';
      case 'out':
      case 'inactive':
        return 'red';
      case 'overstock':
        return 'purple';
      case 'in':
        return 'blue';
      case 'out':
        return 'red';
      case 'adjustment':
        return 'gold';
      default:
        return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'normal':
        return '正常';
      case 'low':
        return '库存不足';
      case 'out':
        return '缺货';
      case 'overstock':
        return '库存过多';
      case 'active':
        return '活跃';
      case 'inactive':
        return '停用';
      case 'in':
        return '入库';
      case 'adjustment':
        return '调整';
      default:
        return '未知';
    }
  };

  const inventoryColumns = [
    {
      title: '商品信息',
      key: 'info',
      render: (_: any, record: InventoryItem) => (
        <Space direction="vertical" size="small">
          <div>
            <Text strong>{record.name}</Text>
            <Tag color="blue" style={{ marginLeft: 8 }}>{record.category}</Tag>
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            SKU: {record.sku} | 条码: {record.barcode}
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            位置: {record.location}
          </div>
        </Space>
      ),
    },
    {
      title: '库存状态',
      key: 'stock',
      render: (_: any, record: InventoryItem) => (
        <Space direction="vertical" size="small">
          <div>
            <Text strong style={{ fontSize: '16px' }}>
              {record.currentStock} {record.unit}
            </Text>
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            最小: {record.minStock} | 最大: {record.maxStock}
          </div>
          <Progress
            percent={Math.round((record.currentStock / record.maxStock) * 100)}
            size="small"
            status={record.status === 'low' ? 'exception' : record.status === 'out' ? 'exception' : 'normal'}
          />
        </Space>
      ),
    },
    {
      title: '状态',
      key: 'status',
      render: (_: any, record: InventoryItem) => (
        <Space direction="vertical" size="small">
          <Badge
            status={getStatusColor(record.status) as any}
            text={getStatusText(record.status)}
          />
          {record.expiryDate && (
            <div style={{ fontSize: '12px', color: '#666' }}>
              过期: {record.expiryDate}
            </div>
          )}
        </Space>
      ),
    },
    {
      title: '价格信息',
      key: 'price',
      render: (_: any, record: InventoryItem) => (
        <Space direction="vertical" size="small">
          <div>
            <Text strong style={{ color: '#1890ff' }}>
              ¥{record.price.toFixed(2)}
            </Text>
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            总价值: ¥{(record.currentStock * record.price).toFixed(2)}
          </div>
        </Space>
      ),
    },
    {
      title: '供应商',
      key: 'supplier',
      render: (_: any, record: InventoryItem) => (
        <Text>{record.supplier}</Text>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: InventoryItem) => (
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
            icon={<PlusOutlined />}
            onClick={() => handleInStock(record)}
          >
            入库
          </Button>
          <Button
            type="link"
            size="small"
            icon={<MinusOutlined />}
            onClick={() => handleOutStock(record)}
          >
            出库
          </Button>
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
        </Space>
      ),
    },
  ];

  const transactionColumns = [
    {
      title: '交易信息',
      key: 'transaction',
      render: (_: any, record: Transaction) => (
        <Space direction="vertical" size="small">
          <div>
            <Text strong>{record.itemName}</Text>
            <Tag color={getStatusColor(record.type)} style={{ marginLeft: 8 }}>
              {getStatusText(record.type)}
            </Tag>
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            数量: {record.quantity} {record.unit}
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            参考号: {record.reference}
          </div>
        </Space>
      ),
    },
    {
      title: '金额',
      key: 'amount',
      render: (_: any, record: Transaction) => (
        <Space direction="vertical" size="small">
          <div>
            <Text strong style={{ color: '#1890ff' }}>
              ¥{record.totalAmount.toFixed(2)}
            </Text>
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            单价: ¥{record.price.toFixed(2)}
          </div>
        </Space>
      ),
    },
    {
      title: '操作员',
      key: 'operator',
      render: (_: any, record: Transaction) => (
        <Text>{record.operator}</Text>
      ),
    },
    {
      title: '时间',
      key: 'date',
      render: (_: any, record: Transaction) => (
        <Text>{record.date}</Text>
      ),
    },
    {
      title: '备注',
      key: 'notes',
      render: (_: any, record: Transaction) => (
        <Text type="secondary">{record.notes || '-'}</Text>
      ),
    },
  ];

  const supplierColumns = [
    {
      title: '供应商信息',
      key: 'info',
      render: (_: any, record: Supplier) => (
        <Space direction="vertical" size="small">
          <div>
            <Text strong>{record.name}</Text>
            <Tag color="blue" style={{ marginLeft: 8 }}>{record.category}</Tag>
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            联系人: {record.contact}
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            {record.phone} | {record.email}
          </div>
        </Space>
      ),
    },
    {
      title: '状态',
      key: 'status',
      render: (_: any, record: Supplier) => (
        <Space direction="vertical" size="small">
          <Badge
            status={getStatusColor(record.status) as any}
            text={getStatusText(record.status)}
          />
          <div style={{ fontSize: '12px', color: '#666' }}>
            评分: <StarOutlined style={{ color: '#faad14' }} /> {record.rating}
          </div>
        </Space>
      ),
    },
    {
      title: '订单信息',
      key: 'orders',
      render: (_: any, record: Supplier) => (
        <Space direction="vertical" size="small">
          <div>总订单: {record.totalOrders}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            最后订单: {record.lastOrder}
          </div>
        </Space>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Supplier) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleViewSupplier(record)}
          >
            详情
          </Button>
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEditSupplier(record)}
          >
            编辑
          </Button>
        </Space>
      ),
    },
  ];

  const handleViewDetails = (record: InventoryItem) => {
    setCurrentItem(record);
    setDetailsModalVisible(true);
  };

  const handleEdit = (record: InventoryItem) => {
    setCurrentItem(record);
    setEditModalVisible(true);
  };

  const handleInStock = (record: InventoryItem) => {
    setCurrentItem(record);
    setInModalVisible(true);
  };

  const handleOutStock = (record: InventoryItem) => {
    setCurrentItem(record);
    setOutModalVisible(true);
  };

  const handleViewSupplier = (record: Supplier) => {
    message.info('查看供应商详情');
  };

  const handleEditSupplier = (record: Supplier) => {
    message.info('编辑供应商信息');
  };

  const handleExport = () => {
    message.success('数据导出成功');
  };

  const handleImport = () => {
    message.info('数据导入功能开发中...');
  };

  // 统计数据
  const totalItems = inventoryItems.length;
  const normalItems = inventoryItems.filter(item => item.status === 'normal').length;
  const lowItems = inventoryItems.filter(item => item.status === 'low').length;
  const outItems = inventoryItems.filter(item => item.status === 'out').length;
  const overstockItems = inventoryItems.filter(item => item.status === 'overstock').length;
  const totalValue = inventoryItems.reduce((sum, item) => sum + (item.currentStock * item.price), 0);
  const activeSuppliers = suppliers.filter(supplier => supplier.status === 'active').length;

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>
        <DatabaseOutlined style={{ marginRight: 8 }} />
        库存管理
      </Title>

      {/* 库存预警 */}
      {(lowItems > 0 || outItems > 0) && (
        <Alert
          message="库存预警"
          description={`有 ${lowItems} 个商品库存不足，${outItems} 个商品缺货，请及时补货！`}
          type="warning"
          showIcon
          style={{ marginBottom: 24 }}
          action={
            <Button size="small" type="link">
              查看详情
            </Button>
          }
        />
      )}

      {/* 统计卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={4}>
          <Card>
            <Statistic
              title="商品总数"
              value={totalItems}
              prefix={<DatabaseOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={4}>
          <Card>
            <Statistic
              title="库存正常"
              value={normalItems}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={4}>
          <Card>
            <Statistic
              title="库存不足"
              value={lowItems}
              prefix={<ExclamationCircleOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={4}>
          <Card>
            <Statistic
              title="缺货商品"
              value={outItems}
              prefix={<CloseCircleOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={4}>
          <Card>
            <Statistic
              title="库存总值"
              value={totalValue}
              prefix="¥"
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={4}>
          <Card>
            <Statistic
              title="活跃供应商"
              value={activeSuppliers}
              prefix={<ShoppingCartOutlined />}
              valueStyle={{ color: '#13c2c2' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 主要内容 */}
      <Card>
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="库存管理" key="inventory">
            <div style={{ marginBottom: 16 }}>
              <Space>
                <Button type="primary" icon={<PlusOutlined />}>
                  新增商品
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
                <Button icon={<ReloadOutlined />} onClick={loadData}>
                  刷新
                </Button>
              </Space>
            </div>
            <Table
              columns={inventoryColumns}
              dataSource={inventoryItems}
              rowKey="id"
              loading={loading}
              pagination={{
                total: inventoryItems.length,
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
              }}
            />
          </TabPane>
          
          <TabPane tab="出入库记录" key="transactions">
            <div style={{ marginBottom: 16 }}>
              <Space>
                <Button type="primary" icon={<PlusOutlined />}>
                  新增记录
                </Button>
                <Button icon={<ExportOutlined />}>
                  导出记录
                </Button>
                <Button icon={<SearchOutlined />}>
                  搜索记录
                </Button>
              </Space>
            </div>
            <Table
              columns={transactionColumns}
              dataSource={transactions}
              rowKey="id"
              loading={loading}
              pagination={{
                total: transactions.length,
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
              }}
            />
          </TabPane>

          <TabPane tab="供应商管理" key="suppliers">
            <div style={{ marginBottom: 16 }}>
              <Space>
                <Button type="primary" icon={<PlusOutlined />}>
                  新增供应商
                </Button>
                <Button icon={<ExportOutlined />}>
                  导出供应商
                </Button>
                <Button icon={<SearchOutlined />}>
                  搜索供应商
                </Button>
              </Space>
            </div>
            <Table
              columns={supplierColumns}
              dataSource={suppliers}
              rowKey="id"
              loading={loading}
              pagination={{
                total: suppliers.length,
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

      {/* 商品详情模态框 */}
      <Modal
        title="商品详情"
        open={detailsModalVisible}
        onCancel={() => setDetailsModalVisible(false)}
        footer={null}
        width={600}
      >
        {currentItem && (
          <Descriptions column={2} bordered>
            <Descriptions.Item label="商品名称">{currentItem.name}</Descriptions.Item>
            <Descriptions.Item label="商品分类">{currentItem.category}</Descriptions.Item>
            <Descriptions.Item label="SKU">{currentItem.sku}</Descriptions.Item>
            <Descriptions.Item label="条码">{currentItem.barcode}</Descriptions.Item>
            <Descriptions.Item label="当前库存">{currentItem.currentStock} {currentItem.unit}</Descriptions.Item>
            <Descriptions.Item label="库存状态">
              <Badge
                status={getStatusColor(currentItem.status) as any}
                text={getStatusText(currentItem.status)}
              />
            </Descriptions.Item>
            <Descriptions.Item label="最小库存">{currentItem.minStock} {currentItem.unit}</Descriptions.Item>
            <Descriptions.Item label="最大库存">{currentItem.maxStock} {currentItem.unit}</Descriptions.Item>
            <Descriptions.Item label="单价">¥{currentItem.price.toFixed(2)}</Descriptions.Item>
            <Descriptions.Item label="库存总值">¥{(currentItem.currentStock * currentItem.price).toFixed(2)}</Descriptions.Item>
            <Descriptions.Item label="供应商">{currentItem.supplier}</Descriptions.Item>
            <Descriptions.Item label="存储位置">{currentItem.location}</Descriptions.Item>
            {currentItem.expiryDate && (
              <Descriptions.Item label="过期日期">{currentItem.expiryDate}</Descriptions.Item>
            )}
            <Descriptions.Item label="最后更新">{currentItem.lastUpdated}</Descriptions.Item>
            <Descriptions.Item label="商品描述" span={2}>
              {currentItem.description}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>

      {/* 编辑商品模态框 */}
      <Modal
        title="编辑商品"
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        onOk={() => {
          message.success('商品信息更新成功');
          setEditModalVisible(false);
        }}
        width={600}
      >
        <Form layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="商品名称">
                <Input defaultValue={currentItem?.name} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="商品分类">
                <Select defaultValue={currentItem?.category}>
                  <Option value="客房用品">客房用品</Option>
                  <Option value="洗护用品">洗护用品</Option>
                  <Option value="餐饮用品">餐饮用品</Option>
                  <Option value="清洁用品">清洁用品</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="最小库存">
                <InputNumber style={{ width: '100%' }} defaultValue={currentItem?.minStock} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="最大库存">
                <InputNumber style={{ width: '100%' }} defaultValue={currentItem?.maxStock} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="单价">
                <InputNumber style={{ width: '100%' }} defaultValue={currentItem?.price} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="存储位置">
                <Input defaultValue={currentItem?.location} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="商品描述">
            <TextArea rows={3} defaultValue={currentItem?.description} />
          </Form.Item>
        </Form>
      </Modal>

      {/* 入库模态框 */}
      <Modal
        title="商品入库"
        open={inModalVisible}
        onCancel={() => setInModalVisible(false)}
        onOk={() => {
          message.success('入库成功');
          setInModalVisible(false);
        }}
        width={500}
      >
        <Form layout="vertical">
          <Form.Item label="商品名称">
            <Input value={currentItem?.name} disabled />
          </Form.Item>
          <Form.Item label="入库数量" required>
            <InputNumber style={{ width: '100%' }} min={1} />
          </Form.Item>
          <Form.Item label="入库价格">
            <InputNumber style={{ width: '100%' }} defaultValue={currentItem?.price} />
          </Form.Item>
          <Form.Item label="参考号">
            <Input placeholder="请输入采购单号或参考号" />
          </Form.Item>
          <Form.Item label="备注">
            <TextArea rows={3} placeholder="请输入备注信息" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 出库模态框 */}
      <Modal
        title="商品出库"
        open={outModalVisible}
        onCancel={() => setOutModalVisible(false)}
        onOk={() => {
          message.success('出库成功');
          setOutModalVisible(false);
        }}
        width={500}
      >
        <Form layout="vertical">
          <Form.Item label="商品名称">
            <Input value={currentItem?.name} disabled />
          </Form.Item>
          <Form.Item label="当前库存">
            <Input value={`${currentItem?.currentStock} ${currentItem?.unit}`} disabled />
          </Form.Item>
          <Form.Item label="出库数量" required>
            <InputNumber style={{ width: '100%' }} min={1} max={currentItem?.currentStock} />
          </Form.Item>
          <Form.Item label="参考号">
            <Input placeholder="请输入领用单号或参考号" />
          </Form.Item>
          <Form.Item label="备注">
            <TextArea rows={3} placeholder="请输入备注信息" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default InventoryManagement; 