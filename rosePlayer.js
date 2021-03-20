function rplayer(e) {
	var a = {
		autoPlay: !1, // 自动播放
		listFolded: !1, // 折叠音乐列表
		listMaxHeight: 240 //列表高度，若未设置，默认为240px
	};

	this.option = e
}
rplayer.prototype.init = function() {
	var p = this,
		y, cur_m = 0,
		random_cur_m = 0,
		m = "",
		musicListHtml = "", // 音乐列表html
		ht = "", // 播放器外轮廓html
		playType = 0,
		curPlayType = 0,
		playTypes = ["r-icon-retweet", "r-icon-retweet-one", "r-icon-random", "r-icon-reorder-list"],
		playList = [], //音乐列表序号
		playListRandom = [];
	this.element = this.option.element;
	this.musics = this.option.musics;

	// 添加样式类 rplayer-fixed
	this.element.classList.add("rplayer-fixed");
	// 生成音乐列表代码 包括音乐名和作者 每个列表标签添加index属性
	for (var i = 0; i < this.musics.length; i++) {
		playList.push(i);
		i == 0 ? musicListHtml += '<li class="playing" index="' + i + '">' + this.musics[i].title + "&nbsp; - &nbsp;" + this
			.musics[i].author + "</li>" : musicListHtml += '<li index="' + i + '">' + this.musics[i].title + "&nbsp; - &nbsp;" +
			this.musics[i].author + "</li>"
	}
	// 渲染音乐图片、曲名，作者
	ht += '<div class="rplayer">' +
		'	<div class="rplayer-content">' +
		'		<div class="rplayer-pic">' +
		'			<img src="' + this.musics[0].pic + '">' +
		'		</div>' +
		'		<div class="rplayer-info">' +
		'			<div class="rplayer-music">' +
		'			    <div class="rplayer-music-text">' +
		'				  <span class="rplayer-title">' + this.musics[0].title + '</span>' +
		'				  <span class="rplayer-author"> - ' + this.musics[0].author + '</span>' +
		'			    </div>' +
		'				<i class="rplayer-list-btn r-icon r-icon-reorder">' +
		'				</i>' +
		'			</div>';

	// 进度条渲染
	ht += '			<div class="rplayer-controller">' +
		'				<div class="rplayer-bar-wrap">' +
		'					<div class="rplayer-bar">' +
		'						<div class="rplayer-loaded" style="width: 0"></div>' +
		'						<div class="rplayer-played" style="width: 0">' +
		'							<span class="rplayer-thumb"></span>' +
		'						</div>' +
		'					</div>' +
		'				</div>' +
		'				<div class="rplayer-time">' +
		'					<span class="rplayer-ptime">00:00</span>/<span class="rplayer-dtime">00:00</span>' +
		'					<div class="rplayer-menu-bars">' +
		'						<i class="r-icon r-icon-backward"></i>' +
		'						<i class="r-icon r-icon-play"></i>' +
		'						<i class="r-icon r-icon-pause display-none"></i>' +
		'						<i class="r-icon r-icon-forward"></i>' +
		'					</div>' +
		'					<div class="rplayer-menu-volume">';
	// 获取cookie，具体请求音量大小
	var volumeCoocie = getCookie("rplayer-volume");
	// 音量大小，若没有设置，则为80%，否则为设置的值
	var volInit = volumeCoocie == "" ? "80%" : volumeCoocie * 100 + "%";
	// 音量图表，原始为高音量logo，若音量大于80%，也为高logo，若小于80%大于0，为低logo，若为0，贼为禁音logo
	var volIcon = volumeCoocie == "" ? "r-icon-volume-up" : (volumeCoocie >= 0.8 ? "r-icon-volume-up" : (volumeCoocie ==
		0 ? "r-icon-volume-off" : "r-icon-volume-down"))
	// 渲染音量图表和进度
	ht += '<i class="volume-icon r-icon ' + volIcon +
		'"></i><div class="rplayer-volume-bar"><div class="rplayer-volume-played" style="width:' + volInit +
		'"><span class="rplayer-volume-thumb"></span></div></div>';

	// 渲染播放顺序logo
	ht += '<i class="player-type-icon r-icon r-icon-retweet"></i>' +
		'					</div>' +
		'				</div>' +
		'			</div>' +
		'		</div>' +
		'	</div>';
	// 渲染弹出和弹入按钮
	ht +=
		'<div class="ss-btn"><i class="r-icon r-icon-chevron-left display-none"></i><i class="r-icon r-icon-chevron-right"></i></div>'
	// 若开启默认折叠，设置列表高度为0（listFolded和listMaxHeight需要同时使用）
	// 否则列表高度为listMaxHeight，若未设置，默认为240px
	ht += this.option.listFolded ? '<ol style="max-height:0px;" class="rplayer-list">' + musicListHtml + '</ol>' :
		'<ol style="max-height:' + this.option.listMaxHeight + 'px;" class="rplayer-list">' + musicListHtml + '</ol>';
	ht += '</div>';

	// 将代码渲染到element的标签里
	this.element.innerHTML = ht;

	this.audio = document.createElement("audio");
	this.audio.src = this.musics[0].url;
	this.audio.loop = 0; // 是否循环播放
	this.audio.preload = "metadata";
	this.audio.volume = volumeCoocie == "" ? 0.8 : volumeCoocie; // 音量
	// 以下的 p 指向外部的this
	// 监听 duration 的变化（duration表示媒体的总秒数）,即切换歌曲
	this.audio.addEventListener("durationchange", function() {
		// 我觉得这没必要，删除了 1 !== p.audio.duration &&
		// 将 音乐时长格式化为 xx:xx, secondToTime函数为格式话函数
		p.element.getElementsByClassName("rplayer-dtime")[0].innerHTML = p.secondToTime(p.audio.duration)
	})
	// 监听下载情况
	this.audio.addEventListener("loadedmetadata", function() {
		p.loadedTime = setInterval(function() {
			// buffered 表示已下载缓存的时间范围
			// buffered 为 TimeRanges对象，有end(index)函数 - 获得某个已缓冲范围的结束位置
			// e 表示已经缓存的内容与总时长的比，若为1，表示全部缓存完成
			var e = p.audio.buffered.end(p.audio.buffered.length - 1) / p.audio.duration;
			// updateBar函数 用于改变样式，此处为改变loadedBar（即类名为rplayer-loaded标签）的宽度
			p.updateBar.call(p, "loaded", e, "width");
			// 若缓存完成，删除定时器
			1 === e && clearInterval(p.loadedTime);
		}, 500)
	})
	// 音乐已经播放完毕且停止了
	this.audio.addEventListener("ended", function() {
		// playType类型：
		// 0 循环播放
		// 1 单曲循环
		// 2 随机播放
		// 3 列表播放
		if (playType == 0) {
			// 判断当前播放完的歌曲是否为最后一首
			// 若是，则返回第一首，否则下一首
			cur_m = ((cur_m + 1) == p.musics.length) ? 0 : cur_m + 1;
			// 播放下一首
			playSwitch(cur_m);
		} else if (playType == 1) {
			// 重复播放这一首
			playSwitch(cur_m);
		} else if (playType == 2) {
			// 若上次播放类型非随机播放
			if (curPlayType != playType) {
				// 遍历当前播放音乐是随机播放列表的第几首
				for (var i = 0; i < playListRandom.length; i++) {
					if (cur_m == playListRandom[i]) {
						random_cur_m = i + 1;
						cur_m = playListRandom[random_cur_m];
						break;
					}
				}
			} else {
				random_cur_m = ((random_cur_m + 1) == p.musics.length) ? 0 : random_cur_m + 1;
				cur_m = playListRandom[random_cur_m];
			}
			// 播放下一首
			playSwitch(cur_m);
		} else if (playType == 3) {
			// 列表播放 若非最后一首，播放下一首
			// 否则 停止播放
			if (cur_m != (p.musics.length - 1)) {
				cur_m = ((cur_m + 1) == p.musics.length) ? 0 : cur_m + 1;
				playSwitch(cur_m);
			} else {
				// 隐藏暂停按钮
				p.PauseButton.classList.add("display-none");
				// 显示播放按钮
				p.PlayButton.classList.remove("display-none");
				// 播放音乐
				p.audio.pause();
				// 清除播放定时器
				clearInterval(this.playedTime)
			}
		}
		// 将播放类型 赋值给 当前播放类型
		curPlayType = playType;
	})
	// 监听播放失败
	this.audio.addEventListener("error", function() {
		// 更改音乐标题和音乐时长
		p.element.getElementsByClassName("rplayer-author")[0].innerHTML = " - 加载失败 ╥﹏╥";
		p.element.getElementsByClassName("rplayer-dtime")[0].innerHTML = "00:00";
		// 隐藏暂停键，显示播放键
		p.PauseButton.classList.add("display-none");
		p.PlayButton.classList.remove("display-none")
	})
	// 获取 播放 和 暂停 键
	this.PlayButton = this.element.getElementsByClassName("r-icon-play")[0];
	this.PauseButton = this.element.getElementsByClassName("r-icon-pause")[0];
	// 获取 音量、播放类型 图标
	this.volumeIcon = this.element.getElementsByClassName("volume-icon")[0];
	this.playTypeIcon = this.element.getElementsByClassName("player-type-icon")[0];
	// 获取 隐藏播放界面、展示播放界面（fixed时才有） 按钮标签
	this.hidePlayerButton = this.element.getElementsByClassName("r-icon-chevron-left")[0];
	this.showPlayerButton = this.element.getElementsByClassName("r-icon-chevron-right")[0];
	// 获取 歌词列表的子标签
	this.musicList = this.element.getElementsByClassName("rplayer-list")[0].getElementsByTagName("li");
	// 获取 进度条、加载条、进度条控制球、完整进度条 标签
	this.playedBar = this.element.getElementsByClassName("rplayer-played")[0];
	this.loadedBar = this.element.getElementsByClassName("rplayer-loaded")[0];
	this.thumb = this.element.getElementsByClassName("rplayer-thumb")[0];
	this.bar = this.element.getElementsByClassName("rplayer-bar")[0];
	// 获取 音量控制球、完整音量进度条、当前音量进度条 标签
	this.volumeThumb = this.element.getElementsByClassName("rplayer-volume-thumb")[0];
	this.volumeBar = this.element.getElementsByClassName("rplayer-volume-bar")[0];
	this.volumePlayedBar = this.element.getElementsByClassName("rplayer-volume-played")[0];
	// 获取 歌曲列表显示按钮、歌曲列表 标签
	this.listButton = this.element.getElementsByClassName("rplayer-list-btn")[0];
	this.playerList = this.element.getElementsByClassName("rplayer-list")[0];
	// 获取 上一首歌曲、下一首歌曲 按钮标签
	this.bw = p.element.getElementsByClassName("rplayer-menu-bars")[0].getElementsByClassName("r-icon-backward")[0];
	this.fw = p.element.getElementsByClassName("rplayer-menu-bars")[0].getElementsByClassName("r-icon-forward")[0];
	// 为每条歌曲添加点击事件
	for (var i = 0; i < this.musicList.length; i++) {
		this.musicList[i].addEventListener("click", function() {
			// 点击后，更新当前播放曲目序列号
			cur_m = parseInt(this.getAttribute("index"));
			// 若为随机播放模式，更新序号为随机播放列表的序列
			if (playType == 2) {
				for (var i = 0; i < playListRandom.length; i++) {
					if (cur_m == playListRandom[i]) {
						random_cur_m = i;
					}
				}
			}
			// 播放该音乐
			playSwitch(cur_m);
			// 当前播放模式为设定模式
			curPlayType = playType;
		})
	}
	// 点击播放按钮，添加播放事件
	this.PlayButton.addEventListener("click", function() {
		p.play.call(p)
	})
	// 点击暂停按钮，添加暂停事件
	this.PauseButton.addEventListener("click", function() {
		p.pause.call(p)
	})

	// 为音量logo添加点击事件
	this.volumeIcon.addEventListener("click", function() {
		// 若当前媒体为禁音
		if (p.audio.muted) {
			p.audio.muted = !1
			p.volumeIcon.className = 0.8 <= p.audio.volume ? "volume-icon r-icon r-icon-volume-up" :
				"volume-icon r-icon r-icon-volume-down"
			p.updateBar.call(p, "volumePlayed", p.audio.volume, "width")
		} else {
			p.audio.muted = !0
			p.volumeIcon.className = "volume-icon r-icon r-icon-volume-off"
			p.updateBar.call(p, "volumePlayed", 0, "width")
		}
	})
	// 为隐藏按钮添加点击事件
	this.hidePlayerButton.addEventListener("click", function() {
		p.element.getElementsByClassName("rplayer")[0].style.transform = "translateX(-355px)";
		p.hidePlayerButton.classList.add("display-none");
		p.showPlayerButton.classList.remove("display-none")
	})
	this.showPlayerButton.addEventListener("click", function() {
		p.element.getElementsByClassName("rplayer")[0].style.transform = "translateX(0)";
		p.showPlayerButton.classList.add("display-none");
		p.hidePlayerButton.classList.remove("display-none")
	})

	// 为播放类型logo添加点击事件
	this.playTypeIcon.addEventListener("click", function() {
		// 移除当前样式
		p.playTypeIcon.classList.remove(playTypes[playType]);
		// 更改播放类型和logo样式
		playType = (playType + 1) % 4;
		p.playTypeIcon.classList.add(playTypes[playType]);
		// 若播放类型为随机播放,更新随机播放歌曲列表
		if (playType == 2) {
			playListRandom = shuffle(playList);
		}
	})
	// 给进度条添加点击事件
	this.bar.addEventListener("click", function(e) {
		clearInterval(p.playedTime)
		var a = e || window.event;
		// 获取进度条总宽度
		y = p.bar.clientWidth;
		// 获取点击的点与总进度条的比
		// 这样写一样
		// var i = (a.clientX - p.bar.getBoundingClientRect().x) / y
		var i = (a.clientX - t(p.bar)) / y;
		// 更新进度条
		p.updateBar.call(p, "played", i, "width");
		// 更新时间
		p.element.getElementsByClassName("rplayer-ptime")[0].innerHTML = p.secondToTime(i * p.audio.duration);
		// 将播放时间切换到当前点击时间
		p.audio.currentTime = parseFloat(p.playedBar.style.width) / 100 * p.audio.duration;
		// 播放音乐
		p.play();
	})
	// 监听点击进度球事件
	this.thumb.addEventListener("mousedown", function() {
		// 进度条总宽度
		y = p.bar.clientWidth;
		// 停止时间、进度条、歌词更新
		clearInterval(p.playedTime);
		// 监听鼠标移动事件，更改相应样式、歌词、时间
		document.addEventListener("mousemove", e);
		// 监听鼠标抬起事件，移除监听事件
		document.addEventListener("mouseup", a)
	})
	// 音量进度球 添加鼠标按下
	this.volumeThumb.addEventListener("mousedown", function() {
		// 获取音量进度条总长度
		y = p.volumeBar.clientWidth;
		// 监听鼠标移动事件
		document.addEventListener("mousemove", voe);
		// 监听鼠标抬起事件，取消监听事件
		document.addEventListener("mouseup", voa)
	})
	// 为进度条添加点击事件
	this.volumeBar.addEventListener("click", function(e) {
		var a = e || window.event;
		y = p.volumeBar.clientWidth;
		i = (a.clientX - t(p.volumeBar)) / y; // 音量进度条与总进度条的比
		// 根据比例，更改样式
		if (i >= 0.8) {
			p.volumeIcon.className = "volume-icon r-icon r-icon-volume-up"
		} else {
			if (i == 0) {
				p.volumeIcon.className = "volume-icon r-icon r-icon-volume-off"
			} else {
				p.volumeIcon.className = "volume-icon r-icon r-icon-volume-down"
			}
		}
		// 设置音量为 i
		p.audio.volume = i;
		// 更新音量进度条
		p.updateBar.call(p, "volumePlayed", i, "width");
	})
	// 为列表logo添加点击事件
	this.listButton.addEventListener("click", function(e) {
		// 判断此时是否为展示列表，进行列表样式的变化
		(p.playerList.style.maxHeight == "" || p.playerList.style.maxHeight == "0px") ? p.playerList.style.maxHeight = p.option
			.listMaxHeight + "px": p.playerList.style.maxHeight = "0px"
	})
	// 为上一首、下一首按钮添加点击事件
	this.bw.addEventListener("click", function() {
		pn(1);
	})
	this.fw.addEventListener("click", function() {
		pn(2);
	})
	// 若自动播放，则播放音乐
	if (this.option.autoPlay) {
		this.play()
	}

	// 获取点击的点与总进度条的比
	function e(e) {
		var a = e || window.event,
			i = (a.clientX - t(p.bar)) / y; // 获取点击的点与总进度条的比
		mvb(i)
	}

	// 移除监听事件
	function a() {
		document.removeEventListener("mouseup", a);
		document.removeEventListener("mousemove", e);
		// 根据进度条的长度与总长度的比，更新时间
		p.audio.currentTime = parseFloat(p.playedBar.style.width) / 100 * p.audio.duration;
	}

	// 更新进度条、歌词、时间
	function mvb(i) {
		i = i > 0 ? i : 0;
		i = 1 > i ? i : 1;
		// 更新进度条
		p.updateBar.call(p, "played", i, "width");

		// 更新时间
		p.element.getElementsByClassName("rplayer-ptime")[0].innerHTML = p.secondToTime(i * p.audio.duration)
	}

	// 获取进度条与页面左边的距离
	function t(e) {
		// 防止页面过长导致进度条位置获取错误，最后减去滚动距离
		let a = document.body.scrollLeft + document.documentElement.scrollLeft
		// 循环获取进度条与父节点左边的距离
		for (var t = e.offsetLeft, i = e.offsetParent; null !== i;) {
			t += i.offsetLeft
			i = i.offsetParent
		}
		return t - a
	}

	function i(e) {
		for (var a, t = e.offsetTop, i = e.offsetParent; null !== i;) {
			t += i.offsetTop,
				i = i.offsetParent
		}
		return a = document.body.scrollTop + document.documentElement.scrollTop,
			t - a
	}

	function voe(e) {
		var a = e || window.event,
			i = (a.clientX - t(p.volumeBar)) / y; // 音量进度条与总长度的比
		i = i > 0 ? i : 0;
		i = 1 > i ? i : 1;
		// 若为禁音，设置为非禁音
		if (p.audio.muted) {
			p.audio.muted = !1;
		}
		// 设置音量为 i
		p.audio.volume = i;
		// 更新音量进度条
		p.updateBar.call(p, "volumePlayed", i, "width");
		// 若音量大于 0.8，更改音量logo样式
		if (i >= 0.8) {
			p.volumeIcon.classList.remove("r-icon-volume-down", "r-icon-volume-off");
			p.volumeIcon.classList.add("r-icon-volume-up")
		} else {
			if (i == 0) {
				// 若音量为0，更改音量logo样式
				p.volumeIcon.classList.remove("r-icon-volume-down", "r-icon-volume-up");
				p.volumeIcon.classList.add("r-icon-volume-off")
			} else {
				// 若音量为大于0、小于0.8，更改音量logo样式
				p.volumeIcon.classList.remove("r-icon-volume-off", "r-icon-volume-up");
				p.volumeIcon.classList.add("r-icon-volume-down")
			}
		}
		// 缓存音量大小 365天后过期
		setCookie("rplayer-volume", i, 365);
	}

	// 取消监听事件
	function voa() {
		document.removeEventListener("mousemove", voe);
	}
	// 歌词格式化函数，原始的格式如下：
	// "[00:00.00] 作曲 : 薛之谦[00:01.00] 作词 : 薛之谦"
	function l(e) {
		if (e) {
			// 歌词格式化为数组，每一个元素包括一个时间，一句歌词
			// 循环这个数组
			for (var t = (e = e.replace(/([^\]^\n])\[/g, function(e, t) {
					return t + "\n["
				})).split("\n"), n = [], i = t.length, a = 0; a < i; a++) {
				// 匹配歌词数组中的时间，并将时间赋值给 r
				var r = t[a].match(/\[(\d{2}):(\d{2})(\.(\d{2,3}))?]/g),
					// 将歌词中的时间去除，并将歌词赋值给 o (获取的歌词的时间格式可能不一样，所以用了三种匹配方式来去除)
					o = t[a].replace(/.*\[(\d{2}):(\d{2})(\.(\d{2,3}))?]/g, "").replace(/<(\d{2}):(\d{2})(\.(\d{2,3}))?>/g, "").replace(
						/^\s+|\s+$/g, "");
				// 若匹配到时间，进行时间数据提取
				if (r) {
					// 这里删除了我认为不必要的循环
					// 分组查询的正则表达式特征，带有括号，所得值为数组
					// 所以这里 u[0] 表示选取的字符串，
					// u[1] 表示第一个分组 00 (\d{2})
					// u[2] 表示第二个分组 00 (\d{2})
					// u[3] 表示第三个分组 .00 (\d{2,3}))
					// u[4] 表示第四个分组,即第三个分组的子分组 00 \d{2,3})
					// parseInt(u[4]) / (2 === (u[4] + "").length ? 100 : 1e3 若毫秒数为两位数，则除100，否则1000（1e3表示10的三次方）
					var u = /\[(\d{2}):(\d{2})(\.(\d{2,3}))?]/.exec(r[0]),
						c = 60 * u[1] + parseInt(u[2]) + (u[4] ? parseInt(u[4]) / (2 === (u[4] + "").length ? 100 : 1e3) : 0);
					// c表示时间，o表示歌词
					n.push([c, o])
				}

			}
			return n
		}
		return [
			[0, "暂无歌词，请您欣赏"]
		]
	}

	function setCookie(cname, cvalue, exdays) {
		var d = new Date();
		d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
		var expires = "expires=" + d.toGMTString();
		document.cookie = cname + "=" + cvalue + "; " + expires;
	}

	function getCookie(cname) {
		var name = cname + "=";
		var ca = document.cookie.split(';');
		for (var i = 0; i < ca.length; i++) {
			var c = ca[i].trim(); //trim() 方法用于删除字符串的头尾空白符
			if (c.indexOf(name) == 0) {
				return c.substring(name.length, c.length);
			}
		}
		return "";
	}

	function getRandomInt(min, max) {
		// floor 退一法
		// random 一定小于1 所以后面要加1
		return Math.floor(Math.random() * (max - min + 1) + min)
	}

	// 生成随机播放歌曲列表
	function shuffle(arr) {
		for (var i = 0; i < arr.length; i++) {
			// 获取一个随机数,交换两个位置的index
			var j = getRandomInt(0, i)
			var t = arr[i]
			arr[i] = arr[j]
			arr[j] = t
		}
		return arr
	}

	function playSwitch(i) {
		// 参数 i 是播放歌曲的 index
		p.PlayButton.classList.add("display-none"); // 取消播放按钮
		p.PauseButton.classList.remove("display-none"); // 显示暂停按钮
		// 渲染歌曲图片、歌名、作者
		p.element.getElementsByClassName("rplayer-pic")[0].getElementsByTagName("img")[0].src = p.musics[i].pic;
		p.element.getElementsByClassName("rplayer-title")[0].innerHTML = p.musics[i].title;
		p.element.getElementsByClassName("rplayer-author")[0].innerHTML = " - " + p.musics[i].author;
		// 移除原先的歌曲列表高亮
		p.element.getElementsByClassName("rplayer-list")[0].getElementsByClassName("playing")[0].classList.remove("playing");
		// 将歌曲列表第一首设为高亮
		p.element.getElementsByClassName("rplayer-list")[0].getElementsByTagName("li")[i].classList.add("playing");
		// 停止缓存
		clearInterval(p.loadedTime);
		// 清楚上次播放循环
		clearInterval(p.playedTime);
		// 获取音乐资源
		p.audio.src = p.musics[i].url;
		// 播放音乐
		p.audio.play();
		p.playedTime = setInterval(() => {
			// 更新进度条
			p.updateBar.call(p, "played", p.audio.currentTime / p.audio.duration, "width")
			// 更新时间
			p.element.getElementsByClassName("rplayer-ptime")[0].innerHTML = p.secondToTime(p.audio.currentTime)
		}, 100)
	}
	// 切换歌曲
	function pn(e) {
		// 若播放类型为随机播放
		if (playType == 2) {
			// 若上次播放类型非随机播放类型
			if (curPlayType != playType) {
				// 遍历当前播放的歌曲为随机列表中的第几首
				for (var i = 0; i < playListRandom.length; i++) {
					if (cur_m == playListRandom[i]) {
						random_cur_m = i + 1;
						cur_m = playListRandom[i + 1];
						break;
					}
				}
				curPlayType = playType;
			} else {
				// 若上次播放类型为随机播放类型
				// 若为播放上一首首，且当前为第一首，则播放随机列表的最后一首
				// 若为播放下一首首，且当前为最后一首，则播放随机列表的第一首
				random_cur_m = (e == 1 ? ((random_cur_m == 0) ? p.musics.length - 1 : random_cur_m - 1) : ((random_cur_m == (p.musics
					.length - 1)) ? 0 : random_cur_m + 1));
				// 更新当前播放歌曲
				cur_m = playListRandom[random_cur_m];
			}
		} else {
			// 若为顺序播放
			// 若为播放上一首首，且当前为第一首，则播放随机列表的最后一首
			// 若为播放下一首首，且当前为最后一首，则播放随机列表的第一首
			cur_m = (e == 1 ? ((cur_m == 0) ? p.musics.length - 1 : cur_m - 1) : ((cur_m == (p.musics.length - 1)) ? 0 : cur_m +
				1));
		}
		curPlayType = playType;
		// 切换播放歌曲
		playSwitch(cur_m)
	}
}
// 播放音乐 更新歌词、进度条、时间
// 用于点击播放按钮播放音乐，点击进度条播放音乐
rplayer.prototype.play = function() {
	this.PlayButton.classList.add("display-none"); // 隐藏播放按钮
	this.PauseButton.classList.remove("display-none"); // 显示暂停功能
	this.audio.play(); // 播放音乐
	var e = this;
	this.playedTime = setInterval(function() {
		// 更新进度条
		e.updateBar.call(e, "played", e.audio.currentTime / e.audio.duration, "width");
		// 更新时间
		e.element.getElementsByClassName("rplayer-ptime")[0].innerHTML = e.secondToTime(e.audio.currentTime)
	}, 100)
}
// 暂停音乐
rplayer.prototype.pause = function() {
	this.PauseButton.classList.add("display-none");
	this.PlayButton.classList.remove("display-none");
	this.audio.pause();
	clearInterval(this.playedTime)
}
// 更新进度条
rplayer.prototype.updateBar = function(e, a, t) {
	a = a >= 0 ? a : 0
	a = 1 >= a ? a : 1
	this[e + "Bar"].style[t] = 100 * a + "%"
}
rplayer.prototype.secondToTime = function(e) {
	var a = function(e) {
			return 10 > e ? "0" + e : "" + e
		},
		t = parseInt(e / 60),
		i = parseInt(e - 60 * t);
	return a(t) + ":" + a(i)
}
