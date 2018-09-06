// components/dialog/component.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
      showModal:{
          type:Boolean,
          value:false
      },
      price:{
          type:String,
          value:""
      },
      title:{
         type:String,
         value:"", 
      },
      content:{
          type: String,
          value: "",
      },
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
      /**
       * 弹出框蒙层截断touchmove事件
       */
      preventTouchMove: function () {
          console.log(1);
      },
      /**
       * 隐藏模态对话框
       */
      hideModal() {
          this.triggerEvent("hideModal");
      }
  }
})
