let userListModule = (function () {
    let $deleteAll = $('.deleteAll'); //批量删除
    let $select = $('.selectBox'); //下拉框
    let $search = $('.searchInp'); //搜索框
    let $thead = $('thead');
    let $headTh = $thead.find('th'); //每个表头
    let $tbody = $('tbody');

    let power = decodeURIComponent(localStorage.getItem('power'));
    // 检验权限
    let checkPower = () => {
        if (!power.includes('userhandle')) {
            $deleteAll.remove(); //移除批量删除按钮
            $headTh.first().remove(); //移除复选框
            $headTh.last().remove(); //移除操作按钮
        }
    };
    // 下拉框
    let bindSelect = () => {
        return axios.get('/department/list').then(res => {
            let {
                code,
                data
            } = res;
            if (code == 0) {
                let str = `<option value="0">全部</option>`;
                data.forEach(item => {
                    let {
                        id,
                        name
                    } = item;
                    str += `<option value="${id}">${name}</option>`;
                });
                $select.html(str);
            }
        })
    };

    //用户列表
    let tableData = null;
    let render = () => {
        axios.get('/user/list').then(res => {
            let {
                code,
                data
            } = res;
            tableData = data;
            if (code == 0) {
                renderTable(tableData);
            } else {
                $tbody.html('');
            }
        }).then(res => {
            checkBox();
            searchHandle();
        });
    };

    let renderTable1 = (tableData) => {
        let str = ``;
        tableData.forEach(item => {
            let {
                id,
                name,
                sex,
                job,
                department,
                email,
                phone,
                desc
            } = item;
            str += `
                    <tr data-id='${id}' data-name='${name}'>
                        ${power.includes('userhandle') ? '<td class="w3"><input type="checkbox"></td>' : ''}
                        <td class="w10">${name}</td>
                        <td class="w5">${sex == 0 ? '女' : '男'}</td>
                        <td class="w10">${department}</td>
                        <td class="w10">${job}</td>
                        <td class="w15">${email}</td>
                        <td class="w15">${phone}</td>
                        <td class="w20">${desc}</td>
                        ${
                            power.includes('userhandle') ? `
                            <td class="w12">
                            <a href="useradd.html?userId=${id}">编辑</a>
                            <a href="javascript:;">删除</a>
                            ${power.includes('resetpassword')?`<a href="javascript:;">重置密码</a>`:''}
                            </td>`:''
                        }
                    </tr>
                    `;
        });
        $tbody.html(str);
    };

    let renderTable = (tableData) => {
        let str = ``;
        tableData.forEach(item => {
            let {
                id,
                name,
                sex,
                job,
                department,
                email,
                phone,
                desc
            } = item;
            str += `
                    <tr data-id='${id}' data-name='${name}'>
                        ${power.includes('userhandle') ? '<td class="w3"><input type="checkbox"></td>' : ''}
                        <td class="w5"><input type="text" value="${name}" disabled></td>
                        <td class="w5"><input type="text" value="${sex == 0 ? '女' : '男'}" disabled></td>
                        <td class="w10"><input type="text" value="${department}" disabled></td>
                        <td class="w10"><input type="text" value="${job}" disabled></td>
                        <td class="w15"><input type="text" value="${email}" disabled></td>
                        <td class="w15"><input type="text" value="${phone}" disabled></td>
                        <td class="w15"><input type="text" value="${desc}" disabled></td>
                        ${
                            power.includes('userhandle') ? `
                            <td class="w20">
                            <a href="useradd.html?${decodeURIComponent(`userId=${id}&name=${name}&sex=${sex}&department=${department}&job=${job}&email=${email}&phone=${phone}&desc=${desc}`)}">编辑1</a>
                            <a href="javascript:;">编辑2</a>
                            <a href="javascript:;">删除</a>
                            ${power.includes('resetpassword')?`<a href="javascript:;">重置密码</a>`:''}
                            </td>`:''
                        }
                    </tr>
                    `;
        });
        $tbody.html(str);
    };

    //模糊搜索
    let lastDepId = null; //上一次下拉框值
    let searchHandle = () => {
        // 下拉框
        $select.on('change',function(){
            let departmentId = $select.val();
            //上一次查询条件与本次一样
            if (departmentId === lastDepId) return;
            lastDepId = $select.val();

            let filterData = tableData.filter(item=>{
                return item['departmentId']==departmentId;
                /* for (let key in item) {
                    // if (!Object.hasOwnProperty.call(item, key)) return;
                    if (key=='departmentId') {
                        return item[key]==departmentId;
                    }
                } */
            })
            if(departmentId==0){
                renderTable(tableData);
            }else{
                renderTable(filterData);
            }

        });
        // 搜索框
        $search.on('keydown',function(e){
            let key=e.keyCode;
            if(key==13){
                let search = $search.val();
                // 姓名name 邮箱email 手机号phone
                /* let filterData =[];
                for(let i=0;i<tableData.length;i++){
                    let item=tableData[i];
                    for (let key in item) {
                        // if (!Object.hasOwnProperty.call(item, key)) return;
                        let flag1=false,
                            flag2=false,
                            flag3=false;
                        // console.log(key);
                        if (key=='name') {
                            flag1=item[key].includes(search);
                        }
                        if (key=='phone') {
                            flag2=item[key].includes(search);
                        }
                        if (key=='email') {
                            flag3=item[key].includes(search);
                        }
                        if(flag1||flag2||flag3){
                            filterData.push(item);
                        };
                    }
                } */
                // console.log(filterData);
                let filterData = tableData.filter((item) => {
                    let { phone, email, name } = item;
                    return (
                        phone.includes(search) ||
                        email.includes(search) ||
                        name.includes(search)
                    );
                });    
                if(search==''){
                    renderTable(tableData);
                }else{
                    renderTable(filterData);
                }
            }
        });
    }

    let deleteHandle=(userId)=>{
        tableData=tableData.filter(item=>{
            return item['id']!=userId;
        })
        // renderTable(tableData);
    }

    //列表操作
    let originData={};
    let bindHandle=()=>{
        $tbody.click(function(e){
            let target=e.target;
            let $target=$(target);
            let tagName=target.tagName;
            let targetVal=target.innerText.trim();
            //获取当前点击的列表行的id和name
            let $curRow=$target.parent().parent();
            let userId=$curRow.attr('data-id');
            let userName=$curRow.attr('data-name');

            //重置密码
            //重置为初始密码000000
            if(tagName==='A'&&targetVal=='重置密码'){
                alert(`您确定要重置${userName}的密码吗？`,{
                    title:'当前为风险操作！',
                    confirm:true,
                    handled:msg=>{
                        if(msg!=='CONFIRM') return;
                        axios.post('/user/resetpassword',{
                            userId
                        }).then(res=>{
                            let {
                                code
                            }=res;
                            if(code==0){
                                alert('操作成功')
                            }else{
                                alert('操作失败，请重试');
                            }
                        })
                    }
                })
            }

            //删除用户
            
            if(tagName==='A'&&targetVal=='删除'){
                alert(`您确定要删除${userName}吗？`,{
                    title:'当前为风险操作',
                    confirm:true,
                    handled:msg=>{
                        if(msg!=='CONFIRM') return;
                        axios.get('/user/delete',{
                            params:{
                                userId
                            }
                        }).then(res=>{
                            let {
                                code
                            }=res;
                            if(code==0){
                                alert('操作成功',{
                                    handled:()=>{
                                        // render();
                                        // $curRow.remove();
                                        deleteHandle(userId);
                                        renderTable(tableData);
                                    }
                                })
                            }else{
                                alert('操作失败，请重试');
                            }
                        })
                    }
                })
            }

            //编辑用户
            if(tagName==='A'&&targetVal=='编辑2'){
                target.innerText='保存';
                $curRow.find('input').filter(':gt(0)').each((index,item)=>{
                    $(item).prop("disabled",false).css("border-color","rgba(0,0,0,.05)");
                    originData[index]=$(item).val();
                });
            }
            if(tagName==='A'&&targetVal=='保存'){
                target.innerText='编辑2';
                let temp={};
                $curRow.find('input').filter(':gt(0)').each((index,item)=>{
                    $(item).prop("disabled",true).css("border-color","transparent");
                    temp[index]=$(item).val();
                });
                let upData={
                    id:userId,
                    name: temp[0],
                    sex: temp[1]=='男'?1:0,
                    department: temp[2],
                    job: temp[3],
                    email: temp[4],
                    phone: temp[5],
                    desc: temp[6]
                };
                // console.log(upData);
                axios.post('/user/update',upData).then(res=>{
                    let {
                        code
                    }=res;
                    if(code==0){
                        alert('操作成功',{
                            handled(){
                                tableData.filter(item=>{
                                    if(item['id']==userId){
                                        for (let key in item) {
                                            if (upData.hasOwnProperty(key)) {
                                                item[key]=upData[key];
                                            }
                                        }
                                    }
                                })
                            }
                        });
                    }else{
                        // alert('操作失败');
                        return Promise.reject();
                    }
                }).catch(()=>{
                    alert('操作失败',{
                        handled(){
                            $curRow.find('input').filter(':gt(0)').each((index,item)=>{
                                $(item).val(originData[index]);
                            });
                        }
                    });
                });
            } 
        })
    }

    //复选框
    let checkBox=()=>{
        let allCheck=$headTh.find('input');//全选框
        let everyCheck=$tbody.find('input');//每一行的复选框
        allCheck.click(function(){
            let flag=$(this).prop('checked');//选中为true，未选中为false
            everyCheck.prop('checked',flag);//把当前全选框的状态赋值给每一行的复选框
        });
        everyCheck.click(function(){
            //循环查看每一行复选框的状态，如果有一个是false，那就把全选框状态置为false，如果每一行的复选框都是true，那就把全选框状态置为true
            let flag=true;//初始全选框状态
            everyCheck.each(item=>{
                let checked=$(item).prop('checked');
                if(!checked){
                    flag=false;
                    return false;
                }
            });
            allCheck.prop('checked',flag);
        })
    }

    //批量删除
    let bindDeleteAll=()=>{
        // let rows=[];
        let users=[];
        function deleteAll(index,$checks){
            if(index>=$checks.length){
                alert('操作成功',{
                    handled(){
                        // render();
                        /* $(rows).each((index,item)=>{
                            $(item).remove();
                        }) */
                        for(let i=0;i<users.length;i++){
                            deleteHandle(users[i]);
                        }
                        renderTable(tableData);

                    }
                });
                return;
            }
            let $curCheck=$checks.eq(index);
            let $curRow=$curCheck.parent().parent();
            // rows.push($curRow);
            let userId=$curRow.attr('data-id');
            users.push(userId);
            axios.get('/user/delete',{
				params:{
					userId
				}
			}).then(res=>{
				let {
                    code
                }=res;
				if(code==0){
					deleteAll(index+1,$checks);
				}
			});
        }

        $deleteAll.click(function(){
            let isChecked=$tbody.find('input').filter((index,item)=>{
                return $(item).prop('checked');
            });
            if(isChecked.length<=0){
                alert('请先选中您要删除的数据');
                return;
            }
            alert(`您确定要删除当前的${isChecked.length}条数据吗？`,{
                confirm:true,
                handled(msg){
                    if(msg!="CONFIRM") return;
					deleteAll(0,isChecked);
                }
            })
        })
    }

    return {
        init() {
            checkPower();
            bindSelect().then(() => {
                render();
            }).catch(() => {
                alert('操作失败')
            });
            bindHandle();
            bindDeleteAll();
        }
    }
}());
userListModule.init();