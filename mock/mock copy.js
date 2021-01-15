(function(){
    const mockdata = {
        "user|1-3": [{ // 随机生成1到3个数组元素
            'name': '@cname', // 中文名称
            'id|+1': 0, // 属性值自动加 1，初始值为0
            'age|18-28': 0, // 18至28以内随机整数, 0只是用来确定类型
            'birthday': '@date("yyyy-MM-dd")', // 日期
            'city': '@city(true)', // 中国城市
            'color': '@color', // 16进制颜色
            'isMale|1': true, // 布尔值
            'isFat|1-2': true, // true的概率是1/3
            // 'fromObj|2': obj, // 从obj对象中随机获取2个属性
            // 'fromObj2|1-3': obj, // 从obj对象中随机获取1至3个属性
            'brother|1': ['jack', 'jim'], // 随机选取 1 个元素
            'sister|+1': ['jack', 'jim', 'lily'], // array中顺序选取元素作为结果
            'friends|2': ['jack', 'jim'] // 重复2次属性值生成一个新数组
        }]
    };
    Mock.mock('http://user/userlist',mockdata);
}());


const mockdata = {
    "success": true,
    "message": "操作成功！",
    "code": 0,
    "result|10": [{ // 生成10条数据
        "id|+1": 1, // id递增1
        "roleName|1": ["测试角色1", "测试角色2", "测试角色3", "测试角色4", "测试角色5"], // 数组内随机一个值
        "roleCode": "100010",
        "description": null,
        "createBy": "jeecg",
        "createTime": "2019-10-30 19:50:56",
        "updateBy": null,
        "updateTime": null
    }],
    "timestamp": 1573456699794
};

