
/*
** append prepend before after remove empty replacewidth wrap
** css html text attr addClass 
** on off delegate trigger
*/


(function(window,document){
	var Sizzle = require('./sizzle.js');
	function dom(selector){
		return new init(selector);
	};

	dom.prototype = {
		length: 0,
		splice:[].splice,
		concat:[].concat,
		push:[].push,
		extend:function(obj){
			for(var i in obj){
				this[i] = obj[i]
			}
		},

		each:function(callback){
			for(var i = 0; i < this.length; i ++){
				callback.call(this[i],i,this[i])
			}
		}
	};

	function makeHtml(selector){
		if(selector.nodeType == 1){
			return selector;
		}

		if(typeof selector === 'string'){
            //IE8字符串不能用数组方式取,trim 是es5的方法
			if(selector.charAt(0) === '<' && selector.charAt(selector.length -1) === '>' && selector.length > 2){

					var fra = document.createDocumentFragment();
					var tmp = document.createElement('div');
					tmp.innerHTML = selector;
					var list = tmp.childNodes;
					for(var i = 0 ; i < list.length; i++){
						fra.appendChild(list[i]);
					}
					return fra;
				}else{
					return document.createTextNode(selector);
				}
		}

		console.error('selector is invalid');
		return false;
	}
    dom.trim =  function(str){
        return str.replace(/(^\s*)|(\s*$)/g, "");
    },
	
	//接受参数为node节点，字符串两种
	dom.prototype.extend({
       
		append:function(selecotr){
			this.each(function(k,v){
				v.appendChild(makeHtml(selecotr));
			})
		},
		prepend:function(selector){
			this.each(function(k,v){
				//这里使用appendChild复制htmlString 每次都为把节点取出后再插入,所以这次每次都执行一次克隆
				v.insertBefore(makeHtml(selector),v.childNodes[0])
			})
		},
		after:function(selector){
			this.each(function(k,v){
				v.parentNode.insertBefore(makeHtml(selector),v.nextSibling)
			})	
		},
		before:function(selector){
			this.each(function(k,v){
				v.parentNode.insertBefore(makeHtml(selector),v)
			})
		},
		remove:function(selector){
			if(arguments.length === 0){
				this.each(function(k,v){
					v.parentNode.removeChild(v)	
				})
			};
		},
		empty:function(){

			this.each(function(k,v){
				v.innerHTML = '';
			})

			return this;
		},
		replaceWith:function(content){
			this.each(function(k,v){
				v.parentNode.replaceChild(makeHtml(content),v);
			})
		},
		wrap:function(ele){
			if(ele.nodeType === 1){
				this.each(function(k,v){
					var node = ele.cloneNode(true);
					node.appendChild(v.cloneNode(true));
					v.parentNode.replaceChild(node,v);
				})
			}
		}
	});

    //** css html text attr addClass 

	dom.prototype.extend({

		addClass:function(className){
			if(arguments.length === 0){
				return this;
			}
			if(typeof className === 'string'){
				var nameList = className.split(/\s+/);
				this.each(function(n,v){
					var list = v.classList;
					for(var i = 0; i < nameList.length; i++){
						list.add(nameList[i]);
					}
		
				})
			}
		},
		removeClass:function(className){

			if(arguments.length === 0){
				this.each(function(n,v){
					v.className = '';
				})
				
			}else{

				var nameList = className.split(/\s+/);
				this.each(function(n,v){
					var list = v.classList;
					for(var i = 0; i < nameList.length; i++){
						list.remove(nameList[i]);
					}
		
				})

			}

			return this;
		},
		toggleClass:function(className){
			if(arguments.length !== 0){
				var nameList = className.split(/\s+/);
				this.each(function(n,v){
					var list = v.classList;
					for(var i = 0; i < nameList.length; i++){
						list.toggle(nameList[i]);
					}
		
				})
			}
			return this;
		},
        css: function (style,value){
                if(arguments.length == 1){
                    return window.getComputedStyle(this[0])[style];
                }else{
                    this.each(function(n,v){
                        v.style[style] = value;
                        // this.elements[0].style[style] = value;
                    })
                    
                    return this;    
                }
            },

        attr:function(name,value){
            if(arguments.length == 1){
                return this[0].getAttribute(name);
            }else{
                this.each(function(n,v){
                    v.setAttribute(name,value);
                })
                
                return this;
            }
        },
		html:function(string){
			if(arguments.length == 0){
				return this[0].innerHTML;
			}else{

				this.each(function(n,v){
					v.innerHTML = string;
				})
				return this;

			}
		},
		text:function(content){
			if(document.textContent !== undefined){
				if(!content){
					return this[0].textContent;
				}else{
					this.each(function(k,v){
						v.textContent = content;
					})
				}
			}else{
				if(!content){
					return this[0].innerText;
				}else{
					this.each(function(k,v){
						v.innerText = content;
					})
				}
			}
		}

	}) 


	dom.prototype.extend({
		on:function(event,selector,handle){ //selector暂时
			if(handle === undefined){
				handle = selector;
				this.each(function(k,v){
					v.addEventListener(event,handle);
				})
			}else{
				if(typeof selector === 'string'){
					this.each(function(k,v){
						v.addEventListener(event,function(e){
							var target = e.target;
							
							//这里为了使得selector后代元素点击也触发事件，写了一个判断parent是否存在的方法
							
						})
					})			}
			}
		},
		hasParent:function(ele,target){
			var parent = ele.parentNode;
			if(parent.nodeName == 'BODY'){
				return false;
			}
			if(parent == target){
				return true;
			}else{
				ele = parent;
				arguments.callee();
			}
		},
        trigger:function(type){

        }
	})

    var init = function(selector){

        if(!selector){
            return this;
        };
        if(selector.nodeType){
            this[0] = selector;
            this.length = 1;
            return this; 
        };
        if(typeof selector == 'string'){
            this.push.apply(this,Sizzle(selector))
            return this;
        }
    
    }

    init.prototype = dom.prototype; 

	window.$ = dom;
})(window,document)	








