// components/scoreList/component.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
        scoreList:{
            type:Array,
            value:[]
        }
  },

  /**
   * 组件的初始数据
   */
  data: {
      gradeArr: ["非常不满意", "不满意", "一般", "满意", "非常满意"],
      gradeIcon: "../../static/images/grade_icon@3x.png",
      gradeIconActive: "../../static/images/grade_icon_selected@3x.png"
  },

  /**
   * 组件的方法列表
   */
  methods: {
      previewImg(e){
          let data = e.currentTarget.dataset;
          wx.previewImage({
              ...data,
              success(res){
                console.log('res',res);
              },
              fail(e){
                console.log('e',e);
              }
          });
      }
  }
})
