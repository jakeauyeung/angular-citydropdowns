基于angularjs的城市连选指令
===============



使用方法：
```
var app = angular.module('app', ['ngCityDropdowns']);
```

必须存在：
```
$scope.citySelectSelected = {}; 
```

```
<div city-dropdown-select="citySelectOptions"
    dropdown-model="citySelectSelected"
    dropdown-item-label="name"
    dropdown-item-count="deal_count"
    dropdown-onchange="cityrefrechResult(selected)" >
</div>
```

![联选](http://jakeauyeung.qiniudn.com/angular-citydropdowns.png)
