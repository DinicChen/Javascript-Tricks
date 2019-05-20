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
