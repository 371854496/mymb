// components/mySwiper/component.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
      swiperList:{
          type:Array,
          value:[]
      },
      height:{
          type:String,
          value:""
      },
      picurl:{
          type: String,
          value: ""
      }
  },

  /**
   * 组件的初始数据
   */
  data: {
      swiperActiveIndex:0,
  },

  /**
   * 组件的方法列表
   */
  methods: {
      swiperChange(e) {
          let self = this;
          self.setData({
              swiperActiveIndex: e.detail.current
          })
      },
    banTap: function (e) {
      let bantype = e.currentTarget.dataset.id.linkurl;
      console.log("bantype", bantype);
      if (bantype == "") {
        return;
      }
      let pd = JSON.parse(bantype);
      console.log(pd.type);

      if (pd.type == "item") {
        wx.navigateTo({
          url: '/pages/item/detail/index?itemid=' + pd.id,
        })
      } else if (pd.type == "category") {

    
        wx.switchTab({
          url: '/pages/project/index'
        })
      } else if (pd.type == "article") {
        wx.navigateTo({
          url: '/pages/mine/index'
        })
      } else if (pd.type == "aboutus") {
        wx.navigateTo({
          url: '/pages/mine/article/index'
        })
      }
    },
  }
})
