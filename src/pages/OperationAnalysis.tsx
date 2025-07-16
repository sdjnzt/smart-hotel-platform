import React, { useState } from 'react';
import { Card, Row, Col, Statistic, Select, DatePicker, Space, Progress, Table, Tag } from 'antd';
import { BarChartOutlined, LineChartOutlined, TrophyOutlined, EnvironmentOutlined, ThunderboltOutlined, DollarOutlined } from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import { operationData, hotelRooms, hotelDevices, OperationData } from '../data/mockData';

const { Option } = Select;
const { RangePicker } = DatePicker;

const OperationAnalysisPage: React.FC = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState<string>('week');
  const [data] = useState<OperationData[]>(operationData);

  // 计算统计数据
  const latestData = data[data.length - 1];
  const avgOccupancyRate = data.reduce((sum, d) => sum + d.roomOccupancyRate, 0) / data.length;
  const totalEnergyConsumption = data.reduce((sum, d) => sum + d.energyConsumption, 0);
  const totalEnergyCost = data.reduce((sum, d) => sum + d.energyCost, 0);
  const avgDeviceUptime = data.reduce((sum, d) => sum + d.deviceUptime, 0) / data.length;
  const avgGuestSatisfaction = data.reduce((sum, d) => sum + d.guestSatisfaction, 0) / data.length;

  // 入住率趋势图配置
  const occupancyChartOption = {
    title: {
      text: '客房入住率趋势',
      left: 'left'
    },
    tooltip: {
      trigger: 'axis',
      formatter: '{b}<br/>入住率: {c}%'
    },
    xAxis: {
      type: 'category',
      data: data.map(d => d.date.slice(5))
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: 100,
      axisLabel: {
        formatter: '{value}%'
      }
    },
    series: [{
      data: data.map(d => d.roomOccupancyRate),
      type: 'line',
      smooth: true,
      areaStyle: {
        opacity: 0.3
      },
      lineStyle: {
        color: '#1890ff'
      },
      itemStyle: {
        color: '#1890ff'
      }
    }]
  };

  // 能耗分析图配置
  const energyChartOption = {
    title: {
      text: '能耗与成本分析',
      left: 'left'
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['能耗(kWh)', '成本(元)'],
      top: 30
    },
    xAxis: {
      type: 'category',
      data: data.map(d => d.date.slice(5))
    },
    yAxis: [
      {
        type: 'value',
        name: '能耗(kWh)',
        position: 'left',
        axisLabel: {
          formatter: '{value} kWh'
        }
      },
      {
        type: 'value',
        name: '成本(元)',
        position: 'right',
        axisLabel: {
          formatter: '¥{value}'
        }
      }
    ],
    series: [
      {
        name: '能耗(kWh)',
        type: 'bar',
        data: data.map(d => d.energyConsumption),
        itemStyle: {
          color: '#52c41a'
        }
      },
      {
        name: '成本(元)',
        type: 'line',
        yAxisIndex: 1,
        data: data.map(d => d.energyCost),
        lineStyle: {
          color: '#fa8c16'
        },
        itemStyle: {
          color: '#fa8c16'
        }
      }
    ]
  };

  // 设备运行时间分析
  const deviceUptimeOption = {
    title: {
      text: '设备运行时间与客户满意度',
      left: 'left'
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['设备运行时间(%)', '客户满意度'],
      top: 30
    },
    xAxis: {
      type: 'category',
      data: data.map(d => d.date.slice(5))
    },
    yAxis: [
      {
        type: 'value',
        name: '设备运行时间(%)',
        min: 90,
        max: 100,
        position: 'left'
      },
      {
        type: 'value',
        name: '客户满意度',
        min: 0,
        max: 5,
        position: 'right'
      }
    ],
    series: [
      {
        name: '设备运行时间(%)',
        type: 'bar',
        data: data.map(d => d.deviceUptime),
        itemStyle: {
          color: '#1890ff'
        }
      },
      {
        name: '客户满意度',
        type: 'line',
        yAxisIndex: 1,
        data: data.map(d => d.guestSatisfaction),
        lineStyle: {
          color: '#f5222d'
        },
        itemStyle: {
          color: '#f5222d'
        }
      }
    ]
  };

  // 每日用电高峰时段分析
  const peakHourData = data.map(d => ({
    date: d.date,
    hour: d.peakEnergyHour,
    consumption: d.energyConsumption
  }));

  const peakHourOption = {
    title: {
      text: '用电高峰时段分布',
      left: 'left'
    },
    tooltip: {
      trigger: 'item',
      formatter: '{b}点: {c}次'
    },
    series: [{
      type: 'pie',
      radius: '60%',
      data: [
        { value: peakHourData.filter(d => d.hour >= 18 && d.hour <= 20).length, name: '18-20点' },
        { value: peakHourData.filter(d => d.hour >= 19 && d.hour <= 21).length, name: '19-21点' },
        { value: peakHourData.filter(d => d.hour >= 20 && d.hour <= 22).length, name: '20-22点' },
        { value: peakHourData.filter(d => d.hour < 18 || d.hour > 22).length, name: '其他时段' }
      ],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }]
  };

  // 房间类型分析表格
  const roomTypeAnalysis = [
    {
      key: '1',
      roomType: '标准房',
      count: hotelRooms.filter(r => r.type === 'standard').length,
      avgOccupancy: 75,
      avgEnergyConsumption: 14.2,
      avgRevenue: 280
    },
    {
      key: '2',
      roomType: '豪华房',
      count: hotelRooms.filter(r => r.type === 'deluxe').length,
      avgOccupancy: 68,
      avgEnergyConsumption: 18.5,
      avgRevenue: 420
    },
    {
      key: '3',
      roomType: '套房',
      count: hotelRooms.filter(r => r.type === 'suite').length,
      avgOccupancy: 45,
      avgEnergyConsumption: 25.3,
      avgRevenue: 680
    }
  ];

  const roomTypeColumns = [
    {
      title: '房间类型',
      dataIndex: 'roomType',
      key: 'roomType',
    },
    {
      title: '房间数量',
      dataIndex: 'count',
      key: 'count',
    },
    {
      title: '平均入住率',
      dataIndex: 'avgOccupancy',
      key: 'avgOccupancy',
      render: (value: number) => `${value}%`
    },
    {
      title: '平均能耗',
      dataIndex: 'avgEnergyConsumption',
      key: 'avgEnergyConsumption',
      render: (value: number) => `${value} kWh`
    },
    {
      title: '平均收益',
      dataIndex: 'avgRevenue',
      key: 'avgRevenue',
      render: (value: number) => `¥${value}`
    }
  ];

  return (
    <div style={{ padding: '0 16px' }}>
      {/* 时间范围选择 */}
      <Card style={{ marginBottom: 16 }}>
        <Row align="middle" justify="space-between">
          <Col>
            <Space>
              <span>分析时间范围:</span>
              <Select
                value={selectedTimeRange}
                onChange={setSelectedTimeRange}
                style={{ width: 120 }}
              >
                <Option value="day">今日</Option>
                <Option value="week">本周</Option>
                <Option value="month">本月</Option>
                <Option value="year">今年</Option>
              </Select>
              <RangePicker />
            </Space>
          </Col>
          <Col>
            <Tag color="blue">数据更新时间: {latestData.date}</Tag>
          </Col>
        </Row>
      </Card>

      {/* 关键指标统计 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="平均入住率"
              value={avgOccupancyRate.toFixed(1)}
              suffix="%"
              prefix={<TrophyOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
            <Progress
              percent={avgOccupancyRate}
              showInfo={false}
              strokeColor="#3f8600"
              style={{ marginTop: 8 }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="总能耗"
              value={totalEnergyConsumption.toFixed(0)}
              suffix="kWh"
              prefix={<ThunderboltOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
            <div style={{ marginTop: 8, fontSize: '12px', color: '#666' }}>
              日均: {(totalEnergyConsumption / data.length).toFixed(1)} kWh
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="总成本"
              value={totalEnergyCost.toFixed(0)}
              prefix="¥"
              valueStyle={{ color: '#fa8c16' }}
            />
            <div style={{ marginTop: 8, fontSize: '12px', color: '#666' }}>
              日均: ¥{(totalEnergyCost / data.length).toFixed(0)}
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="客户满意度"
              value={avgGuestSatisfaction.toFixed(1)}
              suffix="/ 5.0"
              prefix={<TrophyOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
            <Progress
              percent={(avgGuestSatisfaction / 5) * 100}
              showInfo={false}
              strokeColor="#722ed1"
              style={{ marginTop: 8 }}
            />
          </Card>
        </Col>
      </Row>

      {/* 图表分析 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={12}>
          <Card>
            <ReactECharts option={occupancyChartOption} style={{ height: 300 }} />
          </Card>
        </Col>
        <Col span={12}>
          <Card>
            <ReactECharts option={energyChartOption} style={{ height: 300 }} />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={12}>
          <Card>
            <ReactECharts option={deviceUptimeOption} style={{ height: 300 }} />
          </Card>
        </Col>
        <Col span={12}>
          <Card>
            <ReactECharts option={peakHourOption} style={{ height: 300 }} />
          </Card>
        </Col>
      </Row>

      {/* 详细分析 */}
      <Row gutter={16}>
        <Col span={16}>
          <Card title="房间类型运营分析">
            <Table
              columns={roomTypeColumns}
              dataSource={roomTypeAnalysis}
              pagination={false}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="设备效率统计" style={{ marginBottom: 16 }}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <div>
                <div>设备总数: {hotelDevices.length}</div>
                <Progress
                  percent={100}
                  showInfo={false}
                  strokeColor="#1890ff"
                />
              </div>
              <div>
                <div>在线设备: {hotelDevices.filter(d => d.status === 'online').length}</div>
                <Progress
                  percent={(hotelDevices.filter(d => d.status === 'online').length / hotelDevices.length) * 100}
                  showInfo={false}
                  strokeColor="#52c41a"
                />
              </div>
              <div>
                <div>平均运行时间: {avgDeviceUptime.toFixed(1)}%</div>
                <Progress
                  percent={avgDeviceUptime}
                  showInfo={false}
                  strokeColor="#faad14"
                />
              </div>
            </Space>
          </Card>

          <Card title="环保指标">
            <Space direction="vertical" style={{ width: '100%' }}>
              <Statistic
                title="碳排放总量"
                value={data.reduce((sum, d) => sum + d.co2Emission, 0)}
                suffix="kg CO₂"
                valueStyle={{ color: '#52c41a' }}
              />
              <Statistic
                title="日均碳排放"
                value={(data.reduce((sum, d) => sum + d.co2Emission, 0) / data.length).toFixed(1)}
                suffix="kg CO₂"
                valueStyle={{ color: '#fa8c16' }}
              />
              <div style={{ marginTop: 16, padding: 12, backgroundColor: '#f6ffed', borderRadius: 4 }}>
                <div style={{ color: '#52c41a', fontWeight: 'bold' }}>节能建议</div>
                <div style={{ fontSize: '12px', marginTop: 4 }}>
                  通过智能调节，本周已节省 15% 能耗
                </div>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default OperationAnalysisPage; 