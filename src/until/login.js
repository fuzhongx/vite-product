//封装，配置相关数据生成配置
export default {
  labelWidth: "60px",
  inline: false,
  rules: {
    username: [
      { required: true, message: "请输入账号", trigger: "blur" },
      { min: 3, max: 18, message: "请输入3-18个字符", trigger: "blur" },
    ],
    password: [
      { required: true, message: "请输入密码", trigger: "blur" },
      { min: 3, max: 18, message: "请输入3-18个字符", trigger: "blur" },
    ],
    code: [{ required: true, message: "请输入验证码", trigger: "blur" }],
  },

  formItem: [
    {
      type: "input",
      label: "账号",
      placeholder: "请输入账号",
      feild: "username",
    },
    {
      type: "password",
      label: "密码",
      placeholder: "请输入密码",
      feild: "password",
    },
    {
      type: "captchaKey",
      label: "验证码",
      placeholder: "请输入验证码",
      feild: "code",
    },
  ],
};
