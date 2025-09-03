//封装，配置相关数据生成配置
const params=['beginTime','endTime']
export default {
  labelWidth: "68px",
  inline: true,
  formItem: [
    {
      type: "input",
      label: "用户名称",
      placeholder: "请输入用户名称",
      feild: "userName",
    },
    {
      type: "input",
      label: "手机号码",
      placeholder: "请输入手机号码",
      feild: "phonenumber",
    },
    {
      type: "select",
      label: "状态",
      placeholder: "用户状态",
      feild: "status",
      options: () => {
        return [
          {
            label: "正常",
            value: "0",
          },
          {
            label: "停用",
            value: "1",
          },
        ];
      },
    },
    {
      type: "datetimerange",
      label: "创建时间",
      placeholder: "请选择日期",
      feild:'params'
    }
  ],
};

