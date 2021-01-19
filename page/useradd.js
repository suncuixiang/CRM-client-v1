let userAddModule = (function () {
    let $username = $('.username'),
        $spanusername = $('.spanusername'),
        $man = $('#man'),
        $woman = $('#woman'),
        $useremail = $('.useremail'),
        $spanuseremail = $('.spanuseremail'),
        $userphone = $('.userphone'),
        $spanuserphone = $('.spanuserphone'),
        $userdepartment = $('.userdepartment'),
        $userjob = $('.userjob'),
        $userdesc = $('.userdesc'),
        $submit = $('.submit');
    let userInfo = {};
    let isUpdate = true; //默认是修改

    let renderInfo = () => {
        let {
            name,
            email,
            phone,
            desc,
            departmentId,
            jobId,
            sex
        } = userInfo;

        $username.val(name);
        if (sex == 0) {
            $woman.prop('checked', true);
        }
        $useremail.val(email);
        $userphone.val(phone);
        $userdesc.val(desc);
        $userdepartment.val(departmentId);
        $userjob.val(jobId);
    }

    //发送部门列表、职务列表接口
    let renderSelect = (data) => {
        let str = ``;
        data.forEach(item => {
            str += `<option value="${item.id}">${item.name}</option>`;
        });
        return str;
    };
    let bindList = () => {
        let p1 = axios.get('/department/list'),
            p2 = axios.get('/job/list');
        return axios.all([p1, p2]).then(res => {
            let [depart, job] = res;
            if (depart.code == 0) $userdepartment.html(renderSelect(depart.data));
            if (job.code == 0) $userjob.html(renderSelect(job.data));
        });
    };

    //正则校验数据格式
    let checkUserName = () => {
        let value = $username.val().trim();
        if (!value) {
            $spanusername.html('用户名不能为空！');
            return false;
        }
        $spanusername.html('');
        return true;
    };

    let checkEmail = () => {
        let reg = /^\w+((-\w+)|(\.\w+))*@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
        let value = $useremail.val().trim();
        if (!value) {
            $spanuseremail.html('邮箱不能为空！');
            return false;
        }
        if (!reg.test(value)) {
            $spanuseremail.html('邮箱格式不符合规则');
            return false;
        }
        $spanuseremail.html('');
        return true;
    }

    let checkPhone = () => {
        let reg = /^1[3-9]\d{9}$/;
        let value = $userphone.val().trim();
        if (!value) {
            $spanuserphone.html('电话不能为空！');
            return false;
        }
        if (value.length != 11) {
            $spanuserphone.html('电话长度不符合规则');
            return false;
        }
        if (!reg.test(value)) {
            $spanuserphone.html('电话格式不符合规则');
            return false;
        }
        $spanuserphone.html('');
        return true;
    };

    //提交
    let bindSubmit = () => {
        $submit.click(function () {
            let check1 = checkUserName();
            let check2 = checkEmail();
            let check3 = checkPhone();
            if (!check1 || !check2 || !check3) {
                alert('请检查表单信息');
                return;
            }

            let url = isUpdate ? '/user/update' : '/user/add';
            let obj = {
                name: $username.val().trim(),
                sex: $man.prop('checked') ? '1' : '0',
                email: $useremail.val().trim(),
                phone: $userphone.val().trim(),
                departmentId: $userdepartment.val(),
                jobId: $userjob.val(),
                desc: $userdesc.val().trim()
            };
            if (isUpdate) obj.userId = userInfo.userId;
            axios.post(url, obj).then(res => {
                let {
                    code
                } = res;
                if (code == 0) {
                    alert('操作成功，即将返回员工列表页', {
                        handled() {
                            location.href = 'userlist.html';
                        }
                    })
                } else {
                    return Promise.reject();
                }
            }).catch(() => {
                alert('操作失败');
                //可以在此处清空表单
                $username.val('');
                $man.prop('checked', true);
                $useremail.val('');
                $userphone.val('');
                $userdesc.val('');
                $userdepartment.val(1);
                $userjob.val(1);
            });
        })
    };

    return {
        init() {
            //接收当前url中的参数
            userInfo = decodeURIComponent(location.href).queryURLParams();
            // console.log(userInfo);
            if (!userInfo.userId) {
                isUpdate = false;
            }
            bindList().then(() => {
                if (isUpdate) renderInfo();
            });
            $username.on('blur',checkUserName);
			$useremail.on('blur',checkEmail);
			$userphone.on('blur',checkPhone);
			bindSubmit();
        }
    }
}());

userAddModule.init();