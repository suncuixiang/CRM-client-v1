let customerAddModule = (function () {
    let $username = $('.username'),
        $spanusername = $('.spanusername'),
        $man = $('#man'),
        $woman = $('#woman'),
        $useremail = $('.useremail'),
        $spanuseremail = $('.spanuseremail'),
        $userphone = $('.userphone'),
        $spanuserphone = $('.spanuserphone'),
        $userqq = $('.userqq'),
        $spanuserqq = $('.spanuserqq'),
        $userweixin = $('.userweixin'),
        $spanuserweixin = $('.spanuserweixin'),
        $usertype = $('.usertype'),
        $useraddress = $('.useraddress'),
        $submit = $('.submit');
    let customerId = null;
    let isUpdate = true; //默认是修改

    let queryInfo = () => {
        axios.get('/customer/info', {
            params: {
                customerId
            }
        }).then(res => {
            let {
                code,
                data: {
                    name,
                    sex,
                    email,
                    phone,
                    QQ,
                    weixin,
                    type,
                    address
                }
            } = res;
            if (code == 0) {
                $username.val(name);
				if(sex==0){
					$woman.prop('checked',true);
				}
				$useremail.val(email);
				$userphone.val(phone);
				$userqq.val(QQ);
				$userweixin.val(weixin);
				$usertype.val(type);
				$useraddress.val(address);
            }
        });
    };

    //正则校验数据格式
	let checkUserName=()=>{
		let value=$username.val().trim();
		if(!value){
			$spanusername.html('用户名不能为空！');
			return false;
		}
		$spanusername.html('');
		return true;
	};

	let checkEmail=()=>{
		let reg = /^\w+((-\w+)|(\.\w+))*@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
		let value=$useremail.val().trim();
		if(!value){
			$spanuseremail.html('邮箱不能为空！');
			return false;
		}
		if(!reg.test(value)){
			$spanuseremail.html('邮箱格式不符合规则');
			return false;
		}
		$spanuseremail.html('');
		return true;
	}

	let checkPhone=()=>{
		let reg = /^1[3-9]\d{9}$/;
		let value=$userphone.val().trim();
		if(!value){
			$spanuserphone.html('电话不能为空！');
			return false;
		}
		if(value.length!=11){
			$spanuserphone.html('电话长度不符合规则');
			return false;
		}
		if(!reg.test(value)){
			$spanuserphone.html('电话格式不符合规则');
			return false;
		}
		$spanuserphone.html('');
		return true;
    };

	//提交
	let bindSubmit=()=>{
		$submit.click(function(){
			checkUserName();
			checkPhone();
			checkEmail();
			if(!(checkUserName() && checkPhone() && checkEmail())){
				alert('请检查表单信息');
				return;
			}

			let url=isUpdate?'/customer/update':'/customer/add';
			let sex=$man.prop('checked')?'1':'0';
			let obj={
				name:$username.val().trim(),
				sex,
				email:$useremail.val().trim(),
				phone:$userphone.val().trim(),
				QQ:$userqq.val().trim(),
				weixin:$userweixin.val().trim(),
				type:$usertype.val(),
				address:$useraddress.val().trim()			
			};
			if(isUpdate){
				obj.customerId=customerId;
			}
			axios.post(url,obj).then(res=>{
				let {
					code
				}=res;
				if(code==0){
					alert('操作成功，即将返回用户列表页',{
						handled(){
							location.href='customerlist.html';
						}
					})
				}else{
					return Promise.reject();
				}
			}).catch(()=>{
				alert('操作失败');
				//可以在此处清空表单
			});
			
		});
	};

    return {
        init() {
            //接收当前url中的userId参数
            customerId = location.href.queryURLParams().customerId || '';
            if (!customerId) {
                isUpdate = false;
            }
            if (isUpdate) queryInfo();
            $username.on('blur', checkUserName);
            $useremail.on('blur', checkEmail);
            $userphone.on('blur', checkPhone);
            bindSubmit();
        }
    }
}());

customerAddModule.init();