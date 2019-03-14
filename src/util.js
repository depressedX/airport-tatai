export const Formatter = {
    formatTime(d){
        if (!(d instanceof Date)) {
            d = new Date(d)
        }
        var h = d.getHours(),
            m = d.getMinutes()
        return h + ':' + (m < 10 ? '0' + m : m)
    },
    formatDate(d){
        if (!(d instanceof Date)) {
            d = new Date(d)
        }
        return `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`
    }
}