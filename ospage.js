
(function (f) {
    if (typeof module === "object" && typeof module.exports === "object"){
        module.exports = f;
    }
    else{
        window.ospage = f;
    }
})(function (containerId,allSize,callback,mycfg) {
    var container = document.getElementById(containerId);
    var cfg = {
        first:"首页",
        previous:"上页",
        next:"下页",
        last:"尾页",
        pageIndex:1,
        pageSize:10,
        blockCount:10
    };
    if(mycfg){
        for(var key in mycfg){
            cfg[key] = mycfg[key];
        }
    }
    var allSize = allSize;
    var oneSize = cfg.pageSize;
    var blockCount = cfg.blockCount;
    var pageCount = Math.ceil(allSize/oneSize);
    var pageIndex = cfg.pageIndex;
    if(pageIndex>pageCount||pageIndex<1){
        alert(/*猪一样的逻辑*/"真是猪一样的逻辑！"/*猪一样的逻辑*/);
        return;
    }
    var previousPageIndex = pageIndex;
    var fragment = document.createDocumentFragment();
    var firstPage = document.createElement("div"),
        previousPage = document.createElement("div");
    firstPage.innerHTML = cfg.first;
    previousPage.innerHTML = cfg.previous;
    firstPage.classList.add("blockCommon");
    firstPage.classList.add("firstPage");
    previousPage.classList.add("blockCommon");
    previousPage.classList.add("previousPage");
    fragment.appendChild(firstPage);
    fragment.appendChild(previousPage);
    var nextPage = document.createElement("div"),
        lastPage = document.createElement("div");
    nextPage.innerHTML = cfg.next;
    lastPage.innerHTML = cfg.last;
    nextPage.classList.add("blockCommon");
    nextPage.classList.add("nextPage");
    lastPage.classList.add("blockCommon");
    lastPage.classList.add("lastPage");
    var listPages = {};
    var changeStyles = addEvents = null;
    this.skip = null;
    if(pageCount<=blockCount){
        (function () {
            if(pageCount==1){
                firstPage.skip=previousPage.skip=nextPage.skip=lastPage.skip=0;
            }
            else if(pageIndex==1){
                firstPage.skip=previousPage.skip=0,nextPage.slip=2,lastPage.skip=pageCount;
            }
            else if(pageIndex == pageCount){
                firstPage.skip=1,previousPage.skip=pageCount-1,nextPage.skip=lastPage.skip=0;
            }
            else{
                firstPage.skip=1,previousPage.skip=pageIndex-1,nextPage.skip=pageIndex+1,lastPage.skip=pageCount;
            }
            for(var i=1;i<=pageCount;i++){
                listPages[i] = document.createElement("div");
                listPages[i].innerHTML = listPages[i].skip = i;
                listPages[i].classList.add("blockCommon");
                listPages[i].classList.add("listPages");
                fragment.appendChild(listPages[i]);
            }
            fragment.appendChild(nextPage),fragment.appendChild(lastPage),container.appendChild(fragment);
        }());
        changeStyles = function () {
            if(firstPage.skip==0){
                firstPage.classList.add("blockForbidden");
            }
            else{
                if(firstPage.classList.contains("blockForbidden")){
                    firstPage.classList.remove("blockForbidden");
                }
            }
            if(previousPage.skip==0){
                previousPage.classList.add("blockForbidden");
            }
            else{
                if(previousPage.classList.contains("blockForbidden")){
                    previousPage.classList.remove("blockForbidden");
                }
            }
            listPages[previousPageIndex].classList.remove("blockActive");
            listPages[pageIndex].classList.add("blockActive");
            if(nextPage.skip==0){
                nextPage.classList.add("blockForbidden");
            }
            else{
                if(nextPage.classList.contains("blockForbidden")){
                    nextPage.classList.remove("blockForbidden");
                }
            }
            if(lastPage.skip==0){
                lastPage.classList.add("blockForbidden");
            }
            else{
                if(lastPage.classList.contains("blockForbidden")){
                    lastPage.classList.remove("blockForbidden");
                }
            }
        };
        addEvents = function () {
            if(pageCount==1)
                return;
            firstPage.addEventListener("click",function () {
                if(firstPage.skip!=0){
                    previousPageIndex = pageIndex;
                    pageIndex = 1;
                    firstPage.skip= previousPage.skip=0;
                    nextPage.skip=1;
                    lastPage.skip=pageCount;
                    changeStyles();
                    callback(pageIndex,pageCount,oneSize,allSize);
                }
            });
            previousPage.addEventListener("click",function () {
                if(previousPage.skip!=0){
                    previousPageIndex = pageIndex,pageIndex -= 1;
                    if(pageIndex==1){
                        firstPage.skip=previousPage.skip=0;
                    }
                    else{
                        firstPage.skip=1;
                        previousPage.skip=pageIndex-1;
                    }
                    nextPage.skip=pageIndex+1;
                    lastPage.skip=pageCount;
                    changeStyles();
                    callback(pageIndex,pageCount,oneSize,allSize);
                }
            });
            for(var i=1;i<=pageCount;i++){
                listPages[i].addEventListener("click",function () {
                    if(this.skip!=pageIndex){
                        previousPageIndex = pageIndex;
                        pageIndex = this.skip;
                        if(pageIndex==1){
                            firstPage.skip=previousPage.skip=0;
                            nextPage.skip=pageIndex+1;
                            lastPage.skip=pageCount;
                        }
                        else if(pageIndex==pageCount){
                            firstPage.skip=1;
                            previousPage.skip=pageIndex-1;
                            nextPage.skip=lastPage.skip=0;
                        }
                        else{
                            firstPage.skip=1;
                            previousPage.skip=pageIndex-1;
                            nextPage.skip=pageIndex+1;
                            lastPage.skip=pageCount;
                        }
                        changeStyles();
                        callback(pageIndex,pageCount,oneSize,allSize);
                    }
                });
            }
            nextPage.addEventListener("click",function () {
                if(nextPage.skip!=0){
                    previousPageIndex = pageIndex;
                    pageIndex += 1;
                    if(pageIndex==pageCount){
                        nextPage.skip=lastPage.skip=0;
                    }
                    else{
                        nextPage.skip=pageIndex+1;
                        lastPage.skip=pageCount;
                    }
                    firstPage.skip=1,previousPage.skip=pageIndex-1;
                    changeStyles();
                    callback(pageIndex,pageCount,oneSize,allSize);
                }
            });
            lastPage.addEventListener("click",function () {
                if(lastPage.skip!=0){
                    previousPageIndex = pageIndex;
                    pageIndex = pageCount;
                    firstPage.skip=1;
                    previousPage.skip=pageCount-1;
                    nextPage.skip=lastPage.skip=0;
                    changeStyles();
                    callback(pageIndex,pageCount,oneSize,allSize);
                }
            });
        };
        this.skip = function (pageindex) {
            if(pageCount==1||parseInt(pageindex)>pageCount||parseInt(pageindex)<1||isNaN(parseInt(pageindex))){
                alert("错误：页数不合理！");
                return;
            }
            previousPageIndex=pageIndex,pageIndex=parseInt(pageindex);
            if(pageIndex==1){
                firstPage.skip=previousPage.skip=0;
                nextPage.slip=2;
                lastPage.skip=pageCount;
            }
            else if(pageIndex == pageCount){
                firstPage.skip=1;
                previousPage.skip=pageCount-1;
                nextPage.skip=lastPage.skip=0;
            }
            else{
                firstPage.skip=1;
                previousPage.skip=pageIndex-1;
                nextPage.skip=pageIndex+1;
                lastPage.skip=pageCount;
            }
            changeStyles();
            callback(pageIndex,pageCount,oneSize,allSize);
        };
    }
    else{
        var leftPage = document.createElement("div");
        leftPage.innerHTML = "...";
        leftPage.classList.add("blockCommon");
        leftPage.classList.add("leftPage");
        fragment.appendChild(leftPage);
        for(var i=1;i<=blockCount;i++){
            listPages[i] = document.createElement("div");
            listPages[i].classList.add("blockCommon");
            listPages[i].classList.add("listPages");
            fragment.appendChild(listPages[i]);
        }
        var rightPage = document.createElement("div");
        rightPage.innerHTML = "...";
        rightPage.classList.add("blockCommon");
        rightPage.classList.add("rightPage");
        fragment.appendChild(rightPage);
        fragment.appendChild(nextPage);
        fragment.appendChild(lastPage);
        var nMax = Math.ceil(pageCount/blockCount);
        var nPrevious = nThis = Math.ceil(pageIndex/blockCount);
        var init = function () {
            if(nThis==1){
                leftPage.skip=0;
                rightPage.skip=blockCount+1;
                nextPage.skip=pageIndex+1;
                lastPage.skip=pageCount;
                if(pageIndex==1){
                    firstPage.skip=previousPage.skip=0
                }
                else{
                    firstPage.skip=1;
                    previousPage.skip=pageIndex-1;
                }
                for(var i=1;i<=blockCount;i++){
                    listPages[i].skip=i;
                }
            }
            else if(nThis==nMax){
                firstPage.skip=1;
                previousPage.skip=pageIndex-1;
                leftPage.skip=pageCount-blockCount;
                rightPage.skip=0;
                if(pageIndex==pageCount){
                    nextPage.skip=lastPage.skip=0;
                }
                else{
                    nextPage.skip=pageIndex+1;
                    lastPage.skip=pageCount;
                }
                for(var i=1;i<=blockCount;i++){
                    listPages[i].skip=pageCount-blockCount+i;
                }
            }
            else{
                firstPage.skip=1;
                previousPage.skip=pageIndex-1;
                leftPage.skip=blockCount*(nThis-1);
                rightPage.skip = blockCount*nThis+1;
                nextPage.skip = pageIndex+1;
                lastPage.skip = pageCount;
                for(var i=1;i<=blockCount;i++){
                    listPages[i].skip=blockCount*(nThis-1)+i;
                }
            }
        };
        init();
        var changeTexts = function () {
            for(var i=1;i<=blockCount;i++){
                listPages[i].innerHTML = listPages[i].skip;
            }
        };
        changeTexts();
        container.appendChild(fragment);
        changeStyles = function () {
            if(firstPage.skip==0){
                firstPage.classList.add("blockForbidden");
            }
            else{
                if(firstPage.classList.contains("blockForbidden")){
                    firstPage.classList.remove("blockForbidden");
                }
            }
            if(previousPage.skip==0){
                previousPage.classList.add("blockForbidden");
            }
            else{
                if(previousPage.classList.contains("blockForbidden")){
                    previousPage.classList.remove("blockForbidden");
                }
            }
            if(leftPage.skip==0){
                leftPage.classList.add("blockDisplayNone");
            }
            else{
                if(leftPage.classList.contains("blockDisplayNone")){
                    leftPage.classList.remove("blockDisplayNone");
                }
            }
            if(nPrevious!=nMax){
                var r = previousPageIndex%blockCount;
                if(r!=0){
                    listPages[r].classList.remove("blockActive");
                }
                else {
                    listPages[blockCount].classList.remove("blockActive");
                }
            }
            else{
                var d= pageCount-previousPageIndex;
                if(d!=0){
                    listPages[blockCount-d].classList.remove("blockActive");
                }
                else{
                    listPages[blockCount].classList.remove("blockActive");
                }
            }
            if(nThis!=nMax){
                var r = pageIndex%blockCount;
                if(r!=0){
                    listPages[r].classList.add("blockActive");
                }
                else {
                    listPages[blockCount].classList.add("blockActive");
                }
            }
            else{
                var d= pageCount-pageIndex;
                if(d!=0){listPages[blockCount-d].classList.add("blockActive");} else{listPages[blockCount].classList.add("blockActive");}
            }
            if(rightPage.skip==0){
                rightPage.classList.add("blockDisplayNone");
            }
            else{
                if(rightPage.classList.contains("blockDisplayNone")){
                    rightPage.classList.remove("blockDisplayNone");
                }
            }
            if(nextPage.skip==0){
                nextPage.classList.add("blockForbidden");
            }
            else{
                if(nextPage.classList.contains("blockForbidden")){
                    nextPage.classList.remove("blockForbidden");
                }
            }
            if(lastPage.skip==0){
                lastPage.classList.add("blockForbidden");
            }
            else{
                if(lastPage.classList.contains("blockForbidden")){
                    lastPage.classList.remove("blockForbidden");
                }
            }
        };
        addEvents = function () {
            firstPage.addEventListener("click",function () {
                if(firstPage.skip!=0){
                    previousPageIndex = pageIndex;
                    pageIndex = 1;
                    nPrevious=nThis;
                    nThis = Math.ceil(pageIndex/blockCount);
                    firstPage.skip= previousPage.skip=leftPage.skip=0;
                    for(var i=1;i<=blockCount;i++){
                        listPages[i].skip = i;
                    }
                    rightPage.skip=blockCount+1;
                    nextPage.skip=2;
                    lastPage.skip=pageCount;
                    changeTexts();
                    changeStyles();
                    callback(pageIndex,pageCount,oneSize,allSize);
                }
            });
            previousPage.addEventListener("click",function () {
                if(this.skip!=0){
                    previousPageIndex = pageIndex;
                    pageIndex -= 1;
                    nextPage.skip=pageIndex+1;
                    lastPage.skip=pageCount;
                    if(nThis==1){
                        if(pageIndex!=1){
                            firstPage.skip=1;
                            previousPage.skip=pageIndex-1;
                        }
                        else{
                            firstPage.skip=previousPage.skip=0;
                        }
                        rightPage.skip=blockCount+1;
                    }
                    else{
                        if(pageIndex!=1){
                            firstPage.skip=1;
                            this.skip=pageIndex-1;
                        }
                        else{
                            firstPage.skip=this.skip=0;
                        }
                        if(listPages[1].skip==previousPageIndex){
                            nPrevious=nThis;
                            nThis = Math.ceil(pageIndex/blockCount);
                            if(nThis==1){
                                leftPage.skip=0;
                            }
                            else{
                                leftPage.skip=blockCount*(nThis-1);
                            }
                            for(var i=1;i<=blockCount;i++){
                                listPages[i].skip=blockCount*(nThis-1)+i;
                            }
                            rightPage.skip=blockCount*nThis+1;
                            changeTexts();
                        }
                        else{
                            if(nThis!=nMax){
                                nPrevious=nThis;
                                nThis = Math.ceil(pageIndex/blockCount);
                            }
                            else{
                                nPrevious=nThis;
                            }
                        }
                    }
                    changeStyles(),callback(pageIndex,pageCount,oneSize,allSize);
                }
            });
            leftPage.addEventListener("click",function () {
                previousPageIndex = pageIndex;
                pageIndex=leftPage.skip;
                nPrevious=nThis;
                nThis = Math.ceil(pageIndex/blockCount);
                if(pageIndex!=1){
                    firstPage.skip=1;
                    previousPage.skip=pageIndex-1;
                }
                else{
                    firstPage.skip=previousPage.skip=0;
                }
                for(var i=1;i<=blockCount;i++){
                    listPages[i].skip=blockCount*(nThis-1) + i;
                }
                if(nThis==1){
                    this.skip=0;
                }
                else{
                    this.skip=listPages[1].skip-1;
                }
                rightPage.skip = listPages[blockCount].skip +1;
                nextPage.skip=pageIndex+1;
                lastPage.skip=pageCount;
                changeTexts();changeStyles();
                callback(pageIndex,pageCount,oneSize,allSize);
            });
            for(var i=1;i<=blockCount;i++){
                listPages[i].addEventListener("click",function () {
                    if(pageIndex==this.skip) return;
                    nPrevious=nThis;
                    previousPageIndex = pageIndex;
                    pageIndex=this.skip;
                    if(pageIndex==1){
                        firstPage.skip=previousPage.skip=leftPage.skip=0;
                        rightPage.skip=listPages[blockCount].skip+1;
                        nextPage.skip=2;
                        lastPage.skip=pageCount;
                    }
                    else if(pageIndex==pageCount){
                        firstPage.skip=1;
                        previousPage.skip=pageIndex-1;
                        leftPage.skip=listPages[1].skip-1;
                        rightPage.skip=nextPage.skip=lastPage.skip=0;
                    }
                    else{
                        firstPage.skip=1;
                        previousPage.skip=pageIndex-1;
                        if(nThis==nMax){
                            leftPage.skip=listPages[1].skip-1;
                            rightPage.skip=0;
                        }
                        else if(nThis==1){
                            leftPage.skip=0;
                            rightPage.skip=listPages[blockCount].skip+1;
                        }
                        else{
                            leftPage.skip=listPages[1].skip-1;
                            rightPage.skip=listPages[blockCount].skip+1;
                        }
                        nextPage.skip=pageIndex+1;
                        lastPage.skip=pageCount;
                    }
                    changeStyles();
                    callback(pageIndex,pageCount,oneSize,allSize);
                });
            }
            rightPage.addEventListener("click",function () {
                previousPageIndex = pageIndex;
                pageIndex=rightPage.skip;
                nPrevious=nThis;
                nThis = Math.ceil(pageIndex/blockCount);
                firstPage.skip=1;
                previousPage.skip=pageIndex-1;
                if(nThis==nMax){
                    for(var i=1;i<=blockCount;i++){
                        listPages[i].skip=pageCount-blockCount + i;
                    }
                    this.skip=0;
                }
                else{
                    for(var i=1;i<=blockCount;i++){
                        listPages[i].skip=blockCount*(nThis-1) + i;
                    }
                    this.skip=listPages[blockCount].skip +1;
                }
                leftPage.skip=listPages[1].skip-1;
                if(pageIndex!=pageCount){
                    nextPage.skip = pageIndex+1;
                    lastPage.skip=pageCount;
                }
                else{
                    nextPage.skip = lastPage.skip = 0;
                }
                changeTexts();
                changeStyles();
                callback(pageIndex,pageCount,oneSize,allSize);
            });
            nextPage.addEventListener("click",function () {
                if(this.skip!=0){
                    previousPageIndex = pageIndex;
                    pageIndex += 1;
                    firstPage.skip=1;
                    previousPage.skip=pageIndex-1;
                    if(nThis==nMax){
                        nPrevious = nThis;
                        if(pageIndex==pageCount){
                            nextPage.skip=lastPage.skip=0;
                        }
                        else{
                            nextPage.skip=pageIndex+1;
                            lastPage.skip=pageCount;
                        }
                        leftPage.skip=pageCount-blockCount;
                    }
                    else{
                        if(pageIndex!=pageCount){
                            nextPage.skip = pageIndex+1;
                            lastPage.skip=pageCount;
                        }
                        else{
                            nextPage.skip = lastPage.skip = 0;
                        }
                        if(listPages[blockCount].skip==previousPageIndex){
                            nPrevious=nThis;
                            nThis = Math.ceil(pageIndex/blockCount);
                            if(nThis==nMax){
                                for(var i=1;i<=blockCount;i++){
                                    listPages[i].skip=pageCount-blockCount+i;
                                }
                                rightPage.skip=0;
                            }
                            else{
                                for(var i=1;i<=blockCount;i++){
                                    listPages[i].skip=blockCount*(nThis-1)+i;
                                }
                                rightPage.skip=blockCount*nThis+1;
                            }
                            leftPage.skip=listPages[1].skip-1;
                            changeTexts();
                        }
                        else{
                            nPrevious=nThis;
                        }
                    }
                    changeStyles();
                    callback(pageIndex,pageCount,oneSize,allSize);
                }
            });
            lastPage.addEventListener("click",function () {
                if(lastPage.skip!=0){
                    previousPageIndex = pageIndex;
                    pageIndex = pageCount;
                    nPrevious=nThis;
                    nThis = Math.ceil(pageIndex/blockCount);
                    firstPage.skip=1;
                    previousPage.skip=pageCount-1;
                    leftPage.skip=pageCount-blockCount;
                    for(var i=1;i<=blockCount;i++){
                        listPages[i].skip = pageCount-blockCount+i;
                    }
                    rightPage.skip=nextPage.skip=lastPage.skip=0;
                    changeTexts();
                    changeStyles();
                    if(nThis==nMax){
                        nPrevious=nThis;
                    }
                    callback(pageIndex,pageCount,oneSize,allSize);
                }
            });
        };
        this.skip = function (pageindex) {
            if(parseInt(pageindex)>pageCount||parseInt(pageindex)<1||isNaN(parseInt(pageindex))){
                alert("错误：页数不合理！");
                return;
            }
            previousPageIndex=pageIndex;
            pageIndex=parseInt(pageindex);
            nPrevious = nThis;
            nThis = Math.ceil(pageIndex/blockCount);
            init();
            changeTexts();
            changeStyles();
            callback(pageIndex,pageCount,oneSize,allSize);
        };
    }
    changeStyles();
    addEvents();
    callback(pageIndex,pageCount,oneSize,allSize);
});
