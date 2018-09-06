// components/itemNav/component.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
      navArr:{
          type:Array,
          value:[]
      },
    curId: {
      type: Number,
      value: 0,
      observer(newval, oldval) {
        this.setData({ 'activeId': newval })
        console.log('caid', newval)
        console.log('this.data', this.data)
      },
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    activeId: 0,
  },
  attached() {
    this.setData('activeId', this.data.curId)
  },
  /**
   * 组件的方法列表
   */
  methods: {
      navBtn(e) {
          console.log("eee",e)
          let id = e.currentTarget.dataset.id;
        
          let self = this;
          // self.setData({
          //     activeId: id
          // });
        self.triggerEvent("changeNav", { activeId: id });
      },
  }
})
