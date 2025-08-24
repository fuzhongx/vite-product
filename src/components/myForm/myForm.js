//封装，配置相关数据生成配置
export default {
  labelWidth: "120px",
  inline:false,
  formItem: [
    {
      type: "input",
      label: "账号",
      placeholder: "请输入账号",
      feild: "name",
    },
    {
      type: "password",
      label: "密码",
      placeholder: "请输入密码",
      feild: "password",
    },
    {
      type: "select",
      label: "下拉",
      placeholder: "请选择下拉",
      feild: "city",
      options: () => {
        return [
          {
            label: "上海",
            value: "0",
          },
          {
            label: "海南",
            value: "1",
          },
        ];
      },
    },
    {
      type: "date",
      label: "日期",
      placeholder: "请选择日期",
      feild: "",
    },
  ],
};
