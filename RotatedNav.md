# Idea
This create block that is on the page left and it's content is rotated 90deg. Try out at [fiddle](https://jsfiddle.net/hhharm/tqfbr7Lv/1/)

## HTML
```
    <div id="outer">
      <div id="text">
        <p>Foo</p>
        <p>Bar</p>
        <p>C</p> 
      </div>
    </div>
```

## CSS
```
    #outer {
      border: solid 1px red;
      width:600px;
      height: 600px;
      position: relative;
    }

    #text {
      background: lightBlue;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
    
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      padding: 0 10px;

      transform: translate(-100%) rotate(-90deg);
      transform-origin: right top;   
    }
```
