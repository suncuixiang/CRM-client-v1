/* 用户登录 */
(function () {
    /* 
     function mockData(options) {
        let query = options.body;
        let user = {
            account: "123",
            password: "32d25170b469b57095ca269b",
        };
        let res = query.match(/[^=&]+/g);
        if (res[1] == user.account && res[3] == user.password) {
            return {
                code: 0,
                codeText: "OK",
                power: "userhandle|resetpassword",
            };
        } else {
            return {
                code: 1,
                codeText: "NO",
            };
        }
    }
    */
    let mockData = {
        "code": 0, //=>0成功 1失败
        "codeText": 'OK', //=>CODE状态码描述
        "power": 'userhandle|resetpassword' //=>用户权限
    };
    Mock.mock('/user/login', mockData);
}());
/* 用户登出 */
(function () {
    let mockData = {
        "code": 0, //=>0成功 1失败
        "codeText": 'OK' //=>CODE状态码描述
    };
    Mock.mock('/user/signout', mockData);
}());
/* 重置用户密码 */
(function () {
    let mockData = {
        "code": 0, //=>0成功 1失败
        "codeText": 'OK' //=>CODE状态码描述
    };
    Mock.mock('/user/resetpassword', mockData);
}());
/* 修改用户信息 */
(function () {
    let mockData = {
        "code": 0, //=>0成功 1失败
        "codeText": 'OK' //=>CODE状态码描述
    };
    Mock.mock('/user/update', mockData);
}());
/* 删除用户 */
(function () {
    let mockData = {
        "code": 0, //=>0成功 1失败
        "codeText": 'OK' //=>CODE状态码描述
    };
    let rurl=/\/user\/delete\?userId=\d/;
    Mock.mock(rurl,'get', mockData);
}());
/* 用户信息 */
(function () {
    let mockData = {
        code: 0,
        codeText: 'OK',
        data: {
            id: 1,
            name: "珠峰培训",
            sex: 0,
            email: "1144709265@qq.com",
            phone: "18310612838",
            departmentId: 1,
            department: '总裁办',
            jobId: 1,
            job: '管理员',
            desc: "珠峰培训最高管理员账户"
        }
    };
    Mock.mock('/user/info', mockData);
}());
/* 侧边路由数据 */
(function () {
    let mockData = [{
            title: '员工管理',
            icon: 'icon-yonghu',
            children: [{
                    subTitle: '员工列表',
                    href: 'page/userlist.html',
                    flag: '' //控制页面是否显示
                },
                {
                    subTitle: '新增员工',
                    href: 'page/useradd.html',
                    flag: 'userhandle'
                }
            ]
        },
        {
            title: '部门管理',
            icon: 'icon-guanliyuan',
            children: [{
                    subTitle: '部门列表',
                    href: 'page/departmentlist.html',
                    flag: ''
                },
                {
                    subTitle: '新增部门',
                    href: 'page/departmentadd.html',
                    flag: 'departhandle'
                }
            ]
        }, {
            title: "职务管理",
            icon: "icon-zhiwuguanli",
            children: [{
                    subTitle: "职务列表",
                    href: "page/joblist.html",
                    flag: "",
                },
                {
                    subTitle: "新增职务",
                    href: "page/jobadd.html",
                    flag: "jobhandle",
                },
            ],
        },
        {
            title: "客户管理",
            icon: "icon-kehuguanli",
            children: [{
                    subTitle: "我的客户",
                    href: "page/customerlist.html?lx=my.html",
                    flag: ""
                },
                {
                    subTitle: "全部客户",
                    href: "page/customerlist.html?lx=all.html",
                    flag: "allcustomer"
                },
                {
                    subTitle: "新增客户",
                    href: "page/customeradd.html",
                    flag: ""
                }
            ]
        }
    ];
    Mock.mock('/user/router', mockData);
}());
/* 部门列表 */
(function(){
    let mockData={
        code:0,  
        codeText:'OK',
        "data|3":[{
            'id|+1': 1,
            "name|+1": [
                "总裁办",
                "销售部",
                "产品研发部",
            ],
            desc: ""
        }]
    };
    Mock.mock('/department/list',mockData);
}());
/* 用户列表 */
(function(){
    let mockData={
        code:0,  
        codeText:'OK',
        "data|9-10":[/* {// 随机生成15到30个数组元素
            'id|+1': 0, // 属性值自动加 1，初始值为0
            name: '@cname', // 中文名称
            'sex|1': [0, 1], // 随机选取 1 个元素
            email: '@email',
            phone: /^1[3-9]\d{9}$/,
            "departmentId|1": [1,2,3],
            "department|1": ['总裁办','后勤部','销售部'],
            "jobId|1": [1,2],
            "job|1": ['管理员','高级管理员'],
            desc: "管理员账户"
        } */
            {
                "id|+1": 0,
                name: "@cname",
                "sex|1": [0, 1],
                phone: /^1[3-9]\d{9}$/,
                email: "@email",
                "departmentId|+1": [1,2,3],
                "department|+1": [
                    "总裁办",
                    "销售部",
                    "产品研发部",
                ],
                "jobId|+1": [1, 2, 3],
                "job|+1": [
                    "管理员",
                    "销售部经理",
                    "产品研发部经理"
                ],
                desc: "@cparagraph(1)",
            },
        ]
    };
    Mock.mock('/user/list',mockData);
}());