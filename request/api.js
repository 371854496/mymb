export default{
    member_login: '/api/weixin/login',//用户登录注册
    member_userinfo: '/api/weixin/userinfo',//获取用户基本信息
    member_phonenumber: '/api/weixin/phonenumber',//手机号解密
    membercard_get: '/api/membercard/get',//会员卡开卡查询
    item_list: '/api/item/list',//商品列表
    item_detail: '/api/item/get',//商品详情
    item_recommend: '/api/item/recommend',//精品推荐商品列表
    item_listmarke: '/api/item/listmarke',//商品营销列表
    item_countorder:'/api/item/countorder',//商品购买数量
    category_list: '/api/category/list',//商品分类列表
    category_recommend: '/api/category/recommend',//	商品分类（首页推荐）
    order_list: '/api/order/list',//订单列表
    order_del:'/api/order/del',//订单删除
    order_update: '/api/order/update',//订单修改
    order_createserve: '/api/order/createserve',//服务订单创建
    order_createmarke:'/api/order/createmarke',//服务商品营销类创建订单
    order_createvirtual: '/api/order/createvirtual',//在线买单支付
    order_listvirtual:'/api/order/listvirtual',//在线买单列表
    order_checkordermodel:'/api/order/checkordermodel',//统计和限制免费体验
    order_createcoupon:'/api/order/createcoupon',//创建优惠券订单
    article_list: '/api/article/list',//内容列表 
    articletype_list: '/api/articletype/list',//内容分类列表
    payment_send: '/api/payment/send',//请求微信支付
    company_contact:'/api/company/contact',//关于我们
    qiniu_token:'/api/qiniu/token',//获取七牛token
    itemevaluate_add:'/api/itemevaluate/add',//商品评价添加
    itemevaluate_list:'/api/itemevaluate/list',//商品评价列表
    membercoupon_list: '/api/membercoupon/list',//用户优惠券列表
    membercoupon_add: '/api/membercoupon/add',//用户优惠券添加(注册返券)
    coupon_list:'/api/coupon/list',//优惠券列表
    coupon_get:'/api/coupon/get',//优惠券详情
    itemgroupon_list: '/api/itemgroupon/list',//营销商品列表
    itemgroupon_get: '/api/itemgroupon/get',//获取营销商品详情
    ordergroupon_list:'/api/ordergroupon/list',//拼团信息列表
    ordergroupon_get: '/api/ordergroupon/get',//拼团信息详情
    ordergroupon_check: '/api/ordergroupon/check',//拼团信息检验
    itembargains_get:'/api/itembargains/get',//砍价信息详情
    itembargains_list: '/api/itembargainassist/list',//砍价用户信息列表
    itembargains_add: '/api/itembargains/add',//砍价信息添加(自砍一刀)
    itembargains_edit: '/api/itembargains/edit',//砍价信息修改(好友帮忙砍价)
    appointment_get:'/api/appointment/get',//预约订单详情 
    swiper_list: '/api/swiper/list',//轮播图
    indexcategory_recommend: '/api/category/recommend',//首页分类图标
    itemrecommend_recommend: '/api/item/recommend',//首页推荐商品 
    couponlist_list: '/api/coupon/list',//优惠卷列表
    couponinsert_insert: '/api/membercoupon/insert',//领取优惠卷
    aboutus_list: '/api/company/aboutus'//关于我们
}