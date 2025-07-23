import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, message, Tabs, Checkbox, Row, Col, Modal, Space, Tooltip } from 'antd';
import { 
  UserOutlined, 
  LockOutlined, 
  SafetyOutlined, 
  RobotOutlined, 
  EnvironmentOutlined, 
  DashboardOutlined,
  MobileOutlined,
  NotificationOutlined,
  ApartmentOutlined,
  ApiOutlined,
  CloudOutlined,
  BarChartOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import '../styles/login.css';

interface LoginForm {
  username: string;
  password: string;
  remember?: boolean;
}

interface MobileLoginForm {
  mobile: string;
  verificationCode: string;
}

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('account');
  const [countdown, setCountdown] = useState(0);
  const [noticeVisible, setNoticeVisible] = useState(true);
  const [mobileForm] = Form.useForm();
  const [accountForm] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    const savedUsername = localStorage.getItem('rememberedUsername');
    if (savedUsername) {
      accountForm.setFieldsValue({ username: savedUsername });
    }
  }, [accountForm]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const validateMobile = (mobile: string) => {
    if (!mobile) {
      return '请输入手机号码';
    }
    if (!/^1[3-9]\d{9}$/.test(mobile)) {
      return '请输入正确的手机号码';
    }
    return '';
  };

  const handleSendCode = async () => {
    try {
      // 获取手机号码
      const mobile = mobileForm.getFieldValue('mobile');
      const error = validateMobile(mobile);
      if (error) {
        message.error(error);
        return;
      }

      // 显示加载状态
      const btn = document.querySelector('.verification-code-button') as HTMLButtonElement;
      if (btn) btn.disabled = true;

      // 模拟发送验证码
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 发送成功
      setCountdown(60);
      message.success('验证码已发送至您的手机，请注意查收！');
      
      // 自动聚焦到验证码输入框
      mobileForm.getFieldInstance('verificationCode')?.focus();
    } catch (error) {
      message.error('验证码发送失败，请稍后重试');
    } finally {
      const btn = document.querySelector('.verification-code-button') as HTMLButtonElement;
      if (btn) btn.disabled = false;
    }
  };

  const onFinish = async (values: LoginForm) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (values.username === 'admin' && values.password === 'admin123') {
        if (values.remember) {
          localStorage.setItem('rememberedUsername', values.username);
        } else {
          localStorage.removeItem('rememberedUsername');
        }

        localStorage.setItem('userToken', 'demo-token');
        localStorage.setItem('userName', values.username);
        message.success('登录成功，正在进入系统...');
        navigate('/');  // 修改这里，改为跳转到根路径（欢迎页）
      } else {
        message.error('账号或密码错误，请重试！');
      }
    } catch (error) {
      message.error('登录失败，请检查网络后重试！');
    } finally {
      setLoading(false);
    }
  };

  const onMobileFinish = async (values: MobileLoginForm) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      if (values.mobile === '13800138000' && values.verificationCode === '123456') {
        // 保存登录状态
        localStorage.setItem('userToken', 'demo-token');
        localStorage.setItem('userMobile', values.mobile);
        
        message.success('登录成功，正在进入系统...');
        navigate('/');  // 这里也改为跳转到欢迎页
      } else {
        message.error('验证码错误或已过期，请重新获取！');
        // 清空验证码输入框
        mobileForm.setFieldValue('verificationCode', '');
        // 聚焦验证码输入框
        mobileForm.getFieldInstance('verificationCode')?.focus();
      }
    } catch (error) {
      message.error('登录失败，请检查网络后重试！');
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: <ApartmentOutlined />,
      title: '智慧管理',
      desc: '一体化酒店管理解决方案'
    },
    {
      icon: <RobotOutlined />,
      title: '智能服务',
      desc: '机器人送物、清洁服务'
    },
    {
      icon: <ApiOutlined />,
      title: '设备联动',
      desc: '智能设备协同控制'
    },
    {
      icon: <BarChartOutlined />,
      title: '数据分析',
      desc: '经营数据可视化分析'
    }
  ];

  const handleForgotPassword = () => {
    Modal.info({
      title: '找回密码',
      content: (
        <div style={{ fontSize: '16px', lineHeight: '2' }}>
          <p>请联系系统管理员重置密码：</p>
          <p><strong>电话：</strong>15864126115</p>
          <p><strong>邮箱：</strong>admin@zecheng.com</p>
        </div>
      ),
      width: 400,
      okText: '知道了',
      className: 'custom-modal'
    });
  };

  const items = [
    {
      key: 'account',
      label: '账号密码登录',
      children: (
        <Form
          form={accountForm}
          name="login"
          onFinish={onFinish}
          autoComplete="off"
          size="large"
          initialValues={{ remember: true }}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入账号！' }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="请输入账号"
              autoComplete="username"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码！' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="请输入密码"
              autoComplete="current-password"
            />
          </Form.Item>

          <Form.Item>
            <Row justify="space-between" align="middle">
              <Col>
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox>记住账号</Checkbox>
                </Form.Item>
              </Col>
              <Col>
                <Button type="link" onClick={handleForgotPassword}>
                  忘记密码
                </Button>
              </Col>
            </Row>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
            >
              登录系统
            </Button>
          </Form.Item>
        </Form>
      ),
    },
    {
      key: 'mobile',
      label: '手机验证码登录',
      children: (
        <Form
          form={mobileForm}
          name="mobileLogin"
          onFinish={onMobileFinish}
          autoComplete="off"
          size="large"
          className="mobile-login-form"
        >
          <Form.Item
            name="mobile"
            rules={[
              { required: true, message: '请输入手机号码' },
              { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码' }
            ]}
          >
            <Input
              prefix={<MobileOutlined className="form-icon" />}
              placeholder="请输入手机号码"
              autoComplete="tel"
              maxLength={11}
              showCount
              suffix={
                <Tooltip title="未注册的手机号将自动创建账号">
                  <InfoCircleOutlined style={{ color: '#999' }} />
                </Tooltip>
              }
            />
          </Form.Item>

          <Form.Item
            name="verificationCode"
            rules={[
              { required: true, message: '请输入验证码' },
              { pattern: /^\d{6}$/, message: '验证码为6位数字' }
            ]}
          >
            <Row gutter={8}>
              <Col flex="auto">
                <Input
                  prefix={<SafetyOutlined className="form-icon" />}
                  placeholder="请输入验证码"
                  maxLength={6}
                  autoComplete="off"
                />
              </Col>
              <Col>
                <Button
                  className="verification-code-button"
                  disabled={countdown > 0}
                  onClick={handleSendCode}
                >
                  {countdown > 0 ? `${countdown}秒后重试` : '获取验证码'}
                </Button>
              </Col>
            </Row>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
            >
              登录系统
            </Button>
          </Form.Item>
        </Form>
      ),
    },
  ];

  return (
    <div className="login-container">
      {noticeVisible && (
        <div className="system-notice">
          <NotificationOutlined /> 系统公告：系统将于本周日凌晨2:00-4:00进行例行维护，请提前做好相关工作安排。
          <Button 
            type="text" 
            size="small" 
            onClick={() => setNoticeVisible(false)}
            className="notice-close"
          >
            关闭
          </Button>
        </div>
      )}

      <div className="login-content">
        <div className="login-brand">
          <div className="brand-logo">择邻山庄智慧酒店</div>
          <h2>智慧酒店管理系统</h2>
          <p>
            欢迎使用择邻山庄智慧酒店管理系统，我们致力于为酒店提供智能化、数字化的一站式解决方案。
            通过先进的物联网技术和智能管理系统，全方位提升酒店运营效率和服务品质。
          </p>
          <div className="hotel-features">
            {features.map((feature, index) => (
              <div key={index} className="feature-item">
                {feature.icon}
                <div>
                  <div className="feature-text">{feature.title}</div>
                  <div className="feature-desc">{feature.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="login-form-container">
          <Card className="login-card">
            <h1 className="login-title">账号登录</h1>
            <Tabs
              activeKey={activeTab}
              onChange={setActiveTab}
              items={items}
              centered
            />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login; 