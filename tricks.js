// inherit() 返回了一个继承自原型对象p的属性的新对象
// 这里使用ECMAScript 5中的Object.create()函数（如果存在的话）
// 如果不存在Object.create()，则退化使用其他方法
function inherit(p) {
        if (p == null) throw TypeError();       // p是一个对象，但不能是null
        if (Object.create)                      // 如果Object.create()存在
                return Object.create(p);        // 直接使用它
        var t = typeof p;                       // 否则进行进一步检测
        if (t !== "object" && t !== "function") throw TypeError();
        function f() {};                        // 定义一个空构造函数
        f.prototype = p;                        //将其原型属性设置为p
        return new f();                         //使用f()创建p的继承对象
}


/*
 * 把p中的可枚举属性复制到o中，并返回o
 * 如果o和p中含有同名属性，则覆盖o中的属性
 * 这个函数并不处理getter和setter以及复制属性
 */
function extend(o, p) {
        for (prop in p) {               // 遍历p中的所有属性
                o[prop] = p[prop];      // 将属性添加至o中
        }
        return o;
}
/*
 * 将p中的可枚举属性复制至o中，并返回o
 * 如果o和p中有同名的属性，o中的属性将不受影响
 * 这个函数并不处理getter和setter以及复制属性
 */
function merge(o, p) {
    for (prop in p) {                           // 遍历p中的所有属性
        if (o.hasOwnProperty[prop]) continue;   // 过滤掉已经在o中存在的属性
        o[prop] = p[prop];                      // 将属性添加至o中
    }
    return o;
}
/*
 * 如果o中的属性在p中没有同名属性，则从o中删除这个属性
 * 返回o
 */
function restrict(o, p) {
    for (prop in o) {                      // 遍历o中的所有属性
        if (! (prop in p)) delete o[prop]; // 如果在p中不存在，则删除之
    }
    return o;
}
/*
 * 如果o中的属性在p中存在同名属性，则从o中删除这个属性
 * 返回o
 */
function subtract(o, p) {
    for (prop in p) {      // 遍历p中的所有属性
         delete o[prop];   // 从o中删除（删除一个不存在的属性不会报错）
    }
    return o;
}
/*
 * 返回一个新对象，这个对象同时拥有o的属性和p的属性
 * 如果o和p中有重名属性，使用p中的属性值
 */
function union(o, p) { return extend(extend({},o), p);}
/*
 * 返回一个新对象，这个对象拥有同时在o和p中出现的属性
 * 很像求o和p的交集，但p中属性的值被忽略
 */
function intersection(o, p) { return restrict(extend({},o), p);}
/*
 * 返回一个数组，这个数组包含的是o中可枚举的自有属性的名字
 */
function keys(o) {
    if (typeof o !== "object") throw TypeError(); // 参数必须是对象
    var result = [];    // 将要返回的数组
    for (var prop in o) {                       // 遍历所有可枚举的属性
         if (o.hasOwnProperty(prop))            // 判断是否是自有属性
                 result.push(prop);             // 将属性名添加至数组中
    }
    return result;                              // 返回这个数组
}


/*
 * 给Object.prototype添加一个不可枚举的extend()方法
 * 这个方法继承自调用它的对象，将作为参数传入的对象的属性一一复制
 * 除了值之外，也复制属性的所有特性，除非在目标对象中存在同名的属性，
 * 参数对象的所有自有对象（包括不可枚举的属性）也会一一复制。
 * 
 */
Object.defineProperty(Object.prototype, "extend",                   // 定义 Object.prototype.extend
    {
        writable: true,
        enumerable: false,      // 将其定义为不可枚举的
        configurable: true,
        value: function(o) {    // 值就是这个函数
                // 得到所有的自有属性，包括不可枚举属性
                var names = Object.getOwnPropertyNames(o);
                // 遍历它们
                for(var i = 0; i < names.length; i++) {
                        // 如果属性已经存在，则跳过
                        if (names[i] in this) continue;
                        // 获得o中的属性的描述符
                        var desc = Object.getOwnPropertyDescriptor(o,names[i]);
                        // 用它给this创建一个属性
                        Object.defineProperty(this, names[i], desc);
                 }
         }
});


/*
 * 返回传递给它的任意对象的类
 */
function classof(o) {
    if (o === null) return "Null";
    if (o === undefined) return "Undefined";
    return Object.prototype.toString.call(o).slice(8,-1);
}


/*
 * 数组遍历
 */
for(var i = 0; i < a.length; i++) {
    if (!a[i]) continue;  // 跳过null、undefined和不存在的元素
    // 循环体
}

for(var i = 0; i < a.length; i++) {
    if (a[i] === undefined) continue; // 跳过undefined+不存在的元素
    // 循环体
}

for(var i = 0; i < a.length; i++) {
    if (!(i in a)) continue ; // 跳过不存在的元素
    // 循环体
}

for(var i in a) {
    if (!a.hasOwnProperty(i)) continue;  // 跳过继承的属性
    // 循环体
}

for(var i in a) {
    // 跳过不是非负整数的i
    if (String(Math.floor(Math.abs(Number(i)))) !== i) continue;
}


var a = [1,2,3,4,5]
var sum = a.reduce(function(x,y) { return x+y }, 0);     // 数组求和
var product = a.reduce(function(x,y) { return x*y }, 1); // 数组求积
var max = a.reduce(function(x,y) { return (x>y)?x:y; }); // 求最大值


/* 
 * 计算任意数目对象的并集
 */
var objects = [{x:1,a:1}, {y:2,a:2}, {z:3,a:3}];
var leftunion = objects.reduce(union);       // {x:1, y:2, z:3, a:1}
var rightunion = objects.reduceRight(union); // {x:1, y:2, z:3, a:3}


// 在数组中查找所有出现的x，并返回一个包含匹配索引的数组
function findall(a, x) {
    var results = [],            // 将会返回的数组
        len = a.length,          // 待搜索数组的长度
        pos = 0;                 // 开始搜索的位置
    while(pos < len) {           // 循环搜索多个元素...
        pos = a.indexOf(x, pos); // 搜索
        if (pos === -1) break;   // 未找到，就完成搜索
        results.push(pos);       // 否则，在数组中存储索引
        pos = pos + 1;           // 并从下一个位置开始搜索
    }
    return results;              // 返回包含索引的数组
}


/*
 * 判断一个对象是否为数组
 */
// ECMAScript5
Array.isArray()
// ECMAScript3
var isArray = Function.isArray || function(o) {
    return typeof o === "object" &&
    Object.prototype.toString.call(o) === "[object Array]";
};



// 判定o是否是一个类数组对象
// 字符串和函数有length属性，但是它们 
// 可以用typeof检测将其排除。在客户端JavaScript中，DOM文本节点
// 也有length属性，需要用额外判断o.nodeType != 3将其排除
function isArrayLike(o) {
    if (o &&                                    // o非null、undefined等
        typeof o === "object" &&                // o是对象
        isFinite(o.length) &&                   // o.length是有限数值
        o.length >= 0 &&                        // o.length为非负值
        o.length===Math.floor(o.length) &&      // o.length是整数
        o.length < 4294967296)                  // o.length < 2^32
        return true;                            // o是类数组对象
    else
        return false;                           // 否则它不是
}



//定义并调用一个函数来确定当前脚本运行时是否为严格模式
var strict = (function() { return !this; }());


// 闭包实现的计数器
function counter() {
    var n = 0;
    return {
        count: function() { return n++; },
        reset: function() { n = 0; }
    };
}
var c = counter(), d = counter();       // 创建两个计数器
c.count()                               // => 0
d.count()                               // => 0: 它们互不干扰
c.reset()                               // reset() 和 count() 方法共享状态
c.count()                               // => 0: 因为我们重置了c
d.count()                               // => 1: 而没有重置d


// 这个函数使用arguments.callee，因此它不能在严格模式下工作
function check(args) {
    var actual = args.length;           //实参的真实个数
    var expected = args.callee.length;  //期望的实参个数
    if (actual !== expected)            //如果不同则抛出异常
        throw Error("Expected " + expected + "args; got " + actual);
}
function f(x, y, z) {
    check(arguments);   // 检查实参个数和期望的实参个数是否一致
    return x + y + z;   // 再执行函数的后续逻辑
}

// monkey-patching
// 将对象o中名为m()的方法替换为另一个方法
// 可以在调用原始的方法之前和之后记录日志消息
function trace(o, m) {
    var original = o[m];        //在闭包中保存原始方法
    o[m] = function() {         // 定义新的方法
        console.log(new Date(), "Entering:", m);        //输出日志消息
        var result = original.apply(this, arguments);   // 调用原始函数
        console.log(new Date(), "Exiting:", m);         //输出日志消息
        return result;                                  // 返回结果
    };
}


// 返回一个函数，通过调用它来调用o中的方法f()，传递它所有的实参
function bind(f, o) {
    if (f.bind) return f.bind(o);       // 如果bind()方法存在的话，使用bind()方法
    else return function() {            //否则，这样绑定
        return f.apply(o, arguments);
    };
}

// ECMAScript 3版本的Function.bind（）方法
if (!Function.prototype.bind) {
    Function.prototype.bind = function(o /*, args */) {
        // 将this和arguments的值保存至变量中
        // 以便在后面嵌套的函数中可以使用它们
        var self = this, boundArgs = arguments;
        // bind()方法的返回值是一个函数
        return function() {
                // 创建一个实参列表，将传入bind()的第二个及后续的实参都传入这个函数
                var args = [], i;
                for(i = 1; i < boundArgs.length; i++) args.push(boundArgs[i]);
                for(i = 0; i < arguments.length; i++) args.push(arguments[i]);
                // 现在将self作为o的方法来调用，传入这些实参
                return self.apply(o, args);
         };
    };
}

// 检测一个对象是否是真正的函数对象，而非可调用对象（callable object）
function isFunction(x) {
    return Object.prototype.toString.call(x) === "[object Function]";
}


// 一种取得 Global 对象的方法是使用以下代码： 
var global = function(){ 
    return this;  
}(); 



// 要找到数组中的最大或最小值，可以像下面这样使用 apply()方法。 
var values = [1, 2, 3, 4, 5, 6, 7, 8]; 
var max = Math.max.apply(Math, values); 



// 确定属性到底是存在于对象中，还是存在于原型中，如下所示。 
function hasPrototypeProperty(object, name){ 
    return !object.hasOwnProperty(name) && (name in object); 
} 


// 跨浏览器取得窗口左边和上边的位置。
var leftPos = (typeof window.screenLeft == "number") ? window.screenLeft : window.screenX;
var topPos = (typeof window.screenTop == "number") ? window.screenTop : window.screenY;


// 取得页面视口的大小
var pageWidth = window.innerWidth, pageHeight = window.innerHeight;

if (typeof pageWidth != "number"){
	if (document.compatMode == "CSS1Compat"){
		pageWidth = document.documentElement.clientWidth;
		pageHeight = document.documentElement.clientHeight;
	} else {
		pageWidth = document.body.clientWidth;
		pageHeight = document.body.clientHeight;
	}
}


// 解析查询字符串,然后返回包含所有参数的一个对象
function getQueryStringArgs(){
	//取得查询字符串并去掉开头的问号
	var qs = (location.search.length > 0 ? location.search.substring(1) : ""),

	//保存数据的对象
	args = {}, 

	//取得每一项
	items = qs.length ? qs.split("&") : [],
	item = null,
	name = null,
	value = null,

	//在 for 循环中使用
	i = 0,
	len = items.length;

	//逐个将每一项添加到 args 对象中
	for (i = 0; i < len; i++){
		item = items[i].split("=");
		name = decodeURIComponent(item[0]);
		value = decodeURIComponent(item[1]);

		if (name.length) {
			args[name] = value;
		}
	}

	return args;
}

// 在浏览器环境下测试任何对象的某个特性是否存在
//作者：Peter Michaux 
function isHostMethod(object, property) { 
  var t = typeof object[property]; 
  return t=='function' || (!!(t=='object' && object[property])) || t=='unknown'; 
} 



// 用户代理检测

var client = function(){

    //rendering engines
    var engine = {            
        ie: 0,
        gecko: 0,
        webkit: 0,
        khtml: 0,
        opera: 0,

        //complete version
        ver: null  
    };
    
    //browsers
    var browser = {
        
        //browsers
        ie: 0,
        firefox: 0,
        safari: 0,
        konq: 0,
        opera: 0,
        chrome: 0,

        //specific version
        ver: null
    };

    
    //platform/device/OS
    var system = {
        win: false,
        mac: false,
        x11: false,
        
        //mobile devices
        iphone: false,
        ipod: false,
        ipad: false,
        ios: false,
        android: false,
        nokiaN: false,
        winMobile: false,
        
        //game systems
        wii: false,
        ps: false 
    };    

    //detect rendering engines/browsers
    var ua = navigator.userAgent;    
    if (window.opera){
        engine.ver = browser.ver = window.opera.version();
        engine.opera = browser.opera = parseFloat(engine.ver);
    } else if (/AppleWebKit\/(\S+)/.test(ua)){
        engine.ver = RegExp["$1"];
        engine.webkit = parseFloat(engine.ver);
        
        //figure out if it's Chrome or Safari
        if (/Chrome\/(\S+)/.test(ua)){
            browser.ver = RegExp["$1"];
            browser.chrome = parseFloat(browser.ver);
        } else if (/Version\/(\S+)/.test(ua)){
            browser.ver = RegExp["$1"];
            browser.safari = parseFloat(browser.ver);
        } else {
            //approximate version
            var safariVersion = 1;
            if (engine.webkit < 100){
                safariVersion = 1;
            } else if (engine.webkit < 312){
                safariVersion = 1.2;
            } else if (engine.webkit < 412){
                safariVersion = 1.3;
            } else {
                safariVersion = 2;
            }   
            
            browser.safari = browser.ver = safariVersion;        
        }
    } else if (/KHTML\/(\S+)/.test(ua) || /Konqueror\/([^;]+)/.test(ua)){
        engine.ver = browser.ver = RegExp["$1"];
        engine.khtml = browser.konq = parseFloat(engine.ver);
    } else if (/rv:([^\)]+)\) Gecko\/\d{8}/.test(ua)){    
        engine.ver = RegExp["$1"];
        engine.gecko = parseFloat(engine.ver);
        
        //determine if it's Firefox
        if (/Firefox\/(\S+)/.test(ua)){
            browser.ver = RegExp["$1"];
            browser.firefox = parseFloat(browser.ver);
        }
    } else if (/MSIE ([^;]+)/.test(ua)){    
        engine.ver = browser.ver = RegExp["$1"];
        engine.ie = browser.ie = parseFloat(engine.ver);
    }
    
    //detect browsers
    browser.ie = engine.ie;
    browser.opera = engine.opera;
    

    //detect platform
    var p = navigator.platform;
    system.win = p.indexOf("Win") == 0;
    system.mac = p.indexOf("Mac") == 0;
    system.x11 = (p == "X11") || (p.indexOf("Linux") == 0);

    //detect windows operating systems
    if (system.win){
        if (/Win(?:dows )?([^do]{2})\s?(\d+\.\d+)?/.test(ua)){
            if (RegExp["$1"] == "NT"){
                switch(RegExp["$2"]){
                    case "5.0":
                        system.win = "2000";
                        break;
                    case "5.1":
                        system.win = "XP";
                        break;
                    case "6.0":
                        system.win = "Vista";
                        break;
                    case "6.1":
                        system.win = "7";
                        break;
                    default:
                        system.win = "NT";
                        break;                
                }                            
            } else if (RegExp["$1"] == "9x"){
                system.win = "ME";
            } else {
                system.win = RegExp["$1"];
            }
        }
    }
    
    //mobile devices
    system.iphone = ua.indexOf("iPhone") > -1;
    system.ipod = ua.indexOf("iPod") > -1;
    system.ipad = ua.indexOf("iPad") > -1;
    system.nokiaN = ua.indexOf("NokiaN") > -1;
    
    //windows mobile
    if (system.win == "CE"){
        system.winMobile = system.win;
    } else if (system.win == "Ph"){
        if(/Windows Phone OS (\d+.\d+)/.test(ua)){;
            system.win = "Phone";
            system.winMobile = parseFloat(RegExp["$1"]);
        }
    }
    
    
    //determine iOS version
    if (system.mac && ua.indexOf("Mobile") > -1){
        if (/CPU (?:iPhone )?OS (\d+_\d+)/.test(ua)){
            system.ios = parseFloat(RegExp.$1.replace("_", "."));
        } else {
            system.ios = 2;  //can't really detect - so guess
        }
    }
    
    //determine Android version
    if (/Android (\d+\.\d+)/.test(ua)){
        system.android = parseFloat(RegExp.$1);
    }
    
    //gaming systems
    system.wii = ua.indexOf("Wii") > -1;
    system.ps = /playstation/i.test(ua);
    
    //return it
    return {
        engine:     engine,
        browser:    browser,
        system:     system        
    };

}();


// 将 NodeList 对象转换为数组
function convertToArray(nodes){
	var array = null;
	try {
		array = Array.prototype.slice.call(nodes, 0); //针对非 IE 浏览器
	} catch (ex) {
		array = new Array();
		for (var i = 0, len = nodes.length; i < len; i++){
			array.push(nodes[i]);
		}
	}
	return array;
}


//动态加载外部脚本
function loadScript(url){
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = url;
    document.body.appendChild(script);
}


//通用的contains函数,某个节点是不是另一个节点的后代
function contains(refNode, otherNode){ 
    if (typeof refNode.contains == "function" && (!client.engine.webkit || client.engine.webkit >= 522)){
        return refNode.contains(otherNode);
    } else if (typeof refNode.compareDocumentPosition == "function"){
        return !!(refNode.compareDocumentPosition(otherNode) & 16);
    } else {
        var node = otherNode.parentNode;
        do {
            if (node === refNode){
                return true;
            } else {
                node = node.parentNode;
            }
        } while (node !== null);
        return false;
    }
}



function classof(o) {
    if (o === null) return "Null";
    if (o === undefined) return "Undefined";
    return Object.prototype.toString.call(o).slice(8, -1);
}


//压缩稀疏数组
var dense = sparse.filter(function() { return true; });


var a = [1, 2, 3, 4, 5]
var sum = a.reduce(function(x,y) { return x+y }, 0); // 数组求和
var product = a.reduce(function(x,y) { return x*y }, 1); // 数组求积
var max = a.reduce(function(x,y) { return (x>y)?x:y; }); // 求最大值


//判定是否为数组
var isArray = Function.isArray || function(o) {
        return typeof o === "object" &&
        Object.prototype.toString.call(o) === "[object Array]";
    };


// 判定o是否是一个类数组对象
// 字符串和函数有length属性，但是它们
// 可以用typeof检测将其排除。在客户端JavaScript中，DOM文本节点
// 也有length属性，需要用额外判断o.nodeType != 3将其排除
function isArrayLike(o) {
    if (o && // o非null、undefined等
        typeof o === "object" && // o是对象
        isFinite(o.length) && // o.length是有限数值
o.length >= 0 && // o.length为非负值
        o.length === Math.floor(o.length) && // o.length是整数
        o.length < 4294967296) // o.length < 2^32
        return true; // o是类数组对象
    else
        return false; // 否则它不是
}


//定义并调用一个函数来确定当前脚本运行时是否为严格模式
var strict = (function() { return !this; } ());





// 这个函数给对象o增加了属性存取器方法
// 方法名称为get<name>和set<name>。如果提供了一个判定函数
// setter方法就会用它来检测参数的合法性，然后在存储它
// 如果判定函数返回false，setter方法抛出一个异常
//
// 这个函数有一个非同寻常之处，就是getter和setter函数
// 所操作的属性值并没有存储在对象o中
// 相反，这个值仅仅是保存在函数中的局部变量中
// getter和setter方法同样是局部函数，因此可以访问这个局部变量
// 也就是说，对于两个存取器方法来说这个变量是私有的
// 没有办法绕过存取器方法来设置或修改这个值
function addPrivateProperty(o, name, predicate) {
    var value; // 这是一个属性值

    // getter方法简单地将其返回
    o["get" + name] = function() { return value; };

    // setter方法首先检查值是否合法，若不合法就抛出异常
    // 否则就将其存储起来
    o["set" + name] = function(v) {
        if (predicate && !predicate(v))
            throw Error("set" + name + ": invalid value " + v);
        else
            value = v;
    };
}

// 下面的代码展示了addPrivateProperty()方法
var o = {}; // 设置一个空对象
// 增加属性存取器方法getName()和setName()

// 确保只允许字符串值
addPrivateProperty(o, "Name", function(x) { return typeof x == "string"; });
o.setName("Frank"); // 设置属性值
console.log(o.getName()); // 得到属性值
o.setName(0); // 试图设置一个错误类型的值
