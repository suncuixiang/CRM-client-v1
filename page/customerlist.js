let customerListModule = (function () {
    let $selectBox = $('.selectBox'), //客户类型
        $search = $('.searchInp'), //搜索框
        $tbody = $('tbody'), //客户列表
        $pageBox = $('.pageBox'); //分页器

    let lx = '',
        limit = 10, //发送数据请求的时候每一页请求的数据条数
        page = 1; //当前请求的页码

    //模糊搜索
    let searchData=(search,data)=>{
        data=data.filter(item=>{
            let {
                name,
                phone,
                email,
                QQ,
                weixin
            }=item;
            return name.includes(search) || phone.includes(search) || email.includes(search) || QQ.includes(search) || weixin.includes(search);
        });
        return data;
    };
    //分页处理
    let pageHandle=(totalPage,data)=>{
        let result=[];
        if(page<=totalPage){
            let i=(page-1)*limit,
                len=page*limit-1;
            for(;i<=len;i++){
                let item=data[i];
                if(!item) break;
                let {
                    id,
                    name,
                    sex,
                    email,
                    phone,
                    QQ,
                    weixin,
                    type,
                    address,
                    userName
                }=item;
                result.push({
                    id,
                    name,
                    sex,
                    email,
                    phone,
                    QQ,
                    weixin,
                    type,
                    address,
                    userName
                });
            }
        }
        return result;
    };
    //数据渲染
    let render=()=>{
        let type=$selectBox.val();
        let search=$search.val().trim();
        axios.get('/customer/list',{
            params:{
                lx
            }
        }).then(res=>{
            let {
                code,
                data
            }=res;
            if(code==0){
                if(search!=='') data=searchData(search,data);
                if(type!=='') data=data.filter(item=>item.type==type);
                //分页
                let totalPage=Math.ceil(data.length/limit);
                data=pageHandle(totalPage,data);
				//=>渲染列表数据
                $pageBox.css('display','block');
				let str = ``;
				data.forEach(item => {
					let {
						id,
						name,
						sex,
						email,
						phone,
						QQ,
						weixin,
						type,
						address,
						userName
					} = item;
					str += `<tr data-id="${id}" data-name="${name}">
						<td class="w8">${name}</td>
						<td class="w5">${parseInt(sex)==1?'女':'男'}</td>
						<td class="w10">${email}</td>
						<td class="w10">${phone}</td>
						<td class="w10">${weixin}</td>
						<td class="w10">${QQ}</td>
						<td class="w5">${type}</td>
						<td class="w8">${userName}</td>
						<td class="w20">${address}</td>
						<td class="w14">
							<a href="customeradd.html?customerId=${id}">编辑</a>
							<a href="javascript:;">删除</a>
							<a href="visit.html?customerId=${id}">回访记录</a>
						</td>
					</tr>`;
				});
                $tbody.html(str);
                
                let arr = [];
				for (let i = 0; i < totalPage; i++) {
					arr.push(i + 1);
				}
                let str1 = `
                    ${page > 1 ? '<a href="javascript:;">上一页</a>' : ""}
					<ul class="pageNum">
						${arr.map((item, index) => {
							return `<li class="${item == page ? "active" : ""}">${item}</li>`;
						}).join("")}
					</ul>
                    ${page == totalPage? "": '<a href="javascript:;">下一页</a>'}
                    <span class="jumpTo">跳转到
                        <input type="text">
                    </span>
				`;
                $pageBox.html(str1);

                bindJumpTo();

			}else{
				$tbody.html('');
				$pageBox.css('display','none');
			}
        });
    };

    let bindSelect=()=>{
		$selectBox.on('change',function(){
			page=1;
			render();
		});
		$search.on('keydown',function(e){
			if(e.keyCode===13){
				page=1;
				render();
			}
        });
    };
    
    let bindDelete=()=>{
        //进行每一个客户的删除操作
        $tbody.click(function(e){
            let target=e.target;
            let tagName=target.tagName;
            let targetVal=target.innerText.trim();
            //获取当前点击的行的id和name
			let customerId=$(target).parent().parent().attr('data-id');
            let customerName=$(target).parent().parent().attr('data-name');
            //删除
			if(tagName==='A'&&targetVal=='删除'){
				alert(`确定要删除${customerName}吗？`,{
					title:'当前为风险操作',
					confirm:true,
					handled:msg=>{
						if(msg!=='CONFIRM')return;
						axios.get('/customer/delete',{
							params:{customerId}
						}).then((res)=>{
							let {code} = res;
							if(code==0){
								alert('操作成功',{
									handled:()=>{
										render();
									}
								});
							}else{
								alert('操作失败');
							}
						});
					},
				})
			}
        });
    };

	let pageSelect=()=>{
		$pageBox.click(function(e){
			let target=e.target;
			let tagName=target.tagName;
			let targetVal=target.innerText;
			if (tagName == 'A') {
				if (targetVal == '上一页') {
					if(page<=0) return;
					page--;
				}
				if (targetVal == '下一页') page++;
				render();
				return;
			}
			if (tagName == 'LI') {
				let curPage=parseInt(targetVal);
                page = curPage;
				render();
				return;
			}
        });
    };
    
    //跳转指定页
    let bindJumpTo=()=>{
        $('.jumpTo').find('input').on('keydown',function(e){
            if(e.keyCode===13){
                page=$(this).val();
                render();
			}
        });
    };

    return {
        init() {
            //=>获取传递参数的信息
            lx = location.href.queryURLParams().lx || 'my';
            render();
            bindSelect();
            bindDelete();
            pageSelect();
        }
    }
})();
customerListModule.init();