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

    let renderInfo=()=>{
        let {
            name,
			email,
			phone,
			desc,
			departmentId,
			jobId,
			sex
        }=userInfo;
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



    return {
        init() {
            //接收当前url中的参数
            userInfo = decodeURIComponent(location.href).queryURLParams();
            // console.log(userInfo);
            if (!userInfo.userId) {
                isUpdate = false;
            }
            bindList().then(()=>{
				if(isUpdate) renderInfo();
			});
        }
    }
}());

userAddModule.init();