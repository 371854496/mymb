// components/imgload/component.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        lazyLoad: {
            type: Boolean,
            value: true
        },
        mode: {
            type: String,
            value: "aspectFill"
        },
        src: {
            type: String,
            value: ""
        },
        styleImg: {
            type: String,
            value: ""
        },
        defalutImg:{
            type:String,
            value: "/static/images/img_default.png"
        },
        errorImg:{
            type: String,
            value: "/static/images/img_error.png"
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        bol: false,
    },
    /**
     * 组件的方法列表
     */
    methods: {
        imgError(e) {
            let self = this;
            self.setData({
                src: self.data.errorImg
            });
        },
        imgLoad(e) {
            let self = this;
            let src = self.data.src ? self.data.src : self.data.errorImg;
            self.setData({
                bol: true,
                src: src
            });
        }
    }
})
