/* 用户登录验证
params:
account=xxx&password=xxx*/
(function () {
    function mockData(options) {
        let query = options.body;
        let user = [{
                account: "superadmin",
                password: "32d25170b469b57095ca269b",
                power: "userhandle|departhandle|jobhandle|departcustomer|allcustomer|resetpassword",
            },
            {
                account: "admin",
                password: "32d25170b469b57095ca269b",
                power: "userhandle|resetpassword",
            },
            {
                account: "visiter",
                password: "32d25170b469b57095ca269b",
                power: "null",
            },
        ];
        let reg = query.match(/[^=&]+/g);
        let res = user.filter((item) => {
            return reg[1] == item.account && reg[3] == item.password;
        });
        if (res.length) {
            return {
                code: 0,
                codeText: "OK",
                power: res[0].power,
            };
        }
        return {
            code: 1,
            codeText: "NO",
        };
    }
    Mock.mock("/user/login", "post", mockData);
})();

/* 用户非法登录
params: null*/
(function () {
    function mockData() {
        if (!(localStorage.account && localStorage.power)) {
            return {
                code: 1,
                codeText: "NO",
            };
        }
        return {
            code: 0,
            codeText: "OK",
        };
    }
    Mock.mock("/user/login", "get", mockData);
})();

/* 用户退出
params: null*/
(function () {
    let mockData = {
        code: 0,
        codeText: "OK",
    };
    Mock.mock("/user/signout", "get", mockData);
})();

/* 侧边路由
params: null*/
(function () {
    let mockData = {
        code: 0,
        codeText: "OK",
        data: [{
                title: "员工管理",
                icon: "icon-yonghu",
                children: [{
                        subTitle: "员工列表",
                        href: "page/userlist.html",
                        flag: "",
                    },
                    {
                        subTitle: "新增员工",
                        href: "page/useradd.html",
                        flag: "userhandle",
                    },
                ],
            },
            {
                title: "部门管理",
                icon: "icon-guanliyuan",
                children: [{
                        subTitle: "部门列表",
                        href: "page/departmentlist.html",
                        flag: "",
                    },
                    {
                        subTitle: "新增部门",
                        href: "page/departmentadd.html",
                        flag: "departhandle",
                    },
                ],
            },
            {
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
                        flag: "",
                    },
                    {
                        subTitle: "全部客户",
                        href: "page/customerlist.html?lx=all.html",
                        flag: "allcustomer",
                    },
                    {
                        subTitle: "新增客户",
                        href: "page/customeradd.html",
                        flag: "",
                    },
                ],
            },
        ],
    };
    Mock.mock("/user/router", "get", mockData);
})();

/* 部门列表
params: null*/
(function () {
    let mockData = {
        code: 0,
        codeText: "OK",
        data: [{
                id: 1,
                name: "总裁办",
                desc: ""
            },
            {
                id: 2,
                name: "销售部",
                desc: ""
            },
            {
                id: 3,
                name: "产品研发部",
                desc: ""
            },
        ],
    };
    Mock.mock("/department/list", "get", mockData);
})();

/* 职务列表
params: null*/
(function () {
    let mockData = {
        code: 0,
        codeText: "OK",
        data: [{
                id: 1,
                name: "管理员",
                desc: "",
                power:''
            },
            {
                id: 2,
                name: "销售部经理",
                desc: "",
                power:''
            },
            {
                id: 3,
                name: "销售部员工",
                desc: "",
                power:''
            },
            {
                id: 4,
                name: "产品研发部经理",
                desc: "",
                power:''
            },
            {
                id: 5,
                name: "产品研发部经理",
                desc: "",
                power:''
            },
        ],
    };
    Mock.mock("/job/list", "get", mockData);
})();

/* 用户列表
params: null*/
(function () {
    let mockData = {
        code: 0,
        codeText: "OK",
        // 随机生成10-11个数组元素
        "data|10-11": [{
            "id|+1": 0,
            name: "@cname",
            "sex|1": [0, 1],
            phone: /^1[3-9]\d{9}$/,
            email: "@email",
            "department|+1": [
                "总裁办",
                "销售部",
                "销售部",
                "产品研发部",
                "产品研发部",
            ],
            "departmentId|+1": [1, 2, 2, 3, 3],
            "job|+1": [
                "管理员",
                "销售部经理",
                "销售部员工",
                "产品研发部经理",
                "产品研发部员工",
            ],
            "jobId|+1": [1, 2, 3, 4, 5],
            desc: "@cparagraph(1)",
        }, ],
    };
    Mock.mock("/user/list", "get", mockData);
})();

/* 重置用户密码
params:
userId=1
password=xxx */
(function () {
    let mockData = {
        code: 0,
        codeText: "OK",
    };
    Mock.mock("/user/resetpassword", "post", mockData);
})();

/* 删除用户
params:
userId=1 */
(function () {
    let mockData = {
        "code": 0, //=>0成功 1失败
        "codeText": 'OK' //=>CODE状态码描述
    };
    let rurl = /\/user\/delete\?userId=\d/;
    Mock.mock(rurl, 'get', mockData);
}());

/* 修改用户信息 */
(function () {
    let mockData = {
        "code": 0, //=>0成功 1失败
        "codeText": 'OK' //=>CODE状态码描述
    };
    Mock.mock('/user/update', mockData);
}());

/* 新增用户信息 */
(function () {
    let mockData = {
        "code": 0, //=>0成功 1失败
        "codeText": 'OK' //=>CODE状态码描述
    };
    Mock.mock('/user/add', mockData);
}());

/* 客户列表 */
// 后台根据当前用户权限返回可被查看的用户信息列表（权限校验）
(function(){
    let mockData = {
        "code": 0, //=>0成功 1失败
        "codeText": 'OK', //=>CODE状态码描述
        "data|25": [{
            "id|+1": 0,
            name: "@cname",
            "sex|1": [0, 1],
            phone: /^1[3-9]\d{9}$/,
            email: "@email",
            QQ: /^[1-9]\d{4,11}$/,
            weixin: /^1[3-9]\d{9}$/,
            "type|+1": [
                "重点客户",
                "一般客户",
                "放弃客户"
            ],
            address: "@city(true)",
            userName:"@cname"
        }],
    };
    let rurl = /\/customer\/list\?lx=\w/;
    Mock.mock(rurl, mockData);
}());

/* 删除客户
params:
customerId=1 */
(function () {
    let mockData = {
        "code": 0, //=>0成功 1失败
        "codeText": 'OK' //=>CODE状态码描述
    };
    let rurl = /\/customer\/delete\?customerId=\d/;
    Mock.mock(rurl, 'get', mockData);
}());

/* 客户详细信息 */
(function () {
    let mockData = {
        "code": 0, //=>0成功 1失败
        "codeText": 'OK', //=>CODE状态码描述
        data:{
            "id|+1": 0,
            name: "@cname",
            "sex|1": [0, 1],
            phone: /^1[3-9]\d{9}$/,
            email: "@email",
            QQ: /^[1-9]\d{4,11}$/,
            weixin: /^1[3-9]\d{9}$/,
            "type|+1": [
                "重点客户",
                "一般客户",
                "放弃客户"
            ],
            address: "@city(true)",
            userName:"@cname"
        }
    };
    let rurl = /\/customer\/info\?customerId=\d/;
    Mock.mock(rurl, 'get', mockData);
}());

/* 修改客户信息 */
(function () {
    let mockData = {
        "code": 0, //=>0成功 1失败
        "codeText": 'OK' //=>CODE状态码描述
    };
    Mock.mock('/customer/update', mockData);
}());

/* 新增客户信息 */
(function () {
    let mockData = {
        "code": 0, //=>0成功 1失败
        "codeText": 'OK' //=>CODE状态码描述
    };
    Mock.mock('/customer/add', mockData);
}());

/* 回访记录信息 */
(function () {
    let mockData = {
        "code": 0, //=>0成功 1失败
        "codeText": 'OK', //=>CODE状态码描述
        "data|3":[
            {
                "id|+1": [0,1,2],
                "customerId|+1": [0,1,2],
                customerName:"@cname",
                visitText: "@cparagraph(1)",
                visitTime: "@date"
            }
        ]
    };
    let rurl = /\/visit\/list\?customerId=\d/;
    Mock.mock(rurl, 'get', mockData);
}());

/* 删除回访信息 */
(function () {
    let mockData = {
        "code": 0, //=>0成功 1失败
        "codeText": 'OK', //=>CODE状态码描述
    };
    let rurl = /\/visit\/delete\?visitId=\d/;
    Mock.mock(rurl, 'get', mockData);
}());

/* 增加回访信息 */
(function () {
    let mockData = {
        "code": 0, //=>0成功 1失败
        "codeText": 'OK' //=>CODE状态码描述
    };
    Mock.mock('/visit/add', mockData);
}());