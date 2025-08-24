//封装，配置相关数据生成配置
export default {
    labelWidth: "60px",
    inline:true,
    formItem: [
      {
        type: "input",
        label: "账号:",
        placeholder: "请输入账号",
        feild: "username",
      },
      {
        type: "password",
        label: "密码:",
        placeholder: "请输入密码",
        feild: "password",
      },
      {
        type: "input",
        label: "验证码:",
        placeholder: "请输入验证码",
        feild: "code",
      }
    ],
  };
  