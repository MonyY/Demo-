// 图片预加载
(function($){
  // 构造函数
  function Preload(imgs, options){
    this.imgs = (typeof imgs === 'string') ? [imgs] : imgs ;
    this.opts = $.extend({}, Preload.DEFAULTS, options);

    if (this.opts.order === true) {
      this._order()
    } else {
      this._unoredered();
    }
  };

  // 默认参数
  Preload.DEFAULTS = {
    order: false,
    each: null, // 每张图片加载完毕后执行
    all: null // 所有图片加载完毕后执行
  };

  // 有序加载
  Preload.prototype._order = function() { 
    var imgs = this.imgs,
        opts = this.opts,
        count = 0,
        len = imgs.length;
    
    function orderLoad() {
      var imgObj = new Image()

      $(imgObj).on('load error', function() {

        opts.each && opts.each(count)

        if(count >= len) {
          // 所有图片加载完毕
          opts.all && opts.all()
        } else {
          orderLoad()
        }
        count++
      })

      imgObj.src = imgs[count]
    }
    orderLoad()
  }

  // 无序加载
  Preload.prototype._unoredered = function() { 
    var imgs = this.imgs,
        opts = this.opts,
        count = 0,
        len = imgs.length;
    $.each(imgs, function(i, src) {
      if(typeof src != 'string') return 

      var imgObj = new Image();

      $(imgObj).on('load error', function() {
        // 判断是否有参数传入
        opts.each && opts.each(count)
        
        if (count >= len -1) {
          opts.all && opts.all()
        }
        count++
      })

      imgObj.src = src
    })
  }

  $.extend({
    preload: function(imgs, opts) {
      new Preload(imgs, opts);
    }
  })

})(jQuery);