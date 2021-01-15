(function () {
	let $account = $('.userName');
	let $password = $('.userPass');
	let $submit = $('.submit');
	let $viewPW = $('.icon-chakan');

	//点击查看密码
	let flag=true;
	$viewPW.click(function(){
		if(flag){
			flag=false;
			$password.attr("type","text");//修改input标签type值为text
		}else{
			flag=true;
			$password.attr("type","password");
		}
	});

	//给当前的登录按钮绑定点击事件
	$submit.click(async function () {
		//1.获取用户名和密码的内容(把获取的内容去空格)
		//val()获得匹配元素的当前值 返回值:String,Array
		let account = $account.val().trim();
		let password = $password.val().trim();

		//2.对用户名和密码进行格式的校验
		//每个公司对校验的格式都有所不同
		//这里只对非空做校验
		if (!account || !password) {
			alert('当前的用户名或者密码不能为空', {
				handled: function () {
					//当前的回调函数会在alert框消失之后或者用户点击x号的时候执行
				}
			});
			return; //阻止代码继续往下运行
		}

		//3.对密码进行md5加密
		password = md5(password);

		//4.发送登录的请求
		let res = await axios.post('/user/login', {
			account,
			password
		});
		console.log(res);
		let {
			code,
			codeText,
			power
		} = res;
		if (code == 0) {
			alert('登陆成功', {
				handled: function () {
					//当登陆成功以后，先把power存储到localStorage中，然后再跳转到index.html主页面
					//权限
					localStorage.setItem('power', encodeURIComponent(power));

					//当前用户名
					localStorage.setItem('account',encodeURIComponent(account));
					window.location.href=`index.html`;
					// window.location.href=`index.html?account=${account}`;
				}
			});
		} else if (code == 1) {
			alert('用户名和密码不匹配');
			//登陆失败，清空用户名和密码
			$account.val('');
			$password.val('');
		} else if (code == 2) {
			alert('请先注册账号');
			$account.val('');
			$password.val('');
		}

	});
	
}())
