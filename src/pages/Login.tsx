import React, { useState } from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { UserOutlined, LockOutlined, SafetyOutlined, RobotOutlined, EnvironmentOutlined, DashboardOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import '../styles/login.css';

interface LoginForm {
  username: string;
  password: string;
}

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values: LoginForm) => {
    setLoading(true);
    try {
      // 这里模拟登录请求
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 模拟登录成功
      if (values.username === 'admin' && values.password === 'admin123') {
        localStorage.setItem('userToken', 'demo-token');
        localStorage.setItem('userName', values.username);
        message.success('登录成功！');
        navigate('/dashboard');
      } else {
        message.error('用户名或密码错误！');
      }
    } catch (error) {
      message.error('登录失败，请重试！');
    } finally {
      setLoading(false);
    }
  };

  const features = [
    { icon: <SafetyOutlined />, text: '智能安防' },
    { icon: <RobotOutlined />, text: '机器人服务' },
    { icon: <EnvironmentOutlined />, text: '环境监控' },
    { icon: <DashboardOutlined />, text: '数据分析' },
  ];

  return (
    <div className="login-container">
      <div className="login-content">
        <div className="login-brand">
          <h2>择邻山庄智慧酒店</h2>
          <p>
            欢迎使用智慧酒店管理平台，我们致力于为您提供最先进的酒店管理解决方案。
            通过智能化设备控制、数据分析和自动化服务，提升酒店运营效率和客户满意度。
          </p>
          <div className="hotel-features">
            {features.map((feature, index) => (
              <div key={index} className="feature-item">
                {feature.icon} {feature.text}
              </div>
            ))}
          </div>
        </div>

        <div className="login-form-container">
          <Card className="login-card">
            <h1 className="login-title">账号登录</h1>
            <Form
              name="login"
              onFinish={onFinish}
              autoComplete="off"
              size="large"
            >
              <Form.Item
                name="username"
                rules={[{ required: true, message: '请输入用户名！' }]}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="用户名"
                />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[{ required: true, message: '请输入密码！' }]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="密码"
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  block
                >
                  登录
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login; 