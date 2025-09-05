

export const getToday=()=>{
    var day = new Date()
return day.toISOString().split('T')[0]
}
//昨天时间
export const getYesterday=()=>{
    var day = new Date()
    day.setDate(day.getDay()-1)
    return  day.toISOString().split('T')[0]
}
//本月时间
export const getThisMonth=()=>{
    var day = new Date()
    day.setDate(day.getDay()+30)
    return day.toISOString().split('T')[0]
}

//近7天
export const getWeek=()=>{
    var day = new Date()
    day.setDate(day.getDay()+7)
    return day.toISOString().split('T')[0]
}

//近15天
export const getHalfMoon=()=>{
    var day = new Date()
    day.setDate(day.getDay()+15)
    return day.toISOString().split('T')[0]
}

