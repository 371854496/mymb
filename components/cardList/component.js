// components/cardList/component.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
        cardList:{
            type:Array,
            value:[]
        },
        cardStatus:{
            type:String,
            value:'未使用'
        },
        activeBgColor:{
            type:String,
            value:"#f33497"
        }
  },

  /**
   * 组件的初始数据
   */
  data: {
      cardBorder:"/static/images/mine/card-border.png"
  },

  /**
   * 组件的方法列表
   */
  methods: {
      chooseCard(e){
          let item = e.currentTarget.dataset.item;
          this.triggerEvent('chooseCard', item);
      }
  }
})
