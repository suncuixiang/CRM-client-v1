let visitModule = (function () {
    let customerId = null;
    let $tbody = $('tbody'),
        $visitTime = $('.visitTime'),
        $visitText = $('.visitText'),
        $submit = $('.submit');
    //=>让默认的拜访日期是明天
    // let time = new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toLocaleString().split(' ')[0];
    //=>让默认的拜访日期是今天
    let time = (new Date).toLocaleString().split(' ')[0].formatTime('{0}-{1}-{2}');
    $visitTime.val(time);

    let bindVisitList = () => {
        return axios.get('/visit/list',{
            params:{
                customerId
            }
        }).then(res=>{
            let {
                code,
                data
            }=res;
            if(code==0){
                let str=``;
                data.forEach(item => {
                    let {
                        id,
                        visitText,
                        visitTime
                    }=item;
                    str+=`<tr data-id='${id}'>
                    <td class="w10">${id}</td>
                    <td class="w15">${visitTime}</td>
                    <td class="w50 wrap">${visitText}</td>
                    <td class="w10">
                        <a href="javascript:;">删除</a>
                    </td>
                    </tr>`;
                });
                $tbody.html(str);
            }else {
				$tbody.html('');
			}
        });
    };

    let bindDelete=()=>{
        $tbody.click(function(e){
            let target=e.target;
            let $target=$(target);
            let tagName=target.tagName;
            let targetVal=target.innerText.trim();
            let visitId=$target.parent().parent().attr('data-id');
            if(tagName==='A'&&targetVal==='删除'){
                alert('您确定要删除吗？',{
                    confirm:true,
                    handled(msg){
                        if(msg!='CONFIRM') return;
                        axios.get('/visit/delete',{
                            params:{
                                visitId
                            }
                        }).then(res=>{
                            let {
                                code
                            }=res;
                            if(code==0){
                                bindVisitList();
                            }else{
                                return Promise.reject();
                            }
                        }).catch(()=>{
                            alert('操作失败');
                        })
                    }
                });
            }
        })
    };

    let bindSubmit=()=>{
        $submit.click(()=>{
            if($visitText.val().trim()==''){
                alert('请输入内容');
                return;
            }
            axios.post('/visit/add',{
                customerId,
                visitTime:$visitTime.val(),
                visitText:$visitText.val().trim()
            }).then(res=>{
                let {
                    code
                }=res;
                if(code==0){
					alert('操作成功',{
						handled(){
							bindVisitList();
							$visitText.val('');
						}
					})
				}else{
					alert('操作失败');
				}
            })
        })
    };

    return {
        init() {
            customerId = window.location.href.queryURLParams().customerId || "";
            bindVisitList();
            bindDelete();
            bindSubmit();
        }
    }
}());

visitModule.init();