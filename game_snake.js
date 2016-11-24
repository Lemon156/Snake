 /**
 *@game 贪吃蛇
 *@author lemon156
 *2016/11/22-24
 */


        //获取开始按键
        var start=document.getElementById('start');
        //获取暂停按键
        var pause=document.getElementById('pause');
        //获取分数
        var score = document.getElementById('score');
        //获取地图
        var snakeMap = document.getElementById('snakeMap');
        //设置行数
        var rowNumber = 30;
        //设置列数
        var colNumber = 30;
        //设置地图的宽,高
        snakeMap.style.width = colNumber * 20 + 'px';
        snakeMap.style.height = rowNumber * 20 + 'px';
        var arrMap = [];//记录地图中的行
        var direction = 'right';// 记录方向
        var changeDir = true ;//设置点击按键是否改变方向
        var timerDelay;//设置一个延时器
        var timerMove;//设置一个定时器
        //定义蛇的位置
        var x = 2;
        var y = 0;
        //食物的坐标
        var foodX = 0;
        var foodY = 0;
        var scoreNum = 0;//记录分数
        var pauseMove=false;//暂停游戏
        //设置地图中的单元格
        Map();
        console.log(arrMap)
        var snakeBody = [];//定义蛇身
        var level=150;//默认游戏等级为简单模式
        var gameoverFlag=false;//游戏结束标志
        var isStart=false;//游戏开始

        
        //为页面添加键盘事件
        document.onkeydown = function (e) {
            //如果 changeDir 值为 false, 则直接跳出键盘事件
            if (!changeDir){
                return;
            }
            var event = window.event||e;
            //如果蛇向右移动,而且点击左按键,则不作任何操作
            if (direction == 'right' && event.keyCode == (37||65) ) {
                return;
            } else if (direction == 'left' && event.keyCode == (39||68) ){
                return;
            }else if (direction == 'top' && event.keyCode == (40||83) ){
                return;
            }else if (direction == 'bottom' && event.keyCode == (38||87) ){
                return;
            }
            //console.log(e.keyCode);
            //alert(e.keyCode);
            //方向键控制方向
            switch (event.keyCode) {
                case 65:{
                    direction = 'left';
                    break;
                }
                case 37:{
                    direction = 'left';
                    break;
                }
                case 87:{
                    direction = 'top';
                    break;
                }
                case 38:{
                    direction = 'top';
                    break;
                }
                case 68:{
                    direction = 'right';
                    break;
                }
                case 39:{
                    direction = 'right';
                    break;
                }
                case 83:{
                    direction = 'bottom';
                    break;
                }
                case 40:{
                    direction = 'bottom';
                    break;
                }
                default:{
                    break;
                }
            }
            //为了避免快速对此点击方向按键(修改方向)
            //防止出现 bug
            changeDir = false;
            //300毫秒后,将bool 的值赋值为 true;
            timerDelay = setTimeout(function () {
                changeDir = true;
            },100)
        }

        createMenu();
        setTimeout(function(){
        	clearScreen();
        	createLemon();
        },2000);
        //添加页面点击监听器
        document.addEventListener('click',function(e){
            
            switch(e.target.id){
                case 'easy': level=150;break;
                case 'diff': level=100;break;
                case 'h_diff': level=80;break;
            }
            if (e.target.id=='start') {
                clearLightBox();
                clearInterval(timerMove);//防止多次连续点击开始按键出现bug
                createStart();
                if (!isStart) {
                    setTimeout(function(){

                        isStart=true;
                        if (!pauseMove||gameoverFlag) {//判断是否点击了暂停
                            clearSnakeBody();
                            clearScreen();
                            clearInterval(timerMove);
                            ranFood();
                            createSnakeBody();
                            snakeMove();
                            gameoverFlag=false;//游戏结束标志
                        }else{
                            clearLightBox();
                            snakeMove();
                        }
                    },1000);
                }else{
                    
                    clearLightBox();
                    snakeMove();
                }
                //判断是否点击过开始

            }if(e.target.id=='pause'){//游戏暂停
                if(!gameoverFlag){
                    pauseMove=true;
                    isStart=false;
                    clearInterval(timerMove);
                    createPause();
                }else{
                    createGameOver();
                }
            }
              
        })//游戏控制：开始、暂停



        //随机数
        function ranNum (min,max) {
            return Math.floor(Math.random() * (max - min + 1) + min);
        }
        //随机食物
        function ranFood () {
            foodX = ranNum(0,colNumber - 1);
            foodY = ranNum(0,rowNumber - 1);
            //判断食物的位置是否与蛇身重合
            if (arrMap[foodY][foodX].className == 'col activeSnake') {
                ranFood();//继续随机食物
            } else {
                //将随机出的食物设置颜色
                arrMap[foodY][foodX].className = 'col food';
            }
        }
        
        //游戏结束清除蛇身
        function clearSnakeBody(){
            for(var i=0;i<rowNumber;i++)
                for (var j = 0; j < colNumber; j++) {
                    arrMap[j][i].className='';
                    arrMap[j][i].className='col';
                }
            snakeBody.length=0;
            x=2;
            y=0;
            ranFood();
            scoreNum=0;
            score.innerHTML=0;
            //清除上一次游戏最后记录的方向，修改为默认的向右运动的方向
            direction='right';
            changeDir=true;
            //将开始按键内容修改为开始
            start.value="开始游戏";


        }

        //生成蛇身
        function createSnakeBody(){
            for (var i = 0;i < 3;i++){
                //蛇身设置颜色
                arrMap[0][i].className = 'col activeSnake';
                snakeBody[i] = arrMap[0][i];
            }
        }

        //生成地图的函数
        function Map(){
            for (var i = 0;i < rowNumber;i++) {
                //创建行
                var rowDiv = document.createElement('div');
                //给行添加 class 名
                rowDiv.className = 'row';
                //添加元素节点
                snakeMap.appendChild(rowDiv);
                var arrRow = [];//记录行中的每一个单元格
                for (var j = 0; j < colNumber;j++) {
                    var colDiv = document.createElement('div');
                    colDiv.className = 'col';
                    rowDiv.appendChild(colDiv);
                    arrRow.push(colDiv);
                }
                //往数组里添加元素
                arrMap.push(arrRow);
            }
        }

        //snakeMove蛇的移动
        function snakeMove () {
            timerMove = setInterval (function(){
                //清除延时器
                clearTimeout(timerDelay);
                //为了防止下次点击按键触发事件
                changeDir = true;
                //判断蛇移动的方向
                switch (direction) {
                    case 'right':{
                        x++;
                        break;
                    }
                    case 'left':{
                        x--;
                        break;
                    }
                    case 'top':{
                        y--;
                        break;
                    }
                    case 'bottom':{
                        y++;
                        break;
                    }
                    default:{
                        break;
                    }
                }
                //超出范围
                if (x >= colNumber||x < 0 || y >= rowNumber || y < 0){
                    //alert('game over');
                    clearInterval(timerMove);
                    createGameOver();
                    start.value="重新开始";
                    gameoverFlag=true;
                    isStart=false;
                    return;
                }
                //碰到自己
                for (var i = 0;i < snakeBody.length;i++) {
                    //将此时移动之后的蛇头位置和再次之前的所有蛇身所在的 div 比较,如果相同,则说明吃到蛇身
                    if (snakeBody[i] == arrMap[y][x]) {
                        //alert('game over');
                        //关闭蛇移动的定时器
                        clearInterval (timerMove);
                        createGameOver();
                        gameoverFlag=true;
                        //将按键内容替换为重新开始
                        start.value="重新开始";
                        isStart=false;
                        return;// 终止函数执行
                    }

                }
                //判断前方是否是食物
                if (foodX == x && foodY == y) {
                    arrMap[y][x].className = 'col activeSnake';
                    //添加蛇的长度
                    snakeBody.push(arrMap[y][x]);
                    //加分
                    scoreNum++;
                    score.innerHTML = scoreNum;
                    //随机食物
                    ranFood();
                }else {
                    //删除蛇尾
                    snakeBody[0].className = 'col';
                    snakeBody.shift();
                    //增加蛇头
                    arrMap[y][x].className = 'col activeSnake';
                    snakeBody.push(arrMap[y][x]);
                }
            },level) 
        }
        //清除除了蛇身和食物之外点亮的格子
        function clearLightBox(){
            for (var i = 0; i < arrMap.length; i++) 
                for (var j = 0; j < arrMap.length; j++) {
                    if(arrMap[i][j].className!='col activeSnake'){
                        if (arrMap[i][j].className!='col food') {
                            arrMap[i][j].className='col';
                        }else{
                            arrMap[i][j].className='col food';
                        }
                        
                    }
                };
        }

        //清屏
        function clearScreen(){
            for (var i = 0; i < arrMap.length; i++) 
                for (var j = 0; j < arrMap.length; j++) {          
                    arrMap[i][j].className='col';                    
                }
        }//全部清除
