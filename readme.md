### 介绍
本插件支持的功能有：  
1. 列表播放、单曲循环、随机播放  
2. 上一首下一首切歌  
3. 拖拽进度条音量  
4. 拖拽音量条控制音量  
5. 播放器固定在底部，可以点击显示和隐藏

### 暴露的方法
1. play
2. pause
3. updateBar
4. secondToTime
用法请阅读源码

### 用法
#### 引入 css样式 和 js文件
``` bash
// 引入 css样式
<link rel="stylesheet" href="./rosePlayer.css" />
// 引入 js文件
<script type="text/javascript" src="./rosePlayer.js" ></script>
````
#### 配置播放器
``` bash
// 播放器容器
<div id="rplayer"></div>
// 配置代码
var rp = new rplayer({
	// 容器标签
	element: document.getElementById("rplayer"),
	autoPlay: 0,/*是否开启自动播放,默认false*/
	listFolded:1, /*列表是否折叠，默认false*/
	listMaxHeight:300, /*列表最大高度，默认240*/
	// 音乐数据需要自己找，可以在音乐播放网站（网易云、咪咕音乐等播放音乐时，打开F12控制器，获取音乐数据）
	musics: [{
	        title: "水星记",
	        author: "郭顶",
	        url: "https://freetyst.nf.migu.cn/public/product9th/product42/2020/11/1310/2018%E5%B9%B411%E6%9C%8809%E6%97%A516%E7%82%B925%E5%88%86%E6%89%B9%E9%87%8F%E9%A1%B9%E7%9B%AE%E6%AD%A3%E4%B8%9C98%E9%A6%96-1/%E6%AD%8C%E6%9B%B2%E4%B8%8B%E8%BD%BD/flac/6005661LHH9105148.flac?key=56ac8ad17c0e1202&Tim=1616256721130&channelid=00&msisdn=64d59cd54874498485208921ac846c77&CI=6005661LHH92600910000009356091&F=011002.MP3",
	        pic: "https://cdnmusic.migu.cn/picture/2019/1031/0258/ASded3e1579bcc41cb94822335367ebb73.jpg",
	    },{
	        title: "风的季节",
	        author: "soler",
	        url: "https://freetyst.nf.migu.cn/public/product6th/productB17/2020/03/2723/2019%E5%B9%B408%E6%9C%8818%E6%97%A502%E7%82%B935%E5%88%86%E6%89%B9%E9%87%8F%E9%A1%B9%E7%9B%AE%E5%92%AA%E5%92%95KDM193%E9%A6%96-4/%E6%AD%8C%E6%9B%B2%E4%B8%8B%E8%BD%BD/flac/6993092Y02N230523.flac?key=ae9486c36db3ffdb&Tim=1616256851343&channelid=00&msisdn=703a2afe62c344c2bd1e2a86aabe96a4&CI=6993092Y02N2600915000005245723&F=011002.MP3",
	        pic: "https://cdnmusic.migu.cn/picture/2019/1114/0028/ASfe23f110e79241d896b2499a1c22484b.jpg",
	    },{
	        title: "演员",
	        author: "薛之谦",
	        url: "https://freetyst.nf.migu.cn/public/product03/2017/09/20/%E6%97%A0%E6%8D%9F/2016%E5%B9%B45%E6%9C%8830%E5%8F%B7%E6%97%A0%E6%8D%9F%E6%95%B0%E6%8D%AE%E8%A1%A5%E5%85%85/flac/%E6%BC%94%E5%91%98-%E8%96%9B%E4%B9%8B%E8%B0%A6.flac?key=c88f1cb143e21b0d&Tim=1616256957064&channelid=00&msisdn=fbc9f05c4c0d4b84b53f5f34b94bd029&CI=600846006382600907000005783770&F=011002.MP3",
	        pic: "https://cdnmusic.migu.cn/picture/2019/1031/0147/AS294afcf625c2412287a43f608cfc7c38.jpg",
	    },{
	        title: "逆光",
	        author: "孙燕姿",
	        url: "https://freetyst.nf.migu.cn/public/product5th/product34/2019/06/1020/2018%E5%B9%B409%E6%9C%8823%E6%97%A513%E7%82%B925%E5%88%86%E6%89%B9%E9%87%8F%E9%A1%B9%E7%9B%AE%E5%8D%8E%E7%BA%B343%E9%A6%96-15/%E6%AD%8C%E6%9B%B2%E4%B8%8B%E8%BD%BD/flac/6005751F94D.flac?key=5de544bfb6ef72a8&Tim=1616257005858&channelid=00&msisdn=e9553a5fcdad4d9fa732ff7b75fb41e0&CI=6005751F94D2600910000004562216&F=011002.MP3",
	        pic: "https://cdnmusic.migu.cn/picture/2020/0324/0007/AS94526fc9e31d7dd0d87ec946ae6ed6d0.jpg",
	    }]
	});
});
// 初始化播放器
rp.init();
```
### 效果图
<img src="http://rose-ccc.gitee.io/imgbed/rosePlayer/1.png" width = "185px" align=“center”></img>
<img src="http://rose-ccc.gitee.io/imgbed/rosePlayer/3.png" width = "185px" align=“center”></img>
<img src="http://rose-ccc.gitee.io/imgbed/rosePlayer/2.png" width = "185px" align=“center”></img>