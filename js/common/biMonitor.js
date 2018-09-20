
/**
 * Created: zhangfs by Atom
 * Date: 2018/05/23 15:03
 * Func:
 */
scriptVersionCtrl();
function scriptVersionCtrl () {
		var jsCtrl = ['service', APP.html];
		for ( var jsfile of jsCtrl ) {
				var script = document.createElement("script");
				if (jsfile == 'service') {
						script.src = '../js/common/service.js?v=' + version;
				} else {
						script.src = '../js/' + jsfile + '/' + jsfile + '.js?v=' + version;
				}
				$('script:last').after(script);
		}
}



/**
 * Create: zhangfs by Atom
 * Func:  解决页面加载时出现的无样式闪现问题 - 副作用,延缓了页面载入
 */
showBody();
function showBody() {
    $('body').css('visibility', 'visible');
}



/**
 * Created: zhanggg by Atom
 * Date: 2018/05/23 15:03
 * Func: 数据采集工具 BiMonitor 的生成
 */
var maAddress = "http://bi.shouqiev.com/";
//var maAddress = "http://10.18.105.112:8090/";

var sessionAdminId = sessionStorage.adminId;
var _maq = _maq || [];
//_maq.push(['_pageMessage', 'BI统计系统']);
_maq.push(['_loginInfo', sessionAdminId]);

(function() {
  var wa = document.createElement("script");
  wa.src = maAddress+"BiMonitor/js/logMonitor.js";
  var s = document.getElementsByTagName("script")[0];
  s.parentNode.insertBefore(wa, s);
})();
