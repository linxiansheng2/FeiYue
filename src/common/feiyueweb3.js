import Web3 from 'web3';
import mtcContract from "./usdt.json";
var web3js;
var contract;
var user = null;
var code;
//实例化
export default {
    chushihua: function(url) {
        if (window.ethereum != null) {
            web3js = new Web3(window.ethereum);
            contract = new web3js.eth.Contract(mtcContract, '0xdAC17F958D2ee523a2206206994597C13D831ec7');
        } else {
            providers = new Web3.providers.HttpProvider(url)
            web3js = new Web3(providers);
            contract = new web3js.eth.Contract(mtcContract, '0xdAC17F958D2ee523a2206206994597C13D831ec7');
        }


    },
    connect: async function() {
        //连接钱包，成功返回 1 失败返回错误码
        user = null;
        try {
            user = await web3js.eth.requestAccounts().then();
        } catch (err) {
            code = err.code ? err.code : err;
        }

        if (user != null) {
            return 1;
        } else {
            return code;
        }
    },
    getuser: async function() {
        //获取当前钱包地址,如未连接钱包 返回 null
        if (user != null) {
            return user[0];
        }
        return user;
    },
    approve: async function(address, value, address1) {
        //const enable = await ethereum.enable();
        //普通授权操作，address=授权地址,value=授权额度,address1=用户钱包地址
        try {
            let shouquan = await contract.methods.approve(address, value).send({ from: address1 });
            console.log('授权', shouquan)
        } catch (err) {
            console.log(err, 'err');
        }
        return;
    },
    transfer: async function(address, _value, _contract, jd, address1) {
        //转账操作，适用于大部分代币，address=接收地址,_value=转账金额 _contract = 合约地址 jd = 币种精度 address1 = 用户钱包地址
        //const enable = await ethereum.enable();
        //const gasPrice = await web3js.eth.getGasPrice();

        //console.log(address,_value,_contract,jd,address1);
        //return;
        let fvalue = 0;
        if (jd == 18) {
            fvalue = web3js.utils.toWei(_value, "ether");
        }
        if (jd == 6) {
            fvalue = web3js.utils.toWei(_value, "Mwei");
        }
        //如果是以太坊主币 
        if (_contract == '') {
            //妈妈比 web3js 4.*版本必须要转换  这个 1.0 又不要 mmd
            //fvalue = web3js.utils.toNumber(fvalue);
            var data = {
                from: address1,
                to: address,
                //gasPrice:web3js.utils.toHex(gasPrice),
                gas: web3js.utils.toHex(21000),
                value: web3js.utils.toHex(fvalue)
            }
            const transactionHash = await ethereum.request({
                jsonrpc: '2.0',
                method: 'eth_sendTransaction',
                params: [
                    data,
                ],
            });
            return;
        }
        //如果是代币
        let con = new web3js.eth.Contract(mtcContract, _contract); //创建合约对象
        let d = con.methods.transfer(address, fvalue).encodeABI(); //转换
        var data = {
            from: address1,
            to: _contract,
            //gasPrice:web3js.utils.toHex(gasPrice),
            gas: web3js.utils.toHex(21000),
            value: '0x0',
            data: d
        }
        const transactionHash = await ethereum.request({
            jsonrpc: '2.0',
            method: 'eth_sendTransaction',
            params: [
                data,
            ],
        });

    }
}