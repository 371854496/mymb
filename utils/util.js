const getTime = (date=new Date()) => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()
    return{
        year:year,
        month:month,
        day:day,
        hour: hour,
        minute: minute,
        second: second
    }
}
const formatNumber = n => {
    n = n.toString()
    return n[1] ? n : '0' + n
}
// 格式化日期为"yyyy-mm-dd"
const formatDay = date => {
    let dateObj = getTime(date);
    return [dateObj.year, dateObj.month, dateObj.day].map(formatNumber).join('-')
}
// 当前日期加一
const dateAdd=(date)=> {
    date = +date + 1000 * 60 * 60 * 24;
    date = new Date(date);
    return formatDay(date);
}
// 去掉前后空格
const trim=(str)=> {
    return str.replace(/(^\s*)|(\s*$)/g, "");
}
const requestPromisify = (fn) => {
    return (obj = {}) => {
        return new Promise((resolve, reject) => {
            obj.success = resolve
            obj.fail = reject
            fn(obj)
        })
    }
}
let getRandomNum = function () {
    let timestamp = Date.now();
    let str = `${timestamp}`;
    for (let i = 0; i < 4; i++) {
        str += `${Math.floor(Math.random() * 10)}`
    }
    return str;
}
// 格式化当前时间
let setCurrentTime=function(time){
    let h = Math.floor(time / 3600);
    let m = Math.floor((time - h * 3600) / 60);
    let s = Math.floor(time % 60);
    return {
        time: time,
        h: formatNumber(h),
        m: formatNumber(m),
        s: formatNumber(s)
    }
}
module.exports = {
    formatNumber,
    getTime,
    formatDay,
    dateAdd,
    trim,
    requestPromisify,
    getRandomNum,
    setCurrentTime
}