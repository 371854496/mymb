import Server from '../server/server.js';
import api from './api.js';
import qiniuUploader from "../libs/qiniuUploader.js";
const extData = wx.getExtConfigSync();
let $http = new Server();
let responseID = $http.interceptors.response.use(res => {
    return res;
})

let $qinniu = {};
export default $qinniu;

$qinniu.token = function (params, other) {
    return $http.post(api.qiniu_token, params, other)
}
$qinniu.uploadImg = function (randomKey, callback, progress) {
    $qinniu.token().then(res => {
        if (res.data.result == 1) {
            let ops = {
                imageUrl: extData.qiniu.imageUrl || 'http://pic.meisaas.com',
                region: extData.qiniu.region || 'ECN',
                uptoken: res.data.data.token
            };
            wx.chooseImage({
                count: 1,
                success(res) {
                    let filePath = res.tempFilePaths[0];
                    let imgFormat = filePath.substring(filePath.lastIndexOf('.'));
                    let imgUrl ='wechat/'+randomKey + imgFormat;
                    qiniuUploader.upload(filePath, (res) => {
                        let tempFilePaths = ops.imageUrl + res.imageURL;
                        callback({
                            msg: 'OK',
                            data: {
                                tempFilePaths: tempFilePaths
                            }
                        })
                    }, (error) => {
                        callback({
                            msg: '',
                            data: null
                        })
                    }, {
                            region: ops.region,
                            key: randomKey+imgFormat,
                            uptoken: ops.uptoken,
                    },(res) => {
                            progress(res);
                    })
                }
            })
        } else {
            callback({
                msg: res.data.msg,
                data: null
            })
        }
    })
}
