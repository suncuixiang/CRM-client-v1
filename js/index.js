(function(){
    //校验当前用户是否非法进入
    axios.get('/user/login').then(res=>{
        let {code}=res;
        if(code==0){
            //用户正常登入
            return  axios.get('/user/info');
        }else{
            //用户非法登入，打回登录面
            alert('非法登录',{
                handled:function(){
                    location.href='login.html';
                }
            });
        }
    }).then(res=>{
        /* let name=res && res.data && res.data.name;
        $('.baseBox').find('span').html(`您好：${name}`) */
        let account=decodeURIComponent(localStorage.getItem('account')) || '';
        $('.baseBox').find('span').html(`您好：${account}`);
    })
}());

(function(){
    //点击logo收起、展开菜单
    let flag=true;//默认展开
    let $logo=$('.logo');
    let $menuBox = $('.menuBox');
    $logo.click(function(){
        if(flag){
            flag=false;
            $logo.find('span').css('display','none');
            $menuBox.css('display','none');
        }else{
            flag=true;
            $logo.find('span').css('display','inline');
            $menuBox.css('display','block');
        }
    });
}());

(function(){
	let $headerBox=$('.headerBox');
	let $footerBox=$('.footerBox');
	let $container=$('.container');
    let $menuBox = $('.menuBox');
    //动态计算当前container元素的高度：屏幕总高度-header高度-footer高度
    function computed(){
        let winH=$(window).height();
        let headerH=$headerBox.outerHeight();//获取第一个匹配元素外部高度（默认包括补白padding和边框border）。设置为 true 时，计算边距margin在内。
        let footerH=$footerBox.outerHeight();
        // console.log(winH,headerH,footerH)
        $container.css('height',winH-headerH-footerH);
    }
    computed();
    $(window).on('resize',computed);//当前的屏幕的尺寸一旦发生变化，resize事件对应的方法就会被触发

    //获取用户权限
    let power=decodeURIComponent(localStorage.getItem('power')) || '';
    //动态处理左侧菜单按照权限进行不同的显示
    axios.get('/user/router').then(res=>{
        // console.log(res);
        let str=``;
        res.forEach(item=>{
            let {
                title,
                icon,
                children
            }=item;
            str+=`
                <div class="itemBox">
                    <h3>
                        <i class="iconfont ${icon}"></i>
                        ${title}
                    </h3>
                    <nav class="item">
                        ${children.map(item=>{
                            let {
                                subTitle,
                                href,
                                flag
                            }=item;
                            return power.includes(flag)?`<a href="${href}"
                            target="_iframe">${subTitle}</a>`:'';
                        }).join('')}
                    </nav>
                </div>
            `;
        });
        $menuBox.html(str);

        //子菜单收起和展开动画
        $menuBox.click(function(e){
            let target=e.target;//事件源
            let $target=$(target);//转成jQuery对象(为了使用jQuery方法)
            let tagName=target.tagName;//元素大写标签名
            //如果点击的是i标签，就将事件源换成h3标签
            tagName==='I'?($target=$target.parent(),tagName='H3'):null;

            if(tagName==='H3'){
                let $nav=$target.next();
                $nav.stop().slideToggle();
            }
        });

        //header中按钮功能
        let $itemBox=$menuBox.find('div'),          
            $organize=$itemBox.filter(':lt(3)'),
            $customer=$itemBox.eq(3),
            $navBtn=$('.navBox a'),
            $exitBtn=$('.baseBox a');
        //页面刷新时，刷新前后保持同一个页面
        //方法一：用localStorage去做
        //方法二：用hash值去做
        //因为他们在刷新的时候值都不会变化
        let initIndex=0;
        //通过hash的值去改变initIndex的值，如果当前页面的hash是organize，initIndex对应的值是0；如果hash的值是customer，那initIndex对应的值是1
        let hash=location.href.queryURLParams()['HASH'] || 'organize';
        if(hash==='customer') initIndex=1;

        function change(index){
            //判断一下当前用户点击的元素的索引是谁，如果是0，那就说明点击的是第一个按钮，就让第一大组模块显示；如果索引是1，那就说明点击的是第二个按钮，这时候让第二大组模块显示。
            //给当前点击的元素增加类型，同时给他兄弟移除类名
            $navBtn.eq(index).addClass('active').siblings().removeClass('active');
            if(index==0){
                $organize.css('display','block');
                $customer.css('display','none');
                $('iframe').attr('src','page/userlist.html');
            }else{
                $customer.css('display','block');
                $organize.css('display','none');
                $('iframe').attr('src','page/customerlist.html?lx=my');
            }
        }
        change(initIndex);

        $navBtn.click(function(){
            let index=$(this).index();
            change(index);
        });

        //点击退出，退出登录并返回到登录页
        $exitBtn.click(function(){
            axios.get('/user/signout').then(res=>{
                let {
                    code
                }=res;
                if(code==0){
                    alert('登出成功，3秒后回到登录页面',{
                        handled(){
                            localStorage.removeItem('account');
                            localStorage.removeItem('power');
                            location.href = 'login.html';
                        }
                    });
                    return;
                }
                alert('操作失败');
            });
        });
    });
}());