<script lang="ts">
export default {
  name: 'index',
}
</script>
<script setup lang="ts">
import { ref ,onMounted,reactive} from 'vue';
import { getAssetURL } from '@/common/load_asset';
import $api  from '@/https';
import * as echarts from 'echarts';
import dayjs from "dayjs"
import { showToast } from 'vant';
type EChartsOption = echarts.EChartsOption;
var option: EChartsOption;
const loading = ref<boolean>(false);
const Store:any = reactive({data:{
    todayProfit: 0,  //当日盈亏usdt
    totalUsdt: 0,   //主账户余额
    money:[
        {title:'可用餘額',key:'IndexMoney',count:0,Proportion:0,ico:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAALASURBVHgBrVW7bhNBFL3z8GPXdiITUgC2C4SoQhqnsWgokJCiIKUJSsUXQMkX0IWSjo4OSOMiokKCJkrlghAaikiQEBdRYoGzu/buzlzuLHHiOOtHEp/Cu5rxnjNz7p0zDAYAEdnc4z2rYVkJ/68j7ATnZpx7iD5rh76T9CuFDX919Ynqx8HiBpeWPogaPMxKz0vACGC82Z5NbbpxQucEKpUdq2EzW1uMwQVgdnXkoru7UfT6CpQXfttNABuugFy97tZqc+45AbPygymegTHAPdBOZydR0YznxhYYE7LEZThPBDbbs7GeM67vgeTLcEEYrlqjnDXv0ih99XKpOHLO5FsEKIYpWO+d523YGSQi02nqQGSsQN7bPd6fkDN4yhDMs9RLgBpWUOtXg0SaVHCZLGSS4J12FhlXQi6rSuEzOmlbNFQeRMIln9Gh3oqbs/L5BE8eurJ7UAmcoT2gRvwOw5DAefr9LKR8ETcdpqa4PFdcxT4iVzNC8qoK9SI9XzLGJuMIKEpKiLDFQC+TCKgwPGNZmjlCxn5I/tJHYERIvYihWoQ+0Fp8E0JNUjNU40RY4dHOtU6I9YJGlwHFhEb1BoaAfLjPBK+G7eAOF+JP9D3Fh0xOZBQVmcevDt6RZ//F6DyYlu39D9n4PkpEwV8rrZ93yA1M4lJgekGOygVDYMgR8IwAtXBJCj5PgTNJ5CsQLegUJs6ZOQx3F/am4BLo2KJp5b3kBj/Wbh5Ks47QOgxGzf5uUAetY6in4+YaR4kWcevI++3VfNMUBMYEh7j2v0xHkX1cXKZbxcCBMYG5v1zDGb13T9ygCyd3xQvH5E+968I50571tVuuf90/uoxdxhb34KfTTW7Q595FPv1g385ngzSMgLDVCrY/3W52bBlB4FSoUNlNmcRtUyhmjnPLDbROKl95jUZQr5W96ET0wT9SOkN19EywhAAAAABJRU5ErkJggg=='},
        {title:'期权交易账户',key:'JyMoney',count:0,Proportion:0,ico:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAKjSURBVHgBrVW7bhNBFD13Znaz3jwsiyooiZQOiQ4qlCYSVSQoI/wFcUUZKqQoEh0lVfgBIuUDaNMEJKRUOJREchANEsExWT92dy53Ng+c2Jus5ZxivZ69c86dO/dBuAHMTKg9LwEdD+mphp5Q2YeOZgR/Ehz7PWCuRzs7aR4HDSVeXdWoHE8BiYciSOIuWvejYUI0SP6khFIYIkgJo8Cdqh2JyOd2rgCvPQuBvyHGQiui9/vRxT91Se48H5vcYTo84+oTyGLuwnJXEK6MU2DORH+GMF7hmKcxlsBqpkvxQejpxoCBu7/guyQJmipTMt5EUfI4pjcg4pTsiYG3EseoDrec9phBEqIffkFuIVdVqHTLMi0QqXW22GaihW5XlYduqD0uKVQmCwsQeN7T6ih7ZzTdr0/6g1J2JWeLZ9BhgwAFwSfZU8ilxslofpjahBSR3AMPmuuSUiMVlMZeL1Y1X6u6EH5NUjqwUC+04U9D7VOjDUaAUahL9jQTm1aVO43iqoF+feMepF172cTOEffUOyLMiJd1OXhZgWYYfB57Wzc+v+1zM59d2oc4MCkWibr+jYnL8njl3m22Qufrrg7oyPf4EW6DdFwJURBLiyjWNcFb7lRKo+5SU5OdF90ly6rh+/bjgLm0c3LFgNryvf51l+8EWxbP65LnS4ppPU9SQtm0Fi+HCszu/jZiwLxm4v7e73l2u8/rPanehkRmRe5hISMFNaycRBP2cjNICoA2YbPA8oY0vcOnlZFnQB46EWPxy7ETyC7XvWAxPcVdoa2jjBN984A2dzvAVISx0boy1QZH5sZygEM9OfrIlLA4z28amf9F5GS/lkMkRbtUK8bsfusiLLcKXBH6NjeBygMfHWn/QXhmn1V/z5VwjK39tsvEPI5/SuYYDSZVtTAAAAAASUVORK5CYII='},
        {title:'质押挖矿账户',key:'ZyMoney',count:0,Proportion:0,ico:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAOgSURBVHgBrVVLbBNnEJ75d9frRxJsnEIaBzWUHMoBqQ+atlRQlwNSe+ilVdVDW6hK1UptVaniIeCAwgHEQ0hAhISEIIELIB4nxAUE4k0gCImHghTxip04sZ3YjuN4d//dn/3X+LFO1oDgk9b+d/6Z+eafnX8GoQbYxo0k+v6ZQD7LvDoySRSJaMkJNUARlBzmswvmB8fx6wvUyQdOJ7y17xPJT0kTSuiBVwAipue2eZLTEU0heLp3QUBzSUE0RAKvAYnpuu7Sk3N/u5NyJIh0twcVBYLwBpBlSLYs70kW30tR8sjf1DkH9/H44Id+GwHPOU8LvCUIqhBk58NWQVg/QUqCBqIt55vlTQsXt3/0g89Vll16xsAjlrPqNq2/gstd793d2ldpq6EgRPsnm8xlROTRm84bKhWOyMtDt4QvtxkjYmjZvALvSJbBuUEGH7+LEPAUSJoCADHvt2EyEft+zqPuaKUPhTEvL3Pi0tW6yo1e/Lz+mPDrYYpiqCdifpsUs+RH7xf+H8QZmLcAGmSTwLREQgKDbSsOpJoX10MV+t45EyBe5rYRbMe/VuepGqJaDvhz6t4E9ESYWW4IfjeaaUEYNk/TPAMgRwvPJIitt+et2VBNUC+jRwRZl8EQS8LRJ1fzcb3MOWQ+i2Z/Cv981lKWTQJcjNudNVCaWVpFQIFJpPpCrZ95tlMC3ZbPx7FRm2FCsTsSGI1+93Tnnir/oDOQptzWcN2jzJL6yNpKWSSZtumkNbvN0uGuX+ZPXBqHaUAoNab0jx2NJ242S5lSRJFEGhhjpf0xtawbUIf2hEfsFVQEbx/EJwnqdJunW/Z3ulG/w9c5RYPB0WwhelPbeMHFU7Oq78dOcIBCRIWMK2zSSWHljBv/EzCso/dFR+zRM2OcpwZqQBSVLPng72/GnBR+D1yPtrpSVqoG4oUmOfqCYJY6sNspNUW0tvqzBLHDkBFzTkonQl3dXqQ3+ocKlZQxP7BPT5387+HPh2o55zOCzwerimIGHbamlAP+aOxdm8xMpNJ5DbIqjS6KH++s5Zz74gOIry2ChX/2akGhIeFksKLuytASX/+/9wfTMCvbv+tlqREEI1GcbraBM7D/i5mqoTc6GR6Zva79p+EtPVADLiIk5qy8VrqZU0bm2MGwP6lnGl93ZPK08MhrjswieAu3ZoRkb+NOMNt9rq3NE3uloV9NxNu5R/L6EDV38VQCgqYBF5Bcy8CyFHZ0OBbIc+VnhuIIx9wfAAAAAElFTkSuQmCC'},
    ],
    current:0,
    profitData:[]
}})
const accountList = [
    {name:'充幣',url:'/assetcenter/deposit'},
    {name:'提幣',url:'/assetcenter/withdraw'},
    {name:'劃轉',url:'/assetcenter/transfer'},
    {name:'歷史記錄',url:'/assetcenter/history'},
]
// const testData = [
//     {name:'可用餘額',price:100,},
//     {name:'槓桿量化賬戶',price:0,ico:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAOgSURBVHgBrVVLbBNnEJ75d9frRxJsnEIaBzWUHMoBqQ+atlRQlwNSe+ilVdVDW6hK1UptVaniIeCAwgHEQ0hAhISEIIELIB4nxAUE4k0gCImHghTxip04sZ3YjuN4d//dn/3X+LFO1oDgk9b+d/6Z+eafnX8GoQbYxo0k+v6ZQD7LvDoySRSJaMkJNUARlBzmswvmB8fx6wvUyQdOJ7y17xPJT0kTSuiBVwAipue2eZLTEU0heLp3QUBzSUE0RAKvAYnpuu7Sk3N/u5NyJIh0twcVBYLwBpBlSLYs70kW30tR8sjf1DkH9/H44Id+GwHPOU8LvCUIqhBk58NWQVg/QUqCBqIt55vlTQsXt3/0g89Vll16xsAjlrPqNq2/gstd793d2ldpq6EgRPsnm8xlROTRm84bKhWOyMtDt4QvtxkjYmjZvALvSJbBuUEGH7+LEPAUSJoCADHvt2EyEft+zqPuaKUPhTEvL3Pi0tW6yo1e/Lz+mPDrYYpiqCdifpsUs+RH7xf+H8QZmLcAGmSTwLREQgKDbSsOpJoX10MV+t45EyBe5rYRbMe/VuepGqJaDvhz6t4E9ESYWW4IfjeaaUEYNk/TPAMgRwvPJIitt+et2VBNUC+jRwRZl8EQS8LRJ1fzcb3MOWQ+i2Z/Cv981lKWTQJcjNudNVCaWVpFQIFJpPpCrZ95tlMC3ZbPx7FRm2FCsTsSGI1+93Tnnir/oDOQptzWcN2jzJL6yNpKWSSZtumkNbvN0uGuX+ZPXBqHaUAoNab0jx2NJ242S5lSRJFEGhhjpf0xtawbUIf2hEfsFVQEbx/EJwnqdJunW/Z3ulG/w9c5RYPB0WwhelPbeMHFU7Oq78dOcIBCRIWMK2zSSWHljBv/EzCso/dFR+zRM2OcpwZqQBSVLPng72/GnBR+D1yPtrpSVqoG4oUmOfqCYJY6sNspNUW0tvqzBLHDkBFzTkonQl3dXqQ3+ocKlZQxP7BPT5387+HPh2o55zOCzwerimIGHbamlAP+aOxdm8xMpNJ5DbIqjS6KH++s5Zz74gOIry2ChX/2akGhIeFksKLuytASX/+/9wfTMCvbv+tlqREEI1GcbraBM7D/i5mqoTc6GR6Zva79p+EtPVADLiIk5qy8VrqZU0bm2MGwP6lnGl93ZPK08MhrjswieAu3ZoRkb+NOMNt9rq3NE3uloV9NxNu5R/L6EDV38VQCgqYBF5Bcy8CyFHZ0OBbIc+VnhuIIx9wfAAAAAElFTkSuQmCC'},
//     {name:'智能量化賬戶',price:0,ico:'data:image/png;base64,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'},
//     {name:'量化合約賬戶',price:0,ico:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAA4WlDQ1BzUkdCAAAYlWNgYDzNAARMDgwMuXklRUHuTgoRkVEKDEggMbm4gAE3YGRg+HYNRDIwXNYNLGHlx6MWG+AsAloIpD8AsUg6mM3IAmInQdgSIHZ5SUEJkK0DYicXFIHYQBcz8BSFBDkD2T5AtkI6EjsJiZ2SWpwMZOcA2fEIv+XPZ2Cw+MLAwDwRIZY0jYFhezsDg8QdhJjKQgYG/lYGhm2XEWKf/cH+ZRQ7VJJaUQIS8dN3ZChILEoESzODAjQtjYHh03IGBt5IBgbhCwwMXNEQd4ABazEwoEkMJ0IAAHLYNoSjH0ezAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAEc0lEQVRogc2av3PcRBTHP6sf92tin6HG+QuSig43UJIZZtyQYaAJja/CXdJAkRmoQocru4I09lyKeMaQwB8QOphhAg3MUOQqhozJ3TknySfpUUiKZZ3uTquTnfs0p1utdr9P+/bt00qKChBEfQt1E0wDzBpYDigbVFLHghAIXPD/huAPGD9ABYv2reZXmS76e2g6YPtgl2mjCf5v4C5ijLYBifBjaNoL3IAsDng/wkjXEC0BR0irauFZVmD0AWpUtH4hIV3EtGHFAau8tOKMIPwJ+kVGY64Bj5D6v3DlIu96HmOQJgxvok5n1Zsp6ghpDaFVrTQ95rnUVAOWQXzCLCOMvMIuUlsW8QBDaH2D1PPOTRjQRUwHVi5elh5tuPIhYmbL80agfdkTtgg2qI9zbuw5A46Qlj/FrZYBB6xd5JxrvxLbRcxl8vtpNKApSDrHihhCq6nRkAPXDfhSYKOkloGC/Tp8oXORDWoPmsAIYgO6iOlD7izPw4WrCg6BF8A9HQEp1gU6LvQb8LXOhfEoOAolFsBLsAurj3gfWDXgXRt6epee4UY/HTQNSI+CAbAGDc2+V+OGSouP6QHtMhe+EafwRhz3LyVJqxIfbEGUVcJ9cvHgmopHZhY1+LmC7gDYgZplwsTqVgaBQyngDh58Xoe9KvpcA8tqgOVX0JgJ7wVwdV69GjytoDsADDAtKhoBG3oVTGotFJhWVamDCx8B6+kyA/Zq0K+i/Tx8MCqLPgpuy3kX6is4YIYBJhwEGaN1sEFVZkAd3p513oWN2MjrRNHqd2C3AduL9GuMQRZpoAge3CGKUhuchdprwI4XpSSlMZoVGeDBdx4cevBVutyBGwK302UKniXHAhtu5nxRBALjFKqIogj0wug3O5G3MlX3ZTL36ZyWSClOILRCCKoIQ40pabFErgJRiL1Xh0cKBm70v0OUGLYNeAvNiNUE3whg4Q3WOSR3dl3BqoJB/L9H6lkiLDECL8A3boG3uMbpKHiSHIdwI3XqHVK5kyqxCB7D2IgfCsaa1w4gerCZV1HgcXJsAB4cuvCrOv8kt6+7invg30WFCmAXaa1oPA+fQjuEX4gM2Z9RtdeAA+8shE6g4JkBm7oGPIfhNsqzALbAua+x61yDvgebIeyoKMZP5RTW67DpwB2VCZcCT0z4rEwOdRx7zSvBuqNQBoFVL1qJqcPT1ITWwgL3JuoEUgYIou7Dm8u4qZXlTzi+iwohlYkqlLjgvD5ZxRjCKBEPOXf7IbK2rM/IAsEnqP/SZROL8CYMLiPB02UM8lfOSj1hgEKFIby8HFnFacIw7ToJuWnQpyh3GG/dLQNDGE171TQz4lxGaJ3HEEadMq+YErpIzYGV1/GSrw8n26iZuVohUYIYP0B7UNEOxjziN/iDPJ/PonVXL9qlxiAuOLNcJkuZTw2MB9Dy9TeEp5II3wJHobRC+CIfexiPwf4HmvWSC98wSsjGZYQnVDIxE2OeR5/ZWCaYrVSIHoOMQRrghxAEENwCr6zoNP8DIOhonk/Mv14AAAAASUVORK5CYII='},
//     {name:'量化套利賬戶',price:0,ico:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAA4WlDQ1BzUkdCAAAYlWNgYDzNAARMDgwMuXklRUHuTgoRkVEKDEggMbm4gAE3YGRg+HYNRDIwXNYNLGHlx6MWG+AsAloIpD8AsUg6mM3IAmInQdgSIHZ5SUEJkK0DYicXFIHYQBcz8BSFBDkD2T5AtkI6EjsJiZ2SWpwMZOcA2fEIv+XPZ2Cw+MLAwDwRIZY0jYFhezsDg8QdhJjKQgYG/lYGhm2XEWKf/cH+ZRQ7VJJaUQIS8dN3ZChILEoESzODAjQtjYHh03IGBt5IBgbhCwwMXNEQd4ABazEwoEkMJ0IAAHLYNoSjH0ezAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAED0lEQVRogdWaPXAbRRTHf293LVnCjoJnXDCD3UAXdVAlZEYu4wkzVAwlFamgS0lHZbpQUVLhcRUmTKgYpwAqp8MVGYbBTFKBv4R0p/tYCunkkyVLd6uTLH7V3e5q9/923+29eyuhAKxFeEaZDpoIjcJgEDTSb+QTo4mICXlJxGsE8iHRtGPL5CZjRD+nwjFLGJYcuwn5A28aY3Ib0Bd+QmVghqflDB+fVl5DcgmwB1QLF36ZVVryLq2szTMJsXto1lkFjLOwPPjEnHGaZTXUpAb2N8qscZN5iQcoo1jjpj2kNKnp2BWwB1Q5p1qcMgcmuNSVBiyE+IQxRox0IXtIaWHEA5xTtU8pj6oaMsDuoXnF6uxV5aTEit1DXy4eXoEb1Ga6Tbqikd5OOMCAAfaAKuXJO9M1YuyTQdfui7V76IXy+6uoULH2wkMuZrs8R/EedXw2nX6rEb6nktwq6M3+jdFPeeH4bCPsA88JuO3UR2oVuiuw7hxN5kfY6F/H069C4kLLUwsD6PAAn318PhlZ36aG5SPgW2AHw1PnsZa7ky69QO11544SYmoEvABA+JMS7wzUt6mheAx8TZndqccDaPC3Ksx9AmoIp/37NrWB66LFA/xASdEZfrvlxmcT4RGKLQxvYfkSxWMCbuNRn4l4AI0xqCnD5Avxn2I46nW8i8cmMd/1duydwsUDRGhDhHYywaOOUEN4OCA+QXGK7d9163zuIDwcaFfiA4fRu6yijVPo0OEBwhcACI0h8QCGXQLe7F0nu80GljvOgi/jo9zcJ6aeCvdqI9soTinzuVP/WdGImwGGHSJOgCOW+GWovk0Nw62BslHtCsAQYXOHz4YjzJjZVdwj5qtLpesO+jJICR0MSONRR3Ojfz+jmR6JITLEhDD56/9KFN8Q8zMAwjbwdjHqMuARG/SU+cmYI5b5DICOY3DmPnaoKE2fYL02IkJFA/+6dThzj0CJYAkJrluLA6EIcfc94BGw4hiVCnUCHgFg5/gMtGl3h6eXMv+RNaft1E+FBppTDL8SskGUMmZSuQsN/hEh7gu2T6iy8j/ISnTxZIsmpLMS92kTpeLHRaZxkSftGyCCTfxqoWnSEiFObod83u7P+SwgD4ZI7nKcLhr+FmhwtpCuFGF5L/XN3WPIABFiNP/OR1UO3uA87ToJI7/GZAuPZvaDtpnTpCW36IyqGn/EtAhba5OWvO9wxJRgDynxitW5nxlEWDo0ZXt8rJbtmNWi+IkaYQE5pGyENDgb5fOXyZSRECGWuxzP/LmIsDRpyRYnWcSD218NFM+oUlRCGLrC27S5T1sk3xY+zZ89FC9Y4i8quL74QgI8AhfhCYU8mH1jfqebqozQAwmzCEuIJSZEE/GSiI/xXUWn+Q8G3jyF0rOVUgAAAABJRU5ErkJggg=='},
//     {name:'期權賬戶',price:0,},
// ]

// 日期切换
const onChangeSize = async (pageSize:number,index:number) => {
    let {current} = Store.data;
    if(current == index) return;
    Store.data.current = index;
    const res = await $api.getLossstatistics(pageSize,0);
    if(res['code'] == 200){
        setEchartOption(res.data)
    }
}
// 格式化K线数据
const splitData = (rawData: any[]) => {
  let values = [];
  let categoryData = [];
  for (let i = 0; i < rawData.length; i++) {
    categoryData.unshift(dayjs.unix(rawData[i].time).format('MM-D'))
    values.unshift(rawData[i].profit);
  }
  return {
    categoryData,
    values,
  };
}

const setEchartOption = (list:any[]) => {
  var chartDom,myChart:any;

  chartDom = document.getElementById('Lossstatistics')!;
  // 如果存在Echart，则不进行初始化
  if(!myChart){
    myChart = echarts.init(chartDom);
  }
  var data = splitData(list);
  option = {
    title: [
      {
        left: 'left',
        top: '5%',
        text: `Total Profit: ${Store.data.todayProfit} USDT`,
        textStyle:{
          color:'#5AD0B6',
          fontSize:'14px'
        }
      },
    ],
    tooltip: {
        show:true,
        trigger: 'axis',           // 触发类型，默认数据触发，见下图，可选为：'item' ¦ 'axis'
        showDelay: 20,             // 显示延迟，添加显示延迟可以避免频繁切换，单位ms
        hideDelay: 100,            // 隐藏延迟，单位ms
        transitionDuration : 0.4,  // 动画变换时间，单位s
        borderColor: '#333',       // 提示边框颜色
        borderRadius: 4,           // 提示边框圆角，单位px，默认为4
        borderWidth: 0,            // 提示边框线宽，单位px，默认为0（无边框）
        padding: 10,                // 提示内边距，单位px，默认各方向内边距为5，

    },
    xAxis: [
      {
        type: 'category',
        data:data.categoryData,
        boundaryGap: false, // 两遍留白
        axisLine: { show: true },//轴线
        axisLabel: { show: true}, // 轴刻度
        axisTick: { show:true },
      }
    ],
    yAxis: [
      {
        scale: true,
        splitNumber:5,
        min:'dataMin',  //取最小值为最小刻度
        max: 'dataMax', //取最大值为最大刻度
        axisLine: { show:false},
        splitLine: { show: true },
        axisTick: { show: false },
        axisLabel: {
          formatter: '{value}\n',
          show:true,
        },
      },
    ],
    dataZoom: [
      {
        type: 'inside',
        xAxisIndex: [0, 1],
        start: 1,
        end: 100,
      }
    ],
    grid: [
        {
          height: 150
        },
      ],
    series: [
      {
        name: 'Profit',
        type: 'line',
        data: data.values,
        smooth: true,       //变得圆滑
        showSymbol: false,   //取消圆点
        lineStyle: {width: 1}
      },
    ]
  };
  myChart.hideLoading();
  option && myChart.setOption(option);
}

let requestArr = [$api.getMoney('all'),$api.getLossstatistics(7,0)]
onMounted(()=>{
    Promise.all(requestArr)
    .then((res:any[])=>{
      console.log('数据',res);
      if(res.includes(undefined)) return;

        for (const key in res[0]) {
            Store.data.money.forEach((item:any)=>{
                if(item.key == key){
                    item.count = res[0][key],
                    item.Proportion = res[0][key] / res[0]['totalUsdt'] * 100
                }
            })
        }
        Store.data.todayProfit = res[0]['todayProfit'];
        Store.data.totalUsdt = res[0]['totalUsdt'];
        // 防止ECHARTS捕获不到DOM
        setTimeout(() => {setEchartOption(res[1].data)}, 300)
        loading.value = true;
    })
    .catch((err)=>{
      console.log(err);
    })
})

</script>

<template>
  <div class="page-main" v-if="loading" >
        <div class="title">總資產賬戶</div>
        <div class="account-card account-wrap layout" >
            <div class="account-info">
                <div class="account-item">
                    <p class="name">總資產賬戶</p>
                    <p class="txt">{{Store.data.totalUsdt}} USDT</p>
                </div>
                <div class="account-item">
                    <p class="name">今日利潤</p>
                    <p class="txt">{{ Store.data.todayProfit}} USDT</p>
                </div>
            </div>
            <van-divider />
            <div class="account-list">
                <div class="account-item" v-for="(item,index) in accountList" :key="index" @click="$router.push(item.url)">
                    <div><img :src="getAssetURL(`assetcenter/Group${index+1}.png`)" :alt="item.name" class="account-ico"></div>
                    <p class="account-txt">{{ item.name }}</p>
                </div>
            </div>
        </div>

        <div class="cus-tab-content layout" >
            <div class="tabaccount-list">
                <div class="tabaccount-item" v-for="(item,index) in Store.data.money" :key="index">
                    <div class="tabaccount-box">
                        <div>
                            <img class="tabaccount-ico" :src="item.ico" alt="ico">
                            <span class="tabaccount-name">{{item.title}}</span>
                        </div>
                        <div><span>{{item.count}} ({{item.Proportion?item.Proportion.toFixed(5):0}}%)</span></div>
                    </div>
                    <div class="tabaccount-progress">
                      <van-progress color="#2850E7" stroke-width="8" :percentage="item.Proportion ? item.Proportion:0" :show-pivot="false" />
                    </div>
                </div>
            </div>
        </div>

        <div class="Lossstatistics_wrap layout" >
            <div class="time_tab">
                <div :class="{'current':Store.data.current == 0}" @click="()=>{onChangeSize(7,0)}">7 days</div>
                <div :class="{'current':Store.data.current == 1}" @click="()=>{onChangeSize(30,1)}">30 days</div>
            </div>
            <div id="Lossstatistics" ref="EchartDom"></div>
        </div>

  </div>
</template>

<style scoped lang="less">
.flexMixin(@justify){
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-pack: justify;
    -webkit-justify-content: @justify;
    justify-content: @justify;
    -webkit-box-align: center;
    -webkit-align-items: center;
    align-items: center;
}
.page-main{
    --van-tabs-nav-background:transparent;
    --van-padding-xs:0;
    --van-tabs-line-height:20px;
    padding: 0 15px;
   .title{
    margin: 10px;
   }
   .layout{
    margin-top: 15px;
   }
   .account-card{
    border-radius: 10px;
    background: #fff;
   }
   .account-wrap{
        background: url(../../assets/assetcenter/bgimg.png) no-repeat;
        background-size: 100%;
        height: 160px;
        font-weight: 400;
        font-size: 12px;
        line-height: 150%;
        color: #fff;
        padding: 14px;
        .account-info{
            .flexMixin(space-between);
            .account-item{
                flex-basis: 50%;
            }
            .account-item:nth-child(even){
                text-align: right;
            }
            .txt{
                font-size: 17px;
                margin-top: 5px;
            }
        }
        .account-list{
            .flexMixin(space-between);
            .account-item{
                flex-basis: 18%;
                text-align: center;
                .account-ico{
                    width: 45px;
                    height: 45px;
                }
                .account-txt{
                    position: relative;
                    top: -5px;
                }
            }
        }
   }
   .cus-tab-content{
    .tabaccount-list{
        padding: 10px;
        border-radius: 10px;
        background: #fff;
        .tabaccount-head{
            .flexMixin(space-between);
            color: #b3b3b3;
            margin-bottom: 10px;
        }
        .tabaccount-item{
            margin-bottom: 10px;
            font-size: 15px;
            .tabaccount-box{
                .flexMixin(space-between);
                padding-bottom: 10px;
                .tabaccount-ico{
                    width: 25px;
                    height: 25px;
                    position: relative;
                    top: 8px;
                }
                .tabaccount-name{
                    padding-left: 8px;
                    font-size: 14px;
                }
            }
            .tabaccount-progress{
                padding-left: 18px;
            }
        }
    }
    .tabaccount-list.zc{
        padding: 15px;
        .tabaccount-item{
            --van-divider-margin:10px;
            margin: 0;
            .tabaccount-box{
                padding: 0;
                .tabaccount-price{
                    text-align: right;
                    .tabaccount-info{
                        color: #b3b3b3;
                        padding-top: 4px;
                        display: block;
                    }
                }
            }
        }
    }
   }
   .tabaccount-date{
    margin-top: 15px;
    background: #fff;
    border-radius: 15px;
    height: 150px;
    width: 100%;
   }
   .Lossstatistics_wrap{
    padding: 15px;
    background-color: #fff;
    border-radius: 10px;
    .time_tab{
        .flexMixin(flex-start);
        background: #f0f0f0;
        border-radius: 10px;
        overflow: hidden;
        color: #666;
        height: 32px;
        line-height: 32px;
        width: 70%;
        text-align: center;
        div{
            flex-basis: 50%;
        }
        .current{
            background: #2850e7;
            border-radius: 10px;
            color: #fff;
        }
    }
    #Lossstatistics{
        height: 230px;
        width: 100%;
    }
   }
}

</style>